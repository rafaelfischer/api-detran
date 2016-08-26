const config = require( './config/app' );
const cors = require( 'cors' );

if ( config.env === 'production' ) {
    require( 'newrelic' );
}

const express = require( 'express' );
const compress = require( 'compression' );

let app = express();

app.use( cors() );

app.use( compress() );

// load our routes
app = require( './routes/driver' )( app );
app = require( './routes/vehicle' )( app );

// error handlers

// catch 404 and forward to error handler
app.use( ( req, res, next ) => {
    var err = new Error( 'Not Found' );
    err.status = 404;
    next( err );
} );

// development error handler
// will print full error
if ( config.env === 'development' ) {
    app.use( ( err, req, res, next ) => {
        res.status( err.status || 500 );
        console.error( err );
        res.json(
            {
                err: err.message,
                stack: err.stack
            } );
    } );
}

// production error handler
// only error message leaked to user
app.use( ( err, req, res, next ) => {
    res.status( err.status || 500 );
    console.error( err );
    res.json( {
        err: err.message,
        fields: []
    } );
} );

let pathApp = express();

let path = config.path;
pathApp.use( path, app );

module.exports = pathApp;
