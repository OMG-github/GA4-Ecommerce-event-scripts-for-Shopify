//Initialize GTM tag
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer', 'GTM-XXXXXX');

analytics.subscribe("checkout_completed", (event) => {
  const checkout = event.data?.checkout;
  try {
    // Retrieve transaction ID and currency
    const transactionId = checkout?.order?.id;
    const currency = checkout?.currencyCode;

    // Check for missing essential fields
    if (!transactionId) {
      throw new Error('Missing transaction ID');
    }
    if (!currency) {
      throw new Error('Missing currency');
    }

    // Validate value
    const value = checkout?.totalPrice?.amount;
    if (isNaN(parseFloat(value))) {
      throw new Error('Invalid value');
    }

    // Create discounts and items arrays
    const allDiscounts = checkout?.discountApplications?.map((discount) => discount?.title) || [];
    const allItems = checkout?.lineItems?.map((item) => {
      return {
        item_id: item?.variant?.product?.id,
        item_name: item?.title,
        currency: item?.variant?.price?.currencyCode,
        item_brand: item?.variant?.product?.vendor,
        item_category: item?.variant?.product?.type,
        item_variant: item?.variant?.id,
        quantity: item?.quantity,
        price: item?.variant?.price?.amount
      };
    }) || [];

    // Validate item_id and item_name
    allItems.forEach(item => {
      if (!item?.item_id) {
        throw new Error('Missing item_id');
      }
      if (!item?.item_name) {
        throw new Error('Missing item_name');
      }
    });

    // Construct the ecommerce data object
    const ecommerceData = {
      event: "purchase",
      ecommerce: {
        transaction_id: transactionId,
        value: value,
        shipping: checkout?.shippingLine?.price?.amount,
        currency: currency,
        coupon: allDiscounts,
        email: checkout?.email,
        phone: checkout?.phone,
        tax: checkout?.totalTax?.amount,
        items: allItems
      }
    };

    // Push the ecommerce data to the dataLayer
    window.dataLayer.push(ecommerceData);

  } catch (error) {
    console.error('DataLayer Push Error:', error);

    // Extract unique token from the URL in case of error
    const urlPath = window.location.pathname;
    const regex = /\/cn\/([^\/]+)/;
    const match = urlPath.match(regex);
    const urlToken = match ? match[1] : null;

    // Log the URL path and the parsed URL token to check if it's parsed correctly
    console.log('URL Path:', urlPath);
    console.log('Parsed URL Token:', urlToken);

    // Construct error event with necessary tracking data
    const minimalTransactionId = checkout?.totalPrice?.amount || urlToken || `txn_${Math.floor(Math.random() * 1e12)}`;
    const errorEventData = {
      event: 'purchase_error',
      error_message: error.message,
      error_stack: error.stack,
      ecommerce: {
        transaction_id: minimalTransactionId,
        value: checkout?.totalPrice?.amount || 0.99,
        currency: checkout?.currencyCode,
        items: checkout?.lineItems?.map((item) => {
          return {
            item_id: item?.variant?.product?.id || 'unknown',
            item_name: item?.title || 'unknown'
          };
        }) || []
      }
    };

    // Push the error event data to the dataLayer
    window.dataLayer.push(errorEventData);
  }
});
