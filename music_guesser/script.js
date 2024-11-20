
console.log("Script loaded");
const view = new View()
const model = new Model()
const controller = new Controller(view,model)
controller.init()