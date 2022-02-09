const convertArrayToObject = (array, key) => {
  const initialValue = {};
  return array.reduce((obj, item) => {
    return {
      ...obj,
      [item[key]]: item
    };
  }, initialValue);
};

const TIME = 0;
const CITY = 2;
const DIFF = 30;

const checkInvalidTransactions = (data) => {
  const trans = data.map((tran) => {
    let separated = tran.split(',');
    let obj = {
      sender: separated[0],
      time: separated[1],
      amount: separated[2],
      city: separated[3]
    };
    return obj;
  });
  console.log(
    '🚀 ~ file: TransactionFraud.js ~ line 25 ~ trans ~ trans',
    trans
  );
  const groupedTransaction = convertArrayToObject(trans, 'sender');
  console.log(
    '🚀 ~ file: TransactionFraud.js ~ line 63 ~ checkInvalidTransactions ~ groupedTransaction',
    groupedTransaction
  );
  let fraudulentTransactions = [];
  Object.entries(groupedTransaction).forEach(([name, transactions]) => {
    const len = transactions.length;
    let found = false; // avoid double insertion if 3 consecutive frauds detected
    transactions.forEach((current, index) => {
      if (index <= len - 2 && current[CITY] !== transactions[index + 1][CITY]) {
        if (transactions[index + 1][TIME] - current[TIME] <= DIFF) {
          if (!found) fraudulentTransactions.push([name, ...current]);
          fraudulentTransactions.push([name, ...transactions[index + 1]]);
          found = true;
        } else {
          found = false;
        }
      }
    });
  });
  return fraudulentTransactions;
};

const transactions = [
  'bob,627,1973,surabaya',
  'alice,387,885,jakarta',
  'alice,355,1029,bali',
  'alice,587,402,jakarta',
  'charlie,973,830,manado',
  'alice,932,86,jakarta',
  'bob,188,989,surabaya'
];

console.log(checkInvalidTransactions(transactions));
