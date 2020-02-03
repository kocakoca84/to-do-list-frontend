import React, { Component } from 'react';

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      newTask: "",
      toDoTasks: []
    }
  }

  componentWillMount(){
    fetch('http://localhost:59585/api/lists/get')
    .then(res => res.json())
    .then((data) => {
      this.setState({ toDoTasks: data })
    })
  }

  updateInput(key, value){
    this.setState({
      [key]:value
    })
  }

  addItem(){
    fetch('http://localhost:59585/api/lists/create',
      {
        method: 'POST',
        body: JSON.stringify({"description": this.state.newTask})
     })
      .then(res => res.json())
      .then((data) => {
        const newTask={
          id:data.id,
          description: this.state.newTask.slice()
        };
        const toDoTasks=[...this.state.toDoTasks];
        toDoTasks.push(newTask);
        this.setState({
          toDoTasks,
          newTask:""
        })
      })
  }
  
  updateTask(id){
    const toDoTasks = [...this.state.toDoTasks];
    
    const updatedTasks = toDoTasks.filter(task => task.id !== id);

    this.setState({toDoTasks: updatedTasks});

    fetch('http://localhost:59585/api/lists/update',
      {
        method: 'POST',
        body: JSON.stringify({"id": id})
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
          <br/>
          <input 
            type="text"
            placeholder="Enter description..."
            value={this.state.newTask}
            onChange={e=> this.updateInput("newTask", e.target.value)}
          />
          <button onClick={() => this.addItem()}>Add Task
          </button>
          </div>
          <br/>
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
