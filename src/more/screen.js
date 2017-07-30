import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator, Image,
  Dimensions, Modal, KeyboardAvoidingView,
  ScrollView, TouchableOpacity, TextInput, Button, Platform,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { openLink } from '../tools';
import { api } from '../api';
import * as appSelectors from '../selectors';
import ImageSrd from '../assets/images/location.png';

const { width, height } = Dimensions.get('window');
const innerWidth = width - 20;

class MoreScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { modalVisible: false,
      images: {},
      codes: [],
      info: [
        { label: 'Phone', value: '16814', link: 'tel:16814' },
      ],
      loading: true };
    this.post = this.post.bind(this);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }
  onNavigatorEvent(event) {
    console.log('Navigation from %cMoreScreen', 'color:green;font-size:16px;', event);
    switch (event.id) {
      case 'bottomTabSelected':
        // screen selected
        break;
      case 'logout':
        this.props.logout();
        break;
      default:
        break;
    }
  }
  componentDidMount() {
    if (this.state.loading === false) this.setState({ loading: true });
    this.setState({ loading: false });
    api.get('token/info').then((r) => {
      if (r.ok && Array.isArray(r.data)) {
        this.setState({ info: r.data });
      }
    });
  }
  async post() {
    this.setState({ loading: true });
    const { code, name } = this.state;
    const done = await api.post('/token/code', { code, name });
    this.setState({ loading: false, modalVisible: this.state.modalVisible ? !done.ok : false, codes: Array.isArray(done.data) ? done.data : this.state.codes });
  }
  async delete(item) {
    this.setState({ loading: true });
    const done = await api.delete(`/token/code/${item.code}`);
    if (done.ok) {
      this.setState({ loading: false, codes: this.state.codes.filter(r => r.code !== item.code) });
    } else {
      this.setState({ loading: false });
    }
  }
  render() {
    const codes = Array.isArray(this.state.codes || []) ? this.state.codes : [];
    return (
      <ScrollView style={[styles.container, { backgroundColor: 'rgba(0,0,0,.1)', padding: 10 }]}>

        <View style={{ flexDirection: 'row', height: 20, justifyContent: 'center', position: 'relative', top: 20, alignItems: 'center', zIndex: 1 }}>
          <View style={{ flex: 1 }} />
          <View style={[{ backgroundColor: 'rgba(96,164,205,1)', padding: 10, minWidth: 60, minHeight: 60, borderRadius: width * 0.1, width: width * 0.1, height: width * 0.1 }, styles.center]}>
             <FontAwesome name="map" backgroundColor="blue" color="white" size={33} />
           </View>
          <View style={{ flex: 1 }} />
        </View>

        <View style={[styles.card, { borderRadius: 10, overflow: 'hidden', elevation: 10 }]}>

          <TouchableOpacity onPress={() => openLink(Platform.OS !== 'ios' ? 'geo:31.2104889,29.9387942' : 'http://maps.apple.com/?ll=31.2104889,29.9387942')}>
             <Image resizeMode={'stretch'} style={{ width: innerWidth, height: 200, marginBottom: 20 }} source={ImageSrd} />
           </TouchableOpacity>

          <TouchableOpacity onPress={() => openLink(Platform.OS !== 'ios' ? 'geo:31.2104889,29.9387942' : 'http://maps.apple.com/?ll=31.2104889,29.9387942')}>
             <View style={styles.row}>
              <Text style={styles.label}>Address</Text>
              <Text style={styles.value}>
              25 El-Shaheed Kamal El-Deen Salah,
                <Text>Semouha, Alexandria</Text>
              </Text>
            </View>
           </TouchableOpacity>

          <View style={styles.hr} />
          {this.state.info.map((item, key) => (<View key={`info${key}`}>
             <View style={styles.row}>
              <Text style={styles.label}>{item.label}</Text>
              <TouchableOpacity style={{ flex: 1 }} onPress={() => openLink(item.link)}>
                <Text style={styles.value}>{item.value}</Text>
              </TouchableOpacity>
            </View>

             <View style={styles.hr} />
           </View>))}

          {/* IMAGE*/}

          <View style={[styles.row, styles.center]}>
             <TouchableOpacity onPress={openLink.bind(this, 'https://www.facebook.com/madinawomen/')}>
              <View style={{ height: 30, padding: 15, backgroundColor: '#3b5998', overflow: 'hidden', borderRadius: 30, height: 50, width: 50, justifyContent: 'center', alignItems: 'center' }}>
                <FontAwesome name="facebook" style={{ fontSize: 22, color: 'white' }} onPress={this.loginWithFacebook} />
              </View>
            </TouchableOpacity>
           </View>

        </View>

        {this.props.role === 'admin' &&
        <View style={[styles.card, { borderRadius: 10, overflow: 'hidden', elevation: 10, minHeight: 500 }]}>
           <View style={styles.row}>
             <Text style={styles.h1}>Invitations</Text>
           </View>
           <View style={[{ flexDirection: 'row', margin: 0, borderWidth: 1, borderColor: 'purple' }]}>
             <View style={{ margin: 0, overflow: 'hidden', borderRightWidth: 1, borderColor: 'purple', padding: 10, width: 100 }}>
               <Text style={[styles.label, { flex: 1, fontSize: 12, textAlign: 'left' }]}>Code</Text>
             </View>
             <View style={{ margin: 0, overflow: 'hidden', borderRightWidth: 1, borderColor: 'purple', padding: 10, width: 100 }}>
               <Text style={[styles.label, { flex: 1, fontSize: 12, textAlign: 'left' }]}>Restrict</Text>
             </View>
             <View style={{ margin: 0, overflow: 'hidden', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
               <Button onPress={() => this.setState({ modalVisible: true })} title="request new" />
             </View>
           </View>
           {this.state.loading && <ActivityIndicator />}
           {codes.map(item => (<View key={item.code} style={[{ flexDirection: 'row', margin: 0, borderBottomWidth: 1, borderColor: 'purple' }]}>
             <View style={{ margin: 0, overflow: 'hidden', borderLeftWidth: 1, borderRightWidth: 1, borderColor: 'purple', padding: 10, width: 100 }}>
               <Text style={[styles.label, { flex: 1, fontSize: 12, textAlign: 'left' }]}>{item.code}</Text>
             </View>
             <View style={{ margin: 0, overflow: 'hidden', borderRightWidth: 1, borderColor: 'purple', padding: 10, width: 100 }}>
               <Text style={[styles.label, { flex: 1, fontSize: 12, textAlign: 'left' }]}>{item.name || '-'}</Text>
             </View>
             <View style={{ borderRightWidth: 1, margin: 0, overflow: 'hidden', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
               <Button color="red" onPress={() => this.delete(item)} title="delete" />
             </View>
           </View>))}
         </View>
        }
        {this.props.role === 'admin' &&
        <Modal
           animationType={'slide'}
           transparent
           visible={Boolean(this.state.modalVisible)}
           onRequestClose={() => this.setState({ modalVisible: false })}
         >
           <TouchableOpacity style={{ flex: 1, padding: 20, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center' }} onPress={() => this.setState({ modalVisible: false })}>
             <KeyboardAvoidingView behavior={'position'} style={{ backgroundColor: 'white', padding: 10, borderRadius: 10 }}>
               <Text style={styles.label}>Create new invitation</Text>

               <TextInput placeholder="invitation code" onChangeText={code => this.setState({ code })} style={styles.input} />
               <TextInput onChangeText={name => this.setState({ name })} placeholder="name restriction" style={styles.input} />

               <TouchableOpacity onPress={this.post} style={[styles.btn, { marginHorizontal: 30, marginTop: 30, backgroundColor: 'purple' }]}>
                 {this.state.loading && <ActivityIndicator color="white" />}
                 <Text style={[styles.btnText, { color: 'white' }]}>Create invitation </Text>
               </TouchableOpacity>
             </KeyboardAvoidingView>
           </TouchableOpacity>
         </Modal>}

      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  btnText: {
    color: 'purple',
  },
  hr: {
    height: 2,
    backgroundColor: 'purple',
    margin: 10,
  },
  btn: {
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    borderWidth: 1,
    borderColor: 'purple',
    borderRadius: 1,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  input: {
    height: 40,
    borderColor: 'purple',
    borderWidth: 1,
    marginVertical: 5,
    borderRadius: 5,
    paddingLeft: 15,
    backgroundColor: 'rgba(237,237,237,1)',
  },
  icon: {
    backgroundColor: 'transparent',
    borderRadius: (width * 0.1) + 10,
    top: (width * 0.1) + 10,
    zIndex: 10,
    flexDirection: 'row',
  },
  value: {
    color: 'purple',
    fontWeight: '200',
    textAlign: 'right',
    flex: 1,
    marginRight: 20,
  },
  label: {
    color: 'purple',
    fontWeight: 'bold',
    marginRight: 20,
  },
  h1: {
    color: 'purple',
    margin: 10,
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 20,
    flex: 1,
  },
  map: {
    height: 400,
  },
  row: {
    flexDirection: 'row',
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    margin: 10,
    paddingBottom: 50,
    elevation: 10,
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

const stateToProps = (state, props) => ({
  role: appSelectors.selectAppUserRole(state),
});

export default connect(stateToProps)(MoreScreen);
