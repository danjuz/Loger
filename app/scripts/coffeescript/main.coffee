dateNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec']

class LogerApp
    constructor: ->
        @connectionToFirebase = new Firebase('https://loger.firebaseio.com/')
        @url ='http://loger.daju.se/'

        @loginButton = document.querySelector('.register-login-container__button')
        @addButton = document.querySelector('.add-container__button')
        @saveButton = document.querySelector('.save-content__button')

        @okButton = document.querySelector('.work-out-container__table-add__ok-button')
        @workOutContainer = document.querySelector('.work-out-container')
        @workOutTable = document.querySelectorAll('.work-out-container--background')
        @playButton = document.querySelector('.add-container__form-container__form__play-button')
        @timerContainer = document.querySelector('.add-container__form-container')
        @pauseButton = document.querySelector('.add-container__form__pause-button')
        @stopWatchInput = document.querySelector('.add-container__form-container__form__timer-input')

        @nameInput = document.querySelectorAll('.work-out-container__table-add__name-input')
        @quantitytInput = document.querySelectorAll('.work-out-container__table-add__quanity-input')
        @multiInput = document.querySelectorAll('.work-out-container__table-add__workout-multiplication-input')

        @logoutButton = document.querySelector('.header__main-container-logout')

        @spinnerContainer = document.querySelector('.spinner-wrapper')
        @headerHref = document.querySelector('.header__main-container-logo-href')

        @bindInitialEvents()

    bindInitialEvents: =>
        @dateOfToday()
        if (window.location.href == 'http://localhost:9000/' || window.location.href == 'http://www.localhost:9000/' )
            @loginButton.addEventListener 'click', =>
                @redirectWithFBAndFB()

        if (window.location.href == 'http://localhost:9000/logg-results.html' || window.location.href == 'http://localhost:9000/logg-results.html')
            @testForUid()
            @stopWatch()
            @saveButton.addEventListener 'click', =>
                @flash()
                @saveContentToFireBase()

            @logoutButton.addEventListener 'click', =>
                localStorage.clear()
                window.location.href = @url

            @addButton.addEventListener 'click', =>
                @addEditWorkOut()
                @removeClass @saveButton, 'hidden'
                @removeClass @timerContainer, 'hidden'

                allWorkOutOkButtons = document.querySelectorAll('.work-out-container__table-add__ok-button')
                allWorkOutDeleteButtons = document.querySelectorAll('.work-out-container__table-add__delete-button')
                allEditButtons = document.getElementsByClassName('show-work-out-container__table-add__edit-button')
                showName = document.querySelectorAll('show-work-out-container__table-add__nameInput')
                quantityName = document.querySelectorAll('show-work-out-container__table-add__quantityInput')
                multiplyName = document.querySelectorAll('show-work-out-container__table-add__multiplyInput')

                for item in allWorkOutOkButtons
                    item.addEventListener 'click', (e)=>
                        @getContentInput(e)

                  for item in allEditButtons
                      item.addEventListener 'click', (e)=>
                          @backToEditMode(e)

                for item in allWorkOutDeleteButtons
                  item.addEventListener 'click', (e)=>
                      @deleteIt(e)

        if (window.location.href == 'http://localhost:9000/statistic.html' || window.location.href == 'http://www.localhost:9000/statistic.html')
            @testForUid()
            @retrievingData()

    dateOfToday: =>
        today = new Date()
        date = today.getDate()
        month = today.getMonth()

        dateLocation = document.querySelector('.header__date-area')
        dateLocation.innerHTML = "<div class='date-area__date'>" + date + "</div><br/><div class='date-area__month'>" + dateNames[month] + "</div>"

    redirectWithFBAndFB: =>
        ref = new Firebase('https://loger.firebaseio.com')
        ref.authWithOAuthPopup 'facebook', (error, authData) =>
          if error
              console.log 'FacebookErrorMsg: ', error
          else
            @saveUserToFirebase(authData)

    saveUserToFirebase: (userData) =>
        @checkIfUserExists userData.facebook.id, userData

    checkIfUserExists: (userId, userData) =>
        @connectionToFirebase.child("users").child(userId).once 'value', (snapshot) =>
            exists = snapshot.val() != null
            @userExistsCallback userId, exists, userData

    userExistsCallback: (userId, exists, userData) =>
        if exists
            window.location.href = @url+'logg-results.html'
        else
            fbInformation = userData
            id = fbInformation.facebook.id
            usersRef = @connectionToFirebase.child("users")

            usersRef.child(fbInformation.facebook.id).set
                displayName: fbInformation.facebook.displayName,
                first_name: fbInformation.facebook.cachedUserProfile.first_name,
                last_name:  fbInformation.facebook.cachedUserProfile.last_name,
                profileImageURL: fbInformation.facebook.profileImageURL,
                gender: fbInformation.facebook.cachedUserProfile.gender

            window.location.href = @url+'logg-results.html'

    addEditWorkOut: =>
        @bindEvents
        # Create every needed element to create the dynamic list of workout.

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

        # Add classname and required attr to elements

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
        @workOutContainer.appendChild(background)

        if (nameInput)
            nameInput.focus()

    getContentInput: (e) =>
        #Get and put input value into variables
        nameInputValue = e.target.parentElement.parentElement.parentElement.childNodes[0].childNodes[0].childNodes[0].value
        quantityInputValue = e.target.parentElement.parentElement.parentElement.childNodes[1].childNodes[0].childNodes[0].value
        repQuantityValue = e.target.parentElement.parentElement.parentElement.childNodes[1].childNodes[2].childNodes[0].value
        backgroundElement = e.target.parentElement.parentElement.parentElement.parentElement

        namePlaceholder = e.target.parentElement.parentElement.parentElement.parentElement.childNodes[1]
        quantityPlaceholder = e.target.parentElement.parentElement.parentElement.parentElement.childNodes[1]
        multiplyPlaceholder = e.target.parentElement.parentElement.parentElement

        if(e.target.parentNode.parentNode.parentNode.parentNode.childNodes[1])
            # Put value inside the right div
            #namePlaceholder.innerHTML = nameInputValue
            #@quantityName.innerHTML = quantityInputValue
            #@multiplyName.innerHTML = repQuantityValue

            tableElement = e.target.parentElement.parentElement.parentElement
            showElement = e.target.parentNode.parentNode.parentNode.parentNode.childNodes[1]

            @addClass tableElement, 'hidden'
            @removeClass showElement, 'hidden'

        else
            @noEditMode(e, nameInputValue, quantityInputValue, repQuantityValue, backgroundElement)

    noEditMode: (e, nameInputValue, quantityInputValue, repQuantityValue, backgroundElement) =>
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
        nameInput.innerHTML = nameInputValue
        quantityInput.innerHTML = quantityInputValue
        workOutMultiplicationInput.innerHTML = repQuantityValue

    backToEditMode: (e) =>
        tableElement = e.target.parentNode.parentNode.firstChild
        @removeClass(tableElement, 'hidden')

        showStats = e.target.parentNode.parentNode.childNodes[1]
        @addClass(showStats, 'hidden')

    deleteIt: (e) =>
        #This delete the whole container with input fields and buttons
        e.target.parentNode.parentNode.parentNode.parentNode.remove()

    addClass: (element, className) =>
        element.classList.add(className)

    removeClass: (element, className) =>
        element.classList.remove(className);

     stopWatch: () =>
        timer_is_on = 0
        sekTime = 0
        minTime = 0
        minGost = ''
        sekGost = ''
        zeroGost = ''
        t = t

        timedCount = =>
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

            @stopWatchInput.value = zeroGost + minGost + minTime + ':' + zeroGost + sekGost + sekTime

            t = setTimeout((=>
                timedCount()
                return
                ), 1000)

        @playButton.addEventListener 'click', (e)=>
            if (!timer_is_on)
                timer_is_on = 1
                timedCount()

        @pauseButton.addEventListener 'click', (e)=>
            clearTimeout(t)
            timer_is_on = 0

    saveContentToFireBase: =>
        trainingName = document.querySelectorAll('.show-work-out-container__table-add__nameInput')
        reps = document.querySelectorAll('.show-work-out-container__table-add__quantityInput')
        howManyTimes = document.querySelectorAll('.show-work-out-container__table-add__multiplyInput')
        workoutcontainer = document.querySelectorAll('.work-out-container--background')
        date =  document.querySelector('.date-area__date').innerHTML + ' ' + document.querySelector('.date-area__month').innerHTML
        time = document.querySelector('.add-container__form-container__form__timer-input').value

        uid = JSON.parse(window.localStorage['firebase:session::loger']).uid
        resultUid = uid.slice(9)

        postsRef = @connectionToFirebase.child("users").child(resultUid).child("sessions")

        for item in [0...workoutcontainer.length] by 1
          postsRef.push
            'trainingName': trainingName[item].textContent,
            'reps': reps[item].textContent,
            'howManyTimes': howManyTimes[item].textContent,
            'time': time,
            'date': date

    retrievingData: =>
        uid = JSON.parse(window.localStorage['firebase:session::loger']).uid
        resultUid = uid.slice(9)

        @connectionToFirebase.on 'child_added', ((snapshot, prevChildKey) =>
            data =  snapshot.val()
            session = data[resultUid].sessions

            for key of session
                @appendingData session[key].trainingName, session[key].date, session[key].howManyTimes, session[key].reps,
            @headerHref.classList.remove('spinner')
            ), (errorObject) ->
              console.log 'The read failed: ', errorObject.code

    appendingData: (trainingName, date, howManyTimes, reps) =>
        trainingNumber = document.querySelector('.user-training-number')
        trainingNumber.innerHTML = trainingName.length

    testForUid: =>
        #test if visitor has id from facebook login, if not, redirect to login page. Vaildate with regex.
        regex = /facebook:[0-9]+$/gm
        object = if window.localStorage['firebase:session::loger'] then JSON.parse(window.localStorage['firebase:session::loger']).uid else []
        fbImg = if window.localStorage['firebase:session::loger'] then JSON.parse(window.localStorage['firebase:session::loger']) else []
        @addImgToLogo fbImg.facebook.profileImageURL

        if typeof object == "object" || !object.match regex
            window.location.href = @url
            return

    flash: =>
        @saveButton.innerHTML = "<div class='flash'>Sparat</div>"
        window.setTimeout (=>
            window.location.href = @url+'logg-results.html'
            return
            ), 1500

    addImgToLogo: (imgUrl) =>
        @headerHref.setAttribute 'src', imgUrl

document.addEventListener 'DOMContentLoaded', (event) =>
    logerApp = new LogerApp()
