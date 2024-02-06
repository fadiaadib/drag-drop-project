# Drag and Drop Project Manager

## npm commands

> npm init
>
> npm install
>
> npm start

## lite-server

Allows you to run a lite server on your local machine

> npm install --save-dev lite-server

Add this in `"scripts"` in the package.json: `"start": "lite-server"`

## tsc commands

> tsc --init
>
> tsc -w

## To install webpack

> npm install --save-dev webpack webpack-cli webpack-dev-server typescript ts-loader

- Create a **webpack.config.js** file in your root dir

  - For development:

    ```
    const path = require("path");

    module.exports = {
      mode: "development",
      entry: "./src/app.ts",
      devServer: {
        static: [
          {
            directory: path.join(__dirname),
          },
        ],
        client: {
          overlay: false,
        },
      },
      output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
        publicPath: "/dist/",
      },
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            use: "ts-loader",
            exclude: /node_modules/,
          },
        ],
      },
      resolve: {
        extensions: [".ts", ".js"],
      },
    };
    ```

- in tsconfig.json
  - set `"sourceMap": true`
  - you do not need to specify a `rootDir`
- in package.json
  - add `"build": "webpack"` to the `"scripts"`
  - add `"start": "webpack-dev-server"` to the `"scripts"`
- Remove extensions from your imports in your code
- For production,

  - Create a webpack.config.prod.js file:

    ```
    const path = require("path");
    const CleanPlugin = require("clean-webpack-plugin");

    module.exports = {
      mode: "production",
      entry: "./src/app.ts",
      devServer: {
        static: [
          {
            directory: path.join(__dirname),
          },
        ],
        client: {
          overlay: false,
        },
      },
      output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
      },
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            use: "ts-loader",
            exclude: /node_modules/,
          },
        ],
      },
      resolve: {
        extensions: [".ts", ".js"],
      },
      plugins: [new CleanPlugin.CleanWebpackPlugin()],
    };
    ```

  - in package.json
    - add `"build": "webpack --config webpack.config.prod.js"` to the `"scripts"`
