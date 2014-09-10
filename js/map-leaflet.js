  this.map_leaflet = {};

  map_leaflet.setup = function(center, zoom){
    map_leaflet.map = L.map('map', {drawControl: true, zoomControl: false}).
                        setView(this.pointToLatLng(center), zoom);
    var zoom = L.control.zoom({position: 'topright'});
    map_leaflet.map.addControl(zoom);
    map_leaflet.remove_draw();

    var osmUrl='//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    var osmAttrib='Map data © OpenStreetMap contributors';
    var osm = new L.TileLayer(osmUrl, {minZoom: 2, maxZoom: 18, attribution: osmAttrib});
    osm.addTo(this.map);

    return map
  }

  map_leaflet.add_draw = function(){
    map_leaflet.map.drawControl.addTo(map_leaflet.map)
  }

  map_leaflet.remove_draw = function(){
    map_leaflet.map.drawControl.removeFrom(map_leaflet.map)
  }

  map_leaflet.setCenter = function(center){
    this.map.panTo(this.pointToLatLng(center))
  }

  map_leaflet.pointToLatLng = function(point){
    return L.latLng(point.coordinates[1], point.coordinates[0])
  }

  map_leaflet.latLngToPoint = function(latlng){
    return {coordinates: [latlng.lat, latlng.lng]}
  }

  map_leaflet.makeIcon = function(url, w, h){
    return L.icon({iconUrl: url, iconSize: [w,h]})
  }

  map_leaflet.makeMarker = function(point, title){
    var marker = L.marker(this.pointToLatLng(point))
    marker.addTo(this.map)
    return marker
  }

  map_leaflet.makeLine = function(points){
    var latlngs = points.map(function(p){this.pointToLatLng(p)})
    var line = L.polyline(latlngs)
    map_leaflet.map.addLayer(line)
    return line
  }