import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map, Record } from 'immutable';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';

import { actions, selectCards, selectFilters, selectors } from './ducks';
import { selectAppUserRole, selectUsers } from '../selectors';
import VisitStats from './VisitStats';
import VisitList from './visitList';
import DatePickerRow from './DatePickerRow';
import GradientBar from '../../assets/images/topnav.png';
import DrsBgsImage from '../../assets/images/dr.png';


const { width, height } = Dimensions.get('screen');
const styles = {
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
};

class VisitScreen extends React.Component {
  static navigatorStyle = {
    topTabTextColor: '#ffffff',
    selectedTopTabTextColor: '#ff505c',

    topTabIconColor: '#ffffff',
    selectedTopTabIconColor: '#ff505c',

    selectedTopTabIndicatorHeight: 50,
    selectedTopTabIndicatorColor: '#ff505c',
  };
  static navigatorButtons = {
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
    rightButtons: [
      {
        title: 'search',
        id: 'search',
        disabled: false,
        disableIconTint: false,
        buttonColor: 'white',
        buttonFontSize: 14,
        buttonFontWeight: '600',
      },
    ],
  };
  constructor(props) {
    super(props);
    this.state = {};
    this.openVisit = this.openVisit.bind(this);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }
  onNavigatorEvent(event) {
    console.log('Navigation from %cHomeScreen', 'color:purple;font-size:16px;', event.id);
    switch (event.id) {
      case 'bottomTabSelected':
        // screen selected
        break;
      case 'didAppear':
        // handle a deep link
        this.props.download();
        break;
      case 'logout':
        this.props.logout();
        break;
      default:
        break;
    }
    if (event.type === 'DeepLink') {
      // this.props.navigator.handleDeepLink({link,payload})
      const parts = event.link.split('/'); // Link parts
      const payload = event.payload; // (optional) The payload of link
      this.state.deeplink = parts + payload;
    }
  }
  openVisit(visit) {
    if (visit && visit.id) {
      this.props.navigator.push({
        screen: 'ivf.EditVisit', // unique ID registered with Navigation.registerScreen
        title: `${visit.patient}'s Card`,
        subtitle: visit.type + (visit.services ? ` + ${String(visit.services || '')}` : ''),
        passProps: {
          id: visit.id,
        }, // simple serializable object that will pass as props to the modal (optional)
      });
      return;
    }

    this.props.navigator.showModal({
      screen: 'ivf.CreateVisit', // unique ID registered with Navigation.registerScreen
      title: 'Book new Appointement', // title of the screen as appears in the nav bar (optional)
      animationType: 'slide-up', // 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
    });
  }
  render() {
    return (<View style={styles.container}>
      <Image source={DrsBgsImage} style={{ width, height: height * 0.3, zIndex: -1, position: 'absolute', top: 0 }}>
        <View style={{ backgroundColor: 'rgba(144,75,120,.6)', flex: 1 }} />
      </Image>
      <DatePickerRow />
      <VisitStats total={this.props.keys.length} data={this.props.stats} />
      <VisitList
        keys={this.props.keys}
        data={this.props.data}
        openVisit={this.openVisit}
        roomId={String(this.props.filters.get('room_id'))}
      />
      {Boolean(this.props.keys.length === 0 && this.props.role === 'dr') &&
        <TouchableOpacity onPress={() => this.openVisit()}>
          <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, marginTop: 40 }}>
            <Text style={{ color: 'grey' }}>You didn't Book any Appointements yet</Text>
            <Text style={{ color: 'grey' }}>Create one now !</Text>
            {/* <Icon name="arrow-down" size={24} color="grey" style={{ marginTop: 30 }} />*/}
          </View>
        </TouchableOpacity>
      }
      <View style={{ justifyContent: 'center', alignItems: 'center', margin: 20 }}>
        <Icon.Button onPress={() => this.openVisit()} name="plus" backgroundColor="purple">
          Book new Appointement
        </Icon.Button>
      </View>
    </View>);
  }
}


const mapStoreStateToProps = state => ({
  role: selectAppUserRole(state),
  users: selectUsers(state),
  keys: selectors.selectVisitsIds(state),
  stats: selectors.selectVisibleCards(state),
  data: selectCards(state),
  filters: selectFilters(state),
});
const propsForActions = dispatch => ({
  dispatch,
  download: () => dispatch(actions.download()),
});

VisitScreen.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  keys: PropTypes.arrayOf(PropTypes.string).isRequired,
  stats: PropTypes.arrayOf(PropTypes.shape({ title: PropTypes.string })).isRequired,
  data: PropTypes.instanceOf(Map).isRequired,
  users: PropTypes.instanceOf(Map).isRequired,
  filters: PropTypes.instanceOf(Record).isRequired,
  role: PropTypes.string.isRequired,
  logout: PropTypes.func.isRequired,
  navigator: PropTypes.shape({
    setOnNavigatorEvent: PropTypes.func.isRequired,
    showModal: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
};
VisitScreen.displayName = 'VisitScreen';
VisitScreen.defaultProps = ({
  keys: [],
});

export default connect(mapStoreStateToProps, propsForActions)(VisitScreen);
