import React from "react";
import deleteImg from "../assets/delete.png"; // replace with your correct path
import tickImg from "../assets/tick.png"; // your tick mark image

const ToDoItem = ({ todo, onToggle, onDelete }) => {
  return (
    <div className="flex items-center justify-between bg-purple-100 p-3 rounded-lg mb-2 shadow-sm">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={todo.is_complete}
          onChange={() => onToggle(todo.id, !todo.is_complete)}
          className="w-5 h-5 accent-purple-500 mr-3"
        />
        <span className={todo.is_complete ? "line-through text-gray-400" : ""}>
          {todo.text}
        </span>
        {todo.is_complete && (
          <img src={tickImg} alt="tick" className="w-5 h-5 ml-2" />
        )}
      </div>
      <button onClick={() => onDelete(todo.id)}>
        <img src={deleteImg} alt="delete" className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ToDoItem;
