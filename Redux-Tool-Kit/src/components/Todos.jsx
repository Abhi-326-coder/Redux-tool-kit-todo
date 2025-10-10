import React from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { removeTodo } from '../feature/todo/todoSlice'

const Todos = () => {
    useSelector(state=> state.todos)
  return (
    <div>
        
    </div>
  )
}

export default Todos