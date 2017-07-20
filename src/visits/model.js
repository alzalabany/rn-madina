import {createSelector} from 'reselect';
import merge from 'lodash/merge';
import filter from 'lodash/filter';
import {api} from '../api';
//import User from '../auth/model';
import { fromJS, isIndexed } from 'immutable';

const Visits = {};

Visits.setSearch = patient =>  ({type:'IVF/VISITS/FILTER', patient});
Visits.setRoom   = room_id => ({type:'IVF/VISITS/FILTER', room_id});
Visits.setDay   = currentDay =>  ({type:'IVF/VISITS/FILTER',day: moment(moment(currentDay).isValid()?currentDay:undefined).format('YYYY-MM-DD')});

Visits.fetch = (is_doctor) => (dispatch,getState) => {
  return api.get('visits').then(r=>{
    if(r.ok){
      dispatch({type:'IVF/VISITS/MERGE',payload:r.data});
    }
  });
}

Visits.getDetails = id => (dispatch,getState) => {
  return api.get('visits/data/'+id).then(r=>{
    if(!r.ok)return false;
    console.log('Visit Data',r.data);
    return r.data;
    dispatch({type:'IVF/VISITS/DETAILS',id, payload:r.data});
  })
};

Visits.initial = {
  visits : fromJS({}),
  room_id:null,
  patient:null,
  day    : 'today',
};

Visits.canHandle = action => action.type.indexOf('/VISITS/')>-1

Visits.selectFilters = ({patient,day,room_id}) => ({patient, day, room_id});
Visits.selectCurrentDay = state => state.day;
Visits.selectedRoom = state => state.room_id;
Visits.selectedSearch = state => state.patient;

Visits.get = state=> fromJS(state.visits||{});
Visits.selectAVisits = (state,id) => Visits.get(state).get(id);


Visits.filter = createSelector(
                               Visits.selectFilters,
                               Visits.get,
                               (filters,visits)=>{
                                  const match = {};
                                  for(i in filters){
                                    if(filters[i])match[i] = filters[i];
                                  }
                                  return filter(visits,match)
                               }
                               )

Visits.reducer = (state, action) => {
  const {type,...payload} = action;
 
  if(type==='IVF/VISITS/DETAILS'){
    const visits = state.visits.set(action.id,action.payload);
    return merge({},state,{visits});
  }

  if(type==='IVF/VISITS/MERGE'){
    const visits = fromJS(state.visits).merge(action.payload);
    if(visits == state.visits)return state;
    return merge({},state,{visits});
  }

  return state;
}



export default Visits;