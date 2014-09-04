var iceCondor = function() {
  var IceCondor = {}

  var callbacks = {}
  var sock

  function message(event) {
    var json = event.data.trim()
    console.log(json)
    var msg = JSON.parse(json)
    if(msg.method) {
      dispatch(msg.method, msg)
    }
  }

  function error(err) {
    console.log(err)
  }

  function dispatch(method, msg) {
    var callback = callbacks[method]
    if (callback) {
      callback(msg)
    } else {
      console.log('warning: no callback defined for '+method)
    }
  }

  IceCondor.setup = function(key) {
    /*
    // sockjs
    var sock = new SockJS('http://localhost:3320');
    sock.onopen = function() {
      console.log('open');
    }; */
    // websocket
    return new Promise(function(resolve, reject){
      sock = new WebSocket("wss://staging.api.icecondor.com/v2");
      sock.onmessage = message
      sock.onerror = error
      sock.onopen = resolve
    })
  }

  IceCondor.on = function(type, cb) {
    callbacks[type] = cb
  }

  IceCondor.api = function(method, params) {
    /* todo: one-shot callback */
    var payload = {id: 1, method: method, params: params}
    var payload_json = JSON.stringify(payload)
    console.log('iceCondor.api method:'+method+' '+payload_json)
    sock.send(payload_json)
  }

  IceCondor.follow = function(username) {
    IceCondor.api('stream.follow', {username: username})
  }

  return IceCondor
}()