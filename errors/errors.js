class CustomError extends Error{
    statusCode = 500
    constructor(message){
        super(message)
    }

    serializeErrors(){
        return [{ message: this.messsage}]
    }
}

class InvalidRequestError extends CustomError {
  statusCode = 400
  constructor(validationError) {
    super('BadRequest error');
    this.validationError = validationError
  }

  serializeErrors() {
    return this.validationError.errors.map(err => ({ message: err.msg, field: err.param}))
  }
}

module.exports = {CustomError, InvalidRequestError}