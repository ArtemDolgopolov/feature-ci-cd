const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const EslintPlugin = require('eslint-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const mode = process.env.NODE_ENV || 'development';
const devMode = mode === 'development';
const target = devMode ? 'web' : 'browserslist';
const devtool = devMode ? 'source-map' : undefined;
const publicPath = process.env.PUBLIC_PATH || '/';

module.exports = {
  mode,
  target,
  devtool,
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath,
    clean: true,
    filename: '[name].[contenthash].js',
    assetModuleFilename: 'assets/[name][ext]',
  },
  devServer: {
    open: true,
    host: 'localhost',
    historyApiFallback: true,
    hot: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.PUBLIC_PATH': JSON.stringify(process.env.PUBLIC_PATH || '/'),
    }),

    new HtmlWebpackPlugin({
      template: 'src/index.html',
    }),

    {
      apply: (compiler) => {
        compiler.hooks.compilation.tap('LcpPreloadPlugin', (compilation) => {
          HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tap('LcpPreloadPlugin', (data) => {
            const href = `${publicPath}assets/img/plants/1/1.jpg`;
            data.html = data.html.replace(
              '<title>',
              `<link rel="preload" as="image" href="${href}" fetchpriority="high"><title>`
            );
            data.html = data.html.replace(
              '<div id="catalog-skeleton" aria-hidden="true"></div>',
              `<img class="product__photo-img" src="${href}" alt="Echeveria SC-092" width="256" height="256" fetchpriority="high" aria-hidden="true" style="position:absolute;opacity:0;width:1px;height:1px;pointer-events:none;overflow:hidden"><div id="catalog-skeleton" aria-hidden="true"></div>`
            );
            return data;
          });
        });
      },
    },

    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),

    new EslintPlugin({ extensions: ['ts', 'js'] }),

    new CopyPlugin({
      patterns: [
        { from: 'src/assets', to: 'assets' },
        { from: 'src/data/plants', to: 'assets/img/plants' },
        { from: path.resolve(__dirname, '_redirects'), to: '' },
      ],
    }),

    new CleanWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader',
        options: {
          sources: {
            urlFilter: (_attribute, value) => !value.includes('assets/img/plants'),
          },
        },
      },
      {
        test: /\.(ts|tsx)$/i,
        loader: 'ts-loader',
        exclude: ['/node_modules/', '/dist/'],
      },
      {
        test: /\.scss$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
            },
          },
        ],
      },
      {
        test: /\.woff2?$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]',
        },
      },
      {
        test: /\.(jpe?g|png|webp|gif|svg)$/i,
        use: [
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.9],
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },
              webp: {
                quality: 75,
              },
            },
          },
        ],
        type: 'asset/resource',
      },
      {
        test: /\.m?js$/i,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '...'],
  },
};
