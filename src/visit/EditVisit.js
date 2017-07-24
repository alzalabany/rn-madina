import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import {
  StyleSheet,
  Text,
  View, Alert, RefreshControl,
  ScrollView,
  Image, Modal, Button, LayoutAnimation,
  TextInput, Dimensions, ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Bg from '../../assets/images/longbg.png';
import { Navigation } from 'react-native-navigation';
import { api } from '../api';

const User = props => null;
const Calendar = props => null;

const { width, height } = Dimensions.get('window');

const innerWidth = width - 60;

const extras = [
  'imsi', 'emberyoscope', 'LAh', 'vit. all', 'PGD', 'basket',
];
const sections = {
  Personal: [
    // {label:'day', type:'text'},
    // {label:'slot', type:'text'},
    { immutable: true, label: 'ID', name: 'id', type: 'number' },
    { label: 'serial no', name: 'serial_no', type: 'number' },
    { label: 'patient', name: 'patient', type: 'text' },
    { label: 'patient age', name: 'patient_age', type: 'text' },
    { label: 'State', name: 'status', type: 'text' },
    { immutable: true, label: 'type', name: 'type', type: 'text' },
    { label: 'is_pregnant', name: 'is_pregnant', hidden: true, type: 'text' },
    { immutable: true, label: 'ref_id', name: 'ref_id', hidden: true, type: 'text' },
    { immutable: true, label: 'room_id', name: 'room_id', hidden: true, type: 'text' },
    { immutable: true, label: 'doctor', value: (props, state) => props.user.fullname || 'N/A', type: 'text' },
    { immutable: true, label: 'room', value: (props, state) => props.room.name || state.data.room_id, type: 'text' },
    { label: 'services', name: 'services', type: 'array' },
    { label: 'husband', name: 'husband', type: 'text' },
    { label: 'husband age', name: 'husband_age', type: 'text' },
    { label: 'phone', name: 'phone', type: 'text' },
    { label: 'note', name: 'note', type: 'text', multiline: true },
    { label: 'HCG time', name: 'hcg', type: 'text' },
    { label: 'day of e2', name: 'e2', type: 'number' }],
  'Clinical Data': [
    { label: 'hepatitis', name: 'hepatitis', type: 'text' },
    { label: 'indications', name: 'indications', type: 'text', multiline: true },
    { label: 'history', name: 'history', type: 'text', multiline: true },
    { label: 'prev. ART', name: 'prev_art', type: 'text', multiline: true },
    { label: 'protocol', name: 'protocol', type: 'text' },
    { label: 'St. days', name: 'stdays', type: 'text' },
    { label: 'Final E2', name: 'final_e2', type: 'text' },
    { label: 'Final P4', name: 'final_p4', type: 'text' },
    { label: 'day of ET', name: 'day_of_et', type: 'text' },
  ],
  Medications: [
    { label: 'HMG Tradename', name: 'hmg_tradename', type: 'text' },
    { label: 'HMG num', name: 'hmg_num', type: 'text' },
    { label: 'FSH tradename', name: 'fsh_tradename', type: 'text' },
    { label: 'FSH num', name: 'fsh_num', type: 'text' },
    { label: 'Rec FSH', name: 'recfsh_tradename', type: 'text' },
    { label: 'Rec FSH num', name: 'recfsh_num', type: 'text' },
    { label: 'HCG tradename', name: 'hcg_tradename', type: 'text' },
    { label: 'HCG num', name: 'hcg_num', type: 'text' },
  ],
  'Andrology Data': [
    { label: 'Embryologist', name: 'andro_embryologist', type: 'text' },
    { label: 'Prep Method', name: 'andro_prep', type: 'text' },
  ],
  'Andrology Prewash': [
    { label: 'Vol', name: 'pre_vol', type: 'text' },
    { label: 'Conc', name: 'pre_conc', type: 'text' },
    { label: 'mot', name: 'pre_mot', type: 'text' },
    { label: 'R.P.', name: 'pre_rp', type: 'text' },
    { label: 'Abn', name: 'pre_abn', type: 'text' }],
  'Andrology Postwash': [
    { label: 'Vol', name: 'post_vol', type: 'text' },
    { label: 'Conc', name: 'post_conc', type: 'text' },
    { label: 'Mot', name: 'post_mot', type: 'text' },
    { label: 'R.P.', name: 'post_rp', type: 'text' },
    { label: 'Abn', name: 'post_abn', type: 'text' },
  ],
  // "Witnesses":[],
  Oocytes: [
    { label: 'O.R', name: 'oocyte_or', type: 'text' },
    { label: 'Intact', name: 'oocyte_intact', type: 'text' },
    { label: 'M2', name: 'oocyte_m2', type: 'text' },
    { label: 'M1', name: 'oocyte_m1', type: 'text' },
    { label: 'GV', name: 'oocyte_gv', type: 'text' },
    { label: 'Injected', name: 'oocyte_injected', type: 'text' },
    { label: 'Fert.rate', name: 'oocyte_fert_rate', type: 'text' },
  ],
  Embryos: [
    { label: 'D1', name: 'embryo_d1', type: 'text' },
    { label: 'D2', name: 'embryo_d2', type: 'text' },
    { label: 'D3', name: 'embryo_d3', type: 'text' },
    { label: 'D3(a)', name: 'embryo_d3_a', type: 'text' },
    { label: 'D5', name: 'embryo_d5', type: 'text' },
    { label: 'E.R.', name: 'embryo_et', type: 'text' },
    { label: 'Vit', name: 'embryo_vit', type: 'text' },
    { label: 'Blast rate', name: 'embryo_blast_rate', type: 'text' },
  ],
  LAH: [
    { label: 'Indications', name: 'lah_indications', type: 'text', multiline: true },
    { label: 'No.', name: 'lah_no', type: 'text' },
    { label: 'Grade', name: 'lah_grade', type: 'text' },
  ],
  Incubation: [
    { label: 'Time of injection', name: 'injection_time', type: 'text' },
    { label: 'media', name: 'incubator_media', type: 'text' },
    { label: 'incubator', name: 'incubator', type: 'text' },
    { label: 'Notes', name: 'incubator_notes', type: 'text', multiline: true },
  ],
  'Embryo Transfer': [
    { label: 'day', name: 'transfer_day', type: 'text' },
    { label: 'No', name: 'transfer_no', type: 'text' },
    { label: 'catheter', name: 'transfer_catheter', type: 'text' },
    { label: 'E/D', name: 'transfer_e_d', type: 'text' },
    { label: 'Clinician', name: 'transfer_clinician', type: 'text' },
    { label: 'Embryologist', name: 'transfer_embryologist', type: 'text' },
    { label: 'Witness', name: 'transfer_witness', type: 'text' },
    { label: 'Notes', name: 'transfer_notes', type: 'text', multiline: true },
  ],
};


function timeToHuman(time) {
  const x = String(time);
  const min = x.split(':')[1] || '00';
  let y = x.indexOf(':') ? x.split(':')[0] / 1 : x / 1;
  const am = y >= 12 ? 'pm' : 'am';
  y = y === 12 ? 12 : y > 12 ? y - 12 : y < 10 ? `0${y}` : y;

  return ` ${y}:${min}${am} `;
}

class CreatePage extends Component {
  static navigatorStyle = {
    navBarTextColor: 'white', // change the text color of the title (remembered across pushes)
    navBarBackgroundColor: 'purple', // change the background color of the nav bar (remembered across pushes)
    navBarButtonColor: '#FFF',
  };
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      date: moment().add(2, 'days'),
      width: width * 0.3,
      extra: [],
      showSection: String(this.props.visit.type).toLowerCase() === 'icsi' ? null : 'Personal',
      data: Object.assign({}, this.props.visit),
      hasChanges: [],
      shouldShowSave: false,
      sections,
    };
  }
  componentDidMount() {
    this.props.navigator.setButtons({
      rightButtons: [{
        title: 'save', // for a textual button, provide the button title (label)
        id: 'save', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
        disabled: false, // optional, used to disable the button (appears faded and doesn't interact)
        disableIconTint: true, // optional, by default the image colors are overridden and tinted to navBarButtonColor, set to true to keep the original image colors
        buttonColor: 'white', // Optional, iOS only. Set color for the button (can also be used in setButtons function to set different button style programatically)
        buttonFontSize: 14, // Set font size for the button (can also be used in setButtons function to set different button style programatically)
        buttonFontWeight: '600', // Set font weight for the button (can also be used in setButtons function to set different button style programatically)
      }],
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
      }],
      animated: true,
    });

    this.props.navigator.setOnNavigatorEvent((event) => {
      console.log('edit event', event);
      if (event.id === 'didAppear') {
        console.log('hidding navigator');
        return this.props.navigator.toggleTabs({
          to: 'hidden', // required, 'hidden' = hide tab bar, 'shown' = show tab bar
          animated: true, // does the toggle have transition animation or does it happen immediately (optional)
        });
      }
      if (event.id === 'save') {
        const visit = {};
        for (const ii in sections) {
          for (const i in sections[ii]) {
            const service = sections[ii][i];
            if (!service.immutable) {
              visit[service.name] = this.state.data[service.name] || service.name;
            }
          }
        }
        api.put(`visits/data/${this.props.id}`, visit);
        this.setState({ shouldShowSave: false });
        return;
      }
      if (event.id !== 'back') return;

      if (this.state.shouldShowSave) {
        return Alert.alert(
          'You have unsaved changes',
          'Click Cancel to cancel all changes, or ok to go back and save them',
          [
            { text: 'OK', onPress: () => console.log('OK Pressed!') },
            { text: 'Cancel',
              onPress: () => {
                this.props.navigator.toggleTabs({ to: 'shown', animated: true });
                this.props.navigator.pop({ animationType: 'slide-down' })
                ; 
},
            },
          ],
        );
      }
      this.props.navigator.toggleTabs({ to: 'shown', animated: true });
      this.props.navigator.pop({ animationType: 'fade' });
    });
  }
  componentWillReceiveProps(props) {
    if (props.visit !== this.props.visit) {
      this.setState({ data: Object.assign({}, props.visit) });
    }
  }
  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }
  handleisPregnantClick() {
    Alert.alert(
      this.props.visit.patient,
      'is she pregnant ?',
      [
        { text: 'not sure', onPress: () => this.setState({ data: Object.assign({}, this.state.data, { is_pregnant: null }) }) },
        { text: 'yes', onPress: () => this.setState({ data: Object.assign({}, this.state.data, { is_pregnant: 1 }) }) },
        { text: 'no', onPress: () => this.setState({ data: Object.assign({}, this.state.data, { is_pregnant: 0 }) }) },
      ],
    );
  }
  update(label, value) {
    console.log(`should update ->${label}:${value}`);
    const hasChanges = this.props.visit[label] !== value ? this.state.hasChanges.concat(label) : this.state.hasChanges.filter(i => i !== label);
    const shouldShowSave = hasChanges.length > 0;
    console.log(hasChanges, shouldShowSave, this.state.shouldShowSave);

    this.setState({
      data: Object.assign({}, this.state.data, { [label]: value }),
      hasChanges,
      shouldShowSave,
    });
  }
  _onRefresh() {
    this.setState({ refreshing: true });
    setTimeout(() => this.setState({ refreshing: false }), 2000);
  }
  render() {
    const isSelected = (prop, val, eq) => ((this.state[prop] === val || eq) ? styles.selected : null);
    const date = moment(this.state.date);
    this.props.navigator.toggleTabs({
      to: 'visible', // required, 'hidden' = hide tab bar, 'shown' = show tab bar
      animated: true, // does the toggle have transition animation or does it happen immediately (optional)
    });
    console.log(String(this.props.visit.type).toLowerCase());
    const sections = String(this.props.visit.type).toLowerCase() === 'icsi' ? Object.keys(this.state.sections) : ['Personal'];

    return (
      <View
        refreshControl={
          <RefreshControl
              tintColor="white"
              colors={['white', 'green', 'red', 'yellow']}
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />}
        onLayout={event => this.setState({ width: (event.nativeEvent.layout.width * 0.5) - 20 })}
                style={[styles.card, this.props.style, { flex: 1, backgroundColor: 'rgba(144,75,120,.6)', padding: 0, margin: -10 }]}
      >
        <View style={[styles.row, { marginHorizontal: 20 }]}>
          <View style={{ borderColor: 'purple', borderWidth: 1, flex: 1, alignItems: 'center' }}>
            <Text style={{ color: 'grey' }}>State</Text>
            <Text style={{ height: 10 }} />
            <Text style={{ color: 'purple' }}>{this.props.visit.status}</Text>
          </View>
          <TouchableOpacity style={{ flex: 1 }} onPress={this.handleisPregnantClick.bind(this)}>
            <View style={{ borderColor: 'purple', borderWidth: 1, flex: 1, alignItems: 'center' }}>
                <Text style={{ color: 'grey' }}>Pregnancy</Text>
                <Text style={{ height: 10 }} />
                <Text style={{ color: 'purple' }}>{this.state.data.is_pregnant === 1 ? 'Yes' : 'No'}</Text>
              </View>
          </TouchableOpacity>
          <View style={{ borderColor: 'purple', borderWidth: 1, flex: 1, alignItems: 'center' }}>
            <Text style={{ color: 'grey' }}>Date</Text>
            <Text style={{ color: 'purple' }}>{moment(this.props.visit.day).format('DD-MM-YYYY')}</Text>
            <Text style={{ color: 'purple' }}>{timeToHuman(this.props.visit.slot)}</Text>
          </View>
        </View>

        {sections.map(i => (<View><TouchableOpacity style={[styles.row, { backgroundColor: 'rgba(0,188,183,1)', padding: 10, marginVertical: 10 }]} onPress={() => this.setState({ showSection: this.state.showSection === i ? null : i })}>
          <Text style={[{ flex: 1, fontSize: 20, color: 'white', textAlign: 'center' }]}>{i}</Text>
          {this.state.showSection !== i && <Text style={{ color: 'white' }}>open</Text>}
        </TouchableOpacity>
          {this.state.showSection === i && <View>
          {this.state.sections[i].filter(ix => !ix.hidden).map(name => (<View style={[styles.row, { borderWidth: 1, borderColor: 'purple' }]}>
            <View style={{ overflow: 'hidden', borderRightWidth: 1, borderColor: 'purple', padding: 10, width: 100 }}>
                                        <Text style={[styles.label, { flex: 1, textAlign: 'left' }]}>{name.label}</Text>
            </View>
            <TextInput multiline={name.multiline} editable={!name.immutable} style={[styles.label, { flex: 1, textAlign: 'center', padding: 10, color: name.immutable ? 'grey':'purple' }]} defaultValue={String((name.value ? name.value(this.props, this.state) : this.state.data[name.name]) || '')} onChangeText={e => this.update(name.name, e)} />
          </View>))}
        </View>}
        </View>))}
        <Text style={{ color: 'white' }}>
                ..{JSON.stringify(this.props.visit)}
        </Text>
        <View style={{ height: 50 }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  row: {
    backgroundColor: 'white',
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

const state = (state, props) => ({
  visit: state.getIn(['visits', 'cards', String(props.id)]),
  user: {},
  room: {},
});

const act = dispatch => ({
  dispatch,
  visitData: id => dispatch({ type: id }),
});
export default connect(state, act)(CreatePage);
