const { default: Axios } = require("axios");
const { Telegraf } = require("telegraf");
require("dotenv").config();

let url = "https://careers.deliveryhero.com/widgets";

let payload = {
  lang: "en_global",
  deviceType: "desktop",
  country: "global",
  ddoKey: "refineSearch",
  sortBy: "",
  subsearch: "",
  from: 0,
  jobs: true,
  counts: true,
  all_fields: [
    "country",
    "city",
    "brand",
    "category",
    "subCategory",
    "jobType",
  ],
  pageName: "search-results",
  size: 10,
  clearAll: false,
  jdsource: "facets",
  isSliderEnable: false,
  pageId: "page11",
  siteType: "external",
  keywords: "",
  global: true,
  selected_fields: {
    country: ["Germany"],
    city: ["Berlin"],
    brand: ["Delivery Hero SE"],
    category: ["Tech"],
    subCategory: ["Tech - Frontend"],
    jobType: ["Permanent"],
  },
};

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) =>
  ctx.reply("Welcome to Delivery Hero vacancies searching bot!")
);

bot.command("search", async (ctx) => {
  const response = await Axios.post(url, payload);
  const jobs = response.data.refineSearch.data.jobs;
  const cleanJobs = jobs.map((job) => {
    return {
      title: job.title,
      description: job.descriptionTeaser,
      url: job.applyUrl,
    };
  });

  const myJobs = cleanJobs.filter((job) => job.title.includes("junior"));

  if (!myJobs.length) return ctx.reply("No results found.");

  for (let job of myJobs) {
    ctx.reply("Found job");
    ctx.reply(job.title);
    ctx.reply(job.url);
  }
});

bot.launch();
