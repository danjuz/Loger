(function() {
  var dateNames, logerApp;

  dateNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];

  logerApp = {
    loginButton: document.querySelector('.register-login-container'),
    addButton: document.querySelector('.add-container__button'),
    workOutContainer: document.querySelector('.work-out-conatiner'),
    connectionToFirebase: new Firebase("https://loger.firebaseio.com/"),
    init: function() {
      return this.bindEvents();
    },
    bindEvents: function() {
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
          return self.addEditWorkOut();
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
          console.log('authData.facebook', authData.facebook);
          self.saveToFirebase(authData);
        }
      });
    },
    saveToFirebase: function(fbValue) {
      var fbInformation, ref, usersRef;
      fbInformation = fbValue;
      ref = this.connectionToFirebase;
      console.log('information from another function ', fbInformation);
      usersRef = ref.child('users');
      return usersRef.set({
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
      var background, deleteButton, deleteButtonText, multiSymbol, nameInput, okButton, okButtonText, quantityInput, table, tdDeleteButton, tdMultiSymbol, tdName, tdOkButton, tdQuantity, tdworkOutMultiplication, trButtons, trName, trQuantity, workOutMultiplicationInput;
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
      table.className = 'work-out-conatiner__table-add';
      tdDeleteButton.className = 'work-out-conatiner__table-add__delete-button';
      tdOkButton.className = 'work-out-conatiner__table-add__ok-button';
      tdName.className = 'work-out-conatiner__table-add__name-input';
      tdQuantity.className = 'work-out-conatiner__table-add__quanity-input';
      tdworkOutMultiplication.className = 'work-out-conatiner__table-add__workout-multiplication-input';
      tdMultiSymbol.className = 'work-out-conatiner__table-add__td-muliply-symbol';
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
      return this.workOutContainer.appendChild(background);
    }
  };

  document.addEventListener('DOMContentLoaded', function() {
    return logerApp.init();
  });

}).call(this);
