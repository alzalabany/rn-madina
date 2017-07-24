import { Map } from 'immutable';
import * as types from './types';

import BlogReducer from './Blog/ducks';
import visitReducer from './visit/ducks';
import roomsReducer from './rooms/ducks';
import usersReducer from './users/ducks';
import appReducer from './appReducer';
import { selectAppUserToken } from './selectors';
import { combineReducers } from './tools';

const reducers = combineReducers({
  [BlogReducer.key]: BlogReducer.reducer,
  [visitReducer.key]: visitReducer.reducer,
  [appReducer.key]: appReducer.reducer,
  [roomsReducer.key]: roomsReducer.reducer,
  [usersReducer.key]: usersReducer.reducer,
});
const initialState = reducers(Map({}), {});

const reducerGlobalStateIf = {};

reducerGlobalStateIf[types.APP_RESET] = () => initialState;
reducerGlobalStateIf[types.APP_START] = state => (selectAppUserToken(state) ? state.setIn(['app', 'root'], 'after-login') : state.setIn(['app', 'root'], 'login'));

const rootReducer = (
  state = initialState,
  action,
  storeState) => (
  (reducerGlobalStateIf[action.type]) ?
    reducerGlobalStateIf[action.type](reducers(state, action), action, storeState)
    :
    reducers(state, action));

export default rootReducer;
