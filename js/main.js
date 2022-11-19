'use strict';

const accounts = [];

const initFirstData = async () => {
  const accountsResponse = await fetch(
    'https://api.tadabase.io/api/v1/data-tables/3GDN1mNeqP/records',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Tadabase-App-id': '4yQk2BBNgP',
        'X-Tadabase-App-Key': 't5JcK3KU0HXt',
        'X-Tadabase-App-Secret': 'y1yAri1CJn2MufPtTIybJebdBB0GwLEn',
      },
    }
  );
  const movemontsResponse = await fetch(
    'https://api.tadabase.io/api/v1/data-tables/X9EjVXNo2K/records',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Tadabase-App-id': '4yQk2BBNgP',
        'X-Tadabase-App-Key': 't5JcK3KU0HXt',
        'X-Tadabase-App-Secret': 'y1yAri1CJn2MufPtTIybJebdBB0GwLEn',
      },
    }
  );
  const myAccountsJson = await accountsResponse.json(); //extract JSON from the http response
  const myMovemntsJson = await movemontsResponse.json(); //extract JSON from the http response
  if (accounts.length === 0) {
    myAccountsJson.items.map(item =>
      accounts.push({
        number: item.field_123,
        unique: item.id,
        userName: item.field_126,
        pin: item.field_125,
        owner: item.field_124,
        movements: myMovemntsJson.items.map(item => item.field_128),
        movementsData: myMovemntsJson.items.map(item => {
          return {
            id: item.field_127,
            amount: item.field_128,
            place: item.field_131,
            date: item.field_129,
            unique: item.id,
            owner: item.field_130,
            amountName: item.field_133,
            billsNum: item.field_134,
          };
        }),
      })
    );
  }
  console.log(accounts);
};

const updateDate = async (
  id,
  amount,
  date,
  cur,
  place,
  amountName,
  billsNum
) => {
  var myHeaders = new Headers();
  myHeaders.append('X-Tadabase-App-id', '4yQk2BBNgP');
  myHeaders.append('X-Tadabase-App-Key', 't5JcK3KU0HXt');
  myHeaders.append('X-Tadabase-App-Secret', 'y1yAri1CJn2MufPtTIybJebdBB0GwLEn');
  myHeaders.append(
    'Cookie',
    'AWSALB=4Wx7eZaUHgK1e4n3pEPwkHBI1PVV6iiTZV8DZzUtm7x/OWosRaJ/CPKOKGNtm0j6+CYmDOOMFxgCRWYCSxltDdaLQMbFb5QVXgaazncbkmMFDCz/qow8+cxkDPnL; AWSALBCORS=4Wx7eZaUHgK1e4n3pEPwkHBI1PVV6iiTZV8DZzUtm7x/OWosRaJ/CPKOKGNtm0j6+CYmDOOMFxgCRWYCSxltDdaLQMbFb5QVXgaazncbkmMFDCz/qow8+cxkDPnL'
  );

  var formdata = new FormData();
  formdata.append('field_127', id);
  formdata.append('field_128', amount);
  formdata.append('field_129', date);
  formdata.append('field_130', cur.owner);
  formdata.append('field_131', place);
  formdata.append('field_133', amountName);
  formdata.append('field_134', billsNum);

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: formdata,
    redirect: 'follow',
  };

  fetch(
    'https://api.tadabase.io/api/v1/data-tables/X9EjVXNo2K/records',
    requestOptions
  )
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
};

const updateField = async (id, billsNum) => {
  var myHeaders = new Headers();
  myHeaders.append('X-Tadabase-App-id', '4yQk2BBNgP');
  myHeaders.append('X-Tadabase-App-Key', 't5JcK3KU0HXt');
  myHeaders.append('X-Tadabase-App-Secret', 'y1yAri1CJn2MufPtTIybJebdBB0GwLEn');

  var formdata = new FormData();
  formdata.append('field_134', billsNum);

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: formdata,
    redirect: 'follow',
  };

  fetch(
    `https://api.tadabase.io/api/v1/data-tables/X9EjVXNo2K/records/${id}`,
    requestOptions
  )
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
};

const toDelete = async uniqueID => {
  var myHeaders = new Headers();
  myHeaders.append('X-Tadabase-App-id', '4yQk2BBNgP');
  myHeaders.append('X-Tadabase-App-Key', 't5JcK3KU0HXt');
  myHeaders.append('X-Tadabase-App-Secret', 'y1yAri1CJn2MufPtTIybJebdBB0GwLEn');

  var formdata = new FormData();
  formdata.append('id', uniqueID);

  var requestOptions = {
    method: 'DELETE',
    headers: myHeaders,
    body: formdata,
    redirect: 'follow',
  };

  fetch(
    `https://api.tadabase.io/api/v1/data-tables/X9EjVXNo2K/records/${uniqueID}`,
    requestOptions
  )
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));

  initFirstData();
};

