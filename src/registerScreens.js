import { Navigation } from 'react-native-navigation';

import BlogScreen from './Blog/screen';
import BlogCreateModal from './Blog/modal';
import HomeScreen from './visit/screen';
import MoreScreen from './more/screen';
import AuthScreen from './auth/screen';
import CreateVisit from './visit/CreateVisit';
import EditVisit from './visit/EditVisit';


export default function register(store, Provider) {
  Navigation.registerComponent('ivf.BlogScreen', () => BlogScreen, store, Provider);
  Navigation.registerComponent('ivf.HomeScreen', () => HomeScreen, store, Provider);
  Navigation.registerComponent('ivf.MoreScreen', () => MoreScreen, store, Provider);
  Navigation.registerComponent('ivf.AuthScreen', () => AuthScreen, store, Provider);
  Navigation.registerComponent('ivf.CreateVisit', () => CreateVisit, store, Provider);
  Navigation.registerComponent('ivf.EditVisit', () => EditVisit, store, Provider);
  Navigation.registerComponent('ivf.create.blog', () => BlogCreateModal, store, Provider);
}
