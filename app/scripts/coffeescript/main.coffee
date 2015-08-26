dateNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec']

logerApp = {

  loginButton: document.querySelector('.register-login-container')
  addButton: document.querySelector('.add-container__button')
  workOutContainer: document.querySelector('.work-out-conatiner')

  init: ->
    this.bindEvents()

  bindEvents: ->
    self = this
    this.dateOfToday()

    if (window.location.href == 'http://localhost:9000/')
      this.loginButton.addEventListener 'click', ->
        self.redirectWithFacebookAndFirebaseLogin()

    if (window.location.href == 'http://www.localhost:9000/logg-results.html')
      this.addButton.addEventListener 'click', ->
        self.addEditWorkOut()

  dateOfToday: ->
    today = new Date()
    date = today.getDate()
    month = today.getMonth()

    dateLocation = document.querySelector('.header__date-area')
    dateLocation.innerHTML = "<div class='date-area__date'>" + date + "</div><br/><div class='date-area__month'>" + dateNames[month] + "</div>"

  redirectWithFacebookAndFirebaseLogin: ->
    ref = new Firebase('https://loger.firebaseio.com')
    ref.authWithOAuthPopup 'facebook', (error, authData) ->
      if error
        console.log 'Login Failed!', error
      else
        console.log 'Authenticated successfully with payload:', authData
        window.location.href = 'http://www.localhost:9000/logg-results.html';

    return

  addEditWorkOut: ->

    # Create every needed elements to create the dynamic list of workout.

    table = document.createElement('table')

    trName = document.createElement('tr')
    trQuantity = document.createElement('tr')
    trButtons = document.createElement('tr')

    tdName = document.createElement('td')
    tdQuantity = document.createElement('td')
    tdworkOutMultiplication = document.createElement('td')
    tdDeleteButton = document.createElement('td')
    tdOkButton = document.createElement('td')
    tdMultiSymbol = document.createElement('td')

    nameInput = document.createElement('input')
    quantityInput = document.createElement('input')
    workOutMultiplicationInput = document.createElement('input')

    deleteButton = document.createElement('button')
    okButton = document.createElement('button')

    # Create text to buttons/elements and append them to right element

    deleteButtonText = document.createTextNode('Delete')
    okButtonText = document.createTextNode('Ok')
    multiSymbol = document.createTextNode('X')
    deleteButton.appendChild(deleteButtonText)
    okButton.appendChild(okButtonText)
    tdMultiSymbol.appendChild(multiSymbol)

    # Add classname to elements alá BEM-syntax

    table.className = 'work-out-conatiner__table-add'
    deleteButton.className = 'work-out-conatiner__table-add__delete-Button'
    okButton.className = 'work-out-conatiner__table-add__ok-button'


    # Append every element to it's parent

    tdName.appendChild(nameInput)
    tdQuantity.appendChild(quantityInput)
    tdworkOutMultiplication.appendChild(workOutMultiplicationInput)
    tdDeleteButton.appendChild(deleteButton)
    tdOkButton.appendChild(okButton)

    trName.appendChild(tdName)
    trQuantity.appendChild(tdQuantity)
    trQuantity.appendChild(tdMultiSymbol)
    trQuantity.appendChild(tdworkOutMultiplication)
    trButtons.appendChild(tdDeleteButton)
    trButtons.appendChild(tdOkButton)

    table.appendChild(trName)
    table.appendChild(trQuantity)
    table.appendChild(trButtons)

    this.workOutContainer.appendChild(table)

  }

document.addEventListener 'DOMContentLoaded', ->
  logerApp.init()
