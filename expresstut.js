
//Session Commit

var express = require('express');
var bodyParser = require("body-parser");
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
	 // for laptop postresql
	
	/*
	host: 'localhost',
	port: '5432',
	database: 'IMDB',
	user: 'postgres',
	password: 'john11' // desktop database
	*/

};

var session;
var db = pgp(cn);
//app.disable('x-powered-by');


 
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');



app.use('/public', express.static('public'));
//app.use(cookieParser());
app.use(sessions({resave: false, saveUninitialized: true, secret: "gs39tyl65tklfdfga"}));
app.use(bodyParser());


app.get('/', function(req,res){
 //res.body.username = "ian";
 res.render('home');
 

 

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

app.post('/', function(req, res){
var userName = req.body.userName;
//res.redirect('dashboard');
var html = 'Hello: ' + userName + '.<br>' +
             '<a href="/">Try again.</a>';
 // res.send(html);
 req.session.user = userName;
res.redirect('dashboard');
});


app.post('/login', function(req, res){
  var username = "ian";
  var password = "pass";
  req.session.user = username;
});


app.get('/dashboard', function(req, res){
	
	var userName = req.session.user;

var html = 'Hello: ' + userName + '.<br>' +
             '<a href="/">Try again.</a>';
	res.send(html);
	
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
