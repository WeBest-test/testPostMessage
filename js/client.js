(function(root,window) {

  // Production steps of ECMA-262, Edition 5, 15.4.4.18
  // Reference: http://es5.github.io/#x15.4.4.18
  if (!Array.prototype.forEach) {

    Array.prototype.forEach = function(callback, thisArg) {

      var T, k;

      if (this === null) {
        throw new TypeError(' this is null or not defined');
      }

      // 1. Let O be the result of calling toObject() passing the
      // |this| value as the argument.
      var O = Object(this);

      // 2. Let lenValue be the result of calling the Get() internal
      // method of O with the argument "length".
      // 3. Let len be toUint32(lenValue).
      var len = O.length >>> 0;

      // 4. If isCallable(callback) is false, throw a TypeError exception.
      // See: http://es5.github.com/#x9.11
      if (typeof callback !== "function") {
        throw new TypeError(callback + ' is not a function');
      }

      // 5. If thisArg was supplied, let T be thisArg; else let
      // T be undefined.
      if (arguments.length > 1) {
        T = thisArg;
      }

      // 6. Let k be 0
      k = 0;

      // 7. Repeat, while k < len
      while (k < len) {

        var kValue;

        // a. Let Pk be ToString(k).
        //    This is implicit for LHS operands of the in operator
        // b. Let kPresent be the result of calling the HasProperty
        //    internal method of O with argument Pk.
        //    This step can be combined with c
        // c. If kPresent is true, then
        if (k in O) {

          // i. Let kValue be the result of calling the Get internal
          // method of O with argument Pk.
          kValue = O[k];

          // ii. Call the Call internal method of callback with T as
          // the this value and argument list containing kValue, k, and O.
          callback.call(T, kValue, k, O);
        }
        // d. Increase k by 1.
        k++;
      }
      // 8. return undefined
    };
  }

  //初始化set get 向远程Storage发送数据的帮助方法
  var STool = function(huburl){
    var that = this;
    //初始化iframe
    this.i = document.createElement('iframe');
    this.i.src =  huburl || 'http://127.0.0.1:8080/hub.html';
    this.i.style.display='none';

    this.connected = false;
    this.loadCallbacks = [];


    this.sendMessage = function(msg,iframe){
      iframe = iframe || that.i;
      var ifrWindow = iframe.contentWindow || iframe;
      ifrWindow.postMessage( (msg || 'hello'),'*')
    }

    this.setCallbacks = {};
    this.getCallbacks = {};

    this.receiveMessage = function(event) {
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
    var client = this;
    if(client.connected){
      if(cb) cb();
    }else{
      if(cb) client.loadCallbacks.push(cb);
      document.body.appendChild(client.i);
      client.i.onload = function () {
        client.connected = true;
        client.loadCallbacks.forEach(function (v) {
          if(typeof v === 'function') v();
        })
      }
    }

  }

  if(root === window){
    root.STool = STool;
  }else{
    if(typeof require == 'function'){
      return STool;
    }else if (typeof module != 'undefined') {
      module.exports = STool;
    }
  }





  //test functions
  var fn = function () {
    window.s = new STool();
    s.onConnect(function () {
      s.set('aaa',{"liugehuan":"aaa"},function (ggg) {
        console.log('set aaa ok callback',ggg);
        s.get('aaa',function (res) {
          console.log('get aaa ok callback',res);
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


  ready(fn);
})(this,window);
