import { Map, Record } from 'immutable';
import { createSelector } from 'reselect';
import moments from 'moment';
import { API_CALL_ACTION, APP_LOAD } from '../types';
import { combineReducers } from '../tools';
import { selectUsers } from '../selectors';

function moment(string) {
  if (!string) return moments();
  return isNaN(Date.parse(string)) ? moments('01-01-1970') : moments(string);
}
// /////////////
// ///constants
// /////////////
const mount = 'visits';

export const FiltersShape = new Record({
  patient: '',
  day: '',
  room_id: '',
});
const cardRecord = Record({
  andro_embryologist: '',
  andro_prep: '',
  day_of_et: '',
  e2: '',
  embryo_blast_rate: '',
  embryo_d1: '',
  embryo_d2: '',
  embryo_d3: '',
  embryo_d3_a: '',
  embryo_d5: '',
  embryo_et: '',
  embryo_vit: '',
  final_e2: '',
  final_p4: '',
  fsh_num: '',
  fsh_tradename: '',
  hcg: '',
  hcg_num: '',
  hcg_tradename: '',
  hepatitis: '',
  history: '',
  hmg_num: '',
  hmg_tradename: '',
  husband: '',
  husband_age: '',
  incubator: '',
  incubator_media: '',
  incubator_notes: '',
  indications: '',
  injection_time: '',
  lah_grade: '',
  lah_indications: '',
  lah_no: '',
  last_access: '',
  last_update: '',
  note: '',
  oocyte_fert_rate: '',
  oocyte_gv: '',
  oocyte_injected: '',
  oocyte_intact: '',
  oocyte_m1: '',
  oocyte_m2: '',
  oocyte_or: '',
  patient_age: null,
  phone: '',
  post_abn: '',
  post_conc: '',
  post_mot: '',
  post_rp: '',
  post_vol: '',
  pre_abn: '',
  pre_conc: '',
  pre_mot: '',
  pre_rp: '',
  pre_vol: '',
  prev_art: '',
  protocol: '',
  recfsh_num: '',
  recfsh_tradename: '',
  serial_no: '',
  stdays: '',
  transfer_catheter: '',
  transfer_clinician: '',
  transfer_day: '',
  transfer_e_d: '',
  transfer_embryologist: '',
  transfer_no: '',
  transfer_notes: '',
  transfer_witness: '',
  created_at: '',
  created_by: '',
  is_pregnant: 0,
  day: '2017-04-25',
  patient: '',
  ref_id: 0,
  room_id: 0,
  services: '',
  slot: '00:00',
  status: '',
  type: 'ICSI',
  user_id: 0,
  card_id: 0,
  id: 0,
});
export const CARD_STATUS = {
  0: 'pending approval',
  1: 'booked',
  2: 'Rejected',
  3: 'accepted',
  4: 'inprogress',
  5: 'finished',
};
export class CardShape extends cardRecord {
  getStatus() {
    return CARD_STATUS[this.status] || 'N/A';
  }
  injectStore(store) {
    if (!store || !store.get) return this;
    console.log('%cinjecting store', 'color:green', store.toJS());
    this.store = store;
    return this;
  }
  getDr() {
    return (this.store && this.store.getIn) ? this.store.getIn([String(this.ref_id), 'fullname']) : `#${this.ref_id}`;
  }
  getServices() {
    return `${this.services}+${this.extra_services}`;
  }
  getPatient(users) {
    if (!this.loaded) {
      this.loaded = true;
      // @@todo implement lazyloading for patients
      // fetch(`/patients/${this.patient_id}`).then(r => r.json()).then(cb);
    }
    return users.getIn(this.patient, 'fullname');
  }
}

const filtersState = new FiltersShape({});
const cardsState = Map({});
const initialState = Map({
  cards: cardsState,
  filters: filtersState,
});


export const types = {
  VISIT_MERGE: '/root/visit/fetch/',
  VISIT_DELETE: '/root/visit/remove/',

  FILTER_SET: '/root/filters/set/',
};

// /////////////
// ///selectors
// /////////////
export const selectVisits = state => state.getIn(['visits', 'cards']);
export const selectFilters = state => state.getIn(['visits', 'filters']);
export const selectRoomFilter = state => state.getIn(['visits', 'filters', 'patient']);
export const selectPatientFilter = state => state.getIn(['visits', 'filters', 'room_id']);
export const selectDayFilter = state => state.getIn(['visits', 'filters', 'day']);

export const selectCards = createSelector(
  selectVisits,
  selectUsers,
  (visits, users) => visits.map(card => card.injectStore(users)),
);

