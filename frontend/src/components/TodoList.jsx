import React from 'react'
import Todo from './Todo'

function TodoList({todos, deleteTodo, editTodo}) {
  return (
    <div>
      {todos ? todos.map(todo=>(
        <Todo 
        key={todo.id} 
        todo={todo}
        deleteTodo={deleteTodo}
        editTodo = {editTodo}
        />
      )) : "List is empty"}
    </div>
  )
}

export default TodoList