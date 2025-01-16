const cheerio = require("cheerio");
const axios = require("axios");
const urlResolver = require('url');

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
  'Referer': 'https://www.google.com/',
  'Cache-Control': 'max-age=0'
};


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
      const response = await axios(url, headers);
      const html = response.data;

      const jobsarray = [];
      const $ = cheerio.load(html);
      $("div .a.flex.gap-2").each((i, el) => {
        const header = $(el).find('[data-js=jobLink]');
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

  // Totaljobs scraping
  const totaljobsFunc = async () => {
    try {
      let url;
      if (sort === "relevance")
        url = `https://www.totaljobs.com/jobs/${job}/in-${city}?radius=10&sort=1&action=sort_relevance`;
      if (sort === "date")
        url = `https://www.totaljobs.com/jobs/${job}/in-${city}?radius=10&sort=2&action=sort_publish`;

      ////////// axios //////////
      const response = await axios(url, headers);
      const html = response.data;

      const jobsarray = [];
      const $ = cheerio.load(html);
      const baseUrl = 'https://www.totaljobs.com'

        $("[data-testid=job-item]").each((i, el) => {
            const header = $(el).find("[data-testid=job-item-title]");
            const title = header.text().trim();
            const relativeLink = header.attr("href");
            const link = urlResolver.resolve(baseUrl, relativeLink);
            const company = $(el).find("[data-at=job-item-company-name]").text().trim();
            const location = $(el).find("[data-at=job-item-location]").text().trim();
            const salary = $(el).find("[data-at=job-item-salary-info]").text().trim();
            const date = $(el).find("[data-at=job-item-timeago]").text().trim();
            jobsarray.push({ title, link, company, location, salary, date });
        });
        return { Totaljobs: jobsarray };
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
      const response = await axios(url, headers);
      const html = response.data;

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
    totaljobsFunc(),
    reedFunc(),
  ]);
  console.log(results);
  return results;
};

module.exports = {
  scrapeFunc,
};