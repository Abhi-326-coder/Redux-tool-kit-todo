import { createSlice,nanoid } from "@reduxjs/toolkit";

const iniitialState = {
    todos:[{id:1,text:"hello world"}]
}

export const todoSlice = createSlice({
    name:'todo',
    iniitialState,
    reducers:{
        addTodo:(state,action)=>{
            const todo = {
                id:nanoid(),
                text:action.payload
            }
        state.todos.push(todo)
        },
        removeTodo:(state,action)=>{
            state.todos = state.todos.filter((todo)=>todo.id!==action.payload)
        }
    }
})

export const {addTodo,removeTodo} = todoSlice.reducer

export default todoSlice.reducer