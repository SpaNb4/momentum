const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, options) => {
  const isProd = options.mode === 'production';
  const config = {
    mode: isProd ? 'production' : 'development',
    devtool: isProd ? 'none' : 'source-map',
    entry: './momentum/script.js',
    output: {
      filename: 'script.js',
      path: path.resolve(__dirname, 'dist')
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    targets: {
                      esmodules: true,
                    },
                  },
                ],
              ],
            }
          }
        }
      ]
    },
    plugins: [
      new CopyWebpackPlugin([
        { from: `momentum/style.css`, to: `style.css` },
        { from: `momentum/index.html`, to: `index.html` },
        { from: `momentum/index_.html`, to: `index_.html` },
        { from: `momentum/assets`, to: `assets` },
        { from: `momentum/ext-utils`, to: `ext-utils` }
      ]),
    ],
  };

  return config;
}