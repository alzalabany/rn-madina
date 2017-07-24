import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Record } from 'immutable';

import {
  // Image,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import RImage from '../../components/Image';
import { openLink } from '../tools';
import styles from './styles';

const { width } = Dimensions.get('window');


const innerWidth = width - 20;
function checkURL(url) {
  return (String(url).match(/\.(jpeg|jpg|gif|png)/) != null);
}
/**
 * Loosely validate a URL `string`.
 *
 * @param {String} string
 * @return {Boolean}
 */
const showDate = (createdAt) => {
  const d = moment((`${createdAt}000`) / 1);
  if (d.isValid()) return `posted on: ${d.calendar().split(' at')[0]}`;
  return null;
};

const matcher = /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/;
const cardText = rtl => ({
  padding: 10,
  textAlign: rtl ? 'right' : 'left',
});
class Post extends React.PureComponent {
  async delete() {
    const id = this.props.post.id;
    if (this.state.showConfirmation !== id) {
      return this.setState({ showConfirmation: id });
    }

    this.setState({ isDeleting: id });
    const x = await this.props.onDelete(id);
    this.setState({ isDeleting: false, showConfirmation: false });
  }
  render() {
    const { post } = this.props;
    return (
      <View style={[styles.card, styles.unread]}>
        <RImage resizeMode={'stretch'} width={innerWidth} uri={String(post.link)} />
        {String(post.title || '').length > 2 && (
          <Text writingDirection="auto" style={[{ fontWeight: 'bold', fontSize: 18 }, cardText(/[\u0600-\u06FF]/.test(post.body))]}>
            {post.title}.
          </Text>
        )}
        <Text writingDirection="auto" style={cardText(/[\u0600-\u06FF]/.test(post.body))}>
          {post.body}
        </Text>

        {!!matcher.test(post.link) && <TouchableOpacity onPress={() => openLink(post.link)} style={styles.btn}>
          <Text style={styles.btnText}>open link</Text>
        </TouchableOpacity>}

        <Text writingDirection="auto" style={[{ fontWeight: 'bold', fontSize: 12, color: 'grey' }]}>
          {showDate(post.created_at)}
        </Text>

        {!!(this.props.role === 'admin') && <TouchableOpacity onPress={this.delete.bind(this)} style={[styles.btn, { backgroundColor: 'red' }]}>
          {this.state.isDeleting === post.id && <ActivityIndicator color="white" />}
          <Text style={[styles.btnText, { color: 'white' }]}>
            {this.state.showConfirmation === post.id ? 'are you sure ?' : 'delete post'}
          </Text>
        </TouchableOpacity>}

      </View>
    );
  }
}

Post.propTypes = {
  post: PropTypes.instanceOf(Record).isRequired,
};
Post.displayName = 'Blog Post box';
Post.defaultProps = ({
  post: {},
});

export default Post;
