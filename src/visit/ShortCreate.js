/* React container ShortCreate	*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// import { withRouter } from 'react-router-dom';

const Form = () => null;
const Input = () => null;

class ShortCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Form onSubmit={console.log}>
        <Input name="patient" />
        <Input name="service" />
        <Input name="day" />
        <Input name="time" />
      </Form>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },
  flex: {
    flex: 1,
  },
};


const mapStoreStateToProps = state => ({
  state,
});
const propsForActions = dispatch => ({
  dispatch,
});

ShortCreate.propTypes = {
  dispatch: PropTypes.func.isRequired,
};
ShortCreate.displayName = 'ShortCreate';
ShortCreate.defaultProps = ({
  dispatch: console.warn,
});

export default connect(mapStoreStateToProps, propsForActions)(ShortCreate);
