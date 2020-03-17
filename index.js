//api

const apiHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json"
};

function get(url) {
  return fetch(url).then(resp => resp.json());
}

function patch(url, id, bookData) {
  return fetch(url+id, {
    method: "PATCH",
    headers: apiHeaders,
    body: JSON.stringify(bookData)
  }).then(resp => resp.json());
}

const API = { get, patch };

//api end

const booksUrl = "https://5773827a.ngrok.io/books/";
const currentUser = { id: 1, username: "pouros" };

const listPanel = document.querySelector("#list");
const showPanel = document.querySelector("#show-panel");

function getAllBooks() {
  API.get(booksUrl).then(books =>
    books.forEach(book => appendBookPreview(book))
  );
}

function appendBookPreview(book) {
  const li = document.createElement("li");
  li.innerText = book.title;
  li.addEventListener("click", () => showBook(book));
  listPanel.append(li);
}

function showBook(book) {
  while (showPanel.firstChild) showPanel.removeChild(showPanel.firstChild);

  const h2 = document.createElement("h2");
  h2.innerText = book.title;

  const p = document.createElement("p");
  p.innerText = book.description;

  const img = document.createElement("img");
  img.src = book.img_url;

  const ul = document.createElement("ul");
  ul.id = "users-list";

  book.users.forEach(bookUser => {
    const userLi = document.createElement("li");
    userLi.innerText = bookUser.username;
    userLi.id = `user-${bookUser.id}`;
    ul.append(userLi);
  });

  const readBtn = document.createElement("button");
  readBtn.addEventListener("click", () => handleButtonClick(book));

  if (hasUserReadThisBook(book)) {
    readBtn.innerText = "Unread Me";
  } else {
    readBtn.innerText = "Read Me";
  }

  showPanel.append(h2, img, p, readBtn, ul);
}

function handleButtonClick(book) {
  if (!hasUserReadThisBook(book)) {
    book.users.push(currentUser);
  } else {
    book.users = book.users.filter(bookUser => bookUser.id !== currentUser.id);
  }
  API.patch(booksUrl, book.id, book).then(newBookData => {
    const ul = document.querySelector("#users-list");
    while (ul.lastChild) {
      ul.removeChild(ul.lastChild);
    }
    newBookData.users.forEach(bookUser => {
      const userLi = document.createElement("li");
      userLi.innerText = bookUser.username;
      userLi.id = `user-${bookUser.id}`;
      ul.append(userLi);
    });
    const readBtn = document.querySelector("button");
    !hasUserReadThisBook(book)
      ? (readBtn.innerText = "Read Me")
      : (readBtn.innerText = "Unread Me");
  });
}

function hasUserReadThisBook(book) {
  return book.users.find(bookUsr => bookUsr.id === currentUser.id);
}

getAllBooks();
