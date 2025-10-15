const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
app.set('view engine', 'ejs'); // Set EJS as the view engine
app.set('views', path.join(__dirname, '/')); // Set the views directory to the current directory

app.use(bodyParser.urlencoded({ extended: true }));

// Make the root path return the index.ejs file
app.get("/", (req, res) => {
  // Pass an object with bmi set to null for the initial render
  res.render("index", { bmi: null });
});

// Calculate the BMI from the form post
app.post("/", (req, res) => {
  const weight = parseFloat(req.body.weight);
  const height = parseFloat(req.body.height);

  if (isNaN(weight) || isNaN(height) || height === 0) {
    return res.status(400).send("Please enter valid weight and height.");
  }

  const bmi = (weight / Math.pow(height, 2)) * 10000;
  // Pass the result inside an object
  res.render('index', { bmi: bmi.toFixed(2) });
});

// Create an express server, make sure it is listening the port 3000
app.listen(3000, () => {
  console.log("Server started on port 3000");
});