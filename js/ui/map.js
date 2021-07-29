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

function setTitle(username, datestr) {
  var now = new Date()
  var diff = now - new Date(datestr)
  document.title = username + " " + shortUnitName(diff) + " ago"
}

function shortUnitName(diff) {
  var seconds = diff/1000
  if (seconds <= 1) {
    return "now"
  } else if (seconds <= 60) {
    return parseInt(seconds) + " sec"
  } else if (seconds <= 60*60) {
    return parseInt(seconds / 60)+ " min"
  } else if (seconds <= 60*60*24) {
    return parseInt(seconds / 60 / 60)+ " hours"
  } else {
    return parseInt(seconds / 60 / 60 / 24)+ " days"
  }
}

function locationBarPointCount(count) {
  $('#point_count').html(count)
}

function locationBarDistance(distance) {
  $('#distance').html(distance.toFixed(1) + 'm')
}

function setBarDate(date_str) {
  $('.page-map select').removeAttr('disabled')
  var date = new XDate(date_str)
  $('.page-map select.month').val(date.getMonth())
  $('.page-map select.day').val(date.getDate())
}

function day_selected(evt, layercache){
  var day = new XDate()
  day.setMonth($('.page-map select.month').val())
  day.setDate($('.page-map select.day').val())
  day.setHours(0)
  day.setMinutes(0)
  var stop = new XDate(day)
  stop.addDays(1)
  map.removeTracks()
  $('#last_point').html('')
  startFollow(params.username, day, stop, 5000, 'oldest', false, layercache)
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

function startFollow(username, start, stop, count, order, follow, layercache){
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
      if(firstPoint) {
        setBarDate(location.date)
        console.log('setTitle', username, location.date)
        setTitle(username, location.date)
        firstPoint = false
      }

      if(location.fences) {
        location.fences.forEach(function(fence_id){
          if(!layercache[fence_id]) {
            layercache[fence_id] = fenceDraw(fence_id)
          }
        })
      }

      if(location.rules && location.rules.length > 0) {
        var cloakedrules = location.rules.filter(function(rule){return rule.kind == 'cloaked'})
        var docloak = cloakedrules.length > 0
        var therule = docloak ? cloakedrules[0] : location.rules[0]
        rulefence = layercache[therule.fence_id]
        rulefence.then(function(fence){
          if(docloak) {
            var centerpt = fence.polygon.getBounds().getCenter()
            location.latitude = centerpt.lat
            location.longitude = centerpt.lng
          }
          var date_order_idx = map.addPointToTrack(msg.stream_id, location, fence)
          if(date_order_idx == 0) {
            locationBar(location)
            setTitle(username, location.date)
          }
          locationBarPointCount(track.points.length)
          locationBarDistance(track.distance)
        })
      } else {
        var date_order_idx = map.addPointToTrack(msg.stream_id, location)
        if(date_order_idx == 0) {
          locationBar(location)
          setTitle(username, location.date)
        }
        locationBarPointCount(track.points.length)
        locationBarDistance(track.distance)
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

function fenceDraw(fence_id) {
  return new Promise(function(resolve, reject){
    var item_tmpl = uStache.compile($('template#fenceitem').html())
    $('.fencelist').append(item_tmpl({fence_id: fence_id, username: params.username}))
    var fence_tx = iceCondor.api('fence.get', {id: fence_id})
    iceCondor.onResponse(fence_tx, function(fence){
      $('.fencelist .fenceitem#'+fence_id+' a').html(fence.name)
      var latlngs = fence.geojson.coordinates[0].map(function(l){return [l[1],l[0]]})
      var layer = L.polygon(latlngs)
      fence.polygon = layer

      $('.fencelist .fenceitem#'+fence_id+' a').hover(function(evt){
        map.map.map.addLayer(fence.polygon)
      }, function(evt){
        map.map.map.removeLayer(fence.polygon)
      })

      resolve(fence)
    })
  })
}
