import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {
  TouchableOpacity,
  View,
  Text,
} from 'react-native';

import { selectDayFilter, actions } from './ducks';


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

class DatePickerRow extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { day: props.day ? moment(props.day) : false, showDatePicker: false };

    this.handleAction = this.handleAction.bind(this);
    this.handleClickAction = this.handleClickAction.bind(this);
  }
  componentWillReceiveProps(props) {
    if (props.day !== this.props.day) {
      this.setState({ day: moment(props.day) });
    }
    return true;
  }
  shouldComponentUpdate(props, state) {
    return Boolean(props.day !== this.props.day || state !== this.state);
  }


  handleClickAction() {
    this.setState({ showDatePicker: !this.state.showDatePicker });
  }
  handleAction(days) {
    const day = (days && moment(days).isValid()) ? String(moment(days)) : false;
    this.setState({
      showDatePicker: false,
      day,
    }, () => this.props.onChange(day));
  }

  render() {
    const day = isNaN(Date.parse(String(this.state.day))) ? {isValid:()=>false} : moment(this.state.day);

    return (<TouchableOpacity onPress={this.handleClickAction} style={[{ flexDirection: 'row' }, { backgroundColor: 'rgba(237,237,237,1)', padding: 5, borderRadius: 5 }]}>
      {day.isValid() ? (<View style={{ flex: 1, borderColor: 'rgba(96,166,215,1)', borderRightWidth: 2, flexDirection: 'row' }}>
        <View style={{ flex: 1, borderColor: 'rgba(96,166,215,1)', borderRightWidth: 2 }}>
          <Text style={{ textAlign: 'center', color: 'rgba(96,166,215,1)' }}>{day.format('DD')}</Text></View>
        <View style={{ flex: 1, borderColor: 'rgba(96,166,215,1)', borderRightWidth: 2 }}>
          <Text style={{ textAlign: 'center', color: 'rgba(96,166,215,1)' }}>{day.format('MMMM')}</Text></View>
        <View style={{ flex: 1, borderColor: 'rgba(96,166,215,1)', borderRightWidth: 0 }}>
          <Text style={{ textAlign: 'center', color: 'rgba(96,166,215,1)' }}>{day.format('YYYY')}</Text></View>
      </View>) : (
        <View style={{ flex: 1, borderColor: 'rgba(96,166,215,1)', borderRightWidth: 2 }}>
          <Text style={{ textAlign: 'center', color: 'rgba(96,166,215,1)' }}>
          Any Date
          </Text>
        </View>)}
      <DateTimePicker
        cancelTextIOS="Clear day"
        date={day.isValid() ? day.toDate() : undefined}
        isVisible={this.state.showDatePicker}
        onConfirm={this.handleAction}
        onCancel={()=>this.handleAction(false)}
      />
    </TouchableOpacity>);
  }
}

const mapStoreStateToProps = state => ({
  day: selectDayFilter(state),
});
const propsForActions = dispatch => ({
  dispatch,
  onChange: day => dispatch(actions.setFilter('day', String(day))),
});

DatePickerRow.propTypes = {
  day: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  onChange: PropTypes.func.isRequired,
};
DatePickerRow.displayName = 'DatePickerRow';
DatePickerRow.defaultProps = ({
  dispatch: console.warn,
  day: '',
});

export default connect(mapStoreStateToProps, propsForActions)(DatePickerRow);
