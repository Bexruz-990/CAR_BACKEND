class BaseError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      Error.captureStackTrace(this, this.constructor);
    }
  
    static BadRequest(message = "So‘rov noto‘g‘ri") {
      return new BaseError(message, 400);
    }
  
    static Unauthorized(message = "Ruxsat berilmagan") {
      return new BaseError(message, 401);
    }
  
    static Forbidden(message = "Taqiqlangan so‘rov") {
      return new BaseError(message, 403);
    }
  
    static NotFound(message = "Topilmadi") {
      return new BaseError(message, 404);
    }
  
    static Conflict(message = "Ma’lumot allaqachon mavjud") {
      return new BaseError(message, 409);
    }
  
    static InternalError(message = "Serverda xatolik yuz berdi") {
      return new BaseError(message, 500);
    }
  }
  
  module.exports = BaseError;
  