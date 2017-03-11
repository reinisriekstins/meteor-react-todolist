import React, { PropTypes } from 'react';
import { Tasks } from '../api/tasks.js';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';

// Task component - represents a single todo item
const Task = ({ task, showPrivateButton }) => {
  const toggleChecked = () => {
    // Set the checked property to the opposite of its current value
    Meteor.call('tasks.setChecked', task._id, !task.checked);
  }

  const deleteThisTask = () => {
    Meteor.call('tasks.remove', task._id);
  }

  const togglePrivate = () => {
    Meteor.call('tasks.setPrivate', task._id, ! task.private);
  }

  // Give tasks a different className when they are checked off,
  // so that we can style them nicely in CSS
  const taskClassName = classnames({
    checked: task.checked,
    private: task.private,
  });

  return(
    <li className={taskClassName}>
      <button className="delete" onClick={ deleteThisTask }>
        &times;
      </button>

      <input
        type="checkbox"
        readOnly
        checked={task.checked}
        onClick={toggleChecked}
      />

      {
        showPrivateButton ? (
          <button className="toggle-private" onClick={ togglePrivate }>
            { task.private ? 'Private' : 'Public' }
          </button>
        ) : ''
      }

      <span className="text">
        { task.username && <strong>{task.username}: </strong> }
        { task.text }
      </span>
    </li>
  )
}

Task.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  task: PropTypes.object.isRequired,
  showPrivateButton: PropTypes.bool.isRequired,
};

export default Task