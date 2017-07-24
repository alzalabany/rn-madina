import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Modal,
  Button,
  RefreshControl,
  TextInput,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';

import { selectAppUserRole, selectAppUser } from '../selectors';
import Bg from '../../assets/images/longbg.png';
import { api } from '../api';
// import UserModel from '../auth/model';

function timeToHuman(time) {
  const x = String(time);
  const min = x.split(':')[1] || '00';
  let y = x.indexOf(':') ? x.split(':')[0] / 1 : x / 1;
  const am = y >= 12 ? 'pm' : 'am';
  y = y === 12 ? 12 : y > 12 ? y - 12 : y < 10 ? `0${y}` : y;

  return ` ${y}:${min}${am} `;
}


const User = connect((state, props) => ({
  user: state.getIn(['users', props.id]),
}))(props => props.render(props.user || {}));
const Calendar = props => null;

const { width, height } = Dimensions.get('window');

const innerWidth = width - 60;

function arrayUnique(arr) {
  return [...new Set([].concat(...arr))].sort();
}

class CreatePage extends Component {
  static navigatorStyle = {
    navBarTextColor: 'white', // change the text color of the title (remembered across pushes)
    navBarBackgroundColor: 'purple', // change the background color of the nav bar (remembered across pushes)
  };
  static navigatorButtons = {
    leftButtons: [{
      title: 'back', // for a textual button, provide the button title (label)
      id: 'back', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
      testID: 'e2e_rules', // optional, used to locate this view in end-to-end tests
      disabled: false, // optional, used to disable the button (appears faded and doesn't interact)
      disableIconTint: true, // optional, by default the image colors are overridden and tinted to navBarButtonColor, set to true to keep the original image colors
      showAsAction: 'ifRoom', // optional, Android only. Control how the button is displayed in the Toolbar. Accepted valued: 'ifRoom' (default) - Show this item as a button in an Action Bar if the system decides there is room for it. 'always' - Always show this item as a button in an Action Bar. 'withText' - When this item is in the action bar, always show it with a text label even if it also has an icon specified. 'never' - Never show this item as a button in an Action Bar.
      buttonColor: 'white', // Optional, iOS only. Set color for the button (can also be used in setButtons function to set different button style programatically)
      buttonFontSize: 14, // Set font size for the button (can also be used in setButtons function to set different button style programatically)
      buttonFontWeight: '600', // Set font weight for the button (can also be used in setButtons function to set different button style programatically)
    }], // see "Adding buttons to the navigator" below for format (optional)
    rightButtons: [], // see "Adding buttons to the navigator" below for format (optional)
    animated: true, // does the change have transition animation or does it happen immediately (optional)
  }
    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

