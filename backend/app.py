import os
import time

import psycopg
from fastapi import FastAPI, HTTPException
from psycopg.rows import dict_row

app = FastAPI(title="Bookstore API")

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://bookstore:bookstorepass@localhost:5432/bookstore"
)


def get_connection():
    for attempt in range(10):
        try:
            return psycopg.connect(
                DATABASE_URL,
                row_factory=dict_row
            )
        except psycopg.OperationalError:
            if attempt == 9:
                raise
            time.sleep(2)


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.get("/api/books")
def get_books():
    try:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "SELECT id, title, author, price FROM books ORDER BY id"
                )
                return cur.fetchall()
    except psycopg.Error:
        raise HTTPException(
            status_code=503,
            detail="Database temporarily unavailable"
        )


@app.post("/api/books")
def create_book(book: dict):
    title = book.get("title")
    author = book.get("author")
    price = book.get("price")

    if not title or not author or price is None:
        raise HTTPException(status_code=400, detail="Missing book fields")

    try:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO books (title, author, price)
                    VALUES (%s, %s, %s)
                    RETURNING id, title, author, price
                    """,
                    (title, author, price)
                )
                return cur.fetchone()
    except psycopg.Error:
        raise HTTPException(status_code=503, detail="Database error")