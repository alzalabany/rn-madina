import { AsyncStorage } from 'react-native';
import { Navigation } from 'react-native-navigation';

import { compose, applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
//import { persistStore, autoRehydrate } from 'redux-persist'
//import { persistStore, autoRehydrate } from 'redux-persist-immutable'
import * as storage from 'redux-storage'
import merger from 'redux-storage-merger-immutablejs';
import createEngine from 'redux-storage-engine-reactnativeasyncstorage';
import filter from 'redux-storage-decorator-filter'
import { Provider } from 'react-redux';

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
const noob = ()=>({});
const mockAction = {type:'@@ERROR_NO_ACTION'};

let store = {dispatch: noob, subscribe: noob, getState: noob, replaceReducer: noob};

function makeAppTabs(iconsMap, navigatorStyle){
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
        // {
        //   label: 'Home',
        //   screen: 'ivf.HomeScreen',
        //   icon: iconsMap["ios-calendar-outline"],
        //   selectedIcon: iconsMap["ios-calendar"],
        //   //selectedIcon: require('../img/two_selected.png'), // iOS only
        //   title: 'Home',
        //   passProps,
        //   navigatorStyle,
        //   navigatorButtons
        // },
        // {
        //   label: 'About',
        //   screen: 'ivf.MoreScreen',
        //   icon: iconsMap["ios-more-outline"],
        //   selectedIcon: iconsMap["ios-more"],
        //   //selectedIcon: require('../img/two_selected.png'), // iOS only
        //   title: 'Madina Women Hospital',
        //   passProps,
        //   navigatorStyle,
        //   navigatorButtons
        // },

  ]
}
const smartRootReducer = (state, action=mockAction)=>{
    return rootReducer(state, action, store.getState());
}
const isProduction = false;
const engine            = createEngine('ivfKey101');
const loadStore         = storage.createLoader(engine);
const storageMiddleware = storage.createMiddleware(engine);
const reducer           = storage.reducer(smartRootReducer, merger);
const middleWares       = applyMiddleware( storageMiddleware, thunk );
const makeStore         = isProduction ?  compose( middleWares )  :
                                          composeWithDevTools( middleWares);
store = makeStore(createStore)( reducer );

registerScreens(store, Provider);

export default class App {
  constructor(appStyle) {
    // since react-redux only works on components, we need to subscribe this class manually
    this.currentRoot = null;
    this.action = type => store.dispatch({type});
    this.tabs = makeAppTabs({}, appStyle);
    this.startApp = this.startApp.bind(this)
    this.onStoreUpdate = this.onStoreUpdate.bind(this)

    timeout = setTimeout(() => {
      console.log('loading icons and store took too long, i will intialize anyway')
      store.subscribe(this.onStoreUpdate);
      store.dispatch(appActions.appInitialized())
    }, 2000);

    // @@todo load all images in assets folder too !;

    LoadIcons.then(icons => {
        navigatorButtons.leftButtons[0].icon = icons['ios-person'];
        // store.dispatch(appActions.appInitialized())
        this.tabs = makeAppTabs(icons, appStyle);
        loadStore(store).finally(() => {
          clearTimeout(timeout);
          store.subscribe(this.onStoreUpdate);
          store.dispatch(appActions.appInitialized())
        });
      })
  }
  onStoreUpdate(){
    const state = store.getState();
    const root = appSelectors.selectAppRoot(state);
    console.log('store updated',root, this.currentRoot, state);

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
    console.log('starting app', root, root === 'login')
    if(root === 'login'){
        console.log('case login matched');
        Navigation.startSingleScreenApp({
             screen: {
               screen: 'ivf.AuthScreen',
               title: 'Login',
               navigatorStyle:{ navBarHidden: true },
             },
             passProps
            });
        return;
    }
    if(root === 'after-login'){
        console.log('case after login matched')
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
    }
      
    console.warn('unkown app root');
  }
}