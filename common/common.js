var passport = require('passport');

//when token is correct then only you will be able to select a API
exports.isAuth = passport.authenticate('jwt', { session: false });
  

exports.cookieExtractor = function (req) {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies['jwt'];
    }
    // console.log('cookie-Extractor', token);
    //TODO : this is temporary token for testing
   // token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZmUxYjFhZTM4MWRlOWZiOGY2ODRhMSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjk3MDQ3NTA0fQ.NidJSiaumOyEZhidvmO87gN3lHF99XDfBpLdJUO6uv0';
    return token;
  };

exports.sanitizeUser = (user) => {
  return {id : user.id, role : user.role}
}  