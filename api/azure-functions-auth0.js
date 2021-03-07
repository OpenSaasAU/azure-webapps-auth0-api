// azure_functions_auth0.js
// based on the npm package azure-functions-auth0
// But modified to handle the Auth0 API accessToken

const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
//import ArgumentError from './errors/ArgumentError';
const ArgumentError = Error

const getJwtValidationError = (err, location, secret) => {
  return {
    status: err.status || 500,
    body: {
      message: err.message,
      audience: process.env.AUTH0_AUDIENCE,
      domain: process.env.AUTH0_DOMAIN,
      fullerr: JSON.stringify(err),
      location: location,
      secret: secret
    }
  };
};

const validateJwt = expressValidateJwt => (next, returnPromise) => {
  return (context, req, ...rest) => {
    if (returnPromise) {
      return new Promise(resolve => {
        expressValidateJwt(req, null, handleResult(resolve));
        // return undefined // done implicitly if you remove this line!
      });
    } else {
      expressValidateJwt(req, null, handleResultSync());
    }

    function handleResult(resolve) {
      return err => {
        if (err) {
          return resolve(getJwtValidationError(err,"handleResult",expressValidateJwt.secret));
        }
        resolve(next(context, req, ...rest));
      };
    }

    function handleResultSync() {
      return err => {
        if (err) {
          context.res = getJwtValidationError(err,"handleResultSync",expressValidateJwt.secret);
          return context.done();
        }
        next(context, req, ...rest);
      };
    }
  };
};

const createValidateJwt = options => {
  // guardOptions
  if (!options || !(options instanceof Object)) {
    throw new Error('The options must be an object.');
  }

  if (!options.algorithms || options.algorithms.length === 0) {
    throw new Error('The algorithms option has to be provided.');
  }

  if (!options.domain || options.domain.length === 0) {
    throw new Error('The Issuer Domain has to be provided.');
  }

  if (!options.audience || options.audience.length === 0) {
      throw new Error('The audience has to be provided.');
  }


  // createMiddleware
  const expressValidateJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksUri: `https://${options.domain}/.well-known/jwks.json`
    }),
    audience: options.audience,
    issuer: `https://${options.domain}/`,
    algorithms: options.algorithms
    })

  return validateJwt(expressValidateJwt);
};

module.exports = createValidateJwt;