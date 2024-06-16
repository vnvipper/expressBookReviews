const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(200).json({message: "User already exists!"});
    }
  }
  return res.status(400).json({message: "username OR password are not provided."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  getAvailableBooks.then(result => {
    res.send(JSON.stringify({result}, null, 4));
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  getBookByIsbn(isbn).then(result => {
    res.send(result);
  });
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  getBookByAuthor(author).then(result => {
    res.send(result);
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  getBookByTitle(title).then(result => {
    res.send(result);
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]?.reviews);
});

const getAvailableBooks = new Promise((resolve,reject)=>{
  setTimeout(() => {
    resolve(books);
  },1000)
});

const getBookByIsbn = isbn => {
  return getAvailableBooks.then(result => result[isbn]);
}

const getBookByAuthor = async author => {
  const availableBooks = await getAvailableBooks;
  let isbn;
  for (const [id, book] of Object.entries(availableBooks)) {
    if (book.author === author) {
        isbn = id;
    }
  }
  return availableBooks[isbn];
}

const getBookByTitle = async title => {
  const availableBooks = await getAvailableBooks;
  let isbn;
  for (const [id, book] of Object.entries(availableBooks)) {
    if (book.title === title) {
        isbn = id;
    }
  }
  return availableBooks[isbn];
}

module.exports.general = public_users;
