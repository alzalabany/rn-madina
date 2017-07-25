import { Map, Record } from 'immutable';
import { createSelector } from 'reselect';
import { selectAppUserId, selectAppUserRole } from '../selectors';
import { API_CALL_ACTION, APP_LOAD, APP_START, API_SUCCESS } from '../types';

const key = 'rooms';

/** SELECTORS**/
const selectRooms = state => state.getIn(['rooms']);
const roomsIadmin = createSelector(
  selectRooms,
  selectAppUserId,
  selectAppUserRole,
  (rooms, id, role) => {
    if (role === 'admin') return rooms.keySeq().toArray().sort();

    return rooms.filter(i => i.admins.map(String).indexOf(String(id)) > -1).keySeq().toArray().sort();
  },
);
export const selectors = {
  selectRooms,
  roomsIadmin,
};


export const RoomShape = Record({
  holidays: Map({
    'YYYY-MM-DD': Map({
      ending_hour: 0,
      starting_hour: 0,
    }),
  }),
  id: 0,
  interval: 30,
  name: 'O.R. 2',
  starting_hour: 7,
  ending_hour: 17,
  weekend: ['0', '6'],
  admins: [1],
});

const initialState = Map({});

export const types = {
  ROOM_MERGE: '/root/rooms/merge/',
};

export const actions = {
  get: params => ({
    type: API_CALL_ACTION,
    url: '/rooms',
    verb: 'get',
    params,
    name: 'ROOM_MERGE',
    origin: types.ROOM_MERGE,
    throttle: 6000,
  }),
};

function roomFactory(data, state) {
  const raw = Object.values(data);
  return raw.reduce(
    (carry, i) => carry.set(String(i.id), new RoomShape(i)),
    (state && state.set) ? state : Map({}),
  );
}

function reducer(state = initialState, action) {
  if (action.type === APP_LOAD && action.payload.rooms) {
    return roomFactory(action.payload.rooms);
  }

  if (
    action.type === API_SUCCESS &&
    action.action &&
    action.action.origin === APP_START && action.payload.rooms) {
    return roomFactory(action.payload.rooms);
  }

  return state;
}

export default {
  reducer,
  initialState,
  key,
  selectors,
};
