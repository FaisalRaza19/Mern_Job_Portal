import React,{ useState, useEffect, useRef } from "react";
import { currencies } from "../../../../temp/currency.js"; 

const CurrencyDropdown = ({ value, onChange })=>{
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [filteredList, setFilteredList] = useState(currencies);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  useEffect(() => {
    const list = currencies.filter(
      (c) =>
        c.code.toLowerCase().includes(filter.toLowerCase()) ||
        c.name.toLowerCase().includes(filter.toLowerCase())
    );
    setFilteredList(list);
  }, [filter]);

  const selectedCurrency = currencies.find((c) => c.code === value) || currencies[0];

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Selected value */}
      <div
        className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedCurrency.code} - {selectedCurrency.symbol} - {selectedCurrency.name}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <ul className="absolute z-10 w-full mt-1 max-h-60 overflow-auto border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <input
            autoFocus
            type="text"
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 focus:outline-none"
            placeholder="Search currency..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          {filteredList.map((currency) => (
            <li
              key={currency.code}
              onClick={() => {
                onChange(currency.code);
                setIsOpen(false);
                setFilter("");
              }}
              className="px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-600 cursor-pointer"
            >
              {currency.code} - {currency.symbol} - {currency.name}
            </li>
          ))}
          {filteredList.length === 0 && (
            <li className="px-4 py-2 text-gray-500">No match found</li>
          )}
        </ul>
      )}
    </div>
  );
}

export default CurrencyDropdown 
