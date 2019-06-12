const path = require("path");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
module.exports = env => {
    const isProd = env.production === "true";
    console.log('NODE_ENV: ', env.NODE_ENV);
    console.log('Production: ',isProd);
    return {
        mode: isProd ? "production": "development",
        devtool: isProd ? "" :"inline-source-map",
        watch: !isProd, 
        entry: {
            app: './src/app.ts',
        },
        output: {
            filename: '[name].bundle.js',
            path: path.resolve(__dirname, './dist/')
        },
        resolve: {
            extensions: [".ts", ".js"]
        },
        devServer: {
            contentBase: path.join(__dirname, 'dist'),
            hot: true
        },
        module: {
            rules: [{
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            hmr: true,
                        },
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1
                        }
                    }
                ]
            },
            {
                test: /\.(sv|jp|pn)g$/,
                use: "file-loader"
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    },
                    {
                        loader: 'ts-loader'
                    }
                ]
            }
        ],
            
        },
        plugins: [
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                template: './src/index.html'
            }),
            new webpack.HotModuleReplacementPlugin()
        ],
    }
};