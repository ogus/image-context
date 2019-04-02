# Image Loader

A small and simple tool to dynamically load and store images in a single JS context


## Usage

```js
var ImageLoader = require('image-loader');

// Set the main directory of all image files
ImageLoader.setDirectory("path/to/images/");

// Load 1 image
ImageLoader.load("first.png");
// Load 2 images
ImageLoader.load(["folder/second.png", "https://www.w3schools.com/w3css/img_lights.jpg"]);
// Load an image and give it an ID
ImageLoader.load({"folder/hidden/foobar.png": "hidden_foobar"});

// Access loaded images
ImageLoader.onload(function () {
  // Get an image with its name as an ID
  var second = ImageLoader.get("img_lights.jpg");
  // Or use a custom ID previously set
  var img_foobar = ImageLoader.get("hidden_foobar");
});

```


## API

The module provides a single *static* class `ImageLoader`, with a set of *static* methods.

### `setDirectory(directory)`

Set the path to the main directory of all images.

This path will be prepend to all arguments used in subsequent `load()` call, except if the path is detected as a *url*.

### `load(data)`

Load one or more images asynchronously, and store them in the object context for later use. See *Input Format* for more details.

Return an object with a unique `then(func)` method, that accepts a callback function. This allows you to chain the `load` method with another method that will be called after all images are loaded.

```js
ImageLoader.load(["img1.png", "img2.png"]).then(function () {
  // do something
});
```

### `onload(func)`

Set the loader callback as `func`. It will be automatically called when all images are loaded.

### `get(img)`

Retrieve an image that has been previously loaded.

The input argument is the identifier of the image: it is either the name of the image file, or the custom ID that has been set manually (see *Image Identifier*)

### Input Format

The `load` method accepts different types of input arguments, which enable complex loading pattern.

#### `String` data

If the input argument is a `String`, it will be used as the path / url to load a single image.

#### `Array` data

If the input argument is an `Array`, all elements of the array will be loaded successively. Each element can be either a `String`, an `Object`, or another `Array`.

#### `Object` data

If the input argument is an `Object`, each pair of key / value  will be loaded successively.

For each key / value pair, the *key* is added to the current path before the *value* is loaded. The value can be either a `String`, another `Object`, or an `Array`.

The object structure allows to load images by defining a folder-like structure that is parsed recursively.

### Image Identifier

By default, the name of a loaded image is used as its identifier. However, you can easily provide a custom identifier for any image.

Setting the ID of an image is useful to query the image later without having to specify the full name of the image.

To define a custom ID, you need to use an `Object` structure:
```js
ImageLoader.load({"path/to/image.jpeg", "myCustomId"});
```

The object must have a unique key with a unique value, both being `String` elements. The *key* is used as the path to the image, and the *value* is the identifier.

### Examples

*All example are presented without callback.*

Load 3 images, with the last one having a custom ID
```js
ImageLoader.load([
  "img1.png",
  "img2.png",
  {"img3.png": "foo"}
]);
```

Load 5 images in 3 different folders
```js
ImageLoader.load({
  "folder1/": ["img1.png", "img2.png"],
  "folder2/": {
    "subfolder1/": "img3.png",
    "subfolder2/": ["img4.png", "img5.png"]
  }
});
```

Load 4 images in a local folder and 3 from a url, with an `Object` structure
```js
ImageLoader.load({
  "../asset/": {
    "vfx/": [
      "fx1.png",
      "fx2.png",
      {"image_with_long_name.png": "fx3"} // this one has ID: "fx3"
    ],
    "face/": "main.jpg"
  },
  "https://www.w3schools.com/html/": [
    "pic_trulli.jpg",
    {"img_girl.jpg": "girl"}, // this one has ID: "girl"
    "img_chania.jpg"
  ]
});
```

Same example as before, with more `Array` structures
```js
ImageLoader.load([
  {
    "../asset/vfx/": [
      "fx1.png",
      "fx2.png",
      {"image_with_long_name.png": "fx3"}
    ]
  },
  "../asset/face/main.jpg",
  [
    "https://www.w3schools.com/html/pic_trulli.jpg",
    {"https://www.w3schools.com/html/img_girl.jpg": "girl"},
    "https://www.w3schools.com/html/img_chania.jpg",
  ]
]);
```


## Installation

You can install the module with [npm](https://www.npmjs.com/)
```sh
npm install image-loader
```

You can import the module with a CDN like [unpkg](https://unpkg.com/)
```html
<script type="text/javascript" src="https://unpkg.com/image-loader@latest"></script>
```

You can clone the repository & include the `image-loader.js` file in your project:
```sh
git clone https://github.com/ogus/image-loader.git
```


## License

This project is licensed under the WTFPL - see [LICENSE](LICENSE) for more details
