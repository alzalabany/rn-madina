import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Map } from 'immutable';

import { iconsMap } from '../icons';

import * as appSelectors from '../selectors';
import { selectors, actions, PostShape } from './ducks';

import { makeDefault } from '../tools';
import Post from './Post';

const PostRecord = makeDefault(new PostShape({}), PostShape);

class Blog extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: false };
    this.debounce = 0;

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }
  onNavigatorEvent(event) {
    console.log('Navigation from %cBlogScreen', 'color:blue;font-size:16px;', event.id);
    switch (event.id) {
      case 'bottomTabSelected':
        // screen selected
        break;
      case 'didAppear':
        // @@todo FlatList scroll to top.
        if (this.props.blog && this.props.blog.keySeq && this.props.blog.size === 0) {
          if (!this.state.loading) this.setState({ loading: true });
          this.props.download().finally((r) => {
            if (this.state.loading) this.setState({ loading: false });
          });
        } else {
          this.props.download();
        }
        break;
      case 'logout':
        this.props.logout();
        break;
      default:
        break;
    }
  }
  shouldComponentUpdate(state, props) {
    if (
      state.loading !== this.state.loading ||
      props.role !== this.props.role ||
      props.blog !== this.props.blog
    ) return true;

    return false;
  }

  open() {
    this.props.navigator.showModal({
      screen: 'ivf.create.blog', // unique ID registered with Navigation.registerScreen
      title: 'create new post', // title of the screen as appears in the nav bar (optional)
      passProps: {
        role: this.props.role,
        post: this.props.post,
        goBack: this.props.navigator.dismissAllModals({ animationType: 'slide-down' }),
      },
      navigatorStyle: {
        navBarHidden: true,
      }, // override the navigator style for the screen, see "Styling the navigator" below (optional)
      navigatorButtons: {
        leftButtons: [
          {
            icon: iconsMap['ios-arrow-back'], // for icon button, provide the local image asset name
            id: 'back', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
            buttonColor: 'white',
            disableIconTint: true,
          },
        ],
      }, // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
      animationType: 'slide-up', // 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
    });
  }

  render() {
    const blog = (this.props.blog && this.props.blog.keySeq) ? this.props.blog : Map({});
    const keys = blog.keySeq().toArray().map(String);

    if (this.state.loading) return <ActivityIndicator style={{ marginTop: 30 }} animating color="purple" size="large" />;
    return (<FlatList
      data={keys}
      renderItem={({ item, index }) => <Post role={this.props.role} post={PostRecord(blog.get(item))} onDelete={this.delete} />}
      keyExtractor={item => blog.getIn([item, 'id']) || (`LOADING_${item}`)}
    />);
  }
}

const passProps = (state, props) => ({
  blog: selectors.selectBlogPosts(state),
  role: appSelectors.selectAppUserRole(state),
});

const mapActions = dispatch => ({
  dispatch,
  download: () => dispatch(actions.download()),
  create: payload => dispatch(actions.createPost(payload)),
  delete: postId => dispatch(actions.removeBlog(postId)),
});

Blog.propTypes = {
  role: PropTypes.string,
  blog: PropTypes.instanceOf(Map).isRequired,
  dispatch: PropTypes.func.isRequired,
  download: PropTypes.func.isRequired,
  create: PropTypes.func.isRequired,
  delete: PropTypes.func.isRequired,
  navigator: PropTypes.shape({ switchToTab: PropTypes.func }).isRequired,
};
Blog.displayName = 'Blog screen';
Blog.defaultProps = ({
  role: 'dr',
});

export default connect(passProps, mapActions)(Blog);
