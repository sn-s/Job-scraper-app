const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const scraper = require("./scraper")
const server = require("http").createServer(app);

const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(cors());

// serve build folder
app.use(express.static(__dirname + "/../build"));

app.post("/search", async (req, res) => {
  console.log(req.body.job, req.body.city, req.body.sort);
  try {
  const pageData = await scraper.scrapeFunc(req.body.job, req.body.city, req.body.sort)
  res.send([{items: {
    Indeed: pageData[0].Indeed,
    "CV Library": pageData[1]["CV Library"],
    Reed: pageData[2].Reed
  }}]);

  } catch (error) {
    console.log(error)
  }
})

server.listen(port, () => console.log(`App listening on port ${port}!`));