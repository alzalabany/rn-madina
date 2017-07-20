import * as t from './types';

/*
to convert types into actions search and replace 
using sublime text case senestive search

search : export const ([A-Z]+)_([A-Z])([A-Z]+)? = '([^']+)';
replace: export const \L$1\U$2\L$3 = () => ({ type: t.\U$1_$2$3 });
*/

export const appInitialized = () => ({ type: t.APP_START });
export const appReset = () => ({ type: t.APP_RESET });

export const authLogout = () => ({ type: t.AUTH_LOGOUT });
export const authLogin = () => ({ type: t.AUTH_LOGIN });

export const usersAdd = () => ({ type: t.USERS_ADD });
export const usersMerge = () => ({ type: t.USERS_MERGE });
export const usersSet = () => ({ type: t.USERS_SET });