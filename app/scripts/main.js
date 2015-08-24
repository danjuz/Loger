(function() {
  var dateNames, logerApp;

  dateNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];

  logerApp = {
    loginButton: document.querySelector('.register-login-container__button'),
    init: function() {
      return this.bindEvents();
    },
    bindevents: function() {
      var self;
      self = this;
      this.loginButton.addEventListener('click', function() {
        return self.redirect();
      });
      return this.dateOfToday();
    },
    dateOfToday: function() {
      var date, dateLocation, month, today;
      today = new Date();
      date = today.getDate();
      month = today.getMonth();
      dateLocation = document.querySelector('.header__date-area');
      return dateLocation.innerHTML = "<div class='date-area__date'>" + date + "</div><br/><div class='date-area__month'>" + dateNames[month] + "</div>";
    },
    redirect: function() {
      var ref;
      ref = new Firebase('https://loger.firebaseio.com');
      ref.authWithOAuthPopup('facebook', function(error, authData) {
        if (error) {
          return console.log('Login Failed!', error);
        } else {
          console.log('Authenticated successfully with payload:', authData);
          return window.location.href = 'http://www.localhost:9000/logg-results.html';
        }
      });
    }
  };

  logerApp.bindevents();

}).call(this);
