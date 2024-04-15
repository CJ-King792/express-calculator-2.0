var express = require('express');
var router = express.Router();

/*  GET and POST Routes */

// GET route for home page
router.get('/', function(req, res, next) {
  res.render('login');
});

router.get("/signup", (req, res) => {
  res.render("signup");
})

// GET route for home insurance page
router.get('/home_insurance', function(req, res, next) {
  res.render('home_insurance_form');
});

router.post("/signup", async (req, res) => {
  const data = {
    name: req.body.username,
    password: req.body.password
  }

  const userdata = await Collection.insertMany(data);
  console.log(userdata);
  
});

// POST route home insurance (Handles form submission and performs calculations)
router.post('/home_insurance', function(req, res, next) {
  const {home_age, dwelling_type, heating_type} = req.body;
  const result = performHomePremiumCalculation(home_age, dwelling_type, heating_type)
  
  res.send(`Result for home insurance quote: ${result}`)
})

// GET route for auto insurance page
router.get('/auto_insurance', function(req, res, next) {
  res.render('auto_insurance_form');
});

// POST route for auto insurance (Handles form submission and performs calculations)
router.post('/auto_insurance', function(req, res, next) {
  const {car_value, driver_age, dwelling_area, accidents} = req.body;
  const result = performAutoPremiumCalculation(driver_age, dwelling_area, accidents)

  res.send(`Result for autto insurance quote: ${result}`)
 })



 /* Functions */

 // function to calculate the home premium insurance 
 function performHomePremiumCalculation(home_age, dwelling_type, heating_type) {
  let home_result = 0.00;
  let home_age_factor = 0.00;
  let dwelling_factor = 0.00;
  let heating_factor = 0.00;

  // calculation to get the home age factor that will be used to calculate the final result
  if (home_age < 25) {
    home_age_factor = 1.00;
  } else if (home_age < 50 && home_age > 24) {
    home_age_factor = 1.25;
  } else if (home_age >= 50) {
    home_age_factor = 1.50;
  }

  // set the dwelling factor depending on user choice
  switch(dwelling_type) {
    case 'single':
      dwelling_factor += 1.00;
      break;
    case 'apartment':
      dwelling_factor += 0.75;
      break;
    case 'bungalow':
      dwelling_factor += 1.00;
      break;
    case 'semi':
      dwelling_factor += 1.15;
      break;
    default:
      dwelling_factor = 1.00;
  }

  // do the same thing for the heating type
  switch(heating_type) {
    case 'electric':
      heating_factor += 1.00;
      break;
    case 'oil':
      heating_factor += 2.00;
      break;
    case 'wood':
      heating_factor += 1.25;
      break;
    case 'gas':
      heating_factor += 1.00;
      break;
    case 'other':
      heating_factor += 1.00;
    default:
      heating_factor += 1.00;
  }

  // final result gets calculated and returned to the html page
  home_result = 500.00 * home_age_factor * dwelling_factor * heating_factor;
  return home_result.toFixed(2); 
 }

 // function to calculate the auto premium insurance 
 function performAutoPremiumCalculation(driver_age, dwelling_area, accidents) {
  let auto_result = 0.00;
  let driver_age_factor = 0.00;
  let area_factor = 0.00;
  let accident_factor = 0.00;

  // calculation to get the driver age factor that will be used to calculate the final result
  if (driver_age < 25) {
    driver_age_factor = 2.00;
  } else {
    driver_age_factor = 1.00;
  }

  // set the area factor depending on user choice
  switch(dwelling_area) {
    case 'dense_urban':
      area_factor += 1.50;
      break;
    case 'urban':
      area_factor += 1.25;
      break;
    case 'rural':
      area_factor += 1.00;
      break;
  }

  // do the same thing for the accident factor
  switch(accidents) {
    case 'none':
      accident_factor += 1.00;
      break;
    case 'one_in_five':
      accident_factor += 1.25;
      break;
    case 'two_in_five':
      accident_factor += 2.50;
      break;
  }

  // final result gets calculated and returned to the html page
  auto_result = 750.00 * driver_age_factor * area_factor * accident_factor;
  return auto_result.toFixed(2); 
 }


module.exports = router;
