jQuery( function ( $ ) {
	'use strict';

	/**
	 * ---------------------------------------
	 * ------------- Events ------------------
	 * ---------------------------------------
	 */

	/**
	 * Grid Layout import button click.
	 */
	$( '.js-rs-import-data' ).on( 'click', function () {
		var selectedImportID = $( this ).val();
		var $itemContainer   = $( this ).closest( '.js-rs-import-item' );

		// If the import confirmation is enabled, then do that, else import straight away.
		if ( ocdi.import_popup ) {
			displayConfirmationPopup( selectedImportID, $itemContainer );
		}
		else {
			gridLayoutImport( selectedImportID, $itemContainer );
		}
	});


	/**
	 * Grid Layout categories navigation.
	 */
	(function () {
		// Cache selector to all items
		var $items = $( '.js-rs-import-list-container' ).find( '.js-rs-import-item' ),
			fadeoutClass = 'ocdi-is-fadeout',
			fadeinClass = 'ocdi-is-fadein',
			animationDuration = 200;

		// Hide all items.
		var fadeOut = function () {
			var dfd = jQuery.Deferred();

			$items
				.addClass( fadeoutClass );

			setTimeout( function() {
				$items
					.removeClass( fadeoutClass )
					.hide();

				dfd.resolve();
			}, animationDuration );

			return dfd.promise();
		};

		var fadeIn = function ( category, dfd ) {
			var filter = category ? '[data-categories*="' + category + '"]' : 'div';

			if ( 'all' === category ) {
				filter = 'div';
			}

			$items
				.filter( filter )
				.show()
				.addClass( 'ocdi-is-fadein' );

			setTimeout( function() {
				$items
					.removeClass( fadeinClass );

				dfd.resolve();
			}, animationDuration );
		};

		var animate = function ( category ) {
			var dfd = jQuery.Deferred();

			var promise = fadeOut();

			promise.done( function () {
				fadeIn( category, dfd );
			} );
		};

		$(".rs-import__categories-select-button").click(function(event) {
			$('html').one('click',function() {
				  $(".rs-import__categories-select").removeClass("opened");
			});
			$(this).parents(".rs-import__categories-select").toggleClass("opened");
			event.stopPropagation();
		});
	
		$('.rs-import__categories-select-options').css('display', 'block');
	
		$(".rs-import__categories-select-option").click(function() {
			$('#categories-select').val($(this).data("value"));
			$(this).parents(".rs-import__categories-select-options").find(".rs-import__categories-select-option").removeClass("selected");
			$(this).addClass("selected");
			$(this).parents(".rs-import__categories-select").removeClass("opened");
			$('.rs-import__categories-select-button').text($(this).text());
	
			animate(
				$(this).data("value").slice(1)
			);
		});
	}());


    /**
     * Grid Layout search functionality.
     */
    $( '.js-rs-import-search' ).on( 'keyup', function( event ) {
        var searchTerm = $(this).val().toLowerCase();

        if (searchTerm.length > 0) {
            // Hide all items first
            $( '.js-rs-import-list-container' ).find( '.js-rs-import-item' ).hide();

            // Use filter to find matches based on data-name and data-title
            $( '.js-rs-import-list-container' ).find( '.js-rs-import-item' ).filter(function() {
                var dataName = $(this).attr('data-name').toLowerCase();
                var dataTitle = $(this).attr('data-title').toLowerCase();

                // Return items that match the search term in either data-name or data-title
                return dataName.includes(searchTerm) || dataTitle.includes(searchTerm);
            }).show();
        } else {
            // Show all items if search input is cleared
            $( '.js-rs-import-list-container' ).find( '.js-rs-import-item' ).show();
        }
    });


	/**
	 * ---------------------------------------
	 * --------Helper functions --------------
	 * ---------------------------------------
	 */

	/**
	 * Prepare grid layout import data and execute the AJAX call.
	 *
	 * @param int selectedImportID The selected import ID.
	 * @param obj $itemContainer The jQuery selected item container object.
	 */
	function gridLayoutImport( selectedImportID, $itemContainer ) {
		
		// Reset response div content.
		$( '.js-rs-import-ajax-response' ).empty();
		// Hide all other import items.
		$( '.js-rs-import' ).remove();

		// Prepare data for the AJAX call
		var data = new FormData();
		data.append( 'action', 'di_import_demo_data' );
		data.append( 'security', ocdi.ajax_nonce );
		data.append( 'selected', selectedImportID );

		// AJAX call to import everything (content, widgets, before/after setup)
		ajaxCall( data );
	}

	/**
	 * Display the confirmation popup.
	 *
	 * @param int selectedImportID The selected import ID.
	 * @param obj $itemContainer The jQuery selected item container object.
	 */
	function displayConfirmationPopup( selectedImportID, $itemContainer ) {
		var $dialogContiner         = $( '#js-rs-import-modal-content' );
		var currentFilePreviewImage = ocdi.import_files[ selectedImportID ]['url_screenshot'] || ocdi.theme_screenshot;
		var previewImageContent     = '';
		var importNotice            = ocdi.import_files[ selectedImportID ]['import_notice'] || '';
		var importNoticeContent     = '';
		var dialogOptions           = $.extend(
			{
				'dialogClass': 'wp-dialog',
				'resizable':   false,
				'height':      'auto',
				'modal':       true
			},
			ocdi.dialog_options,
			{
				'buttons':
				[
					{
						text: ocdi.texts.dialog_no,
						click: function() {
							$(this).dialog('close');
						}
					},
					{
						text: ocdi.texts.dialog_yes,
						class: 'button  button-primary',
						click: function() {
							$(this).dialog('close');
							gridLayoutImport( selectedImportID, $itemContainer );
							let element = document.getElementsByClassName("ocdi__gl-item-button");
							for(var i=0; i<element.length; i++)element[i].style.display='none';
						}
					}
				]
			});

		if ( '' === currentFilePreviewImage ) {
			previewImageContent = '<p>' + ocdi.texts.missing_preview_image + '</p>';
		}
		else {
			previewImageContent = '<div class="rs-import__modal-image-container"><img class="rs-import__modal-image-container" src="' + currentFilePreviewImage + '" alt="' + ocdi.import_files[ selectedImportID ]['title'] + '"></div>'
		}

		// Prepare notice output.
		if( '' !== importNotice ) {
			importNoticeContent = '<div class="ocdi__modal-notice  ocdi__demo-import-notice">' + importNotice + '</div>';
		}

		// Populate the dialog content.
		$dialogContiner.prop( 'title', ocdi.texts.dialog_title );
		$dialogContiner.html(
			'<p class="rs-import__modal-item-title">' + ocdi.import_files[ selectedImportID ]['title'] + '</p>' +
			previewImageContent +
			importNoticeContent
		);

		// Display the confirmation popup.
		$dialogContiner.dialog( dialogOptions );
	}

	/**
	 * The main AJAX call, which executes the import process.
	 *
	 * @param FormData data The data to be passed to the AJAX call.
	 */
	function ajaxCall( data ) {
		$.ajax({
				url: 'admin-ajax.php',
				type: 'POST',
				data: data,
				contentType:false,
				processData:false,
				beforeSend:  function() {
					$( '.js-rs-import-ajax-loader' ).show();
				}
		})
		.done( function( response ) {
			console.log(response);
			if (true === response.success) {
				$( '.js-rs-import-ajax-response' ).append( '<div class="notice  notice-success"><p>' + response.data.message + '</p></div>' );
			} else if (false === response.success) {
				$( '.js-rs-import-ajax-response' ).append( '<div class="notice  notice-error  is-dismissible"><p>' + response.data.message + '</p></div>' );
			} else {
				$( '.js-rs-import-ajax-response' ).append( '<div class="notice  notice-error  is-dismissible"><p>' + response + '</p></div>' );
			}
			$( '.js-rs-import-ajax-loader' ).hide();
		})
		.fail( function( error ) {
			$( '.js-rs-import-ajax-response' ).append( '<div class="notice  notice-error  is-dismissible"><p>Error: ' + error.statusText + ' (' + error.status + ')' + '</p></div>' );
			$( '.js-rs-import-ajax-loader' ).hide();
		});
	}


	/**
	 * Doing sticky header on scrolling page with template list.
	 */
	var stickyOffset = $('.rs-import__header').offset().top,
		sticky = $('.rs-import__header'),
		contnt = $('.rs-import__templates-list');
			
	
	$(window).scroll(() => {
		var scroll = $(window).scrollTop(),
			elmHdn = $('.rs-import__header-hidden'),
			elmWdt = elmHdn.outerWidth(),
			leftSd = getPageLeftDistance(elmHdn[0]);
		if (scroll >= stickyOffset) {
			sticky.css('left', leftSd + 'px');
			sticky.width(elmWdt - 42);
			sticky.addClass('fixed');
			contnt.css('padding-top', '64px');
		} else {
			contnt.removeAttr('style');
			sticky.removeAttr('style');
			sticky.removeClass('fixed');
		}
	});
	$(window).resize(() => {
		var elmHdn = $('.rs-import__header-hidden'),
			elmWdt = elmHdn.outerWidth(),
			leftSd = getPageLeftDistance(elmHdn[0]);

		if (sticky.hasClass('fixed')) {
			sticky.width(elmWdt - 42);
			sticky.css('left', leftSd + 'px');
		}
	});

	function getPageLeftDistance(el) {
		var rect = el.getBoundingClientRect();
		var docEl = document.documentElement;
		return rect.left + (window.pageXOffset || docEl.scrollLeft || 0);
	}
} );
