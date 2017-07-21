import {Map, Record} from 'immutable';
import { createSelector } from 'reselect';
import {API_CALL_ACTION} from '../types';
import {combineReducers} from '../tools';
import { APP_LOAD } from '../types';

const key = 'blog';

/**SELECTORS**/
const selectBlogPosts = state => state.getIn(['blog','posts']);
const selectReadIds = state => state.getIn(['blog','old']);
const selectNewPostsLength = createSelector(
  [selectBlogPosts, selectReadIds],
  (posts, ids)=>selectBlogPosts.toJS ? Object.keys(selectBlogPosts.toJS()).map(String).filter(ids.has).length : 0,
);
export const selectors = {
  selectBlogPosts,
  selectNewPostsLength,
  selectNewPostsLength
};


export const postShape = new Record({
  id:0,
  user_id:0,
  body:'',
  link:'',
  created_at:'',
  expire_at:'',
});

export const types = {
  APP_LOAD,
  BLOG_MERGE  : '/root/blog/fetch/',
  BLOG_MARK_OLD  : '/root/blog/markOld/',
  BLOG_DELETE : '/root/blog/remove/',
}

export const actions = {
  blogRead: (params) =>({
    type: API_CALL_ACTION,
    url: '/blog',
    verb: 'get',
    throttle:1000,
    params,
    name: 'BLOG_MERGE',
    origin: types.BLOG_MERGE,
  }),
  createPost: (params)=>({
      type: API_CALL_ACTION,
      url: '/blog',
      verb: 'post',
      throttle:1000,
      params,
      name: 'BLOG_MERGE',
      origin: t.BLOG_MERGE,
  }),
  addBlog : (payload) => ({ type: types.BLOG_MERGE, payload }),
  blogMarkAsOld : (payload) => ({ type: types.BLOG_MARK_OLD, payload }),
  removeBlog : (payload) => ({ type: types.BLOG_DELETE, payload }),
};

function postFactory(data, state){
  let raw = Object.values(data);
  console.log('Raw data for factory', raw);
  
  
  return raw.reduce((carry, i)=>{
    console.log('casting shape on',i,new postShape(i))
    return carry.set(String(i.id), new postShape(i));
  }, (state && state.set) ? state : Map({}));
}

function posts(state = Map({}), action, allState){
  if(action.type === types.APP_LOAD && action.payload.posts){
    return postFactory(action.payload);
  }
  if(action.type===types.BLOG_MERGE){
    return postFactory(action.payload, state);
  }
  if(action.type===types.BLOG_MERGE){
    return state.delete(String(action.payload));
  }

  return state;
}

function old(state=Map({}), action, allState){
  if(action.type === types.APP_LOAD && action.payload.old){
    return Map(action.payload.old);
  }
  if(action.type===types.BLOG_MARK_OLD){
    return action.payload.reduce((c,i)=>c.set(String(i),1),state);
  }
  return state;
}

const reducer = combineReducers({posts, old});
const initialState = reducer(undefined,{type:null});
export default {
  reducer,
  initialState,
  key,
  selectors
}