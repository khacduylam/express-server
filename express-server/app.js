const express    = require('express');
const Book       = require('./book.model');
const bodyParser = require('body-parser');
const mongoose   = require('mongoose');
const app = express();

mongoose.Promise = global.Promise;
//Connect to local mongodb
mongoose.connect('mongodb://127.0.0.1:27017/book', { useNewUrlParser: true })
        .then(connection => {
          if(connection) {
            console.log('Database connected');
          } else {
            console.log('Connection failed');
          }
        })
        .catch(err => console.log('Connection failed'));



//Use bidy-parser middleware to pasrse information from client's request
app.use(bodyParser.urlencoded({ extended: true }));

//Routes
app.get('/', (req, res, next) => {
  res.json({ message: 'Hello from server!' });
});

//Get specific book with its id
app.get('/books/:id', (req, res, next) => {
  Book.findById(req.params.id)
    .then(book => {
      if(book) {
        res.json({ book });
      } else {
        res.json({ book: 'Not found' });
      }
    })
    .catch(err => res.json({ Error: 'Something went wrong!' }));
});

//Get all books
app.get('/books', (req, res, next) => {
  Book.find({})
    .then(books => {
      res.json({ books });
    })
    .catch(err => {
      res.json({ books: null });
    });
});

//Create a new book
app.post('/books', (req, res, next) => {
  const newBook = new Book({
    title: req.body.title,
    pages: Number(req.body.pages),
    category: req.body.category,
    price: Number(req.body.price),
    author: req.body.author
  });

  newBook.save()
    .then(book => {
      if(book) {
        res.json({ success: true, book });
      } else {
        res.json({ success: false, book: null });
      }
    })
    .catch(err => res.json({ Error: 'Something went wrong!' }));
});

//Update a book with its id
app.patch('/books/:id', (req, res, next) => {
  Book.findByIdAndUpdate(req.params.id, {
    $set: {
      title: req.body.title,
      pages: Number(req.body.pages),
      category: req.body.category,
      price: Number(req.body.price),
      author: req.body.author
    }
  }, { new: true })
    .then(book => {
      if(book) {
        res.json({ success: true, book });
      } else {
        res.json({ success: false, book: 'Can not update this book' });
      }
    })
    .catch(err => res.json({ Error: 'Something went wrong!' }));
});

//Remove a book with its id
app.delete('/books/:id', (req, res, next) => {
  Book.findByIdAndDelete(req.params.id)
    .then(book => {
      if(book) {
        res.json({ success: true, book });
      } else {
        res.json({ success: false, book: 'Not found' });
      }
    })
    .catch(e => res.json({ Error: 'Something went wrong!' }));
});

app.listen(3030, () => {
  console.log('Server is running on port 3030');
});
