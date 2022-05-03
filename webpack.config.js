const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ChromeExtensionManifest = require('chrome-extension-manifest-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: {
    index: './src/index.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      favicon: 'src/favicon.png',
      minify: false
    }),
    new ChromeExtensionManifest({
      inputFile: './src/manifest.json',
      outputFile: path.resolve(__dirname, 'dist') + '/manifest.json'
    }),
    new CopyPlugin({
      patterns: [
        { from: './src/background.js', to: path.resolve(__dirname, 'dist') + '/background.js' },
        { from: './src/img', to: './img' }
      ]
    })
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  mode: 'production',
  watch: true
}
