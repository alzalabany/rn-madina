const select = require('reselect');
const Immutable = require('immutable');
const moment = require('moment');

const createSelector = select.createSelector;

const selectCards = state => state.getIn(['visits', 'cards']);
const selectFilters = state => state.getIn(['visits', 'filters']);
const selectRoomFilter = state => state.getIn(['visits', 'filters', 'patient']);
const selectPatientFilter = state => state.getIn(['visits', 'filters', 'room_id']);
const selectDayFilter = state => state.getIn(['visits', 'filters', 'day']);

function sortVisits(visits, filters) {
  if (!visits || !visits.keySeq) return [];
  let keys = visits.keySeq().toArray().reverse();
  console.log('visits', filters);
  if (filters && filters.size) {
    const fs = [];
    if (filters.get('room_id')) {
      fs.push(
        (key, ref) => visits.getIn([key, 'room_id']) === filters.get('room_id'),
      );
    }
    if (filters.get('day')) {
      fs.push(
        (key, ref) => moment(filters.get('day')).diff(moment(visits.getIn([key, 'day'])), 'days') < 1);
    }
    if (filters.get('patient')) { fs.push((key, ref) => Boolean(String(visits.getIn([key, 'patient'])).match(new RegExp(filters.get('patient'), 'gi')))); }


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
    .sort(a => (visits.getIn([a, 'has_new']) ? -1 : 1));
}

const selectors = createSelector(selectCards, selectFilters, sortVisits);

const test = Immutable.fromJS({
  visits: {
    cards: {
      1: {
        id: 1,
        type: 'icsi',
        has_new: 0,
        day: 1,
        room_id: 1,
      },
      2: {
        id: 2,
        type: 'icsi',
        day: 1,
        has_new: 1,
        room_id: 2,
      },
      3: {
        id: 3,
        type: 'icsi',
        day: 1,
        has_new: 1,
        room_id: 2,
      },
    },
    filters: {
      patient: '',
      day: '',
      room_id: 0,
    },
  },
});
selectors(test);
console.log(selectors(test));
