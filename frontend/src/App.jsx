
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const API_URL = "/api/books";

  const fetchBooks = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Could not load books");
      const data = await response.json();
      setBooks(data);
      setError("");
    } catch {
      setError("Could not load books. Please try again.");
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const addBook = async (event) => {
    event.preventDefault();

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

      if (!response.ok) throw new Error("Failed to add book");

      setTitle("");
      setAuthor("");
      setPrice("");
      fetchBooks();
    } catch {
      setError("Could not add book. Please try again.");
    }
  };

  const filteredBooks = books.filter((book) =>
    `${book.title} ${book.author}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="app">
      <div className="deployment-banner">
        🚀 CI/CD Deployment Test — Updated automatically through GitHub Actions
      </div>

      <header>
        <h1>DevOps Bookstore</h1>
        <p>Three-tier application using React, FastAPI, and PostgreSQL.</p>
      </header>

      <section>
        <h2>Add a Book</h2>
        <form onSubmit={addBook}>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Book title"
            required
          />
          <input
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            placeholder="Author"
            required
          />
          <input
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            placeholder="Price"
            required
          />
          <button type="submit">Add Book</button>
        </form>
      </section>

      <section>
        <h2>Available Books</h2>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by title or author..."
        />

        {error && <p className="error">{error}</p>}

        {filteredBooks.length === 0 ? (
          <p>No books found.</p>
        ) : (
          <ul>
            {filteredBooks.map((book) => (
              <li key={book.id}>
                <strong>{book.title}</strong> by {book.author} — ₹{book.price}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default App;
