const errorhandler=(errormessage,statuscode)=>{
    const err = new Error();
    err.status = 'fail';
    err.statuscode=statuscode;
    err.message=errormessage;
    return err;
}

const successhandler=(message,data)=>{
   let response={ success: true, message: message, user: data }
   return response;
}

module.exports={errorhandler,successhandler}