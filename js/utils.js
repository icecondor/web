// fixup the timestamps with the browser's timezone
function time_fixups(selector) {
  $(selector+' time').each(function(){
    var datetime = new XDate($(this).attr('datetime'))
    var formatted = datetime.toString($(this).attr('data-format'))
    $(this).html(formatted)
    var fulltime = datetime.toString("yyyy-MM-dd hh:mmtt")
    $(this).attr('title', fulltime)
  })
  var timezone_letters = (new XDate()).toString().match(/\(([A-Z]).*([A-Z]).*([A-Z]).*\)/)
  var timezone_name = timezone_letters[1]+timezone_letters[2]+timezone_letters[3] //hack to get the full timezone name
  $('.local_timezone').html(timezone_name)
}

function statusTab(msg){
  var tab = $('.statustab')
  var tab_height = tab.outerHeight()
  if(msg){
    if(tab.css('top') < -60) { // first time
      tab.css('top',-tab_height)
    }
    tab.html(msg)
    tab.css('top',0)
  } else {
    tab.css('top',-tab_height)
  }
}

function url_params(url){
  var parts = url.split('?')
  var qparams = {}
  console.log(parts)
  if(parts[1]) {
    parts[1].split('&').forEach(function(part){
                     var p=part.split('=');
                     qparams[p[0]]=p[1]
                   })
  }
  return qparams
}