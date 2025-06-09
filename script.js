// Global array to store expenses
let expenses = [
    { id: 'exp1', description: 'Groceries', amount: 350.50, date: '2025-05-07', category: 'food' },
    { id: 'exp2', description: 'Bus Fare', amount: 25.50, date: '2025-05-08', category: 'transport' },
    { id: 'exp3', description: 'Cinema Ticket', amount: 120.00, date: '2025-05-28', category: 'entertainment' }
];

// Get DOM elements
const addExpenseBtn = document.getElementById("expense-btn"); 
const expenseDescEl = document.getElementById("expense-desc");
const expenseAmountEl = document.getElementById("expense-amount");
const expenseDateEl = document.getElementById("expense-date");
const expenseCategoryEl = document.getElementById("expense-category");
const expenseDisplayEl = document.getElementById("expense-display");
const weeklySummaryDisplayEl = document.getElementById("weekly-summary-display");
const clearExpensesBtn = document.getElementById("clear-expenses-btn");

// Event listener for submission
addExpenseBtn.addEventListener("click", function(event) {
    event.preventDefault(); // Fixed missing parentheses

    // Get input values
    const description = expenseDescEl.value.trim();
    const amount = parseFloat(expenseAmountEl.value);
    const date = expenseDateEl.value;
    let category = expenseCategoryEl.value;

    // Validate form inputs
    if (!description || isNaN(amount) || amount <= 0 || !date || !category) {
        alert("Please fill in all fields correctly!");
        return;
    }

    // Capitalize category name properly
    category = category.charAt(0).toUpperCase() + category.slice(1);

    // Create a new expense object
    const newExpense = {
        id: 'exp' + Date.now(),
        description,
        amount,
        date,
        category
    };

    expenses.push(newExpense);
    alert("Expense added successfully!");

    // Clear form fields after submission
    expenseDescEl.value = "";
    expenseAmountEl.value = "";
    expenseDateEl.value = "";
    expenseCategoryEl.value = "";

    // Update UI with new data
    displayExpenses();
    generateWeeklySummary();
});

// Event listener for clearing expenses
clearExpensesBtn.addEventListener("click", function() {
    // Confirm before clearing
    if (confirm("Are you sure you want to clear all expenses?")) {
        expenses = []; // Clear the array
        displayExpenses(); // Update UI
        generateWeeklySummary(); // Refresh summary
        alert("All expenses have been cleared!");
    }
});

// Function to display expenses
function displayExpenses() { // Fixed function name
    expenseDisplayEl.innerHTML = ""; // Clear previous content

    if (expenses.length === 0) {
        expenseDisplayEl.innerHTML = "<p>No expenses added yet.</p>";
        return;
    }

    expenses.forEach(expense => {
        const expenseDiv = document.createElement("div");
        expenseDiv.classList.add("expense-item");

        // Render expense details dynamically
        expenseDiv.innerHTML = `
            <h4>${expense.description}</h4>
            <p><strong>Amount:</strong> R${expense.amount.toFixed(2)}</p>
            <p><strong>Date:</strong> ${expense.date}</p>
            <p><strong>Category:</strong> ${expense.category}</p>
        `;
        expenseDisplayEl.appendChild(expenseDiv);
    });
}

// Function to filter expenses within current week
function getWeekExpenses() {
    const today = new Date();
    const startOfWeek = new Date(today);
    /* 
    Adjust to Monday of the current week (Sunday is 0, Monday is 1, etc.)
     If today is Sunday (0), we subtract 6 to get previous Monday.
     Otherwise, subtract today's day of week minus 1.
    */
    startOfWeek.setDate(today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1));
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(today);
    endOfWeek.setHours(23, 59, 59, 999);

    return expenses.filter(expense => {
        const expenseDate = new Date(Date.parse(expense.date)); // Optimized date parsing
        expenseDate.setHours(12, 0, 0, 0);
        return expenseDate >= startOfWeek && expenseDate <= endOfWeek;
    });
}

// Function to generate weekly summary
function generateWeeklySummary() {
    weeklySummaryDisplayEl.innerHTML = ""; // Clear previous summary

    const weekExpenses = getWeekExpenses();

    if (weekExpenses.length === 0) {
        weeklySummaryDisplayEl.innerHTML = "<p>No expenses recorded this week.</p>";
        return;
    }

    const totalSpent = weekExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Group expenses by category
    const categoryTotals = weekExpenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
    }, {});

    let categorySummaryHtml = '<ul>';
    for (const category in categoryTotals) {
        categorySummaryHtml += `<li>${category}: R${categoryTotals[category].toFixed(2)}</li>`;
    }
    categorySummaryHtml += '</ul>';

    // Render weekly summary dynamically
    weeklySummaryDisplayEl.innerHTML = `
        <h3>Expenses This Week</h3>
        <p><strong>Total Spent:</strong> R${totalSpent.toFixed(2)}</p>
        <p><strong>Breakdown by Category:</strong></p>
        ${categorySummaryHtml}
    `;
}

// Load Expenses & Summary on Page Start
window.onload = function() {
    displayExpenses();
    generateWeeklySummary();
};
