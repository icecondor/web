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
    // marker must have lat/long so delay until first point
    var track = { name: name, points: [], marker: null, bounds: map.bounds() }
    tracks[track_id] = track
    return track
  }

  api.removeTracks = function() {
    for(var track_id in tracks) {
      map.removeLayer(tracks[track_id].marker)
      tracks[track_id].points.forEach(function(point){
        if(point.segment) {
          map.removeLayer(point.segment)
        }
        if(point.circle) {
          map.removeLayer(point.circle)
        }
      })
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
      if(point.accuracy > 600) {
        zoom = 16
      } else {
        zoom = 18
      }

    }

    if(date_order_idx == 0) {
      map.setCenter(point, zoom)
      if(track.length > 0 && track.points[0].circle) {
        detint(track.points[0].circle)
      }
    }

    if(type == "tower") {
      var marker = map.addMarker(point, type, 1)
      map.addPopup(marker)
      set_popup_detail(marker.getPopup(), point, type)
      point.circle = map.addCircle([point.latitude,point.longitude],
                                     point.accuracy, 0.01, 0.0, color)
      if(date_order_idx == 0) {
        tint(point.circle)
      }
    } else {
      map.addCircle([point.latitude,point.longitude], point.accuracy, 0.05, 0.0, color)
      var historical_point
      if(date_order_idx == 0) {
        move_head(track, point)
        set_popup_detail(track.marker.getPopup(), point, type)
      }
      var older = older_point(track.points, date_order_idx, 200)
      if (older) {
        var seg_pts = [
            [older.latitude, older.longitude],
            [point.latitude, point.longitude]
          ]
        point.segment = map.addPolyline(seg_pts, {color: 'red', smoothFactor: 0})
      }
      var newer = newer_point(track.points, date_order_idx, 200)
      if (newer) {
        var seg_pts = [
            [point.latitude, point.longitude],
            [newer.latitude, newer.longitude]
          ]
        if(newer.segment) { map.removeLayer(newer.segment) }
        newer.segment = map.addPolyline(seg_pts, {color: 'red', smoothFactor: 0})
      }
    }

    add_point_to_track(track, point, date_order_idx)
    return date_order_idx
  }

  function tint(circle) {
    circle.setStyle({fillOpacity: 0.1})
  }

  function detint(circle) {
    circle.setStyle({fillOpacity: 0.01})
  }
  function older_point(points, point_idx, acc) {
    for(var search=point_idx+1, len=points.length; search < len; search++) {
      var older = points[search]
      if(older.accuracy < acc) {
        return older
      }
    }
  }

  function newer_point(points, point_idx, acc) {
    for(var search=point_idx-1; search > 0; search--) {
      var newer = points[search]
      if(newer.accuracy < acc) {
        return newer
      }
    }
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