    _hideDateTimePicker = date => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = (date) => {
      this.setState({ isDateTimePickerVisible: false, date, time: null });
    };
    constructor(props) {
      super(props);
      this.state = {
        date: moment().add(2, 'days'),
        isDateTimePickerVisible: false,
        dates: [],
        width: width * 0.3,
        extra: [],
        dates: [],
        config: {},
        drsearchFilter: '',
        ref_id: this.props.role === 'dr' ? this.props.currentUser.id : null,
        loadingUsers: null,
        extras: ['imsi', 'emberyoscope', 'LAh', 'vit. all', 'PGD', 'basket'],
      };

      this.props.navigator.setOnNavigatorEvent(event => (event.id === 'back' ? this.props.navigator.dismissAllModals({ animationType: 'slide-down' }) : console.debug('unknow event ', event)));

      this.loadDrs = this.loadDrs.bind(this);
    }
    changeDate(date) {
      this.setState({
        date,
        loadingTimes: true,
        showDatePicker: false,
        time: null,
      });
      api.get(`visits/free/${moment(date).format('x')}`)
        .then((r) => {
          this.setState({ loadingTimes: false, config: r.data });
          if (!r.ok) return;
        });
    }
    componentWillMount() {
      api.get('visits/config').then((r) => {
        if (r.ok) {
          this.setState({
            dates: r.data.dates,
            extras: r.data.extras,
          });
        }
      });
    }
    required() {
      if (!this.state.ref_id) return false;
    }
    loadDrs() {
      if (this.state.loadingUsers !== null) return;
      this.setState({ loadingUsers: true });
      api.get('system/doctors').then((r) => {
        this.setState({ loadingUsers: false });
        if (r.ok) {
          const users = {};
          r.data.reduce((all, item) => (all[item.id] = item, all), users);
          console.log(users);
          this.props.dispatch({ type: 'IVF/AUTH/MERGE', users });
        }
      });
    }
    makeInput({ placeholder, name, type }) {
      return {
        placeholder,
        onChangeText: text => this.setState({ [name]: text.toLowerCase() }),
        value: this.state[name] || '',
        autoCapitalize: 'none',
        autoCorrect: false,
        keyboardType: type || 'default',
        returnKeyType: 'next',
        selectTextOnFocus: true,
      };
    }
    render() {
      const isSelected = (prop, val, eq) => ((this.state[prop] === val || eq) ? styles.selected : null);
      const date = moment(this.state.date);
      const slots = (this.state.config && this.state.config.slots) ? arrayUnique(Object.values(this.state.config.slots)) : [];
      return (

        <ScrollView onLayout={event => this.setState({ width: (event.nativeEvent.layout.width * 0.5) - 20 })} style={this.props.style ? this.props.style : styles.card}>

          <TouchableOpacity style={styles.row} onPress={() => this.setState({ showDrSelect: true }, this.loadDrs.bind(this))}>
            <Text style={styles.label}>Doctor: </Text>
            <User id={this.state.ref_id} render={data => <Text style={[styles.label, { fontWeight: 'bold', marginBottom: 10 }]}>{data.fullname || 'Click to Select Doctor**'}</Text>} />
          </TouchableOpacity>

          <TextInput {...this.makeInput({ placeholder: 'Patient Name*', name: 'patient' })} style={styles.input} />
          <TextInput {...this.makeInput({ placeholder: 'Husband Name', name: 'husband' })} style={styles.input} />
          <TextInput {...this.makeInput({ placeholder: 'Phone number', name: 'phone', type: 'numeric' })} style={styles.input} />

          <Text style={[styles.label, styles.space]}>Type of service*</Text>
          <View style={styles.row}>
            <TouchableOpacity style={[styles.option]} onPress={() => this.setState({ type: 'icsi', date: null, time: null })}>
              <Text style={[styles.cell, isSelected('type', 'icsi')]}>
              ICSI
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.option]} onPress={() => this.setState({ type: 'iui' })}>
              <Text style={[styles.cell, isSelected('type', 'iui')]}>
              IUI
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={() => this.setState({ type: 'thawing' })}>
              <Text style={[styles.cell, isSelected('type', 'thawing')]}>
              thawing
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.row, { marginBottom: 20 }]}>
            <TouchableOpacity style={styles.option} onPress={() => this.setState({ type: 'dxmicro' })}>
              <Text style={[styles.cell, isSelected('type', 'dxmicro')]}>
              Diagnostic Microscopy
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={() => this.setState({ type: 'hysteroscopy' })}>
              <Text style={[styles.cell, isSelected('type', 'hysteroscopy')]}>
              Hysteroscopy
              </Text>
            </TouchableOpacity>
          </View>

          {this.state.type === 'icsi' && <TextInput {...this.makeInput({ placeholder: 'Final E2', name: 'final_e2', type: 'numeric' })} style={[styles.input, {}]} />}

          <Text style={[styles.label, styles.space, { marginTop: 20 }]}>Booking Date*</Text>

          {this.state.type !== 'icsi' ?
            <TouchableOpacity onPress={this._showDateTimePicker} style={[styles.row, { backgroundColor: 'rgba(237,237,237,1)', padding: 5, borderRadius: 5 }]}>
              <View style={{ flex: 1, borderColor: 'rgba(96,166,215,1)', borderRightWidth: 2 }}>
                <Text style={{ textAlign: 'center', color: 'rgba(96,166,215,1)' }}>{date.format('DD')}</Text></View>
              <View style={{ flex: 1, borderColor: 'rgba(96,166,215,1)', borderRightWidth: 2 }}>
                <Text style={{ textAlign: 'center', color: 'rgba(96,166,215,1)' }}>{date.format('MMMM')}</Text></View>
              <View style={{ flex: 1, borderColor: 'rgba(96,166,215,1)', borderRightWidth: 0 }}>
                <Text style={{ textAlign: 'center', color: 'rgba(96,166,215,1)' }}>{date.format('YYYY')}</Text></View>
            </TouchableOpacity>

            :
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>

              {this.state.dates.map(time => (<TouchableOpacity
                key={time}
                onPress={() => this.changeDate(time)}
                style={[styles.option, { width: Math.max(this.state.width), flex: undefined }]}
              >
                <Text key={time} style={[styles.cell, isSelected('date', time)]}>
                  {moment(time * 1000).format('ddd DD-MMMM')}
                </Text>
              </TouchableOpacity>))}


              {this.state.dates.length === 0 && <Text key={'none'} style={[styles.cell, { minWidth: 100, minHeight: 30 }]}>
              Not Available
              </Text>}
            </View>}

          <DateTimePicker
            minimumDate={this.props.role === 'dr' ? new Date() : undefined}
            date={date.toDate()}
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this._handleDatePicked}
            onCancel={this._hideDateTimePicker}
          />

          {this.state.type === 'icsi' && <Text style={[styles.label, styles.space, { marginTop: 20 }]}>Available Time</Text>}

          {this.state.config.slots &&
            this.state.loadingTimes ? <ActivityIndicator /> :
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {slots.length === 0 ? <Text>This day is fullybooked please select another</Text> :
                slots.map(n => (<TouchableOpacity key={n} style={[styles.option, { width: Math.max((this.state.width * 2) / 3), flex: undefined }]} onPress={() => this.setState({ time: n })}>
                  <Text style={[styles.cell, isSelected('time', n)]}>
                    {timeToHuman(n)}
                  </Text>
                </TouchableOpacity>))}
            </View>}


          <Text style={[styles.label, styles.space, { marginTop: 20 }]}>Extra Services</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {this.state.extras.map(n => (<TouchableOpacity key={n} style={[styles.option, { width: Math.max(this.state.width), flex: undefined }]} onPress={() => this.setState({ extra: (this.state.extra || []).indexOf(n) > -1 ? (this.state.extra || []).filter(i => i !== n) : (this.state.extra || []).concat([n]) })}>
              <Text style={[styles.cell, isSelected('extra', n, (this.state.extra || []).indexOf(n) > -1)]}>
                {n}
              </Text>
            </TouchableOpacity>))}
          </View>

          <ScrollView>
            <Text>{JSON.stringify(this.state)}</Text>
          </ScrollView>

          <View style={[styles.row, { display: 'flex', justifyContent: 'center', marginVertical: 30 }]}>
            <Button onPress={() => null} style={{ color: 'white', marginTop: 50 }} onPress={this.props.close} title={'Book appointement'} />
          </View>


          <Modal
            animationType={'slide'}
            transparent
            visible={Boolean(this.state.showDrSelect)}
            onRequestClose={() => this.setState({ showDrSelect: false })}
          >
            <TouchableOpacity onPress={() => this.setState({ showDrSelect: false })} style={{ justifyContent: 'flex-end', flex: 1, backgroundColor: 'rgba(0,0,0,.1)' }}>

              <View style={{ height: 400, backgroundColor: 'white', padding: 10 }}>

                <View style={{ marginBottom: 20 }}>
                  <TextInput {...this.makeInput({ placeholder: 'Doctor Name*', name: 'drsearchFilter' })} style={styles.input} />
                </View>

                <ScrollView
                  refreshControl={
                    <RefreshControl
                      tintColor="white"
                      colors={['white', 'green', 'red', 'yellow']}
                      refreshing={Boolean(this.state.loadingUsers)}
                      onRefresh={this.loadDrs}
                    />}
                  style={{ flex: 1 }}
                >
                  {this.props.doctors.filter(d => (this.state.drsearchFilter.length < 2 ? true : String(d.fullname).toLowerCase().indexOf(this.state.drsearchFilter || '') > -1)).map(d => (
                    <TouchableOpacity
                      key={d.id}
                      style={{ borderBottomWidth: 1, borderBottomColor: 'purple' }}
                      onPress={() => this.setState({ showDrSelect: false, ref_id: d.id })}
                    >
                      <Text style={[styles.label, { textAlign: 'center', padding: 20, fontSize: 18 }]}>Dr. {d.fullname}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

              </View>
            </TouchableOpacity>
          </Modal>

        </ScrollView>

      );
    }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  option: {
    flex: 1,
    borderRadius: 5,
    display: 'flex',
    flexDirection: 'row',
  },
  cell: {
    backgroundColor: 'rgba(237,237,237,1)',
    color: 'rgba(112,168,180,1)',
    flex: 1,
    margin: 5,
    borderRadius: 5,
    textAlign: 'center',
    padding: 5,
    width: innerWidth / 3,
  },
  selected: {
    color: 'rgba(255,255,255,1)',
    backgroundColor: 'rgba(96,166,215,1)',
  },
  btn: {
    marginTop: 40,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: 'rgba(96,166,215,1)',
  },
  space: { marginTop: 10 },
  input: {
    height: 40,
    borderColor: 'purple',
    borderWidth: 1,
    marginVertical: 5,
    borderRadius: 5,
    paddingLeft: 15,
    backgroundColor: 'rgba(237,237,237,1)',
  },
  label: {
    color: 'rgba(174,118,174,1)',
    fontWeight: '500',
  },
  card: {
    margin: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
    paddingBottom: 50,
    borderRadius: 4,
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowRadius: 5,
    shadowOpacity: 0.60,
    elevation: 5,
  },
});

const p = state => ({
  role: selectAppUserRole(state),
  currentUser: selectAppUser(state),
  doctors: [],
});

export default connect(p)(CreatePage);
