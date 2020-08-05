const webpack = require('webpack');
const path = require('path');
const { CheckerPlugin } = require('awesome-typescript-loader');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const purgecss = require('@fullhuman/postcss-purgecss')({
    content: [
        '../**/*.html',
        '../**/*.xml'
    ],
    whitelist: [
        'bg-beige-light',
        'bg-beige',
        'bg-blue-lighter',
        'bg-blue-light',
        'text-gray-dark',
        'bg-blue-lighter',
        'bg-blue-light-uu',
        'bg-gray-neutral1',
        'bg-gray-neutral2',
        'text-white',
        'bg-white',
        'text-green-uu',
        'text-blue-light',
        'text-gray-dark',
        'text-blue-medium',
        'flex-1',
        'flex-2',
        'flex-col',
        'flex-row',
        'p-2', 'p-4', 'p-8', 'p-12', 'p-16', 'p-20', 'p-24',
        'pt-2', 'pt-4', 'pt-8', 'pt-12', 'pt-16', 'pt-20', 'pt-24',
        'pr-2', 'pr-4', 'pr-8', 'pr-12', 'pr-16', 'pr-20', 'pr-24',
        'pb-2', 'pb-4', 'pb-8', 'pb-12', 'pb-16', 'pb-20', 'pb-24',
        'pl-2', 'pl-4', 'pl-8', 'pl-12', 'pl-16', 'pl-20', 'pl-24',
        'px-2', 'px-4', 'px-8', 'px-12', 'px-16', 'px-20', 'px-24',
        'py-2', 'py-4', 'py-8', 'py-12', 'py-16', 'py-20', 'py-24',
        'm-2', 'm-4', 'm-8', 'm-12', 'm-16', 'm-20', 'm-24',
        'mt-2', 'mt-4', 'mt-8', 'mt-12', 'mt-16', 'mt-20', 'mt-24',
        'mr-2', 'mr-4', 'mr-8', 'mr-12', 'mr-16', 'mr-20', 'mr-24',
        'mb-2', 'mb-4', 'mb-8', 'mb-12', 'mb-16', 'mb-20', 'mb-24',
        'ml-2', 'ml-4', 'ml-8', 'ml-12', 'ml-16', 'ml-20', 'ml-24',
        'mx-2', 'mx-4', 'mx-8', 'mx-12', 'mx-16', 'mx-20', 'mx-24',
        'my-2', 'my-4', 'my-8', 'my-12', 'my-16', 'my-20', 'my-24',
    ],
    defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
});
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