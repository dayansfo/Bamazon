//NPM packages
var mysql = require("mysql");
var inquirer = require("inquirer");

// SQL connection 
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon_db"
});

connection.connect(function(err) {
  if (err) throw err;
});

//functions 

function start() {
  connection.query("SELECT * FROM products", function(error, response) {
    if (error) throw error;
  
    for (var i = 0; i < response.length; i++) {
    console.log("ID: " + response[i].item_id);
    console.log("Product: " + response[i].product_name);
    console.log("Price: $" + response[i].price);
    console.log("----------");
  
    }
  
    inquirer.prompt([{
      name: "id",
      type: "input",
      message: "Please, type the Item ID you would like to purchase?",
      validate: function(value) {
          if (isNaN(value) === false) {
              return true;
          }
          return false;
      }
  }, {
      name: "units",
      type: "input",
      message: "How many would you like?",
      validate: function(value) {
          if (isNaN(value) === false) {
              return true;
          }
          return false;
      }

  }]).then(function(answer) {

      for (var i = 0; i < response.length; i++) {
          if (response[i].item_id === parseInt(answer.id))
              stock(parseInt(answer.id), answer.units,response[i].stock_quantity );
      }
  });
});
}
  
function stock(itemID, units, stock_quantity) {
        if (units > stock_quantity) {
            console.log("Insufficient quantity!");
            restart();
        } else
            updateQuantity(itemID, units);
            console.log("Thank you for your order")
}
  
function cost(itemID, units) {
    connection.query("SELECT * FROM products WHERE ?", {
        item_id: itemID
    }, function(error, response) {
        if (error) throw error;

        var totalCost = response[0].price * units;
        console.log("Total cost is $ " + totalCost);

        restart();
    });
}

function updateQuantity(itemID, units) {
        connection.query("UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id= ?", [units, itemID], function(error, response) {if (error) throw error;});

        cost(itemID, units);
}

function restart() {
    inquirer.prompt([{
        type: "confirm",
        message: "Add more items?",
        name: "confirm",
        default: true
    }]).then(function(answer) {
        if (answer.confirm)
            start();
        else {

            connection.end();
        }
    });
}
  
  start();
  
  
