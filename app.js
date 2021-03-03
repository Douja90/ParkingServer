const express = require('express');
const app = express();
const port= 8081;

var request = require('request');
var mootools = require("mootools");

/*
 getNearbyPlacesData abstract class for firing request to google place search web service
 recursive request pulling from google places web service (google place ws will support only a maximum of 60 places in increments of 20)
 */
        var getDataRecursive = new Class({
        Implements: [Chain, Events, Options],
        options: {
        results: []
        },
        initialize: function (lat, lon, rad, res) {
        this.requestUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + lat + ',' + lon + '&radius=' + rad + '&types=parking&key=AIzaSyCY8FKWwr_az1taZMXm8XZRzw-Rkcft2vg';
        this.url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + lat + ',' + lon + '&radius=' + rad + '&types=parking&key=AIzaSyCY8FKWwr_az1taZMXm8XZRzw-Rkcft2vg';
        this.res = res;
        },
        getResults: function () {
        return this.options.results;
        },
        getData: function () {
        console.log('fetching... ' + this.requestUrl);
        request(this.requestUrl, this.callback.bind(this));
        },
        callback: function (error, response, body) {
        var body = JSON.parse(body),
        results = body.results;

        if (error || body.error) {
        this.dataCallback(error || body.error);
        } else {
        this.getResults().push(...results);
        if (body.next_page_token) {
        this.requestUrl = this.url + "&pagetoken=" + body.next_page_token;
        console.log(body.next_page_token);
        //recursive callback for next 20 dataset from google
        setTimeout(this.getData.bind(this), 2000);
        } else {
        body.results = this.getResults();
        this.dataCallback(null, body);
        }
        }
        },
        dataCallback: function (err, body) {
        if (err) this.res.send(err);
        else {
        this.res.send(body);
        }
        }
        });


/*
 Route for 'GET' google near by places data
 Query Param: latitude
 Query Param: longitude
 Query Param: radius
 */
/*
 Route for 'GET' google near by places data
 Query Param: latitude
 Query Param: longitude
 Query Param: radius
 */
app.get("/getData", function (req, res) {
  var getDataRecursiveObj = new getDataRecursive(req.query.latitude, req.query.longitude, req.query.radius, res);
  var getDataRecursiveObj = new getDataRecursive(latitude, longitude, radius, res);
  getDataRecursiveObj.getData();
  });

app.listen(port);
