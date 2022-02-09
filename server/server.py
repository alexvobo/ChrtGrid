from flask import Flask, jsonify
from pymongo import MongoClient
from pprint import pprint
import requests
import random
import json
import time
import scrapers.coinbaseScraper as CoinbaseScraper
import scrapers.sandwichScraper as SandwichScraper
import scrapers.twitterScraper as TwitterScraper

from apscheduler.schedulers.background import BackgroundScheduler

MONGO_HOSTNAME = 'localhost'
MONGO_PORT = 27017

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


def update_latest_coinbase():
    # Run this on timer, bi-daily
    with MongoClient(MONGO_HOSTNAME, MONGO_PORT) as client:
        coins_db = client.sandwich['coinbase']

        new_coins = TwitterScraper.get_latest_from_coinbase()

        if new_coins:
            print(f"Updating Latest Products...")
            coins_db.delete_one({"market": 'latest'})
            coins_db.insert_one({'market': 'latest', 'coins': new_coins})
        else:
            # Expand this to make sure lists match
            print(f"Failed to add latest coinbase coins")


def update_topgainers():
    with MongoClient(MONGO_HOSTNAME, MONGO_PORT) as client:
        coins_db = client.sandwich['coinbase']

        topgainers, stats = CoinbaseScraper.get_topgainers()

        if topgainers and stats:
            print(f"Updating top gainers...")
            coins_db.delete_one({"market": 'stats'})
            coins_db.insert_one(
                {'market': 'stats', 'stats': stats})
        else:
            # Expand this to make sure lists match
            print(f"Failed to add top gainers on coinbase")


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


def add_list_db():
    with MongoClient(MONGO_HOSTNAME, MONGO_PORT) as client:
        coins_db = client.sandwich['coinbase']
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
sched.add_job(update_latest_coinbase, 'interval', minutes=720)
sched.add_job(update_coins, 'interval', minutes=1440)
sched.start()
# endregion

app = Flask(__name__)


# region API


def api_response(data, status):
    return jsonify({'data': data, 'status': status})


@ app.route("/exchanges")
def fetch_exchanges():
    with MongoClient(MONGO_HOSTNAME, MONGO_PORT) as client:
        url_db = client.sandwich['urls']
        print("Responding with exchanges")
        try:
            return api_response([e for e in url_db.find().distinct('exchange')], 200)
        except:
            return api_response([], 404)


@ app.route("/<exchange>")
def fetch_markets_urls(exchange):
    if exchange:
        print("Responding with market names and urls")
        with MongoClient(MONGO_HOSTNAME, MONGO_PORT) as client:
            url_db = client.sandwich['urls']
            try:
                return api_response([{'market': m['market'], 'url':m['url']} for m in url_db.find({'exchange': exchange.lower()})], 200)
            except:
                return api_response([], 404)


@ app.route("/<exchange>/markets")
def fetch_markets(exchange):
    if exchange:
        print("Responding with market names")
        with MongoClient(MONGO_HOSTNAME, MONGO_PORT) as client:
            url_db = client.sandwich['urls']
            try:
                return api_response([m['market'] for m in url_db.find({'exchange': exchange.lower()})], 200)
            except:
                return api_response([], 404)


@ app.route("/<exchange>/<market>")
def fetch_coins(exchange, market):
    if exchange and market:
        print("Responding with default coin names")
        with MongoClient(MONGO_HOSTNAME, MONGO_PORT) as client:
            coin_db = client.sandwich[exchange.lower()]
            try:
                coins = coin_db.find_one({'market': market})['coins']
                if market == "random":
                    random.shuffle(coins)
                return api_response(coins, 200)
            except:
                return api_response([], 404)


@ app.route("/<exchange>/stats")
def fetch_coins_topgainers_stats(exchange):
    if exchange:
        print("Responding with top gainers' stats")
        with MongoClient(MONGO_HOSTNAME, MONGO_PORT) as client:
            coin_db = client.sandwich[exchange.lower()]
            try:
                stats = coin_db.find_one({'market': 'topgainers'})['stats']
                return api_response(stats, 200)
            except:
                return api_response([], 404)

# endregion


if __name__ == "__main__":
    update_topgainers()
    update_latest_coinbase()
    app.run(debug=True)
