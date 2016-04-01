var express = require("express");
var app = express();
var convert = require("parse-ms");


var PORT_NO = 80;
var SESSION_TIMEOUT_FREQUNCY =  0.5 * 60 * 1000;
var count = 1;

try
{
    app.set('views', __dirname + '/');
    app.engine('htm', require('ejs').renderFile);
    app.use('/js', express.static(__dirname + '/js'));

    app.use(express.favicon());
    app.use(express.cookieParser());
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.session({ secret: 'winter is coming', cookie:{maxAge: SESSION_TIMEOUT_FREQUNCY}}));

    app.use(function (req, res, next)
    {
        if(!req.session.authStatus || 'loggedOut' === req.session.authStatus)
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
    });

    //For basic authentication.
    app.use(express.basicAuth(function(name, pswd)
    {
        console.log("Checking credentials.");
        return name == "ovrc" && pswd == "ovrc";
    }));

    app.use(function (req, res, next)
    {
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