const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/search', async (req, res) => {
  try {
    const query = req.query.q;
    const url = req.query.url;

    if (!query && !url) {
      return res.status(400).send('Please provide a search query or website URL');
    }

    let response;
    if (url) {
      // If URL provided, fetch the content directly
      const userAgent = req.headers['user-agent'];
      response = await axios.get(url, {
        headers: {
          'User-Agent': userAgent
        },
      });
    } else {
      // If it's not a URL, search on Google
      response = await axios.get(`https://www.google.com/search?q=${encodeURIComponent(query)}`);
    }

    // Forward the content to the client-side
    res.send(response.data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
