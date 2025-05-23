import React, { useReducer } from "react";
import { IoMdCheckmark } from "react-icons/io";

const initialState = {
  todos: JSON.parse(localStorage.getItem("allTodo")) || [],
  inputValue: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD-TODO":
      const id = state.todos.length + 1;
      if (state.inputValue.trim()) {
        if (
          state.todos.find(
            (item) => item.todo.toLowerCase() === state.inputValue.toLowerCase()
          )
        ) {
          const newTodo = prompt(
            "This todo already existed, please enter a new one"
          );
          if (newTodo) {
            const newTodos = [
              { id: id, todo: newTodo, completed: false },
              ...state.todos,
            ];
            localStorage.setItem("allTodo", JSON.stringify(newTodos));
            return {
              ...state,
              todos: newTodos,
              inputValue: "",
            };
          }
        } else {
          const newTodos = [
            { id: id, todo: state.inputValue, completed: false },
            ...state.todos,
          ];
          localStorage.setItem("allTodo", JSON.stringify(newTodos));
          return {
            ...state,
            todos: newTodos,
            inputValue: "",
          };
        }
      } else {
        alert("please enter a todo");
      }
    case "ONCHANGE":
      return { ...state, inputValue: action.payload };
    case "COMPLETED-TODO":
      const newTodos = state.todos.map((item) =>
        item.id === action.payload ? { ...item, completed: true } : item
      );
      localStorage.setItem("allTodo", JSON.stringify(newTodos));
      return {
        ...state,
        todos: newTodos,
      };
    case "DELETE-TODO":
      if (window.confirm("This would be deleted, are you sure?")) {
        const newTodos = state.todos.filter(
          (item) => item.id !== action.payload
        );
        localStorage.setItem("allTodo", JSON.stringify(newTodos));
        return {
          ...state,
          todos: newTodos,
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
                {item.completed ? (
                  <del>
                    {item.todo.length >= 20
                      ? (
                          item.todo.charAt(0).toUpperCase() + item.todo.slice(1)
                        ).substr(0, 30) + " ..."
                      : item.todo.charAt(0).toUpperCase() + item.todo.slice(1)}
                  </del>
                ) : (
                  <p>
                    {item.todo.length >= 20
                      ? (
                          item.todo.charAt(0).toUpperCase() + item.todo.slice(1)
                        ).substr(0, 30) + " ..."
                      : item.todo.charAt(0).toUpperCase() + item.todo.slice(1)}
                  </p>
                )}
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
