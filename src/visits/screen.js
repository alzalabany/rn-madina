import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ScrollView,
} from 'react-native';
import moment from 'moment';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from 'react-native-modal-datetime-picker';

// import User from '../auth/model';
import Navbg from '../../assets/images/dr.png';
import styles from './styles.js';
import Visit from './model';
// import Shortlist from './shortlist';

import AdminCalendar from '../Home/AdminCalendar';
import { api } from '../api';

import { iconsMap } from '../icons';
import { timeToHuman } from '../tools';
import VisitRow from './Row';
import Statistics from './VisitStats';
import * as actions from '../common/actions';

const { height } = Dimensions.get('window');

const Tabs = props => (<View style={{ marginHorizontal: 15 }}><ScrollView horizontal style={props.style}>
  {props.titles.map((i, key) => {
    const sel = (props.selected || 0) === key;
    return (<TouchableOpacity key={key} onPress={() => props.onChange(i, key)} style={[sel ? styles.active : styles.inactive, key === 0 ? styles.first : {}, key === props.titles.length - 1 ? styles.last : {}, { borderRightWidth: 1, borderColor: 'grey' }]}>
      <Text style={sel ? styles.activeText : styles.inactiveText}>{props.label(i)}</Text>
    </TouchableOpacity>)
    ;
  },
  )}
</ScrollView></View>);

const datePicker = (open, date) => (<TouchableOpacity onPress={() => open()} style={[styles.row, { backgroundColor: 'rgba(237,237,237,1)', padding: 5, borderRadius: 5 }]}>
  <View style={{ flex: 1, borderColor: 'rgba(96,166,215,1)', borderRightWidth: 2 }}>
    <Text style={{ textAlign: 'center', color: 'rgba(96,166,215,1)' }}>{date.format('DD')}</Text></View>
  <View style={{ flex: 1, borderColor: 'rgba(96,166,215,1)', borderRightWidth: 2 }}>
    <Text style={{ textAlign: 'center', color: 'rgba(96,166,215,1)' }}>{date.format('MMMM')}</Text></View>
  <View style={{ flex: 1, borderColor: 'rgba(96,166,215,1)', borderRightWidth: 0 }}>
    <Text style={{ textAlign: 'center', color: 'rgba(96,166,215,1)' }}>{date.format('YYYY')}</Text></View>
</TouchableOpacity>);

const AUser = connect((state, props) => ({ user: state.get(['users', props.id]) }))(props => props.render(props.user || {}));

class Home extends Component {
  constructor(props) {
    super(props);
    console.log('home props', this.props);
    const keys = this.props.rooms.map(room => room.toJS());
    this.state = {
      date: moment(this.props.currentDay),
      isDr: this.props.role === 'dr',
      showSearch: false,
      tabs: this.props.role === 'dr' ? ['Recent Cycles', { id: -1, name: 'Search' }] : ['Recent Cycles', ...keys, { id: -1, name: 'Search' }],
      ...this.formatVisits(
        props.visits,
        props.uid,
        props.role,
        props.filters),
    };

    if (!this.state.date.isValid()) this.state.date = moment();

    this.openModal = this.openModal.bind(this);
    this.openVisit = this.openVisit.bind(this);

    this.props.navigator.setOnNavigatorEvent((event) => {
      console.log('event', event);
      if (event.id === 'search') this.setState({ showSearch: !this.state.showSearch, selectedTab: -1 });

      if (event.type == 'NavBarButtonPress' && event.id === 'logout') {
        api.action('RESET');
      }
    });
    this.props.loadConfig();
  }

