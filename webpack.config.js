var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	entry: './app/scripts/index.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'public')
	},
	module: {
		rules: [
		{
			test: /\.css$/,
			use: ExtractTextPlugin.extract({
				use: 'css-loader'
			})
		}
		]
	},
	plugins: [
	new ExtractTextPlugin('bundle.css'),
	]
};