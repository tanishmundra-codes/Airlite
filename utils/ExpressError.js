<<<<<<< HEAD
class ExpressError extends Error{
    constructor(statuscode,message){
        super();
        this.statuscode = statuscode;
         this.message= message;
    }
}
module.exports = ExpressError;
=======
// utils/ExpressError.js
class ExpressError extends Error {
    constructor(statusCode, message) {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}

module.exports = ExpressError;
>>>>>>> afd7339026c5a092661afefbd9274a1c52e253bf
