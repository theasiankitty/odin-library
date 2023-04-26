const emptyBookshelf = document.querySelector('.empty-bookshelf');
const bookshelf = document.querySelector('.bookshelf');

const addNewBook = document.querySelector('#addNewBook');
const addAnotherBook = document.querySelector('#addAnotherBook');

const modal = document.querySelector('.modal');
const modalContainer = document.querySelector('.modal-container');
const cancelBtn = document.querySelector('.cancel');

const inputControl = document.querySelectorAll('.input-control');
const formBook = document.querySelector('#newBookForm');

const bookTitle = document.querySelector('#book_title');
const bookAuthor = document.querySelector('#book_author');
const bookPages = document.querySelector('#book_pages');
const bookReadStatus = document.querySelector('#book_read_status');

const bookshelfSection = document.querySelector('.bookshelf-section');

const localBookshelf = JSON.parse(localStorage.getItem('myBooks'));

class Book {
  constructor(_title, _author, _pages, _readStatus) {
    this.title = _title;
    this.author = _author;
    this.pages = _pages;
    this.readStatus = _readStatus;
  }
}

class Bookshelf {
  constructor() {
    this.books = [];
  }

  set bookshelf(_books) {
    this.books = _books;
  }

  addBook(newBook) {
    if (!this.bookExist(newBook)) {
      this.books.push(newBook);
    }
  }

  removeBook(title) {
    this.books = this.books.filter((book) => book.title !== title);
  }

  getBook(title) {
    return this.books.find((book) => book.title === title);
  }

  getBookIndex(title) {
    return this.books.findIndex((book) => book.title === title);
  }

  bookExist(newBook) {
    return this.books.some((book) => book.title === newBook.title);
  }
}

let myBooks = new Bookshelf();

if (localBookshelf) {
  myBooks.bookshelf = localBookshelf;
}

const saveLocalStorage = () => {
  localStorage.setItem('myBooks', JSON.stringify(myBooks.books));
};

const bookshelfDisplay = (() => {
  const showEmptyBookshelf = () => {
    emptyBookshelf.style.display = 'flex';
    bookshelf.style.display = 'none';
  };

  const showBookshelf = () => {
    emptyBookshelf.style.display = 'none';
    bookshelf.style.display = 'block';
  };

  const showModal = () => {
    modal.style.display = 'block';
    modalContainer.classList.add('modal-open');

    setTimeout(() => {
      modalContainer.classList.remove('modal-open');
    }, 500);
  };

  const closeModal = () => {
    formBook.reset();
    modalContainer.classList.add('modal-close');

    setTimeout(() => {
      inputControl.forEach((input) => {
        input.classList.remove('error');
        input.classList.remove('success');
      });
      modalContainer.classList.remove('modal-close');
      modal.style.display = 'none';
    }, 100);
  };

  const removeBookDisplay = () => {
    bookshelfSection.innerHTML = '';
  };

  const setReadDisplay = (id, currentBook) => {
    const btn = document.querySelectorAll('.read-btn');
    const btnIndex = btn[id];

    if (currentBook) {
      btnIndex.textContent = 'Read';
      btnIndex.classList.remove('btn-inverted');
    } else {
      btnIndex.textContent = 'Not Read';
      btnIndex.classList.add('btn-inverted');
    }
  };

  const createCardDisplay = (book) => {
    const cardContainer = document.createElement('div');
    cardContainer.classList.add('card-container');
    cardContainer.setAttribute('data-title', book.title);

    const cardContent = document.createElement('div');
    cardContent.classList.add('card-content');

    const readBtn = document.createElement('button');
    readBtn.classList.add('btn');
    readBtn.classList.add('read-btn');
    readBtn.setAttribute('data-title', book.title);
    readBtn.addEventListener('click', () =>
      setRead(book.title, book.readStatus)
    );

    if (!book.readStatus) {
      readBtn.textContent = 'Read';
    } else {
      readBtn.textContent = 'Not Read';
      readBtn.classList.add('btn-inverted');
    }

    const removeBtn = document.createElement('button');
    removeBtn.classList.add('btn');
    removeBtn.textContent = 'Remove';
    removeBtn.setAttribute('data-title', book.title);
    removeBtn.addEventListener('click', () => removeBook(book.title));

    const cardFooter = document.createElement('div');
    cardFooter.classList.add('card-footer');

    const title = document.createElement('h4');
    title.classList.add('card-title');
    const author = document.createElement('span');
    author.classList.add('info-text');
    const pages = document.createElement('span');
    pages.classList.add('info-text');

    title.textContent = book.title;
    author.textContent = `Author: ${book.author}`;
    pages.textContent = `Pages: ${book.pages}`;

    cardContent.appendChild(title);
    cardContent.appendChild(author);
    cardContent.appendChild(pages);

    cardFooter.appendChild(readBtn);
    cardFooter.appendChild(removeBtn);

    cardContainer.appendChild(cardContent);
    cardContainer.appendChild(cardFooter);
    bookshelfSection.appendChild(cardContainer);
  };

  const loadBookshelfDisplay = () => {
    modal.onclick = (event) => {
      if (event.target === modalContainer) {
        closeModal();
      }
    };

    inputControl.forEach((input) => {
      input.addEventListener('change', () => {
        input.classList.remove('error');
        input.classList.remove('success');
      });
    });

    if (!myBooks.books.length) {
      showEmptyBookshelf();
    } else {
      showBookshelf();
    }
  };

  return {
    showEmptyBookshelf,
    showBookshelf,
    showModal,
    closeModal,
    removeBookDisplay,
    setReadDisplay,
    createCardDisplay,
    loadBookshelfDisplay,
  };
})();

