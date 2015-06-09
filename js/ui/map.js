function locationBar(location) {
  var date = new XDate(location.date)
  var days = date.diffDays()
  var date_format
  if(days < 7) {
    date_format = "ddd h:mmtt"
  } else {
    date_format = "MMM-dd h:mmtt"
  }
  var point_last_html = '<time datetime='+JSON.stringify(location.date)+
                        ' data-format='+JSON.stringify(date_format)+
                        '/>'
  $('#last_point').html(point_last_html)
  time_fixups('#last_point')
}

function locationBarPointCount(count) {
  $('#point_count').html(count)
}

function setBarDate(date_str) {
  $('.page-map select').removeAttr('disabled')
  var date = new XDate(date_str)
  $('.page-map select.month').val(date.getMonth())
  $('.page-map select.day').val(date.getDate())
}

function day_selected(evt){
  var day = new XDate()
  day.setMonth($('.page-map select.month').val())
  day.setDate($('.page-map select.day').val())
  day.setHours(0)
  day.setMinutes(0)
  var stop = new XDate(day)
  stop.addDays(1)
  map.removeTracks()
  $('#last_point').html('')
  startFollow(params.username, day, stop, 1000, 'oldest')
}

function month_day_select_setup(){
  $('.page-map select').attr('disabled', true)
  for(var day=1; day <= 31; day++) {
    $('.page-map select.day').append('<option value=\''+day+'\'>'+day+'</option>')
  }
  [0,1,2,3,4,5,6,7,8,9,10,11].forEach(function(month_idx){
    var date = new XDate()
    date.setMonth(month_idx)
    $('.page-map select.month').append('<option value=\''+month_idx+'\' >'+date.toString('MMM')+'</option>')
  });
}

function startFollow(username, start, stop, count, order, follow){
  var filter = {username: username, type: "location", count: count, order: order}
  if(follow){filter.follow = follow}
  if(start) { filter.start = start.toISOString()}
  if(stop) { filter.stop = stop.toISOString()}
  if(params.key) {filter.key = params.key}
  var follow_tx = iceCondor.api('stream.follow', filter)
  iceCondor.onResponse(follow_tx, function(msg){
    statusTab()
    var track = map.addTrack(msg.stream_id, username)
    locationBarPointCount("-loading-")
    var firstPoint = true
    iceCondor.onResponse(msg.stream_id, function(location){
      var date_order_idx = map.addPointToTrack(msg.stream_id, location)
      if(date_order_idx == 0) {
        locationBar(location)
      }
      locationBarPointCount(track.points.length)
      if(firstPoint) {
        setBarDate(location.date)
        firstPoint = false
      }
    })
  }, function(err) {
    if(err.code == "UNF") {
      $('#map').html("<h2>User not found.</h2>")
    }
    if(err.code == "NOACCESS") {
      $('#map').html("<h2>Location data for "+username+" is private.</h2>")
      window.setTimeout(function(){
        window.location = "/"+username+"/profile"
      }, 2000)
    }
  })
}

function fenceDraw(fence_id, layercache) {
  if($('.fencelist .fenceitem#'+fence_id).length == 0) {
    var item_tmpl = uStache.compile($('template#fenceitem').html())
    $('.fencelist').append(item_tmpl({fence_id: fence_id, username: params.username}))
    var fence_tx = iceCondor.api('fence.get', {id: fence_id})
    iceCondor.onResponse(fence_tx, function(fence){
      $('.fencelist .fenceitem#'+fence_id+' a').html(fence.name)
      var latlngs = fence.geojson.coordinates[0].map(function(l){return [l[1],l[0]]})
      var layer = L.polygon(latlngs)
      layercache[fence_id] = layer
      $('.fencelist .fenceitem#'+fence_id+' a').hover(function(evt){
        map.map.map.addLayer(layercache[fence_id])
      }, function(evt){
        map.map.map.removeLayer(layercache[fence_id])
      })
    })
  }
}