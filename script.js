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

let myBooks = JSON.parse(localStorage.getItem('myBooks'));

if (!myBooks) {
  myBooks = [];
}

function showEmptyBookshelf() {
  emptyBookshelf.style.display = 'flex';
  bookshelf.style.display = 'none';
}

function showBookshelf() {
  emptyBookshelf.style.display = 'none';
  bookshelf.style.display = 'block';
}

function Book(title, author, pages, readStatus) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.readStatus = readStatus;
}

function setRead(title, readStatus) {
  const index = myBooks.findIndex((obj) => obj.title === title);
  const btn = document.querySelectorAll('.read-btn');
  const btnIndex = btn[index];

  if (readStatus) {
    btnIndex.textContent = 'Read';
    btnIndex.classList.remove('btn-inverted');
    myBooks[index].readStatus = false;
  } else {
    btnIndex.textContent = 'Not Read';
    btnIndex.classList.add('btn-inverted');
    myBooks[index].readStatus = true;
  }

  localStorage.setItem('myBooks', JSON.stringify(myBooks));
}

function removeBook(title) {
  const index = myBooks.findIndex((obj) => obj.title === title);
  const card = document.querySelectorAll('.card-container');
  const cardIndex = card[index];

  bookshelfSection.removeChild(cardIndex);

  myBooks.splice(index, 1);

  localStorage.setItem('myBooks', JSON.stringify(myBooks));

  if (!myBooks.length) {
    showEmptyBookshelf();
  }
}

function createCard(book) {
  const cardContainer = document.createElement('div');
  cardContainer.classList.add('card-container');
  cardContainer.setAttribute('data-title', book.title);

  const cardContent = document.createElement('div');
  cardContent.classList.add('card-content');

  const readBtn = document.createElement('button');
  readBtn.classList.add('btn');
  readBtn.classList.add('read-btn');
  readBtn.setAttribute('data-title', book.title);
  readBtn.addEventListener('click', () => setRead(book.title, book.readStatus));

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
}

function loadBooks() {
  if (!myBooks.length) {
    showEmptyBookshelf();
  } else {
    showBookshelf();

    myBooks.forEach((book) => {
      createCard(book);
    });
  }
}

function showModal() {
  modal.style.display = 'block';
  modalContainer.classList.add('modal-open');

  setTimeout(() => {
    modalContainer.classList.remove('modal-open');
  }, 500);
}

function closeModal() {
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
}

function createBook() {
  const title = bookTitle.value.trim();
  const author = bookAuthor.value.trim();
  const pages = bookPages.value.trim();
  const readStatus = bookReadStatus.checked;

  const newBook = new Book(title, author, pages, readStatus);
  myBooks.push(newBook);

  localStorage.setItem('myBooks', JSON.stringify(myBooks));

  createCard(newBook);
}

function saveBook() {
  if (myBooks.length) {
    createBook();
  } else {
    showBookshelf();
    createBook();
  }
}

addNewBook.addEventListener('click', showModal);
addAnotherBook.addEventListener('click', showModal);
cancelBtn.addEventListener('click', closeModal);

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

const isFormValid = () => {
  let result = true;

  inputControl.forEach((input) => {
    if (input.classList.contains('error')) {
      result = false;
    } else {
      input.classList.remove('error');
      input.classList.remove('success');
      result = true;
    }
  });

  return result;
};

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

  if (bookPagesValue === '') {
    setError(bookPages);
  } else {
    setSuccess(bookPages);
  }
};

formBook.addEventListener('submit', (e) => {
  validateInputs();

  if (isFormValid() === true) {
    saveBook();
    formBook.reset();
    closeModal();
  } else {
    e.preventDefault();
  }
});

loadBooks();
