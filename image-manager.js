(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
      define([], factory);
  } else if (typeof module === 'object' && module.exports) {
      module.exports = factory();
  } else {
      root.ImgManager = factory();
  }
}(this, function () {
  'use strict';

  var cache = {};
  var promises = [];
  var mainDirectory = "";

  /**
   * Public method to load image data
   * @param {string|string[]} data Path to each image
   * @return {Promise}
   */
  function load(data) {
    prepareLoad(data);
    return Promise.all(promises);
  }

  /**
   * Public method to query an image
   * @param {string} key Path or ID of the image
   * @param {string} src (optionnal) Path to the image. If provided, the key will used as an ID
   * @return {Image} The image
   */
  function get(key, src) {
    if (cache[key]) {
      return cache[key];
    }
    else {
      if (src) {
        return load_sync({key: src});
      }
      else {
        return load_sync(key);
      }
    }
  }

  /**
   * Set the path to the images main directory.
   * This path will be added to all image loaded after this method is called
   * @param {string} dir Ppath to the main directory
   */
  function setMainDirectory(dir) {
    if (typeof dir === "string") {
      mainDirectory = dir;
    }
  }


  /**
   * Private methods
   */

  function prepareLoad(data) {
    if (typeof(data) === "string") {
      promises.push(load_async(data, ""));
    }
    else if (Array.isArray(data)) {
      for (let d of data) {
        prepareLoad(d);
      }
    }
    else if (typeof(data) === "object") {
      let key = Object.keys(data)[0];
      promises.push(load_async(data[key], key));
    }
  }

  function load_async(path, id) {
    let imgConfig = getConfig(path, id);

    if (cache[imgConfig.id]) {
      return cache[imgConfig.id];
    }
    else {
      return new Promise(function(resolve, reject) {
        let img = new Image();
        img.src = imgConfig.src;
        cache[imgConfig.id] = img;

        let f = function () {
          img.removeEventListener("load", f);
          resolve(img);
        }
        img.addEventListener("load", f);
      });
    }
  }

  function load_sync(path, id) {
    let imgConfig = getConfig(path, id);

    if (cache[imgConfig.id]) {
      return cache[imgConfig.id];
    }
    else {
      let img = new Image();
      img.src = imgConfig.src;
      cache[imgConfig.id] = img;
      return img;
    }
  }

  function getConfig(path, id) {
    let config = {
      src: "",
      id: "",
      http: false
    };
    config.http = path.slice(0,4) == "http";
    config.src = config.http ? path : mainDirectory + path;
    config.id = id == "" ? path : id;
    return config;
  }

  /**
   * Object definition
   */
  var ImgManager = {
    load: load,
    get: get,
    setMainDirectory: setMainDirectory
  };

  return ImgManager;
}));
