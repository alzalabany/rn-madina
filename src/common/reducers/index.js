import {Map, fromJS, Record, List, Iterable, OrderedMap} from 'immutable';
import * as t from '../types/types'
import * as Records from '../types/records'

const initialState = new Records.stateRecord({})
const cast = (R, col, is_collection)=>{
	if(is_collection){
		return Array.isArray(col) ? col.map(r=>new R(r)) :
		Object.keys(col).reduce((a,b)=>{
			a.set(b,new R(col[b]))
			return a;
		},Map({}));
	}
	return new R(col);
}

const combineReducers = (config) => (currentState, action)=>{
		if(!action || action.type ==='REDUX_STORAGE_SAVE'){
			return Iterable.isIterable(currentState) ? currentState : initialState;
		}
		const state = Iterable.isIterable(currentState) ? currentState : initialState;

		const newState = Object.keys(config).reduce((state,key)=>{
			const reducer = config[key];

			const prev = state.get(key);
			const newvalue = reducer(prev, action, state);



			//console.log(`CALLED ${key} with action ${action.type} result in ${prev===newvalue ? 'no change':'new value'}`, prev===newvalue ? null:newvalue)

			return prev===newvalue ? state : state.set(key,newvalue)
		}, state);

		if(state !== newState){
			console.log('state changed',newState.toJS());

		}

		if(action.type === t.API_ACCESS_DENIED){
			return initialState;
		}

		return newState;
}

function On(arr,type, verb, url){
	if(!url)return Boolean(arr.type===type && arr.verb === verb);
	return Boolean(arr.type===type && arr.origin === verb && arr.originKey===url);
}

function errors(state=[],action){
	if(action.type===t.API_ACCESS_DENIED,t.API_FAIL)return state.concat(action.type);
	if(action.type===t.API_SUCCESS)return [];

	return [];
}

function loaded(state=false, action, fullState){
	if(action.type==='@@INIT')return false;
	if(action.type===t.APP_START)return true;

  return state;
}

function user_id(state=0,action, allState){
	if(action.type===t.API_ACCESS_DENIED && allState.errors.indexOf(t.API_ACCESS_DENIED)>-1 )return 0;
	if(action.type===t.API_SUCCESS && action.origin===t.LOGIN && action.payload && action.payload.id){
		return action.payload.id
	}
  return state;
}

function api(state=Map({}),action){
	if(!action.originKey)return state;

	if(action.type===t.API_START )return state.set(action.originKey,action.payload)
	if(action.type===t.API_FINALLY )return state.set(action.originKey,action.payload)
	if(action.type===t.API_SUCCESS )return state.set(action.originKey,action.payload)
	if(action.type===t.API_ACCESS_DENIED )return state.set(action.originKey,action.payload)

	return state;
}

function rooms(state=Map({}),action){
	if(action.type===t.API_SUCCESS && action.origin===t.GETAPPCONFIG && action.payload && action.payload.rooms){
		return action.payload.rooms.reduce((s,u)=>s.set(u.id,new Records.Room(u)),state);
	}
  return state;
}

function users(state=Map({}),action){
	if(action.type===t.API_SUCCESS && action.origin===t.GETAPPCONFIG && action.payload && action.payload.users){
		return action.payload.users.reduce((s,u)=>s.set(u.id,new Records.User(u)),state);
	}
	if(action.type===t.API_SUCCESS && action.origin===t.LOGIN && action.payload && action.payload.id){
		return state.set( action.payload.id,new Records.User(action.payload) );
	}
  return state;
}

function blog(state=OrderedMap({}),action){
	if(action.orginKey === "GETNEWBLOGS" && action.payload){
		return Object.keys(action.payload).sort().reverse().reduce((a,i)=>a.set(i,new Records.Blog(action.payload[i])),state);
	}
	if(action.type===t.API_SUCCESS && action.origin===t.GETAPPCONFIG && action.payload && action.payload.blog){
		return action.payload.blog.reduce((s,u)=>s.set(u.id,new Records.Blog(u)),state);
	}
  return state;
}

function oldBlog(state=Map({}),action){
	if(action.type===t.MARKASOLD){
		return action.payload.filter(i=>!state.has(i)).reduce((n,o)=>n.set(o,true),state)
	}
  return state;
}

function visits(state=OrderedMap({}),action){
	if(action.originKey==="GETVISITS" && action.type === t.API_SUCCESS){
		console.log('new visits added')
		return Object.keys(action.payload).sort().reverse().reduce((a,i)=>a.set(i,new Records.Visit(action.payload[i])),state);
	}
	if(action.type===t.API_SUCCESS && action.origin===t.GETAPPCONFIG && action.payload && action.payload.visits){
		return action.payload.visits.reduce((s,u)=>s.set(u.id,new Records.Visit(u)),state);
	}
  return state;
}

function filters(state=new Records.Filters({}),action){

  return state;
}

function config(state=Map({}),action){
	if( On(action, t.API_SUCCESS, t.GETUSERCONFIG) && Array.isArray(action.payload) ){
		console.log('got one', action.payload.reduce((s,i)=>s.set(i.label,i),state) );
		return action.payload.reduce((s,i)=>s.set(i.label,i),state)
	}

  return state;
}

function holidays(state=Map({}),action){

  return state;
}


export default combineReducers({
	loaded,
	user_id,
	errors,
	api,
	rooms,
	users,
	blog,
	oldBlog,
	loaded,
	visits,
	filters,
	config,
	holidays,
})
