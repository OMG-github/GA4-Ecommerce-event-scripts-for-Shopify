//Initialize GTM tag
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer', 'GTM-XXXXXX');

//subscribe to events

//Order Complete/Purchase
analytics.subscribe("checkout_completed", (event) => {

  const checkout = event.data?.checkout;
  
  const allDiscounts = checkout?.discountApplications?.map((discount) => {
    return discount.title;
  });

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
  });
  
  window.dataLayer.push({
    event: "purchase",
    ecommerce: {
      transaction_id: checkout?.order?.id,
      value: checkout?.totalPrice?.amount,
      shipping: checkout?.shippingLine?.price?.amount,
      currency: checkout?.currencyCode,
      coupon: allDiscounts,
      email: checkout?.email,
      phone: checkout?.phone,
      tax: checkout?.totalTax?.amount,
      items: allItems
    }
  });
});

// Collection viewed
analytics.subscribe("collection_viewed", (event) => {

    const collection = event.data?.collection;

    const allItems = collection?.productVariants?.map((item) => {
        return {
          item_id: item?.id,
          item_name: item?.title,
          price: item?.price?.amount
        };
    });

    window.dataLayer.push({
        event: 'view_item_list',
        ecommerce: {
            items: allItems,
            item_list_id: collection?.id,
            item_list_name: collection?.title
        }
    });
});

// PDP viewed
analytics.subscribe("product_viewed", (event) => {

    const product = event.data?.productVariant;

    window.dataLayer.push({
        event: 'view_item',
        ecommerce: {
            currency: product?.price?.currencyCode,
            value: product?.price?.amount,
            items: [{
                item_id: product?.id,
                item_name: product?.title,
                price: product?.price?.amount
            }]
        }
    });
});

// ATC
analytics.subscribe("product_added_to_cart", (event) => {

    const product = event.data?.cartLine;

    window.dataLayer.push({
        event: 'add_to_cart',
        ecommerce: {
            currency: product?.cost?.totalAmount?.currencyCode,
            value: product?.cost?.totalAmount?.amount,
            items: [{
                item_id: product?.merchandise?.id,
                item_name: product?.merchandise?.title,
                price: product?.merchandise?.price?.amount
            }]
        }
    });
});

// Cart viewed
analytics.subscribe("cart_viewed", (event) => {

    const product = event.data?.cart;

    const allItems = product?.lines?.map((item) => {
        return {
          item_id: item?.merchandise?.id,
          item_name: item?.merchandise?.title,
          price: item?.merchandise?.price?.amount
        };
    });

    window.dataLayer.push({
        event: 'view_cart',
        ecommerce: {
            currency: product?.cost?.totalAmount?.currencyCode,
            value: product?.cost?.totalAmount?.amount,
            items: allItems
        }
    });
});

// Remove From Cart
analytics.subscribe("product_removed_from_cart", (event) => {

    const product = event.data?.cartLine;

    window.dataLayer.push({
        event: 'remove_from_cart',
        ecommerce: {
            currency: product?.cost?.totalAmount?.currencyCode,
            value: product?.cost?.totalAmount?.amount,
            items: [{
                item_id: product?.merchandise?.id,
                item_name: product?.merchandise?.title,
                price: product?.merchandise?.price?.amount
            }]
        }
    });
});

// Checkout Started
analytics.subscribe("checkout_started", (event) => {

    const checkout = event.data?.checkout;

    const allItems = checkout?.lineItems?.map((item) => {
        return {
          item_id: item?.variant?.id,
          item_name: item?.variant?.title,
          price: item?.variant?.price?.amount
        };
    });

    window.dataLayer.push({
        event: 'begin_checkout',
        ecommerce: {
            currency: checkout?.subtotalPrice?.currencyCode,
            value: checkout?.subtotalPrice?.amount,
            items: allItems
        }

    });
});

// Payment info submitted
analytics.subscribe("payment_info_submitted", (event) => {

    const checkout = event.data?.checkout;

    const allDiscounts = checkout?.discountApplications?.map((discount) => {
        return discount.title;
    });

    const allItems = checkout?.lineItems?.map((item) => {
        return {
          item_id: item?.variant?.id,
          item_name: item?.variant?.title,
          price: item?.variant?.price?.amount
        };
    });

    window.dataLayer.push({
        event: 'add_payment_info',
        ecommerce: {
            currency: checkout?.currencyCode,
            value: checkout?.subtotalPrice?.amount,
            coupon: allDiscounts,
            payment_type: checkout?.transactions?.gateway,
            items: allItems
        }

    });
});

// Shipping Info Submitted
analytics.subscribe("checkout_shipping_info_submitted", (event) => {

    const checkout = event.data?.checkout;

    const allDiscounts = checkout?.discountApplications?.map((discount) => {
        return discount.title;
    });

    const allItems = checkout?.lineItems?.map((item) => {
        return {
          item_id: item?.variant?.id,
          item_name: item?.variant?.title,
          price: item?.variant?.price?.amount
        };
    });

    window.dataLayer.push({
        event: 'add_shipping_info',
        ecommerce: {
            currency: checkout?.currencyCode,
            value: checkout?.subtotalPrice?.amount,
            coupon: allDiscounts,
            items: allItems
        }

    });
});

// Page View
analytics.subscribe("page_viewed", (event) => {

    const page = event.context?.document;

    window.dataLayer.push({
        event: 'page_view',
        page_url: page?.location,
        page_referrer: page?.referrer
    });
});

// Search
analytics.subscribe("search_submitted", (event) => {

    const search = event.data?.searchResult;

    window.dataLayer.push({
        event: 'search',
        search_term: search?.query
    });
});
