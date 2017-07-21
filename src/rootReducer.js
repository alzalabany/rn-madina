import { Map } from 'immutable';
import * as types from './types';

import UserReducer from './users/reducer';
import BlogReducer from './Blog/ducks';
import appReducer from './appReducer';
import {selectAppUserToken} from './selectors';
import {combineReducers} from './tools';

const reducers = combineReducers({
  [BlogReducer.key]: BlogReducer.reducer,
  [UserReducer.key]: UserReducer.reducer,
  [appReducer.key]: appReducer.reducer,
})

const initialState = reducers(Map({}),{});
console.log('initial state', initialState.toJS());

const reducerGlobalStateIf = {};

reducerGlobalStateIf[types.APP_RESET] = () => initialState;
reducerGlobalStateIf[types.APP_START] = (state) => selectAppUserToken(state) ? state.setIn( ['app','root'], 'after-login' ) : state.setIn( ['app','root'], 'login' );

const rootReducer = (state=initialState, action, storeState) => {
  console.log('action: '+action.type, action);

  // combine all reducers.
  state = reducers(state, action);

  console.log('current user', selectAppUserToken(state));
  return ( reducerGlobalStateIf[action.type] ) ? reducerGlobalStateIf[action.type](state, action):state;
  
}

export default rootReducer;