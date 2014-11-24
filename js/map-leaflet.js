var map_leaflet = function() {
  var api = {}
  var map;

  api.setup = function(center, zoom){
    map = L.map('map', {zoomControl: false})
    map.setView(center, zoom);
    var zoom = L.control.zoom({position: 'topright'});
    map.addControl(zoom);
    //api.remove_draw();

    var osmUrl='//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    var osmAttrib='Map data © OpenStreetMap contributors';
    var osm = new L.TileLayer(osmUrl, {minZoom: 2, maxZoom: 18, attribution: osmAttrib});
    osm.addTo(map);
  }

  api.resize = function() {
    map.invalidateSize()
  }

  api.add_draw = function(){
    map.drawControl.addTo(map)
  }

  api.remove_draw = function(){
    map.drawControl.removeFrom(map)
  }

  api.setCenter = function(center, zoom){
    var latLng = api.pointToLatLng(center)
    map.panTo(latLng)
    if(zoom){ map.setZoom(16) }
  }

  api.pointToLatLng = function(point){
    return L.latLng(point.latitude, point.longitude)
  }

  api.latLngToPoint = function(latlng){
    return {coordinates: [latlng.lat, latlng.lng]}
  }

  var icons = {"tower":{isize:[33,40], anchor:[16,40]},
               "wifi":{isize:[33,40], anchor:[16,40]},
               "person":{isize:[25,41], anchor:[12,41]}
              }
  api.makeIcon = function(name){
    return L.icon({iconUrl: "/assets/"+name+".svg",
                   iconSize: icons[name].isize,
                   iconAnchor: icons[name].anchor})
  }

  api.addMarker = function(point, icon_name){
    var marker = L.marker(this.pointToLatLng(point),
                          {icon: api.makeIcon(icon_name)})
    marker.addTo(map)
    return marker
  }

  api.moveMarker = function(marker, point) {
    marker.setLatLng(api.pointToLatLng(point))
    marker.update()
  }

  api.addPopup = function(marker) {
    var popup = L.popup()
    marker.bindPopup(popup)
  }

  api.addPolyline = function(opts){
    var line = L.polyline([], opts)
    line.addTo(map)
    return line
  }

  return api
}()
