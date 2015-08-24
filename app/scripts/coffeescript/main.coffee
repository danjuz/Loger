dateNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec']

logerApp = {

  loginButton: document.querySelector('.register-login-container__button')

  init: ->
    this.bindEvents()

  bindevents: ->
    self = this
    this.loginButton.addEventListener 'click', ->
      self.redirect()
    this.dateOfToday()

  dateOfToday: ->
    today = new Date()
    date = today.getDate()
    month = today.getMonth()

    dateLocation = document.querySelector('.header__date-area')
    dateLocation.innerHTML = "<div class='date-area__date'>" + date + "</div><br/><div class='date-area__month'>" + dateNames[month] + "</div>"

  redirect: ->
    ref = new Firebase('https://loger.firebaseio.com')
    ref.authWithOAuthPopup 'facebook', (error, authData) ->
      if error
        console.log 'Login Failed!', error
      else
        console.log 'Authenticated successfully with payload:', authData
        window.location.href = 'http://www.localhost:9000/logg-results.html';

    return


  }
logerApp.bindevents()
