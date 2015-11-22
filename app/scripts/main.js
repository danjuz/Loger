(function() {
  var LogerApp, dateNames,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  dateNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];

  LogerApp = (function() {
    function LogerApp() {
      this.addImgToLogo = bind(this.addImgToLogo, this);
      this.flash = bind(this.flash, this);
      this.testForUid = bind(this.testForUid, this);
      this.appendingDataStatistic = bind(this.appendingDataStatistic, this);
      this.retrievingData = bind(this.retrievingData, this);
      this.saveContentToFireBase = bind(this.saveContentToFireBase, this);
      this.stopWatch = bind(this.stopWatch, this);
      this.removeClass = bind(this.removeClass, this);
      this.addClass = bind(this.addClass, this);
      this.deleteIt = bind(this.deleteIt, this);
      this.backToEditMode = bind(this.backToEditMode, this);
      this.noEditMode = bind(this.noEditMode, this);
      this.getContentInput = bind(this.getContentInput, this);
      this.addEditWorkOut = bind(this.addEditWorkOut, this);
      this.userExistsCallback = bind(this.userExistsCallback, this);
      this.checkIfUserExists = bind(this.checkIfUserExists, this);
      this.saveUserToFirebase = bind(this.saveUserToFirebase, this);
      this.redirectWithFBAndFB = bind(this.redirectWithFBAndFB, this);
      this.dateOfToday = bind(this.dateOfToday, this);
      this.bindInitialEvents = bind(this.bindInitialEvents, this);
      this.connectionToFirebase = new Firebase('https://loger.firebaseio.com/');
      this.url = 'http://localhost:9000/';
      this.loginButton = document.querySelector('.register-login-container__button');
      this.addButton = document.querySelector('.add-container__button');
      this.saveButton = document.querySelector('.save-content__button');
      this.okButton = document.querySelector('.work-out-container__table-add__ok-button');
      this.workOutContainer = document.querySelector('.work-out-container');
      this.workOutTable = document.querySelectorAll('.work-out-container--background');
      this.playButton = document.querySelector('.add-container__form-container__form__play-button');
      this.timerContainer = document.querySelector('.add-container__form-container');
      this.pauseButton = document.querySelector('.add-container__form__pause-button');
      this.stopWatchInput = document.querySelector('.add-container__form-container__form__timer-input');
      this.nameInput = document.querySelectorAll('.work-out-container__table-add__name-input');
      this.quantitytInput = document.querySelectorAll('.work-out-container__table-add__quanity-input');
      this.multiInput = document.querySelectorAll('.work-out-container__table-add__workout-multiplication-input');
      this.logoutButton = document.querySelector('.footer__main-container-logout');
      this.spinnerContainer = document.querySelector('.spinner-wrapper');
      this.headerHref = document.querySelector('.header__main-container-logo-href');
      this.arrayTraining = [];
      this.arrayTrainginName = [];
      this.bindInitialEvents();
    }

    LogerApp.prototype.bindInitialEvents = function() {
      this.dateOfToday();
      if (window.location.href === 'http://loger.daju.se/' || window.location.href === 'http://localhost:9000/') {
        this.loginButton.addEventListener('click', ((function(_this) {
          return function() {
            _this.redirectWithFBAndFB();
          };
        })(this)), false);
      }
      if (window.location.href === 'http://localhost:9000/logg-results.html' || window.location.href === 'http://loger.daju.se/logg-results.html') {
        this.testForUid();
        this.stopWatch();
        this.addImgToLogo();
        this.saveButton.addEventListener('click', (function(_this) {
          return function() {
            _this.flash();
            return _this.saveContentToFireBase();
          };
        })(this));
        this.logoutButton.addEventListener('click', (function(_this) {
          return function() {
            localStorage.clear();
            return window.location.href = _this.url;
          };
        })(this));
        this.addButton.addEventListener('click', (function(_this) {
          return function() {
            var allEditButtons, allWorkOutDeleteButtons, allWorkOutOkButtons, item, j, k, len, len1, results;
            _this.addEditWorkOut();
            _this.removeClass(_this.saveButton, 'hidden');
            _this.removeClass(_this.timerContainer, 'hidden');
            allWorkOutOkButtons = document.querySelectorAll('.work-out-container__table-add__ok-button');
            allWorkOutDeleteButtons = document.querySelectorAll('.work-out-container__table-add__delete-button');
            allEditButtons = document.getElementsByClassName('show-work-out-container__table-add__edit-button');
            _this.showName = document.querySelectorAll('show-work-out-container__table-add__nameInput');
            _this.quantityName = document.querySelectorAll('show-work-out-container__table-add__quantityInput');
            _this.multiplyName = document.querySelectorAll('show-work-out-container__table-add__multiplyInput');
            for (j = 0, len = allWorkOutOkButtons.length; j < len; j++) {
              item = allWorkOutOkButtons[j];
              item.addEventListener('click', function(e) {
                var k, len1, results;
                _this.getContentInput(e);
                results = [];
                for (k = 0, len1 = allEditButtons.length; k < len1; k++) {
                  item = allEditButtons[k];
                  results.push(item.addEventListener('click', function(e) {
                    return _this.backToEditMode(e);
                  }));
                }
                return results;
              });
            }
            results = [];
            for (k = 0, len1 = allWorkOutDeleteButtons.length; k < len1; k++) {
              item = allWorkOutDeleteButtons[k];
              results.push(item.addEventListener('click', function(e) {
                return _this.deleteIt(e);
              }));
            }
            return results;
          };
        })(this));
      }
      if (window.location.href === 'http://localhost:9000/statistic.html' || window.location.href === 'http://loger.daju.se/statistic.html') {
        this.testForUid();
        this.retrievingData();
        return this.addImgToLogo();
      }
    };

    LogerApp.prototype.dateOfToday = function() {
      var date, dateLocation, month, today;
      today = new Date();
      date = today.getDate();
      month = today.getMonth();
      dateLocation = document.querySelector('.header__date-area');
      return dateLocation.innerHTML = "<div class='date-area__date'>" + date + "</div><br/><div class='date-area__month'>" + dateNames[month] + "</div>";
    };

    LogerApp.prototype.redirectWithFBAndFB = function() {
      var ref;
      ref = new Firebase('https://loger.firebaseio.com');
      return ref.authWithOAuthPopup('facebook', (function(_this) {
        return function(error, authData) {
          if (error) {
            return console.log('FacebookErrorMsg: ', error);
          } else {
            return _this.saveUserToFirebase(authData);
          }
        };
      })(this));
    };

    LogerApp.prototype.saveUserToFirebase = function(userData) {
      return this.checkIfUserExists(userData.facebook.id, userData);
    };

    LogerApp.prototype.checkIfUserExists = function(userId, userData) {
      return this.connectionToFirebase.child("users").child(userId).once('value', (function(_this) {
        return function(snapshot) {
          var exists;
          exists = snapshot.val() !== null;
          return _this.userExistsCallback(userId, exists, userData);
        };
      })(this));
    };

    LogerApp.prototype.userExistsCallback = function(userId, exists, userData) {
      var fbInformation, id, usersRef;
      if (exists) {
        return window.location.href = this.url + 'logg-results.html';
      } else {
        fbInformation = userData;
        id = fbInformation.facebook.id;
        usersRef = this.connectionToFirebase.child("users");
        usersRef.child(fbInformation.facebook.id).set({
          displayName: fbInformation.facebook.displayName,
          first_name: fbInformation.facebook.cachedUserProfile.first_name,
          last_name: fbInformation.facebook.cachedUserProfile.last_name,
          profileImageURL: fbInformation.facebook.profileImageURL,
          gender: fbInformation.facebook.cachedUserProfile.gender
        });
        return window.location.href = this.url + 'logg-results.html';
      }
    };

    LogerApp.prototype.addEditWorkOut = function() {
      var background, deleteButton, deleteButtonText, multiSymbol, nameInput, okButton, okButtonText, quantityInput, table, tdDeleteButton, tdMultiSymbol, tdName, tdOkButton, tdQuantity, tdworkOutMultiplication, trButtons, trName, trQuantity, workOutMultiplicationInput;
      this.bindEvents;
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
    };

    LogerApp.prototype.getContentInput = function(e) {
      var backgroundElement, multiplyPlaceholder, namePlaceholder, nameValueEdit, quantityInputValue, quantityPlaceholder, repQuantityValue, showElement, tableElement;
      backgroundElement = e.target.parentElement.parentElement.parentElement.parentElement;
      nameValueEdit = e.target.parentElement.parentElement.parentElement.parentElement.childNodes[0].childNodes[0].childNodes[0].childNodes[0].value;
      quantityInputValue = e.target.parentElement.parentElement.parentElement.childNodes[1].childNodes[0].childNodes[0].value;
      repQuantityValue = e.target.parentElement.parentElement.parentElement.childNodes[1].childNodes[2].childNodes[0].value;
      if (e.target.parentNode.parentNode.parentNode.parentNode.childNodes[1]) {
        namePlaceholder = e.target.parentElement.parentElement.parentElement.parentElement.childNodes[1].childNodes[0].childNodes[0].childNodes[0];
        quantityPlaceholder = e.target.parentElement.parentElement.parentElement.parentElement.childNodes[1].childNodes[1].childNodes[0].childNodes[0];
        multiplyPlaceholder = e.target.parentElement.parentElement.parentElement.parentElement.childNodes[1].childNodes[1].childNodes[2].childNodes[0];
        namePlaceholder.innerHTML = nameValueEdit;
        quantityPlaceholder.innerHTML = quantityInputValue;
        multiplyPlaceholder.innerHTML = repQuantityValue;
        tableElement = e.target.parentElement.parentElement.parentElement;
        showElement = e.target.parentNode.parentNode.parentNode.parentNode.childNodes[1];
        this.addClass(tableElement, 'hidden');
        return this.removeClass(showElement, 'hidden');
      } else {
        return this.noEditMode(e, nameValueEdit, quantityInputValue, repQuantityValue, backgroundElement);
      }
    };

    LogerApp.prototype.noEditMode = function(e, nameInputValue, quantityInputValue, repQuantityValue, backgroundElement) {
      var editButton, multiSymbol, nameInput, quantityInput, table, tableElement, tdMultiSymbol, tdName, tdQuantity, tdworkOutMultiplication, trButtons, trName, trQuantity, workOutMultiplicationInput;
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
    };

    LogerApp.prototype.backToEditMode = function(e) {
      var showStats, tableElement;
      tableElement = e.target.parentNode.parentNode.firstChild;
      this.removeClass(tableElement, 'hidden');
      showStats = e.target.parentNode.parentNode.childNodes[1];
      return this.addClass(showStats, 'hidden');
    };

    LogerApp.prototype.deleteIt = function(e) {
      return e.target.parentNode.parentNode.parentNode.parentNode.remove();
    };

    LogerApp.prototype.addClass = function(element, className) {
      return element.classList.add(className);
    };

    LogerApp.prototype.removeClass = function(element, className) {
      return element.classList.remove(className);
    };

    LogerApp.prototype.stopWatch = function() {
      var minGost, minTime, sekGost, sekTime, t, timedCount, timer_is_on, zeroGost;
      timer_is_on = 0;
      sekTime = 0;
      minTime = 0;
      minGost = '';
      sekGost = '';
      zeroGost = '';
      t = t;
      timedCount = (function(_this) {
        return function() {
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
          _this.stopWatchInput.value = zeroGost + minGost + minTime + ':' + zeroGost + sekGost + sekTime;
          return t = setTimeout((function() {
            timedCount();
          }), 1000);
        };
      })(this);
      this.playButton.addEventListener('click', (function(_this) {
        return function(e) {
          if (!timer_is_on) {
            timer_is_on = 1;
            return timedCount();
          }
        };
      })(this));
      return this.pauseButton.addEventListener('click', (function(_this) {
        return function(e) {
          clearTimeout(t);
          return timer_is_on = 0;
        };
      })(this));
    };

    LogerApp.prototype.saveContentToFireBase = function() {
      var date, howManyTimes, item, j, postsRef, ref1, reps, resultUid, results, time, trainingName, uid, workoutcontainer;
      trainingName = document.querySelectorAll('.show-work-out-container__table-add__nameInput');
      reps = document.querySelectorAll('.show-work-out-container__table-add__quantityInput');
      howManyTimes = document.querySelectorAll('.show-work-out-container__table-add__multiplyInput');
      workoutcontainer = document.querySelectorAll('.work-out-container--background');
      date = document.querySelector('.date-area__date').innerHTML + ' ' + document.querySelector('.date-area__month').innerHTML;
      time = document.querySelector('.add-container__form-container__form__timer-input').value;
      uid = JSON.parse(window.localStorage['firebase:session::loger']).uid;
      resultUid = uid.slice(9);
      postsRef = this.connectionToFirebase.child("users").child(resultUid).child("sessions");
      results = [];
      for (item = j = 0, ref1 = workoutcontainer.length; j < ref1; item = j += 1) {
        results.push(postsRef.push({
          'trainingName': trainingName[item].textContent,
          'reps': reps[item].textContent,
          'howManyTimes': howManyTimes[item].textContent,
          'time': time,
          'date': date
        }));
      }
      return results;
    };

    LogerApp.prototype.retrievingData = function() {
      var resultUid, uid;
      uid = JSON.parse(window.localStorage['firebase:session::loger']).uid;
      resultUid = uid.slice(9);
      return this.connectionToFirebase.on('child_added', ((function(_this) {
        return function(snapshot, prevChildKey) {
          var data, session;
          data = snapshot.val();
          session = data[resultUid].sessions;
          _this.appendingDataStatistic(session);
          return _this.headerHref.classList.remove('spinner');
        };
      })(this)), function(errorObject) {
        return console.log('The read failed: ', errorObject.code);
      });
    };

    LogerApp.prototype.appendingDataStatistic = function(session) {
      var i, key, li, trainingNameWrapperUl, trainingNum;
      trainingNum = document.querySelector('.statistic__user-training-number');
      trainingNameWrapperUl = document.querySelector('.statistic__wrapper__trainingName__ul');
      for (key in session) {
        this.arrayTraining.push(session[key]);
      }
      i = 0;
      while (i <= this.arrayTraining.length - 1) {
        li = document.createElement('li');
        li.innerHTML = this.arrayTraining[i].trainingName;
        trainingNameWrapperUl.appendChild(li);
        i++;
      }
      return trainingNum.innerHTML = this.arrayTraining.length;
    };

    LogerApp.prototype.testForUid = function() {
      var object, regex;
      regex = /facebook:[0-9]+$/gm;
      object = window.localStorage['firebase:session::loger'] ? JSON.parse(window.localStorage['firebase:session::loger']).uid : [];
      if (typeof object === "object" || !object.match(regex)) {
        window.location.href = this.url;
      }
    };

    LogerApp.prototype.flash = function() {
      this.saveButton.innerHTML = "<div class='flash'>Sparat</div>";
      return window.setTimeout(((function(_this) {
        return function() {
          window.location.href = _this.url + 'logg-results.html';
        };
      })(this)), 1500);
    };

    LogerApp.prototype.addImgToLogo = function() {
      var fbImg;
      fbImg = window.localStorage['firebase:session::loger'] ? JSON.parse(window.localStorage['firebase:session::loger']) : [];
      return this.headerHref.setAttribute('src', fbImg.facebook.profileImageURL);
    };

    return LogerApp;

  })();

  document.addEventListener('DOMContentLoaded', (function(_this) {
    return function(event) {
      var logerApp;
      return logerApp = new LogerApp();
    };
  })(this));

}).call(this);
