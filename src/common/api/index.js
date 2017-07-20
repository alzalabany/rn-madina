import * as endpoint from './rootApi';
import * as t from '../types/types';
const TypesReversed = Object.keys(t).reduce((all,item)=>(all[t[item]]=item,all),{});
console.log('reversed',TypesReversed)
const endpoints = {
	LOGIN: endpoint.login,
	LOGOUT: endpoint.logout,
	GETAPPCONFIG: endpoint.getAppConfig,
	GETUSERCONFIG: endpoint.getUserConfig,
	GETNEWBLOGS: endpoint.getNewblogs,
	CREATEABLOGPOST: endpoint.createABlogPost,
	DELETEABLOGPOST: endpoint.deleteABlogPost,
	GETVISITS: endpoint.getVisits,
	GETVISITDETAILS: endpoint.getVisitDetails,
	UPDATEVISIT: endpoint.updateVisit,
	DELETEVISIT: endpoint.deleteVisit,
	CREATEINVITATION: endpoint.createInvitation,
	GETINVITATIONS: endpoint.getInvitations,
	SENDAFEEDBACK: endpoint.sendAFeedback,
	REPLYTOAFEEDBACK: endpoint.replyToAFeedback,
	MARKFEEDBACKASIMPORTANT: endpoint.markFeedBackAsImportant,
};

export default endpoints;

export const Middleware = store => next => action => {
	if(typeof action!=='object')console.log('ACTION TYPE FAIL::',action);

	if(TypesReversed[action.type] && endpoints[TypesReversed[action.type]]){
			store.dispatch({type:t.API_START, payload:action, origin:action.type, originKey:TypesReversed[action.type]});
		return endpoints[TypesReversed[action.type]](action).then(r=>{
			store.dispatch({type:r.ok ? t.API_SUCCESS : t.API_FAILED, payload:r.data, origin:action.type, originKey:TypesReversed[action.type]});
			//store.dispatch({type:t.API_FINALLY, payload:r.data, origin:action.type, originKey:TypesReversed[action.type]});
			return r;
		})
	}
	return next(action);
}
