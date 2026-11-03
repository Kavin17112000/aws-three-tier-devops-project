import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "/api/books";

function App() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");

  async function loadBooks() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Could not load books");
      setBooks(await response.json());
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadBooks();
  }, []);

  async function addBook(event) {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          author,
          price: Number(price),
        }),
      });

      if (!response.ok) throw new Error("Could not add book");

      setTitle("");
      setAuthor("");
      setPrice("");
      await loadBooks();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="container">
      <h1>DevOps Bookstore</h1>
      <p>Three-tier application running with React, FastAPI, and PostgreSQL.</p>

      <form onSubmit={addBook}>
        <input
          placeholder="Book title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <button type="submit">Add book</button>
      </form>

      {error && <p className="error">{error}</p>}

      <h2>Available books</h2>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            <strong>{book.title}</strong> — {book.author} — $
            {Number(book.price).toFixed(2)}
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;