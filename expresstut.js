
var express = require('express');
var handlebars = require('express-handlebars');
//var cookieParser = require('cookie-parser');
var session = require("express-session");
var app = express();

//app.disable('x-powered-by');


 
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');



app.use('/public', express.static('public'));
//app.use(cookieParser());
app.use(session({resave: true, saveUninitialized: true, secret: "asdfga"}));

app.get('/', function(req,res){
 //res.send("this is a test the server is working!"); // this is how to send text
  res.cookie('Ian', "MyPassword123");
  res.render('home');
  
});

app.get('/removeCookie', function(req,res){
  res.clearCookie('Ian', "MyPassword123");
  res.end('cookies Removed');
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
