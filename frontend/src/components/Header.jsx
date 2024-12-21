import React from 'react'
import { Link } from 'react-router'
import { useContext } from 'react'
import AuthContext from '../context/AuthContext'

function Header() {
  const {user, logout} = useContext(AuthContext)

  return (
    <nav className='navbar'>
       <Link to="/">Home</Link>
       {user && <span>Hello, {user.name}</span>}
       {user ? <Link to="/login" onClick={logout}>Logout</Link> : <Link to="/login">Login</Link>}
    </nav>
  )
}

export default Header