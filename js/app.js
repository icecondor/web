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
  return iceCondor.setup(getKey()).then(function(){
    var email_tx = iceCondor.api('auth.email', {email: form.elements.email.value, device_id: "browser"})
    iceCondor.onResponse(email_tx, function(msg){
      $('.login_box').html('email sent.')
      console.log(msg)
    })
  })
}

function getQueryParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function getKey() {
  var key = localStorage.getItem("apikey")
  console.log('loaded key '+key)
  return key
}

function setKey(key) {
  return localStorage.setItem("apikey", key)
}

function clearKey() {
  localStorage.removeItem("apikey")
}
