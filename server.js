const express = require('express');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const cors = require('cors');
const morgan = require('morgan');

require('dotenv').config();

let app = express();
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: true,
}));

app.use(morgan('tiny'));
app.disable('x-powered-by');

app.use((err, req, res, next) => {
    if(err) {
        console.error(err.message);
        console.error(err.stack);
        return res.status(err.output.statusCode || 500).json(err.output.payload);
    }
});

let jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${process.env.JWKS_URI}`
    }),
    audience: `${process.env.AUTH0_AUDIENCE}`,
    issuer: `${process.env.AUTH0_ISSUER}`,
    algorithms: ['RS256']
});

app.use(jwtCheck);

app.get('/storage', function (req, res) {
    res.send({storage: 'stored'});
});


let port = process.env.PORT || 8080;

app.listen(port);