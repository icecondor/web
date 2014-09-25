var map_leaflet = function() {
  var api = {}

  api.setup = function(center, zoom){
    api.map = L.map('map', {drawControl: true, zoomControl: false}).
                        setView(this.pointToLatLng(center), zoom);
    var zoom = L.control.zoom({position: 'topright'});
    api.map.addControl(zoom);
    api.remove_draw();

    var osmUrl='//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    var osmAttrib='Map data © OpenStreetMap contributors';
    var osm = new L.TileLayer(osmUrl, {minZoom: 2, maxZoom: 18, attribution: osmAttrib});
    osm.addTo(this.map);

    return map
  }

  api.add_draw = function(){
    api.map.drawControl.addTo(api.map)
  }

  api.remove_draw = function(){
    api.map.drawControl.removeFrom(api.map)
  }

  api.setCenter = function(center){
    this.map.panTo(this.pointToLatLng(center))
  }

  api.pointToLatLng = function(point){
    return L.latLng(point.coordinates[1], point.coordinates[0])
  }

  api.latLngToPoint = function(latlng){
    return {coordinates: [latlng.lat, latlng.lng]}
  }

  api.makeIcon = function(url, w, h){
    return L.icon({iconUrl: url, iconSize: [w,h]})
  }

  api.makeMarker = function(point, title){
    var marker = L.marker(this.pointToLatLng(point))
    marker.addTo(this.map)
    return marker
  }

  api.makeLine = function(points){
    var latlngs = points.map(function(p){this.pointToLatLng(p)})
    var line = L.polyline(latlngs)
    api.map.addLayer(line)
    return line
  }

  return api
}()
