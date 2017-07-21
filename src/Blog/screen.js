import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import {Iterable, Map} from 'immutable';
import {
  StyleSheet,
  Image,
  FlatList,
  Text,
  View,
  ActivityIndicator,
  Dimensions,Modal,KeyboardAvoidingView,
  ScrollView,TouchableOpacity,TextInput
} from 'react-native';
import RImage from '../../components/Image';
import ListView from '../../components/ListView';
import bg from '../../assets/images/bg 2.png';
import {iconsMap} from '../icons';

import * as appSelectors from '../selectors';
import {selectors, actions} from './ducks';
const {width,height} = Dimensions.get('window');
import styles from './styles';
import Post from './Post';

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
      this.state = {
        modalVisible:false,
        images:{},
        loading:true,
        keys: Iterable.isIterable(this.props.blog) ? this.props.blog.keySeq().toArray() : []
      };
      this.debounce = 0;
      props.navigator.setTabBadge({
        tabIndex: 0, // (optional) if missing, the badge will be added to this screen's tab
        badge: this.props.count||0
      });
      this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }
  onNavigatorEvent(event){
    if(event.id==='logout'){
      this.props.logout();
    }
  }
  componentWillReceiveProps(props){
    if(this.props.blog !== props.blog){
        this.setState({
          keys:Iterable.isIterable(props.blog) ? props.blog.keySeq().toArray() : []
        })
    }
      if(this.props.count !== props.count){
        props.navigator.setTabBadge({
          tabIndex: 0, // (optional) if missing, the badge will be added to this screen's tab
          badge: props.count||0
        });
      }
  }
  componentWillUnmount(){
    clearTimeout(this.debounce);
  }
  componentDidMount(){
    this.isMounted = true;
    this.setState({loading:true});
    this.props.blogRead({max_id:0, min_id:0, count:20}).then(r=>{
      if(r.ok && r.data) this.props.addBlog(r.data);
      this.setState({loading:false})
    });
    clearTimeout(this.debounce);
    this.debounce = setTimeout(() => this.props.blogMarkAsOld(this.state.keys), 9000);
    
    
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
    const keys = (Array.isArray(this.state.keys) ? this.state.keys : []).map(String);
    const blog = (this.props.blog && this.props.blog.get) ? this.props.blog : Map({});
    
    return <FlatList 
              data={keys}
              renderItem={({ item, index }) =><Post role={this.props.role} post={blog.get(item)} onDelete={this.delete} />}
              keyExtractor={item=>blog.getIn([item,'id'])||('LOADING_'+item)}
            />
  }
}

const passProps = (state, props) =>({
  blog: selectors.selectBlogPosts(state),
  count: selectors.selectNewPostsLength(state),
  role: appSelectors.selectAppUserRole(state),
})

const mapActions = dispatch => ({
  dispatch,
  ...bindActionCreators(actions,dispatch),
})

Blog.propTypes = {
  role: PropTypes.oneOf(PropTypes.string,PropTypes.bool).isRequired,
  dispatch: PropTypes.func.isRequired,
  blogRead: PropTypes.func.isRequired,
  createPost: PropTypes.func.isRequired,
  addBlog: PropTypes.func.isRequired,
  blogMarkAsOld: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired,
};
Blog.displayName = 'Blog screen';
Blog.defaultProps = ({
  role: 'dr',
})

export default connect(passProps, mapActions)(Blog);