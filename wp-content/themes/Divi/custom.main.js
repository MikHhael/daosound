/**
 * Кастомизация плагина Мгновенные изображения
 * 
 * @since 4.9.10.3
 */
jQuery(document).ready(function($) {
  // Меняем заголовок
  let titleInstantImg = $( '.instant-img-container .header-wrap h1' )
  if ( titleInstantImg.length ) {
      titleInstantImg.html('Мгновенные изображения<span>Загрузка изображения в один клик</span>')
  }
  
  // Убираем кнопку настроек
  let removeSetButton = $( '.instant-img-container .header-wrap button' )
  if ( removeSetButton.length ) {
      removeSetButton.remove()
  }
  
  // Меняем название в меню
  let menuName = $('.wp-submenu li a')
  $( ".wp-submenu li a" ).each( function() {
      if ( 'Instant Images' === this.innerHTML ) {
          $(this).html('Мгновенные изображения')
      }
  })
})
/**
 * Save logo
 */
jQuery(document).ready(function($) {
  var setLogo = $( '#divi_logo_set_button' )
  var saveSettings = $( '#epanel-save-top' )
  if ( setLogo.length ) {
    setLogo.click(function() {
      jQuery(document).ready(function($) {
        var selectLogo = $( '.media-button-select' )
        selectLogo.click( function() {
          saveSettings.click()
          setTimeout( function() {
            location.reload()
          }, 1500)
        })
      })
    })
  }
})

document.addEventListener('DOMContentLoaded', function() {
    /**
    * Add sticky-header to OCDI templates catalog
    */
    let navbar = document.getElementById('ocdi_gl-header')
  
    if ( navbar ) {
      window.addEventListener('scroll', function() {
        let sticky = navbar.offsetTop + 512
  
        if ( window.pageYOffset > sticky ) {
          navbar.classList.add('ocdi__gl-header_sticky')
          navbar.classList.remove("no-display")
        } else {
          navbar.classList.add("no-display")
          navbar.classList.remove("ocdi__gl-header_sticky")
        }
      })
    }
  
  
    /**
    * Remove update details when update theme
    */
    let updateDetails = document.getElementsByClassName('js-update-details-toggle')
  
    if(updateDetails[0]) { 
      updateDetails[0].innerHTML = null
    }
  
   
    /**
     * Reset logo and save
     */
    let getResetLogoButton = document.getElementById('divi_logo_reset')
    if (getResetLogoButton) {
      getResetLogoButton.addEventListener('click', function() {
        let refreshPageAfterResetLogo = document.getElementById('epanel-save-top')
        refreshPageAfterResetLogo.click()
        setTimeout( function() {
          location.reload()
        }, 1500)
      })
    }
  
    // Video Help Popup
    setTimeout(() => {
      var videoPopupOverlay = document.createElement("div")
      var bodyClasses = document.querySelector('body')
      videoPopupOverlay.innerHTML = '<div class="body-blackout"></div>'
      document.body.appendChild(videoPopupOverlay)
  
      var videoPopupElement = document.createElement("div")
      videoPopupElement.innerHTML = 
            '<div class="popup-modal shadow">' +
              '<video id="video-element" witdh="650px" height="366px" controls preload="none" src="https://turnkey.reg.ru/media/Reg.site_First_look.mp4" poster="https://turnkey.reg.ru/media/Reg.site_First_look_poster.webp"></video>' +
              '<i class="fas fa-2x fa-times popup-modal__close"></i>' +
            '</div>'
      document.body.appendChild(videoPopupElement)
      const adminVideo = document.getElementById('wp-admin-bar-video')
      const bodyBlackout = document.querySelector('.body-blackout')
      const popupModal = document.querySelector('.popup-modal')
  
      if ( adminVideo ) {
        adminVideo.addEventListener( 'click', () => {
          bodyClasses.classList.add('body-noscroll-modal')
  
          bodyBlackout.classList.add('is-blacked-out')
          document.body.append(bodyBlackout)
  
          popupModal.classList.add('is--visible')
          document.body.append(popupModal)
        })
      }
   
      popupModal.querySelector('.popup-modal__close').addEventListener('click', () => {
        bodyClasses.classList.remove('body-noscroll-modal')
  
        popupModal.classList.remove('is--visible')
        document.body.append(popupModal)
        bodyBlackout.classList.remove('is-blacked-out')
        document.body.append(bodyBlackout)

        popupModal.querySelector('#video-element').pause()
      })
   
      bodyBlackout.addEventListener('click', () => {
        bodyClasses.classList.remove('body-noscroll-modal')
        
        popupModal.classList.remove('is--visible')
        document.body.append(popupModal)
        bodyBlackout.classList.remove('is-blacked-out')
        document.body.append(bodyBlackout)

        popupModal.querySelector('#video-element').pause()
      })
    }, 2000)
  })


window.indexedDB.deleteDatabase('DiviCloud')