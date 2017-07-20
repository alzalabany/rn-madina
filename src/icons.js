/* eslint-disable new-cap */
// import { PixelRatio } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// const navIconSize = (__DEV__ === false && Platform.OS === 'android') ? PixelRatio.getPixelSizeForLayoutSize(40) : 40; // eslint-disable-line
const replaceSuffixPattern = /--(active|big|small|very-big)/g;
const icons = {
  'ios-film-outline': [30],
  'ios-film': [30],
  'ios-desktop-outline': [30],
  'ios-desktop': [30],
  'ios-search': [30],
  'ios-arrow-round-down': [30],
  'ios-close': [40],
  'ios-person': [40],
  'ios-more': [40],
  'ios-more-outline': [40],
  'ios-home': [40],
  'ios-home-outline': [40],
  'ios-calendar': [40],
  'ios-calendar-outline': [40],
  'ios-search-outline': [40],
  'ios-search': [40],
  'ios-arrow-back':[40],
};

const iconsLoader = new Promise((resolve, reject) => {
  const iconsMap = {};
  new Promise.all(
    Object.keys(icons).map(iconName =>{
    // IconName--suffix--other-suffix is just the mapping name in iconsMap
    return Ionicons.getImageSource(
                      iconName.replace(replaceSuffixPattern, ''),
                      icons[iconName][0],
                      icons[iconName][1]
                      ).then(icon=>{
                        iconsMap[iconName] = icon;
                        return iconsMap;
                      })
    })
  ).then(sources => {
    // Call resolve (and we are done)
    resolve(iconsMap);
  });
});

export default iconsLoader;