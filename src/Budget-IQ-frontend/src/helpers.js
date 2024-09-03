export const wait = () => new Promise (res => setTimeout(res, Math.random() * 4000))

const generateRandomColor = () => {
  const existingBudgetLength = fetchData("budgets")?.length ?? 0;
  return `${existingBudgetLength * 39} 61% 40%`
}

// Local storage
export const fetchData = (key) => {
  return JSON.parse(localStorage.getItem(key));
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
  const existingBudgets = fetchData("budgets") ?? [];
  return localStorage.setItem("budgets",
    JSON.stringify([...existingBudgets, newItem]))
}

// delete item
export const deleteItem = ({ key }) => {
  return localStorage.removeItem(key)
}