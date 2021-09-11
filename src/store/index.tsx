import { configureStore } from '@reduxjs/toolkit'

import todosReducer from './todos/todosSlice'
import filtersReducer from './filters/filtersSlice'
import counterReducer from './counterSlice'

const store = configureStore({
  reducer: {
    // Define a top-level state field named `todos`, handled by `todosReducer`
    todos: todosReducer,
    filters: filtersReducer,
    counter: counterReducer,
  },
})

export default store
