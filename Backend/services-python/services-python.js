import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/:symbol/price-summary", async (req, res) => {
  const symbol = req.params.symbol;

  axios
    .get(`http://127.0.0.1:4000/api/stocks/${symbol}/price-summary`)
    .then((response) => {
      console.log(response.data);
      res.json(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
});
router.get("/:symbol/volume-seasonality-daily", async (req, res) => {
  const symbol = "4321";

  axios
    .get(
      `http://127.0.0.1:4000/api/stocks/${symbol}/volume-seasonality-daily`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      var data = response.data;
      data.result = JSON.parse(response.data.result);
      // Send both 'data' and 'parsedString' in the JSON response
      res.json(data);
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get("/japanese-candlestick-patterns/:pattern", async (req, res) => {
  const pattern = req.params.pattern;

  axios
    .get(
      `http://127.0.0.1:4000/api/stocks/japanese-candlestick-patterns/${pattern}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      var data = response.data;
      console.log(data);
      res.json(data);
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get("/:symbol/hawkes-process", async (req, res) => {
  const symbol = req.params.symbol;
  axios
    .get(`http://127.0.0.1:4000/api/stocks/${symbol}/hawkes-process`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      var data = response.data;
      console.log(data);
      res.json(data);
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get("/consolidating-stocks", async (req, res) => {
  const { numberOfCandles, percentageRange } = req.query;
  console.log("numberOfCandles:", numberOfCandles);
  console.log("percentageRange:", percentageRange);
  axios
    .get(
      `http://127.0.0.1:4000/api/stocks/consolidating-stocks?numberOfCandles=${numberOfCandles}&percentageRange=${percentageRange}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      var data = response.data;
      console.log(data);
      res.json(data);
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get("/flags-pennants", async (req, res) => {
  const { symbol } = req.query;
  console.log(symbol);
  axios
    .get(`http://127.0.0.1:4000/api/stocks/flags-pennants?symbol=${symbol}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      var data = response.data;
      res.json(data);
    })
    .catch((error) => {
      console.log(error);
    });
});
router.get("/:symbol/indicators/:indicator", async (req, res) => {
  const symbol = req.params.symbol;
  const indicator = req.params.indicator;

  console.log(symbol);
  axios
    .get(`http://127.0.0.1:4000/api/stocks/vsa`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      var data = response.data;
      res.json(data);
    })
    .catch((error) => {
      console.log(error);
    });
});

export default router;
