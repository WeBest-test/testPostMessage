(function () {
  var l = window.localStorage;
  var tool = {};
  tool.set = function (k,v) {
    return l.setItem(JSON.stringify(k),JSON.stringify(v));
  }
  tool.get = function (k) {
    return l.getItem(JSON.stringify(k));
  }
  function receiveMessage(event) {
    console.log(event)
    console.log(event.data)
    var obj = JSON.parse(event.data || '{}');
    if(obj.k){
      tool.set(obj.k,(obj.v||''));
    }
  }
  window.addEventListener("message", receiveMessage, false);
})();
