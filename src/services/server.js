const express = require('express');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const jwtAuthz = require('express-jwt-authz');
const cors = require('cors');
const morgan = require('morgan');
const { SERV_PORT } = process.env;

require('dotenv').config();

let app = express();
app.use(express.json());
const corsOptions =  {
  origin: 'http://localhost:3000'
};
app.use(cors(corsOptions));

// app.use(morgan('tiny'));
// app.disable('x-powered-by');

const checkJwt = jwt({
  // Dynamically provide a signing key based on the [Key ID](https://tools.ietf.org/html/rfc7515#section-4.1.4) header parameter ("kid") and the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),  // Validate the audience and the issuer.
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});
const checkScopes = jwtAuthz(['read:messages']);
// app.use(jwtCheck);

app.get('/api/public', function(req, res) {
  res.json({
    message: 'Hello from a public endpoint! You don\'t need to be authenticated to see this.'
  });
});app.get('/api/private', checkJwt, function(req, res) {
  res.json({
    message: 'Hello from a private endpoint! You need to be authenticated to see this.'
  });
});app.get('/api/private-scoped', checkJwt, checkScopes, function(req, res) {
  res.json({
    message: 'Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this.'
  });
});app.use(function(err, req, res, next){
  console.error(err.stack);
  return res.status(err.status).json({ message: err.message });
});

app.use((err, req, res, next) => {
  if(err) {
      console.error(err.message);
      console.error(err.stack);
      return res.status(err.output.statusCode || 500).json(err.output.payload);
  }
});

let serverInstance;

const start = async () => {
  serverInstance = app.listen(Number(SERV_PORT), () => {
    console.log(`App listening on ${Number(SERV_PORT)}`);
  });
};

const stop = async () => {
  serverInstance.close();
};

module.exports = { start, stop };