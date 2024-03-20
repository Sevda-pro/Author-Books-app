/**
 * Handle errors in the applicaton and make an err object
 * @param {String} errormessage-the error message which is passed as an argument in next 
 * @param {Number} statuscode- the status code which is passed as an argument in next
 * @returns error object
 */
const errorhandler=(errormessage,statuscode)=>{
    const err = new Error();
    err.status = 'fail';
    err.statuscode=statuscode;
    err.message=errormessage;
    return err;
}
/**
 * Handle successful responses in the applicaton and make an response object
 * @param {String} message-the message which is passed as an argument in res.send 
 * @param {*} data- the data which is passed as an argument in res.send
 * @returns response object
 */
const successhandler=(message,data)=>{
   let response={ success: true, message: message, user: data }
   return response;
}

module.exports={errorhandler,successhandler}