const inputDisplay = (() => {
  const setError = (element) => {
    const inputErrorParent = element.parentElement;

    inputErrorParent.classList.add('error');
    inputErrorParent.classList.remove('success');
  };

  const setSuccess = (element) => {
    const inputSuccessControl = element.parentElement;

    inputSuccessControl.classList.add('success');
    inputSuccessControl.classList.remove('error');
  };

  const isFormValid = () => {
    let result = true;

    inputControl.forEach((input) => {
      if (input.classList.contains('error')) {
        result = false;
      } else {
        input.classList.remove('error');
        input.classList.remove('success');
      }
    });

    return result;
  };

  const validateInputs = () => {
    const bookTitleValue = bookTitle.value.trim();
    const bookAuthorValue = bookAuthor.value.trim();
    const bookPagesValue = bookPages.value.trim();

    if (bookTitleValue === '') {
      setError(bookTitle);
    } else {
      setSuccess(bookTitle);
    }

    if (bookAuthorValue === '') {
      setError(bookAuthor);
    } else {
      setSuccess(bookAuthor);
    }

    if (bookPagesValue < 10) {
      setError(bookPages);
    } else {
      setSuccess(bookPages);
    }
  };

  return { isFormValid, validateInputs };
})();

const loadBookshelf = () => {
  bookshelfDisplay.loadBookshelfDisplay();

  myBooks.books.forEach((book) => {
    bookshelfDisplay.createCardDisplay(book);
  });
};

const setRead = (title) => {
  const id = myBooks.getBookIndex(title);
  const currentBook = myBooks.getBook(title);

  bookshelfDisplay.setReadDisplay(id, currentBook.readStatus);

  if (currentBook.readStatus) {
    currentBook.readStatus = false;
  } else {
    currentBook.readStatus = true;
  }

  saveLocalStorage();
};

const removeBook = (title) => {
  bookshelfDisplay.removeBookDisplay();
  myBooks.removeBook(title);

  saveLocalStorage();
  loadBookshelf();
};

const createBook = () => {
  bookshelfDisplay.removeBookDisplay();

  const title = bookTitle.value.trim();
  const author = bookAuthor.value.trim();
  const pages = bookPages.value.trim();
  const readStatus = bookReadStatus.checked;

  const newBook = new Book(title, author, pages, readStatus);
  myBooks.addBook(newBook);

  saveLocalStorage();
  loadBookshelf();
};

formBook.addEventListener('submit', (e) => {
  inputDisplay.validateInputs();

  if (inputDisplay.isFormValid() === true) {
    createBook();
    formBook.reset();
    bookshelfDisplay.closeModal();
  } else {
    e.preventDefault();
  }
});

addNewBook.addEventListener('click', bookshelfDisplay.showModal);
addAnotherBook.addEventListener('click', bookshelfDisplay.showModal);
cancelBtn.addEventListener('click', bookshelfDisplay.closeModal);

loadBookshelf();
