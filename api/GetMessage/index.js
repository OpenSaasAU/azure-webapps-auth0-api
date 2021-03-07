const jwtValidateDecorator = require('../azure-functions-auth0')({
  audience: process.env.AUTH0_AUDIENCE,
  algorithms: ['RS256'],
  domain: process.env.AUTH0_DOMAIN
})

const authHelper = require('../authHelper');

module.exports = jwtValidateDecorator(function(context, req) {
    context.log('Node.js HTTP trigger function processed a request. RequestUri=%s', req.originalUrl);
    
    if (req.method == "OPTIONS" ) {
      console.log("OPTIONS")
      context.res = {
        body:
          req.method
      }
    } else {
      if (req.user) {
        authHelper.getAdminAccessToken()
        .then(({object: {access_token}}) => {
            const userId = req.user.sub     // has been added to the req by the decorator
            return authHelper.getUserProfile(access_token, userId)
        })
        .then (({object}) => {
          console.log('here', object)
          context.res = {
            status: 200,
              body: JSON.stringify(object),
              headers: {'Content-Type': 'application/json'}
          }
          return { 
            status: 200,
              body: JSON.stringify(object),
              headers: {'Content-Type': 'application/json'}
           };
          
        }).catch(err => {
          console.error(err);
          return {
            status: 400,
            body: err
          }
        })
        .then(res => {   
          context.done(null, res)
      })
        
      } else {
        const res = {
            status: 400,
            body: 'Something is wrong with the Authorization token'
        }
        context.done(null,res)
    }
  }
  });