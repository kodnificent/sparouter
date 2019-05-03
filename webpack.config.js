const path = require('path');
const config = {
    entry: {
        sparouter: './src/sparouter.js'
    },
    output: {
        library: 'SPARouter',
        libraryTarget: 'umd',
        libraryExport: 'default',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    }
                }
            }
        ]
    }
}
module.exports = (env, argv) => {
    if(argv.mode === 'development') {
        config.output.filename = '[name].js';
        config.devtool = 'source-map';
    }
    if(argv.mode === 'production') {
        config.output.filename = '[name].min.js';
    }
    if(env === 'build') {
        config.module.rules[0].use.options.plugins = ['transform-remove-console'];
    }
    return config;
}