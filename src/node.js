const select = require('reselect');
const Immutable = require('immutable');
const moment = require('moment');

const m = Immutable.fromJS({
  1:{
    id: 1
  },
  2:{
    id: 2
  }
});
const n = m.map(i=>i.set('_id',i.get('id')));
console.log(m === n);
console.log(m);
console.log(n);