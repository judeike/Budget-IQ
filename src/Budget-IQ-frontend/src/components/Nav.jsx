import React from 'react'
import logomark from "../assets/logomark.svg"
import { Form, NavLink } from 'react-router-dom'
import { KeyIcon } from "@heroicons/react/24/solid"

const Nav = ({userName}) => {
  return (
    <nav>
        <NavLink
        to="/"
        aria-label='Home'
        >
        <img src={logomark} alt='' height={30}/>
        <span>Budget-IQ</span>
        </NavLink>
        {
            userName && (
                <Form
                method='post'
                action='logout'
                onSubmit={(event) =>{
                    if (!confirm ("Logging out of Dapp?"))
                        {
                            event.preventDefault()
                        }
                }}
                >
                    <button type='submit' className='btn btn--warning'>
                        <span> Logout </span>
                        <KeyIcon width={20}/>
                    </button>

                </Form>
            )
        }
     </nav>
  )
}

export default Nav
