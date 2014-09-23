var map = function(){
  var api = {}
  var map = map_leaflet
  var tracks = {}


  api.setup = function(center, zoom){
    map.setup(center, zoom)
  }

  api.addTrack = function(track_id, name) {
    console.log("creating track "+track_id+" name "+name)
    var line = L.polyline([], {color: 'red'})
    line.addTo(map.map)
    var marker = L.marker([0,0]) // fix this
    marker.addTo(map.map)
    tracks[track_id] = { name: name, points: [], line: line, marker: marker }
  }

  api.addPointToTrack = function(track_id, point) {
    console.log('adding to track '+track_id)
    var point_date_html = '<time datetime="'+point.date+'" data-format="yyyy-MMM-d hh:mmtt"/>'
    var position = api.add_point(track_id, point)
    if(position == 0) {
      console.log('adding newest point '+point.date)
      $('#last_point').html(point_date_html)
      var pt = [point.latitude, point.longitude]
      tracks[track_id].marker.setLatLng(pt)
      map_leaflet.map.panTo(pt)
      map_leaflet.map.setZoom(16)
    }
    $('#points').append('<li>'+point_date_html+'</li>')
    time_fixups()
  }

  api.add_point = function(track_id, point) {
    var line = tracks[track_id].line
    var points = tracks[track_id].points
    console.log('pre everything')
    console.log(points)
    // keep points in date sorted order
    var insert_idx = 0
    points.forEach(function(pt, idx){
      console.log('foreach idx '+idx)
      if(points[0].date < pt.date) {
        insert_idx = idx
      }
    })
    console.log('adding point at insert_idx '+insert_idx+' of len '+points.length)
    console.log('pre splice')
    console.log(points)
    points.splice(insert_idx, 0, point) // need full point
    line.spliceLatLngs(insert_idx, 0, [point.latitude,point.longitude])
    return insert_idx
  }

  api.tracks = function() { return tracks }

  return api
}()

