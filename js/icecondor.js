var iceCondor = function() {
  var IceCondor = {}

  var callbacks = {}
  var sock
  var connected = false
  var responses = {}

  function connect() {
    console.log('connected.')
    connected = true
  }

  function message(event) {
    var json = event.data.trim()
    console.log("<-", json)
    var msg = JSON.parse(json)
    if(msg.method) {
      dispatch(msg)
    }
    if(msg.result){
      if(responses[msg.id]) { responses[msg.id](msg.result) }
    }
  }

  function error(err) {
    console.log(err)
  }

  function dispatch(msg) {
    var callback = callbacks[msg.method]
    if (callback) {
      callback(msg.params)
    } else {
      console.log('warning: no callback defined for '+msg.method)
    }
  }

  IceCondor.setup = function(key) {
    return new Promise(function(resolve, reject){
      if(connected) {
        console.log('already connected.')
        resolve()
      } else {
        // websocket
        //sock = new WebSocket("wss://staging.api.icecondor.com/v2");
        // sockjs
        sock = new SockJS('https://staging.icecondor.com/sockjs');
        sock.onmessage = message
        sock.onerror = error
        sock.onopen = function(){
          connect()
          resolve()
        }
      }
    })
  }

  IceCondor.auth = function(device_key) {
    auth_tx = IceCondor.api('auth.token', {device_key: device_key})
    console.log('auth emitted. waiting on id '+auth_tx)
  }


  IceCondor.on = function(type, cb) {
    callbacks[type] = cb
  }

  IceCondor.onResponse = function(id, cb, errcb) {
    responses[id] = cb
  }

  IceCondor.api = function(method, params) {
    /* todo: one-shot callback */
    var id = Math.random().toString(36).substring(2,7)
    var payload = {id: id, method: method, params: params}
    var payload_json = JSON.stringify(payload)
    console.log('->', payload_json)
    sock.send(payload_json)
    return id
  }

  IceCondor.follow = function(username) {
    return IceCondor.api('stream.follow', {username: username})
  }

  return IceCondor
}()