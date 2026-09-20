
// ======================================
// Library Management System
// ======================================


// Get HTML elements
const bookForm = document.getElementById("bookForm");

const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const categoryInput = document.getElementById("category");
const yearInput = document.getElementById("year");

const bookList = document.getElementById("bookList");
const noBooks = document.getElementById("noBooks");

const searchInput = document.getElementById("searchInput");
const filterCategory = document.getElementById("filterCategory");

const totalBooks = document.getElementById("totalBooks");
const availableBooks = document.getElementById("availableBooks");
const issuedBooks = document.getElementById("issuedBooks");


// ======================================
// Load books from localStorage
// ======================================

let books = JSON.parse(localStorage.getItem("libraryBooks")) || [];


// ======================================
// Save books
// ======================================

function saveBooks() {
    localStorage.setItem("libraryBooks", JSON.stringify(books));
}


// ======================================
// Add Book
// ======================================

bookForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const title = titleInput.value.trim();
    const author = authorInput.value.trim();
    const category = categoryInput.value;
    const year = yearInput.value;

    // Basic validation
    if (title === "" || author === "" || category === "" || year === "") {
        alert("Please fill all fields.");
        return;
    }

    const newBook = {
        id: Date.now(),
        title: title,
        author: author,
        category: category,
        year: year,
        status: "Available"
    };

    books.push(newBook);

    saveBooks();

    displayBooks();

    bookForm.reset();

    alert("Book added successfully!");
});


// ======================================
// Display Books
// ======================================

function displayBooks() {

    const searchText = searchInput.value.toLowerCase();
    const selectedCategory = filterCategory.value;

    bookList.innerHTML = "";

    const filteredBooks = books.filter(function(book) {

        const matchesSearch =
            book.title.toLowerCase().includes(searchText) ||
            book.author.toLowerCase().includes(searchText);

        const matchesCategory =
            selectedCategory === "All" ||
            book.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });


    // No books found
    if (filteredBooks.length === 0) {

        noBooks.style.display = "block";

    } else {

        noBooks.style.display = "none";

    }


    // Create table rows
    filteredBooks.forEach(function(book, index) {

        const row = document.createElement("tr");

        let actionButton = "";

        if (book.status === "Available") {

            actionButton = `
                <button
                    class="action-btn issue-btn"
                    onclick="issueBook(${book.id})">
                    Issue
                </button>
            `;

        } else {

            actionButton = `
                <button
                    class="action-btn return-btn"
                    onclick="returnBook(${book.id})">
                    Return
                </button>
            `;
        }


        row.innerHTML = `
            <td>${index + 1}</td>

            <td>
                <strong>${book.title}</strong>
            </td>

            <td>${book.author}</td>

            <td>${book.category}</td>

            <td>${book.year}</td>

            <td>
                <span class="status ${
                    book.status === "Available"
                        ? "available"
                        : "issued"
                }">
                    ${book.status}
                </span>
            </td>

            <td>
                ${actionButton}

                <button
                    class="action-btn delete-btn"
                    onclick="deleteBook(${book.id})">
                    Delete
                </button>
            </td>
        `;

        bookList.appendChild(row);
    });


    updateStatistics();
}


// ======================================
// Issue Book
// ======================================

function issueBook(id) {

    const book = books.find(function(book) {
        return book.id === id;
    });

    if (book) {

        book.status = "Issued";

        saveBooks();

        displayBooks();

        alert(`"${book.title}" has been issued.`);
    }
}


// ======================================
// Return Book
// ======================================

function returnBook(id) {

    const book = books.find(function(book) {
        return book.id === id;
    });

    if (book) {

        book.status = "Available";

        saveBooks();

        displayBooks();

        alert(`"${book.title}" has been returned.`);
    }
}


// ======================================
// Delete Book
// ======================================

function deleteBook(id) {

    const book = books.find(function(book) {
        return book.id === id;
    });

    if (!book) {
        return;
    }

    const confirmDelete = confirm(
        `Are you sure you want to delete "${book.title}"?`
    );

    if (confirmDelete) {

        books = books.filter(function(book) {
            return book.id !== id;
        });

        saveBooks();

        displayBooks();
    }
}


// ======================================
// Update Statistics
// ======================================

function updateStatistics() {

    const total = books.length;

    const available = books.filter(function(book) {
        return book.status === "Available";
    }).length;

    const issued = books.filter(function(book) {
        return book.status === "Issued";
    }).length;


    totalBooks.textContent = total;
    availableBooks.textContent = available;
    issuedBooks.textContent = issued;
}


// ======================================
// Search
// ======================================

searchInput.addEventListener("input", function() {
    displayBooks();
});


// ======================================
// Category Filter
// ======================================

filterCategory.addEventListener("change", function() {
    displayBooks();
});


// ======================================
// Initial Display
// ======================================

displayBooks();
