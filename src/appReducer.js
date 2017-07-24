import { Map } from 'immutable';
import * as types from './types';

const key = 'app';
const initialState = Map({
  root: 'after-login',
  user_id: '0',
});

function reducer(state = initialState, action) {
  if (action.type === types.APP_LOAD && action.payload.app) {
    return Map(action.payload.app);
  }

  if (action.type === types.APP_SET_USER) {
    return state.set('user_id', String(action.payload)).set('root', 'after-login');
  }

  if (action.type === types.AUTH_LOGOUT) {
    return state.set('user_id', '0').set('root', 'login');
  }

  return state;
}

export default {
  reducer,
  key,
  initialState,
}
;
