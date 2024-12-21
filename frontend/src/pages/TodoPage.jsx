import { useState, useEffect } from 'react'
import axios from 'axios';
import TodoList from '../components/TodoList'
import AddTodo from '../components/AddTodo';
import Header from '../components/Header';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router';


function TodoPage() {

  const navigator = useNavigate()

  const GET_TODOS = "http://127.0.0.1:8000/api/todos/"

  const [todos, setTodos] = useState([]);
  const [todoName, setTodoName] = useState("")
  const [editMode, setEditMode] = useState(false)
  const [editingTodo, setEditingTodo] = useState(null)

  const {update_todo, remove_todo, add_todo, authTokens, logout} = useContext(AuthContext)


  const get_todos = async () => {
    const response = await axios.get(GET_TODOS, {
      headers: {
        Authorization: "Bearer " + String(authTokens.access),
        "Content-Type": "application/json",
      },
    });
    
  console.log("Status text is ",response.statusText)
    const data = response.data
    if (response.status === 200){
      setTodos(data)
    }else if (response.statusText == 'Unauthorized'){
      logout()
    }
  };
  
  useEffect(()=>{
    get_todos()
  }, [])

   const createTodo = async (todoName) => {
    if (todoName.trim() != ""){
      const todo = await add_todo(todoName)
      setTodos([todo,...todos ])
    }
    return 
 }

 const deleteTodo = async (todoId) => {
  try{
    await remove_todo(todoId)
    setTodos(todos.filter((todo) => todo.id !== todoId))
  }catch(e){
    console.error(e)
  }
 }

 const editTodo = async (todo, inplace=false) => {
  if (inplace){
    if (todoName.trim() != ""){
      try {
        const response = await update_todo(todo.id, {todo_name: todoName})
        setEditMode(false)
        setTodoName("")
        setEditingTodo(null)
        setTodos(todos.map(element => 
         (element.id === todo.id ? {...element, todo_name: todoName} : element ) 
        ))
      }catch(error){
        console.log(error)
      }
    }
  }else{
    setEditMode(true)
    setTodoName(todo.todo_name)
    setEditingTodo(todo)
  }
 }

  return (
    <>
    <Header/>
    <div className='container'>
      <h1>My Todo's</h1>
      <AddTodo todoName={todoName}
       setTodoName={setTodoName}
       add_todo={createTodo}
       editMode={editMode}
       editTodo={editTodo}
       setEditMode={setEditMode}
       editingTodo={editingTodo}
      />
      <TodoList todos={todos} deleteTodo={deleteTodo} editTodo={editTodo}/>
    </div>
    </>
  )
}

export default TodoPage
