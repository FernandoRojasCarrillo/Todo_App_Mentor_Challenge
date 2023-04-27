import { useState } from "react";
import sunIcon from "../images/icon-sun.svg";
import moonIcon from "../images/icon-moon.svg";
import SingleTask from "./SingleTask";

import { v4 as uuidv4 } from "uuid";

const TodoForm = () => {
  const [input, setInput] = useState("");
  const [themeIcon, setThemeIcon] = useState(sunIcon);
  const [tasks, setTasks] = useState([
    {
      id: uuidv4(),
      complited: true,
      text: "Complete online JavaScript course",
    },
    {
      id: uuidv4(),
      complited: false,
      text: "Watch Starship's second launch attempt",
    },
    { id: uuidv4(), complited: false, text: "Jog around the park 3x" },
    { id: uuidv4(), complited: false, text: "10 minutes meditation" },
    { id: uuidv4(), complited: false, text: "Read for 1 hour" },
    { id: uuidv4(), complited: false, text: "Pick up groceries" },
    {
      id: uuidv4(),
      complited: true,
      text: "Complete Todo App on Fronend Mentor",
    },
  ]);
  const [shownTask, setShownTasks] = useState(null);

  /* _____ Input Handlers _____ */
  const HandleChange = ({ target: { value } }) => setInput(value);

  const HandleOnSubmit = (e) => {
    e.preventDefault();
    setTasks((prev) => {
      return [{ id: uuidv4(), complited: false, text: input }, ...prev];
    });
    setInput("");

    startNewTaskAnimation();
  };

  const startNewTaskAnimation = () => {
    const taskCreated = document.querySelector(".single-task:first-child");
    console.log(taskCreated);
    taskCreated?.classList.add("animation-started");

    setTimeout(() => {
      taskCreated?.classList.remove("animation-started");
    }, 300);
  };

  /* _____ Tasks drag and drop Handlers _____ */
  const HandleDragStart = (e) => {
    const Task = e.target;
    Task?.classList.add("dragging");
  };

  const HandleDragEnd = () => {
    const Task = document.querySelector(".dragging");
    Task?.classList.remove("dragging");
    setTasks(tasks);
  };

  const HandleDragOver = (e) => {
    e.preventDefault();

    const draggable = document.querySelector(".dragging");
    const ContainerTasks = document.querySelector(".single-task-container");
    const afterElement = getDragAfterElement(ContainerTasks, e.clientY);

    if (afterElement == null) {
      ContainerTasks.appendChild(draggable);
      ReorderTasks(draggable, afterElement);
    } else {
      ContainerTasks.insertBefore(draggable, afterElement);
      ReorderTasks(draggable, afterElement);
    }
  };

  const getDragAfterElement = (container, y) => {
    const draggableElements = [
      ...container.querySelectorAll(".single-task:not(.dragging)"),
    ];

    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2.5;

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  };

  /* _____ Tasks information Handlers _____ */
  const TasksLeft = tasks.filter((task) => task.complited === false).length;
  const CheckTask = (id) => {
    setTasks([
      ...tasks.map((task) => {
        if (task.id === id) {
          return {
            ...task,
            complited: !task.complited,
          };
        } else {
          return task;
        }
      }),
    ]);
  };

  const DeleteTask = (id) => {
    setTasks([...tasks.filter((task) => task.id !== id)]);
  };

  const HandleTasksShown = ({ target }, value) => {
    const ActiveTasksShown = document.querySelector(`[area-active="active"]`);
    ActiveTasksShown.removeAttribute("area-active");

    target.setAttribute("area-active", "active");
    setShownTasks(value);
  };

  const ClearComplited = () => {
    setTasks([...tasks.filter((task) => task.complited === false)]);

    setShownTasks(null);
  };

  const ReorderTasks = (taskOne, taskTwo) => {
    const currentTask = tasks.filter(
      (task) => task.id === taskOne.getAttribute("area-task-id")
    );
    const AllTasks = tasks.filter(
      (task) => task.id !== taskOne.getAttribute("area-task-id")
    );

    if (taskTwo) {
      AllTasks.splice(taskTwo.getAttribute("area-task-key"), 0, currentTask[0]);
    } else {
      AllTasks.push(currentTask[0]);
    }
  };

  /* _____ Theme Handlers _____ */
  const HandleSetTheme = ({ target }) => {
    const themeButton = document.querySelector(".app-theme-icon");
    themeButton.style.transform = "scale(0)";

    const mainApp = document.querySelector("main");
    mainApp?.classList.toggle("light-theme");

    setTimeout(() => {
      if (mainApp?.classList.contains("light-theme")) {
        setThemeIcon(moonIcon);
      } else {
        setThemeIcon(sunIcon);
      }
      themeButton.style.transform = "scale(1)";
    }, 300);
  };

  return (
    <div className="form-container">
      <div className="todo-title-container">
        <h1 className="form-title">TODO</h1>
        <img
          onClick={(e) => HandleSetTheme(e)}
          src={themeIcon}
          alt=""
          className="app-theme-icon"
        />
      </div>

      <form onSubmit={(e) => HandleOnSubmit(e)} className="todo-form-container">
        <div className="icon-form"></div>
        <input
          onChange={(e) => HandleChange(e)}
          type="text"
          value={input}
          placeholder="Create a new todo..."
          className="container-input"
        />
      </form>

      {tasks.length ? (
        <div
          className="tasks-container"
          style={{ "--tasks-amount": `${tasks.length}` }}
        >
          <div
            onDragOver={(e) => HandleDragOver(e)}
            className="single-task-container"
          >
            {tasks.length &&
              tasks
                .filter((task) => task.complited !== shownTask)
                .map((task, index) => (
                  <div
                    key={index}
                    area-task-id={task.id}
                    area-task-key={index}
                    draggable="true"
                    onDragStart={(e) => HandleDragStart(e)}
                    onDragEnd={(e) => HandleDragEnd(e)}
                    className="single-task"
                  >
                    <SingleTask
                      task={task}
                      CheckTask={CheckTask}
                      DeleteTask={DeleteTask}
                    />
                  </div>
                ))}
          </div>
          <div className="conatiner-form-footer">
            <div className="items-amount"> {`${TasksLeft} items left`} </div>
            <button
              onClick={(e) => HandleTasksShown(e, null)}
              area-active="active"
              className="select-view"
            >
              All
            </button>
            <button
              onClick={(e) => HandleTasksShown(e, true)}
              className="select-view"
            >
              Active
            </button>
            <button
              onClick={(e) => HandleTasksShown(e, false)}
              className="select-view"
            >
              Completed
            </button>
            <button
              onClick={() => ClearComplited()}
              className="clear-complited-tasks"
            >
              Clear Completed
            </button>
          </div>
        </div>
      ) : null}

      {tasks.length ? (
        <div className="container-footer-movile-btns">
          <button
            onClick={(e) => HandleTasksShown(e, null)}
            area-active="active"
            className="select-view-movile"
          >
            All
          </button>
          <button
            onClick={(e) => HandleTasksShown(e, true)}
            className="select-view-movile"
          >
            Active
          </button>
          <button
            onClick={(e) => HandleTasksShown(e, false)}
            className="select-view-movile"
          >
            Completed
          </button>
        </div>
      ) : null}

      {tasks.length ? (
        <p className="form-message">Drag and drop to reorder list</p>
      ) : null}
    </div>
  );
};

export default TodoForm;
