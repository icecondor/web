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

  api.addTrack = function(track_id, name) {
    var line = map.addPolyline({color: 'red', smoothFactor: 0})
    // marker must have lat/long so delay until first point
    var track = { name: name, points: [], line: line, marker: null }
    tracks[track_id] = track
    return track
  }

  api.addPointToTrack = function(track_id, point) {
    var track = tracks[track_id]

    if(point.accuracy < 200) {
      var date_order_idx = api.add_point(track_id, point)

      if(date_order_idx == 0) {
        if(track.marker) {
          map.moveMarker(track.marker, point)
        } else {
          track.marker = map.addMarker(point, "person")
          map.addPopup(track.marker)
        }
        set_popup_detail(track.marker.getPopup(), point)
        map.setCenter(point, 16)
      }
      return date_order_idx
    } else {
      var tower_marker = map.addMarker(point, "tower")
      map.addPopup(tower_marker)
      set_popup_detail(tower_marker.getPopup(), point)
    }
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

  function set_popup_detail(popup, point) {
    var ft = point.accuracy * 3.28
    var provider = point.provider
    if(provider == "network") {
      if (point.accuracy > 500) {
        provider = "tower"
      } else {
        provider = "wifi"
      }
    }
    // templatify this
    $('#popup-holder').append('<div id="marker-popup-'+point.id+'">'+
                                  provider+' inside '+ft.toFixed(0)+'ft'+
                                  '<br/>'+
                                  '<time datetime="'+point.date+'" data-format="yyyy-MMM-d hh:mmtt"/>'+
                                   '</div>')
    time_fixups()
    popup.setContent($('#marker-popup-'+point.id)[0])
  }

  return api
}()

