document.addEventListener("DOMContentLoaded", function () {
    const currencyBox = document.querySelector(".currency-box");
    const convertBtn = document.getElementById("convert-btn");
    const amountInput = document.getElementById("amount");
    const fromCurrency = document.getElementById("from-currency");
    const toCurrency = document.getElementById("to-currency");
    const resultText = document.getElementById("conversion-result");

    // Animate the currency box to slide in
    setTimeout(() => {
        currencyBox.classList.add("show");
    }, 500);

    // Fetch Currency Data
    async function fetchCurrencies() {
        const response = await fetch("https://open.er-api.com/v6/latest/USD"); // Replace with your API URL
        const data = await response.json();
        return data.rates;
    }

    // Populate currency dropdowns
    async function loadCurrencies() {
        const rates = await fetchCurrencies();
        const currencyKeys = Object.keys(rates);

        currencyKeys.forEach((currency) => {
            let option1 = document.createElement("option");
            option1.value = currency;
            option1.textContent = currency;

            let option2 = document.createElement("option");
            option2.value = currency;
            option2.textContent = currency;

            fromCurrency.appendChild(option1);
            toCurrency.appendChild(option2);
        });

        // Set default values
        fromCurrency.value = "USD";
        toCurrency.value = "EUR";
    }

    loadCurrencies();

    // Convert currency on button click
    convertBtn.addEventListener("click", async function () {
        const amount = parseFloat(amountInput.value);
        if (isNaN(amount) || amount <= 0) {
            resultText.textContent = "Enter a valid amount!";
            resultText.style.color = "red";
            return;
        }

        const rates = await fetchCurrencies();
        const fromRate = rates[fromCurrency.value];
        const toRate = rates[toCurrency.value];

        const convertedAmount = (amount / fromRate) * toRate;
        resultText.textContent = `${amount} ${fromCurrency.value} = ${convertedAmount.toFixed(2)} ${toCurrency.value}`;
        resultText.style.color = "green";
    });
});
