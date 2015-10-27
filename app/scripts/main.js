(function() {
  var dateNames, logerApp;

  dateNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];

  logerApp = {
    connectionToFirebase: new Firebase('https://loger.firebaseio.com/'),
    loginButton: document.querySelector('.register-login-container__button'),
    addButton: document.querySelector('.add-container__button'),
    saveButton: document.querySelector('.save-content__button'),
    okButton: document.querySelector('.work-out-container__table-add__ok-button'),
    workOutContainer: document.querySelector('.work-out-container'),
    workOutTable: document.querySelectorAll('.work-out-container--background'),
    playButton: document.querySelector('.add-container__form-container__form__play-button'),
    timerContainer: document.querySelector('.add-container__form-container'),
    pauseButton: document.querySelector('.add-container__form__pause-button'),
    stopWatchInput: document.querySelector('.add-container__form-container__form__timer-input'),
    nameInput: document.querySelectorAll('.work-out-container__table-add__name-input'),
    quantitytInput: document.querySelectorAll('.work-out-container__table-add__quanity-input'),
    multiInput: document.querySelectorAll('.work-out-container__table-add__workout-multiplication-input'),
    logoutButton: document.querySelector('.header__main-container-logout'),
    constructor: function() {
      return this.bindInitialEvents();
    },
    bindInitialEvents: function() {
      var obj, regex, self;
      self = this;
      this.dateOfToday();
      if (window.location.href === 'http://localhost:9000/') {
        self.loginButton.addEventListener('click', function() {
          return self.redirectWithFBAndFB();
        });
      }
      if (window.location.href === 'http://localhost:9000/logg-results.html' || window.location.href === 'http://www.localhost:9000/logg-results.html') {
        regex = /facebook:[0-9]+$/gm;
        obj = window.localStorage['firebase:session::loger'] ? JSON.parse(window.localStorage['firebase:session::loger']).uid : [];
        if (typeof obj === "object" || !obj.match(regex)) {
          window.location.href = 'http://localhost:9000/';
        }
        self.stopWatch();
        self.saveButton.addEventListener('click', function() {
          return self.saveContentToFireBase();
        });
        self.logoutButton.addEventListener('click', function() {
          localStorage.clear();
          return window.location.href = 'http://localhost:9000/';
        });
        return self.addButton.addEventListener('click', function() {
          var allEditButtons, allWorkOutDeleteButtons, allWorkOutOkButtons, i, item, j, len, len1, multiplyName, quantityName, results, showName;
          self.addEditWorkOut();
          self.removeClass(self.saveButton, 'hidden');
          self.removeClass(self.timerContainer, 'hidden');
          allWorkOutOkButtons = document.querySelectorAll('.work-out-container__table-add__ok-button');
          allWorkOutDeleteButtons = document.querySelectorAll('.work-out-container__table-add__delete-button');
          allEditButtons = document.getElementsByClassName('show-work-out-container__table-add__edit-button');
          showName = document.querySelectorAll('show-work-out-container__table-add__nameInput');
          quantityName = document.querySelectorAll('show-work-out-container__table-add__quantityInput');
          multiplyName = document.querySelectorAll('show-work-out-container__table-add__multiplyInput');
          for (i = 0, len = allWorkOutOkButtons.length; i < len; i++) {
            item = allWorkOutOkButtons[i];
            item.addEventListener('click', function(e) {
              var j, len1, results;
              self.getContentInput(e);
              results = [];
              for (j = 0, len1 = allEditButtons.length; j < len1; j++) {
                item = allEditButtons[j];
                results.push(item.addEventListener('click', function(e) {
                  return self.backToEditMode(e);
                }));
              }
              return results;
            });
          }
          results = [];
          for (j = 0, len1 = allWorkOutDeleteButtons.length; j < len1; j++) {
            item = allWorkOutDeleteButtons[j];
            results.push(item.addEventListener('click', function(e) {
              return self.deleteIt(e);
            }));
          }
          return results;
        });
      }
    },
    dateOfToday: function() {
      var date, dateLocation, month, today;
      today = new Date();
      date = today.getDate();
      month = today.getMonth();
      dateLocation = document.querySelector('.header__date-area');
      return dateLocation.innerHTML = "<div class='date-area__date'>" + date + "</div><br/><div class='date-area__month'>" + dateNames[month] + "</div>";
    },
    redirectWithFBAndFB: function() {
      var ref, self;
      self = this;
      ref = new Firebase('https://loger.firebaseio.com');
      ref.authWithOAuthPopup('facebook', function(error, authData) {
        if (error) {
          return console.log('FacebookErrorMsg: ', error);
        } else {
          return window.location.href = 'http://localhost:9000/logg-results.html';
        }
      });
    },
    saveUserToFirebase: function(userData) {
      var fbInformation, id, ref, usersRef;
      fbInformation = userData;
      id = fbInformation.facebook.id;
      ref = this.connectionToFirebase;
      usersRef = ref.child("users");
      return usersRef.child(fbInformation.facebook.id).set({
        displayName: fbInformation.facebook.displayName,
        first_name: fbInformation.facebook.cachedUserProfile.first_name,
        last_name: fbInformation.facebook.cachedUserProfile.last_name,
        profileImageURL: fbInformation.facebook.profileImageURL,
        gender: fbInformation.facebook.cachedUserProfile.gender
      });
    },
    addEditWorkOut: function() {
      var background, deleteButton, deleteButtonText, multiSymbol, nameInput, okButton, okButtonText, quantityInput, self, table, tdDeleteButton, tdMultiSymbol, tdName, tdOkButton, tdQuantity, tdworkOutMultiplication, trButtons, trName, trQuantity, workOutMultiplicationInput;
      this.bindEvents;
      self = this;
      background = document.createElement('div');
      table = document.createElement('table');
      trName = document.createElement('tr');
      trQuantity = document.createElement('tr');
      trButtons = document.createElement('tr');
      tdName = document.createElement('td');
      tdQuantity = document.createElement('td');
      tdworkOutMultiplication = document.createElement('td');
      tdDeleteButton = document.createElement('td');
      tdOkButton = document.createElement('td');
      tdMultiSymbol = document.createElement('td');
      nameInput = document.createElement('input');
      quantityInput = document.createElement('input');
      workOutMultiplicationInput = document.createElement('input');
      deleteButton = document.createElement('div');
      okButton = document.createElement('div');
      deleteButtonText = document.createTextNode('Delete');
      okButtonText = document.createTextNode('Ok');
      multiSymbol = document.createTextNode('X');
      deleteButton.appendChild(deleteButtonText);
      okButton.appendChild(okButtonText);
      tdMultiSymbol.appendChild(multiSymbol);
      background.className = 'work-out-container--background';
      table.className = 'work-out-container__table';
      tdDeleteButton.className = 'work-out-container__table-add__delete-button';
      tdOkButton.className = 'work-out-container__table-add__ok-button';
      tdName.className = 'work-out-container__table-add__name-input';
      tdQuantity.className = 'work-out-container__table-add__quanity-input';
      tdworkOutMultiplication.className = 'work-out-container__table-add__workout-multiplication-input';
      tdMultiSymbol.className = 'work-out-container__table-add__td-muliply-symbol';
      okButton.className = 'work-out-container__table-add__div-ok_button';
      deleteButton.className = 'work-out-container__table-add__div-delete-button';
      tdName.colSpan = 20;
      tdQuantity.colSpan = 8;
      tdMultiSymbol.colSpan = 4;
      tdworkOutMultiplication.colSpan = 4;
      tdDeleteButton.colSpan = 10;
      tdOkButton.colSpan = 10;
      tdName.appendChild(nameInput);
      tdQuantity.appendChild(quantityInput);
      tdworkOutMultiplication.appendChild(workOutMultiplicationInput);
      tdDeleteButton.appendChild(deleteButton);
      tdOkButton.appendChild(okButton);
      trName.appendChild(tdName);
      trQuantity.appendChild(tdQuantity);
      trQuantity.appendChild(tdMultiSymbol);
      trQuantity.appendChild(tdworkOutMultiplication);
      trButtons.appendChild(tdDeleteButton);
      trButtons.appendChild(tdOkButton);
      table.appendChild(trName);
      table.appendChild(trQuantity);
      table.appendChild(trButtons);
      background.appendChild(table);
      this.workOutContainer.appendChild(background);
      if (nameInput) {
        return nameInput.focus();
      }
    },
    getContentInput: function(e) {
      var backgroundElement, multiplyPlaceholder, nameInputValue, namePlaceholder, quantityInputValue, quantityPlaceholder, repQuantityValue, showElement, tableElement;
      nameInputValue = e.target.parentElement.parentElement.parentElement.childNodes[0].childNodes[0].childNodes[0].value;
      quantityInputValue = e.target.parentElement.parentElement.parentElement.childNodes[1].childNodes[0].childNodes[0].value;
      repQuantityValue = e.target.parentElement.parentElement.parentElement.childNodes[1].childNodes[2].childNodes[0].value;
      backgroundElement = e.target.parentElement.parentElement.parentElement.parentElement;
      namePlaceholder = e.target.parentElement.parentElement.parentElement.parentElement.childNodes[1];
      quantityPlaceholder = e.target.parentElement.parentElement.parentElement.parentElement.childNodes[1];
      multiplyPlaceholder = e.target.parentElement.parentElement.parentElement;
      if (e.target.parentNode.parentNode.parentNode.parentNode.childNodes[1]) {
        tableElement = e.target.parentElement.parentElement.parentElement;
        showElement = e.target.parentNode.parentNode.parentNode.parentNode.childNodes[1];
        this.addClass(tableElement, 'hidden');
        return this.removeClass(showElement, 'hidden');
      } else {
        return this.noEditMode(e, nameInputValue, quantityInputValue, repQuantityValue, backgroundElement);
      }
    },
    noEditMode: function(e, nameInputValue, quantityInputValue, repQuantityValue, backgroundElement) {
      var editButton, multiSymbol, nameInput, quantityInput, self, table, tableElement, tdMultiSymbol, tdName, tdQuantity, tdworkOutMultiplication, trButtons, trName, trQuantity, workOutMultiplicationInput;
      self = this;
      tableElement = e.target.parentElement.parentElement.parentElement;
      tableElement.className = tableElement.className + ' hidden';
      table = document.createElement('table');
      trName = document.createElement('tr');
      trQuantity = document.createElement('tr');
      trButtons = document.createElement('tr');
      tdName = document.createElement('td');
      tdQuantity = document.createElement('td');
      tdworkOutMultiplication = document.createElement('td');
      tdMultiSymbol = document.createElement('td');
      nameInput = document.createElement('div');
      quantityInput = document.createElement('div');
      workOutMultiplicationInput = document.createElement('div');
      editButton = document.createElement('div');
      multiSymbol = document.createTextNode('X');
      tdMultiSymbol.appendChild(multiSymbol);
      table.className = 'show-work-out-container__table';
      tdName.className = 'show-work-out-container__table-add__name';
      tdQuantity.className = 'show-work-out-container__table-add__quanity';
      tdworkOutMultiplication.className = 'show-work-out-container__table-add__workout-multiplication';
      tdMultiSymbol.className = 'show-work-out-container__table-add__td-muliply-symbol';
      editButton.className = 'show-work-out-container__table-add__edit-button';
      nameInput.className = 'show-work-out-container__table-add__nameInput';
      quantityInput.className = 'show-work-out-container__table-add__quantityInput';
      workOutMultiplicationInput.className = 'show-work-out-container__table-add__multiplyInput';
      tdName.colSpan = 20;
      tdQuantity.colSpan = 8;
      tdMultiSymbol.colSpan = 4;
      tdworkOutMultiplication.colSpan = 4;
      tdName.appendChild(nameInput);
      tdQuantity.appendChild(quantityInput);
      tdworkOutMultiplication.appendChild(workOutMultiplicationInput);
      trName.appendChild(tdName);
      trQuantity.appendChild(tdQuantity);
      trQuantity.appendChild(tdMultiSymbol);
      trQuantity.appendChild(tdworkOutMultiplication);
      table.appendChild(trName);
      table.appendChild(trQuantity);
      table.appendChild(editButton);
      backgroundElement.appendChild(table);
      nameInput.innerHTML = nameInputValue;
      quantityInput.innerHTML = quantityInputValue;
      return workOutMultiplicationInput.innerHTML = repQuantityValue;
    },
    backToEditMode: function(e) {
      var showStats, tableElement;
      tableElement = e.target.parentNode.parentNode.firstChild;
      this.removeClass(tableElement, 'hidden');
      showStats = e.target.parentNode.parentNode.childNodes[1];
      return this.addClass(showStats, 'hidden');
    },
    deleteIt: function(e) {
      return e.target.parentNode.parentNode.parentNode.parentNode.remove();
    },
    addClass: function(element, className) {
      return element.classList.add(className);
    },
    removeClass: function(element, className) {
      return element.classList.remove(className);
    },
    stopWatch: function() {
      var minGost, minTime, sekGost, sekTime, self, t, timedCount, timer_is_on, zeroGost;
      self = this;
      timer_is_on = 0;
      sekTime = 0;
      minTime = 0;
      minGost = '';
      sekGost = '';
      zeroGost = '';
      t = t;
      timedCount = function() {
        sekTime += 1;
        if (sekTime >= 10) {
          sekGost = '';
        }
        if (sekTime <= 10) {
          sekGost = '0';
        }
        if (minTime >= 10) {
          minGost = '';
        }
        if (minTime <= 10) {
          minGost = '0';
        }
        if (sekTime >= 60) {
          sekTime = 0;
          minTime += 1;
        }
        self.stopWatchInput.value = zeroGost + minGost + minTime + ':' + zeroGost + sekGost + sekTime;
        return t = setTimeout((function() {
          timedCount();
        }), 1000);
      };
      self.playButton.addEventListener('click', function(e) {
        if (!timer_is_on) {
          timer_is_on = 1;
          return timedCount();
        }
      });
      return this.pauseButton.addEventListener('click', function(e) {
        clearTimeout(t);
        return timer_is_on = 0;
      });
    },
    saveContentToFireBase: function() {
      if ($('.show-work-out-container__table-add__nameInput').length) {
        console.log('Alla namn', $('.show-work-out-container__table-add__nameInput'));
        console.log('Alla quantityInput', $('.show-work-out-container__table-add__quantityInput'));
        console.log('Alla multuplyInput', $('.show-work-out-container__table-add__multiplyInput'));
        return console.log('tid', $('.add-container__form-container__form__timer-input')[0].value);
      }
    }
  };

  document.addEventListener('DOMContentLoaded', function() {
    return logerApp.constructor();
  });

}).call(this);
