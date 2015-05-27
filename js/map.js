var map = function(){
  var api = {}
  var map = map_leaflet
  var tracks = {}

  api.setup = function(center, zoom){
    map.setup(center, zoom)
  }

  api.resize = function() {
    map.resize()
  }
  api.map = map
  api.addTrack = function(track_id, name) {
    var line = map.addPolyline({color: 'red', smoothFactor: 0})
    // marker must have lat/long so delay until first point
    var track = { name: name, points: [], line: line, marker: null, bounds: map.bounds() }
    tracks[track_id] = track
    return track
  }

  api.removeTracks = function() {
    for(var track_id in tracks) {
      map.removeLayer(tracks[track_id].line)
      map.removeLayer(tracks[track_id].marker)
      delete tracks[track_id]
    }
  }

  api.addPointToTrack = function(track_id, point) {
    var track = tracks[track_id]
    var type = provider_type(point)
    var color
    if(type == "wifi"){ color = '#03a' }
    if(type == "gps") { color = '#8A500' }
    if(type == "tower") { color = '#444' }

    var date_order_idx = point_index(track_id, point)

    var zoom
    if(track.points.length == 0) {
      zoom = 17
    }

    if(type == "tower") {
      var marker = map.addMarker(point, type, 1)
      map.addPopup(marker)
      set_popup_detail(marker.getPopup(), point, type)
      map.addCircle([point.latitude,point.longitude], point.accuracy, 0.01, 0.0, color)
      if(date_order_idx == 0) {
        map.setCenter(point, zoom)
      }
    } else {
      add_point_to_track(track, point, date_order_idx)
      map.addCircle([point.latitude,point.longitude], point.accuracy, 0.05, 0.0, color)
      var historical_point
      if(date_order_idx == 0) {
        move_head(track, point)
        map.setCenter(point, zoom)
        set_popup_detail(track.marker.getPopup(), point, type)
      }
    }
    return date_order_idx
  }

  function move_head(track, point) {
    if(track.marker) {
      map.moveMarker(track.marker, point)
    } else {
      track.marker = map.addMarker(point, "person", 1)
      map.addPopup(track.marker)
    }
  }

  function add_point_to_track(track, point, insert_idx) {
    track.points.splice(insert_idx, 0, point) // need full point
    track.line.spliceLatLngs(insert_idx, 0, [point.latitude,point.longitude])
    map.bounds_extend(track.bounds, point)
  }

  function point_index(track_id, point) {
    var points = tracks[track_id].points

    // keep points in date sorted order
    var insert_idx = 0
    points.forEach(function(pt, idx){
      if(pt.date > point.date) {
        insert_idx = idx+1
      }
    })

    return insert_idx
  }

  function set_popup_detail(popup, point, type) {
    var ft = point.accuracy * 3.28
    // templatify this
    $('#popup-holder').append('<div id="marker-popup-'+point.id+'">'+
                                  type+' inside '+ft.toFixed(0)+'ft'+
                                  '<br/>'+
                                  '<time datetime="'+point.date+'" data-format="yyyy-MMM-d hh:mmtt"/>'+
                                   '</div>')
    time_fixups('#marker-popup-'+point.id)
    popup.setContent($('#marker-popup-'+point.id)[0])
  }

  function provider_type(point){
    var type = point.provider
    if(point.provider == "network") {
      if (point.accuracy < 200) {
        type = "wifi"
      } else {
        type = "tower"
      }
    }
    return type
  }

  return api
}()

