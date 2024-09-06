import React from 'react'
import { calculateSpentByBudget, formatCurrency, formatPercentage } from '../helpers';

// library imports
import { BanknotesIcon, TrashIcon } from "@heroicons/react/24/outline";

// rrd imports
import { Form, Link } from "react-router-dom";


const BudgetItem = ({budgets, showDelete = false}) => {

const {id, name , budgetGoal , color } = budgets;
const spent = calculateSpentByBudget(id);

  return (
    <div 
        className='budget'
        style={{
            "--accent": color
        }}
        >
        <div className="progress-text">
            <h3>{name}</h3>
            <p>{formatCurrency(budgetGoal)} Budgeted</p>
        </div>
        <progress max={budgetGoal} value={spent}>
            {formatPercentage(spent / budgetGoal)}
        </progress>
        <div className="progress-text">
            <small>{formatCurrency(spent)} spent</small>
            <small>{formatCurrency(budgetGoal - spent)} remaining</small>
        </div>
        {showDelete ? (
        <div className="flex-sm">
          <Form
            method="post"
            action="delete"
            onSubmit={(event) => {
              if (
                !confirm(
                  "Are you sure you want to permanently delete this budget?"
                )
              ) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit" className="btn">
              <span>Delete Budget</span>
              <TrashIcon width={20} />
            </button>
          </Form>
        </div>
      ) : (
        <div className="flex-sm">
          <Link to={`/budget/${id}`} className="btn">
            <span>View Details</span>
            <BanknotesIcon width={20} />
          </Link>
        </div>
      )}
    </div>
  )
}

export default BudgetItem
