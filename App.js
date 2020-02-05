import React, { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newTask: "",
      toDoTasks: []
    }
  }

  componentDidMount() {
    fetch('http://localhost:59585/api/lists/get')
      .then(res => res.json())
      .then((data) => {
        this.setState({ toDoTasks: data })
      })
  }

  updateInput(key, value) {
    this.setState({
      [key]: value
    })
  }

  addItem() {
    const request = async () => {
      const response = await fetch('http://localhost:59585/api/lists/create',
        {
          mode: "cors",
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=UTF-8',
            'Origin': 'http://localhost:3000'
          },
          body: JSON.stringify({ description: this.state.newTask })
        });

      const json = await response.json();

      const newTask = {
        id: json,
        description: this.state.newTask.slice(),
        completed: false
      };
      const toDoTasks = [...this.state.toDoTasks];
      toDoTasks.push(newTask);
      this.setState({
        toDoTasks,
        newTask: ""
      });
    };

    request();
  }

  updateTask(id) {
    const toDoTasks = [...this.state.toDoTasks];
    var index = toDoTasks.findIndex(t => t.id === id);
    if (toDoTasks[index].completed) {
      toDoTasks[index].completed = false;
    }
    else {
      toDoTasks[index].completed = true;
    }
    this.setState({ toDoTasks: toDoTasks });

    fetch('http://localhost:59585/api/lists/update',
      {
        mode: "cors",
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json; charset=UTF-8',
          'Origin': 'http://localhost:3000'
        },
        body: JSON.stringify({ "id": id })
      })
  }

  render() {
    return (
      <div className="App">
        <div>
          Pending tasks
        <ul>
            {this.state.toDoTasks.filter((task) => task.completed === false).map(task => {
              return (
                <li key={task.id}>
                  {task.description}
                  <button
                    onClick={() => this.updateTask(task.id)}
                  >Done!</button>
                </li>
              )
            })}
          </ul>
        </div>
        <div>
          Add an item...
          <br />
          <input
            type="text"
            placeholder="Enter description..."
            value={this.state.newTask}
            onChange={e => this.updateInput("newTask", e.target.value)}
          />
          <button onClick={() => this.addItem()}>Add Task
          </button>
        </div>
        <br />
        <div>
          Completed tasks
          <ul>
            {this.state.toDoTasks.filter((task) => task.completed === true).map(task => {
              return (
                <li key={task.id}>
                  {task.description}
                  <button
                    onClick={() => this.updateTask(task.id)}
                  >Undo</button>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    );
  }
}
export default App;
