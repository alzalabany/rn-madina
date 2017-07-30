/* React container RImage	*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Image, View, ActivityIndicator } from 'react-native';

// import { withRouter } from 'react-router-dom';
const noob = () => null;
class RImage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      scale: 0,
      width: 0,
      height: 0,
      layout: { width: 0, height: 0 } };
    this.calc = this.calc.bind(this);
    this.setImage = this.setImage.bind(this);
    this.isLoaded = false;
  }

  setImage() {
    Image.getSize(this.props.source.uri, (width, height) => {
      const scale = this.state.layout.width / width;
      this.setState({ scale, height });
    }, () => {
      this.setState({ failed: true });
    });
  }
  calc({ nativeEvent }) {
    if (nativeEvent.layout.width !== this.state.layout.width) {
      this.setState({ layout: nativeEvent.layout }, this.setImage);
    }
  }
  render() {
    const { scale, layout, height } = this.state;
    if (this.state.failed) return null;
    return (<View onLayout={this.calc} style={[{ backgroundColor: 'rgba(0,0,0,.2)' }, this.props.style]}>
      {!this.state.scale && <ActivityIndicator color="white" size="large" />}
      <Image
        source={this.props.source}
        style={[
          this.state.scale && this.props.style,
          { width: layout.width, height: height * scale },
        ]}
      /></View>);
  }
}


RImage.propTypes = {
  // source: 
};
RImage.displayName = 'RImage';
RImage.defaultProps = ({
  source: { uri: '' },
});

export default RImage;
