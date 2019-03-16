var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection ({
  host: 'localhost',
  user: 'root',
  password: 'MSQabraxa$7',
  database: 'inventory',
  port: 3306
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected on id: " + connection.threadId);
  displayInventory();
  setTimeout(askForPN, 500);
});

function displayInventory() {
  connection.query('SELECT * FROM products', function(err, res) {
    if (err) throw err;
    console.table(res);  
  });
}

function getProductFromPID(num, callback) {
  var sql = 'SELECT * FROM products WHERE item_id = ' + num;
  connection.query(sql, function(err, results) {
    if (err) throw err;
    return callback(results[0]);
  });
}

function removeFromInventory(item, numberOrdered) {
  var sql = 'UPDATE products SET stock_quantity = ' + (item.stock_quantity - numberOrdered) + ' WHERE item_id = ' + item.item_id;
  connection.query(sql, function(err) {
    if (err) throw err;
    return;
  });
}

function checkIfProductExists(itemNumber) {
  var sql = 'SELECT * FROM products WHERE item_id = ' + itemNumber;
  connection.query(sql, function(err, results) {
    if (results[0] === undefined) {
      console.log("Invalid product number.");
      console.log("Try again.");
      return false;
    }
  });
  return true;
}

function askForPN() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'PN', 
      message: 'Enter the product id of the item you wish to buy.'
    }
  ]).then(function(userData) {
    console.log("NUMBER ENTERED: " + userData.PN);
    if(checkIfProductExists(userData.PN) === false) {
      return;
    } else {
      getProductFromPID(userData.PN, function(product) {
        console.log("PRODUCT: ", product.product_name);
        askForQuantity(product);
      });
    }
  });
}

function askForQuantity(item) {
  inquirer.prompt([
    {
      type: 'input',
      name: 'quantity', 
      message: 'How many ' + remove_s(item.product_name) + 's would you like to buy?'
    }
  ]).then(function(userData) {
    console.log("IN STOCK: " + item.stock_quantity);
    console.log("NUMBER ORDERED: " + userData.quantity);
    if(userData.quantity <= item.stock_quantity) {
      removeFromInventory(item, userData.quantity);
      billCustomer(item, userData.quantity);
    } else {
      console.log("Insufficient inventory. Your order did not go through.");
    }  
  });
}

function remove_s(str) {
  // Remove the final 's' if the noun is plural
  var result = str;
  if(str[str.length -1] === 's') {
    result = str.substring(0, str.length-1);
  }
  return result;
}

function billCustomer(item, numberOrdered) {
  console.log("Your order for " + numberOrdered + " " + remove_s(item.product_name) + "s has been placed.");
  console.log("Total billed : $" + (item.price * numberOrdered).toFixed(2));
  console.log("Thank you for shopping with Bamazon!");
  return process.abort;
}
