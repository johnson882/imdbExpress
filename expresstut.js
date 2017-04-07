
//Session Commit

var express = require('express');
var bodyParser = require("body-parser");
var handlebars = require('express-handlebars');
//var cookieParser = require('cookie-parser');
var session = require("express-session");
var pgp = require('pg-promise')();
var app = express();

//globals

var testData = []

testData.push({
	key: "keyname",
	value: "the value"

	
})


function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return true;
}

function splitName(obj) {
    if (isEmpty(obj)) return false;
	var  name = obj.split(" ");
	return name; 
	
}
//database connection object
var cn = {
/*
	host: 'localhost',
	port: '5432',
	database: 'postgres',
	user: 'postgres',
	password: ''
	 // for laptop postresql
	
	
	host: 'localhost',
	port: 5432,
	database: 'postgres',
	user: 'postgres',
	password: 'john11john' // desktop database
	*/
	host: 'mydbinstance.co8wdi0xjaxc.us-west-1.rds.amazonaws.com',
	port: 5432,
	database: 'postgres',
	user: 'ianuser',
	password: 'userian323' // desktop database

};

//var session;

var db = pgp(cn);
//app.disable('x-powered-by');


 
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');



app.use('/public', express.static('public'));
//app.use(cookieParser());
app.use(session({resave: false, saveUninitialized: true, secret: "gs39tyl65tklfdfga"}));
app.use(bodyParser());




app.get('/', function(req,res){
if(req.session.success){
	  
	  res.redirect('/dashboard');
	}
else{
res.render('home');
}
});

app.get('/signin', function(req,res){
 //res.body.username = "ian";
 	
 res.render('signin');


 

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

app.post('/signin', function(req, res){
var userName = req.body.userName;
var passWord = req.body.password;

var theData;
var dataP;
var data;


db.any("select tuser, pass from site_users where tuser = '" + userName + "';").then(function (data){
	  //success!
	   theData = data;
	   
	 // var databasePassword = theData[0].pass;
	  
	  //res.send(passWord.valueOf() == databasepassword.valueOf());
	  //res.send(passWord);
	  if(isEmpty(theData[0]))
	  {
	  
	  var  html = 'No Username Found .<br>' +
		'<a href="/">Try again.</a>';
		res.send(html);
	 // res.send(theData[0].pass.localCompare(passWord) != 0);
	    
	  }

	  //compare = dataP == passWord;
	  //res.send(dataP != passWord);
	  dataP = theData[0].pass.toString('utf-8').trim();
	  if(dataP != passWord)
	  {
	    var  html = 'Wrong password .<br>' +
		'<a href="/">Try again.</a>';
		res.send(html);
	  }
	 else
	 {
	    req.session.user = userName;
		req.session.pass = passWord;
		req.session.success = true;
		res.redirect('dashboard');
	 }
	})
	.catch(function (error){
	  //error;
	 res.send(error);
	});
});


app.get('/dashboard', function(req, res,next){
	var userName = req.session.user;
	var password = req.session.pass;
	var search = req.query.search;
	//console.log(search);
	
	//res.render('dashboard');
	
	if(!req.session.success){
	  
	  res.send("");
	}
	else if(req.session.success){
	if(!isEmpty(search))
	{
	  //res.send("searching!");
	 
	 next();
	}
	
	req.session.visitcount++;
	var html = 'Hello: ' + userName + '.<br>' + 'Welcome your password is ' + password + '.<br>' 
             '<a href="/about">Try again.</a>';
	res.render('dashboard', {userName});
	}
	

	
});

app.get('/dashboard/:userId/:id', function(req,res){
	
	//if(req.param.idSearch == 10){
		//res.end( req.params.id);
		//if(req.params.id != null){
		    db.any("select * from media m, actors a, role r, appearances ap WHERE m.id = ap.media_id and r.id = ap.role_id and a.id = ap.actor_id and m.id = '" + req.params.id + "';").then(function(data){
  
   
		     res.render('Asearch', {"data" : data});
		    }).catch(function(error){
		    res.send(error);
		    });
	//	}
		//}
	
	
}); 

app.get('/dashboard:Asearch', function(req, res){
var name;

if( name = splitName(req.query.search)){
  db.any("select * from media m, actors a, role r, appearances ap WHERE m.id = ap.media_id and r.id = ap.role_id and a.id = ap.actor_id and a.firstname = '" + name[0] +"' and a.lastname = '" +name[1]+"';").then(function(data){
  
   
   res.render('Asearch', {"data" : data});
  }).catch(function(error){
  res.send(error);
  });
  

  //res.send('search:' + req.query.search);
} 
else if(req.query.Msearch){
  
  db.any(
  
  /*"select * FROM media m, actors a, role r, appearances ap WHERE m.id = ap.media_id and r.id = ap.role_id and a.id = ap.actor_id and m.medianame = '" + req.query.Msearch + "'  ;"
  */
  
  "select * from media m where medianame = '"  + req.query.Msearch+  "' ;"
  ).then(function(data){
 
   res.render('Msearch', {"data" : data});
 // res.render( testData)
  }).catch(function(error){
  res.send(error);
  });

}



else{
/*db.any("select r.role_name, m.media_name, a.actor_name FROM media m, actors a, appearances1 ap, roles r WHERE m.id = ap.media_id and a.id = ap.actor_id and  r.id = ap.role_id and r.id = ap.role_id and r.role_name = '" + req.query.Rsearch +"';").then(function(data){
  
   
   res.render('search', {"data" : data});
  }).catch(function(error){
  res.send(error);
  });
  */
}

}); // end /dashboard:seach




app.post('/dashboard', function(req, res){
var search = req.body.search;

}
);
app.get('/logout', function(req, res){

req.session.destroy();
//return req.status(200).send();

});

app.get('/signup', function(req,res){
	res.render('signup');
});

app.post('/signup', function(req, res){
	var email = req.body.email;
	var email2 = req.body.email2;
	var password = req.body.password;
	var password2 = req.body.password2;
	var username = req.body.username;
	
	
	db.any("select tuser, pass, email from site_users where tuser = '" + username + "' or email = '" + email + "';").then(function (data){
	
	if(isEmpty(data) == false){
	var html = 'username or password already exists .<br> <a href="/signup">Try again.</a>'; 
	//'<a href="/signup">Try again.</a>'; 
	res.send(html);
	}
	
	
	
	//res.send(data);
	}).catch(function (error){
	res.send(error);
	console.log(error);
	});
	
	//if username doesnt exist then..
	db.any("insert into site_users(tuser, pass, email) values ('" + username + "', '" + password + "', '" + email + "');").then(function (data){
	var html = 'username inserted!';
	res.send(html);
	
	}).catch(function (error){
	res.send(error);
	console.log(error);
	});
	//res.redirect('/dashboard');


});

app.get('/signout', function(req, res){

req.session.success = false;
req.session.username = null;
req.session.pass = null
res.render('signout');


});

app.get('/removeCookie', function(req,res){
  res.clearCookie('Ian', "MyPassword123");
  res.end('cookies Removed');
});

app.get('/postQuery', function(req, res){
var name = "Bill Johnson";
var password = "balls";
	db.any("select tuser, pass from site_users where tuser = '" + name + "' and pass = '" + password + "' ;").then(function (data){
	  //success!
	  var username = data;
	  if (username.tuser == name && username.pass != password)
	  {
	  res.send("password Wrong!");
	  }
	  res.send(username);
	 
	})
	.catch(function (error){
	  //error;
	 res.send(error);
	});
	//var aQuery = db.query('select * from site_users where tuser = "Bill Johnson"');
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
