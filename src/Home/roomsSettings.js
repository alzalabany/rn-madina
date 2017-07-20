import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import {
  StyleSheet,Image,
  Text,
  View,
  ActivityIndicator,
  Dimensions,Modal,KeyboardAvoidingView,
  ScrollView,TouchableOpacity,TextInput
} from 'react-native';

const {width,height} = Dimensions.get('window');

const innerWidth = width-20;

export default class BlogCreate extends Component {
    constructor(props){
      super(props);
      this.state = {modalVisible:false,images:{},loading:false};
      this.debounce = 0;

  }

  cardText(rtl){
    return {
      padding:10,
      textAlign:rtl?'right':'left'
    }
  }
  post(){
    if(this.state.loading)return;
    const post = {link:this.state.link, body:this.state.text}
    this.setState({loading:true})
    this.props.post(post).then(r=>{
      this.props.navigator.dismissAllModals({animationType: 'slide-down'})
    })
  }

render(){
return <TouchableOpacity style={{flex:1,padding:20,backgroundColor:'rgba(0,0,0,0.4)',justifyContent:'center'}} onPress={()=>this.props.navigator.dismissAllModals({animationType: 'slide-down'})} >
    <KeyboardAvoidingView behavior={'position'} style={{backgroundColor:'white',padding:10,borderRadius:10}}>
  <Text style={styles.label}>Create new post</Text>

<TextInput underlineColorAndroid='rgba(0,0,0,0)' placeholder="http://Link for download" onChangeText={link=>this.setState({link})} style={styles.input}/>
<TextInput underlineColorAndroid='rgba(0,0,0,0)' multiline={true} onChangeText={text=>this.setState({text})}  placeholder="Post body" style={[styles.input,styles.multi,this.cardText(/[\u0600-\u06FF]/.test(this.state.text))]}/>

<TouchableOpacity onPress={this.post.bind(this)} style={[styles.btn,{marginHorizontal:30,marginTop:30,backgroundColor:'purple'}]}>
  {this.state.loading && <ActivityIndicator color="white" />}
  <Text style={[styles.btnText,{color:'white'}]}>Create post </Text>
</TouchableOpacity>
</KeyboardAvoidingView>
</TouchableOpacity>
}
}
const styles = StyleSheet.create({
  container:{
    flex:1,
  },
  card:{
    margin:10,
    padding:0,
    borderRadius:4,
    backgroundColor:'white',
    shadowColor: 'black',
      shadowOffset: {
        width: 0,
        height: 8
      },
      shadowRadius: 5,
      shadowOpacity: .60,
      elevation:5
  },
  unread:{
    shadowColor: 'green',
  },

  btnText:{
    color:'purple'
  },
  input:{
    height:40,
    borderColor:'purple',
    borderWidth:1,
    marginVertical:5,
    borderRadius:5,
    paddingLeft:15,
    backgroundColor:'rgba(237,237,237,1)'
  },
  multi:{
    height:100,
  },
  label:{
    color:'purple',
    fontWeight:'500',
    fontSize:33,
    borderBottomWidth:1,
    borderBottomColor:'white',
    marginBottom:20,
    textAlign:'center'
  },
  btn:{
    margin:10,
    justifyContent:'center',
    alignItems:'center',
    height:50,
    borderWidth:1,
    borderColor:'purple',
    borderRadius:1,
    borderRadius:4,
    backgroundColor:'white'
  }
});