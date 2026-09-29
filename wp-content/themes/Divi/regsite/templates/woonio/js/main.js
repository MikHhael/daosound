jQuery( document ).ready( function( $ ) {
    $( ".et_pb_menu__search-button" ).after( '<a href="' + php_vars.account_url + '" class="et_pb_menu__icon et_pb_menu__account-button"></a>' )
})

jQuery( document ).ready( function( $ ) {
    var btn = $( "#button-to-product-main-page" )
    var blck = $( "#block-to-product-main-page" )
    if ( btn.length > 0 && blck.length > 0 ) {
        var link = btn.attr( "href" )
        blck.click(function(event) {
            $(location).attr('href', link)
            event.preventDefault()
        })
    }
})

document.addEventListener('DOMContentLoaded', function(event) {
  const mainMenu = document.querySelector('.et_pb_menu--with-logo')
  const matches = mainMenu.querySelectorAll('div.et_pb_menu__menu')
  
  let anchor = document.createElement('a')
  anchor.href = php_vars.site_url + '/wishlist/'
  anchor.className = 'et_pb_menu__icon et_pb_menu__wishlist-button'
  
  matches[0].after(anchor)
})