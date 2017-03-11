import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Tasks } from '../api/tasks.js';
import Task from './Task.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';
import { Meteor } from 'meteor/meteor';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';

const state = observable({
  inputValue: '',
  hideCompleted: false
})

// App component - represents the whole app
const App = observer(({ tasks, incompleteCount, currentUser }) => {
  App.displayName = 'App';

  const handleSubmit = (event) => {
    event.preventDefault();

    // Find the text field via mobx
    const text = state.inputValue

    Meteor.call('tasks.insert', text);

    // Clear form
    action(
      'clearInput',
      () => state.inputValue = ''
    )();
  }

  const toggleHideCompleted = action(
    'toggleHideCompleted',
    () => state.hideCompleted = !state.hideCompleted
  )

  const renderTasks = () => {
    let filteredTasks = tasks;
    if (state.hideCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.checked);
    }
    return filteredTasks.map((task) => {
      const currentUserId = currentUser && currentUser._id;
      const showPrivateButton = task.owner === currentUserId;

      return (
        <Task
          key={task._id}
          task={task}
          showPrivateButton={showPrivateButton}
        />
      );
    });
  }

  return (
    <div className="container">
      <header>
        <h1>Todo List ({ incompleteCount })</h1>

        <label className="hide-completed">
          <input
            type="checkbox"
            readOnly
            checked={ state.hideCompleted }
            onClick={ toggleHideCompleted }
          />
          Hide Completed Tasks
        </label>
        {/*
          this is a jsx comment that was created using Cmd + / in VS Code 1.10
          this is almost as cool as reactive connection between React and Mongo
        */}
        <AccountsUIWrapper />

        {(() => {
          if (currentUser) return (
            <form className="new-task" onSubmit={ handleSubmit } >
              <input
                type="text"
                value={state.inputValue}
                onChange={ e => state.inputValue = e.target.value }
                placeholder="Type to add new tasks"
              />
            </form>
          )
          return ''
        })()}
      </header>

      <ul>
      {
        renderTasks()
      }
      </ul>
    </div>
  );
})

App.propTypes = {
  tasks: PropTypes.array.isRequired,
  currentUser: PropTypes.object,
};

export default createContainer(() => {
  Meteor.subscribe('tasks');

  return {
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
    currentUser: Meteor.user(),
  }
}, App);