from flask import Flask, jsonify
from pymongo import MongoClient
from pprint import pprint

import scrapers.coinbaseScraper as CoinbaseScraper
import scrapers.sandwichScraper as SandwichScraper
import scrapers.twitterScraper as TwitterScraper
import scrapers.kucoinScraper as KucoinScraper
import scrapers.binanceScraper as BinanceScraper

from apscheduler.schedulers.background import BackgroundScheduler

MONGO_HOSTNAME = 'localhost'
MONGO_PORT = 27017

exchanges = ['coinbase', 'kucoin', 'binance']

# region Update DB


def update_urls():
    # Run this on timer, infrequent
    with MongoClient(MONGO_HOSTNAME, MONGO_PORT) as client:
        url_db = client.sandwich['urls']
        old_urls = list(url_db.find({}))
        new_urls = SandwichScraper.get_sandwich_urls()

        if len(old_urls) != len(new_urls):
            print("Updating URLs...")
            url_db.insert_many(new_urls)
        else:
            # Expand this to make sure lists match
            print("URLs up to date")


def update_coins(exchange='coinbase', market='usd_markets'):
    # Run this on timer, bi-daily
    with MongoClient(MONGO_HOSTNAME, MONGO_PORT) as client:
        url_db = client.sandwich['urls']
        url = url_db.find_one({'exchange': exchange, 'market': market})['url']

        coins_db = client.sandwich[exchange]
        old_coins = coins_db.find_one({'market': market})['coins']

        new_coins = SandwichScraper.get_coins(url)

        if len(new_coins) != len(old_coins):
            # Only perform if coins have been added/removed
            print(f"Updating All Products...")
            coins_db.delete_one({"market": market})
            coins_db.insert_one({'market': market, 'coins': new_coins})
        else:
            # Expand this to make sure lists match
            print(f"{exchange} -- {market} -- up to date")


def update_latest():
    for e in exchanges:
        with MongoClient(MONGO_HOSTNAME, MONGO_PORT) as client:
            coins_db = client.sandwich[e]
            new_coins = []
            if e == "coinbase":
                new_coins = TwitterScraper.get_latest_coinbase()
            elif e == "kucoin":
                new_coins = TwitterScraper.get_latest_kucoin()
            elif e == "binance":
                new_coins = TwitterScraper.get_latest_binance()

            if new_coins:
                print(f"Updating Latest Products...")
                coins_db.delete_one({"market": 'latest'})
                coins_db.insert_one({'market': 'latest', 'coins': new_coins})
            else:
                # Expand this to make sure lists match
                print(f"Failed to add latest {e} coins")


def update_topgainers():
    for e in exchanges:
        with MongoClient(MONGO_HOSTNAME, MONGO_PORT) as client:
            coins_db = client.sandwich[e]

            if e == 'coinbase':
                topgainers, stats = CoinbaseScraper.get_topgainers()
            elif e == "kucoin":
                topgainers, stats = KucoinScraper.get_topgainers()
            elif e == "binance":
                topgainers, stats = BinanceScraper.get_topgainers()

            if topgainers and stats:
                print(f"Updating top gainers...")
                coins_db.delete_one({"market": 'stats'})
                coins_db.insert_one(
                    {'market': 'stats', 'coins': topgainers, 'stats': stats})
            else:
                # Expand this to make sure lists match
                print(f"Failed to add top gainers " + e)

# def update_lowcaps_coinbase():
#     # Run this on timer, bi-daily
#     with MongoClient(MONGO_HOSTNAME, MONGO_PORT) as client:
#         coins_db = client.sandwich['coinbase']

#         low_caps = CoinbaseScraper.get_lowcaps()

#         if low_caps:
#             print(f"Adding low caps ...")
#             coins_db.delete_one({"market": 'low caps'})
#             coins_db.insert_one({'market': 'low caps', 'coins': low_caps})
#         else:
#             # Expand this to make sure lists match
#             print(f"Failed to add low caps")


def add_list_db(exchange):
    with MongoClient(MONGO_HOSTNAME, MONGO_PORT) as client:
        coins_db = client.sandwich[exchange]
        with open("server/customlist.txt", "r") as f:
            products = [line.strip() for line in f.readlines()]
            if products:
                print(f"Adding custom coins...")
                coins_db.delete_one({"market": 'custom'})
                coins_db.insert_one({'market': 'custom', 'coins': products})
# endregion


# region Scheduling
sched = BackgroundScheduler(daemon=True)
sched.add_job(update_topgainers, 'interval', minutes=2)
sched.add_job(update_latest, 'interval', minutes=720)
# sched.add_job(update_coins, 'interval', minutes=1440)
sched.start()
# endregion

app = Flask(__name__)
# region API


def api_response(data, status):
    return jsonify({'data': data, 'status': status})


@ app.route("/ping")
def ping():
    return api_response({"status": "alive"}, 200)


# endregion


if __name__ == "__main__":
    update_topgainers()
    update_latest()
    app.run(debug=True)
