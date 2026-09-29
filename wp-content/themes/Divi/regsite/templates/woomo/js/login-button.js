jQuery(document).ready(function ($) {
  $('.popup-open').click(function() {
    $('.popup-fade').addClass("is-popup-visible");
    $('html').css('overflow', 'hidden');
    return false;
  });

  $('.popup-close').click(function() {
    $(this).parents('.popup-fade').removeClass("is-popup-visible");
    $('html').css('overflow', 'unset');
    return false;
  });

  $(document).keydown(function(e) {
    if (e.keyCode === 27) {
      e.stopPropagation();
      $('.popup-fade').removeClass("is-popup-visible");
      $('html').css('overflow', 'unset');
    }
  });

  $('.popup-fade').click(function(e) {
    if ($(e.target).closest('.popup').length == 0) {
      $(this).removeClass("is-popup-visible");			
      $('html').css('overflow', 'unset');		
    }
  });
});