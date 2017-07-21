import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

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

import {bindActionsToDispatch} from '../tools';
import * as selectors from '../selectors';
import * as actions from '../actions';
import {UserShape} from '../users/reducer';
import {api} from '../api';
const {width,height} = Dimensions.get('window');



class LoginApp extends Component {
  constructor(props){
      super(props);
      this.state = {
        error:[],
        moveOut: false,
        loading:false 
      };
      this.timeout = 0;
      this.login = this.login.bind(this);
      this.onSuccess = this.onSuccess.bind(this)
      //SocialAuth.setFacebookApp({id: '1301593236623308', name: 'Madina Women Hospital ICSI'});
  }

  componentWillMount() {
    api.setHeader('Authorization','Bearer ' + String(this.props.user.token));
  }
  componentWillUnmount() {
    clearTimeout(this.timeout);
  }
  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  login(){
    const {username, password} = this.state;
    let fb = {userId:null, accessToken:null};
    this.setState({loading:1});
    let promise;
    if(this.state.nofacebook){
      if(!username || !password)return this.setState({loading:-1, error:['please enter your username and password','or use facebook if you have do have an invitation']});
      promise = this.props.attemptLogin({username, password})
    } else {
      return SocialAuth.getFacebookCredentials(['public_profile','email','user_work_history'], SocialAuth.facebookPermissionsType.read)
        .then(r=>this.props.attemptLogin(r))
        .then(this.onSuccess)
        .catch(this.onSuccess)
    }
    console.log(promise);
    promise.then(this.onSuccess).catch(this.onSuccess);
  }
  onSuccess(r){
      if(r.ok && r.data && r.data.token && r.data.id){
        api.setHeader('Authorization','Bearer '+r.data.token);
        this.props.addUser(r.data);
        this.refs.circ.transitionTo({scale:100},1500)
        this.timeout = setTimeout(()=>this.props.setAppUser(r.data.id),2000);
        return this.setState({loading:false,success:true, error:''});
      }
      console.log('Error !',r);
      this.setState({
        loading:-1,
        error: [].concat(r.message, r.data && r.data.message),
      })
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


          {this.state.loading===-1  &&<View style={{display:'flex',flexDirection:'column',maxHeight:200,'overflow':'scroll'}}>
            <Text style={[{textAlign:'center',fontSize:15,color:'red'}]}> Login failed </Text>
            {Array.isArray(this.state.error) && this.state.error.map((e,i)=><Text style={[{textAlign:'center',fontSize:15,color:'white'}]} key={`error_${i}`}>{JSON.stringify(e)}</Text>)}
          </View>}

          {this.state.loading===1 && <ActivityIndicator color="white" style={{backgroundColor:'transparent',marginTop:15}} /> }



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
            onChangeText={password=>this.setState({error:[],loading:false,password})}
            style={[{flex:1,marginLeft:-40,textAlign:'center'}]}/>
          </View>}



          <TouchableWithoutFeedback  onPress={this.login} style={{}}>
            <View style={{marginTop:20}}>
            <Animatable.View duration={1000} transition="height" style={{backgroundColor:"#3b5998",height:50,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
              <FontAwesome name={this.state.nofacebook ? "power-off" :"facebook"} color="white" size={18}/>
              {!this.state.success &&<Text style={{color:'white',margin:10,fontWeight:'500'}}>
                {this.state.nofacebook ? 'Login with password' : 'Use Facebook to Login'}
              </Text>}
              <Animatable.View ref="circ" duration={1000} transition="width" style={[{backgroundColor:'#3b5998',borderRadius:10,height:10,zIndex:-1,width:10}]} />
            </Animatable.View>
            </View>
          </TouchableWithoutFeedback>

          <View style={{flex:1}} />

          {!this.state.success &&
          <TouchableOpacity style={[{marginTop:15,flexDirection:'row',justifyContent:'center',alignItems:'center'}]} onPress={()=>this.setState({username:'',password:'',error:[], loading:0, nofacebook:!this.state.nofacebook})}>
              <Text style={[styles.btnText,{borderBottomWidth:1,color:'purple',fontSize:16,overflow:'hidden'}]}> {this.state.nofacebook ? 'use ' : "I don't have"} facebook account </Text>
          </TouchableOpacity>}

          </View>
          </View>

          </Image>
    );
  }
}


const passProps = (state, props) =>({
  uid: selectors.selectAppUserId(state),
  user: selectors.selectAppUser(state),
})

const mapActions = dispatch => bindActionsToDispatch(['attemptLogin','addUser','setAppUser'],actions,dispatch)

LoginApp.propTypes = {
  uid: PropTypes.string,
  user: PropTypes.instanceOf(UserShape),
  dispatch: PropTypes.func.isRequired,
  attemptLogin: PropTypes.func.isRequired,
  addUser: PropTypes.func.isRequired,
  setAppUser: PropTypes.func.isRequired,
};
LoginApp.displayName = 'LoginApp';
LoginApp.defaultProps = ({
  uid: 0,
  user: new UserShape({})
})


export default connect(passProps, mapActions)(LoginApp);

