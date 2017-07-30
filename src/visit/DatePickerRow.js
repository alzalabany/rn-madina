import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {
  TouchableOpacity,
  View,
  Text,
  Dimensions,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import { selectDayFilter, actions } from './ducks';

const { width } = Dimensions.get('screen');

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
const AnimatedIcon = Animatable.createAnimatableComponent(Icon);

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
    if (props.trigger !== this.props.trigger) {
      this.handleClickAction();
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
    const day = (days && !isNaN(Date.parse(days)) && moment(days).isValid()) ? moment(days) : false;
    this.setState({
      showDatePicker: false,
      day,
    }, () => this.props.onChange(day));
  }

  render() {
    const day = (this.state.day && this.state.day.isValid && this.state.day.isValid()) ? moment(this.state.day) : { isValid: () => false };
    return (<LinearGradient
      colors={['#A7008A', '#640C70']}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 1 }}
      style={[styles.row, { marginHorizontal: -10, marginTop: -10, backgroundColor: 'transparent', height: 40, width, justifyContent: 'center' }]}
    >
      <TouchableOpacity onPress={this.handleClickAction} style={[{ flexDirection: 'row' }]}>
        {day.isValid() ? (<View style={{ flex: 1, borderColor: '#FFF', borderRightWidth: 2, flexDirection: 'row' }}>
          <View style={{ flex: 1, borderColor: '#FFF', borderRightWidth: 2 }}>
            <Text style={{ textAlign: 'center', color: '#FFF' }}>{day.format('DD')}</Text></View>
          <View style={{ flex: 1, borderColor: '#FFF', borderRightWidth: 2 }}>
            <Text style={{ textAlign: 'center', color: '#FFF' }}>{day.format('MMMM')}</Text></View>
          <View style={{ flex: 1, borderColor: '#FFF', borderRightWidth: 1 }}>
            <Text style={{ textAlign: 'center', color: '#FFF' }}>{day.format('YYYY')}</Text>
          </View>
          <Text style={{ textAlign: 'center', flex: 0.5, borderColor: '#FFF', borderRightWidth: 0 }}>
            <Icon name="calendar" color="#FFF" />
          </Text>
        </View>) : (
          <Animatable.View
            animation="swing"
            iterationCount={5}
            style={{ flex: 1, borderColor: '#FFF', borderRightWidth: 0 }}
          >

            <Text style={{ textAlign: 'center', color: '#FFF' }}>
              Click To filter by Date <Icon
                name="calendar"
                animation="pulse"
                easing="ease-out"
                direction="alternate"
                iterationCount="infinite"
              />
            </Text>
          </Animatable.View>)}
        <DateTimePicker
          cancelTextIOS="Clear day"
          date={day.isValid() ? day.toDate() : undefined}
          isVisible={this.state.showDatePicker}
          onConfirm={this.handleAction}
          onCancel={() => this.handleAction(false)}
        />
      </TouchableOpacity>
    </LinearGradient>);
  }
}

const mapStoreStateToProps = state => ({
  day: selectDayFilter(state),
});
const propsForActions = dispatch => ({
  dispatch,
  onChange: day => dispatch(actions.setDayFilter(day)),
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
