dateNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec']

logerApp = {
  connectionToFirebase: new Firebase("https://loger.firebaseio.com/")
  loginButton: document.querySelector('.register-login-container')
  addButton: document.querySelector('.add-container__button')
  saveButton: document.querySelector('.save-contect__button')

  okButton: document.querySelector('.work-out-container__table-add__ok-button')
  workOutContainer: document.querySelector('.work-out-container')
  workOutTable: document.querySelectorAll('.work-out-container--background')
  playButton: document.querySelector('.add-container__form-container__form__play-button')
  pauseButton: document.querySelector('.add-container__form__pause-button')
  stopWatchInput: document.querySelector('.add-container__form-container__form__timer-input')

  nameInput: document.querySelectorAll('.work-out-container__table-add__name-input')
  quantitytInput: document.querySelectorAll('.work-out-container__table-add__quanity-input')
  multiInput: document.querySelectorAll('.work-out-container__table-add__workout-multiplication-input')


  init: ->
    this.bindInitialEvents()

  bindInitialEvents: ->
    self = this
    this.dateOfToday()

    if (window.location.href == 'http://localhost:9000/')
      self.loginButton.addEventListener 'click', ->
        self.redirectWithFBAndFB()

    if (window.location.href == 'http://www.localhost:9000/logg-results.html')
      self.stopWatch()
      self.addButton.addEventListener 'click', ->
        self.addEditWorkOut()
        #self.reverseList()

        allWorkOutOkButtons = document.querySelectorAll('.work-out-container__table-add__ok-button')
        allWorkOutDeleteButtons = document.querySelectorAll('.work-out-container__table-add__delete-button')

        for i in [0 ... allWorkOutOkButtons.length]
          allWorkOutOkButtons[i].addEventListener 'click', (e)->
            self.noEditMode(e)
            self.bindInitialEvents();

        for i in [0 ... allWorkOutDeleteButtons.length]
          allWorkOutDeleteButtons[i].addEventListener 'click', (e)->
            self.deleteIt(e)

      if (document.querySelectorAll('.show-work-out-container__table').length > 0)
        console.log 'TESTING: ', document.querySelectorAll('.show-work-out-container__table')

        allEditButtons = document.getElementsByClassName('show-work-out-container__table-add__edit-button')
        allEditButtons[0].addEventListener 'click', (e)->
          console.log "hejehj", e
        #self.backToEditMode(e)

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
        console.log 'Login Failed!', error
      else
        #console.log 'authData.facebook', authData.facebook
        self.saveUserToFirebase(authData)
        window.location.href = 'http://www.localhost:9000/logg-results.html';

    return

  saveUserToFirebase: (fbValue) ->

    #get the information from redirectWithFBAndFB function
    fbInformation = fbValue
    ref = this.connectionToFirebase
    usersRef = ref.child('users')

    usersRef.push
      information:
        id: fbInformation.facebook.id
        displayName: fbInformation.facebook.displayName
        first_name: fbInformation.facebook.cachedUserProfile.first_name
        last_name:  fbInformation.facebook.cachedUserProfile.last_name
        profileImageURL: fbInformation.facebook.profileImageURL
        gender: fbInformation.facebook.cachedUserProfile.gender

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

    # Add classname to elements alá BEM-syntax

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

  reverseList: ->
    #This function is not done.
    allWorkOut = document.querySelectorAll('.work-out-container--background')

  editMode: (e)->

  #Visa edit mode again...

  noEditMode: (e) ->
    self = this

    #Get and put input value into variables
    nameInputValue = e.target.parentElement.parentElement.parentElement.childNodes[0].childNodes[0].childNodes[0].value
    quantityInputValue = e.target.parentElement.parentElement.parentElement.childNodes[1].childNodes[0].childNodes[0].value
    repQuantityValue = e.target.parentElement.parentElement.parentElement.childNodes[1].childNodes[2].childNodes[0].value
    backgroundElement = e.target.parentElement.parentElement.parentElement.parentElement

    #Hide table
    tableElement = e.target.parentElement.parentElement.parentElement
    tableElement.className = tableElement.className + " hidden"

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

    # Add classname to elements alá BEM-syntax
    table.className = 'show-work-out-container__table'
    tdName.className = 'show-work-out-container__table-add__name'
    tdQuantity.className = 'show-work-out-container__table-add__quanity'
    tdworkOutMultiplication.className = 'show-work-out-container__table-add__workout-multiplication'
    tdMultiSymbol.className =  'show-work-out-container__table-add__td-muliply-symbol'
    editButton.className = 'show-work-out-container__table-add__edit-button'

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
    nameInput.innerHTML = nameInputValue
    quantityInput.innerHTML = quantityInputValue
    workOutMultiplicationInput.innerHTML = repQuantityValue

  backToEditMode: (e) ->
    console.log "Back To Edit Mode ON"


  deleteIt: (e) ->
    #This delete the whole container with input fields and buttons
    e.target.parentNode.parentNode.parentNode.parentNode.remove()


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

  }
document.addEventListener 'DOMContentLoaded', ->
  logerApp.init()
