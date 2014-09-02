function setup() {
  console.log("existing apikey is "+getKey())
  apiKeyCheck()
  iceCondor.setup()
}

function apiKeyCheck() {
  var key = getQueryParameterByName('apikey')
  if(key) {
    console.log("setting api key "+key)
    setKey(key)
  }
}

function getQueryParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function getKey() {
  return localStorage.getItem("apikey")
}

function setKey(key) {
  return localStorage.setItem("apikey", key)
}