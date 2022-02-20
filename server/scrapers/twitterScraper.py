import os
import re
import tweepy
import time
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from requests_html import HTMLSession
import requests
from pprint import pprint
load_dotenv()

TWITTER_API_KEY = os.environ.get("API_KEY")
TWITTER_API_SECRET = os.environ.get("API_SECRET")
TWITTER_API_BEARER = os.environ.get("BEARER_TOKEN")

exchanges = {"coinbase": {'twitter': "CoinbaseAssets", 'regex': "\((.*?)\)"},
             "kucoin": {'twitter': "KuCoinCom", 'regex': "\(([^)]*)\)"},
             "binance": {'twitter': "Binance", 'regex': "\(([^)]*)\)"}}

# currently no need to use kucoin/binance twitter accounts because we fetch from api instead


def tradingview_formatter(exchange, coins, pair="USD"):
    """ Formats strings for TradingView Charts
    Returns:
        string: Returns a formatted list of strings so we can load TradingView Charts
        Example: ["COINBASE:BTCUSD",."COINBASE:ETHUSD",...]
    """
    return [f"{exchange.upper()}:{c}{pair}" for c in coins]


def get_latest_coinbase():
    """ Checks each tweet from the "CoinbaseAssets" account for new assets
        Uses regex to find coins using their tweet template: (DESO) -> DESO
    Returns:
        string: Returns a formatted list of strings so we can load TradingView Charts
        Example: ["COINBASE:BTCUSD",."COINBASE:ETHUSD",...]
    """
    try:
        client = tweepy.Client(TWITTER_API_BEARER)
        usr_id = client.get_user(
            username=exchanges['coinbase']['twitter']).data['id']
        tweets = client.get_users_tweets(
            id=usr_id, max_results=100).data
        latest_coins = set()
        if tweets is not None:
            for tweet in tweets:
                t = tweet.text
                if "Inbound transfers" in t or "Transfers for" in t:
                    [latest_coins.add(c) for c in re.findall(
                        exchanges["coinbase"]['regex'], t)]
        print("Latest listings fetch from Coinbase twitter successful")
    except Exception as e:
        print(e)
        print("Latest listings fetch from Coinbase twitter failed")
    return tradingview_formatter("coinbase", list(latest_coins))


def get_latest_binance():
    """ Checks each headline from the API that the Binance New Listings feed is powered by for new coins.
        Uses regex to find coins using their template: (DESO) -> DESO
    Returns:
        string: Returns a formatted list of strings so we can load TradingView Charts
        Example: ["BINANCE:BTCUSD",."BINANCE:ETHUSD",...]
    """
    try:
        url = "https://www.binance.com/bapi/composite/v1/public/cms/article/list/query?type=1&pageNo=1&pageSize=50"
        latest_coins = []

        data = requests.get(url).json()['data']['catalogs'][0]  # new listings
        if data:
            headlines = data['articles']
            for headline in headlines:
                if "Binance Will List" in headline['title']:
                    [latest_coins.append(c) for c in re.findall(
                        exchanges["binance"]['regex'], headline['title'])]
        print("Latest listings fetch from Binance successful")
    except Exception as e:
        print(e)
        print("Latest listings fetch from Binance failed")

    return tradingview_formatter("binance", list(latest_coins), pair="USDT")


def get_latest_kucoin():
    """ Checks each headline from the API that the Kucoin New Listings feed is powered by for new coins.
        Uses regex to find coins using their template: (DESO) -> DESO
    Returns:
        string: Returns a formatted list of strings so we can load TradingView Charts
        Example: ["KUCOIN:BTCUSD",."KUCOIN:ETHUSD",...]
    """
    try:
        urls = ["https://www.kucoin.com/_api/cms/articles?page=1&pageSize=10&category=listing&lang=en_US",
                "https://www.kucoin.com/_api/cms/articles?page=2&pageSize=10&category=listing&lang=en_US"]
        latest_coins = []

        for url in urls:
            data = requests.get(url).json()
            if data['code'] == 200:
                headlines = data['items']
                for headline in headlines:
                    [latest_coins.append(c) for c in re.findall(
                        exchanges["kucoin"]['regex'], headline['title'])]
        print("Latest listings fetch from kucoin successful")
    except Exception as e:
        print(e)
        print("Latest listings fetch from kucoin failed")
    return tradingview_formatter("kucoin", list(latest_coins), pair="USDT")
