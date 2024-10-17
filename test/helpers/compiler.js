const webpack = require('webpack');
const path = require('path');
const { createFsFromVolume, Volume } = require('memfs');

function compileAsync(fixture, options = {}) {
  const compiler = webpack({
    context: path.resolve(__dirname, '..'),
    entry: path.resolve(__dirname, `../fixtures/${fixture}`),
    output: {
      path: path.resolve(__dirname),
      filename: 'bundle.js',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: {
            loader: path.resolve(__dirname, '../../src/index.js'),
            ...options,
          },
        },
      ],
    },
  });

  compiler.outputFileSystem = createFsFromVolume(new Volume());
  compiler.outputFileSystem.join = path.join.bind(path);

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        return reject(err);
      }

      if (stats.hasErrors()) {
        return reject(new Error(stats.toJson().errors));
      }

      return resolve(stats);
    });
  });
}

module.exports = compileAsync;
