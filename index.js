const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('public'));

app.get('/search', async (req, res) => {
  try {
    const query = req.query.q;
    const url = req.query.url;

    if (!query && !url) {
      return res.status(400).send('Please provide a search query or website URL');
    }

    if (url) {
      // If URL provided, fetch the content directly
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'
        }
      });
      res.send(response.data);
    } else {
      // If it's not a URL, search on Google
      const response = await axios.get(`https://www.google.com/search?q=${encodeURIComponent(query)}`);
      res.send(response.data);
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
