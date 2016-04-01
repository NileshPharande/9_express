var express = require("express");
var app = express();
var convert = require("parse-ms");
//var basicAuth = require('basic-auth');


var PORT_NO = 80;
var SESSION_TIMEOUT_FREQUNCY =  0.5 * 60 * 1000;
var count = 1;

try
{
    app.set('views', __dirname + '/');
    app.engine('htm', require('ejs').renderFile);
    app.use('/js', express.static(__dirname + '/js'));

    //app.use(express.favicon());
    app.use(express.cookieParser());
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.session({ secret: 'winter is coming', cookie:{maxAge: SESSION_TIMEOUT_FREQUNCY}}));

/*    app.use(function (req, res, next)
    {
        if(req.session.username)
        {
            next();
        }
        else
        {
            res.send('<form action="/login"><p><input type="text" name="username" id="username" placeholder="username"></p> <p><input type="password" name="password" id="password" placeholder="password"></p> <p><input type="submit" value="Submit"></p></form>');
        }
    });
*/

    /*app.use(function (req, res, next)
    {
        console.log("REQUEST URL: ", req.url);
        console.log("user : ", req.user);
        console.log("remoteUser : ", req.remoteUser);
        console.log("authStatus : ", req.session.authStatus);
        console.log("Session : ", req.session);
        console.log("AUTH :" + req.headers.authorization);
        if(req.session.authStatus != 'loggedIn')
        {
            req.session.authStatus = 'loggedIn';
            // cause Express to issue 401 status so browser asks for authentication
            req.user = false;
            req.remoteUser = false;
            if(req.headers && req.headers.authorization)
            {
                delete req.headers.authorization;
            }
        }
        next();
    });*/


    /*
    //Working fine for resolving intervals. timeout, cookie is still pending.
    app.use(function (req, res, next)
    {
        console.log("REQUEST URL : ", req.url);
        console.log("Session : ", req.sessionID);
        console.log("authStatus:" + req.session.authStatus);
        console.log("AUTH : " + req.headers.authorization);
        //console.log("DATE : ");
        //console.log("Expires: ", req.session.cookie.expires);
        if(!req.session.authStatus || 'loggedOut' === req.session.authStatus)
        {
            if(req.url.indexOf("uptime") != -1)
            {
                console.log("Sending uptime request back before check for login.");
                var uptimeResponce = {
                    "err": true,
                    "uptime":null
                };
                res.write( JSON.stringify(uptimeResponce) );
                res.end();
                return;
            }

            req.session.authStatus = 'loggedIn';
            // cause Express to issue 401 status so browser asks for authentication
            req.user = false;
            req.remoteUser = false;
            if(req.headers && req.headers.authorization)
            {
                delete req.headers.authorization;
            }
        }
        next();
    });
    */

    /*
    app.use(function (req, res, next)
    {
        console.log("REQUEST: ", req.url);
        console.log("Hello1 :" + req.session.authStatus);
        //console.log("Hello2 :" + req.headers.authorization);
        //console.log("Session: ", req.sessionID);
        //console.log("Date   : ", new Date());
        //console.log("Expires: ", req.session.cookie.expires);
        //console.log("MaxAge : ", convert(req.session.cookie.maxAge));
        if(!req.session.authStatus || 'loggedOut' === req.session.authStatus)
        //if(req.session.authStatus != 'loggedIn')
        {
            req.session.authStatus = 'loggedIn';
            // cause Express to issue 401 status so browser asks for authentication
            req.user = false;
            req.remoteUser = false;
            if(req.headers && req.headers.authorization)
            {
                delete req.headers.authorization;
                //res.redirect("/");
            }
        }
        //req.session.cookie.maxAge = SESSION_TIMEOUT_FREQUNCY;

        else
        {
            req.session.touch();
        }
        //console.log("bye1 :" + req.session.authStatus);
        //console.log("bye2 :" + req.headers.authorization);
        next();
    });*/
/*    app.use(function(req, res, next)
    {
        console.log("Hello :" + req.url);
        console.log("Hello1 :" + req.session.authStatus);
        console.log("Hello2 :" + req.headers.authorization);
        //console.log("Hello3 :" + req.cookies.sessionCookie);
        //if( !req.cookies.sessionCookie || 'loggedOut' === req.session.authStatus)
        if(req.session.authStatus && req.url.indexOf("/logout") != -1)
        {
            console.log("NNNNNNNNN: " + "Successfully logged out.");
            //req.session.authStatus = 'loggedIn';

            delete req.session.authStatus;

            // cause Express to issue 401 status so browser asks for authentication
            req.user = false;
            req.remoteUser = false;
            if(req.headers && req.headers.authorization)
            {
                console.log("NNNNNNNNN: " + "Deleting auth header.");
                delete req.headers.authorization;
                res.status(401).end();
                //req.session.authStatus = 'loggedIn';
                //res.cookie('sessionCookie',1234, { maxAge: 1000*60, httpOnly: true });
            }
        }
        console.log("NNNNNNNNN: " + "Before Logged in.");
        next();
    });
*/

    /*
    //For basic authentication.
    app.use(express.basicAuth(function(name, pswd)
    {
        console.log("Checking credentials.");
        return name == "ovrc" && pswd == "ovrc";
    }));*/

    /*app.use(function (req, res, next)
    {
        function unauthorized(res)
        {
            console.log("Sending 401");
            res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
            return res.send(401);
        }
        console.log("Before Authentication.");
        var user = basicAuth(req);

        console.log("After Authentication.", user);

        if (!user || !user.name || !user.pass)
        {
            return unauthorized(res);
        }

        if (user.name === 'ovrc' && user.pass === 'ovrc')
        {
            return next();
        }
        else
        {
            return unauthorized(res);
        }
    });*/

    //app.use(express.session({ secret: 'winter is coming', cookie:{maxAge: SESSION_TIMEOUT_FREQUNCY}}));

    app.use(function (req, res, next)
    {
        console.log("Setting Login status.");
        req.session.cookie.maxAge = SESSION_TIMEOUT_FREQUNCY;
        req.session.authStatus = 'loggedIn';
        next();
    });

    app.use(app.router);

    app.get("/", function(req, res)
    {
        if(req.session.authStatus)
        {
            console.log("Accessing index.htm.");
            res.render('./index.htm');
        }
    });

    app.get("/uptime",function(req, res)
    {
        var uptimeResponce = {
            "err": false,
            "uptime": "" + count++ + " : " + JSON.stringify(convert(new Date().getTime()))
        };
        console.log("Uptime: "+ count + " : "+ JSON.stringify(uptimeResponce) );
        res.write(JSON.stringify(uptimeResponce) );
        res.end();
    });

    app.get('/logout',function(req, res)
    {
        var obj ={};
        console.log("Trying to logout.");
        res.send(JSON.stringify(obj));
        delete req.session.authStatus;
        /*req.session.destroy(function(err)
        {
            if(err)
            {
                console.log("Error");
            }
            else
            {
                console.log("Logged out");
                req.user = false;
                req.remoteUser = false;
                delete req.headers.authorization;
                res.redirect("/");
            }
        });*/
    });



    app.listen(PORT_NO);
}
catch(error)
{
    console.log("-------------Programme terminated abnormally.-----------------");
    console.log("-------------Error: ", JSON.stringify(error));
}