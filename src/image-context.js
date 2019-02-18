(function (root, factory) {
  if (typeof define === 'function' && define.amd) { define([], factory); }
  else if (typeof module === 'object' && module.exports) { module.exports = factory(); }
  else { root.ImageContext = factory(); }
}(this, function () { 'use strict';
  var cache = {};
  var promises = [];
  var directory = "";

  /**
   * Public method to load image data
   * @param {string|string[]} data Path to each image
   */
  function load(data) {
    _parse(data);
    return Promise.all(promises);
  }

  /**
   * Public method to query an image
   * @param {string|object} data Path or {key: path} of the image to get
   */
  function get(data) {
    if (cache[data]) {
      return cache[data];
    }
    else {
      if (typeof(data) === "string") {
        return _load(data, true);
      }
      else if (typeof(data) === "object") {
        var key = Object.keys(data)[0];
        return _load([data[key], key], true);
      }
    }
  }

  /**
   * Set the path to the main images directory.
   * @param {string} dir Path to the main directory
   */
  function setDirectory(dir) {
    if (typeof dir === "string") {
      directory = dir;
    }
  }

  /**
   * Successively parse all data to load input images
   * @param {string|object|Array} data The input data
   */
  function _parse(data) {
    if (typeof(data) === "string") {
      _load(data, false);
    }
    else if (Array.isArray(data)) {
      for (var d of data) {
        _parse(d);
      }
    }
    else if (typeof(data) === "object") {
      var key = Object.keys(data)[0];
      _load([data[key], key], false);
    }
  }

  function _load(data, sync) {
    var config = (Array.isArray(data)) ? _config(data[0], data[1]) : _config(data);
    if (cache[config.id]) {
      return cache[config.id];
    }

    var img = new Image();
    img.src = config.src;
    cache[config.id] = img;
    if (sync) {
      return img;
    }

    return new Promise(function(resolve, reject) {
      var callback = function () {
        img.removeEventListener("load", callback);
        resolve(img);
      }
      img.addEventListener("load", callback);
    });
  }

  function _config(path, id) {
    var http = path.slice(0,4) == "http";
    var src = http ? path : directory + path;
    var id = !!id ? path : id;
    return {src: src, id: id};
  }


  var ImageContext = {
    load: load,
    get: get,
    setDirectory: setDirectory
  };

  return ImageContext;
}));
