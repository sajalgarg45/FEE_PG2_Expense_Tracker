let chartInstance = null;  // Declare a variable to store the chart instance

function calculateEMI() {
    let amount = parseFloat(document.getElementById('amount').value);
    let interestRate = parseFloat(document.getElementById('interestRate').value) / 12 / 100;
    let tenure = parseInt(document.getElementById('tenure').value);
    let tenureType = document.querySelector('input[name="tenureType"]:checked').value;

    if (tenureType === 'years') {
        tenure *= 12; // Convert years to months
    }

    let emi = (amount * interestRate * Math.pow(1 + interestRate, tenure)) / (Math.pow(1 + interestRate, tenure) - 1);
    let totalPayment = emi * tenure;
    let totalInterest = totalPayment - amount;

    document.getElementById('monthlyPayment').innerText = `₹ ${emi.toFixed(2)}`;
    document.getElementById('totalInterest').innerText = `₹ ${totalInterest.toFixed(2)}`;
    document.getElementById('totalPayment').innerText = `₹ ${totalPayment.toFixed(2)}`;

    // Destroy previous chart instance if it exists
    if (chartInstance) {
        chartInstance.destroy();
    }

    // Create a new Pie Chart
    let ctx = document.getElementById('paymentPieChart').getContext('2d');
    chartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Principal', 'Interest'],
            datasets: [{
                data: [amount, totalInterest],
                backgroundColor: ['#28a745', '#f39c12'],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return `${tooltipItem.label}: ₹ ${tooltipItem.raw.toFixed(2)}`;
                        }
                    }
                }
            }
        }
    });

// Update Amortization Schedule
    let amortizationTable = document.getElementById('amortizationTable');
    amortizationTable.innerHTML = ''; // Clear previous data

    let balance = amount;
    for (let i = 1; i <= tenure; i++) {
        let interest = balance * interestRate;
        let principal = emi - interest;
        balance -= principal;

        let row = document.createElement('tr');
        row.innerHTML = `
            <td>${i}</td>
            <td>₹ ${principal.toFixed(2)}</td>
            <td>₹ ${interest.toFixed(2)}</td>
            <td>₹ ${emi.toFixed(2)}</td>
            <td>₹ ${balance.toFixed(2)}</td>
            <td>${((amount - balance) / amount * 100).toFixed(2)}%</td>
        `;
        amortizationTable.appendChild(row);
    }
}

// Add event listeners to update the EMI calculation in real-time
document.getElementById('amount').addEventListener('input', calculateEMI);
document.getElementById('interestRate').addEventListener('input', calculateEMI);
document.getElementById('tenure').addEventListener('input', calculateEMI);
document.querySelectorAll('input[name="tenureType"]').forEach(element => {
    element.addEventListener('change', calculateEMI);
});

// Initial call to populate with default values
calculateEMI();