function sortVisits(visits, filters) {
  if (!visits || !visits.keySeq) return [];
  let keys = visits.keySeq().toArray().reverse();
  if (filters && filters.size && visits.getIn) {
    const fs = [];
    if (filters.get('room_id')) {
      fs.push(
        key => visits.getIn([key, 'room_id']) === filters.get('room_id'),
      );
    }
    if (filters.get('day') && moment(filters.get('day')).isValid()) {
      fs.push(
        key => moment(filters.get('day')).diff(
          moment(visits.getIn([key, 'day'])), 'days') === 0,
      );
    }
    if (filters.get('patient')) {
      fs.push(key => Boolean(String(visits.getIn([key, 'patient'])).match(new RegExp(filters.get('patient'), 'gi'))));
    }


    if (fs.length) {
      keys = keys.filter(id =>
        fs.filter(fn => fn(id)).length === fs.length, // all filters must pass.
      );
    }
  }
  return keys.sort((a, b) => visits.getIn([a, 'id']) > visits.getIn([b, 'id']))
    .sort((a, b) => {
      if (visits.getIn([a, 'type']) === visits.getIn([b, 'type'])) {
        if (visits.getIn([a, 'day']) === visits.getIn([b, 'day'])) return 0;
        return visits.getIn([a, 'day']) < visits.getIn([b, 'day']);
      }
      return visits.getIn([a, 'type']) < visits.getIn([b, 'type']);
    })
    .sort(a => (visits.getIn([a, 'has_new']) ? -1 : 1)).map(String);
}
const colors = ['purple', 'green', 'teal', 'orange'];
function mutate(obj, name) {
  if (name.length < 2)name = 'N/A'; // eslint-disable-line
  if (obj[name]) {
    obj[name]++; // eslint-disable-line
  } else {
    obj[name] = 1; // eslint-disable-line
  }
  return obj;
}
function makeStats(data, keys) {
  const cards = [];
  if (!keys.length || !data || !data.map) return [];
  cards.push({ color: colors[0], title: 'Total', data: keys.length });

  // group by type
  const d1s = {};
  const status = {};
  data.map((i) => {
    const d1 = i.get('type');
    const d2 = i.get('status');
    if (d1) {
      mutate(d1s, String(d1).toLowerCase().replace(/ /g, ''));
    }
    if (d2) {
      mutate(status, String(d2).toLowerCase().replace(/ /g, ''));
    }
  });
  Object.keys(d1s).map(t => cards.push({ color: colors[1], title: t, data: d1s[t] }));
  Object.keys(status).map(t => cards.push({ color: colors[2], title: t, data: status[t] }));

  return cards;
}

export const selectors = {
  selectVisitsIds: createSelector(selectCards, selectFilters, sortVisits),
};
selectors.selectVisibleCards = createSelector(selectCards, selectors.selectVisitsIds, makeStats);

// /////////////
// ///actions
// /////////////
export const actions = {
  read: params => ({
    type: API_CALL_ACTION,
    url: '/visits',
    verb: 'get',
    params,
    name: 'VISIT_MERGE',
    origin: types.VISIT_MERGE,
    throttle: 10,
  }),
  post: params => ({
    type: API_CALL_ACTION,
    url: '/visit',
    verb: 'post',
    params,
    name: 'VISIT_MERGE',
    origin: types.VISIT_MERGE,
  }),
  merge: payload => ({ type: types.VISIT_MERGE, payload }),
  setFilter: (name, value) => ({ type: types.FILTER_SET, payload: [name, value] }),
  download: cb => (dispatch, getState) => {
    const visits = selectCards(getState());
    const current = visits && visits.keySeq ? visits.keySeq().toArray().map(Number).sort() : [0, 0];
    return dispatch(actions.read({ max_id: current.pop(), min_id: current.shift(), count: 20 }))
      .then((r) => {
        if (!r.ok || !r.data) return r;
        dispatch(actions.merge(r.data));
        if (cb)cb(r.data);

        return r;
      });
  },
};

function visitFactory(data, state) {
  const raw = Object.values(data).filter(i => Boolean(i.id));
  return raw.reduce(
    (carry, i) => carry.set(String(i.id), new CardShape(i)),
    (state && state.set) ? state : cardsState,
  );
}

function cardsReducer(state = cardsState, action) {
  if (action.type === APP_LOAD && action.payload && action.payload.visits && action.payload.visits.cards) {
    return visitFactory(action.payload.visits.cards);
  }

  if (action.type === types.VISIT_MERGE) {
    return visitFactory(action.payload, state);
  }

  return state;
}

function filtersReducer(state = filtersState, action) {
  if (action.type === types.APP_LOAD && action.payload && action.payload.visits && action.payload.visits.filters) {
    return Object.entries(action.payload.visits.filters).reduce((carry, i) => carry.set(String(i[0]), String(i[1])), state);
  }

  if (action.type === types.FILTER_SET && Array.isArray(action.payload) && state.has(String(action.payload[0]))) {
    return state.set(String(action.payload[0]), String(action.payload[1]));
  }

  return state;
}

const reducer = combineReducers({ cards: cardsReducer, filters: filtersReducer });

export default {
  reducer,
  initialState,
  key: mount,
  selectors,
  CARD_STATUS,
};
