'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

/////////////////////////////////////////////////
/////////////////////////////////////////////////
//// Project Start

////////////////////////////////////////////////////////
//////////// widrawel and deposit
function Movements(movements, sorts = false) {
  containerMovements.innerHTML = '';

  let movs = sorts ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = ` 
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${mov}€</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
}

function Username(accounts) {
  accounts.forEach(acc => {
    const username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
    acc.username = username;
  });
}
Username(accounts);

//////////////////////////////////////
////// Balance
function Amount(acc) {
  acc.balance = acc.movements.reduce((acc, cur) => (acc += cur), 0);
  labelBalance.textContent = `${acc.balance}€`;
}

/////////////////////////////////////////
///////////summmary
function Extras(acc) {
  let deposit = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${deposit}€`;

  let credited = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(credited)}€`;

  let interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * `${acc.interestRate}`) / 100)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
}

////////////////////////////////////////////////////////
//////////// user login event handler
let currentAcc;

btnLogin.addEventListener('click', e => {
  e.preventDefault();

  if (accounts.find(acc => acc.username === inputLoginUsername.value)) {
    currentAcc = accounts.find(
      acc => acc.username === inputLoginUsername.value
    );

    if (currentAcc.pin === Number(inputLoginPin.value)) {
      //creating fade in effect
      containerApp.style.opacity = 100;

      updateUi(currentAcc);

      inputLoginUsername.value = inputLoginPin.value = '';
      inputLoginPin.blur();
    }
  }
});

const updateUi = acc => {
  Movements(acc.movements);
  Amount(acc);
  Extras(acc);
};

////////////////////////////////////////////////////////
//////////// money Transfer event handler
btnTransfer.addEventListener('click', e => {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  if (
    amount > 0 &&
    receiverAcc &&
    currentAcc.balance >= amount &&
    receiverAcc?.username !== currentAcc.username
  ) {
    currentAcc.movements.push(-amount);
    receiverAcc.movements.push(amount);

    updateUi(currentAcc);
  }

  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferAmount.blur();
});

////////////////////////////////////////////////////////
//////////// Close event handler
btnClose.addEventListener('click', e => {
  e.preventDefault();

  if (
    currentAcc.username === inputCloseUsername.value &&
    currentAcc.pin === Number(inputClosePin.value)
  ) {
    const user = accounts.findIndex(
      acc => acc.username === inputCloseUsername.value
    );
    console.log(user);
    accounts.splice(user, 1);
    containerApp.style.opacity = 0;
  }

  inputClosePin.value = inputCloseUsername.value = '';
});

////////////////////////////////////////////////////////
//////////// Button loan event handler

btnLoan.addEventListener('click', e => {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAcc.movements.some(mov => mov >= amount * 0.1)) {
    currentAcc.movements.push(amount);

    updateUi(currentAcc);
  }

  inputLoanAmount.value = '';
});

////////////////////////////////////////////////////////
//////////// Button Sort event handler
let sorted = false;
btnSort.addEventListener('click', e => {
  e.preventDefault();

  Movements(currentAcc.movements, !sorted);
  sorted = !sorted;
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

/////////////////////////////////////////////////
