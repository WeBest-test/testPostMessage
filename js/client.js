(function(window) {

  //初始化set get 向远程Storage发送数据的帮助方法
  var STool = function(huburl){
    var that = this;
    //初始化iframe
    this.i = document.createElement('iframe');
    this.i.src =  huburl || 'http://127.0.0.1:8080/hub.html';
    this.i.style.display='none';


    this.sendMessage = function(msg,iframe){
      iframe = iframe || that.i;
      var ifrWindow = iframe.contentWindow || iframe;
      ifrWindow.postMessage( (msg || 'hello'),'*')
    }

    this.setCallbacks = {};
    this.getCallbacks = {};

    this.receiveMessage = function(event) {
      console.log(event)
      console.log('client recieved',event.data)
      var obj = JSON.parse(event.data || '{}');
      if(obj.s && obj.s == 'ok'){
        if(obj.o == 'g'){
          if(typeof that.getCallbacks[obj.k] === 'function') that.getCallbacks[obj.k](obj.r);
          delete that.getCallbacks[obj.k]
        }else if(obj.o == 's'){
          if(typeof that.setCallbacks[obj.k] === 'function') that.setCallbacks[obj.k](obj.r);
          delete that.setCallbacks[obj.k];
        }
      }
    }

    window.addEventListener("message", that.receiveMessage, false);

  };

  STool.prototype.set = function (key,value,cb) {
    var sentObj = {
      //operation : set
      "o":"s" ,
      "k":key,
      "v":value
    }
    var sentStr = JSON.stringify(sentObj);
    this.sendMessage(sentStr);
    console.log('client sent',sentStr);
    if(cb) this.setCallbacks[key] = cb;
  }

  STool.prototype.get = function (key,cb) {
    var sentObj = {
      //operation : get
      "o":"g",
      "k":key
    }
    var sentStr = JSON.stringify(sentObj);
    this.sendMessage(sentStr);
    if(cb) this.getCallbacks[key] = cb;
  }

  STool.prototype.onConnect = function(cb){
    document.body.appendChild(this.i);
    this.i.onload = function () {
      if(cb) cb();
    }
  }

  window.STool = STool;




  //test functions
  var fn = function () {
    var s = new STool();
    s.onConnect(function () {
      s.set('aaa',{"liugehuan":"aaa"},function (ggg) {
        console.log(ggg);
        console.log(typeof ggg);
        s.get('aaa',function (res) {
          console.log(res)
        })
      })
    })

  }


  function ready(cb) {
    if (document.readyState != 'loading'){
      cb();
    } else {
      document.addEventListener('DOMContentLoaded', cb);
    }
  }


  //ready(fn);
})(window);
