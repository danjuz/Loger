dateNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec']

logerApp = {
  connectionToFirebase: new Firebase('https://loger.firebaseio.com/')
  loginButton: document.querySelector('.register-login-container__button')
  addButton: document.querySelector('.add-container__button')
  saveButton: document.querySelector('.save-content__button')

  okButton: document.querySelector('.work-out-container__table-add__ok-button')
  workOutContainer: document.querySelector('.work-out-container')
  workOutTable: document.querySelectorAll('.work-out-container--background')
  playButton: document.querySelector('.add-container__form-container__form__play-button')
  pauseButton: document.querySelector('.add-container__form__pause-button')
  stopWatchInput: document.querySelector('.add-container__form-container__form__timer-input')

  nameInput: document.querySelectorAll('.work-out-container__table-add__name-input')
  quantitytInput: document.querySelectorAll('.work-out-container__table-add__quanity-input')
  multiInput: document.querySelectorAll('.work-out-container__table-add__workout-multiplication-input')

  logoutButton: document.querySelector('.header__main-container-logout')

  constructor: ->
    this.bindInitialEvents()

  bindInitialEvents: ->
    self = this
    this.dateOfToday()

    if (window.location.href == 'http://localhost:9000/')
      self.loginButton.addEventListener 'click', ->
        self.redirectWithFBAndFB()

    if (window.location.href == 'http://localhost:9000/logg-results.html' || window.location.href == 'http://www.localhost:9000/logg-results.html')
    #test if visitor has id from facebook login, if not, redirect to login page
      regex = /facebook:[0-9]+$/gm
      obj = if window.localStorage['firebase:session::loger'] then JSON.parse(window.localStorage['firebase:session::loger']).uid else []

      if typeof obj == "object" || !obj.match regex
        window.location.href = 'http://localhost:9000/'

      self.stopWatch()
      self.saveButton.addEventListener 'click', ->
          self.saveContentToFireBase()

      self.addButton.addEventListener 'click', ->
        self.addEditWorkOut()

      self.logoutButton.addEventListener 'click', ->
        localStorage.clear()
        window.location.href = 'http://localhost:9000/'

        allWorkOutOkButtons = document.querySelectorAll('.work-out-container__table-add__ok-button')
        allWorkOutDeleteButtons = document.querySelectorAll('.work-out-container__table-add__delete-button')
        allEditButtons = document.getElementsByClassName('show-work-out-container__table-add__edit-button')

        showName: document.querySelectorAll('show-work-out-container__table-add__nameInput')
        quantityName: document.querySelectorAll('show-work-out-container__table-add__quantityInput')
        multiplyName:  document.querySelectorAll('show-work-out-container__table-add__multiplyInput')

        for item in allWorkOutOkButtons
          item.addEventListener 'click', (e)->
            self.getContentInput(e)

          for item in allEditButtons
            item.addEventListener 'click', (e)->
              self.backToEditMode(e)

        for item in allWorkOutDeleteButtons
          item.addEventListener 'click', (e)->
            self.deleteIt(e)

  dateOfToday: ->
    today = new Date()
    date = today.getDate()
    month = today.getMonth()

    dateLocation = document.querySelector('.header__date-area')
    dateLocation.innerHTML = "<div class='date-area__date'>" + date + "</div><br/><div class='date-area__month'>" + dateNames[month] + "</div>"

  redirectWithFBAndFB: ->
    self = this
    ref = new Firebase('https://loger.firebaseio.com')
    ref.authWithOAuthPopup 'facebook', (error, authData) ->
      if error
        console.log 'FacebookErrorMsg: ', error
      else
        window.location.href = 'http://localhost:9000/logg-results.html'

    return

  saveUserToFirebase: (userData) ->
    #get the information from redirectWithFBAndFB function
    fbInformation = userData
    id = fbInformation.facebook.id
    ref = this.connectionToFirebase
    usersRef = ref.child("users")

    usersRef.child(fbInformation.facebook.id).set({
      displayName: fbInformation.facebook.displayName,
      first_name: fbInformation.facebook.cachedUserProfile.first_name,
      last_name:  fbInformation.facebook.cachedUserProfile.last_name,
      profileImageURL: fbInformation.facebook.profileImageURL,
      gender: fbInformation.facebook.cachedUserProfile.gender
    });

  addEditWorkOut: ->
    this.bindEvents
    self = this

    # Create every needed elements to create the dynamic list of workout.

    background = document.createElement('div')
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

    deleteButton = document.createElement('div')
    okButton = document.createElement('div')

    # Create text to buttons/elements and append them to right element

    deleteButtonText = document.createTextNode('Delete')
    okButtonText = document.createTextNode('Ok')
    multiSymbol = document.createTextNode('X')
    deleteButton.appendChild(deleteButtonText)
    okButton.appendChild(okButtonText)
    tdMultiSymbol.appendChild(multiSymbol)

    # Add classname to elements

    background.className = 'work-out-container--background'
    table.className = 'work-out-container__table'
    tdDeleteButton.className = 'work-out-container__table-add__delete-button'
    tdOkButton.className = 'work-out-container__table-add__ok-button'
    tdName.className = 'work-out-container__table-add__name-input'
    tdQuantity.className = 'work-out-container__table-add__quanity-input'
    tdworkOutMultiplication.className = 'work-out-container__table-add__workout-multiplication-input'
    tdMultiSymbol.className =  'work-out-container__table-add__td-muliply-symbol'
    okButton.className = 'work-out-container__table-add__div-ok_button'
    deleteButton.className = 'work-out-container__table-add__div-delete-button'

    # Decide quantity of colspan to every td in the table

    tdName.colSpan = 20
    tdQuantity.colSpan = 8
    tdMultiSymbol.colSpan = 4
    tdworkOutMultiplication.colSpan = 4
    tdDeleteButton.colSpan = 10
    tdOkButton.colSpan = 10

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

    background.appendChild(table)
    this.workOutContainer.appendChild(background)

    if (nameInput)
      nameInput.focus()

  getContentInput: (e)->

    #Get and put input value into variables
    nameInputValue = e.target.parentElement.parentElement.parentElement.childNodes[0].childNodes[0].childNodes[0].value
    quantityInputValue = e.target.parentElement.parentElement.parentElement.childNodes[1].childNodes[0].childNodes[0].value
    repQuantityValue = e.target.parentElement.parentElement.parentElement.childNodes[1].childNodes[2].childNodes[0].value
    backgroundElement = e.target.parentElement.parentElement.parentElement.parentElement

    namePlaceholder = e.target.parentElement.parentElement.parentElement.parentElement.childNodes[1]
    quantityPlaceholder = e.target.parentElement.parentElement.parentElement.parentElement.childNodes[1]
    multiplyPlaceholder = e.target.parentElement.parentElement.parentElement

    console.log 'Test ', namePlaceholder
    console.log 'Test1 ', quantityPlaceholder
    console.log 'Test2 ', multiplyPlaceholder

    if(e.target.parentNode.parentNode.parentNode.parentNode.childNodes[1])
      console.log 'Nu finns det element, uppdateringsmode'
      console.log 'innehåll: ', nameInputValue

    # Put value inside the right div
      #namePlaceholder.innerHTML = nameInputValue
      #this.quantityName.innerHTML = quantityInputValue
      #this.multiplyName.innerHTML = repQuantityValue

      tableElement = e.target.parentElement.parentElement.parentElement
      showElement = e.target.parentNode.parentNode.parentNode.parentNode.childNodes[1]

      this.addClass tableElement, 'hidden'
      this.removeClass showElement, 'hidden'

    else
      this.noEditMode(e, nameInputValue, quantityInputValue, repQuantityValue, backgroundElement)

  noEditMode: (e, nameInputValue, quantityInputValue, repQuantityValue, backgroundElement) ->
    self = this

    #Hide table
    tableElement = e.target.parentElement.parentElement.parentElement
    tableElement.className = tableElement.className + ' hidden'

    #Create new table with correct information
    table = document.createElement('table')

    trName = document.createElement('tr')
    trQuantity = document.createElement('tr')
    trButtons = document.createElement('tr')

    tdName = document.createElement('td')
    tdQuantity = document.createElement('td')
    tdworkOutMultiplication = document.createElement('td')
    tdMultiSymbol = document.createElement('td')

    nameInput = document.createElement('div')
    quantityInput = document.createElement('div')
    workOutMultiplicationInput = document.createElement('div')

    editButton = document.createElement('div')

    # Create text to buttons/elements and append them to right element
    multiSymbol = document.createTextNode('X')
    tdMultiSymbol.appendChild(multiSymbol)

    # Add classname to elements
    table.className = 'show-work-out-container__table'
    tdName.className = 'show-work-out-container__table-add__name'
    tdQuantity.className = 'show-work-out-container__table-add__quanity'
    tdworkOutMultiplication.className = 'show-work-out-container__table-add__workout-multiplication'
    tdMultiSymbol.className =  'show-work-out-container__table-add__td-muliply-symbol'
    editButton.className = 'show-work-out-container__table-add__edit-button'

    nameInput.className =  'show-work-out-container__table-add__nameInput'
    quantityInput.className = 'show-work-out-container__table-add__quantityInput'
    workOutMultiplicationInput.className = 'show-work-out-container__table-add__multiplyInput'


    # Decide quantity of colspan to every td in the table
    tdName.colSpan = 20
    tdQuantity.colSpan = 8
    tdMultiSymbol.colSpan = 4
    tdworkOutMultiplication.colSpan = 4

    # Append every element to it's parent
    tdName.appendChild(nameInput)
    tdQuantity.appendChild(quantityInput)
    tdworkOutMultiplication.appendChild(workOutMultiplicationInput)

    trName.appendChild(tdName)
    trQuantity.appendChild(tdQuantity)
    trQuantity.appendChild(tdMultiSymbol)
    trQuantity.appendChild(tdworkOutMultiplication)

    table.appendChild(trName)
    table.appendChild(trQuantity)
    table.appendChild(editButton)
    backgroundElement.appendChild(table)

    # Put value inside the right div
    console.log 'name: ', nameInputValue

    nameInput.innerHTML = nameInputValue
    quantityInput.innerHTML = quantityInputValue
    workOutMultiplicationInput.innerHTML = repQuantityValue

  backToEditMode: (e) ->
    tableElement = e.target.parentNode.parentNode.firstChild
    this.removeClass(tableElement, 'hidden')

    showStats = e.target.parentNode.parentNode.childNodes[1]
    this.addClass(showStats, 'hidden')

  deleteIt: (e) ->
    #This delete the whole container with input fields and buttons
    e.target.parentNode.parentNode.parentNode.parentNode.remove()

  addClass: (element, className) ->
    element.classList.add(className)

  removeClass: (element, className) ->
    element.classList.remove(className);

  stopWatch: () ->
    self = this

    timer_is_on = 0
    sekTime = 0
    minTime = 0
    minGost = ''
    sekGost = ''
    zeroGost = ''
    t = t

    timedCount = ->
      sekTime += 1

      if (sekTime >= 10)
        sekGost = ''
      if (sekTime <= 10)
        sekGost = '0'
      if(minTime >= 10)
        minGost = ''
      if(minTime <= 10)
        minGost = '0'

      if(sekTime >= 60)
        sekTime = 0
        minTime += 1

      self.stopWatchInput.value = zeroGost + minGost + minTime + ':' + zeroGost + sekGost + sekTime

      t = setTimeout((->
        timedCount()
        return
        ), 1000)


    this.playButton.addEventListener 'click', (e)->
      if (!timer_is_on)
        timer_is_on = 1
        timedCount()

    this.pauseButton.addEventListener 'click', (e)->
      clearTimeout(t)
      timer_is_on = 0

  saveContentToFireBase: ->
      if $('.show-work-out-container__table-add__nameInput').length
        console.log 'Alla namn', $('.show-work-out-container__table-add__nameInput')
        console.log 'Alla quantityInput', $('.show-work-out-container__table-add__quantityInput')
        console.log 'Alla multuplyInput', $('.show-work-out-container__table-add__multiplyInput')
        console.log 'tid', $('.add-container__form-container__form__timer-input')[0].value
  }

document.addEventListener 'DOMContentLoaded', ->
    logerApp.constructor()
