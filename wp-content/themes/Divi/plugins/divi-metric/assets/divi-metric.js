document.addEventListener('DOMContentLoaded', () => {
  const adminPage = document.querySelector('body.wp-admin') !== null

  if (adminPage) {
    const checkElement = async selector => {
      while ( document.querySelector(selector) === null) {
        await new Promise( resolve =>  requestAnimationFrame(resolve) )
      }
      return document.querySelector(selector)
    }

    checkElement('.divi-metric button.notice-dismiss').then((selector) => {
      selector.addEventListener('click', () => {
        let date = new Date()
        date.setTime(date.getTime()+(1*24*60*60*1000))
        document.cookie = 'close-notice-divi-metric=true; expires=' + date.toGMTString() + '; path=/'
      })
    })


    const noticeBtn = document.querySelector('#notice-metric-btn')
    const metricBtn = document.querySelector('.divi-metric-btn')
    const metricBody = document.querySelector('#divi-metric-body')
    

    /*
     * Open popup
     */
    function diviMetric_drawWindow() {
      metricBody.style.visibility = 'visible'
      metricBody.style.opacity = '1'
      metricBtn.style.display = 'none'
    }

    if(noticeBtn !== null) {
      noticeBtn.addEventListener('click', () => {
        diviMetric_drawWindow()
      })
    }

    metricBtn.addEventListener('click', () => {
      diviMetric_drawWindow()
    })


    /*
     * Close popup
     */
    function diviMetric_closePopup() {
      metricBody.style.visibility = 'hidden'
      metricBody.style.opacity = '0'
      metricBtn.style.display = 'block'
    }
    const metricBodyClose = document.querySelector('.divi-metric_close')
    metricBodyClose.addEventListener('click', () => {
      diviMetric_closePopup()
      let error = document.querySelector('.divi-metric-error')
      if (!error || error.innerHTML != null) {
        error.innerHTML = ''
      }
    })

    /*
     * Send data
     */
    const metricSendData = document.querySelector('.divi-metric_body-submit')

    function trimfield(str) { 
      return str.replace(/^\s+|\s+$/g,'')
    }

    metricSendData.addEventListener('click', (e) => {
      e.preventDefault()

      let url  = document.querySelector('#divi-metric-site').value
      let comment = document.querySelector('.divi-metric_body-textarea').value
      let error = document.querySelector('.divi-metric-error')
      let body = document.querySelector('.divi-metric_body')

      if(trimfield(comment) == '') {
        error.innerHTML = 'Пустое сообщение'
        return
      }


      const apiUrl = 'https://api.turnkey.reg.ru/wordpress/metric/api/feedback/add.php'
      const data = {
        url: url,
        source: 'wp-admin',
        comment: comment
      };


      (async function() {
        const response = await fetch(apiUrl, {
          method: 'post',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          const message = `An error has occured: ${response.status}`;
          throw new Error(message);
        }

        const json = await response.json()

        if(json.message !== 'Entry Created') {
          error.innerHTML = 'Ошибка ответа'
          return
        }


        const formData = new FormData();

        formData.append( 'action', 'metric_off' );
        formData.append( 'message', json.message );

        console.log(json.message);
        
        (async () => {
          const wpResponce = await fetch('/wp-admin/admin-ajax.php', {
            method: 'post',
            body: formData,
          })

          let wpData = await wpResponce.text()

          body.style.display = 'flex'
          body.style.alignItems = 'center'
          body.style.height = '360px'
          body.style.flexDirection = 'column'
          body.style.justifyContent = 'center'

          body.innerHTML = 'Спасибо за ответ.'

          setTimeout(() => {
            diviMetric_closePopup()
            const noticeElem = document.querySelector('.notice.notice-info.is-dismissible.divi-metric')
            noticeElem.remove()
            metricBtn.remove()
          }, 3000)

        })();
      })();
    })
  }
})
