import { Map, Record } from 'immutable';
// import { createSelector } from 'reselect';
import { combineReducers } from '../tools';
import { API_CALL_ACTION, APP_LOAD } from '../types';

const key = 'blog';

/** SELECTORS**/
const selectBlogPosts = state => state.getIn(['blog', 'posts']);

export const selectors = {
  selectBlogPosts,
};


export const PostShape = new Record({
  id: 0,
  user_id: 0,
  body: '',
  link: '',
  created_at: '',
  expire_at: '',
});

export const types = {
  APP_LOAD,
  BLOG_CREATE: '/root/blog/creating/',
  BLOG_MERGE: '/root/blog/fetch/',
  BLOG_MARK_OLD: '/root/blog/markOld/',
  BLOG_DELETE: '/root/blog/remove/',
};

export const actions = {
  blogRead: params => ({
    type: API_CALL_ACTION,
    url: '/blog',
    verb: 'get',
    params,
    name: 'BLOG_MERGE',
    origin: types.BLOG_MERGE,
    throttle: 600,
  }),
  createPost: params => ({
    type: API_CALL_ACTION,
    url: '/blog',
    verb: 'post',
    params,
    name: 'BLOG_CREATE',
    origin: types.BLOG_MERGE,
  }),
  addBlog: payload => ({ type: types.BLOG_MERGE, payload }),
  blogMarkAsOld: payload => ({ type: types.BLOG_MARK_OLD, payload }),
  removeBlog: payload => ({ type: types.BLOG_DELETE, payload }),
  download: cb => (dispatch, getState) => {
    const blog = selectBlogPosts(getState());
    const current = blog && blog.keySeq ? blog.keySeq().toArray().map(Number).sort() : [0, 0];
    return dispatch(actions.blogRead({ max_id: current.pop(), min_id: current.shift(), count: 20 }))
      .then((r) => {
        if (!r.ok || !r.data) return r;
        dispatch(actions.addBlog(r.data));
        if (cb) {
          cb(Object.keys(r.data).filter((id) => {
            const sid = String(id);
            return !blog.has(sid);
          }).length);
        }
        return r;
      });
  },
};

function postFactory(data, state) {
  const raw = Object.values(data);
  return raw.reduce(
    (carry, i) => carry.set(String(i.id), new PostShape(i)),
    (state && state.set) ? state : Map({}),
  );
}

function posts(state = Map({}), action) {
  if (action.type === types.APP_LOAD && action.payload.blog) {
    return postFactory(action.payload.blog.posts);
  }
  if (action.type === types.BLOG_MERGE) {
    return postFactory(action.payload, state);
  }
  if (action.type === types.BLOG_DELETE) {
    return state.delete(String(action.payload));
  }

  return state;
}
// @@todo delete this.. no need for it.
function old(state = Map({}), action) {
  if (action.type === 'RESET') return Map({});
  return state;
}

const reducer = combineReducers({ posts, old });
const initialState = reducer(undefined, { type: null });
export default {
  reducer,
  initialState,
  key,
  selectors,
};
