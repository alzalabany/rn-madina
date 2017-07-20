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
  ActivityIndicator,LayoutAnimation,
  Button,ScrollView
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import styles from './styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SocialAuth from 'react-native-social-auth';
import bg from '../../assets/images/bg 2.png';
import logo from '../../assets/images/logo.png';
import user from '../../assets/images/userIcon.png';
import pass from '../../assets/images/passwordIcon.png';
import lgnbtn from '../../assets/images/btnBg.png';
import {api} from '../api';
import {LOGIN, loginSuccess} from '../common/actions';
import T from '../common/types';
import {connect} from 'react-redux';

const {width,height} = Dimensions.get('window');



class LoginApp extends Component {
  constructor(props){
      super(props);
      this.state = {
        error:[],
        moveOut: false,
        loading:false };
      this.login = this.login.bind(this);
      this.onSuccess = this.onSuccess.bind(this)
      //SocialAuth.setFacebookApp({id: '1301593236623308', name: 'Madina Women Hospital ICSI'});
  }

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }
  componentWillReceiveProps(props){
    if(this.props.loading !== props.loading){
      this.setState({loading:Boolean(props.loading)});
    }
    if(props.success===true && props.loading > 0){
      this.onSuccess(props.loading);
    }
  }
  async login(){
    const {username, password} = this.state;
    let fb = {userId:null, accessToken:null};

    if(this.state.nofacebook){
      if(!username || !password)return this.setState({error:['please user you username and password','or use facebook if you have an invitation']});
    } else {
      fb = await SocialAuth.getFacebookCredentials(['public_profile','email','user_work_history'], SocialAuth.facebookPermissionsType.read);
    }

      api.dispatch(LOGIN({
        username,
        password,
        fb_id: fb.userId,
        token: fb.accessToken,
      }));
  }
  onSuccess(data){
      this.refs.circ.transitionTo({scale:100},1500)
      setTimeout(()=>api.dispatch({type:'SET_STATE',path:['user_id'],payload:data}),2000);
      this.setState({loading:false,success:true, error:''});
  }
  render() {
    let scale = {transform: [{scale: 1}]};
    return (
          <Image source={bg} style={{
          height:height,
          width,
          resizeMode:'cover'}} >

          <View style={{flex:2,alignItems:'center',justifyContent:'center'}}>
          <Animatable.View animation="zoomInDown" duration={2000} style={[{elevation:4, display:'flex',alignItems:'center',justifyContent:'center',zIndex:99,borderRadius:width*.66,elevation:10,height:width*.66,width:width*.66,marginTop:20},styles.shadow]}>
            <Image source={logo} style={{resizeMode:'contain',height:width*.6,width:width*.6,marginTop:-15}}/>
          </Animatable.View>
          </View>

          <View style={{flex:2,justifyContent:'flex-end',flexDirection:'column',marginBottom:height*.1}}>
          <View style={[styles.box,{paddingBottom:0,overflow:'hidden'}]} >


          {this.props.loading===-1  &&<Text style={[{textAlign:'center',fontSize:15,color:'red'}]}>
            Login failed
          </Text>}

          {this.props.loading===1 && <ActivityIndicator color="white" style={{backgroundColor:'transparent',marginTop:15}} /> }



          <View style={[styles.btnbox,{marginBottom:0}]}>
          <FontAwesome name="envelope-o" color="purple" size={18}/>
          <TextInput
            blurOnSubmit={true}
            autoFocus={false}
            placeholder={this.state.nofacebook ? 'Username' : 'Invitation code'}
            returnKeyType="next"
            autoCorrect={false}
            value={this.state.username}
            underlineColorAndroid='rgba(0,0,0,0)'
            onSubmitEditing={()=>this.refs.pwd && this.refs.pwd.focus()}
            onChangeText={username=>this.setState({error:[],username:username.toLowerCase()})}
            style={[{flex:1,marginLeft:-40,textAlign:'center'}]}/>
          </View>

          {this.state.nofacebook && <View style={[styles.btnbox,{marginBottom:0}]}>
          <FontAwesome name="lock" color="purple" size={18}/>
          <TextInput ref="pwd"
          blurOnSubmit={true}
            autoFocus={false}
            secureTextEntry={true}
            value={this.state.password}
            placeholder=' Password'
            returnKeyType="go"
            underlineColorAndroid='rgba(0,0,0,0)'
            onSubmitEditing={this.login}
            onChangeText={password=>this.setState({error:[],loadgin:false,password})}
            style={[{flex:1,marginLeft:-40,textAlign:'center'}]}/>
          </View>}



          <TouchableWithoutFeedback  onPress={this.login} style={{}}>
            <View style={{marginTop:20}}>
            <Animatable.View duration={1000} transition="height" style={{backgroundColor:"#3b5998",height:50,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
              <FontAwesome name={this.state.nofacebook ? "power-off" :"facebook"} color="white" size={18}/>
              {!this.state.success &&<Text style={{color:'white',margin:10,fontWeight:'500'}}>
                {this.state.nofacebook ? 'Login with password' : 'Register or Login with Facebook'}
              </Text>}
              <Animatable.View ref="circ" duration={1000} transition="width" style={[{backgroundColor:'#3b5998',borderRadius:10,height:10,zIndex:-1,width:10}]} />
            </Animatable.View>
            </View>
          </TouchableWithoutFeedback>

          <View style={{flex:1}} />

          {!this.state.success &&
          <TouchableOpacity style={[{marginTop:15,flexDirection:'row',justifyContent:'center',alignItems:'center'}]} onPress={()=>this.setState({username:'',password:'',nofacebook:!this.state.nofacebook})}>
              <Text style={[styles.btnText,{borderBottomWidth:1,color:'purple',fontSize:16,overflow:'hidden'}]}> {this.state.nofacebook ? 'use ' : "I don't have"} facebook account </Text>
          </TouchableOpacity>}

          </View>
          </View>

          </Image>
    );
  }
}



const p = (state, props) =>({
  loading: state.getIn(['api','LOGIN']),
  success: Boolean(state.getIn(['users',state.getIn(['api','LOGIN']),'id'])),
  uid: state.getIn(['users',state.user_id,'id']),
  //loading:{},
})

export default connect(p)(LoginApp);