const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelFutureBalance = document.querySelector('.balance__value__future');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');
const btnAddFutureBill = document.querySelector('.form__btn--future_bills');
const btnDrop = document.querySelector('.form__btn--drop ');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
const inputFutureBillAmount = document.querySelector(
  '.form__input--future_bills_amount'
);
const inputFutureBillName = document.querySelector(
  '.form__input--future_bills_name'
);
const inputFutureBillsNumber = document.querySelector(
  '.form__input--future_bills_number'
);

initFirstData();
crateUserName(accounts);
let yourDate = new Date();
let currentAccount;
let sorted = false;
let filtered = false;
let btnDelete;
let indexOfDelete;
setInterval(counter => {
  yourDate = new Date();
  labelDate.textContent = yourDate.toString().slice(0, 25);
}, 1000);

const displayMovements = function (currentAccount, sort = false, filter = '0') {
  const sortedmovementsData = currentAccount.movementsData
    .slice()
    .sort((a, b) => a.amount - b.amount);

  const filteredMovmentsData = currentAccount.movementsData.filter(
    item => item.date.slice(5, 7) === filter
  );

  containerMovements.innerHTML = '';
  labelWelcome.textContent = `Welcome back, ${currentAccount.owner}`;
  containerApp.style.display = 'grid';

  if (sorted && filtered) {
    const filteredSortedMovmentsData = filteredMovmentsData
      .slice()
      .sort((a, b) => a.amount - b.amount);
    addingRowsMovements(filteredSortedMovmentsData);
  } else if (filtered && !sorted) {
    addingRowsMovements(filteredMovmentsData);
  } else {
    sorted
      ? addingRowsMovements(sortedmovementsData)
      : addingRowsMovements(currentAccount.movementsData);
  }
  calcDisplayBalance(currentAccount);
};

