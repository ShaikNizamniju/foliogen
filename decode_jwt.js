const jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqbWNqc2ZmZXljd3lpZ2ljZmxmayIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY5Njk1MjU3LCJleHAiOjIwODUyNzEyNTd9.GhQ9vE3KkA73nCXATFQtQCQIVdowXpK6utCWoG-4T-Y";
const payload = jwt.split('.')[1];
const decoded = Buffer.from(payload, 'base64').toString('utf-8');
console.log(decoded);
