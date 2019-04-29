var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
let airportDB = require('../convertcsv.js').arrays
const url = require('url');

const querystring = require('querystring');
let parsedQs = querystring.parse(airportDB.query);
var request = require('request-promise');
const _ = require('lodash');
var Fuse = require('fuse.js');


router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json())

/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });



});

//http://localhost:3000/airports
router.get('/airports', function (req, res, next) {
  res.json(airportDB)

});

//http://localhost:3000/airport/sfx
router.get('/airport/:iata_code', (req, res, next) => {

  let ids=[]
    for (let j = 0; j < airportDB.airports.length; j++) {
        let id = airportDB.airports[j];
        ids.push(id);
      
    }

  let iata_code = ids.find(c => c.iata_code===req.params.iata_code.toUpperCase());
  console.log(iata_code);

  if(!iata_code)
    res.status(404).send("there's no iata_code "+req.param.iata_code);
  
   res.json(iata_code);
});


//http: //localhost:3000/airport/hongkong/name
router.get('/airport/:name/name',  (req, res, next) => {

  let airportname = []
  for (let j = 0; j < airportDB.airports.length; j++) {
    let id = airportDB.airports[j];
    airportname.push(id);

  }
var promise1 = new Promise(function(resolve, reject) {

  var options = {
    shouldSort: true,
   // caseSensitive: true,
    findAllMatches: true,
    includeMatches: true,
    threshold: 0.3,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 7,
    keys: [
      "name"
    ]
  };
  var fuse = new Fuse(airportname, options); 
  var result = fuse.search(req.params.name)
 console.log(result)
  resolve(result)
});


promise1.then((data)=> {
               res.json(data)
            }).catch((err)=>{
                console.log(err)
              
            })

  if (!data)
    res.status(404).json("there's no name" + req.params.name);
})

module.exports = router
