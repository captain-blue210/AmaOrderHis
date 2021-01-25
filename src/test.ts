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

const testNotTarget = 'テスト'; // 対象ではない
const testTarget1 = 'ワセリン'; // 完全一致
const testTarget2 = 'テストパッドテスト'; // 部分一致
const testTarget3 = 'ライブテスト';

const isMedical = (target: string): boolean => {
  if (!TARGET_GOODS_NAMES.some((word) => target.includes(word))) {
    return false;
  }
  return true;
};

console.log(isMedical(testNotTarget));
console.log(isMedical(testTarget1));
console.log(isMedical(testTarget2));
console.log(isMedical(testTarget3));
