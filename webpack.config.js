const path = require("path");
const os = require("os")
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BomPlugin = require("webpack-utf8-bom");
const CopyWebpackPlugin = require("copy-webpack-plugin");
module.exports = [{
    mode: "development",
    entry: ['@babel/polyfill', "./src/app.js"],
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "app.bundle.js"
    },
    target: "electron-main",
    module: {
        exprContextCritical: true,
        wrappedContextCritical: true,
        wrappedContextRecursive: true,
        wrappedContextRegExp: /^\.\//,
        exprContextRegExp: /^\.\//,
        unknownContextRegExp: /^\.\//,
        rules: [{
            test: /\.(js|jsx)$/,
            loader: "babel-loader",
            include: [path.resolve(__dirname, "src/main")],
            options: {
                presets: ["@babel/env", "@babel/react"]
            },
            exclude: [/node_modules/]
        }, 
        {
            test: /\.node$/,
            loader: "node-loader",
            options: {
                name: "[name].[ext]"
            },
        },
        {
            test: /\.worker\.(c|m)?js$/i,
            loader: "file-loader",
            options: {
                esModule: false,
            },
        },
    ]
    },
    experiments: {
        asyncWebAssembly: true,
        syncWebAssembly: true,
    },
    resolve: {
        modules: [path.resolve("./node_modules")]
    },
    plugins: [
        new webpack.DefinePlugin({
            $dirname: "__dirname"
        })
    ],
    node: {
        __dirname: false
    }
},
{
    mode: "development",
    // devtool: "cheap-module-eval-source-map",
    target: "electron-renderer",
    entry: ['@babel/polyfill', "./src/renderer/renderer.js"],
    output: {
        path: path.resolve(__dirname, "./dist/html"),
        filename: "[name].bundle.js",
        sourceMapFilename: "bundle.map"
    },
    externals: {},
    resolve: {
        extensions: [".js", ".jsx"]
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            loader: "babel-loader",
            include: [path.resolve(__dirname, "src/renderer")],
            exclude: [/node_modules/, path.resolve(__dirname, "src/app")],
            options: {
                presets: ["@babel/env", "@babel/react"],
            }
        },
        {
            test: /\.(png|jpg|gif|svg)$/,
            loader: "file-loader",
            options: {
                name: "assets/[name].[ext]?[hash]",
            }
        },
        {
            test: /\.(woff|woff2|ttf|svg|eot)$/,
            use: {
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: "font/[name].[ext]?[hash]"
                }
            }
        },
        {
            test: /\.(png)$/,
            loader: 'url-loader',
            options: {
                name: "assets/[name].[ext]?[hash]"
            }
        },
        {
            test: /\.css$/,
            use: [
                {
                    loader: 'style-loader'
                },
                {
                    loader: 'css-loader'
                }
            ]
        },
        {
            test: /\.(scss)$/,
            use: [
                {
                    loader: 'style-loader'
                },
                {
                    loader: 'css-loader'
                },
                {
                    loader: 'sass-loader'
                }
            ]
        },
        {
            test: /\.(htm|html)$/,
            loader: "html-loader",
            options: {
                esModule: false
            }
        },
        {
            test:/node-gyp-build\.js$/,
            loader:'string-replace-loader',
            options:
            {
                search:/path\.join\(dir,'prebuilds'/g,
                replace:"path.join(__dirname,'prebuilds'"
            }
        }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.browser': 'true'
        }),
        new HtmlWebpackPlugin({
            template: "src/renderer/html/index.html",
            filename: "index.html",
            inject: true
        }),
        new BomPlugin(true, /\.(js|jsx)$/),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve("src/renderer", "assets"),
                    to: path.resolve("dist/html", "assets")
                },
                {
                    from: path.resolve("src/renderer", "locales"),
                    to: path.resolve("dist/html", "locales")
                }
            ]
        })
    ]
}
];