javascript: (function () {
  const orderData = [];

  const orders = document.querySelectorAll(
    'div#ordersContainer div.a-box-group'
  );

  for (const order of orders) {
    const orderDetails = order.querySelectorAll('div.a-box'); //22

    let orderDate = '';
    let items = [];
    for (let i = 0; i < orderDetails.length; i++) {
      const detail = orderDetails[i];
      if (i === 0) {
        orderDate = detail
          .querySelector(
            'div.a-fixed-right-grid-col.a-col-left > div > div.a-column.a-span3 > div.a-row.a-size-base > span'
          )
          ?.textContent?.trim();
      } else {
        const itemDetails = detail.querySelectorAll(
          'div.a-fixed-left-grid-col.a-col-right'
        );

        for (const item of itemDetails) {
          const extractItemData = (num) => {
            return item
              .querySelector(`div.a-row:nth-child(${num})`)
              ?.textContent?.trim();
          };

          const goodsName = extractItemData(1);
          const goodsPrice = extractItemData(3);
          let itemInfo = { goodsName, goodsPrice };
          items.push(itemInfo);
        }
      }
    }
    let orderInfo = { orderDate, items };
    orderData.push(orderInfo);
  }
  console.table(orderData);
})();
