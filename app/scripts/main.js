(function() {
  var dateNames, dateOfToday;

  dateNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];

  dateOfToday = function() {
    var date, dateLocation, month, today;
    today = new Date();
    date = today.getDate();
    month = today.getMonth();
    dateLocation = document.querySelector('.header__date-area');
    return dateLocation.innerHTML = date + '<br>' + dateNames[month];
  };

  dateOfToday();

}).call(this);
