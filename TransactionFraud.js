const convertArrayToObject = (array) => {
  let obj = array.reduce((prevObj, item) => {
    const line = item.split(',');
    const person = line[0];

    line.shift();
    line[0] = Number(line[0]);

    prevObj[person] = [...(prevObj[person] || []), [...line]].sort();

    return prevObj;
  }, {});

  return Object.fromEntries(Object.entries(obj).sort());
};

const TIME = 0;
const CITY = 2;
const DIFF = 60;

const checkInvalidTransactions = (data) => {
  const groupedTransaction = convertArrayToObject(data);
  let fraudulentTransactions = [];
  Object.entries(groupedTransaction).forEach(([sender, transactions]) => {
    const len = transactions.length;
    let found = false; // avoid double insertion if 3 consecutive frauds detected
    transactions.forEach((current, index) => {
      if (index <= len - 2 && current[CITY] !== transactions[index + 1][CITY]) {
        if (transactions[index + 1][TIME] - current[TIME] <= DIFF) {
          if (!found) fraudulentTransactions.push([sender, ...current]);
          fraudulentTransactions.push([sender, ...transactions[index + 1]]);
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
  'bob,627,1973,amsterdam',
  'alex,387,885,bangkok',
  'alex,355,1029,barcelona',
  'alex,587,402,bangkok',
  'chalicefy,973,830,barcelona',
  'alex,932,86,bangkok',
  'bob,188,989,amsterdam'
];

console.log('fraud transactions:', checkInvalidTransactions(transactions));
