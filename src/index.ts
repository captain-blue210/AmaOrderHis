import dotenv from 'dotenv';
import * as fs from 'fs';
import puppeteer from 'puppeteer';

const BASE_YEAR = 2020;
const BASE_URL = `https://www.amazon.co.jp/gp/your-account/order-history?orderFilter=year-${BASE_YEAR}`;
const PER_PAGE = 10;
const TARGET_GOODS_NAMES = [
  'パッド',
  'テープ',
  'イブ',
  'ミノン',
  'ラップ',
  '包帯',
  '舌圧子',
  'ワセリン',
  '作業着',
];

dotenv.config();

(async () => {
  const orderData: {
    orderDate: string | undefined;
    items: { goodsName: string | undefined; goodsPrice: number }[];
  }[] = [];

  const browser = await puppeteer.launch({
    headless: false,
    //slowMo: 1000,
    executablePath:
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  });

  const page = await browser.newPage();
  const navPromise = page.waitForNavigation();

  await page.goto(`${BASE_URL}`);
  await navPromise;

  // メールアドレスを入力
  await page.type('#ap_email', process.env.AP_EMAIL ?? '');
  await page.click('#continue');

  // パスワードを入力
  await page.waitForSelector('#ap_password');
  await page.type('#ap_password', process.env.AP_PASSWORD ?? '');
  await page.click('#signInSubmit');

  // 二段階認証入力(手動)
  await page.waitForTimeout(20000);
  await navPromise;

  // 最大ページインデックス取得
  const maxPageIndex = await page.evaluate(() => {
    return (
      Math.floor(
        Number(
          document
            ?.querySelector('span.num-orders')
            ?.textContent?.replace('件', '')
        ) / 10
      ) * 10
    );
  });

  // 対象年にある注文数分ループする
  for (let i = 0; i <= maxPageIndex; i += PER_PAGE) {
    const currenPageUrl = `${BASE_URL}&startIndex=${i}`;
    await page.goto(currenPageUrl);
    await page.waitForTimeout(1000);

    // 1ページにある注文全体を取得
    await page.waitForSelector('div#ordersContainer');
    const orders = await page.$$('div#ordersContainer div.a-box-group');

    for (const order of orders) {
      const orderDetails = await order.$$('div.a-box');

      let orderDate;
      let items = [];
      for (let i = 0; i < orderDetails.length; i++) {
        const detail = orderDetails[i];
        if (i === 0) {
          orderDate = await detail.evaluate((elm) => {
            return elm
              .querySelector(
                'div.a-fixed-right-grid-col.a-col-left > div > div.a-column.a-span3 > div.a-row.a-size-base > span'
              )
              ?.textContent?.trim();
          });
          console.log(orderDate);
        } else {
          const itemDetails = await detail.$$(
            'div.a-fixed-left-grid-col.a-col-right'
          );

          for (const item of itemDetails) {
            const goodsName = await item.evaluate((elm) => {
              return elm
                .querySelector('div.a-row:nth-child(1)')
                ?.textContent?.trim();
            });

            const goodsPrice = await item.evaluate((elm) => {
              return elm
                .querySelector('div.a-row span.a-color-price')
                ?.textContent?.trim()
                .replace(/[￥\s,]/g, '');
            });

            const itemInfo =
              goodsPrice === undefined
                ? { goodsName: goodsName, goodsPrice: 0 }
                : { goodsName: goodsName, goodsPrice: Number(goodsPrice) };

            if (TARGET_GOODS_NAMES.some((word) => goodsName?.includes(word))) {
              items.push(itemInfo);
            }
            console.log(items);
          }
        }
      }
      if (items.length > 0) {
        let orderInfo = { orderDate, items };
        orderData.push(orderInfo);
      }
    }
  }

  await browser.close();

  const totalAmount = orderData
    ?.map((order) => {
      //console.log(order.items);
      return order?.items;
    })
    ?.flatMap((items) => items)
    ?.flatMap((item) => item.goodsPrice)
    ?.reduce((total, price) => total + price);

  let resultTxt = '総合計金額 : ' + totalAmount + '\n\n';
  orderData.forEach((order, index) => {
    resultTxt += `注文${index + 1} :
注文日 : ${order.orderDate}
`;

    order.items.forEach((item) => {
      resultTxt += `商品名 : ${item.goodsName}
金額 : ${item.goodsPrice.toLocaleString()}
`;
      item.goodsName;
    });

    const subtotal = order.items
      .flatMap((item) => item.goodsPrice)
      .reduce((total, price) => total + price);

    resultTxt += '合計 : ' + subtotal + '\n\n';
  });

  fs.writeFileSync('ama-order-his.txt', resultTxt);
})();
