# Image Context

A simple way to load and uses images with a central Javascript context


## Usage

```js
var ImageCtx = require('image-context');

// Set the main directory of all image files
ImageCtx.setDirectory("assets/imgDirectory");

// Load some files
ImageCtx.load("img/first.png");
ImageCtx.load(["img/second.png", "third.jpg"]);
// Load an image and give it an ID
ImageCtx.load({"foobar": "img/hidden/folder/foobar.png"});

// Access it later
var img1 = ImageCtx.get("img/first.png");
var img_foobar = ImageCtx.get("foobar");

// Query an image synchronously if it has not been previously loaded
var img_sync = ImageCtx.get("bob.jpeg");
```

## API

The module is a single *static* class `ImageContext`.

### `ImageContext.setDirectory(directory)`

Set the path to the main directory of all images loaded from a folder. This path will be prepend to all subsequent `load` call (if it not a url).

### `ImageContext.load(data)`

Load one or more images asynchronously, and store them in the class context to use them later.

Return a `Promise` containing all images of the context.

#### `String` data

If the input argument is a `String`, it will be used as a path / url to load the image.

#### `Object` data

If the input argument is an `Object`, the first *key* will be used as an **identifier** and the first *value* will be used as the path / url to load the image.

The identifier is useful to query the image later without having to specify the full path to the image again.

#### `Array` data

If the input argument is an `Array`, all items will be loaded successively. Each item can be either a `String`, an `Object`, or another `Array` (but this one is useless (I think)).


### `ImageContext.get(data)`

Query synchronously an `Image`. If it has been previously loaded, it returns the value instantly from the cache. Otherwise, it blocks the current process to load the image before returning the value.

#### `String` data

If the input argument is a `String`, it will be used as a path / Identifier of the image

#### `Object` data

If the input argument is an `Object`, the first *key* will be used as an **identifier** and the first *value* will be used as the path / url to load the image.


## Installation

The module can be installed from `npm`

```js
npm install image-context
```

It can also be installed by including the `image-context.js` file in your project


## License

This project is licensed under the WTFPL - see [LICENSE](LICENSE) for more details
