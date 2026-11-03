
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "/api/books";

function App() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch books from the backend API
  async function loadBooks() {
    try {
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Could not load books");
      }

      const data = await response.json();
      setBooks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Load books when the component mounts
  useEffect(() => {
    loadBooks();
  }, []);

  // Add a new book
  async function addBook(event) {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          author,
          price: Number(price),
        }),
      });

      if (!response.ok) {
        throw new Error("Could not add book");
      }

      setTitle("");
      setAuthor("");
      setPrice("");

      await loadBooks();
    } catch (err) {
      setError(err.message);
    }
  }

  // Filter books by title or author
  const filteredBooks = books.filter((book) => {
    const query = search.toLowerCase();

    return (
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query)
    );
  });

  return (
    <main className="container">
      <h1>DevOps Bookstore</h1>

      <p>
        Three-tier application using React, FastAPI,
        and PostgreSQL.
      </p>

      <h2>Add a Book</h2>

      <form onSubmit={addBook}>
        <input
          type="text"
          placeholder="Book title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(event) => setAuthor(event.target.value)}
          required
        />

        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="Price"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          required
        />

        <button type="submit">Add Book</button>
      </form>

      {error && <p className="error">{error}</p>}

      <h2>Available Books</h2>

      <input
        type="search"
        placeholder="Search by title or author..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      {loading ? (
        <p>Loading books...</p>
      ) : filteredBooks.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <ul>
          {filteredBooks.map((book) => (
            <li key={book.id}>
              <strong>{book.title}</strong>
              {" — "}
              {book.author}
              {" — $"}
              {Number(book.price).toFixed(2)}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default App;
