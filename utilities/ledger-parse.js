let currency = '';

import shortid from 'shortid';

const RegPost = /^(?:[ ]{2,})((?:[\w\:]|(?:[ ]\w))*)(?:[ ]{2,}|)(\$?)(?:[ ]*)([\.\-0-9]*)/i;
const RegDate = /^(2[0-9]+\/[0-9]{2}\/[0-9]{2})(?:[ ]*)([\*\! ]{1})(?:[ ]*)([ a-z0-9\(\)'*.\/]+)/i;

const parseLedger = srcStr =>
  new Promise((res, rej) => {
    tArray = srcStr.split('\n');
    let transaction = {};
    let transactions = [];

    tArray.forEach(function(e) {
      if (e.match(RegDate)) {
        // If coming from a previous transaction
        if (transaction.payee) {
          transactions.push(transaction);
        }
        transaction = {};
        transaction.id = shortid.generate();
        //Starts the parsing
        var matched = e.match(RegDate);
        transaction.date = matched[1];
        transaction.consolidated = matched[2];
        transaction.payee = matched[3];
        transaction.postings = [];
      } else if (e.match(RegPost)) {
        var matched = e.match(RegPost), posting = {};
        posting.account = matched[1].split(':');
        posting.currency = matched[2];
        posting.amount = matched[3];
        transaction.postings.push(posting);
      }
    });

    if (transaction.payee) {
      transactions.push(transaction);
      transaction = {};
    }

    res(transactions);
  });

const serialize = items => {
  return '';
};

module.exports.parseLedger = parseLedger;

// exports.add = function(transaction) {
//   if (
//     !transaction.date ||
//     !transaction.payee ||
//     !transaction.postings[0].account
//   ) {
//     return [400, "Can't add transaction, format not compatible"];
//   }

//   var tPostings = [], tString = '\n';

//   tString += transaction.date + ' ';
//   tString += transaction.consolidated + ' ';
//   tString += transaction.payee + ' \n';

//   transaction.postings.forEach(function(e) {
//     var posting = '    ';
//     posting += e.account + '  ';
//     posting += e.currency;
//     posting += e.amount;
//     tPostings.push(posting);
//   });

//   tString += tPostings.join('\n');

//   fs.appendFileSync(exports.file, tString);

//   return [200, 'Success!'];
// };
