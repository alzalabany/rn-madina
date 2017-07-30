import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Record } from 'immutable';

import {
  Text,
  View,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
// react-native-fs
// import CacheableImage from '../../components/Image';
import { openLink } from '../tools';
import styles from './styles';
import Image from '../components/Image';

class Post extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { deleting: false };
  }
  render() {
    const { post } = this.props;
    const isLink = !!String(post.link).match(/^[a-z]{3,10}:\/\//i);
    const isImage = !!String(post.link).match(/^[a-z]{3,10}:\/\/.*\.(jpg|jpeg|png|gif)/i);

    return (
      <View style={[styles.card, styles.unread]}>
        {isImage && <Image
          style={{ minHeight: 100, minWidth: 100 }}
          resizeMode={'stretch'}
          source={{ uri: String(post.link) }}
        />}

        {String(post.title || '').length > 2 && (
          <Text writingDirection="auto" style={[{ fontWeight: 'bold', fontSize: 18, padding: 10, textAlign: /[\u0600-\u06FF]/.test(post.body) && 'right' }]}>
            {post.title}.
          </Text>
        )}
        <Text writingDirection="auto" style={{ padding: 10, textAlign: /[\u0600-\u06FF]/.test(post.body) && 'right' }}>
          {post.body}
        </Text>
        <Text writingDirection="auto" style={[{ fontWeight: 'bold', fontSize: 12, color: 'grey' , textAlign: 'center' }]}>
          {isNaN(Date.parse(post.created_at || '')) ? null : `Posted on: ${moment(post.created_at).calendar()}`}
        </Text>
        {isLink && <TouchableOpacity onPress={() => openLink(post.link)} style={styles.btn}>
          <Text style={styles.btnText}>open link</Text>
        </TouchableOpacity>}

        {!!(this.props.role === 'admin') && (
          <TouchableOpacity onPress={() => false} style={[styles.btn, { backgroundColor: 'red' }]}>
            {this.state.isDeleting && <ActivityIndicator color="white" />}
            <Text style={[styles.btnText, { color: 'white' }]}> Delete post </Text>
          </TouchableOpacity>
        )}

      </View>
    );
  }
}

Post.propTypes = {
  post: PropTypes.instanceOf(Record).isRequired,
  role: PropTypes.string.isRequired,
};
Post.displayName = 'Blog Post box';
Post.defaultProps = ({
  post: {},
  role: 'N/A',
});

export default Post;
