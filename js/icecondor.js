var iceCondor = {
  callbacks: {},

  setup: function() {
    var self = this
    var sock = new WebSocket("wss://staging.api.icecondor.com/v2");
    sock.onmessage = self.message
    sock.onerror = self.error
  },

  api: function(data) {
    /* todo: one-shot callback */
    console.log('iceCondor.api')
    console.log(data)
    this.io.emit('api', data)
  },

  message: function(event) {
    var json = event.data.trim()
    console.log(json)
  },

  error: function(err) {
    console.log(err)
  },

  dispatch: function(self, msg) {
    var callback = this.callbacks[msg.type]
    if (callback) {
      callback(msg)
    } else {
      console.log('warning: no callback defined for '+msg.type)
    }
  },
}