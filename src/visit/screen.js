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
  ScrollView,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { actions, selectCards, selectFilters, selectors } from './ducks';
import { selectAppUserRole, selectUsers } from '../selectors';
import VisitStats from './VisitStats';
import VisitList from './visitList';
import DatePickerRow from './DatePickerRow';
import DrsBgsImage from '../assets/images/dr.png';
import { selectors as roomSelectors } from '../rooms/ducks';

import { card } from '../styles';

const { roomsIcontrol, selectRooms } = roomSelectors;
const { width, height } = Dimensions.get('screen');
let minWidth = (width - 40) / 2;
if (minWidth > 200) minWidth = Math.floor((minWidth * 2) / 175);
const green = ['#fdfc47', '#24fe41'];
const red = ['#cb2d3e', '#ef473a'];
const red2 = ['#833ab4', '#fd1d1d', '#fcb045'];
const full = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 0,
  minHeight: 100,
};
const tab = {
  flex: 1,
  // minWidth:100,
  maxWidth: 200,
  padding: 10,
};
const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
  },
  first: {
    borderTopLeftRadius: 14,
  },
  card,
  tab,
  last: {
    borderTopRightRadius: 14,
  },
  active: {
    backgroundColor: 'purple',
    ...tab,
  },
  inactive: {
    backgroundColor: 'white',
    ...tab,
  },
  activeText: { color: 'white', fontWeight: '500' },
  inactiveText: {
    color: 'purple',
    fontWeight: '500',
  },
  flex: {
    flex: 1,
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
  slot: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  time: {
    color: 'white',
    fontSize: 22,
    flex: 1,
    fontWeight: '600',
    backgroundColor: 'transparent',
  },
  rtime: {

  },
  sub: {
    color: 'white',
    alignSelf: 'flex-start',
    fontSize: 13,
    backgroundColor: 'transparent',
  },
});
function calc(room, todayString) {
  const today = moment(todayString).isValid() ? moment(todayString) : moment();
  const end = Number(room.ending_hour);
  const start = Number(room.starting_hour);
  const span = Number(room.interval);
  const size = end - start;
  if (!size || isNaN(size) || size < 0 || span < 0 || !today.isValid()) return { data: [] };


  // currently disabling weekend check because all data is on weekend !!!
  // const currentWeekDay = String(today.format('E'));
  // const weekend = Array.isArray(room.weekend) ? room.weekend : room.weekend.split(',');
  // if (weekend.map(String).indexOf(currentWeekDay) > -1) return [];

  const data = [];
  today.set({ hour: start, minute: 0 });
  const endOfTime = today.clone().set({ hour: end, minute: 0 });

  let safteyLock = 48; // saftey shortcut while, max blocks are 47 block;
  while (--safteyLock && endOfTime.diff(today, 'minute') - span >= 0) {
    data.push(today.clone());
    today.add(span, 'minute');
  }
  return {
    data,
    today,
    size,
    span,
    start,
    end,
  };
}
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
    this.state = { selected: 'listall', byType: {} };
    this.openVisit = this.openVisit.bind(this);
    this.selectRoom = this.selectRoom.bind(this);

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
      console.log(parts + payload);
    }
  }
  selectRoom(raw) {
    const id = String(raw);
    if (!this.props.myRooms.has(id)) {
      console.warn('setting id on unowned room !! this should decline');
      this.props.setFilter('room_id', '');
    } else {
      this.props.setFilter('room_id', id);
    }

    this.setState({ selected: id });
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
    let titles = [{ name: 'List', id: 'listall' }];
    titles = titles.concat(this.props.myRooms.toArray());
    titles.push({ name: 'Search', id: 'search' });
    const room = this.props.myRooms.get(this.state.selected);
    const day = moment(this.props.filters.get('day'));
    const result = room ? calc(room, this.props.filters.get('day')) : { data: [] };
    const times = result.data;
    const cal = this.props.byDate.get(day.format('YYYY-MM-DD')) || Map({});

    return (<View style={styles.container}>
      <Image source={DrsBgsImage} style={{ width, height: height * 0.3, zIndex: -1, position: 'absolute', top: 0 }}>
        <View style={{ backgroundColor: 'rgba(144,75,120,.6)', flex: 1 }} />
      </Image>
      <DatePickerRow trigger={this.state.trigger} />
      <VisitStats
        total={times.length}
        busyCount={cal.size}
        data={this.props.stats}
      />
      <View style={{ marginHorizontal: 5 }}>
        <ScrollView horizontal>
          {titles.map((i, key) => {
            const sel = this.state.selected === String(i.id);
            return (
              <TouchableOpacity
                key={`list_${i.id}`}
                onPress={() => this.selectRoom(i.id)}
                style={[sel ? styles.active : styles.inactive, key === 0 ? styles.first : {}, key === titles.length - 1 ? styles.last : {}, { borderRightWidth: 1, borderColor: 'grey' }]}
              >
                <Text style={sel ? styles.activeText : styles.inactiveText}>
                  {i.name}
                </Text>
              </TouchableOpacity>);
          })}
        </ScrollView>
      </View>
      {this.state.selected === 'listall' &&
      <VisitList
        keys={this.props.keys}
        data={this.props.data}
        dispatch={this.props.dispatch}
        openVisit={this.openVisit}
      />}

      {room && <ScrollView style={[card, { flex: 1 }]} contentContainerStyle={{ justifyContent: 'space-around', flexDirection: 'row', flexWrap: 'wrap' }}>
        {day.isValid() ?
          times.map((T, I) => {
            const B = cal.get(T.format('HH:mm')) || {};
            const key = B.id ? B.id : I * Math.random();
            return (
              <TouchableOpacity onPress={() => this.openVisit(B)} key={`slot${key}`}>
                <View
                  style={{ alignItems: 'stretch', borderRadius: 10, margin: 5, marginBottom: 5, overflow: 'hidden', minWidth, width: minWidth, height: 110 }}
                >
                  <LinearGradient
                    colors={B.slot ? red : green}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.slot}
                  >
                    <Text style={styles.time}>{T.format('hh:mma')}</Text>
                    {!(B.slot) && <View style={[{ alignSelf: 'flex-start', flexDirection: 'row' }]}>
                      <View style={{ flex: 1 }}>
                        <Icon name="flag" size={22} style={{ backgroundColor: 'transparent' }} color="white" />
                      </View>
                      <Text style={[styles.sub]}>avaliable</Text>
                    </View>}
                    {!!(B.slot) && [
                      <Text style={styles.sub}>Pt: {B.patient}</Text>,
                      <Text style={styles.sub}>Dr: {B.getDr(this.props.dispatch)}</Text>,
                      <Text style={styles.sub}>{B.type} #{B.id}</Text>,
                      <Text numberOfLines={1} style={styles.sub}>{B.getServices()}</Text>,
                    ]}
                  </LinearGradient></View>
              </TouchableOpacity>);
          }) : <TouchableOpacity onPress={() => this.setState({ trigger: Math.random() })}>

            <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 40 }}>
              <Text style={{ color: 'blue' }}>You didn't Select A Date</Text>
              <Text style={{ color: 'grey' }}>Select Day to view room calendar</Text>
              <Animatable.View
                animation="swing"
                iterationCount={5}
              >
                <Icon name="calendar" size={24} color="grey" style={{ marginTop: 10 }} />
              </Animatable.View>

            </View>
          </TouchableOpacity>}
      </ScrollView>
      }

      <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
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
  keys: selectors.visibleVisitsIds(state),
  stats: selectors.visitStatistics(state),
  byDate: selectors.visitByDate(state),
  data: selectCards(state),
  filters: selectFilters(state),
  rooms: selectRooms(state),
  myRooms: roomsIcontrol(state),
});
const propsForActions = dispatch => ({
  dispatch,
  setFilter: (name, val) => dispatch(actions.setFilter(name, val)),
  download: () => dispatch(actions.download()),
});

VisitScreen.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  keys: PropTypes.arrayOf(PropTypes.string).isRequired,
  stats: PropTypes.arrayOf(PropTypes.shape({ title: PropTypes.string })).isRequired,
  data: PropTypes.instanceOf(Map).isRequired,
  filters: PropTypes.instanceOf(Record).isRequired,
  logout: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  setFilter: PropTypes.func.isRequired,
  navigator: PropTypes.shape({
    setOnNavigatorEvent: PropTypes.func.isRequired,
    showModal: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
  users: PropTypes.instanceOf(Map).isRequired,
  role: PropTypes.string.isRequired,
};
VisitScreen.displayName = 'VisitScreen';
VisitScreen.defaultProps = ({
  keys: [],
});

export default connect(mapStoreStateToProps, propsForActions)(VisitScreen);
