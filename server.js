var convert = require("parse-ms");
var ejs = require('ejs');
var express = require("express");
var app = express();
var redisStore = require('connect-redis')(express);
var redis = require("redis");
var client  = redis.createClient();


var PORT_NO = 80;
var SESSION_TIMEOUT_FREQUNCY =  0.5 * 60 * 1000;
var count = 1;

try
{
/*
    //var redis = require("redis");

    //var client = redis.createClient();
    client.auth('mindstix');
    client.on('connect', function()
    {
        console.log("Redis connected.");
    });
    client.on('error', function(err)
    {
        console.log("Error in connecting: ", err);
    });
    client.set('framework', 'AngularJS');
    client.set('framework1', 'AngularJS_2');
    client.expire('framework', 30);
    var readDatabaseInterval = setInterval(function()
    {
        client.get('framework', function(err, reply)
        {
            console.log("Reply: ", reply);
            client.ttl('framework', function(err, remainingTime)
            {
                console.log("ReaminingTime: ", remainingTime);
            });
        });
        client.get('framework1', function(err, reply)
        {
            console.log("Reply1: ", reply);
            client.ttl('framework1', function(err, remainingTime)
            {
                console.log("ReaminingTime1: ", remainingTime);
            });
        });
    }, 1000*5);
    var updateSession = setInterval(function()
    {
        client.expire('framework', 30);
    }, 1000*25);
*/

    app.set('views', __dirname + '/');
    app.engine('htm', ejs.renderFile);
    app.use('/css', express.static(__dirname + '/css'));
    app.use('/images', express.static(__dirname + '/images'));
    app.use('/js', express.static(__dirname + '/js'));

    app.use(express.favicon());
    app.use(express.cookieParser());
    app.use(express.json());
    app.use(express.urlencoded());
    /*app.use(express.session({
        store: new redisStore({pass:'mindstix', client: client}),
        secret: 'winter is coming',
        cookie:{maxAge: SESSION_TIMEOUT_FREQUNCY},
        //rolling: true
        saveUninitialized: false,
        resave: false
    }));*/

    var sessionInstance = express.session({
        store: new redisStore({pass:'mindstix', client: client}),
        secret: 'winter is coming',
        cookie:{maxAge: SESSION_TIMEOUT_FREQUNCY, httpOnly: false},
        rolling: true,
        saveUninitialized: false,
        resave: true    //true
    });

    app.use(function (req, res, next) {
        if (req.url.indexOf("uptime") != -1)
        {
            console.log("Excluding session for Uptime.");
            return next();
        }
        console.log("Adding session");
        sessionInstance(req, res, next);
    });

    //For checking user login authentication.
    app.use(function(req, res, next)
    {
        if((req.url.indexOf("uptime") != -1) || (req.url.indexOf("systemTime") != -1) )
        {
            return next();
        }

        console.log("SessID :", req.sessionID);
        console.log("maxAge :", req.session.cookie.maxAge);
        console.log("session: ", req.session);

        if(req.url.indexOf("login") != -1)
        {
            //console.log("Procceding app.post('/login').");
            next();
        }
        else if(req.session.authStatus == "loggedIn")
        {
            //console.log("Authenticated user.");
            next();
        }
        else
        {
           /* if((req.url.indexOf("uptime") != -1) || (req.url.indexOf("systemTime") != -1) )
            {
                //console.log("Sending uptime/systemTime request back as authStatus not present.");
                var intervalResponce = {
                    "err": true,
                    "uptime":null
                };
                res.send( JSON.stringify(intervalResponce) );
                return;
            }
            else*/
            {
                console.log("Redirecting to login.htm page.");
                res.render("./login.htm");
                return;
            }
        }
    });

    app.use(app.router);

    ////For basic authentication.
    app.post("/login", function(req, res)
    {
        if(req.body.username == "ovrc" && req.body.password == "ovrc")
        {
            //console.log(" Authentication successful for " + req.body.username + " : " + req.body.password);
            req.session.authStatus = "loggedIn";
            res.send("./");
        }
        else
        {
            res.end();
        }
    });

    app.get("/", function(req, res)
    {
        if(req.session.authStatus)
        {
            console.log("Accessing index.htm.");
            res.render('./index.htm');
        }
        setInterval(function()
        {
            client.ttl('sess:'+ req.sessionID, function(err, remainingTime)
            {
                console.log("ReaminingTime in Redis: ", remainingTime);
            });
            client.get('sess:'+ req.sessionID, function(err, reply)
            {
                console.log("Reply: ", reply);
            });
        }, 1000);
    });

    app.get("/uptime",function(req, res)
    {
        var uptimeResponce = {
            "err": false,
            "uptime": "" + count++ + " : " + JSON.stringify(convert(new Date().getTime()))
        };
        //console.log("Uptime: "+ count + " : " + JSON.stringify(uptimeResponce) );
        res.write(JSON.stringify(uptimeResponce) );
        res.end();
    });

    app.get("/increaseSessionTimeout", function(req, res)
    {
        console.log("==========================Increasing session Timeout");
        console.log("UpdTED maxAge :", req.session.cookie.maxAge);
        //client.expire('sess:'+ req.sessionID, 30);
        //req.session.touch();
        //req.session.regenerate(function(err){console.log("-------------------------------------Error to set session timeout");});
        //req.session.cookie.maxAge = SESSION_TIMEOUT_FREQUNCY;
        //req.session.cookie.expires = new Date(Date.now() + SESSION_TIMEOUT_FREQUNCY);
        //req.session.cookie._expires = new Date(Date.now() + SESSION_TIMEOUT_FREQUNCY);
        //req.session.reload(function(err){console.log("-------------------------------------Error to set session timeout", err);});
        //console.log("==========================Increased session Timeout");
        res.end();
    });

    app.get('/logout', function(req, res)
    {
        res.send(JSON.stringify({}));
        req.session.destroy(function(err)
        {
            if(err)
            {
                console.log("ERROR: failed to delete session.");
            }
            else
            {
                console.log("Successfully logged out.");
            }
        });
    });



    app.listen(PORT_NO);
}
catch(error)
{
    console.log("-------------Programme terminated abnormally. Error: ", JSON.stringify(error));
}