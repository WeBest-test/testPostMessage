(function () {
  var l = window.localStorage;
  var tool = {};
  tool.set = function (k,v) {
    return l.setItem(JSON.stringify(k),JSON.stringify(v));
  }
  tool.get = function (k) {
    return JSON.parse(l.getItem(JSON.stringify(k)));
  }
  function receiveMessage(event) {
    console.log('hub recieved',event.data)
    var obj = JSON.parse(event.data || '{}');
    var res = {};
    if(obj.k){
      if(obj.o == 's'){ //save to localStorage
        tool.set(obj.k,(obj.v||''));
        res.o = 's'; //operation set
        res.s = 'ok'; //set status ok,wait to be sent to client
        res.k = obj.k;
        res.r = obj.v;
      }else if(obj.o == 'g'){
        var tmpObj = tool.get(obj.k);
        res.o = 'g'; // operation get
        res.s = 'ok'; //get status ok,wait to be sent to client
        res.k = obj.k;
        res.r = tmpObj;
      }
    }
    var resStr = JSON.stringify(res); //response string to client.
    event.source.postMessage(resStr,'*');
    console.log('hub sent:',resStr);
  }
  window.addEventListener("message", receiveMessage, false);
})();
