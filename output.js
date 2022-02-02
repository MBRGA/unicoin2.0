{
  mode: 'development',
  context: 'E:\\Masters thesis\\Unicoin',
  node: {
    setImmediate: false,
    process: 'mock',
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  },
  output: {
    path: 'E:\\Masters thesis\\Unicoin\\dist',
    filename: 'js/[name].js',
    publicPath: '/',
    chunkFilename: 'js/[name].js',
    globalObject: 'this'
  },
  resolve: {
    alias: {
      '@': 'E:\\Masters thesis\\Unicoin\\src',
      vue$: 'vue/dist/vue.runtime.esm-bundler.js'
    },
    extensions: [
      '.tsx',
      '.ts',
      '.mjs',
      '.js',
      '.jsx',
      '.vue',
      '.json',
      '.wasm'
    ],
    modules: [
      'node_modules',
      'E:\\Masters thesis\\Unicoin\\node_modules',
      'E:\\Masters thesis\\Unicoin\\.yarn\\__virtual__\\@vue-cli-service-virtual-7f92af03e1\\0\\cache\\@vue-cli-service-npm-4.5.15-238f506957-a054de4a67.zip\\node_modules\\@vue\\cli-service\\node_modules'
    ],
    plugins: [
      {
        apply: function () { /* omitted long function */ },
        makePlugin: function () { /* omitted long function */ },
        moduleLoader: function () { /* omitted long function */ },
        topLevelLoader: {
          apply: function () { /* omitted long function */ }
        },
        bind: function () { /* omitted long function */ },
        tsLoaderOptions: function () { /* omitted long function */ },
        forkTsCheckerOptions: function () { /* omitted long function */ }
      }
    ]
  },
  resolveLoader: {
    modules: [
      'E:\\Masters thesis\\Unicoin\\.yarn\\__virtual__\\@vue-cli-plugin-typescript-virtual-49a1bd6380\\0\\cache\\@vue-cli-plugin-typescript-npm-4.5.15-82e5dc9254-aa6de00c3a.zip\\node_modules\\@vue\\cli-plugin-typescript\\node_modules',
      'E:\\Masters thesis\\Unicoin\\.yarn\\__virtual__\\@vue-cli-plugin-babel-virtual-ed931b6aaf\\0\\cache\\@vue-cli-plugin-babel-npm-4.5.15-44f4acfc2a-9b64cfd6a5.zip\\node_modules\\@vue\\cli-plugin-babel\\node_modules',
      'node_modules',
      'E:\\Masters thesis\\Unicoin\\node_modules',
      'E:\\Masters thesis\\Unicoin\\.yarn\\__virtual__\\@vue-cli-service-virtual-7f92af03e1\\0\\cache\\@vue-cli-service-npm-4.5.15-238f506957-a054de4a67.zip\\node_modules\\@vue\\cli-service\\node_modules'
    ],
    plugins: [
      {
        apply: function () { /* omitted long function */ }
      }
    ]
  },
  module: {
    noParse: /^(vue|vue-router|vuex|vuex-router-sync)$/,
    rules: [
      /* config.module.rule('mjs') */
      {
        test: /\.mjs$/,
        type: 'javascript/auto',
        include: [
          /node_modules/
        ]
      },
      /* config.module.rule('vue') */
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\__virtual__\\cache-loader-virtual-d146ff887e\\0\\cache\\cache-loader-npm-4.1.0-82c3da90d8-0339778bdd.zip\\node_modules\\cache-loader\\dist\\cjs.js',
            options: {
              cacheDirectory: 'E:\\Masters thesis\\Unicoin\\node_modules\\.cache\\vue-loader',
              cacheIdentifier: '57b0ca4e'
            }
          },
          {
            loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\__virtual__\\vue-loader-virtual-7d9164f672\\0\\cache\\vue-loader-npm-16.8.3-e05f7daca3-7c0566847b.zip\\node_modules\\vue-loader\\dist\\index.js',
            options: {
              cacheDirectory: 'E:\\Masters thesis\\Unicoin\\node_modules\\.cache\\vue-loader',
              cacheIdentifier: '57b0ca4e',
              babelParserPlugins: [
                'jsx',
                'classProperties',
                'decorators-legacy'
              ]
            }
          }
        ]
      },
      /* config.module.rule('images') */
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        use: [
          {
            loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\__virtual__\\url-loader-virtual-bfa60fef2e\\0\\cache\\url-loader-npm-2.3.0-1c61e05651-c0a8a6e728.zip\\node_modules\\url-loader\\dist\\cjs.js',
            options: {
              limit: 4096,
              fallback: {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\__virtual__\\file-loader-virtual-e47f2de1ab\\0\\cache\\file-loader-npm-4.3.0-048fd1e003-a005ac5599.zip\\node_modules\\file-loader\\dist\\cjs.js',
                options: {
                  name: 'img/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      /* config.module.rule('svg') */
      {
        test: /\.(svg)(\?.*)?$/,
        use: [
          {
            loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\__virtual__\\file-loader-virtual-e47f2de1ab\\0\\cache\\file-loader-npm-4.3.0-048fd1e003-a005ac5599.zip\\node_modules\\file-loader\\dist\\cjs.js',
            options: {
              name: 'img/[name].[hash:8].[ext]'
            }
          }
        ]
      },
      /* config.module.rule('media') */
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: [
          {
            loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\__virtual__\\url-loader-virtual-bfa60fef2e\\0\\cache\\url-loader-npm-2.3.0-1c61e05651-c0a8a6e728.zip\\node_modules\\url-loader\\dist\\cjs.js',
            options: {
              limit: 4096,
              fallback: {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\__virtual__\\file-loader-virtual-e47f2de1ab\\0\\cache\\file-loader-npm-4.3.0-048fd1e003-a005ac5599.zip\\node_modules\\file-loader\\dist\\cjs.js',
                options: {
                  name: 'media/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      /* config.module.rule('fonts') */
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        use: [
          {
            loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\__virtual__\\url-loader-virtual-bfa60fef2e\\0\\cache\\url-loader-npm-2.3.0-1c61e05651-c0a8a6e728.zip\\node_modules\\url-loader\\dist\\cjs.js',
            options: {
              limit: 4096,
              fallback: {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\__virtual__\\file-loader-virtual-e47f2de1ab\\0\\cache\\file-loader-npm-4.3.0-048fd1e003-a005ac5599.zip\\node_modules\\file-loader\\dist\\cjs.js',
                options: {
                  name: 'fonts/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      /* config.module.rule('pug') */
      {
        test: /\.pug$/,
        oneOf: [
          /* config.module.rule('pug').rule('pug-vue') */
          {
            resourceQuery: /vue/,
            use: [
              {
                loader: 'pug-plain-loader'
              }
            ]
          },
          /* config.module.rule('pug').rule('pug-template') */
          {
            use: [
              {
                loader: 'raw-loader'
              },
              {
                loader: 'pug-plain-loader'
              }
            ]
          }
        ]
      },
      /* config.module.rule('css') */
      {
        test: /\.css$/,
        oneOf: [
          /* config.module.rule('css').rule('vue-modules') */
          {
            resourceQuery: /module/,
            use: [
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\cache\\vue-style-loader-npm-4.1.3-878b169e65-ef79d0c632.zip\\node_modules\\vue-style-loader\\index.js',
                options: {
                  sourceMap: false,
                  shadowMode: false
                }
              },
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\__virtual__\\css-loader-virtual-d5fd399263\\0\\cache\\css-loader-npm-3.6.0-3394f37d07-a45d7ee810.zip\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: {
                    localIdentName: '[name]_[local]_[hash:base64:5]'
                  }
                }
              },
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\cache\\postcss-loader-npm-3.0.0-f4ab99b685-a6a922cbcc.zip\\node_modules\\postcss-loader\\src\\index.js',
                options: {
                  sourceMap: false,
                  plugins: [
                    function () { /* omitted long function */ }
                  ]
                }
              }
            ]
          },
          /* config.module.rule('css').rule('vue') */
          {
            resourceQuery: /\?vue/,
            use: [
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\cache\\vue-style-loader-npm-4.1.3-878b169e65-ef79d0c632.zip\\node_modules\\vue-style-loader\\index.js',
                options: {
                  sourceMap: false,
                  shadowMode: false
                }
              },
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\__virtual__\\css-loader-virtual-d5fd399263\\0\\cache\\css-loader-npm-3.6.0-3394f37d07-a45d7ee810.zip\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\cache\\postcss-loader-npm-3.0.0-f4ab99b685-a6a922cbcc.zip\\node_modules\\postcss-loader\\src\\index.js',
                options: {
                  sourceMap: false,
                  plugins: [
                    function () { /* omitted long function */ }
                  ]
                }
              }
            ]
          },
          /* config.module.rule('css').rule('normal-modules') */
          {
            test: /\.module\.\w+$/,
            use: [
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\cache\\vue-style-loader-npm-4.1.3-878b169e65-ef79d0c632.zip\\node_modules\\vue-style-loader\\index.js',
                options: {
                  sourceMap: false,
                  shadowMode: false
                }
              },
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\__virtual__\\css-loader-virtual-d5fd399263\\0\\cache\\css-loader-npm-3.6.0-3394f37d07-a45d7ee810.zip\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: {
                    localIdentName: '[name]_[local]_[hash:base64:5]'
                  }
                }
              },
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\cache\\postcss-loader-npm-3.0.0-f4ab99b685-a6a922cbcc.zip\\node_modules\\postcss-loader\\src\\index.js',
                options: {
                  sourceMap: false,
                  plugins: [
                    function () { /* omitted long function */ }
                  ]
                }
              }
            ]
          },
          /* config.module.rule('css').rule('normal') */
          {
            use: [
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\cache\\vue-style-loader-npm-4.1.3-878b169e65-ef79d0c632.zip\\node_modules\\vue-style-loader\\index.js',
                options: {
                  sourceMap: false,
                  shadowMode: false
                }
              },
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\__virtual__\\css-loader-virtual-d5fd399263\\0\\cache\\css-loader-npm-3.6.0-3394f37d07-a45d7ee810.zip\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\cache\\postcss-loader-npm-3.0.0-f4ab99b685-a6a922cbcc.zip\\node_modules\\postcss-loader\\src\\index.js',
                options: {
                  sourceMap: false,
                  plugins: [
                    function () { /* omitted long function */ }
                  ]
                }
              }
            ]
          }
        ]
      },
      /* config.module.rule('postcss') */
      {
        test: /\.p(ost)?css$/,
        oneOf: [
          /* config.module.rule('postcss').rule('vue-modules') */
          {
            resourceQuery: /module/,
            use: [
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\cache\\vue-style-loader-npm-4.1.3-878b169e65-ef79d0c632.zip\\node_modules\\vue-style-loader\\index.js',
                options: {
                  sourceMap: false,
                  shadowMode: false
                }
              },
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\__virtual__\\css-loader-virtual-d5fd399263\\0\\cache\\css-loader-npm-3.6.0-3394f37d07-a45d7ee810.zip\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: {
                    localIdentName: '[name]_[local]_[hash:base64:5]'
                  }
                }
              },
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\cache\\postcss-loader-npm-3.0.0-f4ab99b685-a6a922cbcc.zip\\node_modules\\postcss-loader\\src\\index.js',
                options: {
                  sourceMap: false,
                  plugins: [
                    function () { /* omitted long function */ }
                  ]
                }
              }
            ]
          },
          /* config.module.rule('postcss').rule('vue') */
          {
            resourceQuery: /\?vue/,
            use: [
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\cache\\vue-style-loader-npm-4.1.3-878b169e65-ef79d0c632.zip\\node_modules\\vue-style-loader\\index.js',
                options: {
                  sourceMap: false,
                  shadowMode: false
                }
              },
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\__virtual__\\css-loader-virtual-d5fd399263\\0\\cache\\css-loader-npm-3.6.0-3394f37d07-a45d7ee810.zip\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\cache\\postcss-loader-npm-3.0.0-f4ab99b685-a6a922cbcc.zip\\node_modules\\postcss-loader\\src\\index.js',
                options: {
                  sourceMap: false,
                  plugins: [
                    function () { /* omitted long function */ }
                  ]
                }
              }
            ]
          },
          /* config.module.rule('postcss').rule('normal-modules') */
          {
            test: /\.module\.\w+$/,
            use: [
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\cache\\vue-style-loader-npm-4.1.3-878b169e65-ef79d0c632.zip\\node_modules\\vue-style-loader\\index.js',
                options: {
                  sourceMap: false,
                  shadowMode: false
                }
              },
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\__virtual__\\css-loader-virtual-d5fd399263\\0\\cache\\css-loader-npm-3.6.0-3394f37d07-a45d7ee810.zip\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: {
                    localIdentName: '[name]_[local]_[hash:base64:5]'
                  }
                }
              },
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\cache\\postcss-loader-npm-3.0.0-f4ab99b685-a6a922cbcc.zip\\node_modules\\postcss-loader\\src\\index.js',
                options: {
                  sourceMap: false,
                  plugins: [
                    function () { /* omitted long function */ }
                  ]
                }
              }
            ]
          },
          /* config.module.rule('postcss').rule('normal') */
          {
            use: [
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\cache\\vue-style-loader-npm-4.1.3-878b169e65-ef79d0c632.zip\\node_modules\\vue-style-loader\\index.js',
                options: {
                  sourceMap: false,
                  shadowMode: false
                }
              },
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\__virtual__\\css-loader-virtual-d5fd399263\\0\\cache\\css-loader-npm-3.6.0-3394f37d07-a45d7ee810.zip\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\cache\\postcss-loader-npm-3.0.0-f4ab99b685-a6a922cbcc.zip\\node_modules\\postcss-loader\\src\\index.js',
                options: {
                  sourceMap: false,
                  plugins: [
                    function () { /* omitted long function */ }
                  ]
                }
              }
            ]
          }
        ]
      },
      /* config.module.rule('scss') */
      {
        test: /\.scss$/,
        oneOf: [
          /* config.module.rule('scss').rule('vue-modules') */
          {
            resourceQuery: /module/,
            use: [
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\cache\\vue-style-loader-npm-4.1.3-878b169e65-ef79d0c632.zip\\node_modules\\vue-style-loader\\index.js',
                options: {
                  sourceMap: false,
                  shadowMode: false
                }
              },
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\__virtual__\\css-loader-virtual-d5fd399263\\0\\cache\\css-loader-npm-3.6.0-3394f37d07-a45d7ee810.zip\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: {
                    localIdentName: '[name]_[local]_[hash:base64:5]'
                  }
                }
              },
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\cache\\postcss-loader-npm-3.0.0-f4ab99b685-a6a922cbcc.zip\\node_modules\\postcss-loader\\src\\index.js',
                options: {
                  sourceMap: false,
                  plugins: [
                    function () { /* omitted long function */ }
                  ]
                }
              },
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\__virtual__\\sass-loader-virtual-c08795d023\\0\\cache\\sass-loader-npm-12.4.0-3d3847fd35-0f7ca3633e.zip\\node_modules\\sass-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  implementation: {
                    load: function () { /* omitted long function */ },
                    compile: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    compileString: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    compileAsync: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    compileStringAsync: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    Value: function Value0() {
                    },
                    SassBoolean: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    SassArgumentList: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    SassColor: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    SassFunction: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    SassList: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    SassMap: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    SassNumber: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    SassString: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    sassNull: {},
                    sassTrue: {
                      value: true
                    },
                    sassFalse: {
                      value: false
                    },
                    Exception: function () { /* omitted long function */ },
                    Logger: {
                      silent: {
                        warn: function () {
                          return _call(f, Array.prototype.slice.apply(arguments));
                        },
                        debug: function () {
                          return _call(f, Array.prototype.slice.apply(arguments));
                        }
                      }
                    },
                    info: 'dart-sass\t1.49.0\t(Sass Compiler)\t[Dart]\ndart2js\t2.15.1\t(Dart Compiler)\t[Dart]',
                    render: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    renderSync: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    types: {
                      Boolean: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Color: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      List: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Map: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Null: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Number: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      String: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Error: function Error() { [native code] }
                    },
                    NULL: {},
                    TRUE: {
                      value: true
                    },
                    FALSE: {
                      value: false
                    },
                    cli_pkg_main_0_: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    }
                  },
                  data: '@import "@/styles/variables.scss";'
                }
              }
            ]
          },
          /* config.module.rule('scss').rule('vue') */
          {
            resourceQuery: /\?vue/,
            use: [
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\cache\\vue-style-loader-npm-4.1.3-878b169e65-ef79d0c632.zip\\node_modules\\vue-style-loader\\index.js',
                options: {
                  sourceMap: false,
                  shadowMode: false
                }
              },
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\__virtual__\\css-loader-virtual-d5fd399263\\0\\cache\\css-loader-npm-3.6.0-3394f37d07-a45d7ee810.zip\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\cache\\postcss-loader-npm-3.0.0-f4ab99b685-a6a922cbcc.zip\\node_modules\\postcss-loader\\src\\index.js',
                options: {
                  sourceMap: false,
                  plugins: [
                    function () { /* omitted long function */ }
                  ]
                }
              },
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\__virtual__\\sass-loader-virtual-c08795d023\\0\\cache\\sass-loader-npm-12.4.0-3d3847fd35-0f7ca3633e.zip\\node_modules\\sass-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  implementation: {
                    load: function () { /* omitted long function */ },
                    compile: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    compileString: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    compileAsync: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    compileStringAsync: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    Value: function Value0() {
                    },
                    SassBoolean: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    SassArgumentList: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    SassColor: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    SassFunction: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    SassList: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    SassMap: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    SassNumber: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    SassString: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    sassNull: {},
                    sassTrue: {
                      value: true
                    },
                    sassFalse: {
                      value: false
                    },
                    Exception: function () { /* omitted long function */ },
                    Logger: {
                      silent: {
                        warn: function () {
                          return _call(f, Array.prototype.slice.apply(arguments));
                        },
                        debug: function () {
                          return _call(f, Array.prototype.slice.apply(arguments));
                        }
                      }
                    },
                    info: 'dart-sass\t1.49.0\t(Sass Compiler)\t[Dart]\ndart2js\t2.15.1\t(Dart Compiler)\t[Dart]',
                    render: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    renderSync: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    types: {
                      Boolean: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Color: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      List: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Map: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Null: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Number: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      String: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Error: function Error() { [native code] }
                    },
                    NULL: {},
                    TRUE: {
                      value: true
                    },
                    FALSE: {
                      value: false
                    },
                    cli_pkg_main_0_: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    }
                  },
                  data: '@import "@/styles/variables.scss";'
                }
              }
            ]
          },
          /* config.module.rule('scss').rule('normal-modules') */
          {
            test: /\.module\.\w+$/,
            use: [
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\cache\\vue-style-loader-npm-4.1.3-878b169e65-ef79d0c632.zip\\node_modules\\vue-style-loader\\index.js',
                options: {
                  sourceMap: false,
                  shadowMode: false
                }
              },
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\__virtual__\\css-loader-virtual-d5fd399263\\0\\cache\\css-loader-npm-3.6.0-3394f37d07-a45d7ee810.zip\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: {
                    localIdentName: '[name]_[local]_[hash:base64:5]'
                  }
                }
              },
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\cache\\postcss-loader-npm-3.0.0-f4ab99b685-a6a922cbcc.zip\\node_modules\\postcss-loader\\src\\index.js',
                options: {
                  sourceMap: false,
                  plugins: [
                    function () { /* omitted long function */ }
                  ]
                }
              },
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\__virtual__\\sass-loader-virtual-c08795d023\\0\\cache\\sass-loader-npm-12.4.0-3d3847fd35-0f7ca3633e.zip\\node_modules\\sass-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  implementation: {
                    load: function () { /* omitted long function */ },
                    compile: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    compileString: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    compileAsync: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    compileStringAsync: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    Value: function Value0() {
                    },
                    SassBoolean: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    SassArgumentList: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    SassColor: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    SassFunction: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    SassList: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    SassMap: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    SassNumber: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    SassString: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    sassNull: {},
                    sassTrue: {
                      value: true
                    },
                    sassFalse: {
                      value: false
                    },
                    Exception: function () { /* omitted long function */ },
                    Logger: {
                      silent: {
                        warn: function () {
                          return _call(f, Array.prototype.slice.apply(arguments));
                        },
                        debug: function () {
                          return _call(f, Array.prototype.slice.apply(arguments));
                        }
                      }
                    },
                    info: 'dart-sass\t1.49.0\t(Sass Compiler)\t[Dart]\ndart2js\t2.15.1\t(Dart Compiler)\t[Dart]',
                    render: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    renderSync: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    types: {
                      Boolean: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Color: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      List: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Map: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Null: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Number: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      String: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Error: function Error() { [native code] }
                    },
                    NULL: {},
                    TRUE: {
                      value: true
                    },
                    FALSE: {
                      value: false
                    },
                    cli_pkg_main_0_: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    }
                  },
                  data: '@import "@/styles/variables.scss";'
                }
              }
            ]
          },
          /* config.module.rule('scss').rule('normal') */
          {
            use: [
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\cache\\vue-style-loader-npm-4.1.3-878b169e65-ef79d0c632.zip\\node_modules\\vue-style-loader\\index.js',
                options: {
                  sourceMap: false,
                  shadowMode: false
                }
              },
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\__virtual__\\css-loader-virtual-d5fd399263\\0\\cache\\css-loader-npm-3.6.0-3394f37d07-a45d7ee810.zip\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\cache\\postcss-loader-npm-3.0.0-f4ab99b685-a6a922cbcc.zip\\node_modules\\postcss-loader\\src\\index.js',
                options: {
                  sourceMap: false,
                  plugins: [
                    function () { /* omitted long function */ }
                  ]
                }
              },
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\__virtual__\\sass-loader-virtual-c08795d023\\0\\cache\\sass-loader-npm-12.4.0-3d3847fd35-0f7ca3633e.zip\\node_modules\\sass-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  implementation: {
                    load: function () { /* omitted long function */ },
                    compile: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    compileString: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    compileAsync: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    compileStringAsync: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    Value: function Value0() {
                    },
                    SassBoolean: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    SassArgumentList: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    SassColor: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    SassFunction: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    SassList: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    SassMap: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    SassNumber: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    SassString: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    sassNull: {},
                    sassTrue: {
                      value: true
                    },
                    sassFalse: {
                      value: false
                    },
                    Exception: function () { /* omitted long function */ },
                    Logger: {
                      silent: {
                        warn: function () {
                          return _call(f, Array.prototype.slice.apply(arguments));
                        },
                        debug: function () {
                          return _call(f, Array.prototype.slice.apply(arguments));
                        }
                      }
                    },
                    info: 'dart-sass\t1.49.0\t(Sass Compiler)\t[Dart]\ndart2js\t2.15.1\t(Dart Compiler)\t[Dart]',
                    render: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    renderSync: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    types: {
                      Boolean: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Color: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      List: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Map: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Null: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Number: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      String: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Error: function Error() { [native code] }
                    },
                    NULL: {},
                    TRUE: {
                      value: true
                    },
                    FALSE: {
                      value: false
                    },
                    cli_pkg_main_0_: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    }
                  },
                  data: '@import "@/styles/variables.scss";'
                }
              }
            ]
          }
        ]
      },
      /* config.module.rule('sass') */
      {
        test: /\.sass$/,
        oneOf: [
          /* config.module.rule('sass').rule('vue-modules') */
          {
            resourceQuery: /module/,
            use: [
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\cache\\vue-style-loader-npm-4.1.3-878b169e65-ef79d0c632.zip\\node_modules\\vue-style-loader\\index.js',
                options: {
                  sourceMap: false,
                  shadowMode: false
                }
              },
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\__virtual__\\css-loader-virtual-d5fd399263\\0\\cache\\css-loader-npm-3.6.0-3394f37d07-a45d7ee810.zip\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: {
                    localIdentName: '[name]_[local]_[hash:base64:5]'
                  }
                }
              },
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\cache\\postcss-loader-npm-3.0.0-f4ab99b685-a6a922cbcc.zip\\node_modules\\postcss-loader\\src\\index.js',
                options: {
                  sourceMap: false,
                  plugins: [
                    function () { /* omitted long function */ }
                  ]
                }
              },
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\__virtual__\\sass-loader-virtual-c08795d023\\0\\cache\\sass-loader-npm-12.4.0-3d3847fd35-0f7ca3633e.zip\\node_modules\\sass-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  implementation: {
                    load: function () { /* omitted long function */ },
                    compile: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    compileString: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    compileAsync: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    compileStringAsync: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    Value: function Value0() {
                    },
                    SassBoolean: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    SassArgumentList: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    SassColor: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    SassFunction: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    SassList: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    SassMap: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    SassNumber: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    SassString: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    sassNull: {},
                    sassTrue: {
                      value: true
                    },
                    sassFalse: {
                      value: false
                    },
                    Exception: function () { /* omitted long function */ },
                    Logger: {
                      silent: {
                        warn: function () {
                          return _call(f, Array.prototype.slice.apply(arguments));
                        },
                        debug: function () {
                          return _call(f, Array.prototype.slice.apply(arguments));
                        }
                      }
                    },
                    info: 'dart-sass\t1.49.0\t(Sass Compiler)\t[Dart]\ndart2js\t2.15.1\t(Dart Compiler)\t[Dart]',
                    render: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    renderSync: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    types: {
                      Boolean: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Color: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      List: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Map: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Null: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Number: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      String: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Error: function Error() { [native code] }
                    },
                    NULL: {},
                    TRUE: {
                      value: true
                    },
                    FALSE: {
                      value: false
                    },
                    cli_pkg_main_0_: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    }
                  },
                  data: '@import "@/styles/variables.scss";',
                  sassOptions: {
                    indentedSyntax: true
                  }
                }
              }
            ]
          },
          /* config.module.rule('sass').rule('vue') */
          {
            resourceQuery: /\?vue/,
            use: [
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\cache\\vue-style-loader-npm-4.1.3-878b169e65-ef79d0c632.zip\\node_modules\\vue-style-loader\\index.js',
                options: {
                  sourceMap: false,
                  shadowMode: false
                }
              },
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\__virtual__\\css-loader-virtual-d5fd399263\\0\\cache\\css-loader-npm-3.6.0-3394f37d07-a45d7ee810.zip\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\cache\\postcss-loader-npm-3.0.0-f4ab99b685-a6a922cbcc.zip\\node_modules\\postcss-loader\\src\\index.js',
                options: {
                  sourceMap: false,
                  plugins: [
                    function () { /* omitted long function */ }
                  ]
                }
              },
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\__virtual__\\sass-loader-virtual-c08795d023\\0\\cache\\sass-loader-npm-12.4.0-3d3847fd35-0f7ca3633e.zip\\node_modules\\sass-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  implementation: {
                    load: function () { /* omitted long function */ },
                    compile: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    compileString: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    compileAsync: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    compileStringAsync: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    Value: function Value0() {
                    },
                    SassBoolean: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    SassArgumentList: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    SassColor: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    SassFunction: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    SassList: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    SassMap: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    SassNumber: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    SassString: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    sassNull: {},
                    sassTrue: {
                      value: true
                    },
                    sassFalse: {
                      value: false
                    },
                    Exception: function () { /* omitted long function */ },
                    Logger: {
                      silent: {
                        warn: function () {
                          return _call(f, Array.prototype.slice.apply(arguments));
                        },
                        debug: function () {
                          return _call(f, Array.prototype.slice.apply(arguments));
                        }
                      }
                    },
                    info: 'dart-sass\t1.49.0\t(Sass Compiler)\t[Dart]\ndart2js\t2.15.1\t(Dart Compiler)\t[Dart]',
                    render: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    renderSync: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    types: {
                      Boolean: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Color: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      List: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Map: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Null: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Number: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      String: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Error: function Error() { [native code] }
                    },
                    NULL: {},
                    TRUE: {
                      value: true
                    },
                    FALSE: {
                      value: false
                    },
                    cli_pkg_main_0_: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    }
                  },
                  data: '@import "@/styles/variables.scss";',
                  sassOptions: {
                    indentedSyntax: true
                  }
                }
              }
            ]
          },
          /* config.module.rule('sass').rule('normal-modules') */
          {
            test: /\.module\.\w+$/,
            use: [
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\cache\\vue-style-loader-npm-4.1.3-878b169e65-ef79d0c632.zip\\node_modules\\vue-style-loader\\index.js',
                options: {
                  sourceMap: false,
                  shadowMode: false
                }
              },
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\__virtual__\\css-loader-virtual-d5fd399263\\0\\cache\\css-loader-npm-3.6.0-3394f37d07-a45d7ee810.zip\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: {
                    localIdentName: '[name]_[local]_[hash:base64:5]'
                  }
                }
              },
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\cache\\postcss-loader-npm-3.0.0-f4ab99b685-a6a922cbcc.zip\\node_modules\\postcss-loader\\src\\index.js',
                options: {
                  sourceMap: false,
                  plugins: [
                    function () { /* omitted long function */ }
                  ]
                }
              },
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\__virtual__\\sass-loader-virtual-c08795d023\\0\\cache\\sass-loader-npm-12.4.0-3d3847fd35-0f7ca3633e.zip\\node_modules\\sass-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  implementation: {
                    load: function () { /* omitted long function */ },
                    compile: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    compileString: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    compileAsync: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    compileStringAsync: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    Value: function Value0() {
                    },
                    SassBoolean: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    SassArgumentList: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    SassColor: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    SassFunction: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    SassList: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    SassMap: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    SassNumber: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    SassString: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    sassNull: {},
                    sassTrue: {
                      value: true
                    },
                    sassFalse: {
                      value: false
                    },
                    Exception: function () { /* omitted long function */ },
                    Logger: {
                      silent: {
                        warn: function () {
                          return _call(f, Array.prototype.slice.apply(arguments));
                        },
                        debug: function () {
                          return _call(f, Array.prototype.slice.apply(arguments));
                        }
                      }
                    },
                    info: 'dart-sass\t1.49.0\t(Sass Compiler)\t[Dart]\ndart2js\t2.15.1\t(Dart Compiler)\t[Dart]',
                    render: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    renderSync: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    types: {
                      Boolean: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Color: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      List: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Map: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Null: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Number: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      String: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Error: function Error() { [native code] }
                    },
                    NULL: {},
                    TRUE: {
                      value: true
                    },
                    FALSE: {
                      value: false
                    },
                    cli_pkg_main_0_: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    }
                  },
                  data: '@import "@/styles/variables.scss";',
                  sassOptions: {
                    indentedSyntax: true
                  }
                }
              }
            ]
          },
          /* config.module.rule('sass').rule('normal') */
          {
            use: [
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\cache\\vue-style-loader-npm-4.1.3-878b169e65-ef79d0c632.zip\\node_modules\\vue-style-loader\\index.js',
                options: {
                  sourceMap: false,
                  shadowMode: false
                }
              },
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\__virtual__\\css-loader-virtual-d5fd399263\\0\\cache\\css-loader-npm-3.6.0-3394f37d07-a45d7ee810.zip\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\cache\\postcss-loader-npm-3.0.0-f4ab99b685-a6a922cbcc.zip\\node_modules\\postcss-loader\\src\\index.js',
                options: {
                  sourceMap: false,
                  plugins: [
                    function () { /* omitted long function */ }
                  ]
                }
              },
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\__virtual__\\sass-loader-virtual-c08795d023\\0\\cache\\sass-loader-npm-12.4.0-3d3847fd35-0f7ca3633e.zip\\node_modules\\sass-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  implementation: {
                    load: function () { /* omitted long function */ },
                    compile: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    compileString: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    compileAsync: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    compileStringAsync: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    Value: function Value0() {
                    },
                    SassBoolean: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    SassArgumentList: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    SassColor: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    SassFunction: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    SassList: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    SassMap: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    SassNumber: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    SassString: function () {
                      return _call(f, this, Array.prototype.slice.apply(arguments));
                    },
                    sassNull: {},
                    sassTrue: {
                      value: true
                    },
                    sassFalse: {
                      value: false
                    },
                    Exception: function () { /* omitted long function */ },
                    Logger: {
                      silent: {
                        warn: function () {
                          return _call(f, Array.prototype.slice.apply(arguments));
                        },
                        debug: function () {
                          return _call(f, Array.prototype.slice.apply(arguments));
                        }
                      }
                    },
                    info: 'dart-sass\t1.49.0\t(Sass Compiler)\t[Dart]\ndart2js\t2.15.1\t(Dart Compiler)\t[Dart]',
                    render: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    renderSync: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    types: {
                      Boolean: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Color: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      List: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Map: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Null: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Number: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      String: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Error: function Error() { [native code] }
                    },
                    NULL: {},
                    TRUE: {
                      value: true
                    },
                    FALSE: {
                      value: false
                    },
                    cli_pkg_main_0_: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    }
                  },
                  data: '@import "@/styles/variables.scss";',
                  sassOptions: {
                    indentedSyntax: true
                  }
                }
              }
            ]
          }
        ]
      },
      /* config.module.rule('less') */
      {
        test: /\.less$/,
        oneOf: [
          /* config.module.rule('less').rule('vue-modules') */
          {
            resourceQuery: /module/,
            use: [
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\cache\\vue-style-loader-npm-4.1.3-878b169e65-ef79d0c632.zip\\node_modules\\vue-style-loader\\index.js',
                options: {
                  sourceMap: false,
                  shadowMode: false
                }
              },
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\__virtual__\\css-loader-virtual-d5fd399263\\0\\cache\\css-loader-npm-3.6.0-3394f37d07-a45d7ee810.zip\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: {
                    localIdentName: '[name]_[local]_[hash:base64:5]'
                  }
                }
              },
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\cache\\postcss-loader-npm-3.0.0-f4ab99b685-a6a922cbcc.zip\\node_modules\\postcss-loader\\src\\index.js',
                options: {
                  sourceMap: false,
                  plugins: [
                    function () { /* omitted long function */ }
                  ]
                }
              },
              {
                loader: 'less-loader',
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule('less').rule('vue') */
          {
            resourceQuery: /\?vue/,
            use: [
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\cache\\vue-style-loader-npm-4.1.3-878b169e65-ef79d0c632.zip\\node_modules\\vue-style-loader\\index.js',
                options: {
                  sourceMap: false,
                  shadowMode: false
                }
              },
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\__virtual__\\css-loader-virtual-d5fd399263\\0\\cache\\css-loader-npm-3.6.0-3394f37d07-a45d7ee810.zip\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\cache\\postcss-loader-npm-3.0.0-f4ab99b685-a6a922cbcc.zip\\node_modules\\postcss-loader\\src\\index.js',
                options: {
                  sourceMap: false,
                  plugins: [
                    function () { /* omitted long function */ }
                  ]
                }
              },
              {
                loader: 'less-loader',
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule('less').rule('normal-modules') */
          {
            test: /\.module\.\w+$/,
            use: [
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\cache\\vue-style-loader-npm-4.1.3-878b169e65-ef79d0c632.zip\\node_modules\\vue-style-loader\\index.js',
                options: {
                  sourceMap: false,
                  shadowMode: false
                }
              },
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\__virtual__\\css-loader-virtual-d5fd399263\\0\\cache\\css-loader-npm-3.6.0-3394f37d07-a45d7ee810.zip\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: {
                    localIdentName: '[name]_[local]_[hash:base64:5]'
                  }
                }
              },
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\cache\\postcss-loader-npm-3.0.0-f4ab99b685-a6a922cbcc.zip\\node_modules\\postcss-loader\\src\\index.js',
                options: {
                  sourceMap: false,
                  plugins: [
                    function () { /* omitted long function */ }
                  ]
                }
              },
              {
                loader: 'less-loader',
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule('less').rule('normal') */
          {
            use: [
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\cache\\vue-style-loader-npm-4.1.3-878b169e65-ef79d0c632.zip\\node_modules\\vue-style-loader\\index.js',
                options: {
                  sourceMap: false,
                  shadowMode: false
                }
              },
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\__virtual__\\css-loader-virtual-d5fd399263\\0\\cache\\css-loader-npm-3.6.0-3394f37d07-a45d7ee810.zip\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\cache\\postcss-loader-npm-3.0.0-f4ab99b685-a6a922cbcc.zip\\node_modules\\postcss-loader\\src\\index.js',
                options: {
                  sourceMap: false,
                  plugins: [
                    function () { /* omitted long function */ }
                  ]
                }
              },
              {
                loader: 'less-loader',
                options: {
                  sourceMap: false
                }
              }
            ]
          }
        ]
      },
      /* config.module.rule('stylus') */
      {
        test: /\.styl(us)?$/,
        oneOf: [
          /* config.module.rule('stylus').rule('vue-modules') */
          {
            resourceQuery: /module/,
            use: [
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\cache\\vue-style-loader-npm-4.1.3-878b169e65-ef79d0c632.zip\\node_modules\\vue-style-loader\\index.js',
                options: {
                  sourceMap: false,
                  shadowMode: false
                }
              },
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\__virtual__\\css-loader-virtual-d5fd399263\\0\\cache\\css-loader-npm-3.6.0-3394f37d07-a45d7ee810.zip\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: {
                    localIdentName: '[name]_[local]_[hash:base64:5]'
                  }
                }
              },
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\cache\\postcss-loader-npm-3.0.0-f4ab99b685-a6a922cbcc.zip\\node_modules\\postcss-loader\\src\\index.js',
                options: {
                  sourceMap: false,
                  plugins: [
                    function () { /* omitted long function */ }
                  ]
                }
              },
              {
                loader: 'stylus-loader',
                options: {
                  sourceMap: false,
                  preferPathResolver: 'webpack'
                }
              }
            ]
          },
          /* config.module.rule('stylus').rule('vue') */
          {
            resourceQuery: /\?vue/,
            use: [
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\cache\\vue-style-loader-npm-4.1.3-878b169e65-ef79d0c632.zip\\node_modules\\vue-style-loader\\index.js',
                options: {
                  sourceMap: false,
                  shadowMode: false
                }
              },
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\__virtual__\\css-loader-virtual-d5fd399263\\0\\cache\\css-loader-npm-3.6.0-3394f37d07-a45d7ee810.zip\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\cache\\postcss-loader-npm-3.0.0-f4ab99b685-a6a922cbcc.zip\\node_modules\\postcss-loader\\src\\index.js',
                options: {
                  sourceMap: false,
                  plugins: [
                    function () { /* omitted long function */ }
                  ]
                }
              },
              {
                loader: 'stylus-loader',
                options: {
                  sourceMap: false,
                  preferPathResolver: 'webpack'
                }
              }
            ]
          },
          /* config.module.rule('stylus').rule('normal-modules') */
          {
            test: /\.module\.\w+$/,
            use: [
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\cache\\vue-style-loader-npm-4.1.3-878b169e65-ef79d0c632.zip\\node_modules\\vue-style-loader\\index.js',
                options: {
                  sourceMap: false,
                  shadowMode: false
                }
              },
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\__virtual__\\css-loader-virtual-d5fd399263\\0\\cache\\css-loader-npm-3.6.0-3394f37d07-a45d7ee810.zip\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: {
                    localIdentName: '[name]_[local]_[hash:base64:5]'
                  }
                }
              },
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\cache\\postcss-loader-npm-3.0.0-f4ab99b685-a6a922cbcc.zip\\node_modules\\postcss-loader\\src\\index.js',
                options: {
                  sourceMap: false,
                  plugins: [
                    function () { /* omitted long function */ }
                  ]
                }
              },
              {
                loader: 'stylus-loader',
                options: {
                  sourceMap: false,
                  preferPathResolver: 'webpack'
                }
              }
            ]
          },
          /* config.module.rule('stylus').rule('normal') */
          {
            use: [
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\cache\\vue-style-loader-npm-4.1.3-878b169e65-ef79d0c632.zip\\node_modules\\vue-style-loader\\index.js',
                options: {
                  sourceMap: false,
                  shadowMode: false
                }
              },
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\__virtual__\\css-loader-virtual-d5fd399263\\0\\cache\\css-loader-npm-3.6.0-3394f37d07-a45d7ee810.zip\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              {
                loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\cache\\postcss-loader-npm-3.0.0-f4ab99b685-a6a922cbcc.zip\\node_modules\\postcss-loader\\src\\index.js',
                options: {
                  sourceMap: false,
                  plugins: [
                    function () { /* omitted long function */ }
                  ]
                }
              },
              {
                loader: 'stylus-loader',
                options: {
                  sourceMap: false,
                  preferPathResolver: 'webpack'
                }
              }
            ]
          }
        ]
      },
      /* config.module.rule('js') */
      {
        test: /\.m?jsx?$/,
        exclude: [
          function () { /* omitted long function */ }
        ],
        use: [
          {
            loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\__virtual__\\cache-loader-virtual-3e9016ab50\\0\\cache\\cache-loader-npm-4.1.0-82c3da90d8-0339778bdd.zip\\node_modules\\cache-loader\\dist\\cjs.js',
            options: {
              cacheDirectory: 'E:\\Masters thesis\\Unicoin\\node_modules\\.cache\\babel-loader',
              cacheIdentifier: 'b40aef4e'
            }
          },
          {
            loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\__virtual__\\babel-loader-virtual-3890ebe439\\0\\cache\\babel-loader-npm-8.2.3-855681b984-78e1e1a919.zip\\node_modules\\babel-loader\\lib\\index.js'
          }
        ]
      },
      /* config.module.rule('ts') */
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\__virtual__\\cache-loader-virtual-3e9016ab50\\0\\cache\\cache-loader-npm-4.1.0-82c3da90d8-0339778bdd.zip\\node_modules\\cache-loader\\dist\\cjs.js',
            options: {
              cacheDirectory: 'E:\\Masters thesis\\Unicoin\\node_modules\\.cache\\ts-loader',
              cacheIdentifier: '67e8848b'
            }
          },
          {
            loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\__virtual__\\babel-loader-virtual-3890ebe439\\0\\cache\\babel-loader-npm-8.2.3-855681b984-78e1e1a919.zip\\node_modules\\babel-loader\\lib\\index.js'
          },
          {
            loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\__virtual__\\ts-loader-virtual-26cbc33db4\\0\\cache\\ts-loader-npm-6.2.2-0899073551-b984b91184.zip\\node_modules\\ts-loader\\index.js',
            options: {
              transpileOnly: true,
              appendTsSuffixTo: [
                '\\.vue$'
              ],
              happyPackMode: false
            }
          }
        ]
      },
      /* config.module.rule('tsx') */
      {
        test: /\.tsx$/,
        use: [
          {
            loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\__virtual__\\cache-loader-virtual-3e9016ab50\\0\\cache\\cache-loader-npm-4.1.0-82c3da90d8-0339778bdd.zip\\node_modules\\cache-loader\\dist\\cjs.js',
            options: {
              cacheDirectory: 'E:\\Masters thesis\\Unicoin\\node_modules\\.cache\\ts-loader',
              cacheIdentifier: '67e8848b'
            }
          },
          {
            loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\__virtual__\\babel-loader-virtual-3890ebe439\\0\\cache\\babel-loader-npm-8.2.3-855681b984-78e1e1a919.zip\\node_modules\\babel-loader\\lib\\index.js'
          },
          {
            loader: 'E:\\Masters thesis\\Unicoin\\.yarn\\__virtual__\\ts-loader-virtual-26cbc33db4\\0\\cache\\ts-loader-npm-6.2.2-0899073551-b984b91184.zip\\node_modules\\ts-loader\\index.js',
            options: {
              transpileOnly: true,
              happyPackMode: false,
              appendTsxSuffixTo: [
                '\\.vue$'
              ]
            }
          }
        ]
      }
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          name: 'chunk-vendors',
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: 'initial'
        },
        common: {
          name: 'chunk-common',
          minChunks: 2,
          priority: -20,
          chunks: 'initial',
          reuseExistingChunk: true
        }
      }
    },
    minimizer: [
      {
        options: {
          test: /\.m?js(\?.*)?$/i,
          chunkFilter: () => true,
          warningsFilter: () => true,
          extractComments: false,
          sourceMap: true,
          cache: true,
          cacheKeys: defaultCacheKeys => defaultCacheKeys,
          parallel: true,
          include: undefined,
          exclude: undefined,
          minify: undefined,
          terserOptions: {
            output: {
              comments: /^\**!|@preserve|@license|@cc_on/i
            },
            compress: {
              arrows: false,
              collapse_vars: false,
              comparisons: false,
              computed_props: false,
              hoist_funs: false,
              hoist_props: false,
              hoist_vars: false,
              inline: false,
              loops: false,
              negate_iife: false,
              properties: false,
              reduce_funcs: false,
              reduce_vars: false,
              switches: false,
              toplevel: false,
              typeofs: false,
              booleans: true,
              if_return: true,
              sequences: true,
              unused: true,
              conditionals: true,
              dead_code: true,
              evaluate: true
            },
            mangle: {
              safari10: true
            }
          }
        }
      }
    ]
  },
  plugins: [
    /* config.plugin('vue-loader') */
    new VueLoaderPlugin(),
    /* config.plugin('feature-flags') */
    new DefinePlugin(
      {
        __VUE_OPTIONS_API__: 'true',
        __VUE_PROD_DEVTOOLS__: 'false'
      }
    ),
    /* config.plugin('define') */
    new DefinePlugin(
      {
        'process.env': {
          NODE_ENV: '"development"',
          BASE_URL: '"/"'
        }
      }
    ),
    /* config.plugin('case-sensitive-paths') */
    new CaseSensitivePathsPlugin(),
    /* config.plugin('friendly-errors') */
    new FriendlyErrorsWebpackPlugin(
      {
        additionalTransformers: [
          function () { /* omitted long function */ }
        ],
        additionalFormatters: [
          function () { /* omitted long function */ }
        ]
      }
    ),
    /* config.plugin('html') */
    new HtmlWebpackPlugin(
      {
        title: 'unicoin',
        templateParameters: function () { /* omitted long function */ },
        template: 'E:\\Masters thesis\\Unicoin\\public\\index.html'
      }
    ),
    /* config.plugin('preload') */
    new PreloadPlugin(
      {
        rel: 'preload',
        include: 'initial',
        fileBlacklist: [
          /\.map$/,
          /hot-update\.js$/
        ]
      }
    ),
    /* config.plugin('prefetch') */
    new PreloadPlugin(
      {
        rel: 'prefetch',
        include: 'asyncChunks'
      }
    ),
    /* config.plugin('copy') */
    new CopyPlugin(
      [
        {
          from: 'E:\\Masters thesis\\Unicoin\\public',
          to: 'E:\\Masters thesis\\Unicoin\\dist',
          toType: 'dir',
          ignore: [
            '.DS_Store',
            {
              glob: 'index.html',
              matchBase: false
            }
          ]
        }
      ]
    ),
    /* config.plugin('fork-ts-checker') */
    new ForkTsCheckerWebpackPlugin(
      {
        typescript: {
          extensions: {
            vue: {
              enabled: true,
              compiler: '@vue/compiler-sfc'
            }
          },
          diagnosticOptions: {
            semantic: true,
            syntactic: false
          }
        }
      }
    )
  ],
  entry: {
    app: [
      './src/main.ts'
    ]
  }
}
