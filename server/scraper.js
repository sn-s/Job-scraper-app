const cheerio = require("cheerio");
// const request = require("request-promise");
const axios = require("axios");
// const fixieRequest = request.defaults({
//   proxy: process.env.REACT_APP_FIXIE_URL,
// });

const scrapeFunc = async (job, city, sort) => {
  // Adzuna scraping
  const adzunaFunc = async () => {
    try {
      let url;
      if (sort === "relevance")
        url = `https://www.adzuna.co.uk/jobs/search?q=${job}&w=${city}`;
      if (sort === "date")
        url = `https://www.adzuna.co.uk/jobs/search?q=${job}&w=${city}&sb=date`;

      ////////// axios //////////
      const response = await axios(url);
      const html = response.data;

      // const response = await request(url);
      // const response = await fixieRequest(url);

      const jobsarray = [];
      const $ = cheerio.load(html);
      $("div .a.flex.gap-2").each((i, el) => {
        const header = $(el).find('[data-js="jobLink"]');
        const title = header.text().trim();
        const link = header.attr("href");
        const company = $(el).find(".ui-company").text().trim();
        const location = $(el).find(".ui-location").text().trim();
        const salary = $(el).find(".ui-salary")[0]
          ? $(el).find(".ui-salary")[0].children[0].data.trim()
          : "";
        jobsarray.push({ title, link, company, location, salary });
      });
      return { Adzuna: jobsarray };
    } catch (error) {
      console.log(error);
    }
  };

  // CVLibrary scraping
  const CVLibraryFunc = async () => {
    try {
      let url;
      if (sort === "relevance")
        url = `https://www.cv-library.co.uk/${job}-jobs-in-${city}`;
      if (sort === "date")
        url = `https://www.cv-library.co.uk/${job}-jobs-in-${city}?order=date`;

      ////////// axios //////////
      const response = await axios(url);
      const html = response.data;

      // const response = await request(url);
      // const response = await fixieRequest(url);

      const jobsarray = [];
      const $ = cheerio.load(html);
      $(".job.search-card").each((i, el) => {
        const header = $(el).find(".job__title a");
        const title = header.text().trim();
        const link = "https://www.cv-library.co.uk" + header.attr("href");
        const company = $(el).find(".job__company-link").text().trim();
        const location = $(el).find(".job__details-location").text().trim();
        const salary = $(el).find(".job__details-value.salary").text().trim();
        const type = $(el)
          .find(".job__details.l-flex-row dd[class='job__details-value']")
          .text()
          .trim();
        const date = $(el).find(".job__posted-by span").text().trim();

        jobsarray.push({ title, link, company, location, salary, type, date });
      });
      return { CVLibrary: jobsarray };
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

      ////////// axios //////////
      const response = await axios(url);
      const html = response.data;

      // const response = await request(url);
      // const response = await fixieRequest(url);

      const jobsarray = [];
      const $ = cheerio.load(html);
      $(".card.job-card_jobCard__MkcJD").each((i, el) => {
        const header = $(el).find('[data-element="job_title"]');
        const title = header.text().trim();
        const link = "https://www.reed.co.uk" + header.attr("href");
        const company = $(el).find(".gtmJobListingPostedBy").text().trim();
        const location = $(el)
          .find(
            ".job-card_jobMetadata__item___QNud.list-group-item:nth-child(2)"
          )
          .text()
          .trim();
        const salary = $(el)
          .find(
            ".job-card_jobMetadata__item___QNud.list-group-item:nth-child(1)"
          )
          .text()
          .trim();
        const type = $(el)
          .find(
            ".job-card_jobMetadata__item___QNud.list-group-item:nth-child(3)"
          )
          .text()
          .trim();
        const date = $(el)
          .find(".job-card_jobResultHeading__postedBy__sK_25")[0]
          .childNodes[0].nodeValue.trim();

        jobsarray.push({ title, link, company, location, salary, type, date });
      });
      return { Reed: jobsarray };
    } catch (error) {
      console.log(error);
    }
  };

  const results = await Promise.all([
    adzunaFunc(),
    CVLibraryFunc(),
    reedFunc(),
  ]);
  console.log(results);
  return results;
};

module.exports = {
  scrapeFunc,
};
