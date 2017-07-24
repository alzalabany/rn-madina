import moment from 'moment';
import { Map } from 'immutable';
import { Linking, Alert } from 'react-native';

const noob = f => f;
export const combineReducers = config => (state, action) => Object.entries(
  config).reduce((carry, reducer) => {
  const part = carry.get(reducer[0]);
  const newPart = reducer[1](part, action, carry, reducer[0]);

  return (newPart !== part) ? carry.set(reducer[0], newPart) : carry;
}, state || Map({}));

export const makeDefault = (def, maker = noob) => val => (val ? maker(val) : def);

export const openLink = url => Linking.canOpenURL(url).then((supported) => {
  if (!supported) {
    Alert.alert(
      'Can\'t handle url: ',
      `couldn't open ${String(url)} on your device`,
      [
        { text: 'OK', onPress: () => console.log('OK Pressed') }, // 0 = neutral
        // 1=cancel
        // 2=ok
      ],
    );
  } else {
    return Linking.openURL(url);
  }
}).catch(err => console.error('An error occurred', err));

export const range = (start, stop, step) => {
  const a = [start];
  let b = start;
  while ((b + step) < stop) { b += step; a.push(b); }
  return a;
};
export const getRanges = (start = 8, end = 15, $time = 30) => {
  const d = new Date();
  const $start = Math.floor(d.setHours(start, 0, 0) / 1000);
  const $end = Math.floor(d.setHours(end, 0, 0) / 1000);

  const $halfHourSteps = range($start, $end - ($time * 60), $time * 60);
  return $halfHourSteps.map($t => moment($t * 1000).format('hh:mm'));
};


export const timeToHuman = (time) => {
  const x = String(time);
  const min = x.split(':')[1] || '00';
  let y = x.indexOf(':') ? x.split(':')[0] / 1 : x / 1;
  const am = y >= 12 ? 'pm' : 'am';
  y = y === 12 ? 12 : y > 12 ? y - 12 : y < 10 ? `0${y}` : y; // eslint-disable-line

  return ` ${y}:${min}${am} `;
};

/**
 * 
 * @param {array} config 
 * @param {object} actions 
 * @param {function} dispatch 
 */
export const bindActionsToDispatch = (
  config = [],
  actions = {},
  dispatch = noob) => config.reduce(
  (carry, a) => Object.assign(carry, {
    [a]: (...args) => dispatch(actions[a].apply(null, args)),
  }),
  { dispatch },
);

