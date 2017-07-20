import { createSelector } from 'reselect';

export const selectAppRoot = (state) => state.getIn(['app','root']);
export const selectAppUserId = (state) => state.getIn(['app','user_id']);
export const selectAppUser = (state) => createSelector(selectAppUserId, id => state.getIn(['users',String(id)]));