import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

describe("TodoList", () => {
  let todoList: Contract;

  async function deployTodoListFixture() {
    const TodoList = await ethers.getContractFactory("TodoList");
    return await TodoList.deploy();
  }

  beforeEach(async () => {
    todoList = (await loadFixture(deployTodoListFixture)) as any;
  });

  describe("Create Todo", () => {
    it("Should be able to push todo to todos array", async () => {
      await todoList.createTodo("Breakfast", "Cook bread and tea");
      const name = await todoList.todos(0);
      const count = await todoList.todoCount();

      expect(name.id).to.equal(1);
      expect(name.title).to.equal("Breakfast");
      expect(name.description).to.equal("Cook bread and tea");
      expect(name.isDone).to.equal(false);
      expect(count).to.equal(1);
    });
  });

  describe("toggleCompleted", () => {
    it("Should toggle the completion status of a todo item", async () => {
      await todoList.createTodo("Breakfast", "Cook bread and tea");
      const before = await todoList.todos(0);
      await todoList.toggleCompleted(0);
      const after = await todoList.todos(0);

      expect(after.isDone).to.equal(!before.isDone);
    });
  });

  describe("deleteTodo", () => {
    it("Should delete a todo item", async () => {
      await todoList.createTodo("Breakfast", "Cook bread and tea");
      await todoList.createTodo("Lunch", "Cook rice and beans");

      const initialTodos = await todoList.getAllTodos();
      await todoList.deleteTodo(0);
      const finalTodos = await todoList.getAllTodos();

      expect(finalTodos.length).to.equal(initialTodos.length - 1);
    });
  });

  describe("updateTodo", () => {
    it("Should update a todo item", async () => {
      await todoList.createTodo("Breakfast", "Cook bread and tea");
      await todoList.createTodo("Lunch", "Cook rice and beans");
      const initialTodos = await todoList.getAllTodos();
      await todoList.updateTodo("Lunch", "Fry yam and sauce", 1);
      const updatedTodo = await todoList.todos(1);
      const finalTodos = await todoList.getAllTodos();

      expect(updatedTodo.title).to.equal("Lunch");
      expect(updatedTodo.description).to.equal("Fry yam and sauce");
      expect(finalTodos.length).to.equal(initialTodos.length);
    });
  });

  describe("getspecificTodos", () => {
    it("Should retrieve specific todo items", async () => {
      await todoList.createTodo("Breakfast", "Drink bread and tea");
      await todoList.createTodo("Lunch", "Cook rice and beans");

      const todo1 = await todoList.getspecificTodos(0);
      const todo2 = await todoList.getspecificTodos(1);

      expect(todo1.title).to.equal("Breakfast");
      expect(todo1.description).to.equal("Drink bread and tea");
      expect(todo2.title).to.equal("Lunch");
      expect(todo2.description).to.equal("Cook rice and beans");
    });
  });
});
