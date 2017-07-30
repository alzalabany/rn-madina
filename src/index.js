import { AsyncStorage } from 'react-native';
import { Navigation } from 'react-native-navigation';

import { compose, applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension'; // eslint-disable-line
import thunk from 'redux-thunk';

import registerScreens from './registerScreens';
import rootReducer from './rootReducer';
import LoadIcons from './icons';
import * as appActions from './actions';
import * as appSelectors from './selectors';
import HTTP, { api, apiMiddleware } from './api';

const navigatorButtons = {
  leftButtons: [
    {
      title: 'Logout',
      id: 'logout',
      disabled: false,
      disableIconTint: false,
      buttonColor: 'white',
      buttonFontSize: 14,
      buttonFontWeight: '600',
    },
  ],
};
const noob = () => ({});
const passProps = { logout: noob };
const mockAction = { type: '@@ERROR_NO_ACTION' };
let store = { dispatch: noob, subscribe: noob, getState: noob, replaceReducer: noob };
function makeAppTabs(iconsMap, navigatorStyle) {
  return [
    {
      label: 'News',
      screen: 'ivf.BlogScreen', // this is a registered name for a screen
      icon: iconsMap['ios-desktop-outline'],
      selectedIcon: iconsMap['ios-desktop'],
      // selectedIcon: require('../img/one_selected.png'), // iOS only
      title: 'News',
      passProps,
      navigatorStyle,
      navigatorButtons,
    },
    {
      label: 'Home',
      screen: 'ivf.HomeScreen',
      icon: iconsMap['ios-calendar-outline'],
      selectedIcon: iconsMap['ios-calendar'],
      // selectedIcon: require('../img/two_selected.png'), // iOS only
      title: 'Home',
      passProps,
      navigatorStyle,
      navigatorButtons,
    },
    {
      label: 'About',
      screen: 'ivf.MoreScreen',
      icon: iconsMap['ios-more-outline'],
      selectedIcon: iconsMap['ios-more'],
      // selectedIcon: require('../img/two_selected.png'), // iOS only
      title: 'Madina Women Hospital',
      passProps,
      navigatorStyle,
      navigatorButtons,
    },

  ];
}
const smartRootReducer = (
  state,
  action = mockAction) => rootReducer(state, action, store.getState());

const middleWares = applyMiddleware(thunk, apiMiddleware);
const composed = __DEV__ ? composeWithDevTools(middleWares) : compose(middleWares);

store = createStore(smartRootReducer, undefined, composed);
passProps.logout = () => store.dispatch(
  appActions.authLogout(appSelectors.selectAppUserId(store.getState())),
);
const storageKey = '@MySuperStore:keys';

async function loadStore({ dispatch }) {
  let saved = await AsyncStorage.getItem(storageKey);
  try {
    saved = JSON.parse(saved);
    dispatch(appActions.appRehydrate(saved));
  } catch (error) {
    AsyncStorage.clear();
  }
}


registerScreens(store, Provider);

export default class App {
  constructor(appStyle) {
    // since react-redux only works on components, we need to subscribe this class manually
    this.currentRoot = null;
    this.debouncePersistence = 0;
    this.action = type => store.dispatch({ type });
    this.tabs = makeAppTabs({}, appStyle);
    this.startApp = this.startApp.bind(this);
    this.onStoreUpdate = this.onStoreUpdate.bind(this);

    HTTP.on403 = () => this.startApp('login', true);
    HTTP.on401 = () => this.startApp('login', true);

    const timeout = setTimeout(() => {
      store.subscribe(this.onStoreUpdate);
      store.dispatch(appActions.appInitialized());
    }, 2000);


    LoadIcons.then((icons) => {
      navigatorButtons.leftButtons[0].icon = icons['ios-person'];
      // store.dispatch(appActions.appInitialized())
      this.tabs = makeAppTabs(icons, appStyle);
      loadStore(store).finally(() => {
        clearTimeout(timeout);
        store.subscribe(this.onStoreUpdate);
        store.dispatch(appActions.appInitialized());
      });
    });
  }
  onStoreUpdate() {
    const state = store.getState();
    if (!state.toJS) return;


    this.state = state;
    clearTimeout(this.debouncePersistence);
    this.debouncePersistence = setTimeout(() => {
      AsyncStorage.setItem(storageKey, JSON.stringify(state.toJS()));
    }, 5000);


    const root = appSelectors.selectAppRoot(state);

    if (!root) {
      this.currentRoot = 'login';
      this.startApp(this.currentRoot);
      return;
    }

    if (this.currentRoot !== root) {
      this.currentRoot = root;
      this.startApp(root);
    }
  }
  startApp(root, logout) {
    switch (root) {
      case 'after-login':
        const state = store.getState();
        const token = appSelectors.selectAppUserToken(state);
        if (!token || token.length < 10) passProps.logout();
        api.setHeader('Authorization', `Bearer ${token}`);
        store.dispatch(appActions.blog.download());
        store.dispatch(appActions.visits.download());
        store.dispatch(appActions.downloadConfig());
        Navigation.startTabBasedApp({
          title: 'Madina Icsi',
          tabsStyle: {
            tabBarBackgroundColor: 'purple',
            tabBarButtonColor: '#ffffff',
            tabBarSelectedButtonColor: 'white',
            tabBarTranslucent: false,
          },
          tabs: this.tabs,
        });
        break;
      case 'login':
        if (logout === true) passProps.logout();
        api.setHeader('Authorization', 'Bearer null');
        Navigation.startSingleScreenApp({
          animationType: 'slide-down',
          screen: {
            screen: 'ivf.AuthScreen',
            title: 'Login',
            navigatorStyle: { navBarHidden: true },
          },
          passProps,
        });
        break;
      default:
        console.warn(`unkown app root[${root}]`);
    }
  }
}
