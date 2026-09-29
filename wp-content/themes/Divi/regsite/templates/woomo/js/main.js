jQuery( document ).ready( function( $ ) {
    $( ".et_pb_menu__search-button" ).after( '<a href="' + php_vars.account_url + '" class="et_pb_menu__icon et_pb_menu__account-button"></a>' )
    const isWishList = document.querySelectorAll('#tinvwl-css')
    if (isWishList.length > 0) {
        $( ".et_pb_menu__menu" ).after( '<a href="' + php_vars.site_url + '/wishlist/" class="et_pb_menu__icon et_pb_menu__wishlist-button"></a>' )
        
        let btn  = $( "#button-to-product-main-page" )
        let blck = $( "#block-to-product-main-page" )
        if ( btn.length > 0 && blck.length > 0 ) {
            var link = btn.attr( "href" )
            blck.click((e) => {
                e.preventDefault()
                $(location).attr('href', link)
            })
        }
    }
})
