import {create} from 'apisauce'
import moment from 'moment';
import {selectAppUserToken} from './selectors';
import * as types from './types';
const { API_START, API_SUCCESS, API_FAILED, API_ACCESS_DENIED, API_CALL_ACTION } = types;

const header = {
  'Cache-Control': 'no-cache',
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};
const baseURL = 'http://localhost/ivf/';
const hooks = {
  on403:[],
  on401:[],
  onRequest:[(r)=>console.log('Request:',r)],
  onResponse:[(r)=>console.log('Response:',r)],
}
export const api = create({
  baseURL,
  headers: header,
  timeout: 10000,
});
api.addResponseTransform(response=>{
  hooks.onResponse.map(fn=>fn(response));
  if(!response.config)return;
  response.config.url = response.config.url.toLowerCase().replace(baseURL,"").replace(/(^\/)|(\/$)/g, "")
  
  if (response.status===403) {
    hooks.on403.map(fn=>fn(response)); // you should mutate request.
  }
  if (response.status===401) {
    hooks.on401.map(fn=>fn(response)); // you should mutate request.
  }
  return response;
});
api.addRequestTransform(request => {
  hooks.onRequest.map(fn=>fn(request)); // you should mutate request.
  return request;
});

function on403(fn){
  let id = hooks.on404.push(fn);
  return ()=>hooks.on404.splice(id-1,1);
}
function on401(fn){
  let id = hooks.on401.push(fn);
  return ()=>hooks.on401.splice(id-1,1);
}
function onRequest(fn){
  let id = hooks.onRequest.push(fn);
  return ()=>hooks.onRequest.splice(id-1,1);
}
function onResponse(fn){
  let id = hooks.onResponse.push(fn);
  return ()=>hooks.onResponse.splice(id-1,1);
}

  /**
   * Return a proxy function to call altocan api
   *
   * usage : 1.return this function call from action creator;
   *         2.middle ware will capture the function;
   *         3.middle ware will use info() to get information and dispatch API_START action;
   *         4.middleware will fire api call;
   *         5.middleware will fire result of api call;
   *
   * @method
   * @param  string verb    GET|POST|PUT|HEAD|DELETE
   * @param  array args     request params
   * @param  string name name of Type of action that fired request
   * @param  string type action type that fired request
   * @return object {call and info functions}
   */
export const apiActionCreator = function(url, verb, params, name){
  const formated_name = name ? String(name).toUpperCase() : name;
  return {
    type: API_CALL_ACTION,
    url: String(url).toLowerCase(),
    verb: String(verb||'GET').toUpperCase(),
    throttle:0,
    params,
    name: formated_name,
    origin: types[formated_name]
  }
}

const lastCallTime = {};
const outbound = {};
export const apiMiddleware = store => next => action => {
  const { type, ...config } = action;
  if(type !== API_CALL_ACTION)return next(action);

  const state = store.getState();
  const token = selectAppUserToken(state);
  const debounce = config.throttle ? config.throttle/1 : false;


  const verb = String(config.verb).toLowerCase();
  const url  = String(config.url).toLowerCase();

  api.setHeaders({
    'Authorization': 'Bearer '+token,
    'X-Sent-From': 'ivf.rn.client.1',
  })
  if(debounce){
    if(!lastCallTime[config.name]){    
      setTimeout(()=>{lastCallTime[config.name]=null}, config.throttle);
    } else {
      const msg = `trying to call ${config.name} too fast ! :${(moment().format('x')/1)-lastCallTime[action.name]}`;
      console.warn(msg);
      return new Promise((r,x)=>x(msg));
    }
  }
  if(outbound[config.name]){
    const msg = `trying to call ${config.name} more than once ! :${(moment().format('x')/1)-lastCallTime[action.name]}`;
    console.warn(msg);
    return new Promise((r,x)=>x(msg));
  }
  
  lastCallTime[config.name] = moment().format('x')/1;
  outbound[config.name] = true;

  store.dispatch({ type:API_START, action });
  const call = api[verb](url, config.params);
  console.log(`Called  ${verb.toUpperCase()} ${url} with params ${Object.keys(config.params||{}).join(', ')}`);
  return call.then(r=>{
    outbound[config.name]=false;
    if(!r)return console.warn('promise resolved nothing',r);
    if(r.ok && debounce)lastCallTime[config.name] = moment().format('x')/1;
    
    store.dispatch({type:r.ok ? API_SUCCESS : API_FAILED, payload:r.data, action});
    return r;
  })
}


export default {
  api,
  on403,
  on401,
  onRequest,
  onResponse,
  apiActionCreator,
  apiMiddleware
}

