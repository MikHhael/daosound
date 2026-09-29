jQuery( document ).ready( function( $ ) {
	var form = $( 'form#rs_registration' )
	var status = $('form#rs_registration p.status');

	form.on( 'submit', function( e ) {
		status.text( ajax_reg_object.loading_text )
		$.ajax({
			type: 'post',
			dataType: 'json',
			url: ajax_reg_object.ajaxurl,
			data: {
				'action': 'ajaxreg',
				'username': $('form#rs_registration #reg_username').val(),
				'email': $('form#rs_registration #reg_email').val(),
				'password': $('form#rs_registration #reg_password').val(),
				'register_captcha': $('form#rs_registration #register_captcha').val(),
				'security': $('form#rs_registration #security').val(),
			},
			success: function( data ) {
				status.text( data.message )
				if (data.loggedin == true) {
					document.location.href = ajax_reg_object.redirecturl;
				}
			}
		})
		e.preventDefault()
	} )
} )