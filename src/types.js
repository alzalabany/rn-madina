import {types as BLOG} from './Blog/ducks';
/**
 * to generate boilerplate just copy types to sublime and 
 * search: export const ([A-Z]+)_([A-Z])([A-Z]+)? = '([^']+)';
 * 
 * 1. to chate to Action maker
 * replace: export const \L$1\U$2\L$3 = () => ({ type: t.\U$1_$2$3 });
 * 
 * 2. To change to reducer conditions
 * replace: 

    if(action.type === '$1_$2$3'){
      return state; //run your manipilation here
    }
 */
export const API_START = '/app/API/START/';
export const API_SUCCESS = '/app/API/SUCCESS/';
export const API_FAILED = '/app/API/FAILED/';
export const API_ACCESS_DENIED = '/app/API/ACCESS/DENIED/';
export const API_CALL_ACTION = '/app/API/CALL/';

export const APP_START = '/root/app/start/';
export const APP_RESET = '/root/app/reset/';
export const APP_LOAD = '/root/app/rehydrate/';
export const APP_SET_USER = '/root/app/login/';

export const AUTH_LOGOUT = '/root/auth/logout/';
export const AUTH_LOGIN = '/root/auth/login/';

export const USERS_ADD = '/root/users/addone/';
export const USERS_MERGE = '/root/users/addmany/';
export const USERS_SET = '/root/users/reset/';

export const {...params} = BLOG;