  componentWillUnmount() {
    console.log('unmounting Home !');
    this.props.navigator.setButtons({
      rightButtons: [], // see "Adding buttons to the navigator" below for format (optional)
      animated: true, // does the change have transition animation or does it happen immediately (optional)
    });
  }
  componentWillMount() {
    this.props.fetch({ max_id: 0, min_id: 0, count: 20 });
  }
  componentDidMount() {
    console.log('mounting home !');
    this.props.loadConfig();
    this.props.navigator.setButtons({
      rightButtons: [
        {
          title: 'search', // if you want a textual button
          icon: iconsMap['ios-search'], // if you want an image button
          id: 'search', // id of the button which will pass to your press event handler. See the section bellow for Android specific button ids
          disabled: false, // optional, used to disable the button (appears faded and doesn't interact)
          disableIconTint: false, // optional, by default the image colors are overridden and tinted to navBarButtonColor, set to true to keep the original image colors
          buttonColor: 'white', // Set color for the button (can also be used in setButtons function to set different button style programatically)
          buttonFontSize: 14, // Set font size for the button (can also be used in setButtons function to set different button style programatically)
          buttonFontWeight: '600', //
        },
      ], // see "Adding buttons to the navigator" below for format (optional)
      animated: true, // does the change have transition animation or does it happen immediately (optional)
    });
  }
  componentWillReceiveProps(props) {
    const newState = {};
    if (props.rooms !== this.props.rooms) {
      const keys = this.props.rooms.toArray();
      this.setState({ tabs: props.role === 'dr' ? ['Recent Cycles', { id: -1, name: 'Search' }] : ['Recent Cycles', ...keys, { id: -1, name: 'Search' }] });
    }
    if (props.currentDay !== this.props.currentDay) {
      // console.debug('day changed',props,moment(props.currentDay));
      date = moment(props.currentDay);
      this.setState({ date: date.isValid() ? date : moment() });
    }
    if (props.visits !== this.props.visits) {
      this.setState(this.formatVisits(
        props.visits,
        props.uid,
        props.role,
        props.filters));
    }
  }
  renderPicker() {
    return null;
  }
  renderTabs() {

  }
  openVisit(visit) {
    this.props.navigator.push({
      screen: 'ivf.EditVisit', // unique ID registered with Navigation.registerScreen
      title: `${visit.patient}'s Card`,
      subtitle: visit.type + (visit.services ? ` + ${String(visit.services || '')}` : ''),
      passProps: {
        id: visit.id,
      }, // simple serializable object that will pass as props to the modal (optional)
    });
  }
  openModal() {
    this.props.navigator.showModal({
      screen: 'ivf.CreateVisit', // unique ID registered with Navigation.registerScreen
      title: 'Book new Appointement', // title of the screen as appears in the nav bar (optional)
      animationType: 'slide-up', // 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
    });
  }
  tabChange(page, key) {
    this.setState({ selectedTab: key, showSearch: (page && page.id === -1) });
    if (page.id && page.starting_hour) {
      // is a room;
      this.props.filter('room_id', page.id);
    } else {
      this.props.filter('room_id', null);
    }
  }
  formatVisits(visitsProp, uid, role, filters) {
    const { patient, day, room_id } = this.props.filters;

    let visits = visitsProp.filter(visit => visit.get('ref_id') === uid).sort((a, b) => (a.get('day') === b.day ? a.slot > b.slot : b.day > a.day));
    visits = visits.filter((visit) => {
      if (role === 'admin' || role === 'staff') {
        if (room_id && visit.room_id !== room_id) return false;
      } else if (visit.user_id !== uid) return false;


      if (moment(day).diff(date, 'days') === 0 && /^20[0-9]{2}-[0-9]{2}-[0-9]{2}$/.test(day) && visit.day !== day) return false;

      if (patient && patient.length > 2 && String(visit.patient).toLowerCase().indexOf(patient) === -1) return false;

      return true;
    }).toArray().map(x => x.toJS());
    const stats = { byType: {}, byStatus: {} };

    visits.map((visit) => {
      if (visit.type) {
        if (stats.byType[visit.type]) {
          stats.byType[visit.type]++;
        } else {
          stats.byType[visit.type] = 1;
        }
      }

      if (visit.status) {
        if (stats.byStatus[visit.status]) {
          stats.byStatus[visit.status]++;
        } else {
          stats.byStatus[visit.status] = 1;
        }
      }
    });
    return { visits, stats };
  }
  render() {
    const date = this.state.date;

    const tabs = this.state.tabs;

    const Search = this.state.showSearch;

    const { stats, visits } = this.state;

    const role = this.props.role;

    console.log(this.props.rooms);

    const { patient, day, room_id } = this.props.filters;
    // if(this.state.search)patient = this.state.search;


    return (<View style={{ flex: 1 }}>
      <Image source={Navbg} style={{ width, height: height * 0.3, zIndex: -1, position: 'absolute', top: 0 }}>
        <View style={{ backgroundColor: 'rgba(144,75,120,.6)', flex: 1 }} />
      </Image>

      <DateTimePicker
        cancelTextIOS="Clear date"
        date={date ? date.toDate() : undefined}
        isVisible={this.state.showDatePicker}
        onConfirm={date => this.setState({ showDatePicker: false, date: moment(date) }, () => this.props.filter('day', moment(date).format('YYYY-MM-DD')))}
        onCancel={() => this.setState({ showDatePicker: false, date: null })}
      />

      {!!Search && <View>
        {date && date.format('YYYY-MM-DD') === day ?
          <TouchableOpacity onPress={() => this.setState({ showDatePicker: true })} style={[styles.row, { margin: 0, marginHorizontal: -20, backgroundColor: 'purple', borderBottomWidth: 2, borderColor: 'rgba(189,93,234,1)' }]}>
            <View style={{ flex: 1, borderColor: 'white', padding: 10, borderRightWidth: 2 }}>
                <Text style={{ textAlign: 'center', color: 'white' }}>{date.format('DD')}</Text></View>
            <View style={{ flex: 1, borderColor: 'white', padding: 10, borderRightWidth: 2 }}>
                <Text style={{ textAlign: 'center', color: 'white' }}>{date.format('MMMM YYYY')}</Text></View>
            <TouchableOpacity style={{ flex: 1, borderColor: 'white', padding: 10, borderRightWidth: 0 }} onPress={() => this.setState({ showDatePicker: false, date: null })}>
                <View >
                <Text style={{ textAlign: 'center', color: 'white' }}>
              clear {' '}
                <Icon name="calendar" />
              </Text>
              </View></TouchableOpacity>
          </TouchableOpacity> :
          <TouchableOpacity onPress={() => this.setState({ showDatePicker: true })} style={[styles.row, { margin: 0, marginHorizontal: -20, backgroundColor: 'purple', borderBottomWidth: 2, borderColor: 'rgba(189,93,234,1)' }]}>
              <View style={{ flex: 1, borderColor: 'white', padding: 10, borderRightWidth: 2 }}>
              <Text style={{ textAlign: 'center', color: 'white' }}>
              Click to Filter by date
              </Text>
            </View>

            </TouchableOpacity>
        }</View>}

      {!!Search && <View style={{ height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: 'purple', paddingHorizontal: 10, paddingVertical: 5 }}>
        <TextInput
          autoCorrect={false}
          autoFocus
          returnKeyType="search"
          selectTextOnFocus
          blurOnSubmit
          underlineColorAndroid="transparent"
          autoCapitalize="none"
          value={patient || ''}
          onChangeText={text => this.setState({ search: text.toLowerCase() }, () => this.props.filter('patient', text))}
          placeholder="Search patients.."
          style={{ height: 30, flex: 1, backgroundColor: 'white', borderRadius: 10, paddingHorizontal: 30 }}
        />
      </View>
      }

      <Statistics total={undefined} data={visits} />


      <Tabs
        selected={this.state.selectedTab}
        titles={tabs}
        label={i => (typeof i === 'object' ? i.name : i)}
        onChange={this.tabChange.bind(this)}
        style={{ minHeight: 40 }}
      />

      {this.props.filters.room_id && this.props.role !== 'dr' ?
        <AdminCalendar navigator={this.props.navigator} room={this.props.rooms[this.props.filters.room_id]} data={visits} /> :

        <View style={[{ backgroundColor: 'white', marginTop: -5, borderRadius: 5, flex: 1, margin: 10, padding: 0 }]}>
          <ScrollView style={[styles.card, { padding: 10, flex: 1 }]}>
            {visits.map((visit, idx) => (<TouchableOpacity key={String(idx)} onPress={() => this.openVisit(visit)}>
                <View style={styles.avisit}>
                <View style={styles.row}>
                  <Text style={styles.label}>Date :</Text>
                  <Text style={[styles.value, { flex: 1 }]}>{moment(visit.day).format('DD-MMM-YYYY')}      <Text style={styles.timelabel}>{timeToHuman(visit.slot)}</Text> </Text>
                  <Text style={[styles.row, { color: 'green' }]}>{visit.status || 'booked'}:<View style={[styles.dot, { backgroundColor: 'green' }]} /></Text>
                </View>

                <View style={styles.row}>
                  <Text style={styles.label}>Patient :</Text>
                  <Text style={styles.value}>{visit.patient}</Text>
                </View>
                {!!this.props.user.id === visit.ref_id ? null :
                <View style={styles.row}>
                    <Text style={styles.label}>doctor:</Text>
                    <AUser id={visit.ref_id} render={u => <Text style={styles.value}>{u.fullname || 'N/A'}</Text>} />
                  </View>}

                <View style={styles.row}>
                  <Text style={styles.label}>Service :</Text>
                  <Text style={styles.value}>{visit.type} <Text style={styles.small}>{visit.services}</Text></Text>
                </View>

              </View></TouchableOpacity>))}


            {Boolean(visits.length === 0 && this.props.role === 'dr') &&
              <TouchableOpacity onPress={() => this.openModal()}>
              <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, marginTop: 40 }}>
                <Text style={{ color: 'grey' }}>You didn't Book any Appointements yet</Text>
                <Text style={{ color: 'grey' }}>Create one now !</Text>
                <Icon name="arrow-down" size={24} color="grey" style={{ marginTop: 30 }} />
              </View>
            </TouchableOpacity>
            }
            {Boolean(visits.length === 0 && Search) && <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, marginTop: 40 }}>
                <Text style={{ color: 'grey' }}>No match found</Text></View>}
          </ScrollView>
        </View>}

      {this.props.role === 'dr' &&
        <View style={{ justifyContent: 'center', alignItems: 'center', margin: 20 }}>
          <Icon.Button onPress={() => this.openModal(true)} name="plus" backgroundColor="blue">
          Book new Appointement
          </Icon.Button>
        </View>}
    </View>);
  }
}
const state = state => ({
  filters: state.get('filters'),
  visits: state.get('visits'),
  users: state.get('users'),
  uid: state.get('user_id'),
  role: state.getIn(['users', state.user_id, 'role']),
  rooms: state.get('rooms'),
});
const act = dispatch => ({
  dispatch,
  loadConfig: () => dispatch(actions.GETAPPCONFIG()),
  filter: (name, payload) => dispatch({ type: 'IVF/FILTER/BY/', name, payload }),
  visitData: id => dispatch(Visit.getDetails(id)),
  fetch: data => dispatch(actions.GETVISITS(data)),
});

export default connect(state, act)(Home);
