// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract TodoList {
    // Define a struct to represent a todo item
    struct Todo {
        uint256 id;
        string title;
        string description;
        bool isDone;
    
    }

    uint256 public todoCount;
    Todo[] public todos;


    // Function to create a new todo item
    function createTodo(string memory _title, string memory _description) public {
        todoCount++;
        Todo memory  newTodo = Todo(todoCount,_title, _description, false);
        todos.push(newTodo);
    }

    // Function to toggle the completion status of a todo item
    function toggleCompleted(uint256 _id) public {
        Todo storage todo = todos[_id];
        todo.isDone = !todo.isDone;
    }
    function deleteTodo(uint256 _id) public {
        // require(todos.length > (_id-1), "invalid selection");
         todoCount--;
        delete todos[_id]; 
        for (uint256 i = _id; i < todos.length - 1; i++) {
            todos[i] = todos[i + 1];     
        }
          todos.pop();
    }
     function updateTodo(string memory _title, string memory _description, uint _id ) public {
        // require(todos.length > (_id-1), "invalid selection");
        deleteTodo(_id);
        Todo memory  newTodo = Todo((_id+1), _title, _description, false);
        todos.push(newTodo);
        todoCount++;
    }

    function getAllTodos() public view returns (Todo[] memory){
        return todos;

    }
     function getspecificTodos(uint _id) public view returns (Todo memory){
        return todos[_id];

    }
}
