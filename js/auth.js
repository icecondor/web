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
    console.log("abandon localStorage")
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
