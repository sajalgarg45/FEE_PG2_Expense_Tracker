// Arrays to store budget and expense data
let budgets = [];
let expenses = [];
let budgetExpenseChart, budgetAmountChart;
// Shows the page corresponding to the provided page ID
function showPage(pageId) {
    document.querySelectorAll('.main-content > div').forEach(div => {
        div.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}
// Toggles the display of a modal based on its ID and desired display status
function toggleModal(modalId, display) {
    document.getElementById(modalId).style.display = display;
}
// Displays the modal for adding a new budget
function showAddBudgetModal() {
    toggleModal('addBudgetModal', 'block');
}
// Closes the modal for adding a new budget
function closeAddBudgetModal() {
    toggleModal('addBudgetModal', 'none');
}



// DISPLAY THE BUDGET MODAL DETAILS
function showBudgetDetailsModal(budgetIndex) {
    const budget = budgets[budgetIndex];
    const budgetDetailsDiv = document.getElementById('budgetDetails');
    const expenseList = document.getElementById('expenseDetailsList');
    // Update the budget details and expenses list in the modal
    budgetDetailsDiv.innerHTML = `
        <p><strong>Name:</strong> ${budget.name}</p>
        <p><strong>Amount:</strong> $${budget.amount}</p>
        <p><strong>Spent:</strong> $${budget.spent}</p>
        <input type="hidden" id="budgetIndex" value="${budgetIndex}">
    `;
    expenseList.innerHTML = budget.expenses.map(expense => `
        <li>${expense.name}: $${expense.amount}</li>
    `).join('');

    toggleModal('budgetDetailsModal', 'block');
}
// Closes the modal displaying budget details
function closeBudgetDetailsModal() {
    toggleModal('budgetDetailsModal', 'none');
}



// ADDS NEW BUDGET AND UPDATE IT
function addBudget() {
    const name = document.getElementById('newBudgetName').value;
    const amount = parseFloat(document.getElementById('newBudgetAmount').value);

    if (name && !isNaN(amount)) {
        budgets.push({ name, amount, spent: 0, expenses: [] });
        updateBudgetList();
        closeAddBudgetModal();
    } else {
        alert('Please enter valid budget details.');
    }
}



// ADDS NEW EXPENSE TO THE BUDGET AND UPDATE IT
function addExpense() {
    const name = document.getElementById('expenseName').value;
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const date = document.getElementById('expenseDate').value;
    const budgetIndex = parseInt(document.getElementById('budgetIndex').value);

    if (name && !isNaN(amount) && date && budgets[budgetIndex]) {
        const expense = { name, amount, date, budget: budgets[budgetIndex].name };
        budgets[budgetIndex].expenses.push(expense);
        budgets[budgetIndex].spent += amount;
        expenses.push(expense);
        updateBudgetList();
        closeBudgetDetailsModal();
    } else {
        alert('Please enter valid expense details.');
    }
}



// Updates the budget list and charts
function updateBudgetList() {
    const budgetList = document.getElementById('budgetList');
    const budgetGraphs = document.getElementById('budgetGraphs');
    
// Update the budget list with charts
    budgetList.innerHTML = budgets.map((budget, index) => `
        <div class="budget-item">
            <div class="chart-container" onclick="showBudgetDetailsModal(${index})">
                <h4>${budget.name}</h4>
                <canvas id="budgetChart${index}"></canvas>
            </div>
        </div>
    `).join('');



// GENERATE BAR GRAPH FOR EACH BUDGET
    budgets.forEach((budget, index) => {
        new Chart(document.getElementById(`budgetChart${index}`), {
            type: 'bar',
            data: {
                labels: ['Spent', 'Remaining'],
                datasets: [{
                    label: 'Amount',
                    data: [budget.spent, budget.amount - budget.spent],
                    backgroundColor: ['#FF6384', '#36A2EB']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true } }
            }
        });
    });



// UPDATE TOTAL BUDGET , TOTAL SPEND , BUDGET COUNT
    const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
    const totalSpend = budgets.reduce((sum, b) => sum + b.spent, 0);
    const totalRemaining = totalBudget - totalSpend;

    document.getElementById('totalBudget').textContent = `$${totalBudget}`;
    document.getElementById('totalSpend').textContent = `$${totalSpend}`;
    document.getElementById('budgetCount').textContent = budgets.length;



// GENERATE A PIE CHART FOR TOTAL SPEND VS REMAINING BUDGET DASHBOARD
    if (budgetExpenseChart) budgetExpenseChart.destroy();
    budgetExpenseChart = new Chart(document.getElementById('budgetExpenseChart'), {
        type: 'pie',
        data: {
            labels: ['Total Spent', 'Remaining'],
            datasets: [{ data: [totalSpend, totalRemaining], backgroundColor: ['#FF6384', '#36A2EB'] }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });



// BAR CHART FOR DASHBAORD
    if (budgetAmountChart) budgetAmountChart.destroy();
    budgetAmountChart = new Chart(document.getElementById('budgetAmountChart'), {
        type: 'bar',
        data: {
            labels: budgets.map(b => b.name),
            datasets: [
                { label: 'Budget Amount', data: budgets.map(b => b.amount), backgroundColor: '#36A2EB' },
                { label: 'Amount Spent', data: budgets.map(b => b.spent), backgroundColor: '#FF6384' }
            ]
        },
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
    });



// UPDATES THE EXPENSE SECTION BY ADDING THE RECENT EXPENSE 
    document.getElementById('expenseList').innerHTML = `
        <tr><th>Name</th><th>Amount</th><th>Date</th><th>Budget</th></tr>
        ${expenses.map(exp => `
            <tr>
                <td>${exp.name}</td>
                <td>$${exp.amount}</td>
                <td>${exp.date}</td>
                <td>${exp.budget}</td>
            </tr>
        `).join('')}
    `;


}
