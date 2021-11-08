import * as puppeteer from "puppeteer";
import * as fs from "fs";

const PAGE_URL = "https://www.hansimmo.be/nieuwbouw-te-koop-in-stabroek/10296";

const main = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(PAGE_URL);

  const items = await page.evaluate(() => {
    return {
      description: document
        .querySelector("#description")
        ?.textContent?.replace(/(\n)/gm, ""),
      title: document.querySelector("#detail-title > div.category")
        ?.textContent,
      price: document.querySelector("#detail-title > div.price")?.textContent,
      address: document.querySelector("#detail-title > div.address")
        ?.textContent,
    };
  });

  await browser.close();

  console.log(items);

  return items;
};

main().then((data) => {
  const json = JSON.stringify(data, null, 4);
  fs.writeFile("podatki.json", json, function (err: any) {
    if (err) throw err;
    console.log("completed saving json file");
  });
});
