jQuery(document).ready(function($) {

  // Show the login dialog box on click
  $('a#show_login').on('click', function(e){
      $('body').prepend('<div class="login_overlay"></div>');
      $('form#rs_login').fadeIn(500);
      $('div.login_overlay, form#rs_login a.close').on('click', function(){
          $('div.login_overlay').remove();
          $('form#rs_login').hide();
      });
      e.preventDefault();
  });

  // Perform AJAX login on form submit
  $('form#rs_login').on('submit', function(e){
      $('form#rs_login p.status').show().text(ajax_login_object.loadingmessage);
      $.ajax({
          type: 'POST',
          dataType: 'json',
          url: ajax_login_object.ajaxurl,
          data: { 
              'action': 'ajaxlogin', //calls wp_ajax_nopriv_ajaxlogin
              'username': $('form#rs_login #username').val(), 
              'password': $('form#rs_login #password').val(), 
              'security': $('form#rs_login #security').val() },
          success: function(data){
              $('form#rs_login p.status').text(data.message);
              if (data.loggedin == true){
                  document.location.href = ajax_login_object.redirecturl;
              }
          }
      });
      e.preventDefault();
  });

});