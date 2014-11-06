// fixup the timestamps with the browser's timezone
function time_fixups() {
  $('time').each(function(){
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
  if(msg){
    console.log('top', tab.css('top'))
    if(tab.css('top') < -60) { // first time
      tab.css('top',-tab.outerHeight())
    }
    tab.css('transition', 'top 1s')
    tab.html(msg)
    tab.css('top',0)
  } else {
    tab.css('transition', 'top 1s')
    tab.css('top',-$('.statustab').outerHeight())
  }
}