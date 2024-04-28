const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio'); // Library for parsing HTML
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('public'));

app.get('/search', async (req, res) => {
  try {
    const url = req.query.url;

    if (!url) {
      return res.status(400).send('Please provide a website URL');
    }

    // Fetch the HTML content
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'
      }
    });

    // Load HTML content into Cheerio for easy manipulation
    const $ = cheerio.load(response.data);

    // Extract CSS and JavaScript file URLs from HTML
    const cssUrls = [];
    $('link[rel="stylesheet"]').each((index, element) => {
      const cssUrl = $(element).attr('href');
      cssUrls.push(cssUrl);
    });

    const jsUrls = [];
    $('script[src]').each((index, element) => {
      const jsUrl = $(element).attr('src');
      jsUrls.push(jsUrl);
    });

    // Fetch CSS and JavaScript files asynchronously
    const cssPromises = cssUrls.map(cssUrl => axios.get(cssUrl));
    const jsPromises = jsUrls.map(jsUrl => axios.get(jsUrl));
    const [cssResponses, jsResponses] = await Promise.all([Promise.all(cssPromises), Promise.all(jsPromises)]);

    // Construct the response object with HTML, CSS, and JavaScript content
    const responseData = {
      html: response.data,
      css: cssResponses.map(cssResponse => cssResponse.data),
      js: jsResponses.map(jsResponse => jsResponse.data)
    };

    // Send the response
    res.json(responseData);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
