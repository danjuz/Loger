dateNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec']

dateOfToday = ->
  today = new Date()
  date = today.getDate()
  month = today.getMonth()

  dateLocation = document.querySelector('.header__date-area')
  
  #dateLocation.innerHTML = "<div class='date-area__date'>" + date + "</div><br/><div class='date-area__month'>" + dateNames[month] + "</div>"
  dateLocation.innerHTML = date + '<br>' + dateNames[month]

dateOfToday()
