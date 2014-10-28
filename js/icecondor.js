var iceCondor = function() {
  var IceCondor = {}

  var callbacks = {}
  var sock
  var connected = false
  var responses = {}

  function connect() {
    connected = true
    dispatch({method:'connect'})
  }

  function disconnect() {
    dispatch({method:'disconnect'})
  }

  function message(event) {
    var json = event.data.trim()
    console.log("<-", json)
    var msg = JSON.parse(json)
    if(msg.method) {
      dispatch(msg)
    }
    if(msg.result){
      if(responses[msg.id]) { responses[msg.id].ok(msg.result) }
    }
    if(msg.error){
      if(responses[msg.id]) {
        if(responses[msg.id].err){
          responses[msg.id].err(msg.error)
        } else {
          console.log("warning: no error response defined for #"+msg.id)
        }
      }
    }
  }

  function error(err) {
    console.log(err)
  }

  function dispatch(msg) {
    var cbs = callbacks[msg.method]
    if (cbs) {
      for(idx in cbs) {
        cbs[idx](msg.params)
      }
    } else {
      console.log('warning: no callback defined for '+msg.method)
    }
  }

  IceCondor.connect = function() {
    return new Promise(function(resolve, reject){
      if(connected) {
        console.log('connect ignored. already connected.')
        resolve()
      } else {
        // websocket
        //sock = new WebSocket("wss://staging.api.icecondor.com/v2");
        // sockjs
        sock = new SockJS('https://icecondor.com/sockjs');
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
    auth_tx = IceCondor.api('auth.session', {device_key: device_key})
    return auth_tx
  }


  IceCondor.on = function(type, cb) {
    var cbs = callbacks[type]
    if(!cbs) { cbs = callbacks[type] = [] }
    cbs.push(cb)
  }

  IceCondor.onResponse = function(id, cb, errcb) {
    responses[id] = {ok:cb, err:errcb}
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

  IceCondor.emit = function(msg) {
    dispatch(msg)
  }

  return IceCondor
}()