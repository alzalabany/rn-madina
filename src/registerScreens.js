import { Navigation } from 'react-native-navigation';

import BlogScreen from './Blog/screen';
import BlogCreateModal from './Blog/modal';
import HomeScreen from './Home';
import MoreScreen from './more/screen';
import AuthScreen from './auth/screen';
import CreateVisit from './visits/CreateVisit';
import EditVisit from './visits/EditVisit';
import RoomsSettings from './Home/roomsSettings'


export default function register(store, Provider){

    Navigation.registerComponent('ivf.BlogScreen',  () => BlogScreen, store, Provider);
    Navigation.registerComponent('ivf.HomeScreen',  () => HomeScreen, store, Provider);
    Navigation.registerComponent('ivf.MoreScreen',  () => MoreScreen, store, Provider);
    Navigation.registerComponent('ivf.AuthScreen',  () => AuthScreen, store, Provider);
    Navigation.registerComponent('ivf.CreateVisit', () => CreateVisit, store, Provider);
    Navigation.registerComponent('ivf.EditVisit',   () => EditVisit, store, Provider);
    Navigation.registerComponent('ivf.create.blog', () => BlogCreateModal, store, Provider);
    Navigation.registerComponent('ivf.RoomsSetting',() => RoomsSettings, store, Provider);
    Navigation.registerComponent('ivf.Profile',     () => RoomsSettings, store, Provider);
    Navigation.registerComponent('ivf.autocomplete',() => RoomsSettings, store, Provider);

}