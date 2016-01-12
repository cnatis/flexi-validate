var path = require('path');

module.exports = {
    entry: './lib.js',
    output: {
        library: 'flexiValidate',
        path: path.join(__dirname, 'build')
    },
    module: {
        loaders: [
            {
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /(node_modules|bower_components)/,
				query: {
                    presets: ['es2015']
                }
			}
        ]
    }
};