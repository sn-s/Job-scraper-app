const request = require("request-promise");
const cheerio = require("cheerio");

const scrapeFunc = async (job, city, sort) => {
  // indeed scraping
  const indeedFunc = async () => {
    try {
      let url;
      if (sort === "relevance")
        url = `https://www.indeed.co.uk/jobs?q=${job}&l=${city}`;
      if (sort === "date")
        url = `https://www.indeed.co.uk/jobs?q=${job}&l=${city}&sort=date`;
      const response = await request(url);
      const jobsarray = [];
      const $ = cheerio.load(response);
      $(".tapItem.fs-unmask.result").each((i, el) => {
        const header = $(el).find(".jobTitle");
        const title = header.text().trim();
        const link = "https://uk.indeed.com" + $(el).attr("href");
        const company = $(el).find(".companyName").text().trim();
        const location = $(el).find(".companyLocation").text().trim();
        const salary = $(el).find(".salary-snippet").text().trim();
        const date = $(el).find(".date").text().trim();
        jobsarray.push({ title, link, company, location, salary, date });
      });
      return { Indeed: jobsarray };
    } catch (error) {
      console.log(error);
    }
  };

  // cvLibrary scraping
  const cvLibraryFunc = async () => {
    try {
      let url;
      if (sort === "relevance")
        url = `https://www.cv-library.co.uk/search-jobs?distance=15&geo=${city}&offset=0&order=sm&posted=&q=${job}&salarymax=&salarymin=&salarytype=annum&tempperm=Any`;
      if (sort === "date")
        url = `https://www.cv-library.co.uk/search-jobs?distance=15&geo=${city}&offset=0&order=date&posted=&q=${job}&salarymax=&salarymin=&salarytype=annum&tempperm=Any`;
      const response = await request(url);
      const jobsarray = [];
      const $ = cheerio.load(response);
      $(".job.search-card").each((i, el) => {
        const header = $(el).find(".job__title a");
        const title = header.text().trim();
        const link = "https://www.cv-library.co.uk" + header.attr("href");
        const company = $(el)
          .find(".job__details-value.text--semibold")
          .text()
          .trim();
        const location = $(el).find(".job__details-location").text().trim();
        const salary = $(el).find(".job__details-value.salary").text().trim();
        const type = $(el)
          .find(".job__details.l-flex-row dd[class='job__details-value']")
          .text()
          .trim();
        const date = $(el).find(".job__posted").text().trim();

        jobsarray.push({ title, link, company, location, salary, type, date });
      });
      return { "CV Library": jobsarray };
    } catch (error) {
      console.log(error);
    }
  };

  // reed scraping
  const reedFunc = async () => {
    try {
      let url;
      if (sort === "relevance")
        url = `https://www.reed.co.uk/jobs/${job}-jobs-in-${city}`;
      if (sort === "date")
        url = `https://www.reed.co.uk/jobs/${job}-jobs-in-${city}?sortby=DisplayDate`;
      const response = await request(url);
      const jobsarray = [];
      const $ = cheerio.load(response);
      $(".job-result").each((i, el) => {
        const header = $(el).find(".title a");
        const title = header.text().trim();
        const link = "https://www.reed.co.uk" + header.attr("href");
        const company = $(el).find(".posted-by a").text().trim();
        const location = $(el).find(".location span").text().trim();
        const salary = $(el).find(".salary").text().trim();
        const type = $(el).find(".time").text().trim();
        const date = $(el).find(".posted-by").text().trim().split("by")[0];

        jobsarray.push({ title, link, company, location, salary, type, date });
      });
      return { Reed: jobsarray };
    } catch (error) {
      console.log(error);
    }
  };

  const results = await Promise.all([
    indeedFunc(),
    cvLibraryFunc(),
    reedFunc(),
  ]);
  return results;
};

module.exports = {
  scrapeFunc,
};
