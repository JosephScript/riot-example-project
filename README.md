# A Guide to Riot using Webpack for FE developers

In this Riot walk through we're going to be using the Riot JavaScript library for quickly building a user interface with enjoyable syntax and a small learning curve. We're using Webpack as our package bundler and to run our development server. We're also writing out JavaScript using ES2015 syntax and transpiling down to ES5 (this can be updated to go beyond ES2015).

## Setting up the project:

```
mkdir riot-base-project && cd riot-base-project
git init
npm init
```

When you run `npm init` fill in the details however you see fit. For example you can use `index.js` as your main Node file, and this will be the server that serves static assets, or maybe acts as your API server (check out how to proxy below).

## Webpack:

Let's go ahead and create a Webpack configuration file. With Webpack we can bundle up all of our assets into a single JS package, which reduces wait time by the browser and includes all of our CSS and images! In addition we can use a module loader such as CommonJS, RequireJS, AMD, Browserify or ES2015/ES6 Imports right inside our JS files, write your JS using latest (ES6, ES7 and beyond) standards/features and transpile it into any target JavaScript version you like, as well use any CSS preprocessors (Sass and Less, or pure css) and post-processors (never write a vendor prefix again!), images processors (do you like Data URIs?) or any other file loaders we like. Everything is embedded right into the JS file!

(You can optionally extract stylesheets into a css file, or export images instead of creating embedded data URIs if you like.)

Let's install Webpack:

```
npm install webpack --global
npm install webpack --save-dev
```

Let's assume we have all of our app's source code inside `/src` and make a basic webpack configuration in `webpack.config.js`, we will build on it as we go.

``` JavaScript
module.exports = {
  context: __dirname + '/src',
  entry: './app.js',

  output: {
    filename: 'app.js',
    path: __dirname + '/dist',
  },
}
```

This tells webpack that our app is in the src directory and the entry point to our application is `app.js`. `app.js` will eventually require any other files it needs. We also tell webpack to output the resulting JavaScript in `dist/app.js`.

Make sure it works by adding the file `src/app.js` and putting a `console.log` into it, just to make sure everything works.

``` JavaScript
// app.js
console.log('Hello world!')
```

Run the bundler with `webpack -d`, and you should see the output file in `dist` including a map file.

### HTML Plugin

If we wanted we could manually create an `HTML` file, point a `script` tag to this file and host it with Node/Express. But, there is a webpack loader called `html-loader` that will automatically create this html file with the correct location of the `dist/app.js` bundle.

Go ahead and install the plugin:

`npm install html-webpack-plugin --save-dev`

Now we have to add the plugin to our `webpack.config.js`:

``` JavaScript
var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  ...
  plugins: [
    new HtmlWebpackPlugin()
  ]

```

This will generate a file `dist/index.html` containing the following:

``` HTML
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Webpack App</title>
  </head>
  <body>
    <script src="app.js"></script>
  </body>
</html>
```

This is only the most basic configuration, so review the github page. Sometimes I find it useful to use an HTML template instead, which will allow me to link to external resources or bower/npm packages without bundling them into my app. But this is not necessary for this demo. Open the file in the browser and check the console, you should see your `hello world!`.

In the output of the `webpack -d` command you'll see that it generates a hash, which we can use for cache busting. All you have to do is change the webpack.config.js file to include the hash:

``` JavaScript
module.exports = {
  context: __dirname + '/src',
  entry: './app.js',

  output: {
    filename: 'app.[hash].js',
    path: __dirname + '/dist',
  }
}
```
### Hashing

Run it again and you should see the updated file, such as `app.fb49124036ee11c26c35.js`, and updated script `src` attribute.

### webpack Dev Server

webpack also has a light weight development server that we’ll be using to serve the assets that it compiles. We’ll use this going forward so that we can see the results of our work in the browser.

```
npm install webpack-dev-server -g
npm install webpack-dev-server --save-dev
```

Now we can run `webpack-dev-server` from the terminal and visit http://localhost:8080 in our browser to view the results of our work.


This works and we can see our `console.log` when we open the console. However right now if you alter the contents of `app.js`, nothing happens until you refresh the page. Instead, we want webpack to recompile our application and reload the page. To do this, run the command with the following flags:

