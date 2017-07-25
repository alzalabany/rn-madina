import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map, Record } from 'immutable';
import moment from 'moment';
import { connect } from 'react-redux';
import {
  StyleSheet,
  Text,
  View, Alert, RefreshControl,
  ScrollView,
  Image,
  LayoutAnimation,
  TextInput,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Bg from '../../assets/images/longbg.png';
import { Navigation } from 'react-native-navigation';
import { api } from '../api';
import { timeToHuman } from '../tools';
import { selectAppUserRole, selectUsers } from '../selectors';
import { CardShape } from './ducks';

const User = props => null;
const Calendar = props => null;

const { width, height } = Dimensions.get('window');

const innerWidth = width - 60;

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
const sections = {
  Personal: [
    { immutable: true, label: 'ID', name: 'id', type: 'number' },
    { label: 'serial no', name: 'serial_no', type: 'number' },
    { label: 'patient', name: 'patient', type: 'text' },
    { label: 'patient age', name: 'patient_age', type: 'text' },
    { label: 'State', name: 'status', type: 'text' },
    { immutable: true, label: 'type', name: 'type', type: 'text' },
    { label: 'is_pregnant', name: 'is_pregnant', hidden: true, type: 'text' },
    { immutable: true, label: 'ref_id', name: 'ref_id', hidden: true, type: 'text' },
    { immutable: true, label: 'room_id', name: 'room_id', hidden: true, type: 'text' },
    { immutable: true, label: 'doctor', value: (props, state) => (state.visit.getDr ? state.visit.getDr() : 'N/A'), type: 'text' },
    { immutable: true, label: 'room', value: (props, state) => state.visit.room_id, type: 'text' },
    { label: 'services', name: 'services', type: 'array' },
    { label: 'husband', name: 'husband', type: 'text' },
    { label: 'husband age', name: 'husband_age', type: 'text' },
    { label: 'phone', name: 'phone', type: 'text' },
    { label: 'note', name: 'note', type: 'text', multiline: true },
    { label: 'HCG time', name: 'hcg', type: 'text' },
    { label: 'day of e2', name: 'e2', type: 'number' }],
  notes: [
    { label: 'Dr. note', name: 'note', type: 'text', multiline: true, immutable: true },
    { label: 'Extra Notes', name: 'extra_note', type: 'text', multiline: true },
  ],
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

class CreatePage extends Component {
  static navigatorStyle = {
    navBarTextColor: 'white',
    navBarBackgroundColor: 'purple',
    navBarButtonColor: '#FFF',
  };
  static navigatorButtons = {
    rightButtons: [{
      title: 'save',
      id: 'save',
      disabled: false,
      disableIconTint: true,
      buttonColor: 'white',
      buttonFontSize: 14,
      buttonFontWeight: '600',
    }],
    leftButtons: [{
      title: 'back',
      id: 'back',
      testID: 'e2e_rules',
      disabled: false,
      disableIconTint: true,
      showAsAction: 'ifRoom',
      buttonColor: 'white',
      buttonFontSize: 14,
      buttonFontWeight: '600',
    }],
    animated: true,
  }
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      date: moment().add(2, 'days'),
      showSection: null,
      visit: new CardShape({}),
    };
    this.onRefresh = this.onRefresh.bind(this);
    this.canEdit = this.canEdit.bind(this);
    this.save = this.save.bind(this);
    this.update = this.update.bind(this);
    this.handleisPregnantClick = this.handleisPregnantClick.bind(this);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  componentWillReceiveProps(props) {
    if (props.visit !== this.props.visit) {
      this.setState({ visit: props.visit.injectStore(props.users) });
    }
  }
  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  onNavigatorEvent(event) {
    if (!event || !event.id) return;
    switch (event.id) {
      case 'didAppear':
        if (this.props.visit !== this.state.visit) {
          this.setState({ visit: this.props.visit });
        }
        this.props.navigator.toggleTabs({
          to: 'hidden',
          animated: true,
        });
        break;
      case 'save':
        this.save();
        break;
      case 'back':
        if (this.stateshouldShowSave) {
          Alert.alert(
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
        } else {
          this.props.navigator.toggleTabs({ to: 'shown', animated: true });
          this.props.navigator.pop({ animationType: 'fade' });
        }
        break;
      default:
        break;
    }
  }
  save() {
    // call save visit
    this.props.saveVisit(this.state.visit);
  }
  handleisPregnantClick() {
    Alert.alert(
      this.state.visit.patient,
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
  }
  onRefresh() {
    this.setState(
      { refreshing: true },
      () => setTimeout(() => this.setState({ refreshing: false }), 2000),
    );
  }
  canEdit(name) {
    return this.props.role === 'admin' ? !name.immutable : false;
  }
  render() {
    const visitSections = this.props.visitType === 'icsi' ? Object.keys(sections) : ['Personal'];
    return (
      <View
        refreshControl={
          <RefreshControl
            tintColor="white"
            colors={['white', 'green', 'red', 'yellow']}
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />}
        onLayout={event => this.setState({ width: (event.nativeEvent.layout.width * 0.5) - 20 })}
        style={[styles.card, this.props.style, { flex: 1, backgroundColor: 'rgba(144,75,120,.6)', padding: 0, margin: -10 }]}
      >
        <View style={[styles.row, { marginHorizontal: 20 }]}>
          <View style={{ borderColor: 'purple', borderWidth: 1, flex: 1, alignItems: 'center' }}>
            <Text style={{ color: 'grey' }}>State</Text>
            <Text style={{ height: 10 }} />
            <Text style={{ color: 'purple' }}>{this.state.visit.status}</Text>
          </View>
          <TouchableOpacity style={{ flex: 1 }} onPress={this.handleisPregnantClick}>
            <View style={{ borderColor: 'purple', borderWidth: 1, flex: 1, alignItems: 'center' }}>
              <Text style={{ color: 'grey' }}>Pregnancy</Text>
              <Text style={{ height: 10 }} />
              <Text style={{ color: 'purple' }}>{this.state.visit.is_pregnant === 1 ? 'Yes' : 'No'}</Text>
            </View>
          </TouchableOpacity>
          <View style={{ borderColor: 'purple', borderWidth: 1, flex: 1, alignItems: 'center' }}>
            <Text style={{ color: 'grey' }}>Date</Text>
            <Text style={{ color: 'purple' }}>{moment(this.state.visit.day).format('DD-MM-YYYY')}</Text>
            <Text style={{ color: 'purple' }}>{timeToHuman(this.state.visit.slot)}</Text>
          </View>
        </View>
        <ScrollView style={{ flex: 1 }}>
          {visitSections.map(i => (<View key={i}><TouchableOpacity style={[styles.row, { backgroundColor: 'rgba(0,188,183,1)', padding: 10, marginVertical: 10 }]} onPress={() => this.setState({ showSection: this.state.showSection === i ? null : i })}>
            <Text style={[{ flex: 1, fontSize: 20, color: 'white', textAlign: 'center' }]}>{i}</Text>
            <Text style={{ color: 'white' }}>{this.state.showSection === i ? 'close' : 'open'}</Text>
          </TouchableOpacity>
            {this.state.showSection === i && (
            <View>
              {sections[i].filter(ix => !ix.hidden)
                .map(name => (<View key={i + name.name} style={[styles.row, { borderWidth: 1, borderColor: 'purple' }]}>
                  <View style={{ overflow: 'hidden', borderRightWidth: 1, borderColor: 'purple', padding: 10, width: 100 }}>
                    <Text style={[styles.label, { flex: 1, textAlign: 'left' }]}>{name.label}</Text>
                  </View>
                  <TextInput
                    multiline={name.multiline}
                    editable={this.canEdit(name)}
                    style={[styles.label, { flex: 1, textAlign: 'center', padding: 10, color: name.immutable ? 'grey' : 'purple' }]}
                    defaultValue={String(name.value ? name.value(this.props, this.state) : (this.state.visit.get(name.name) || ''))}
                    onChangeText={e => this.update(name.name, e)}
                  />
                </View>))}
            </View>)}
          </View>))}
        </ScrollView>
      </View>
    );
  }
}


const mapStateToProps = (store, props) => {
  const visit = store.getIn(['visits', 'cards', String(props.id)]);
  return {
    visit,
    role: selectAppUserRole(store),
    users: selectUsers(store),
    room: {},
    visitType: String(visit.type).toLowerCase(),
  };
};

const act = dispatch => ({
  dispatch,
  visitData: id => dispatch({ type: id }),
});

CreatePage.displayName = 'Visit List';
CreatePage.propTypes = {
  visit: PropTypes.instanceOf(Record).isRequired,
  users: PropTypes.instanceOf(Map).isRequired,
  role: PropTypes.string.isRequired,
  navigator: PropTypes.shape({
    pop: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    setOnNavigatorEvent: PropTypes.func.isRequired,
    toggleTabs: PropTypes.func.isRequired,
  }).isRequired,
};
CreatePage.defaultProps = ({
  visitType: 'icsi', // String(this.props.visitType).toLowerCase()
  visit: Map({}),
});

export default connect(mapStateToProps, act)(CreatePage);
