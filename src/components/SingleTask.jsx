const SingleTask = ({ task, CheckTask, DeleteTask }) => {
  const HandleDeleteTask = (e) => {
    e.stopPropagation();
    DeleteTask(task.id);
  };

  const HandleCheckTask = (e) => {
    CheckTask(task.id);
    e.target.classList.add("animation-active");
    setTimeout(() => {
      e.target.classList.remove("animation-active");
    }, 250);
  };

  return (
    <div
      onClick={(e) => HandleCheckTask(e)}
      className="individual-task-container"
    >
      <div
        area-checked={task.completed ? "checked" : ""}
        className="task-check-box"
      >
        {task.completed ? (
          <svg
            className="task-check-box-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="11"
            height="9"
          >
            <path
              fill="none"
              stroke="#FFF"
              stroke-width="2"
              d="M1 4.304L3.696 7l6-6"
            />
          </svg>
        ) : null}
      </div>
      <div
        area-checked={task.completed ? "checked" : ""}
        className="task-message"
      >
        {task.text}
      </div>
      <svg
        onClick={(e) => HandleDeleteTask(e)}
        className="task-delete-btn"
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
      >
        <path
          fill="#494C6B"
          fill-rule="evenodd"
          d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"
        />
      </svg>
    </div>
  );
};

export default SingleTask;
