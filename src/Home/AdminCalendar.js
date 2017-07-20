import React, { Component } from 'react';
import {
  KeyboardAvoidingView,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ActivityIndicator,
  Button,ScrollView,Modal
} from 'react-native';
import moment from 'moment';
const {width,height} = Dimensions.get('window');
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from 'react-native-modal-datetime-picker';

import {api} from '../api'
import Visits from '../visits/screens';
import {iconsMap} from '../icons';
import {timeToHuman, getRanges} from '../tools';

import green from '../../assets/images/greenbg.png';
import red from '../../assets/images/redbg.png';

const AUser = connect((state,props)=>({user:state.users[props.id]}))(props =>props.render(props.user||{}))

class AdminCal extends Component{
  constructor(props){
    super(props);
    const room = props.room || {starting_hour:8,ending_hour:12,size:30};
    const range = getRanges(room.starting_hour||8,room.ending_hour||8,room.size||30);
    this.state = {
      data : props.data.reduce((all,item)=>(all[item.slot]=item,all),{}),
      range,
      total:range.length,
      busy:props.data.length,
      free: range.length - props.data.length,
      perc: Math.floor((100/range.length)*props.data.length)
    }
  }
  componentWillReceiveProps(props){
    if(this.props.data !== props.data || props.room !== this.props.room){
      const data = props.data.reduce((all,item)=>(all[item.slot]=item,all),{})
      const room = props.room || {starting_hour:8,ending_hour:12,size:30};
      const range = getRanges(room.starting_hour||8,room.ending_hour||8,room.size||30);
      this.setState({data, 
        range,
        total:range.length,
        busy:props.data.length,
        free: range.length - props.data.length,
        perc: Math.floor((100/range.length)*props.data.length)
      });  
    }
    
  }

  render(){
    return (
    <ScrollView onLayout={event=>this.setState({width:(event.nativeEvent.layout.width*.5)-20})} style={{flex:1,backgroundColor:'white',margin:10,marginTop:0}}>
    <View style={styles.rows}>
      <Text style={{flex:1,textAlign:'center',fontWeight:'bold',color:'purple'}}>Total</Text>
      <Text style={{flex:1,textAlign:'center',fontWeight:'bold',color:'purple'}}>Booked</Text>
      <Text style={{flex:1,textAlign:'center',fontWeight:'bold',color:'purple'}}>Free</Text>
      <Text style={{flex:1,textAlign:'center',fontWeight:'bold',color:'purple'}}>per</Text>
    </View>
    <View style={styles.rows}>
      <Text style={{flex:1,textAlign:'center',fontWeight:'bold',color:'purple'}}>{this.state.total}</Text>
      <Text style={{flex:1,textAlign:'center',fontWeight:'bold',color:'purple'}}>{this.state.busy}</Text>
      <Text style={{flex:1,textAlign:'center',fontWeight:'bold',color:'purple'}}>{this.state.free}</Text>
      <Text style={{flex:1,textAlign:'center',fontWeight:'bold',color:'purple'}}>{this.state.perc}%</Text>
    </View>
    <View style={{flexDirection:'row',flexWrap:'wrap',justifyContent:'center'}}>
        {this.state.range.map((i,k)=>this.state.data.hasOwnProperty(i) ? this.render_busy.bind(this)(i,k) : this.render_empty.bind(this)(i,k))}
    </View>
    </ScrollView>);
  }
  openVisit(visit){
     this.props.navigator.push({
      screen: "ivf.EditVisit" , // unique ID registered with Navigation.registerScreen
      title: visit.patient+'\'s Card',
      subtitle:visit.type+ (visit.services ? ' + ' + String(visit.services||'') : ''),
      passProps: {
        id:visit.id
      }, // simple serializable object that will pass as props to the modal (optional)
      })
  }
  bookVisit(time){
     this.props.navigator.showModal({
      screen: "ivf.CreateVisit" , // unique ID registered with Navigation.registerScreen
      title: "Book new Appointement", // title of the screen as appears in the nav bar (optional)
      animationType: 'slide-up', // 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
      passProps:{
        time
      }
    });
  }
  render_empty(i,key){
    return <View key={'block'+key} style={{borderRadius:4,backgroundColor:'transparent',overflow:'hidden',margin:5,height:80,width:this.state.width}}>
      <TouchableOpacity style={{flex:1}} onPress={this.bookVisit.bind(this,i)}>
      <Image style={{flex:1,padding:10,flexDirection:'column'}} source={green} resizeMode="repeat">
      <Text style={styles.time}>{timeToHuman(i)}</Text>
      </Image>
      </TouchableOpacity>
    </View>
  }
  render_busy(i,key){
    return <View key={'block'+key} style={{borderRadius:4,backgroundColor:'transparent',overflow:'hidden',margin:5,height:80,width:this.state.width}}>
      <TouchableOpacity style={{flex:1}} onPress={this.openVisit.bind(this,this.state.data[i])}>
      <Image style={{flex:1,padding:5,flexDirection:'column'}} source={red} resizeMode="repeat">
        <View style={[styles.row,{flex:1}]}>
          <Text style={styles.time}>{timeToHuman(i)}</Text>
        </View>
        <Text style={styles.sub}>{this.state.data[i].patient}</Text>
        
        <AUser id={this.state.data[i].ref_id} render={dr=><Text style={styles.sub}>{dr.fullname}</Text>} />
      </Image>
      </TouchableOpacity>
    </View>
  }

}

const styles = {
  rows:{
    flexDirection:'row',
  },
  time:{
    color:'white',fontSize:22
  },
  sub:{
    color:'white',fontSize:13
  }
}

const p = state => ({})
const a = dispatch => ({dispatch})

export default connect(p,a)(AdminCal);