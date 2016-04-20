# let-it-drop

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.15.1.

## Development

Either:

Run `npm run serve:application` to execute the grunt angular application (port 9000) and the node server component (port 3000) in parallel.
The grunt server implements a proxy configuration to access the server.

Or:

Run `grunt` for building and `grunt serve` for previewing the angular application.
Run `node node_server/serve.js`

## Build

You can build and bundle the application by running `grunt build`.
This generates the production version of the angular application and the production version of the server application in the _dist_-folder.

## Testing

Running `grunt test` will run the unit tests with karma.
