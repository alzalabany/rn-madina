import * as t from './types';
import { apiActionCreator } from './api';
import { actions as blogActions } from './Blog/ducks';
import { actions as visitsActions } from './visit/ducks';

/*
to convert types into actions search and replace 
using sublime text case senestive search

search : export const ([A-Z]+)_([A-Z])([A-Z]+)? = '([^']+)';
replace: export const \L$1\U$2\L$3 = () => ({ type: t.\U$1_$2$3 });
*/
export const blog = blogActions;
export const visits = visitsActions;
export const appInitialized = () => ({ type: t.APP_START });
export const appReset = () => ({ type: t.APP_RESET });
export const appRehydrate = payload => ({ type: t.APP_LOAD, payload });
export const setAppUser = payload => ({ type: t.APP_SET_USER, payload });

export const authLogout = payload => ({ type: t.AUTH_LOGOUT, payload });
export const authLogin = () => ({ type: t.AUTH_LOGIN });

export const addUser = payload => ({ type: t.USERS_ADD, payload });
export const usersMerge = payload => ({ type: t.USERS_MERGE, payload });
export const usersSet = payload => ({ type: t.USERS_SET, payload });


export function attemptLogin(params) {
  // return apiActionCreator('/token', 'post', {token, password}, )
  return {
    type: t.API_CALL_ACTION,
    url: '/token',
    verb: 'post',
    throttle: 1000,
    params,
    name: 'AUTH_LOGIN',
    origin: t.AUTH_LOGIN,
  };
}
