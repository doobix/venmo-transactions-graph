var config = require('./config');
var express = require('express');
var https = require('https');
var querystring = require('querystring');
var app = express();
var access_token = '';

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// Let the user login with the Venmo account
app.get('/', function(req, res) {
  // Need access_profile scope to see transaction history
  var url = 'https://api.venmo.com/v1/oauth/authorize?client_id='+config.venmo.client_id+'&scope=access_profile&response_type=code';
  res.redirect(url);
});

// Grab the access token for the user
app.get('/oauth', function(req, res) {
  if (req.query.code) {
    var data = {
      client_id: config.venmo.client_id,
      client_secret: config.venmo.client_secret,
      code: req.query.code
    };
    var post_data = querystring.stringify(data);
    var post_req = https.request({
      host: 'api.venmo.com',
      path: '/v1/oauth/access_token',
      method: 'POST',
      headers: {
       'Content-Type': 'application/x-www-form-urlencoded',
       'Content-Length': Buffer.byteLength(post_data)
      }
    }, function(post_res) {
      var result = '';
      post_res.on('data', function(d) {
        result += d;
      });
      post_res.on('end', function(d) {
        var json = JSON.parse(result);
        // Store user's access_token in memory
        access_token = json.access_token;
        res.redirect('/graph');
      });
    });
    post_req.write(post_data);
    post_req.end();
  } else {
    res.redirect('/');
  }
});

// Show the graph of the user's transactions
app.get('/graph', function(req, res) {
  if (access_token) {
    res.render('graph');
  } else {
    res.redirect('/');
  }
});

// Get the transactions from Venmo
app.get('/json', function(req, res) {
  var get_req = https.request({
    host: 'api.venmo.com',
    path: '/v1/payments?limit=1000&access_token='+access_token,
    method: 'GET'
  }, function(get_res) {
    var result = '';
    get_res.on('data', function(d) {
      result += d;
    });
    get_res.on('end', function(d) {
      var json = JSON.parse(result);
      res.send(result);
    });
  });
  get_req.end();
});

app.listen(config.web.port, config.web.host);
console.log('Server is running on ' + config.web.host + ':' + config.web.port);
