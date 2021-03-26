// Tomando los elementos
const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');


const localStorageTransactions = JSON.parse(
  localStorage.getItem('transactions')
);

// Chequea si hay algo en el almacenamiento local del explorador, si es así lo carga, sino comienza un array vacio
let transactions =
  localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// Agregar transacción
function addTransaction(e) {
  e.preventDefault();
  // Si no se ingresa una descripcion o un valor, da una alerta
  if (text.value.trim() === '' || amount.value.trim() === '') {
    alert('Please add a text and amount');
  } else {
    // Agregando un ID para cada transaccion
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value
    };

    // agregando la transaccion
    transactions.push(transaction);
    addTransactionDOM(transaction);
    
    updateValues();
    updateLocalStorage();

     //limpiando inputs
    text.value = '';
    amount.value = '';
  }
}

// Generar un ID (al azar)
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

//Agregar transacciones al historial
function addTransactionDOM(transaction) {
  // Tomando el signo (positivo o negativo)
  const sign = transaction.amount < 0 ? '-' : '+';
  // Creando un listed item
  const item = document.createElement('li');

  // Agregar clase en funcion del valor (si es positivo o negativo)
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  item.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs(
    transaction.amount
  )}</span> <button class="delete-btn" onclick="removeTransaction(${
    transaction.id
  })">x</button>
  `;

  // Agregando el item a la lista
  list.appendChild(item);
}

// Actualizar el balance, los ingresos y las expensas
function updateValues() {
  //Toma los valores de cada transaccion ingresada
  const amounts = transactions.map(transaction => transaction.amount);
  //Sumando y restando todos los valores
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

  //Ingresos totales
  const income = amounts
  .filter(item => item > 0)
  .reduce((acc, item) => (acc += item), 0)
  .toFixed(2);

  //Egresos o expensas totales
  const expense = (
  amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) *-1
  ).toFixed(2);

  // Mostrando en pantalla lo calculado anteriormente
  balance.innerText = `$${total}`;
  money_plus.innerText = `$${income}`;
  money_minus.innerText = `$${expense}`;
}

// Quitar transaccion por medio de ID
function removeTransaction(id) {
  // Filtrando todas las transacciones a quitar
  transactions = transactions.filter(transaction => transaction.id !== id);
  
  updateLocalStorage();
  init();
}

// Actualizar las transacciones almacenadas en el almacenamiento local
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Init
function init() {
  list.innerHTML = '';

  transactions.forEach(addTransactionDOM);
  updateValues();
}

init();

form.addEventListener('submit', addTransaction);
