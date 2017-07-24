import { createSelector } from 'reselect';

export const selectAppRoot = state => state.getIn(['app', 'root']);
export const selectAppUserId = state => state.getIn(['app', 'user_id']);
export const selectUsers = state => state.get('users');

export const selectAppUser = createSelector(
  [selectUsers, selectAppUserId],
  (users, id) => users.get(id),
);
export const selectAppUserToken = createSelector(selectAppUser, user => (user ? user.get('token') : null));
export const selectAppUserRole = createSelector(selectAppUser, user => (user ? user.get('role') : null));

export default {
  selectAppUser,
  selectAppUserToken,
  selectAppUserRole,
};
