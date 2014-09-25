var map = function(){
  var api = {}
  var map = map_leaflet
  var tracks = {}


  api.setup = function(center, zoom){
    map.setup(center, zoom)
  }

  api.addTrack = function(track_id, name) {
    console.log("creating track "+track_id+" name "+name)
    var line = map.addPolyline({color: 'red'})
    tracks[track_id] = { name: name, points: [], line: line, marker: null }
  }

  api.addPointToTrack = function(track_id, point) {
    var point_date_html = '<time datetime="'+point.date+'" data-format="yyyy-MMM-d hh:mmtt"/>'
    var position = api.add_point(track_id, point)
    if(position == 0) {
      console.log('adding newest point '+point.date)
      $('#last_point').html(point_date_html)

      if(tracks[track_id].marker) {
        console.log('adjusting existing marker')
        var pt = [point.latitude, point.longitude]
        tracks[track_id].marker.setLatLng(pt)
        tracks[track_id].marker.update()
      } else {
        console.log('creating marker')
        tracks[track_id].marker = map.addMarker(point)
      }
      map.setCenter(point, 16)
    }
    time_fixups()
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

