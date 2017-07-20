import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import * as actions from '../common/actions';
import {
  StyleSheet,Image,
  Text,
  View,
  ActivityIndicator,
  Dimensions,Modal,KeyboardAvoidingView,
  ScrollView,TouchableOpacity,TextInput
} from 'react-native';
import RImage from '../../components/Image';
import ListView from '../../components/ListView';
// import {openLink} from '../tools';
import bg from '../../assets/images/bg 2.png';
import {iconsMap} from '../icons';
import {Iterable} from 'immutable';

const {width,height} = Dimensions.get('window');

const innerWidth = width-20;

function checkURL(url) {
    return(url.match(/\.(jpeg|jpg|gif|png)/) != null);
}

var matcher = /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/;
/**
 * Loosely validate a URL `string`.
 *
 * @param {String} string
 * @return {Boolean}
 */
const showDate = post => {
  d = moment((post.created_at+'000')/1);
  if(d.isValid())return 'posted on: '+d.calendar().split(' at')[0];
  return null
}
class Blog extends Component {
    constructor(props){
      super(props);
      this.state = {modalVisible:false,images:{},loading:true,keys:Iterable.isIterable(this.props.blog) ? this.props.blog.keySeq().toArray() : []};
      this.debounce = 0;
      this.props.navigator.setOnNavigatorEvent((event)=>(event.type == 'NavBarButtonPress' && event.id==='logout') && this.props.logout());
  }
  componentWillReceiveProps(props){
    if(this.props.blog !== props.blog){
        this.setState({keys:Iterable.isIterable(props.blog) ? props.blog.keySeq().toArray() : []})
    }
  }
  componentWillUnmount(){
    clearTimeout(this.debounce);
  }
  async componentDidMount(){
    this.isMounted = true;
    if(this.state.loading===false)this.setState({loading:true});
    await this.props.getPosts({max_id:0, min_id:0, count:20});
    clearTimeout(this.debounce);
    this.debounce = setTimeout(() => this.props.markAsOld(this.state.keys), 9000);
    this.setState({loading:false})
  }
  cardText(rtl){
    return {
      padding:10,
      textAlign:rtl?'right':'left'
    }
  }
  delete(post){
    if(this.state.deleting!==post.id)return this.setState({deleting:post.id});
    this.setState({isDeleting:post.id})
    this.props.deletePost(post).then(r=>this.setState({isDeleting:null}))
  }
  open(){
     this.props.navigator.showModal({
      screen: "ivf.create.blog" , // unique ID registered with Navigation.registerScreen
      title: "create new post", // title of the screen as appears in the nav bar (optional)
      passProps: {
        role:this.props.role,
        post:this.props.post,
        goBack: this.props.navigator.dismissAllModals({animationType: 'slide-down'}),
      },
      navigatorStyle: {
        navBarHidden:true
      }, // override the navigator style for the screen, see "Styling the navigator" below (optional)
      navigatorButtons: {
        leftButtons: [
        {
          icon: iconsMap['ios-arrow-back'], // for icon button, provide the local image asset name
          id: 'back', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
          buttonColor: 'white',
          disableIconTint: true,
        }
        ]
      }, // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
      animationType: 'slide-up' // 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
    });
  }
  render() {
    const keys = Array.isArray(this.state.keys) ? this.state.keys : [];
    this.props.navigator.setTabBadge({
          tabIndex: 0, // (optional) if missing, the badge will be added to this screen's tab
          badge: keys.length
        });
    return (
      <View style={[styles.container]}>
        <ListView
          refreshing={this.state.loading}
          renderHeader={()=>this.props.role==='admin' ? <TouchableOpacity style={styles.btn} onPress={this.open.bind(this)}>
            <Text style={styles.btnText}>Post something new {this.props.role}</Text>
          </TouchableOpacity>:null}
          renderSeparator={false}
          onRefresh={this.componentDidMount.bind(this)}
          dataSource={ds=>ds.cloneWithRows(this.props.blog.toJS())}
          renderRow={(post) => <View style={[styles.card,styles.unread]}>
          {checkURL(post.link) &&
            <RImage resizeMode={'stretch'} width={innerWidth} uri={String(post.link)} onFail={()=>this.setState({images:Object.assign({},this.state.images,{[post.id]:true})})} />
          }
          {String(post.title||'').length > 2 && <Text writingDirection="auto" style={[{fontWeight:'bold',fontSize:18},this.cardText(/[\u0600-\u06FF]/.test(post.body))]}>
          {post.title}.
          </Text>}
          <Text writingDirection="auto" style={this.cardText(/[\u0600-\u06FF]/.test(post.body))}>
          {post.id}
          {post.body}
          </Text>
          {!!Boolean(this.state.images[post.id] && matcher.test(post.link)) && <TouchableOpacity onPress={()=>openLink(post.link)} style={styles.btn}>
            <Text style={styles.btnText}>open link</Text>
          </TouchableOpacity>}

          <Text writingDirection="auto" style={[{fontWeight:'bold',fontSize:12,color:'grey'}]}>
          {showDate(post)}
          </Text>

          {!!Boolean(this.props.role==='admin') && <TouchableOpacity onPress={this.delete.bind(this,post)} style={[styles.btn,{backgroundColor:'red'}]}>
            {this.state.isDeleting===post.id && <ActivityIndicator color="white" />}
            <Text style={[styles.btnText,{color:'white'}]}>
              {this.state.deleting===post.id? 'are you sure ?' : 'delete post'}
            </Text>
          </TouchableOpacity>}

        </View>} />
        {this.props.role==='admin' && <Modal
          animationType={"slide"}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => this.setState({modalVisible:false})}
          >

        </Modal>}
      </View>
    );
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
const stateToProps = (state,props) => ({
  role: state.getIn(['users',state.user_id,'role']),
  blog: state.get('blog'),
});
const actionsToProps = (dispatch) => ({
  dispatch,
  markAsOld: keys => dispatch(actions.markAsOld(keys)),
  post:data=>dispatch(actions.CREATEABLOGPOST(data)),
  deletePost:data=>dispatch(actions.DELETEABLOGPOST(data.id)),
  getPosts:data=>dispatch(actions.GETNEWBLOGS(data)),
})

export default connect(stateToProps,actionsToProps)( Blog );
