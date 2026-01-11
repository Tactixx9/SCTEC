const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// parse JSON bodies (use built-in middleware)
app.use(express.json());
// serve static files
app.use(express.static(path.join(__dirname)));

// mount the contact handler
try {
  const contactHandler = require('./api/contact');
  app.post('/api/contact', (req, res) => contactHandler(req, res));
} catch (e) {
  console.warn('No ./api/contact handler found or failed to load.', e);
}

app.listen(PORT, () => {
  console.log(`Dev server running at http://localhost:${PORT}`);
});
