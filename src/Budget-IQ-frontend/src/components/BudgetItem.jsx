import React from 'react'
import { calculateSpentByBudget, formatCurrency, formatPercentage } from '../helpers';

const BudgetItem = ({budgets}) => {

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
    </div>
  )
}

export default BudgetItem
