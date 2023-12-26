const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors')
const app = express();
const PORT = 3001;
require("dotenv").config()

app.use(express.json());
app.use(cors())

app.get("/", async (req, res) => {
    try {
        res.json({ message: "server is running" })
    } catch (error) {
        res.json({ error: error.message })
    }
})

app.get('/capture', async (req, res) => {
    try {
        const { url } = req.query;

        // const browser = await puppeteer.launch({headless: 'new'});
        const browser = await puppeteer.launch({
            // headless: 'new',
            args: [
                '--disable-setuid-sandbox',
                '--no-sandbox',
                '--single-process',
                '--no-zygote'
            ],
            executablePath:process.env.NODE_ENV==="production"?process.env.PUPPETEER_EXECUTABLE_PATH:puppeteer.executablePath(),
        });
        const page = await browser.newPage();
        await page.setViewport({
            width: 1366,
            height: 768,
        });

        await page.goto(url);

        const totalHeight = await page.evaluate(() => document.body.scrollHeight);

        const numScreenshots = Math.ceil(totalHeight / 768);
        const screenshotList = [];

        for (let i = 0; i < numScreenshots; i++) {
            const topOffset = i * page.viewport().height;
            const screenshot = await page.screenshot({
                clip: {
                    x: 0,
                    y: topOffset,
                    width: page.viewport().width,
                    height: 768,
                },
                encoding: 'base64',
            });
            screenshotList.push(screenshot);
        }


        await browser.close();

        res.json({ screenshots: screenshotList });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error capturing screenshots');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
