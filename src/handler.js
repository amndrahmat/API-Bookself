const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (req, res) => {
  const id = nanoid(16);
  const newBook = {
    id,
    name: req.payload.name,
    year: req.payload.year,
    author: req.payload.author,
    summary: req.payload.summary,
    publisher: req.payload.publisher,
    pageCount: req.payload.pageCount,
    readPage: req.payload.readPage,
    finished: req.payload.pageCount === req.payload.readPage,
    reading: req.payload.reading,
    insertedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (newBook.name === undefined || newBook.name === '') {
    return res
      .response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      })
      .code(400);
  }

  if (newBook.readPage > newBook.pageCount) {
    return res
      .response({
        status: 'fail',
        message:
          'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      })
      .code(400);
  }

  books.push(newBook);
  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    return res
      .response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      })
      .code(201);
  }
  return res
    .response({
      status: 'fail',
      message: 'Buku gagal ditambahkan',
    })
    .code(500);
};

const getAllBooksHandler = (req, res) => {
  if (req.query.reading) {
    const readBook = req.query.reading === '1';
    return res
      .response({
        status: 'success',
        data: {
          books: books
            .filter((n) => n.reading === readBook)
            .map((book) => ({
              id: book.id,
              name: book.name,
              publisher: book.publisher,
            })),
        },
      })
      .code(200);
  }
  if (req.query.name) {
    const findName = req.query.name.toLowerCase();
    return res
      .response({
        status: 'success',
        data: {
          books: books
            .filter((n) => n.name.toLowerCase().includes(findName))
            .map((book) => ({
              id: book.id,
              name: book.name,
              publisher: book.publisher,
            })),
        },
      })
      .code(200);
  }
  if (req.query.finished) {
    const finishedBook = req.query.finished === '1';
    return res
      .response({
        status: 'success',
        data: {
          books: books
            .filter((n) => n.finished === finishedBook)
            .map((book) => ({
              id: book.id,
              name: book.name,
              publisher: book.publisher,
            })),
        },
      })
      .code(200);
  }

  return res
    .response({
      status: 'success',
      data: {
        books: books.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    })
    .code(200);
};

const getBookByIdHandler = (req, res) => {
  const { id } = req.params;
  const book = books.filter((n) => n.id === id)[0];

  if (book === undefined) {
    return res
      .response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
      })
      .code(404);
  }
  return res
    .response({
      status: 'success',
      data: {
        book: {
          id: book.id,
          name: book.name,
          year: book.year,
          author: book.author,
          summary: book.summary,
          publisher: book.publisher,
          pageCount: book.pageCount,
          readPage: book.readPage,
          finished: book.finished,
          reading: book.reading,
          insertedAt: book.insertedAt,
          updatedAt: book.updatedAt,
        },
      },
    })
    .code(200);
};

const editBookByIdHandler = (req, res) => {
  const { id } = req.params;

  if (req.payload.name === undefined || req.payload.name === '') {
    return res
      .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      })
      .code(400);
  }

  if (req.payload.readPage > req.payload.pageCount) {
    return res
      .response({
        status: 'fail',
        message:
          'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      })
      .code(400);
  }
  const index = books.findIndex((book) => book.id === id);

  if (index === -1) {
    return res
      .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
      })
      .code(404);
  }
  books[index] = {
    ...books[index],
    name: req.payload.name,
    year: req.payload.year,
    author: req.payload.author,
    summary: req.payload.summary,
    publisher: req.payload.publisher,
    pageCount: req.payload.pageCount,
    readPage: req.payload.readPage,
    reading: req.payload.reading,
    updatedAt: new Date().toISOString(),
  };
  return res
    .response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    })
    .code(200);
};

const deleteBookByIdHandler = (req, res) => {
  const { id } = req.params;

  const index = books.findIndex((book) => book.id === id);
  if (index === -1) {
    return res
      .response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
      })
      .code(404);
  }
  books.splice(index, 1);
  return res
    .response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    })
    .code(200);
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
