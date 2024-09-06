export const wait = () => new Promise (res => setTimeout(res, Math.random() * 4000))

const generateRandomColor = () => {
  const existingBudgetLength = fetchData("budgets")?.length ?? 0;
  return `${existingBudgetLength * 39} 61% 40%`
}

// Local storage
export function fetchData(key) {
  // const data = localStorage.getItem(key);
  // return data ? JSON.parse(data) : [];
  return JSON.parse(localStorage.getItem(key));
};

// Get all items from local storage
export const getAllMatchingItems = ({ category, key, value }) => {
  const data = fetchData(category) ?? [];
  return data.filter((item) => item[key] === value);
};

// delete item from local storage
export const deleteItem = ({ key, id }) => {
  const existingData = fetchData(key);
  if (id) {
    const newData = existingData.filter((item) => item.id !== id);
    return localStorage.setItem(key, JSON.stringify(newData));
  }
  return localStorage.removeItem(key);
};

// create budget
export const createBudget = ({
  name, timeframe, budgetGoal, monthlyIncome, monthlyExpnese
}) => {
  const newItem = {
    id: crypto.randomUUID(),
    name: name,
    timeframe: timeframe,
    budgetGoal: +budgetGoal,
    monthlyIncome: +monthlyIncome,
    monthlyExpnese: +monthlyExpnese,
    createdAt: Date.now(),
    color: generateRandomColor()
  }
  const existingExpenses = fetchData("budgets") ?? [];
  return localStorage.setItem("budgets",
    JSON.stringify([...existingExpenses
  , newItem]))
}
// create expense
export const createExpense = ({
  name, amount, budgetId
}) => {
  const newItem = {
    id: crypto.randomUUID(),
    name: name,
    amount : +amount,
    createdAt: Date.now(),
    budgetId : budgetId
 }
  const existingExpenses = fetchData("expenses") ?? [];
  return localStorage.setItem("expenses",
    JSON.stringify([...existingExpenses
  , newItem]))
}

// delete item
// export const deleteItem = ({ key }) => {
//   return localStorage.removeItem(key)
// }

// total spent by budget
export const calculateSpentByBudget = (budgetId) => {
  const expenses = fetchData("expenses") ?? [];
  const budgetSpent = expenses.reduce((acc, expense) => {
    // check if expense.id === budgetId I passed in
    if (expense.budgetId !== budgetId) return acc

    // add the current amount to my total
    return acc += expense.amount
  }, 0)
  return budgetSpent;
}

//Formatting
export const formatDateToLocaleString = (epoch) => new Date(epoch).toLocaleDateString();


// // Formating percentages
export const formatPercentage = (amt) => {
  return amt.toLocaleString(undefined, {
    style: "percent",
    minimumFractionDigits: 0,
  })
}

// // Format currency
export const formatCurrency = (amt) => {
  // Get the user's locale
  const userLocale = navigator.language || 'en-NG';

  // Create a formatter with a default currency
  const formatter = new Intl.NumberFormat(userLocale, {
    style: 'currency',
    currency: 'NGN', // Default currency
  });

  // Extract the currency code from the formatter
  const currencyCode = formatter.resolvedOptions().currency || 'NGN';

  // Format the amount using the detected or default currency code
  return new Intl.NumberFormat(userLocale, {
    style: 'currency',
    currency: currencyCode,
  }).format(amt);
};





