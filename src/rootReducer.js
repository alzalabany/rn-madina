import { Map } from 'immutable';
import * as types from './types';

const initialState = Map({
  app: Map({
    root: 'login',
    user_id: 0
  }),
})

const reducerGlobalStateIf = {};

reducerGlobalStateIf[types.APP_RESET] = () => initialState;
reducerGlobalStateIf[types.APP_START] = (state) => Boolean( state.getIn(['app','user_id']) ) ? state.setIn( ['app','root'], 'after-login' ) : initialState.setIn( ['app','root'], 'login' );

const rootReducer = (state=initialState, action) => {
  if( reducerGlobalStateIf[action.type] ){
    return reducerGlobalStateIf[action.type](state)
  }

  // should combine all reducers here.

  return state;
}

export default rootReducer;