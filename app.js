const express = require("express");
const app = express();
const port = 3000;

// Test Data
const wallets = {
  "0x1234567890123456789012345678901234567890": {
    balances: {
      USDC: 10000.0,
      USDT: 99.0,
      ETH: 0.4,
    },
    transfers: [
      { token: "USDC", amount: 2, timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
      { token: "USDT", amount: 70, timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000) },
      { token: "ETH", amount: 0.1, timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000) },
    ],
  },
};

//An endpoint returns a wallet's balances of USDC, USDT and ETH
app.get("/wallet/:address/balances", (req, res) => {
  const wallet = wallets[req.params.address];
  if (wallet) {
    res.json(wallet.balances);
  } else {
    res.status(404).json({ error: "Wallet not found" });
  }
});

//An endpoint summarises a wallet's total transfer volume of USDC, USDT, and ETH in past 24 hours
app.get("/wallet/:address/transferVolume", (req, res) => {
  const wallet = wallets[req.params.address];
  if (!wallet) {
    return res.status(404).json({ error: "Wallet not found" });
  }

  const now = new Date();
  const volume = { USDC: 0, USDT: 0, ETH: 0 };

  wallet.transfers.forEach((transfer) => {
    if (now - transfer.timestamp <= 24 * 60 * 60 * 1000) {
      volume[transfer.token] += transfer.amount;
    }
  });

  res.json(volume);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
