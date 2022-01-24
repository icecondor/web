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
  if(msg){
    tab.style.top = "0px" // display tab
    var inner = document.querySelector('.statusinner')
    inner.innerHTML = msg
  } else {
    tab.style.top = "-"+tab.offsetHeight+"px" // hide tab
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
