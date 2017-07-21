import * as types from '../types';
import {Map, Record} from 'immutable';

const initialState = Map({});
const key = 'users';

export const UserShape = Record({
  id: 0,
  fullname:'Loading user..',
  token: false,
});

function reducer(state = initialState, action, store){

  if(action.type === types.APP_LOAD && action.payload.users){
    let users = Array.isArray(action.payload.users) ? action.payload.users : Object.keys(action.payload.users).map(id=>action.payload.users[id]);
    return users.reduce((carry,u)=>carry.set(u.id+'',new UserShape(u)),state)
  }

  if(action.type === types.AUTH_LOGOUT){
    return state.delete(String(action.payload));
  }

  if(action.type === types.USERS_ADD){
    return state.set(action.payload.id, new UserShape(action.payload));
  }

  if(action.type === types.USERS_MERGE){
    return state.deepMerge(action.payload);
  }

  if(action.type === types.USERS_SET){
    return Map(action.payload);
  }

  return state;
}

export default {
  reducer,
  initialState,
  key
}