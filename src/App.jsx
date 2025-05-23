import React, { useReducer } from "react";
import { IoMdCheckmark } from "react-icons/io";

const initialState = {
  todos: [],
  inputValue: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD-TODO":
      const id = state.todos.length + 1;
      if (state.inputValue) {
        if (
          state.todos.find(
            (item) => item.todo.toLowerCase() === state.inputValue.toLowerCase()
          )
        ) {
          const newTodo = prompt(
            "This todo already existed, please enter a new one"
          );
          if (newTodo) {
            return {
              ...state,
              todos: [
                { id: id, todo: newTodo, completed: false },
                ...state.todos,
              ],
              inputValue: "",
            };
          }
        } else {
          return {
            ...state,
            todos: [
              { id: id, todo: state.inputValue, completed: false },
              ...state.todos,
            ],
            inputValue: "",
          };
        }
      } else {
        alert("please enter a todo");
      }
    case "ONCHANGE":
      return { ...state, inputValue: action.payload };
    case "COMPLETED-TODO":
      return {
        ...state,
        todos: state.todos.map((item) =>
          item.id === action.payload ? { ...item, completed: true } : item
        ),
      };
    case "DELETE-TODO":
      if (window.confirm("This would be deleted, are you sure?")) {
        return {
          ...state,
          todos: state.todos.filter((item) => item.id !== action.payload),
        };
      }
    default:
      return state;
  }
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <div className="app">
      <div className="app-holder">
        <div className="app-mainHolder">
          <h2>To-Do List</h2>
          <nav>
            <input
              type="text"
              placeholder="add your task here"
              value={state.inputValue}
              onChange={(e) =>
                dispatch({ type: "ONCHANGE", payload: e.target.value })
              }
              required
            />
            <button onClick={() => dispatch({ type: "ADD-TODO" })}>Add</button>
          </nav>
          <main>
            {state?.todos?.map((item, index) => (
              <article key={index}>
                {item.completed ? (
                  <footer>
                    <IoMdCheckmark />
                  </footer>
                ) : (
                  <aside
                    onClick={() =>
                      dispatch({ type: "COMPLETED-TODO", payload: item.id })
                    }></aside>
                )}
                {item.completed ? <del>{item.todo}</del> : <p>{item.todo}</p>}
                <button
                  onClick={() =>
                    dispatch({ type: "DELETE-TODO", payload: item.id })
                  }>
                  x
                </button>
              </article>
            ))}
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
