class BaseError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = "BaseError";
  }

  static BadRequest(message) {
    return new BaseError(message, 400);
  }

  static Unauthorized(message) {
    return new BaseError(message, 401);
  }

  static Forbidden(message) {
    return new BaseError(message, 403);
  }

  static NotFound(message) {
    return new BaseError(message, 404);
  }

  static InternalError(message, details = "") {
    return new BaseError(`${message}${details ? `: ${details}` : ""}`, 500);
  }
}

module.exports = BaseError;