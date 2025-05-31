const BASE_URL = "https://api.frankfurter.app/latest";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate dropdowns with currency options and set default
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    if (select.name === "from" && currCode === "USD") {
      newOption.selected = true;
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = true;
    }

    select.append(newOption);
  }

  // Update flag on currency change
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

function updateFlag(element) {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
}

async function updateExchangeRate() {
  let amountInput = document.querySelector(".amount input");
  let amtVal = amountInput.value;

  if (amtVal === "" || isNaN(amtVal) || amtVal <= 0) {
    amtVal = 1;
    amountInput.value = "1";
  }

  if (fromCurr.value === toCurr.value) {
    msg.innerText = `${amtVal} ${fromCurr.value} = ${amtVal} ${toCurr.value}`;
    return;
  }

  const URL = `${BASE_URL}?amount=${amtVal}&from=${fromCurr.value}&to=${toCurr.value}`;

  try {
    let response = await fetch(URL);
    let data = await response.json();
    let rate = data.rates[toCurr.value];
    let finalAmount = rate;
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (error) {
    msg.innerText = "Error fetching exchange rate.";
    console.error(error);
  }
}

// Convert on button click
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

// Initial flags and conversion on page load
window.addEventListener("load", () => {
  updateFlag(fromCurr);
  updateFlag(toCurr);
  updateExchangeRate();
});















 