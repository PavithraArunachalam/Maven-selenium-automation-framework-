#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "tasks.json");

function loadTasks() {
  if (!fs.existsSync(DATA_FILE)) {
    return [];
  }

  const data = fs.readFileSync(DATA_FILE, "utf8");
  return JSON.parse(data);
}

function saveTasks(tasks) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
}

function getNextId(tasks) {
  return tasks.length === 0
    ? 1
    : Math.max(...tasks.map((task) => task.id)) + 1;
}

function addTask(title) {
  if (!title) {
    console.log("Please provide a task title.");
    return;
  }

  const tasks = loadTasks();

  const task = {
    id: getNextId(tasks),
    title,
    completed: false,
  };

  tasks.push(task);
  saveTasks(tasks);

  console.log(`Added task #${task.id}: ${task.title}`);
}

function listTasks() {
  const tasks = loadTasks();

  if (tasks.length === 0) {
    console.log("No tasks found.");
    return;
  }

  tasks.forEach((task) => {
    const status = task.completed ? "✓" : " ";
    console.log(`[${status}] ${task.id}. ${task.title}`);
  });
}

function completeTask(id) {
  const tasks = loadTasks();
  const task = tasks.find((task) => task.id === Number(id));

  if (!task) {
    console.log(`Task #${id} not found.`);
    return;
  }

  task.completed = true;
  saveTasks(tasks);

  console.log(`Completed task #${id}: ${task.title}`);
}

function deleteTask(id) {
  const tasks = loadTasks();
  const taskIndex = tasks.findIndex((task) => task.id === Number(id));

  if (taskIndex === -1) {
    console.log(`Task #${id} not found.`);
    return;
  }

  const [deletedTask] = tasks.splice(taskIndex, 1);
  saveTasks(tasks);

  console.log(`Deleted task #${id}: ${deletedTask.title}`);
}

function showHelp() {
  console.log(`
Task Manager

Usage:
  node task.js add "Task title"
  node task.js list
  node task.js complete <id>
  node task.js delete <id>

Examples:
  node task.js add "Learn JavaScript"
  node task.js list
  node task.js complete 1
  node task.js delete 1
`);
}

const [, , command, ...args] = process.argv;

switch (command) {
  case "add":
    addTask(args.join(" "));
    break;

  case "list":
    listTasks();
    break;

  case "complete":
    completeTask(args[0]);
    break;

  case "delete":
    deleteTask(args[0]);
    break;

  default:
    showHelp();
}