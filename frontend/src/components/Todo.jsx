import React from 'react'
import { useContext } from 'react'
import AuthContext from '../context/AuthContext'
import { useState } from 'react'

function Todo({todo, deleteTodo, editTodo}) {

  const [clientCompleted, setClientCompleted] = useState(todo.completed)
  const {update_todo} = useContext(AuthContext)

  const handleComplete = async () => {
    console.log("Calling completion")
    await update_todo(todo.id, {completed: !clientCompleted})
    setClientCompleted(prev => !prev)
  }

  return (
    <div className='todo-box'>
        <div className='todo-detail'>
            <input onChange={handleComplete}  checked={clientCompleted}  type="checkbox" />
            <span>{todo.todo_name}</span>
        </div>
        <div className='todo-btns'>
            <button onClick={()=>editTodo(todo)}>Edit</button>
            <button onClick={()=>deleteTodo(todo.id)}>Delete</button>
        </div>
    </div>
  )
}

export default Todo