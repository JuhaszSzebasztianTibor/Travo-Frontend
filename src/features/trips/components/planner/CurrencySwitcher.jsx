import { useState } from "react";

const CurrencySwitcher = ({ onCurrencyChange, currency, currencySymbols }) => {
  const [isOpen, setIsOpen] = useState(false);
  const currencies = [
    {
      code: "EUR",
      name: "Euro",
      flag: "https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/eu.svg",
    },
    {
      code: "USD",
      name: "US Dollar",
      flag: "https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/us.svg",
    },
    {
      code: "GBP",
      name: "British Pound",
      flag: "https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/gb.svg",
    },
  ];

  const currencySymbol = currencySymbols[currency] || "€";

  const handleCurrencySelect = (currencyCode) => {
    onCurrencyChange(currencyCode);
    setIsOpen(false);
  };

  return (
    <div className="currency-wrapper">
      <span>Cost in</span>
      <div className="currency-switcher">
        <div className="base-currency" onClick={() => setIsOpen(!isOpen)}>
          {currencySymbol} {/* Display the selected currency symbol */}
          <i className="fas fa-chevron-down" style={{ paddingLeft: "5px" }}></i>
        </div>
        {isOpen && (
          <ul className="currency-options">
            {currencies.map((currency) => (
              <li
                key={currency.code}
                onClick={() => handleCurrencySelect(currency.code)}
              >
                <div className="flag">
                  <img src={currency.flag} alt={currency.code} />
                </div>
                <span className="currency">{currency.code}</span>
                <span className="label">- {currency.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CurrencySwitcher;