function addingRowsMovements(movementsData) {
  movementsData.forEach((mov, i) => {
    if (mov.amountName === 'balance') {
      const type = mov.amount > 0 ? 'deposit' : 'withdrawal';

      const htmlMovementRow = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${mov.date} - ${
        mov.owner
      }</div>
        <div class="movements__type movements__type--${type}">${mov.place}</div>
        <div class="movements__value">${mov.amount.toFixed(2)}₪ 
        <button class="form__btn form__btn--delete" value="${
          mov.unique
        }"><span class="material-symbols-outlined">
        heart_minus
        </span></button>
      </div>
      `;
      containerMovements.insertAdjacentHTML('afterbegin', htmlMovementRow);
    } else {
    }
  });

  btnDelete = document.querySelectorAll('.form__btn--delete');
  btnDelete.forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();

      indexOfDelete = currentAccount.movementsData
        .map(mov => mov.unique)
        .indexOf(this.value);

      currentAccount.movementsData.splice(indexOfDelete, 1);
      currentAccount.movements.splice(indexOfDelete, 1);

      // console.log(currentAccount.movementsData);

      toDelete(this.value);

      displayMovements(currentAccount);
    });
  });
}

function calcDisplayBalance(currentAccount) {
  labelBalance.textContent =
    currentAccount.movementsData
      .filter(mov => mov.amountName === 'balance')
      .reduce((acc, mov) => acc + mov.amount, 0)
      .toFixed(2) + '₪';

  labelFutureBalance.textContent =
    currentAccount.movementsData
      .filter(mov => mov.amountName === 'future')
      .reduce((acc, mov) => acc + mov.amount, 0)
      .toFixed(2) + '₪';

  currentAccount.balenceAmount = +labelBalance.textContent.slice(0, -1);

  calcDisplaySummary(currentAccount);
}

function calcDisplaySummary(currentAccount) {
  console.log(currentAccount.movementsData);
  const deposit = currentAccount.movementsData
    .filter(mov => mov.amount > 0 && mov.amountName === 'balance')
    .reduce((acc, mov) => acc + mov.amount, 0);
  const withdrawal = currentAccount.movementsData
    .filter(mov => mov.amount < 0 && mov.amountName === 'balance')
    .reduce((acc, mov) => acc + mov.amount, 0);

  labelSumIn.textContent = deposit.toFixed(2) + '₪';

  labelSumOut.textContent = Math.abs(withdrawal).toFixed(2) + '₪';
}

function crateUserName(accs) {
  accs.forEach(acc => {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(eachName => eachName[0])
      .join('');
  });
}

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.userName.toLowerCase() === inputLoginUsername.value.toLowerCase()
  );
  currentAccount?.pin + '' === inputLoginPin.value &&
    currentAccount.owner &&
    displayMovements(currentAccount);

  inputLoginUsername.value = '';
  inputLoginPin.value = '';
  inputLoginPin.blur();
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  let yourDate = new Date();
  let indexNew = [...yourDate.toString()];

  let uniqueId = indexNew
    .map(letter => letter)
    .filter(letter => +letter)
    .reduce((cur, num) => (cur = cur + num));

  const amount =
    +inputTransferAmount.value > 0
      ? +inputTransferAmount.value
      : -1 * inputTransferAmount.value;
  const place = inputTransferTo.value;
  const amountAfterTransfer = currentAccount.balenceAmount - amount;
  const newMoveData = {
    id: uniqueId,
    amount: amount,
    date: yourDate.toISOString().split('T')[0],
    owner: currentAccount.owner,
    place: place,
    amountName: 'balance',
    billsNum: 0,
  };
  if (amount > 0) {
    accounts.map(acc => acc.movements.push(amount));
    accounts.map(acc => acc.movementsData.push(newMoveData));
    updateDate(
      uniqueId,
      amount,
      yourDate.toISOString().split('T')[0],
      currentAccount,
      place,
      'balance',
      0
    );

    displayMovements(currentAccount);
  } else {
    alert('Invalid Transfer');
  }
  inputTransferTo.value = '';
  inputTransferAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  let yourDate = new Date();
  let indexNew = [...yourDate.toString()];
  let oneMoreForId = Math.floor(Math.random() * 100);

  let uniqueId = indexNew
    .map(letter => letter)
    .filter(letter => +letter)
    .reduce((cur, num) => (cur = cur + num));

  console.log(uniqueId);

  const amount =
    +inputClosePin.value < 0 ? +inputClosePin.value : -1 * +inputClosePin.value;
  const place = inputCloseUsername.value;
  const amountAfterTransfer = currentAccount.balenceAmount - amount;
  const newMoveData = {
    id: uniqueId + oneMoreForId + '',
    amount: amount,
    date: yourDate.toISOString().split('T')[0],
    owner: currentAccount.owner,
    place: place,
    amountName: 'balance',
    billsNum: 0,
  };
  if (amount < 0 && amountAfterTransfer > -20000) {
    accounts.map(acc => acc.movements.push(amount));
    accounts.map(acc => acc.movementsData.push(newMoveData));

    updateDate(
      uniqueId + oneMoreForId + '',
      amount,
      yourDate.toISOString().split('T')[0],
      currentAccount,
      place,
      'balance',
      0
    );

    displayMovements(currentAccount);
  } else {
    alert('Invalid Transfer');
  }
  inputClosePin.value = '';
  inputCloseUsername.value = '';
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const monthSelected = inputLoanAmount.value;
  inputLoanAmount.value ? (filtered = true) : (filtered = false);

  filtered
    ? (btnSort.style.display = 'none')
    : (btnSort.style.display = 'inline-block');

  setTimeout(() => {
    displayMovements(currentAccount, false, monthSelected);
  }, 1000);
});

btnSort.addEventListener('click', function (e) {
  sorted = !sorted;
  e.preventDefault();
  displayMovements(currentAccount, sorted);
});

btnAddFutureBill.addEventListener('click', function (e) {
  e.preventDefault();
  let yourDate = new Date();
  let indexNew = [...yourDate.toString()];

  let uniqueId = indexNew
    .map(letter => letter)
    .filter(letter => +letter)
    .reduce((cur, num) => (cur = cur + num));

  const amount = +inputFutureBillAmount.value;
  const place = inputFutureBillName.value;
  const billsNum = +inputFutureBillsNumber.value;

  const newMoveData = {
    id: uniqueId,
    amount: amount,
    date: yourDate.toISOString().split('T')[0],
    owner: currentAccount.owner,
    place: place,
    amountName: 'future',
    billsNum: billsNum,
  };
  if (amount > 0) {
    accounts.map(acc => acc.movements.push(amount));
    accounts.map(acc => acc.movementsData.push(newMoveData));
    updateDate(
      uniqueId,
      amount,
      yourDate.toISOString().split('T')[0],
      currentAccount,
      place,
      'future',
      billsNum
    );
    displayMovements(currentAccount);
  } else {
    alert('Invalid Transfer');
  }
  inputFutureBillAmount.value = '';
  inputFutureBillName.value = '';
  inputFutureBillsNumber.value = '';
});

btnDrop.addEventListener('click', function (e) {
  currentAccount.movementsData.map((mov, i) => {
    if (mov.amountName === 'future') {
      inputCloseUsername.value = mov.place;
      inputClosePin.value = -mov.amount;
      btnClose.click();

      mov.billsNum--;

      if (mov.billsNum === 0) {
        currentAccount.movementsData.splice(i, 1);
        currentAccount.movements.splice(i, 1);

        i--;
        toDelete(mov.unique);
      } else {
        const id = mov.id;
        const amount = mov.amount;
        const date = mov.date;
        const owner = mov.owner;
        const place = mov.place;
        const amountName = mov.amountName;
        const billsNum = mov.billsNum;

        console.log(mov.unique, billsNum);

        updateField(mov.unique, billsNum);

        console.log(id, amount, date, owner, place, amountName, billsNum);
      }
    }
  });
  displayMovements(currentAccount);
});

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);
