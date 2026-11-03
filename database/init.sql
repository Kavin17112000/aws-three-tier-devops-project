CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    author VARCHAR(150) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO books (title, author, price)
VALUES
    ('The DevOps Handbook', 'Gene Kim', 35.00),
    ('Kubernetes Up and Running', 'Kelsey Hightower', 45.00),
    ('Learning Python', 'Mark Lutz', 40.00)
ON CONFLICT DO NOTHING;