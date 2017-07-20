import {create} from 'apisauce'
import {API_START,API_SUCCESS,API_FAILED, API_ACCESS_DENIED, API_FINALLY} from './common/types/types'

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
  const url = response.config.url.toLowerCase().replace(baseURL,"").replace(/(^\/)|(\/$)/g, "")
  // if(response.ok){
  //   api.dispatch({
  //     type:API_SUCCESS,
  //     verb:String(response.config.method).toUpperCase(),
  //     url,
  //     payload:response.data});
  // } else {
  //   api.dispatch({
  //     type:API_FAILED,
  //     verb:String(response.config.method).toUpperCase(),
  //     url,
  //     payload:response.data});
  // }
  // api.dispatch({
  //   type:API_FINALLY,
  //   verb:String(response.config.method).toUpperCase(),
  //   url,
  //   payload:response.data});
  //if(arg.data && arg.data.message)alert(arg.data.message);
  if (response.status===403) {
    hooks.on403.map(fn=>fn(response)); // you should mutate request.
  }
  if (response.status===401) {
    hooks.on401.map(fn=>fn(response)); // you should mutate request.
  }
});
api.addRequestTransform(request => {
  // api.dispatch({
  //   type:API_START,
  //   url:request.url,
  //   verb:String(request.method).toUpperCase(),
  //   url :String(request.url).replace(/(^\/)|(\/$)/g, ""),
  //   payload:request.params
  // })
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

export default {
  api,
  on403,
  on401,
  onRequest,
  onResponse,
}