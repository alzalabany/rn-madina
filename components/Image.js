import React, { Component, PropTypes } from 'react';
import { Image } from 'react-native';

export default class ScaledImage extends Component {
    constructor(props) {
        super(props);
        this.state = {source: {uri: String(this.props.uri)}};
    }

    componentWillMount() {
        const noop = ()=>true;
        const onFail = this.props.onFail || noop
        const onSuccess = this.props.onSuccess || noop

        Image.getSize(String(this.props.uri), (width, height) => {
            if (this.props.width && !this.props.height) {
                this.setState({width: this.props.width, height: height * (this.props.width / width)});
            } else if (!this.props.width && this.props.height) {
                this.setState({width: width * (this.props.height / height), height: this.props.height});
            } else {
                this.setState({width: width, height: height});
            }
            onSuccess({width, height});
        },onFail);
    }

    render() {
        if(/^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/.test(this.state.source.uri)===false)return null;

        return (
            <Image source={this.state.source} style={{height: this.state.height, width: this.state.width}}/>
        );
    }
}

ScaledImage.propTypes = {
    uri: PropTypes.string.isRequired,
    width: PropTypes.number,
    height: PropTypes.number
};