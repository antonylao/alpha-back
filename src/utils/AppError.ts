export enum HttpCode {
  OK = 200, // validation GET, PUT
  CREATED = 201, //validation POST
  NO_CONTENT = 204, //validation DELETE
  BAD_REQUEST = 400, //syntaxe erronée
  UNAUTHORIZED = 401, //authentification nécessaire
  FORBIDDEN = 403, // pas les droits d'accès
  NOT_FOUND = 404,
  CONFLICT = 409, //mail existe déjà
  INTERNAL_SERVER_ERROR = 500,
}

export class AppError extends Error {
  httpCode: HttpCode;
  description: string;

  constructor(httpCode: HttpCode, description: string) {
    super(description)
    Object.setPrototypeOf(this, AppError.prototype); //see https://github.com/microsoft/TypeScript-wiki/blob/81fe7b91664de43c02ea209492ec1cea7f3661d0/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work 

    // https://www.codeconcisely.com/posts/how-to-handle-errors-in-express-with-typescript/
    this.httpCode = httpCode;
    this.description = description;
    Error.captureStackTrace(this);
  }
}