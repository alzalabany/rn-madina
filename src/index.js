import { AsyncStorage } from 'react-native';
import {  } from 'react-redux';

import { compose, Provider, applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
//import { persistStore, autoRehydrate } from 'redux-persist'
//import { persistStore, autoRehydrate } from 'redux-persist-immutable'
import * as storage from 'redux-storage'
import merger from 'redux-storage-merger-immutablejs';
import createEngine from 'redux-storage-engine-reactnativeasyncstorage';
import filter from 'redux-storage-decorator-filter'

import registerScreens from './registerScreens';
import rootReducer from './rootReducer';
import LoadIcons from './icons';
import * as appActions from './actions';
import * as appSelectors from './selectors';


const navigatorButtons = {
  leftButtons: [
    { // buttons for the right side of the nav bar (optional)
      title: 'Logout', // if you want a textual button
      id: 'logout', // id of the button which will pass to your press event handler. See the section bellow for Android specific button ids
      disabled: false, // optional, used to disable the button (appears faded and doesn't interact)
      disableIconTint: false, // optional, by default the image colors are overridden and tinted to navBarButtonColor, set to true to keep the original image colors
      buttonColor: 'white', // Set color for the button (can also be used in setButtons function to set different button style programatically)
      buttonFontSize: 14, // Set font size for the button (can also be used in setButtons function to set different button style programatically)
      buttonFontWeight: '600', // Set font weight for the button (can also be used in setButtons function to set different button style programatically)
    }
  ],
};
const passProps = {
  logout    : () => store.dispatch(appActions.appReset()),
}

function appTabs(iconsMap, navigatorStyle){
  return [
        {
          label: 'News',
          screen: 'ivf.BlogScreen', // this is a registered name for a screen
          icon: iconsMap["ios-desktop-outline"],
          selectedIcon: iconsMap["ios-desktop"],
          //selectedIcon: require('../img/one_selected.png'), // iOS only
          title: 'News',
          passProps,
          navigatorStyle,
          navigatorButtons
        },
        {
          label: 'Home',
          screen: 'ivf.HomeScreen',
          icon: iconsMap["ios-calendar-outline"],
          selectedIcon: iconsMap["ios-calendar"],
          //selectedIcon: require('../img/two_selected.png'), // iOS only
          title: 'Home',
          passProps,
          navigatorStyle,
          navigatorButtons
        },
        {
          label: 'About',
          screen: 'ivf.MoreScreen',
          icon: iconsMap["ios-more-outline"],
          selectedIcon: iconsMap["ios-more"],
          //selectedIcon: require('../img/two_selected.png'), // iOS only
          title: 'Madina Women Hospital',
          passProps,
          navigatorStyle,
          navigatorButtons
        },

  ]
}

registerScreens(store, Provider);
const isProduction = false;
const engine            = createEngine('ivfKey10');
const loadStore         = storage.createLoader(engine);
const storageMiddleware = storage.createMiddleware(engine);
const reducer           = storage.reducer(rootReducer, merger);
const middleWares       = applyMiddleware( storageMiddleware, thunk );
const makeStore         = isProduction ?  compose( middleWares )  :
                                          composeWithDevTools( middleWares);
const store = makeStore(createStore)( reducer );

export default class App {
  constructor(appStyle) {
    // since react-redux only works on components, we need to subscribe this class manually
    this.currentRoot = null;
    this.action = type => store.dispatch({type});
    this.tabs = appTabs({}, appStyle);
    this.startApp = this.startApp.bind(this)
    this.onStoreUpdate = this.onStoreUpdate.bind(this)
    store.subscribe(this.onStoreUpdate);

    timeout = setTimeout(function() {
      console.log('loading icons and store took too long, i will intialize anyway')
      store.dispatch(appActions.appInitialized())
    }, 2000);
    LoadIcons.then(icons => {
        navigatorButtons.leftButtons[0].icon = icons['ios-person'];
        this.tabs = appTabs(icons, appStyle);
        loadStore(store).finally(() => {
          clearTimeout(timeout);
          store.dispatch(appActions.appInitialized())
        });
      })
  }
  onStoreUpdate(){
    const root = appSelectors.selectAppRoot(this.store.getState());
    if(!root){
      this.currentRoot = 'login';
      this.startApp(this.currentRoot);
      return;
    }

    if (this.currentRoot != root) {
      this.currentRoot = root;
      this.startApp(root);
    }

  }
  startApp(root) {
    switch (root) {
      case 'login':
        Navigation.startSingleScreenApp({
             screen: {
               screen: 'ivf.AuthScreen',
               title: 'Login',
               navigatorStyle:{ navBarHidden: true },
             },
             passProps
            });
        return;
      case 'after-login':
        Navigation.startTabBasedApp({
          animationType: 'slide-down',
          title: 'Madina Icsi',
          tabsStyle: {
            tabBarBackgroundColor: 'purple',
            tabBarButtonColor: '#ffffff',
            tabBarSelectedButtonColor: 'white',
            tabBarTranslucent: false,
          },
          tabs: this.tabs,
        });
        return;
      default:
        console.warn('unkown app root');
        break;
    }
  }
}