

(function(window) {
  function ready(cb) {
    if (document.readyState != 'loading'){
      cb();
    } else {
      document.addEventListener('DOMContentLoaded', cb);
    }
  }
  // var sfn = function () {
  //   var s = document.createElement('script');
  //   s.src = './js/client.js';
  //   s.async = true;
  //   s.defer = true;
  //   document.body.appendChild(s);
  // }

  //初始化iframe
  var i = document.createElement('iframe');
  i.src = 'http://127.0.0.1:8080/hub.html';
  i.style.display='none';

  //初始化set get 向远程Storage发送数据的帮助方法
  var STool = {};
  var setCallbacks = {};
  var getCallbacks = {};
  STool.set = function (key,value,cb) {
    var sentObj = {
      //operation : set
      "o":"s" ,
      "k":key,
      "v":value
    }
    var sentStr = JSON.stringify(sentObj);
    sendMessage(sentStr);
    console.log('client sent',sentStr);
    if(cb) setCallbacks[key] = cb;
  }

  STool.get = function (key,cb) {
    var sentObj = {
      //operation : get
      "o":"g",
      "k":key
    }
    var sentStr = JSON.stringify(sentObj);
    sendMessage(sentStr);
    if(cb) getCallbacks[key] = cb;
  }

  function sendMessage(msg,iframe){
    iframe = iframe || i;
    var ifrWindow = iframe.contentWindow || iframe;
    ifrWindow.postMessage( (msg || 'hello'),'*')
  }

  var fn = function () {
    document.body.appendChild(i);
    i.onload = function () {
      //sendMessage(s);
      debugger
      STool.set('aaa',{"liugehuan":"aaa"},function (ggg) {
        console.log(ggg);
        console.log(typeof ggg);
        STool.get('aaa',function (res) {
          console.log(res)
        })
      })
    }

  }

  function receiveMessage(event) {
    console.log(event)
    console.log('client recieved',event.data)
    var obj = JSON.parse(event.data || '{}');
    if(obj.s && obj.s == 'ok'){
      if(obj.o == 'g'){
        getCallbacks[obj.k](obj.r);
        delete getCallbacks[obj.k]
      }else if(obj.o == 's'){
        console.log(setCallbacks)
        setCallbacks[obj.k](obj.r);
        delete setCallbacks[obj.k];
      }
    }
  }

  window.addEventListener("message", receiveMessage, false);
  ready(fn);
})(window);
