import * as types from '../types';
import { Map, Record } from 'immutable';

const initialState = Map({});
const key = 'users';

export const UserShape = Record({
  id: 0,
  fullname: 'Loading user..',
  role: 'N/A',
  token: false,
});
function usersFactory(payload, state = initialState) {
  let users = Array.isArray(payload) ? payload : Object.values(payload);
  users = users.filter(i => Boolean(i && i.id)).reduce(
    (carry, u) => carry.set(String(u.id), new UserShape(u)),
    initialState,
  );
  return users.merge(state);
}
function reducer(state = initialState, action) {
  if (
    (action.type === types.APP_LOAD && action.payload.users) ||
    (
      action.type === types.API_SUCCESS &&
      action.action &&
      action.action.origin === types.APP_START &&
      action.payload.users
    )
  ) {
    const x = usersFactory(action.payload.users, state);
    console.log(`%c${x.getIn(['1', 'token'])}`, 'color:red;font-size:20px;');
    return x;
  }

  if (action.type === types.AUTH_LOGOUT) {
    return state.delete(String(action.payload));
  }

  if (action.type === types.USERS_ADD) {
    return state.set(action.payload.id, new UserShape(action.payload));
  }

  if (action.type === types.USERS_MERGE) {
    return usersFactory(action.payload, state);
  }

  if (action.type === types.USERS_SET) {
    return usersFactory(action.payload);
  }

  return state;
}

export default {
  reducer,
  initialState,
  key,
};
