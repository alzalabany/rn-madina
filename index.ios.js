import App from './src/index';
import { AsyncStorage } from 'react-native';

const navigatorStyle = {
  // Common
  navBarTextColor: '#FFF', // change the text color of the title (remembered across pushes)
  // navBarTextFontFamily: 'font-name', // Changes the title font
  navBarBackgroundColor: 'purple', // change the background color of the nav bar (remembered across pushes)

  navBarButtonColor: '#FFF', // Change color of nav bar buttons (eg. the back button) (remembered across pushes)

  navBarHidden: false, // make the nav bar hidden
  navBarHideOnScroll: false, // make the nav bar hidden only after the user starts to scroll
  navBarTranslucent: false, // make the nav bar semi-translucent, works best with drawUnderNavBar:true
  navBarTransparent: false, // make the nav bar transparent, works best with drawUnderNavBar:true,
  navBarNoBorder: false, // hide the navigation bar bottom border (hair line). Default false
  drawUnderNavBar: false, // draw the screen content under the nav bar, works best with navBarTranslucent:true
  drawUnderTabBar: false, // draw the screen content under the tab bar (the tab bar is always translucent)
  statusBarBlur: false, // blur the area under the status bar, works best with navBarHidden:true
  navBarBlur: false, // blur the entire nav bar, works best with drawUnderNavBar:true
  tabBarHidden: false, // make the screen content hide the tab bar (remembered across pushes)
  statusBarHideWithNavBar: false, // hide the status bar if the nav bar is also hidden, useful for navBarHidden:true
  statusBarHidden: false, // make the status bar hidden regardless of nav bar state
  statusBarTextColorScheme: 'dark', // text color of status bar, 'dark' / 'light' (remembered across pushes)
  statusBarTextColorSchemeSingleScreen: 'light', // same as statusBarTextColorScheme but does NOT remember across pushes
  navBarSubtitleColor: 'white', // subtitle color
  screenBackgroundColor: '#F1F3FA', // Default screen color, visible before the actual react view is rendered
  orientation: 'portrait', // Sets a specific orientation to a modal and all screens pushed to it. Default: 'auto'. Supported values: 'auto', 'landscape', 'portrait'

  // iOS only
  disabledBackGesture: false, // default: false. Disable the back gesture (swipe gesture) in order to pop the top screen.
  // screenBackgroundImageName: '<name of image in Images.xcassets>', // Optional. default screen background image.

  navBarButtonFontSize: 20, // Change font size nav bar buttons (eg. the back button) (remembered across pushes)
  navBarButtonFontWeight: '500', // Change font weight nav bar buttons (eg. the back button) (remembered across pushes)

  navBarLeftButtonFontSize: 17, // Change font size of left nav bar button
  navBarLeftButtonColor: 'red', // Change color of left nav bar button
  navBarLeftButtonFontWeight: '400', // Change font weight of left nav bar button

  navBarRightButtonFontSize: 17, // Change font size of right nav bar button
  navBarRightButtonColor: 'blue', // Change color of right nav bar button
  navBarRightButtonFontWeight: '600', // Change font weight of right nav bar button

  // Android only
  // navigationBarColor: '#000000', // change the background color of the bottom native navigation bar.
  // navBarTitleTextCentered: true, // default: false. centers the title.
  // topBarElevationShadowEnabled: false, // default: true. Disables TopBar elevation shadow on Lolipop and above
  // statusBarColor: '#000000', // change the color of the status bar.
  // collapsingToolBarImage: "http://lorempixel.com/400/200/", // Collapsing Toolbar image.
  // collapsingToolBarImage: require('../../img/topbar.jpg'), // Collapsing Toolbar image. Either use a url or require a local image.
  // collapsingToolBarCollapsedColor: '#0f2362', // Collapsing Toolbar scrim color.
};
new App(navigatorStyle);
