const webpack = require('webpack');
const path = require('path');
const { CheckerPlugin } = require('awesome-typescript-loader');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = [
    (env, argv) => ({
        entry: {
            bundle: path.join(__dirname, './src/ts/all.ts'),
        },
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, '../enonic/src/main/resources/assets/design-system')
        },
        resolve: {
            extensions:['.ts', '.tsx', '.js'],
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        "css-loader",
                        {
                            loader: 'postcss-loader',
                            options: {
                                ident: 'postcss',
                                plugins: [
                                    require('autoprefixer'),
                                ].concat(argv.mode === 'production' ? purgecss : []),
                            }
                        }
                    ]
                },
                {
                    test: /\.scss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        "css-loader",
                        "sass-loader"
                    ]
                },
                {
                    test: /\.(eot|woff|woff2|ttf|svg)$/,
                    use: 'file-loader?name=fonts/[name].[ext]'
                },
                {
                    test: /\.tsx?$/,
                    include: [path.join(__dirname, './src')],
                    loader: 'awesome-typescript-loader',
                    exclude: /node_modules/
                }
            ]
        },
        optimization: {
            minimize: true,
            minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
        },
        plugins: [
            new CheckerPlugin(),
            new MiniCssExtractPlugin({
                // Options similar to the same options in webpackOptions.output
                // all options are optional
                filename: '[name].css',
                chunkFilename: '[id].css',
                ignoreOrder: false, // Enable to remove warnings about conflicting order
            })
        ]
    }),
    (env, argv) => ({
        entry: {
            bundle: path.join(__dirname, './src/ts/main.ts'),
        },
        output: {
            filename: '[name].es5.js',
            path: path.resolve(__dirname, '../enonic/src/main/resources/assets/design-system')
        },
        resolve: {
            extensions:['.ts', '.tsx', '.js'],
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    include: [path.join(__dirname, './src')],
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: [
                                    [
                                        "@babel/env"
                                    ]
                                ],
                            }
                        },
                        {
                            loader: 'awesome-typescript-loader',
                            query: {
                                configFileName: './tsconfig-legacy.json',
                                transpileOnly: true
                            }
                        }
                    ]
                }
            ]
        },
        optimization: {
            minimize: true,
            minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
        },
        plugins: [
            new CheckerPlugin()
        ]
    })
];