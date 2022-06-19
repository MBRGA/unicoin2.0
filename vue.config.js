module.exports = {
  css: {
    loaderOptions: {
      // pass options to sass-loader
      sass: {
        // @/ is an alias to src/
        // so this assumes you have a file named `src/variables.scss`
        prependData: `@import "@/styles/variables.scss";`,
      },
    },
  },
  configureWebpack: {
    output: {
      globalObject: "this", // `typeof self !== 'undefined' ? self : this`'' -- not working
      //hashFunction: 'xxhash64', doesn't work with vue's version of webpack
    },
    module: {
      rules: [
        {
          test: /\.s(c|a)ss$/,
          use: [
            "vue-style-loader",
            "css-loader",
            {
              loader: "sass-loader",
              // Requires >= sass-loader@^8.0.0
              options: {
                implementation: require("sass"),
                sassOptions: {
                  indentedSyntax: true, // optional
                },
              },
            },
          ],
        },
      ],
    },
  },
};
