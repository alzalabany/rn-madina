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

export const APP_START = '/root/app/start/';
export const APP_RESET = '/root/app/reset/';

export const AUTH_LOGOUT = '/root/auth/logout/';
export const AUTH_LOGIN = '/root/auth/login/';

export const USERS_ADD = '/root/users/addone/';
export const USERS_MERGE = '/root/users/addmany/';
export const USERS_SET = '/root/users/reset/';