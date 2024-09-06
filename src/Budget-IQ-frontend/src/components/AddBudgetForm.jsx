// reacts
import { useEffect, useRef } from "react";

// rrd imports
import { Form, useFetcher } from "react-router-dom"

// library imports
import { CurrencyDollarIcon } from "@heroicons/react/24/solid"

const AddBudgetForm = () => {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting"

  const formRef = useRef();
  const focusRef = useRef();

  useEffect(() => {
    if (!isSubmitting) {
      formRef.current.reset()
      focusRef.current.focus()
    }
  }, [isSubmitting])

  return (
    <div className="form-wrapper">
      <h2 className="h3">
        Create budget
      </h2>
      <fetcher.Form
        method="post"
        className="grid-sm"
        ref={formRef}
      >
        <div className="grid-xs">
          <label htmlFor="newBudget">Budget Plan</label>
          <input
            type="text"
            name="newBudget"
            id="newBudget"
            placeholder="e.g., Plan or Goal for budget"
            required
            ref={focusRef}
          />
        </div>
        <div className="grid-xs">
          <label htmlFor="budgetTime">Budget Time Frame</label>
          <input
            type="text"
            name="budgetTime"
            id="budgetTime"
            placeholder="e.g., Jan 2021 to jan 2024"
            required
          />
        </div>
        <div className="grid-xs">
          <label htmlFor="budgetedGoal">Planed Goal</label>
          <input
            type="text"
            name="budgetedGoal"
            id="budgetedGoal"
            placeholder="e.g., 20000"
            required
          />
        </div>
        <div className="grid-xs">
          <label htmlFor="monthlyIncome">Monthly Income</label>
          <input
            type="text"
            name="monthlyIncome"
            id="monthlyIncome"
            placeholder="e.g., 2400"
            required
            inputMode="decimal"
          />
        </div>
        <div className="grid-xs">
          <label htmlFor="monthlyExpenses">Monthly Expenses</label>
          <input
            type="number"
            step="0.01"
            name="monthlyExpenses"
            id="monthlyExpenses"
            placeholder="e.g., $350"
            required
            inputMode="decimal"
          />
        </div>
        <input type="hidden" name="_action" value="createBudget" />
        <button type="submit" className="btn btn--dark" disabled={isSubmitting}>
          {
            isSubmitting ? <span>Submitting…</span> : (
              <>
                <span>Create budget</span>
                <CurrencyDollarIcon width={20} />
              </>
            )
          }
        </button>
      </fetcher.Form>
    </div>
  )
}
export default AddBudgetForm