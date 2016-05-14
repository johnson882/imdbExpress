
var express = require('express');
var handlebars = require('express-handlebars');
 
var app = express();

//app.disable('x-powered-by');

//var handlebars = require('express3-handlebars').create({defaultLayout:'main'});
 
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');



app.use('/public', express.static('public'));

app.get('/', function(req,res){
 //res.send("this is a test the server is working!"); // this is how to send text
  res.render('home');
});

app.get('/contact', function(req, res){
  res.render('contact');
})

app.get('/about', function(req, res){
  res.render('about');
});

app.use(function(req, res, next){
//m
});

app.set('port', process.env.PORT || 3000);



app.listen(app.get('port'), function(){
  console.log("Express started on http://localhost:" + app.get('port') + ' press Ctrl-c to terminate');
});
/*
app.get('/', function(req,res){
  res.send('Express Works');
});

app.listen(app.get('port'), function(){
  console.log('Express started press Ctrl-c to terminate');
});
*/
