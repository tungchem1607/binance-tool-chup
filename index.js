const fs = require("fs");
const puppeteer = require("puppeteer");
const pages = require("./pages.json");
const schedule = require("node-schedule");
const TelegramBot = require("node-telegram-bot-api");
const delay = require("delay");
var cronExpress = "0 0,15,30,45 * * * *";

// 2089944036:AAGq7a5G9cyRJG8ZMTqlubSSQXi73pqI9Xk - 1
// 2046460582:AAH3epCEsxQ0zBqSSlRfKLLLthogo7iQnGk - 2
// 2023827143:AAFR9qIuoKusApF9rCQSlEcBjCNflgoHLbs - BINANCE3


const telegram = new TelegramBot(
  "2023827143:AAFR9qIuoKusApF9rCQSlEcBjCNflgoHLbs",
  {
    polling: true,
  }
);
var browser = null;

async function captureScreenshot(profile) {
  // if screenshots directory is not exist then create one
  if (!fs.existsSync("screenshots")) {
    fs.mkdirSync("screenshots");
  }

  try {
    // create new page object
    const page = await browser.newPage();

    // set viewport width and height
    await page.setViewport({ width: 1440, height: 1080 });

    await page.goto(`https://www.binance.com/en/futures/${profile}`, {
      waitUntil: ["load", "domcontentloaded", "networkidle0", "networkidle2"],
      timeout: 0,
    });
    await Promise.all([
      await page.click(
        "#__APP > div > div:nth-child(3) > div > div > div.react-grid-layout.layout > div:nth-child(3) > div > div > div > div > div.css-clcac0 > div > div.css-11p1izr > svg.css-y4lg06 > path"
      ),
      // await page.waitForNetworkIdle(page)
    ]);
    // schedule.scheduleJob(`Start ${profile.name}`, cronExpress, async () => {
    //   // capture screenshot and store it into screenshots directory.
    //   await pagesizeI.screenshot({ path: `screenshots/${profile.id}.jpeg` });
    //   console.log(`✅ ${profile.name} - (${profile.url})`);
    // });
  } catch (err) {
    console.log(`❌ Error: ${err.message}`);
  }
  // finally {
  //   await browser.close();
  //   console.log(`\n🎉 GitHub profile screenshots captured.`);
  // }
}

async function main() {
  try {
    browser = await puppeteer.launch({
      headless: false,
      args: [
        "--disable-gpu",
        "--disable-dev-shm-usage",
        "--disable-setuid-sandbox",
        "--no-first-run",
        "--no-sandbox",
        "--no-zygote",
        "--deterministic-fetch",
        "--disable-features=IsolateOrigins",
        "--disable-site-isolation-trials",
        // '--single-process',
      ],
    });

    for (const profile of pages) {
      await captureScreenshot(profile);
    }
    let pagesize = await browser.pages();
    // if (pagesize.length > 1) {
    //   await pagesize[0].close();
    // }
    schedule.scheduleJob(cronExpress, async () => {
      let countJ = 0;
      for (let i = 1; i < pagesize.length; i++) {
        // await pagesizeI.screenshot({ path: `screenshots/BNBUSDT.jpeg` });
        // console.log(`✅ ${pagesizeI.url()}`);
        // console.log(`✅ ${pages[i - 1].id} - (${pages[i - 1].url})`);
        await pagesize[i].bringToFront();
        // capture screenshot and store it into screenshots directory.
        await pagesize[i].screenshot({
          path: `screenshots/${pages[i - 1]}.png`,
        });
        telegram.sendPhoto(-601617264, `./screenshots/${pages[i - 1]}.png`, {
          caption: `Cặp: ${pages[i - 1]}`,
        });
        countJ = countJ + 1;
        if (countJ == 2) {
          await delay(1000);
          countJ = 0;
        }
        // telegram.sendMessage(
        //   chat.id,
        //   "[​​​​​​​​​​​](https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Stack_Overflow_logo.svg/200px-Stack_Overflow_logo.svg.png) Some text here.",
        //   { parse_mode: "markdown" }
        // );
        console.log(`✅ ${pages[i - 1]} - (${pages[i - 1]})`);
      }
    });
  } catch (err) {
    console.log(`❌ Error: ${err.message}`);
  }
}

main();

async function captureMultipleScreenshots() {
  if (!fs.existsSync("screenshots")) {
    fs.mkdirSync("screenshots");
  }

  let browser = null;

  try {
    // launch headless Chromium browser
    browser = await puppeteer.launch({
      headless: false,
    });
    // create new page object
    const page = await browser.newPage();

    // set viewport width and height
    await page.setViewport({
      width: 1440,
      height: 1080,
    });
    await page.setDefaultNavigationTimeout(0);
    for (const { id, name, url } of pages) {
      await page.goto(url, {
        waitUntil: ["load", "domcontentloaded", "networkidle0", "networkidle2"],
        timeout: 0,
      });
      await Promise.all([
        await page.click(
          "#__APP > div > div:nth-child(3) > div > div > div.react-grid-layout.layout > div:nth-child(3) > div > div > div > div > div.css-clcac0 > div > div.css-11p1izr > svg.css-y4lg06 > path"
        ),
        // await page.waitForNetworkIdle(page)
      ]);
      // await page.waitForNavigation({ waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2'] });
      // await page.waitForSelector('#__APP > div > div:nth-child(3) > div > div > div > div > div > div.draggableCancel.css-4hqzyo > div > div > div.kline-container.css-vurnku', {
      //   visible: false,
      // });
      // await page.waitForSelector('#__APP > div > div:nth-child(3) > div > div')
      await page.screenshot({ path: `screenshots/${id}.jpeg` });
      console.log(`✅ ${name} - (${url})`);
    }
  } catch (err) {
    console.log(`❌ Error: ${err.message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
    console.log(`\n🎉 ${pages.length} screenshots captured.`);
  }
}
// captureMultipleScreenshots();
