import moment from 'moment'
import {Map} from 'immutable';
import {Linking, Alert} from 'react-native';

export const combineReducers = (config) => (state, action)=>{
  
  return Object.entries(config).reduce((carry, reducer)=>{
    const part = carry.get(reducer[0]);
    const newPart = reducer[1](part, action, carry, reducer[0]);
    
    return (newPart !== part) ? carry.set(reducer[0],newPart) : carry;
  }, state || Map({}));

}

export const openLink = url => Linking.canOpenURL(url).then(supported => {
  if (!supported) {
    Alert('Can\'t handle url: ' + url);
  } else {
    return Linking.openURL(url);
  }
}).catch(err => console.error('An error occurred', err));

export const range = (start, stop, step)=>{
    var a=[start], b=start;
    while((b+step)<stop){b+=step;a.push(b)}
    return a;
  };
export const getRanges = ($start=8,$end=15,$time=30) =>{
    var d = new Date();
    $start = Math.floor(d.setHours($start,0,0)/1000);
    $end = Math.floor(d.setHours($end,0,0)/1000);
    
    $halfHourSteps = range($start, $end-($time*60), $time*60);
    return $halfHourSteps.map($t=> moment($t*1000).format('hh:mm'));
 }


export const timeToHuman = (time)=>{
 let x = String(time)
 let min = x.split(':')[1] || '00';
 let y = x.indexOf(':') ? x.split(':')[0]/1 : x/1;
 let am = y>=12 ? 'pm' : 'am';
 y =  y===12 ? 12 : y > 12 ? y-12 : y<10 ? '0'+y : y;
 
 return ' '+y+':'+min+am+' ';
}

/**
 * 
 * @param {array} config 
 * @param {object} actions 
 * @param {function} dispatch 
 */
export const bindActionsToDispatch = (config, actions, dispatch)=>{
  return config.reduce((carry,a)=> Object.assign(carry,{[a]:(...args) => (console.log(a, args,actions[a]),dispatch(actions[a].apply(null, args)))}) ,{dispatch});
}