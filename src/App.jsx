import React, { useReducer } from "react";
import { CiEdit } from "react-icons/ci";
import { IoMdCheckmark } from "react-icons/io";
import { MdOutlineDataSaverOn } from "react-icons/md";

const initialState = {
  todos: JSON.parse(localStorage.getItem("allTodo")) || [],
  inputValue: "",
  editTodo: {},
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
          if (newTodo.trim()) {
            const newTodos = [
              { id: id, todo: newTodo.trim(), completed: false },
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
            { id: id, todo: state.inputValue.trim(), completed: false },
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
        return state;
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
    case "SET-EDIT-TODO":
      return { ...state, editTodo: action.payload };
    case "UPDATED-TODO":
      return {
        ...state,
        editTodo: { ...state.editTodo, todo: action.payload.trim() },
      };
    case "SAVE-TODO":
      if (state.editTodo.todo.trim()) {
        const updatedTodo = state.todos.map((item) =>
          item.id === state.editTodo.id
            ? { ...item, todo: state.editTodo.todo.trim() }
            : item
        );
        localStorage.setItem("allTodo", JSON.stringify(updatedTodo));
        return { ...state, todos: updatedTodo, editTodo: {} };
      } else {
        alert("This field can't be empty");
        return state;
      }
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
                    style={{
                      display: item.id === state.editTodo.id ? "none" : "flex",
                    }}
                    onClick={() =>
                      dispatch({ type: "COMPLETED-TODO", payload: item.id })
                    }></aside>
                )}
                {item.completed ? (
                  <del>
                    {item.todo.length >= 15
                      ? (
                          item.todo.charAt(0).toUpperCase() + item.todo.slice(1)
                        ).substr(0, 30) + " ..."
                      : item.todo.charAt(0).toUpperCase() + item.todo.slice(1)}
                  </del>
                ) : (
                  <>
                    {item.id === state.editTodo.id ? (
                      <input
                        type="text"
                        autoFocus
                        required
                        value={state.editTodo.todo}
                        onChange={(e) =>
                          dispatch({
                            type: "UPDATED-TODO",
                            payload: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <p>
                        {item.todo.length >= 15
                          ? (
                              item.todo.charAt(0).toUpperCase() +
                              item.todo.slice(1)
                            ).substr(0, 30) + " ..."
                          : item.todo.charAt(0).toUpperCase() +
                            item.todo.slice(1)}
                      </p>
                    )}
                  </>
                )}
                <header>
                  <section
                    style={{ display: item.completed ? "none" : "flex" }}>
                    {item.id === state.editTodo.id ? (
                      <MdOutlineDataSaverOn
                        fontSize={18}
                        color="green"
                        cursor={"pointer"}
                        onClick={() => dispatch({ type: "SAVE-TODO" })}
                      />
                    ) : (
                      <CiEdit
                        fontSize={18}
                        color="green"
                        cursor={"pointer"}
                        onClick={() =>
                          dispatch({ type: "SET-EDIT-TODO", payload: item })
                        }
                      />
                    )}
                  </section>
                  <button
                    onClick={() =>
                      dispatch({ type: "DELETE-TODO", payload: item.id })
                    }>
                    x
                  </button>
                </header>
              </article>
            ))}
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
