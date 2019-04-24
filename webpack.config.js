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
                        plugins: [] //leave this array empty if you aren't adding a plugin
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
        //config.devtool = false;
        config.module.rules[0].use.options.plugins = config.module.rules[0].use.options.plugins.concat('transform-remove-console');
    }
    return config;
}