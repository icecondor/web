// fixup the timestamps with the browser's timezone
function time_fixups(selector) {
  $(selector+' time').each(function(){
    var datetime = new XDate(this.getAttribute('datetime'))
    var formatted = datetime.toString($(this).attr('data-format'))
    this.innerHTML = formatted
    var timezone_parts = (new XDate()).toString().match(/(GMT[+-]\d{4})( \(([A-Z]{3})\))?/)
    var fulltime = datetime.toString("yyyy-MM-dd hh:mmtt")
    this.setAttribute('title', fulltime + " " +(timezone_parts[3] || timezone_parts[1]))
  })
}

function statusTab(msg){
  var tab = document.querySelector('.statustab')
  console.log('tab', tab)
  var tab_height = tab.offsetHeight
  if(msg){
    if(tab.style.top < -60) { // first time
      tab.style.top = -tab_height
    }
    tab.innerHTML = msg
    tab.style.top = 0
  } else {
    tab.style.top = -tab_height
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
