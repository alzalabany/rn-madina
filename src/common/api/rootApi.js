import {api} from '../../api';

/**
* Description [LOGIN]
* @params { String } uri
* @return { promise }
*/
export const login = ( {payload} ) => api.post('token', payload)


/**
* Description [logout]
* @params { String } uri
* @return { promise }
*/
export const logout = (uri) => api.delete('token')


/**
* Description [getAppConfig]
* @params { String } uri
* @return { promise }
*/
export const getAppConfig = (uri) => api.get('system/settings')


/**
* Description [getUserConfig]
* @params { String } uri
* @return { promise }
*/
export const getUserConfig = (uri) => api.get('system/settings')



/**
* Description [getNewblogs]
* @params { String } uri
* @return { promise }
*/
export const getNewblogs = ({type,...params}) => api.get('blog',params)


/**
* Description [createABlogPost]
* @params { String } uri
* @return { promise }
*/
export const createABlogPost = (action) => api.post('blog',{...action.post})


/**
* Description [deleteABlogPost]
* @params { String } uri
* @return { promise }
*/
export const deleteABlogPost = ({post_id}) => api.delete('blog/'+post_id)


/**
* Description [getVisits]
* @params { String } uri
* @return { promise }
*/
export const getVisits = ({type,...params}) => api.get('visits',params)

/**
* Description [getVisitDetails]
* @params { String } uri
* @return { promise }
*/
export const getVisitDetails = ({visit_id}) => api.get('visits/'+visit_id)


/**
* Description [updateVisit]
* @params { String } uri
* @return { promise }
*/
export const updateVisit = ({visit_id,type,...params}) => api.put('visits/'+visit_id,{params})


/**
* Description [deleteVisit]
* @params { String } uri
* @return { promise }
*/
export const deleteVisit = ({visit_id}) => api.delete('visits/'+visit_id)


/**
* Description [createInvitation]
* @params { String } uri
* @return { promise }
*/
export const createInvitation = ({invitation}) => api.post('system/invitation',invitation)


/**
* Description [getInvitations]
* @params { String } uri
* @return { promise }
*/
export const getInvitations = ({type,...params}) => api.get('system/invitation',params)


/**
* Description [sendAFeedback]
* @params { String } uri
* @return { promise }
*/
export const sendAFeedback = ({feedback}) => api.post('system/feedback',feedback)


/**
* Description [replyToAFeedback]
* @params { String } uri
* @return { promise }
*/
export const replyToAFeedback = ({feed_id,feed}) => api.post('system/feedback/'+feed_id,feed)


/**
* Description [markFeedBackAsImportant]
* @params { String } uri
* @return { promise }
*/
export const markFeedBackAsImportant = ({feed_id}) => api.head('system/feedback/'+feed_id)
