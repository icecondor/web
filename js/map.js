var map = function(){
  var api = {}
  var map = map_leaflet
  var tracks = {}


  api.setup = function(center, zoom){
    map.setup(center, zoom)
  }

  api.addTrack = function(track_id, name) {
    console.log("creating track "+track_id+" name "+name)
    // marker must have lat/long so delay until first point
    var line = map.addPolyline({color: 'red'})
    tracks[track_id] = { name: name, points: [], line: line, marker: null }
  }

  api.addPointToTrack = function(track_id, point) {
    var track = tracks[track_id]
    var date_order_idx = api.add_point(track_id, point)
    $('#point_count').html(track.points.length)

    if(date_order_idx == 0) {
      if(track.marker) {
        map.moveMarker(track.marker, point)
      } else {
        track.marker = map.addMarker(point)
      }
      map.setCenter(point, 16)
    }
    return date_order_idx
  }

  api.add_point = function(track_id, point) {
    var line = tracks[track_id].line
    var points = tracks[track_id].points
    // keep points in date sorted order
    var insert_idx = 0
    points.forEach(function(pt, idx){
      if(pt.date > point.date) {
        insert_idx = idx
      }
    })
    points.splice(insert_idx+1, 0, point) // need full point
    line.spliceLatLngs(insert_idx+1, 0, [point.latitude,point.longitude])
    return insert_idx
  }

  api.tracks = function() { return tracks }

  return api
}()

