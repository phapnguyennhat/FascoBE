import * as Joi from 'joi';

export const validationSchema = Joi.object({
  POSTGRES_HOST: Joi.string().required(),
  POSTGRES_PORT: Joi.number().required(),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_DB: Joi.string().required(),
  PORT: Joi.number().required(),

  JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
  JWT_ACCESS_TOKEN_EXPIRATION_TIME:Joi.string().required(),
  JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
  JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
  JWT_CODE_TOKEN_SECRET: Joi.string().required(),
  JWT_CODE_TOKEN_EXPIRATION_TIME: Joi.string().required(),

  GOOGLE_AUTH_CLIENT_ID: Joi.string().required(),
  GOOGLE_AUTH_CLIENT_SECRET: Joi.string().required(),

  FRONTEND_URL: Joi.string().required(),
  CLOUDINARY_NAME: Joi.string().required(),
  CLOUDINARY_API_KEY: Joi.string().required(),
  CLOUDINARY_API_SECRET: Joi.string().required(),

  APIKEY: Joi.string().required(),
  AUTHDOMAIN: Joi.string().required(),
  PROJECTID: Joi.string().required(),
  STORAGEBUCKET: Joi.string().required(),
  MESSAGINGSENDERID: Joi.string().required(),
  APPID: Joi.string().required(),
  MEASUREMENTID: Joi.string().required(),

  FACEBOOK_CLIENT_ID: Joi.string().required(),
  FACEBOOK_CLIENT_SECRET: Joi.string().required(),

  MAIL_USER: Joi.string().required(),
  MAIL_PASSWORD: Joi.string().required(),

  MOMO_HOST: Joi.string().required(),
  MOMO_ACCESSKEY: Joi.string().required(),
  MOMO_SECRETKEY: Joi.string().required(),
  MOMO_ORDERINFO: Joi.string().required(),
  MOMO_PARTNERCODE: Joi.string().required(),
  MOMO_PARTNERNAME: Joi.string().required(),
  MOMO_STOREID: Joi.string().required(),
  MOMO_LANG: Joi.string().required(),

  MOMO_REDIRECT_URL: Joi.string().required(),
  MOMO_IPN_URL: Joi.string().required(),
  
});
