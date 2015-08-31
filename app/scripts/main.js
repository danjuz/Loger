(function() {
  var dateNames, logerApp;

  dateNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];

  logerApp = {
    connectionToFirebase: new Firebase("https://loger.firebaseio.com/"),
    loginButton: document.querySelector('.register-login-container'),
    addButton: document.querySelector('.add-container__button'),
    okButton: document.querySelector('.work-out-container__table-add__ok-button'),
    workOutContainer: document.querySelector('.work-out-container'),
    workOutTable: document.querySelector('.work-out-container--background'),
    playButton: document.querySelector('.add-container__form__play-button'),
    pauseButton: document.querySelector('.add-container__form__pause-button'),
    init: function() {
      return this.bindInitialEvents();
    },
    bindInitialEvents: function() {
      var self;
      self = this;
      this.dateOfToday();
      if (window.location.href === 'http://localhost:9000/') {
        self.loginButton.addEventListener('click', function() {
          return self.redirectWithFBAndFB();
        });
      }
      if (window.location.href === 'http://www.localhost:9000/logg-results.html') {
        return self.addButton.addEventListener('click', function() {
          var allWorkOutDeleteButtons, allWorkOutOkButtons, i, j, k, ref1, ref2;
          self.addEditWorkOut();
          if (document.querySelector('.work-out-container--background')) {
            self.reverseList();
            allWorkOutOkButtons = document.querySelectorAll('.work-out-container__table-add__ok-button');
            allWorkOutDeleteButtons = document.querySelectorAll('.work-out-container__table-add__delete-button');
            for (i = j = 0, ref1 = allWorkOutOkButtons.length; 0 <= ref1 ? j < ref1 : j > ref1; i = 0 <= ref1 ? ++j : --j) {
              allWorkOutOkButtons[i].addEventListener('click', function(e) {
                return self.showFromDb(e);
              });
            }
            for (i = k = 0, ref2 = allWorkOutDeleteButtons.length; 0 <= ref2 ? k < ref2 : k > ref2; i = 0 <= ref2 ? ++k : --k) {
              allWorkOutDeleteButtons[i].addEventListener('click', function(e) {
                return self.deleteIt(e);
              });
            }
          }
          return document.querySelector('.work-out-container__table-add__delete-button').addEventListener('click', function(e) {
            return self.deleteIt(e);
          });
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
      return ref.authWithOAuthPopup('facebook', function(error, authData) {
        if (error) {
          console.log('Login Failed!', error);
        } else {
          self.saveToFirebase(authData);
          window.location.href = 'http://www.localhost:9000/logg-results.html';
        }
      });
    },
    saveToFirebase: function(fbValue) {
      var fbInformation, ref, usersRef;
      fbInformation = fbValue;
      ref = this.connectionToFirebase;
      usersRef = ref.child('users');
      return usersRef.push({
        information: {
          id: fbInformation.facebook.id,
          displayName: fbInformation.facebook.displayName,
          first_name: fbInformation.facebook.cachedUserProfile.first_name,
          last_name: fbInformation.facebook.cachedUserProfile.last_name,
          profileImageURL: fbInformation.facebook.profileImageURL,
          gender: fbInformation.facebook.cachedUserProfile.gender
        }
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
    reverseList: function() {
      var allWorkOut;
      return allWorkOut = document.querySelectorAll('.work-out-container--background');
    },
    showFromDb: function(e) {
      var ref;
      console.log('Number input fields ', e.target.parentNode.parentNode.previousElementSibling.firstChild.childNode);
      console.log('Name input fields ', e.target.parentNode.parentNode.previousElementSibling.previousElementSibling.firstChild);
      return ref = this.connectionToFirebase;

      /*
      ref.on "value", (snapshot) ->
        console.log 'TESTING MOTHERF ',snapshot.val()
        (errorObject) ->
          console.log 'The read failed:' + errorObject.code
       */
    },
    deleteIt: function(e) {
      return e.target.parentNode.parentNode.parentNode.remove();
    },
    stopWatch: function() {
      var c, t, timer_is_on;
      c = 0;
      t;
      timer_is_on = 0;
      document.getElementById('txt').value = c;
      c = c + 1;
      t = setTimeout((function() {
        timedCount();
      }), 1000);
      return doTimer(function() {
        if (!timer_is_on) {
          timer_is_on = 1;
          timedCount();
        }
        return stopCount(function() {
          clearTimeout(t);
          return timer_is_on = 0;
        });
      });
    }
  };

  document.addEventListener('DOMContentLoaded', function() {
    return logerApp.init();
  });

}).call(this);