```
webpack-dev-server --progress --inline
```

`--progress` displays the compilation progress when building
`--inline` adds webpack's automatic refresh code inline with the compile application

This is a really clumsy thing to type, so let's add it as npm start:

``` JSON
// package.json

{
  ...
  "scripts": {
    "start": "webpack-dev-server --progress --inline"
  }
  ...
}

```

### Proxy

The Webpack dev server makes use of `http-proxy-middleware` to optionally proxy requests to a separate, possibly external, backend server.

```
// webpack.config.js
{
  devServer: {
    ...
    proxy: {
      '/api': {
        target: 'https://other-server.example.com/api',
        secure: false
      }
    }
  }
  ...
}
```

The proxy can be bypassed based on the return from a function, and the request to the proxy can be rewritten by providing a function.

## Modules and Loaders

Because we're using the NodeJS native CommonJS `require`, we can use modules and require in any other JS files we like. But because we're using webpack we can load many other files including CSS and using *loaders*.

Loaders are transformations that are applied on a resource file of your app. They are functions (running in node.js) that take the source of a resource file as the parameter and return the new source.

For example, you can use loaders to tell webpack to load CoffeeScript or JSX.

Update your `webpack.config.js` to include some loaders:

``` JavaScript
module.exports = {
  ...
  module: {
    loaders: [
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.png$/, loader: 'url-loader?limit=100000' },
      { test: /\.jpg$/, loader: 'file-loader' }
    ]
  }
}
```

This webpack config can load styles using `style-loader` which adds CSS to the DOM by injecting a `<style>` tag, the `css-loader` returns css, resolves imports and url(...), and is used along with the `url-loader` which embeds small png images as Data Urls and `file-loader` loads jpg images as files. The `test` is what matching files (using regex) should be loaded using this loader the `limit` is an example of a loader which takes parameters.

Loaders must be installed via NPM, so let's do that.

```
npm install style-loader css-loader url-loader file-loader --save-dev
```

Add a file `src/styles.css` and set `body { background-color: red; }` just to make it obvious that it works.

In order to get the styles to show up, you have to either make a custom HTML file, or add the css file to your HtmlWebpackPlugin (which handles the linking for you), both of which a second request and don't bundle your files for you.

In your `app.js` file add `require('./styles.css')`. Once the page loads it should be red!

### ES2015/ES6 Module

ES2015 (AKA ES6) seeks to unify module loader patterns, so instead of deciding between CommonJS, RequireJS, AMD or Browserify, we can just always use ES2015 Modules.

Instead of writing `var math = require('lib/math')` you use `import math from 'lib/math'`, or you can use the async model to prevent code execution until the requested modules are available and processed `import * as math from 'lib/math'` or even import individual named components from a module such as `import { sum, pi } from 'lib/math'`.

To add support for ES2015 we're going to use `babel-loader`. It has a few requirements, so lets install them:

```
npm install babel-loader babel-core babel-preset-es2015 --save-dev
```

Now go ahead and add the loader and we'll tell it to use the preset `es2015`, and to test `.js` files, but exclude node_modules and bower_components.

``` JavaScript
// webpack.config.js
module.exports = {
  ...
  module: {
    loaders: [
    ...
    {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
    }
```

Change `require('./styles.css')` to the following:

```
import './styles.css'
```

### Hot Module Replacement

By default `webpack-dev-server` will trigger a full page refresh. However we can use something called Hot Module Replacement, or HMR. HMR adds a small runtime to the bundle during the build process that runs inside your app and detects changes. It’s like LiveReload for every module, thus HMR is faster because it updates code in-place without refreshing.

It's smart too, because it detects which modules are required and which have changed. If the polling shows no changes needed, nothing happens.

Add `--hot` to your npm start script. Nothing more is needed. This does all the relevant work automatically. The CLI of the `webpack-dev-server` automatically adds the special `webpack/hot/dev-server` entry point to your configuration.

So your start script should be :

```
"start": "webpack-dev-server --progress --inline --hot"
```

Just navigate to `http://«host»:«port»/«path»` and let the magic happen.

You should see the following messages in the browser log:

```
[HMR] Waiting for update signal from WDS...
[WDS] Hot Module Replacement enabled.
```

