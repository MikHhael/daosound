function divi_woocommerce_store_update_cart_link_text() {
    jQuery.post(
        divi_woocommerce_store.ajaxurl,
        {action: 'divi_woocommerce_store_get_cart_link_text'},
        function (response) {
            jQuery('.dsdws-cart-contents .number').text(response);
        },
        'text'
    );
}