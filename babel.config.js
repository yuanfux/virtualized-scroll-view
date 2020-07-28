module.exports = (api) => {
  const isBabelJest = api.caller(caller => caller && caller.name === 'babel-jest');
  // const isLibBundler = api.caller(caller => caller && caller.name === 'bundler');
  if (isBabelJest) {
    return {
      presets: [
        'module:metro-react-native-babel-preset',
      ],
    };
  }
  // if (isLibBundler) {
  //   return {
  //     presets: [
  //       'react-native',
  //     ],
  //   };
  // }
  return {
    presets: ['babel-preset-expo'],
  };
};
