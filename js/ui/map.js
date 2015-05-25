function locationBar(location) {
  var date = new XDate(location.date)
  var days = date.diffDays()
  var date_format
  if(days < 7) {
    date_format = "ddd h:mmtt"
  } else {
    date_format = "MMM-dd h:mmtt"
  }
  var point_last_html = '<time datetime='+JSON.stringify(location.date)+
                        ' data-format='+JSON.stringify(date_format)+
                        '/>'
  $('#last_point').html(point_last_html)
  time_fixups('#last_point')
}
