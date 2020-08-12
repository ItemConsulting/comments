const path = require('path');
module.exports = {
  stories: ['../stories/**/*.stories.ts'],
  addons: ['@storybook/addon-actions', '@storybook/addon-links', '@storybook/addon-knobs/register', '@storybook/addon-viewport'],
  webpackFinal: async config => {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: require.resolve('ts-loader'),
        },
      ],
    });
    config.module.rules.push({
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
      include: path.resolve(__dirname, '../'),
    });

    config.resolve.extensions.push('.ts', '.tsx');
    return config;
  },
};
