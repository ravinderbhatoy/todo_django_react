import React from 'react'

function AddTodo({add_todo, todoName, setTodoName, editMode,editTodo, setEditMode, editingTodo}) {

    function handleChange(e){
        setTodoName(e.target.value)
    }

  return (
    <div className='search-box'>
        <input type="text" value={todoName} onChange={handleChange} placeholder='Add your todo here...' />
        { editMode ? 
        <>
        <button onClick={() =>editTodo(editingTodo,true)}>Edit</button>
        <button onClick={() =>{setEditMode(false); setTodoName("")}}>Cancel</button>
        </>
        : <button onClick={() =>add_todo(todoName)}>Add</button>
        }
    </div>
  )
}

export default AddTodo