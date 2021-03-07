const request = require('request')
function requestObject(options) {
    return new Promise((resolve, reject) => {
        request(options, function (error, response, body) {
            if (error) {
                reject(error);
            } else if ((200 > response.statusCode) || (299 < response.statusCode)) {
                console.log(body);
                reject(new Error(`Remote resource ${options.url} returned status code: ${response.statusCode}: ${body}`))
            } else {
                const object = (typeof body === 'string') ? JSON.parse(body) : body // FIXME throws
                resolve({code: response.statusCode, object})
            }
        })
    })
}

function getAdminAccessToken() {
    const options = {
        method: 'POST',
        url: `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
        headers: { 'content-type': 'application/json' },
        body: { 
            client_id: process.env.AUTH0_ADMIN_CLIENT_ID,
            client_secret: process.env.AUTH0_ADMIN_CLIENT_SECRET,
            audience: process.env.AUTH0_AUDIENCE,
            grant_type: 'client_credentials'
        },
        json: true
    }
    return requestObject(options)
}

function getUserProfile(accessToken, userID) {
    const options = {
      method: 'GET',
      url: `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${userID}`,
      headers: { 'Authorization': `Bearer ${accessToken}`
               }
      }
      return requestObject(options)
  }

  module.exports = { getAdminAccessToken, getUserProfile, requestObject}