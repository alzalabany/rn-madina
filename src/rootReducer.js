import { Map } from 'immutable';
import * as types from './types';

import UserReducer from './users/reducer';

const initialState = Map({
  app: Map({
    root: 'after-login',
    user_id: 0
  }),
})

const reducers = {
  User: UserReducer,
}

const reducerGlobalStateIf = {};

reducerGlobalStateIf[types.APP_RESET] = () => initialState;
reducerGlobalStateIf[types.APP_START] = (state) => Boolean( state.getIn(['app','user_id']) ) ? state.setIn( ['app','root'], 'after-login' ) : initialState.setIn( ['app','root'], 'login' );

const rootReducer = (state=initialState, action, storeState) => {
  console.log('action: '+action.type);
  
  if( reducerGlobalStateIf[action.type] ){
    return reducerGlobalStateIf[action.type](state)
  }

  // combine all reducers.
  return Object.entries(reducers).reduce((carry, reducer)=>{
    const part = carry.get(reducer[0]);
    const newPart = reducer[1](part, action, storeState);
    console.log(reducer[0] + ' changed the state');
    return newPart !== part ? carry.set(reducer[0],newPart) : carry;
  }, state);
}

export default rootReducer;