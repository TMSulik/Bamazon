var mysql = require('mysql');
var inquirer = require('inquirer');

// https://alligator.io/nodejs/interactive-command-line-prompts/

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
  displayManagerOptions();
});

function displayManagerOptions() {
  inquirer.prompt([
    {
      type: 'list',
      name: 'product_management',
      message: 'Select an option:',
      choices: [
                'View Products for Sale', 
                'View Low Inventory', 
                'Restock Inventory', 
                'Add New Product'
              ],
    },
  ]).then(answers => {
    switch(answers.product_management) {
      case 'View Products for Sale':
        displayInventory();
        break;
      case 'View Low Inventory':
        displayLowInventory();
        break;
      case 'Restock Inventory':
        restock();
        break;
      default:
        console.log("Didn't work.");
    }

  });
}

function displayInventory() {
  connection.query('SELECT * FROM products', function(err, res) {
    if (err) throw err;
    console.table(res);  
  });
}

function countProducts() {
  connection.query('SELECT ROW_COUNT() FROM products', function(err, res) {
    if (err) throw err;
    // How do you get this to return?
    return res.length;  
  });
}

function displayLowInventory() {
  connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res) {
    if (err) throw err;
    console.log("Stock is low on these items:");
    console.table(res);  
  });
}

function restock() {
  connection.query("SELECT product_name FROM products",
  function(err, res) {
    var arr = [];
    if (err) throw err;
    for(var i = 0; i < 4; i++) {
      arr.push(res[i].product_name);
    }
    inquirer.prompt([
      {
        type: 'list',
        name: 'product_list',
        message: 'Which item would you like to restock?',
        choices: arr
      },
    ]).then(answers => {
      countProducts();
      console.log(answers.product_list);

    });
      
  });

  
}

function listProductsForSale() {
  
  connection.query("SELECT product_name FROM products",

    function(err, res) {
      var arr = [];
    if (err) throw err;
    for(var i = 0; i < 4; i++) {
      arr.push(res[i].product_name);
    }
    console.log(arr);
    return arr;  
  });
  
}

function addToInventory(item, numberAdded) {
  var sql = 'UPDATE products SET stock_quantity = ' + (item.stock_quantity + numberAdded) + ' WHERE item_id = ' + item.item_id;
  connection.query(sql, function(err) {
    if (err) throw err;
    return;
  });
}