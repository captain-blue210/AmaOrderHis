const TARGET_GOODS_NAMES = [
  'パッド',
  'テープ',
  'イブA錠',
  'ミノン',
  'ラップ',
  '包帯',
  '舌圧子',
  'ワセリン',
  '作業着',
];

const testNotTarget = 'テスト'; // 対象ではない
const testTarget1 = 'ワセリン'; // 完全一致
const testTarget2 = 'テストパッドテスト'; // 部分一致
const testTarget3 = 'ライブテスト';

const isMedical = (target: string): boolean => {
  if (TARGET_GOODS_NAMES.some((word) => target.includes(word))) {
    return true;
  }
  return false;
};

console.log(isMedical(testNotTarget));
console.log(isMedical(testTarget1));
console.log(isMedical(testTarget2));
console.log(isMedical(testTarget3));

const orderData = [
  {
    orderDate: '2021年1月21日',
    items: [
      {
        goodsName: 'テスト1',
        goodsPrice: 2427,
      },
      {
        goodsName: 'ワセリン',
        goodsPrice: 1550,
      },
    ],
  },
  {
    orderDate: '2021年1月22日',
    items: [
      {
        goodsName: 'テスト3',
        goodsPrice: 1000,
      },
      {
        goodsName: 'テスト4',
        goodsPrice: 2000,
      },
    ],
  },
];

const totalAmount = Array.from(orderData)
  ?.map((order) => {
    //console.log(order.items);
    return order?.items;
  })
  ?.flatMap((items) => items)
  ?.filter((item) => isMedical(item.goodsName))
  ?.flatMap((item) => item.goodsPrice)
  ?.reduce((total, price) => total + price);
console.log(totalAmount);

let resultTxt = '総合計金額 : ' + totalAmount + '\n\n';

const filteredOrders = orderData?.map((order) => {
  return order?.items;
});

orderData.forEach((order, index) => {
  resultTxt += `注文${index + 1} :
注文日 : ${order.orderDate}
`;

  order.items.forEach((item) => {
    resultTxt += `商品名 : ${item.goodsName}
金額 : ${item.goodsPrice.toLocaleString()}
`;
  });

  const subtotal = order.items
    ?.flatMap((item) => item.goodsPrice)
    ?.reduce((total, price) => total + price);

  resultTxt += '合計 : ' + subtotal + '\n\n';
});

console.log(resultTxt);
