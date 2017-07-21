import { Map } from 'immutable';
import * as types from './types';

import UserReducer from './users/reducer';
import appReducer from './appReducer';
import {selectAppUserToken} from './selectors';

const reducers = {
  [UserReducer.key]: UserReducer.reducer,
  [appReducer.key]: appReducer.reducer,
}

const initialState = Object.entries(reducers).reduce((carry, reducer)=>carry.set(reducer[0],reducer[1](undefined,{})),Map({}))
console.log('initial state', initialState.toJS());

const reducerGlobalStateIf = {};

reducerGlobalStateIf[types.APP_RESET] = () => initialState;
reducerGlobalStateIf[types.APP_START] = (state) => selectAppUserToken(state) ? state.setIn( ['app','root'], 'after-login' ) : state.setIn( ['app','root'], 'login' );

const rootReducer = (state=initialState, action, storeState) => {
  console.log('action: '+action.type, action);

  // combine all reducers.
  state = Object.entries(reducers).reduce((carry, reducer)=>{
    const part = carry.get(reducer[0]);
    const newPart = reducer[1](part, action, storeState);
    
    if(newPart !== part){
      console.log(reducer[0] + ' changed the state', newPart.toJS());
      return carry.set(reducer[0],newPart)
    }
    
    return carry;
  }, state);

  console.log('current user', selectAppUserToken(state));
  return ( reducerGlobalStateIf[action.type] ) ? reducerGlobalStateIf[action.type](state, action):state;
  
}

export default rootReducer;