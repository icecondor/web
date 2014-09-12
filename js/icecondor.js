var iceCondor = function() {
  var IceCondor = {}

  var callbacks = {}
  var sock
  var connected = false

  function connect() {
    console.log('connected.')
    connected = true
  }

  function message(event) {
    var json = event.data.trim()
    console.log(json)
    var msg = JSON.parse(json)
    if(msg.method) {
      dispatch(msg)
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

  IceCondor.on = function(type, cb) {
    callbacks[type] = cb
  }

  IceCondor.api = function(method, params) {
    /* todo: one-shot callback */
    var payload = {id: 1, method: method, params: params}
    var payload_json = JSON.stringify(payload)
    console.log('iceCondor.api '+payload_json)
    sock.send(payload_json)
    //sock.emit('api', payload) // socket.io
  }

  IceCondor.follow = function(username) {
    IceCondor.api('stream.follow', {username: username})
  }

  return IceCondor
}()