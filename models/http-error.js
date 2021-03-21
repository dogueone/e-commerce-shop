class HttpError extends Error {
  constructor(message, errorCode) {
    super(message); // Forward message propery from Error
    this.code = errorCode;
  }
}

module.exports = HttpError;