See [here](http://webpack.github.io/docs/webpack-dev-server.html#hot-module-replacement) for more details.

If you insted want to use an express/node webpack server as middleware, check out (webpack-hot-middleware)[https://github.com/glenjamin/webpack-hot-middleware].


We can update our CSS to confirm that it works:

``` CSS
body {
  background-color: blue;
}

```

## Riot


Let's start off with a really dead simple app just to make sure our build process is working and Riot works as we expect. Then we can start adding in pieces and tests as we go along. For now, let's just get a `p` tag on the page with a hello world.

First we have to add riot to our loaders.


```
npm install riotjs-loader --save-dev
```

``` JavaScript
// webpack.config.js
module.exports = {
  ...
  module: {
    preLoaders: [
      { test: /\.js$|\.tag$/,
        exclude: /node_modules/,
        loader: 'riotjs-loader',
        query: { type: 'none' }
      }
    ],
      ...
```

Riot will require an entry point into our application, so let's go ahead and add an HTML template:

``` HTML
// index.template.html
<!DOCTYPE html>
<html>
  <body>
    <greeting></greeting>
  </body>
</html>
```

And add Riot itself (Note that because Riot is required for our application to run, we’re using `--save `rather than `--save-dev`.):

```
npm install riot --save
```

You'll have to set `HtmlWebpackPlugin` to use this template, and you'l also need to tell webpack to provide the correct plugin to your app:

```
module.exports = {
  ...
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.template.html',
      inject: 'body'
    }),
    new webpack.ProvidePlugin({
      riot: 'riot'
    })
  ],
...
```

Now we can update our app.js file to be a super basic component that renders into the DOM using Riot's syntax. We're going to create a basic component that will contain our message, and we'll mount it in app.js:

```
// components/greeting.js
// optionally use 'components/greeting.tag'
<greeting>
  <h1 class='greeting'>Hello, World!</h1>
</greeting>
```


``` JavaScript
// app.js
import './styles.css'
import './components/greeting.js'

// mount the custom tag on the page
riot.mount('greeting')

```

And let's change our CSS to something more useful:

``` CSS
.greeting {
  color: red;
}

```

Run that and you should see the h1 load into your app!

## Components & Properties

Riot it component based, so you'll see your `<greeting></greeting>` tag in the HTML file will be filled with your content from the tag file!

You can also pass properties to your components from the mount function, for example:

```
// app.js
riot.mount('greeting', { name: 'World' })
```

And then

```
// components/greeting.js
// optionally use 'components/greeting.tag'
<greeting>
  <h1 class='greeting'>Hello, {opts.name}!</h1>
</greeting>
```

You access options using the `opts` object, and display those objects using the `{opts.property}` syntax, where `property` is the property you want to access.

## Events and Handlers

You can also interact with the user using events. You can use any of the built in JavaScript events such as `onsubmit`, `oninput`, etc. When you interact with an element on the page, it's value is automatically bound to "this" within your component with the same name or id.

For example, a textbox with `name="name"` will be bound to `this.name`.

Additionally, when interacting with elements, we can trigger the DOM to update. By default, this is disabled (except for checkboxes or radio buttons), because `e.preventDefault()` is already called for you, because this is what you usually want (or forget to do). So all you have to do is set a handler to return "true" and your DOM will update.

Check out the example:

```
<greeting>
  <h1 class='greeting'>Hello, {name.value || opts.name}!</h1>
  <label for='name'>
    Type a new name:
  </label>
  <input
    type='textbox'
    name='name'
    id='name'
    oninput={change}></input>
  <span>{name.value}</span>

  <!-- The script tag around this is optional -->
  this.change = (e) => {
    return true
  }

</greeting>
```

## Event object

The event handler receives the standard event object as the first argument. The following properties are normalized to work across browsers:

* `e.currentTarget` points to the element where the event handler is specified.
* `e.target` is the originating element. This is not necessarily the same as currentTarget.
* `e.which` is the key code in a keyboard event (keypress, keyup, etc…).
* `e.item` is the current element in a loop. See loops for more details.

Go read the [Riot Guide](http://riotjs.com/guide/) to learn more about tag syntax, styling, mixins, expressions, loops and more!
