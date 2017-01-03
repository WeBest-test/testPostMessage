

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
  STool.set = function (key,value,iframe) {
    var sentObj = {
      "k":key,
      "v":value
    }
    var sentStr = JSON.stringify(sentObj);
    sendMessage(sentStr);
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
      STool.set('aaa','{"kkk":"ggg"}')
    }

  }
  ready(fn);
})(window);
