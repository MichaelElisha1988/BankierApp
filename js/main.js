'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP
// Data

const accounts = [];
const userAction = async () => {
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
  // do something with myJson
  myAccountsJson.items.map(item =>
    accounts.push({
      Id: item.field_123,
      Unique: item.id,
      userName: item.field_126,
      pin: item.field_125,
      owner: item.field_124,
      movements: myMovemntsJson.items.map(item => item.field_128),
    })
  );
  console.log(accounts);
};

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
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

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

userAction();
crateUserName(accounts);
let currentAccount;
let sort = false;

const displayMovements = function (currentAccount, sort = false) {
  const sortedmovements = currentAccount.movements
    .slice()
    .sort((a, b) => a - b);

  containerMovements.innerHTML = '';
  labelWelcome.textContent = `Welcome back, ${currentAccount.owner}`;
  containerApp.style.opacity = 1;
  sort
    ? addingRowsMovements(sortedmovements)
    : addingRowsMovements(currentAccount.movements);
  calcDisplayBalance(currentAccount);
};

function addingRowsMovements(movements) {
  movements.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const htmlMovementRow = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov.toFixed(2)}₪</div>
      </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', htmlMovementRow);
  });
}

function calcDisplayBalance(currentAccount) {
  labelBalance.textContent =
    currentAccount.movements.reduce((acc, mov) => acc + mov, 0).toFixed(2) +
    '₪';
  currentAccount.balenceAmount = +labelBalance.textContent.slice(0, -1);
  calcDisplaySummary(currentAccount);
}

function calcDisplaySummary(currentAccount) {
  const deposit = currentAccount.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov);
  const withdrawal = currentAccount.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov);

  labelSumIn.textContent = deposit.toFixed(2) + '₪';
  labelSumOut.textContent = Math.abs(withdrawal).toFixed(2) + '₪';
  labelSumInterest.textContent = interest.toFixed(2) + '₪';
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
    acc => acc.userName === inputLoginUsername.value
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
  const amount = +inputTransferAmount.value;
  const amountAfterTransfer = currentAccount.balenceAmount - amount;
  const transferToAccount = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );
  if (
    transferToAccount &&
    amount > 0 &&
    amountAfterTransfer > -2000 &&
    currentAccount.userName !== transferToAccount?.userName
  ) {
    currentAccount.movements.push(-amount);
    transferToAccount?.movements.push(amount);
    setTimeout(() => {
      displayMovements(currentAccount);
    }, 3000);
  } else {
    alert('Invalid Transfer');
  }
  inputTransferTo.value = '';
  inputTransferAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  const toDeleteUserName = inputCloseUsername.value;
  const toDeletePin = +inputClosePin.value;
  const toDeleteIndex = accounts?.findIndex(
    acc => acc.userName === toDeleteUserName
  );
  if (
    currentAccount.userName === toDeleteUserName &&
    currentAccount.pin === toDeletePin
  ) {
    accounts.splice(toDeleteIndex, 1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = `Log in to get started`;
  } else {
    alert('Invalid Delete request');
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const moneyRequest = Math.floor(inputLoanAmount.value);

  if (
    moneyRequest > 0 &&
    currentAccount.movements.some(mov => mov > moneyRequest * 0.1)
  )
    currentAccount.movements.push(moneyRequest);
  setTimeout(() => {
    displayMovements(currentAccount);
  }, 3000);
});

btnSort.addEventListener('click', function (e) {
  sort = !sort;
  e.preventDefault();
  displayMovements(currentAccount, sort);
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////// End Array Section //////////////////////////////////

// const a = Array.from({ length: 100 }, () =>
//   Math.floor(Math.random() * 100000000 * 3)
// );
// console.log(a);

// const dogs = [
//   {
//     weight: 22,
//     curFood: 250,
//     owners: ['Alice', 'Bob'],
//   },
//   {
//     weight: 8,
//     curFood: 200,
//     owners: ['Matilda'],
//   },
//   {
//     weight: 13,
//     curFood: 275,
//     owners: ['Sarah', 'John'],
//   },
//   {
//     weight: 32,
//     curFood: 340,
//     owners: ['Michael'],
//   },
// ];

// const calcRecommendedFood = function (dogs) {
//   dogs.forEach(dog => {
//     dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28);
//   });
// };
// calcRecommendedFood(dogs);
// console.log(dogs);

// const whosThisDog = function (dogs, name) {
//   let dogFinder;
//   dogs.map(dog =>
//     dog.owners.map(owner => {
//       if (owner.toLowerCase() === name.toLowerCase()) dogFinder = dog;
//     })
//   );
//   return dogFinder;
// };

// let dogOwners = whosThisDog(dogs, 'Sarah');
// console.log(dogOwners);

// dogOwners.curFood * 1.1 > dogOwners.recommendedFood
//   ? console.log(`${dogOwners.owners} Youre dog too fat!`)
//   : '' || dogOwners.curFood * 0.9 < dogOwners.recommendedFood
//   ? console.log(`${dogOwners.owners} Feed youre dog man`)
//   : '';

// const ownersEatToMachFood = dogs
//   .filter(dog => dog.curFood * 1.1 > dog.recommendedFood)
//   .flatMap(dog => dog.owners);

// const ownersEatToLittleFood = dogs
//   .filter(dog => dog.curFood * 0.9 < dog.recommendedFood)
//   .flatMap(dog => dog.owners);

// console.log(`${ownersEatToMachFood.join(' and ')}'s dogs are eating a lot!`);
// console.log(
//   `${ownersEatToLittleFood.join(' and ')}'s dogs are eating to little!`
// );
// const dogsWithOKFood = dog =>
//   dog.curFood <= dog.recommendedFood * 1.1 &&
//   dog.curFood >= dog.recommendedFood * 0.9;

// console.log(dogs.some(dog => dog.curFood === dog.recommendedFood));
// console.log(dogs.some(dogsWithOKFood));

// console.log(dogs.filter(dogsWithOKFood));

// const sortedDogs = dogs
//   .slice()
//   .sort((a, b) => a.recommendedFood - b.recommendedFood);
// console.log(sortedDogs);
