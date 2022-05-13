const {CustomError} = require('../errors/errors')

exports.errorHandler = (err, req, res,next)=>{
    if(err instanceof CustomError){
        return res.status(err.statusCode).json(err.serializeErrors())
    }

    console.error('Uncaught Error %o',err);
    res.status(500).json([{message: 'Internal server error'}])
}