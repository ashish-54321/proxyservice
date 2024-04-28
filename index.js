const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/search', async (req, res) => {
  try {
    const url = req.query.url;

    if (!url) {
      return res.status(400).send('Please provide a valid URL');
    }

    // Launch Puppeteer without any proxy settings
    const browser = await puppeteer.launch();

    // Open a new page
    const page = await browser.newPage();

    // Navigate to the specified URL
    await page.goto(url);

    // Wait for the page to fully load
    await page.waitForLoadState('networkidle');

    // Get the HTML content after rendering
    const content = await page.content();

    // Close the browser
    await browser.close();

    // Send the HTML content as the response
    res.send(content);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
