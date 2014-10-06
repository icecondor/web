// auth helpers
function setup() {
  console.log("existing apikey is "+getKey())
  apiKeyCheck()
}

function apiKeyCheck() {
  var key = getQueryParameterByName('apikey')
  if(key) {
    console.log("setting api key "+key)
    setKey(key)
  }
}

function emailTokenRequest(form){
  var email = form.elements.email.value
  form.elements.email = ""
  return iceCondor.setup(getKey()).then(function(){
    var email_tx = iceCondor.api('auth.email', {email: email, device_id: "browser"})
    iceCondor.onResponse(email_tx, function(msg){
      $('.login_box').html('token sent.')
      console.log(msg)
    })
  })
}

function getQueryParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

/* db abstract */
function dbGet(key) {
  try {
    var json = localStorage.getItem(key)
    return JSON.parse(json)
  } catch(e) {
    // extreme but better than the alternative
    localStorage.clear()
    window.location.reload(false)
  }
}

function dbSet(key, value) {
  var json = JSON.stringify(value)
  return localStorage.setItem(key, json)
}

function dbDel(key) {
  localStorage.removeItem(key)
}

/* api key helpers */
function getKey() {
  var key = dbGet("apikey")
  return key
}

function setKey(key) {
  return dbSet("apikey", key)
}

function clearKey() {
  dbDel(getKey())
  dbDel("apikey")
}
