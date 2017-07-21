import { AsyncStorage } from 'react-native';
import { Navigation } from 'react-native-navigation';

import { compose, applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import registerScreens from './registerScreens';
import rootReducer from './rootReducer';
import LoadIcons from './icons';
import * as appActions from './actions';
import * as appSelectors from './selectors';
import api,{apiMiddleware} from './api';


////////////////////
////////////////////
////////START DEBUG CODE ONLY.. REMOVE IN PRODUCTION
////////////////////
////////////////////
if (__DEV__) {  
  var mapping = {
      debug: 'teal',
      info: 'blue',
  };
  
  ["debug","info"].forEach(function(method) {
      var oldMethod = console[method] ? console[method].bind(console) : console.log.bind(console);
      console[method] = function() {
          oldMethod('%c===========================================', 'color: '+(mapping[method])+'; display: block;');
          const arr = Array.from(arguments);
          arr.map(m=>{
            let msg = (['string','boolean'].indexOf(m)>-1 || !m) ? String(m) : JSON.stringify(m, undefined, 2);
            if(arr.length > 1)oldMethod('%c------------------------------------','color: '+(mapping[method])+'; display: block;');
            oldMethod('%c'+msg, 'color: '+(mapping[method])+'; display: block;font-szie:22px');
          });
          oldMethod('%c===========================================', 'color: '+(mapping[method])+'; display: block;');
      }    
  });
}
////////////////////
////////////////////
////////END DEBUG
////////////////////
////////////////////

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
  logout    : () => store.dispatch(appActions.authLogout(appSelectors.selectAppUserId(store.getState()))),
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
const smartRootReducer = (state, action=mockAction)=>{
    return rootReducer(state, action, store.getState());
}

const middleWares = applyMiddleware( thunk, apiMiddleware );
const composed = __DEV__ ? composeWithDevTools(middleWares) : compose(middleWares);

store = createStore(smartRootReducer, undefined, composed)
const storageKey = '@MySuperStore:key';

async function loadStore (store) {
  let saved = await AsyncStorage.getItem(storageKey);
  try {
    saved = JSON.parse(saved);
    store.dispatch(appActions.appRehydrate(saved));
  } catch (error) {
    AsyncStorage.clear();
    console.log('couldnt load state from memory',error)
  }
}


registerScreens(store, Provider);

export default class App {
  constructor(appStyle) {
    // since react-redux only works on components, we need to subscribe this class manually
    this.currentRoot = null;
    this.debouncePersistence = 0;
    this.action = type => store.dispatch({type});
    this.tabs = makeAppTabs({}, appStyle);
    this.startApp = this.startApp.bind(this)
    this.onStoreUpdate = this.onStoreUpdate.bind(this)
    Navigation.setEventHandler(this.onNavigatorEvent.bind(this));
    console.log(Navigation);
    api.on403 = ()=>this.startApp('login');
    api.on401 = ()=>this.startApp('login');

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
  onNavigatorEvent(event){
    if (event.type == 'NavBarButtonPress' && event.id==='logout'){
      passProps.logout();
    }
    console.log('event :)',event);
  }
  onStoreUpdate(){
    const state = store.getState();
    if(!state.toJS)return console.warn('store changed but is not immutable');
    
    // persist store;
    this.state = state;
    clearTimeout(this.debouncePersistence);
    this.debouncePersistence = setTimeout(function() {
      AsyncStorage.setItem(storageKey, JSON.stringify(state.toJS()));
      console.log('saved storage to', storageKey)  
    }, 5000);
    

    const root = appSelectors.selectAppRoot(state);

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
        api.api.setHeader('Authorization','Bearer null');
        Navigation.startSingleScreenApp({
          animationType: 'slide-down',
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
        console.log('case after login matched', api)
        api.api.setHeader('Authorization','Bearer '+appSelectors.selectAppUserToken(store.getState()));
        
        Navigation.startTabBasedApp({
          //animationType: 'slide-down',
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