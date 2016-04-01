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
    app.use('/css', express.static(__dirname + '/css'));
    app.use('/images', express.static(__dirname + '/images'));
    app.use('/js', express.static(__dirname + '/js'));

    app.use(express.favicon());
    app.use(express.cookieParser());
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.session({ secret: 'winter is coming', cookie:{maxAge: SESSION_TIMEOUT_FREQUNCY}}));

    //For checking user login authentication.
    app.use(function(req, res, next)
    {
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
            if((req.url.indexOf("uptime") != -1) || (req.url.indexOf("systemTime") != -1) )
            {
                //console.log("Sending uptime/systemTime request back as authStatus not present.");
                var intervalResponce = {
                    "err": true,
                    "uptime":null
                };
                res.send( JSON.stringify(intervalResponce) );
                return;
            }
            else
            {
                console.log(" redirecting to login.htm page.");
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
            console.log(" Authentication successful for " + req.body.username + " : " + req.body.password);
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
    });

    app.get("/uptime",function(req, res)
    {
        var uptimeResponce = {
            "err": false,
            "uptime": "" + count++ + " : " + JSON.stringify(convert(new Date().getTime()))
        };
        console.log("Uptime: "+ count + " : " + JSON.stringify(uptimeResponce) );
        res.write(JSON.stringify(uptimeResponce) );
        res.end();
    });

    app.get('/logout', function(req, res)
    {
        res.send(JSON.stringify({}));
        req.session.destroy(function(err)
        {
            if(err)
            {
                console.log("ERROR: failed to delete session");
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