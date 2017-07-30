import { Map } from 'immutable';
import { createSelector } from 'reselect';

export const selectAppRoot = state => state.getIn(['app', 'root']);
export const selectAppUserId = state => state.getIn(['app', 'user_id']);
export const selectUsers = state => state.get('users');

export const selectAppUser = createSelector(
  [selectUsers, selectAppUserId],
  (users, id) => (users.has(String(id)) ? users.get(id) : Map({})),
);
export const selectAppUserToken = createSelector(
  selectAppUser,
  user => (user.has('token') ? user.get('token') : null),
);
export const selectAppUserRole = createSelector(
  selectAppUser,
  user => (user.has('role') ? user.get('role') : 'N/A'),
);

export default {
  selectAppUser,
  selectAppUserToken,
  selectAppUserRole,
};
