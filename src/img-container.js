(function (root, factory) {
  if (typeof define === "function" && define.amd) { define([], factory); }
  else if (typeof module === "object" && module.exports) { module.exports = factory(); }
  else { root.ImgContainer = factory(); }
}(this, function () {
  "use strict";

  var directory = "";
  var cache = {};
  var callback = function () {};
  var count = 0;

  function load(data) {
    parse("", data);
    return {
      then: function (func) {
        if (typeof func == "function") {
          callback = func;
        }
      }
    };
  }

  function onload(func) {
    if (typeof func == "function") {
      callback = func;
    }
  }

  function get(img) {
    var imgId = img.split("/").pop();
    if (cache[imgId]) {
      return cache[imgId];
    }
    else if (cache[img]) {
      return cache[img];
    }
    else {
      return null;
    }
  }

  function setDirectory(dir) {
    if (typeof dir == "string") {
      directory = dir;
    }
  }

  function parse(src, data) {
    if (typeof data == "string") {
      fetch(src + data);
    }
    else if (Array.isArray(data)) {
      for (var i = 0; i < data.length; i++) {
        parse(src, data[i]);
      }
    }
    else if (typeof data == "object") {
      var keys = Object.keys(data);
      if (keys.length == 1 && typeof keys[0] == "string" && typeof data[keys[0]] == "string") {
        fetch(src + keys[0], data[keys[0]]);
      }
      else {
        for (var i = 0; i < keys.length; i++) {
          parse(src + keys[i], data[keys[i]]);
        }
      }
    }
  }

  function fetch(src, id) {
    var isHttp = srcIn.slice(0,4) == "http";
    var imgSrc = (isHttp ? src : directory + src);
    var imgId = (typeof id != "undefined") ? id : src.split("/").pop();
    if (!cache[imgId]) {
      var img = new Image();
      ++count;
      img.onload = function () {
        img.onload = null;
        if (--count == 0) {
          callback();
        }
      }
      img.src = imgSrc;
      cache[imgId] = img;
    }
  }

  return {
    load: load,
    onload: onload,
    get: get,
    setDirectory: setDirectory
  };
}));
