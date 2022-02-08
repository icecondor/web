var map_leaflet = function() {
  var api = {}
  var map;


  api.setup = function(corners){
          console.log('map_leaflet setup', corners)
    api.map = map = L.map('map', {zoomControl: false})
    map.fitWorld(corners, {padding: 100})

    var zoom = L.control.zoom({position: 'topright'});
    map.addControl(zoom);

    var osmUrl='//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    var osmAttrib='OpenStreetMap Contributors'
    var osm = new L.TileLayer(osmUrl, {minZoom: 2, maxZoom: 18, attribution: osmAttrib});
    osm.addTo(map);
  }

  api.resize = function() {
    map.invalidateSize()
  }

  api.add_draw = function(drawnItems){
    map.addLayer(drawnItems)
    var drawControl = new L.Control.Draw({
        draw: { marker: false,
                circle: false,
                rectangle: false,
                polyline: false},
        edit: {
          featureGroup: drawnItems,
          remove: false
        }
    })
    map.addControl(drawControl)
  }

  api.remove_draw = function(){
    map.drawControl.removeFrom(map)
  }

  api.setCenter = function(center, zoom){
    var latLng = api.pointToLatLng(center)
    if(zoom){ map.setZoom(zoom) }
    map.panTo(latLng)
  }

  api.recenter = function(bounds) {
    map.fitBounds(bounds)
  }

  api.bounds = function() {
    return L.latLngBounds([])
  }

  api.bounds_extend = function(point) {
    return map.getBounds().extend(api.pointToLatLng(point))
  }

  api.pointToLatLng = function(point){
    return L.latLng(point.latitude, point.longitude)
  }

  api.latLngToPoint = function(latlng){
    return {coordinates: [latlng.lat, latlng.lng]}
  }

  var icons = {"tower":{isize:[33,10], anchor:[16,4]},
               "wifi":{isize:[33,10], anchor:[16,4]},
               "gps":{isize:[33,10], anchor:[16,4]},
               "person":{isize:[25,41], anchor:[12,41]}
              }
  api.makeIcon = function(name){
    return L.icon({iconUrl: "/assets/"+name+".svg",
                   iconSize: icons[name].isize,
                   iconAnchor: icons[name].anchor})
  }

  api.addMarker = function(point, icon_name, opacity){
    var marker = L.marker(this.pointToLatLng(point),
                          {icon: api.makeIcon(icon_name),
                           opacity: opacity
                          })
    marker.addTo(map)
    return marker
  }

  api.moveMarker = function(marker, point) {
    marker.setLatLng(api.pointToLatLng(point))
    marker.update()
  }

  api.removeMarker = function(marker) {
    map.removeLayer(marker)
  }

  api.addPopup = function(marker) {
    var popup = L.popup()
    marker.bindPopup(popup)
  }

  api.addPolyline = function(pts, opts){
    var line = L.polyline(pts, opts)
    line.addTo(map)
    return line
  }
  api.addCircle = function(point, radius, opacity, fillOpacity, color){
    var circle = L.circle(point, radius, {color: color,
                                          opacity: opacity,
                                          fillOpacity: fillOpacity})
    circle.addTo(map)
    return circle
  }

  api.removeLayer = function(layer) {
    map.removeLayer(layer)
  }

  api.removeLayers = function() {
    map.eachLayer(function(layer){
      api.removeLayer(layer)
    })
  }

  return api
}()
