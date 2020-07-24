// Importing external packages - Common JS
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const { request } = require("http");
const { response } = require("express");

// Creating my server
const app = express();

// Installing the body-parser middleware
// Allows us to read JSON from requests
app.use(bodyParser.json());

// Read in JSON FILE (mock database)
let products = [];

try {
  products = JSON.parse(fs.readFileSync("products.json")).products;
} catch (error) {
  console.log("No existing File");
}

// Defining our HTTP Resource Methods
// API Endpoints
// Routes

// GET all products
// GET /api/products
app.get("/api/products", (request, response) => {
  response.send(products);
});

// GET A SPECIFIC PRODUCT BY ID
// GET /api/products/:id
app.get("/api/products/:id", (request, response) => {
  const productId = Number(request.params.id);

  const product = products.find((p) => {
    if (productId === p.id) {
      return true;
    }
  });

  if (!product) {
    response.send(`Product with id ${productId} not found!`);
    return;
  }
  response.send(product);
});
// CREATE A NEW PRODUCT
app.post("/api/products", (request, response) => {
  // read the json body from the request
  const body = request.body;

  // Validate the json body to have required properties
  /* Required Properties
    -id
    -name
    -price
    */
  if (!body.id || !body.name || !body.price) {
    response.send("Bad Request. Validation Error. Missing id, name, or price!");
    return;
  }

  // Add the new product to our existing products array
  products.push(body);
  // Commit the new producst array to the database
  const jsonPayload = {
    products: products,
  };
  fs.writeFileSync("products.json", JSON.stringify(jsonPayload));

  response.send();
});

// UPDATING EXISTING PRODUCT BY ID
// PUT /api/products/id { id: 123, name: 'apples', price: 4.99}
app.put("/api/products/:id", (request, response) => {
  const productId = Number(request.params.id);

  const product = products.find((p) => {
    return productId === p.id;
  });

  if (!product) {
    response.send(`Product with id ${productId} not found!`);
    return;
  }

  const body = request.body;

  if (body.name) {
    product.name = body.name;
  }
  if (body.price) {
    product.price = body.price;
  }

  const jsonPayload = {
    products: products,
  };
  fs.writeFileSync("products.json", JSON.stringify(jsonPayload));

  response.send();
});
// DELETE EXISTING PRODUCY BY ID
// DELETE /api/prodcuts/:id
app.delete("/api/products/:id", (request, response) => {
  const productId = Number(request.params.id);
  const productIndex = products.findIndex((p) => {
    return productId === p.id;
  });

  if (productIndex === -1) {
    response.send(`Product with id ${productId} not found!`);
    return;
  }
  products.splice(productIndex, 1);
  const jsonPayload = {
    products: products,
  };
  fs.writeFileSync("products.json", JSON.stringify(jsonPayload));
  response.send();
});

// Starting my server
const port = process.env.PORT ? process.env.PORT : 3000;
app.listen(port, () => {
  console.log("Grocery API Server Started!");
});
