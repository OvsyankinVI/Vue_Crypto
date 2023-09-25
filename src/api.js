const API_KEY = "3c0427aa0facb70690450b2d29c7f5556618df5ac244aa55ba104f6b2e84cd08";

export const loadTicker = tickerName =>
    fetch(
        `https://min-api.cryptocompare.com/data/price?fsym=${tickerName}&tsyms=USD&api_key=${API_KEY}`
    ).then(r => r.json());