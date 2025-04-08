const username = "Xain";
const greetingEl = document.getElementById("greeting");

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

greetingEl.innerText = `${getGreeting()}, ${username}`;

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const today = new Date();
const weekCalendar = document.getElementById("weekCalendar");
let selectedDate = formatDate(today);

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function getWeekDates() {
  const dayIndex = today.getDay();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - dayIndex);
  let days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + i);
    days.push(d);
  }
  return days;
}

function renderCalendar() {
  weekCalendar.innerHTML = "";
  getWeekDates().forEach(date => {
    const btn = document.createElement("button");
    btn.className = "day-btn";
    if (formatDate(date) === selectedDate) {
      btn.classList.add("active");
    }
    btn.textContent = weekDays[date.getDay()];
    btn.onclick = () => {
      selectedDate = formatDate(date);
      renderCalendar();
      renderExpenses();
    };
    weekCalendar.appendChild(btn);
  });
}

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

function addExpense() {
  const desc = document.getElementById("desc").value.trim();
  const amount = parseFloat(document.getElementById("amount").value);
  const category = document.getElementById("category").value;
  const date = document.getElementById("date").value;

  if (!desc || isNaN(amount) || !category || !date) {
    alert("Fill all fields properly!");
    return;
  }

  expenses.push({ desc, amount, category, date });
  localStorage.setItem("expenses", JSON.stringify(expenses));
  document.getElementById("desc").value = '';
  document.getElementById("amount").value = '';
  document.getElementById("category").selectedIndex = 0;
  document.getElementById("date").value = '';
  renderExpenses();
}

function renderExpenses() {
  const list = document.getElementById("expenseList");
  const totalDisplay = document.getElementById("totalDisplay");
  const selectedTitle = document.getElementById("selectedDateTitle");
  list.innerHTML = "";
  selectedTitle.textContent = `Expenses on: ${selectedDate}`;
  let total = 0;

  const filtered = expenses.filter(e => e.date === selectedDate);
  filtered.forEach(e => {
    total += e.amount;
    const div = document.createElement("div");
    div.className = "expense-item";
    div.innerHTML = `
      <div>
        <strong>${e.desc}</strong><br>
        ₹${e.amount.toFixed(2)} | ${e.category}
      </div>
    `;
    list.appendChild(div);
  });

  totalDisplay.textContent = `Total: ₹${total.toFixed(2)}`;
}

renderCalendar();
renderExpenses();
