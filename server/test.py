
from pymongo import MongoClient
import os
from pprint import pprint
import scrapers.coinbaseScraper as CoinbaseScraper
import scrapers.kucoinScraper as KucoinScraper
import scrapers.binanceScraper as BinanceScraper

MONGO_USER = os.environ.get("MONGO_USER")
MONGO_PASS = os.environ.get("MONGO_PASS")

exchanges = ['coinbase', 'kucoin', 'binance']

for e in exchanges:
    with MongoClient(f"mongodb://localhost:27017") as client:
        coins_db = client.sandwich[e]
        topgainers = []
        stats = {}
        if e == 'coinbase':
            topgainers, stats = (CoinbaseScraper.get_topgainers())
        elif e == "kucoin":
            topgainers, stats = KucoinScraper.get_topgainers()
        if e == "binance":
            topgainers, stats = BinanceScraper.get_topgainers()

        if topgainers and stats:
            pprint(list(stats.values())[:5])
            print("Updating top gainers...")
            coins_db.replace_one(
                {'market': 'stats'},
                {'market': 'stats', 'coins': topgainers, 'stats': stats})
        else:
            # Expand this to make sure lists match
            print("Failed to add top gainers " + e)
