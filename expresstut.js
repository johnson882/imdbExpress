
//Session Commit

var express = require('express');
var bodyparser = require("body-parser");
var handlebars = require('express-handlebars');
//var cookieParser = require('cookie-parser');
var sessions = require("express-session");
var pgp = require('pg-promise')();
var app = express();

//database connection object
var cn = {
	host: 'localhost',
	port: '5432',
	database: 'postgres',
	user: 'postgres',
	password: ''

};

var session;
var db = pgp(cn);
//app.disable('x-powered-by');


 
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');



app.use('/public', express.static('public'));
//app.use(cookieParser());
app.use(sessions({resave: true, saveUninitialized: true, secret: "gstyltklfdfga"}));

app.get('/', function(req,res){
  res.render('home');
 //res.send("this is a test the server is working!"); // this is how to send text
  // console.log('Username: ' + req.body.username);
  
  //res.cookie('Ian', "MyPassword123");

 // res.send('home');
 /*
  if(res.body.username == 'ian' && res.body.password == 'password')
  {
  //res.send(res.body.username);
  //res.redirect('about');
  }
 //res.send('Password: ' + req.body.password);
  */
});

app.get('/dashboard', function(req, res){
	//if(loggedin)
	//{r}
	res.status(404).send("cant do it");
});

app.get('/removeCookie', function(req,res){
  res.clearCookie('Ian', "MyPassword123");
  res.end('cookies Removed');
});

app.get('/postQuery', function(req, res){
	db.any("select * from site_users;").then(function (data){
	  //success!
	  var username = data;
	  res.send(username[0]);
	 
	})
	.catch(function (error){
	  //error;
	  res.send(error);
	});
	//var aQuery = db.query('select * from site_users');
	//res.send("done!" + aQuery);
	//res.send(aQuery);
});


app.get('/users', function(req, res){
  //console.log(req.query);
  //res.render('home');
  res.send(200);
});
app.get('/contact', function(req, res){
  res.render('contact');
})

app.get('/about', function(req, res){
  var randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
  res.render('about', {fortune: randomFortune});
  
});

//404 catch-all handler(middleware)

app.use(function(req, res, next){
res.status(404);
res.render('404');

});



app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500);
	res.render('500');

});

app.set('port', process.env.PORT || 3000);



app.listen(app.get('port'), function(){
  console.log("Express started on http://localhost:" + app.get('port') + ' press Ctrl-c to terminate');
});



var fortunes = ["You will win money in your next gambling experience", 
				"you will make a great fortune from selling online hair ties",
				"never give up and you will do great!",
				"you will get a great surprise tomorrow at 2:00PM",
				"what ever you do keep things simple!"];
/*
app.get('/', function(req,res){
  res.send('Express Works');
});

app.listen(app.get('port'), function(){
  console.log('Express started press Ctrl-c to terminate');
});
*/
