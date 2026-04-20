// Vector icon fonts are already copied into the app by the RNVectorIcons CocoaPods
// target. Listing them here and running `npx react-native-asset` duplicates them in
// Xcode "Copy Bundle Resources" and causes "Multiple commands produce … .ttf" errors.
module.exports = {
  assets: [],
};
