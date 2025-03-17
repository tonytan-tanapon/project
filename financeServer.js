// const express = require('express');
// const cors = require('cors');
// const yahooFinance = require('yahoo-finance2').default;

// const app = express();
// app.use(cors());

// const STOCKS = ["AAPL"];

// async function getStockData(symbol) {
//     try {
//         const queryOptions = { interval: '1d', range: '5d' }; // Fetch last 5 days of daily data
//         // const result = await yahooFinance.chart(symbol, queryOptions);
//         const result =  await yahooFinance.quoteSummary(symbol);
//         console.log(symbol)
//         // const result = await yahooFinance.quote(symbol);
//         // console.log(`Stock: ${symbol}`);
//         // console.log(`Price: $${result.regularMarketPrice}`);
//         // Check if data is available
//         // if (!result || !result.quotes || result.quotes.length === 0) {
//         //     console.warn(`No data found for ${symbol}`);
//         //     return [];
//         // }

//         // return result.quotes.map(entry => ({
//         //     date: new Date(entry.date).toISOString(),
//         //     open: entry.open,
//         //     high: entry.high,
//         //     low: entry.low,
//         //     close: entry.close,
//         //     volume: entry.volume
//         // }));
//     } catch (error) {
//         console.error(`Error fetching stock data for ${symbol}:`, error);
//         return [];
//     }
// }

// // Function to calculate SMA-5
// function calculateSMA(data, period = 5) {
//     return data.map((entry, index, arr) => {
//         if (index < period - 1) return { ...entry, sma: null }; // Not enough data for SMA-5

//         const sum = arr.slice(index - period + 1, index + 1)
//             .reduce((acc, val) => acc + val.close, 0);
//         return { ...entry, sma: sum / period };
//     });
// }

// // API Route to Get Stock Price for One Stock
// app.get('/stock/:symbol', async (req, res) => {
//     const symbol = req.params.symbol;
//     const stockData = await getStockData(symbol);
//     const stockWithSMA = calculateSMA(stockData);
//     res.json(stockWithSMA);
// });

// // API Route to Get Stock Prices for Multiple Stocks
// app.get('/stocks', async (req, res) => {
//     let stockData = {};

//     for (const stock of STOCKS) {
//         // const data = await getStockData(stock);
//         const data =await yahooFinance.chart(symbol, queryOptions);
//         console.log(data)
//         // stockData[stock] = calculateSMA(data);
//     }

//     res.json(stockData);
// });

// const PORT = 3000;
// app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));


// const yahooFinance = require('yahoo-finance2').default;

// async function getStockPrice(symbol) {
//     try {
//         const queryOptions = { interval: '1d', range: '5d' };
//         // const result = await yahooFinance.quote(symbol);
//         const result = await yahooFinance.quote(symbol,queryOptions);
//         console.log(`Stock: ${symbol}`);
//         console.log(`Price: $${result.regularMarketPrice}`);
//     } catch (error) {
//         console.error(`Error fetching stock data for ${symbol}:`, error);
//     }
// }

// // Example Usage
// getStockPrice("AAPL"); // Fetch Apple stock price

const yahooFinance = require('yahoo-finance2').default;

async function getStockPrice(symbol) {
    try {
        const queryOptions = { interval: '1d', range: '5d' }; // Get last 5 days of daily data
        const result = await yahooFinance.chart(symbol, queryOptions);

        if (!result || !result.quotes || result.quotes.length === 0) {
            console.warn(`No data found for ${symbol}`);
            return;
        }

        console.log(`Stock: ${symbol}`);
        result.quotes.forEach((entry) => {
            console.log(`Date: ${new Date(entry.date).toISOString()}`);
            console.log(`Open: $${entry.open}`);
            console.log(`High: $${entry.high}`);
            console.log(`Low: $${entry.low}`);
            console.log(`Close: $${entry.close}`);
            console.log(`Volume: ${entry.volume}`);
            console.log("------------------------");
        });
    } catch (error) {
        console.error(`Error fetching stock data for ${symbol}:`, error);
    }
}

// Example Usage
getStockPrice("AAPL"); // Fetch Apple stock data
