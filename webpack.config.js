const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const Dotenv = require('dotenv-webpack');


module.exports = (env) => {
  return {
    mode: 'development',
    entry: [
      path.join(__dirname, 'src', 'index.js')
    ],
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'main.js',
      publicPath: '/'
    },
    module: {
      rules: [
        {
          test: /\.(css|less)$/,
          use: [
            { loader: 'style-loader' },
            { loader: 'css-loader' },
            { 
              loader: 'less-loader',
              options: {
                lessOptions: { // If you are using less-loader@5 please spread the lessOptions to options directly
                  modifyVars: {
                    hack: `true; @import "${path.resolve(
                      __filename,
                      "../",
                      "./src/stylesheets/waggle.less"
                    )}";`
                  },
                  javascriptEnabled: true,
                },
              }
            }
          ]
        },
        {
          test: /\.(png|jp(e*)g|svg|gif)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'images/[hash]-[name].[ext]',
              },
            },
          ]
        },
        {
          test: /\.(js|jsx?|ts|tsx)$/,
          resolve: {
            extensions: ['.js', '.jsx', '.ts', '.tsx']
          },
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript']
            }
          }
        }
      ]
    },
    devServer: {
      historyApiFallback: true
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    plugins: [
      new Dotenv({
        path: `./environments/.env${env.file ? `.${env.file}` : ''}`
      }),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'index.html')
      })
    ],
  }
};
