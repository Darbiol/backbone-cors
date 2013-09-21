var mongoose = require('mongoose');
var express = require('express');
var app = express();

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var contactSchema = new Schema({
	_id			: ObjectId,
	name		: String,
	number		: Number,
	username	: String
});

var contacts = mongoose.model('contacts', contactSchema);

//====================== Database connect====================

mongoose.connect('mongodb://localhost/cors', function (err){
	if(err) {console.log(err);}
	else{console.log('connected to database: contacts')}
});

//=========================CORS config==============
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

//====================== configuation===================
app.configure(function () {
	app.use(express.bodyParser());
	app.use(allowCrossDomain);
	app.use(app.router);
});

//======================SERVER API=================
function getContacts(req, res){
	contacts.find(null, null, null, function (err, docs){
		if(err){throw err;console.log(err);}
		res.send(200, docs);
	});
	

}

function addContact(req, res){
	new contacts({
			name		: req.body.name,
			number 		: req.body.number,
			username 	: req.body.username
	}).save(function (err, docs){
		if(err){throw err;console.log(err);}
		res.send(200);
	});
}

function removeContact(req, res){
	contacts.remove({_id:req.params.id}, function (err){
		if(err){throw err;console.log(err);}
		res.send(200);
	});
}
function updateContact(req, res){
	console.log(req.body);
	contacts.update({_id:req.params.id}, {'name':req.body.name, 'number':req.body.number, 'username':req.body.username}, function (err, count){
		if(err){throw err;console.log(err)}
		console.log(count);
		res.send(200);
	});
}

//==================== POST ====================
app.post('/contacts', addContact); //add contacts
app.post('/checkUser'); //check username f exist
//====================  GET ======================
app.get('/contacts', getContacts); // display all contacts
app.put('/contacts/:id', updateContact); // update specific contct

app.delete('/contacts/:id', removeContact); //delete specific contct


app.listen(9090, function () {
	console.log('Application Running. Now listening to localhost:9090');
});