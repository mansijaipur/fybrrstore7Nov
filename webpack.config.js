const path = require('path');

module.exports = {
    // The entry point file described above
    entry: './src/web3.storage/main.js',
    // entry: './src/index.js',
    // The location of the build folder described above
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        library: 'fstore',
    },
    // module: {
    //     rules: [{
    //         test: /\.js$/,
    //         exclude: /(node_modules)/,
    //         use: {
    //             loader: "babel-loader",
    //             options: {
    //                 presets: ['@babel/preset-env']
    //             }
    //         }
    //     }],
    // },

    // Optional and for development only. This provides the ability to
    // map the built code back to the original source format when debugging.
    devtool: 'eval-source-map',
};