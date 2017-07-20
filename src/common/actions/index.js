import * as types from '../types';

/**
* Description [return action for LOGIN]
* @params { Number } username
* @params { Number } password
* @return { Object<action> }
*/
export const apiState = (name, payload) => ({
  name,
  type: types.API,
  payload,
});

/**
* Description [return action for LOGIN]
* @params { Number } username
* @params { Number } password
* @return { Object<action> }
*/
export const LOGIN = ({username, password, fb_id, token}) => ({
  type: types.LOGIN,
  payload:{
    username,
    password,
    fb_id,
    token
  },
});

/**
* Description [return action for LOGIN]
* @params { Number } username
* @params { Number } password
* @return { Object<action> }
*/
export const loginSuccess = (payload) => ({
  type: types.LOGIN,
  payload,
});

/**
* Description [return action for LOGOUT]
* @return { Object<action> }
*/
export const LOGOUT = () => ({
  type: types.LOGOUT
});

/**
* Description [return action for GETAPPCONFIG]
* @return { Object<action> }
*/
export const GETAPPCONFIG = (payload,isOk) => ({
  type: types.GETAPPCONFIG,
  payload
});


/**
* Description [return action for GETNEWBLOGS]
* @params { Number } max_id
* @params { Number } min_id
* @params { Number } count
* @return { Object<action> }
*/
export const GETNEWBLOGS = ({max_id, min_id, count}) => ({
  type: types.GETNEWBLOGS,
  max_id,
  min_id,
  count,
});


/**
* Description [return action for GETNEWBLOGS]
* @params { Number } max_id
* @params { Number } min_id
* @params { Number } count
* @return { Object<action> }
*/
export const markAsOld = (payload) => ({
  type: types.MARKASOLD,
  payload,
})

/**
* Description [return action for CREATEABLOGPOST]
* @params { Number } post
* @return { Object<action> }
*/
export const CREATEABLOGPOST = (post) => ({
  type: types.CREATEABLOGPOST,
  post,
});

/**
* Description [return action for DELETEABLOGPOST]
* @params { Number } post_id
* @return { Object<action> }
*/
export const DELETEABLOGPOST = (post_id) => ({
  type: types.DELETEABLOGPOST,
  post_id,
});


/**
* Description [return action for GETVISITS]
* @params { Number } max_id
* @params { Number } min_id
* @params { Number } count
* @return { Object<action> }
*/
export const GETVISITS = ({max_id, min_id, count}) => ({
  type: types.GETVISITS,
  max_id,
  min_id,
  count,
});

/**
* Description [return action for SETVISITFILTER]
* @params { Number } name
* @params { Number } value
* @return { Object<action> }
*/
export const SETVISITFILTER = ({name, value}) => ({
  type: types.SETVISITFILTER,
  name,
  value,
});

/**
* Description [return action for GETVISITDETAILS]
* @params { Number } visit_id
* @return { Object<action> }
*/
export const GETVISITDETAILS = (visit_id) => ({
  type: types.GETVISITDETAILS,
  visit_id,
});

/**
* Description [return action for UPDATEVISIT]
* @params { Number } visit
* @return { Object<action> }
*/
export const UPDATEVISIT = (visit) => ({
  type: types.UPDATEVISIT,
  visit,
});

/**
* Description [return action for DELETEVISIT]
* @params { Number } visit_id
* @return { Object<action> }
*/
export const DELETEVISIT = (visit_id) => ({
  type: types.DELETEVISIT,
  visit_id,
});


/**
* Description [return action for CREATEINVITATION]
* @params { Number } invitation
* @return { Object<action> }
*/
export const CREATEINVITATION = (invitation) => ({
  type: types.CREATEINVITATION,
  invitation,
});

/**
* Description [return action for GETINVITATIONS]
* @params { Number } max_id
* @params { Number } min_id
* @params { Number } count
* @return { Object<action> }
*/
export const GETINVITATIONS = ({max_id, min_id, count}) => ({
  type: types.GETINVITATIONS,
  max_id,
  min_id,
  count,
});


/**
* Description [return action for SENDAFEEDBACK]
* @params { Number } feedback
* @return { Object<action> }
*/
export const SENDAFEEDBACK = (feedback) => ({
  type: types.SENDAFEEDBACK,
  feedback,
});

/**
* Description [return action for GETFEEDBACK]
* @params { Number } feed_id
* @return { Object<action> }
*/
export const GETFEEDBACK = (feed_id) => ({
  type: types.GETFEEDBACK,
  feed_id,
});

/**
* Description [return action for GETFEEDBACK]
* @params { Number } feed_id
* @return { Object<action> }
*/
export const GETFEEDBACKS = (feed_id) => ({
  type: types.GETFEEDBACKS,
});

/**
* Description [return action for REPLYTOAFEEDBACK]
* @params { Number } feed_id
* @params { Number } msg
* @return { Object<action> }
*/
export const REPLYTOAFEEDBACK = ({feed_id, msg}) => ({
  type: types.REPLYTOAFEEDBACK,
  feed_id,
  feed,
});

/**
* Description [return action for MARKFEEDBACKASIMPORTANT]
* @params { Number } feed_id
* @return { Object<action> }
*/
export const MARKFEEDBACKASIMPORTANT = (feed_id) => ({
  type: types.MARKFEEDBACKASIMPORTANT,
  feed_id,
});
