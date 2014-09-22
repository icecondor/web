var last_point
function addPointToTrack(track_id, point) {
  console.log('adding to track '+track_id)
  var point_date_html = '<time datetime="'+point.date+'" data-format="yyyy-MMM-d hh:mmtt"/>'
  if( typeof last_point == 'undefined' || last_point.date < point.date) {
    console.log('setting '+point.date)
    last_point = point
    $('#last_point').html(point_date_html)
  }
  $('#points').append('<li>'+point_date_html+'</li>')
  time_fixups()
  var pt = [point.latitude, point.longitude]
  L.marker(pt).addTo(map_leaflet.map)
  map_leaflet.map.panTo(pt)
  map_leaflet.map.setZoom(16)

}