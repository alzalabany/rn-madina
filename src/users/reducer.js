import * as types from '../types';
import {Map} from 'immutable';

const initialState = Map({});

function usersReducer(state = initialState, action, store){

  if(action.type === 'USERS_ADD'){
    return state.set(action.payload.id, action.payload);
  }

  if(action.type === 'USERS_MERGE'){
    return state.deepMerge(action.payload);
  }

  if(action.type === 'USERS_SET'){
    return Map(action.payload);
  }

  return state;
}

export default usersReducer;