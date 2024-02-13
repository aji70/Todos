import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("TodoList", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployTodoListFixture() {
    // Contracts are deployed using the first signer/account by default

    const TodoList = await ethers.getContractFactory("TodoList");
    const todoList = await TodoList.deploy();

    return { todoList };
  }

  describe("Create Todo", function () {
    it("Should be able to push todo to todos array", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);
      const tx = await todoList.createTodo("Breakfast", "Cook bread and tea");
      const name = await todoList.todos(0);
      const count = await todoList.todoCount();
      expect(name.id).to.equal(1);
      expect(name.title).to.equal("Breakfast");
      expect(name.description).to.equal("Cook bread and tea");
      expect(name.isDone).to.equal(false);
      expect(count).to.equal(1);
    });
  });
  describe("toggleCompleted", function () {
    it("Should toggle the completion status of a todo item", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);
      const tx = await todoList.createTodo("Breakfast", "Cook bread and tea");
      await tx.wait();
      const before = await todoList.todos(0);
      const transaction = await todoList.toggleCompleted(0);
      const name = await todoList.todos(0);
      await transaction.wait();
      expect(name.isDone).to.equal(!before.isDone);
    });
  });
  describe("deleteTodo", function () {
    it("Should delete todo item", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);
      const tx = await todoList.createTodo("Breakfast", "Cook bread and tea");
      const tx1 = await todoList.createTodo("Lunch", "Cook rice and beans");
      const array = await todoList.getAllTodos();
      const name = await todoList.todos(0);
      const transaction = await todoList.deleteTodo(0);
      await transaction.wait();
      const array1 = await todoList.getAllTodos();
      expect(array).to.not.equals(array1);
      // console.log(array);
      // console.log(array1);
    });
  });

  describe("updateTodo", function () {
    it("Should update todo list", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);
      const tx = await todoList.createTodo("Breakfast", "Cook bread and tea");
      const tx1 = await todoList.createTodo("Lunch", "Cook rice and beans");
      await tx1.wait();
      const countb4 = await todoList.todoCount();
      const array = await todoList.getAllTodos();
      const transaction = await todoList.updateTodo(
        "Lunch",
        "fry yam and sauce",
        0
      );

      const name = await todoList.todos(0);
      await transaction.wait();
      const countafter = await todoList.todoCount();
      const array1 = await todoList.getAllTodos();
      expect(array).to.not.equals(array1);
      expect(countb4).to.equal(countafter);
      // console.log(array);
      // console.log(array1);
      // console.log(countb4);
      // console.log(countafter);
    });
  });
  describe("getspecificTodos", function () {
    it("Should update todo list", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);
      const tx = await todoList.createTodo("Breakfast", "drink bread and tea");
      await tx.wait();
      const tx1 = await todoList.createTodo("Lunch", "Cook rice and beans");
      await tx1.wait();
      const cx1 = await todoList.getspecificTodos(0);
      const cx2 = await todoList.getspecificTodos(1);

      expect(cx1.id).to.equal(1);
      expect(cx1.title).to.equal("Breakfast");
      expect(cx1.description).to.equal("drink bread and tea");
      expect(cx1.isDone).to.equal(false);
      expect(cx2.id).to.equal(2);
      expect(cx2.title).to.equal("Lunch");
      expect(cx2.description).to.equal("Cook rice and beans");
      expect(cx2.isDone).to.equal(false);

      // // expect(tx).to.equal(cx1);
      // // expect(tx1).to.equal(cx2);
      // console.log(tx);
      // console.log(tx1);
      // // console.log(cx1);
      // // console.log(cx2);
    });
  });
});
