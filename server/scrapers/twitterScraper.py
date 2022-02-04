import os
import re
import tweepy
from dotenv import load_dotenv

load_dotenv()

TWITTER_API_KEY = os.environ.get("API_KEY")
TWITTER_API_SECRET = os.environ.get("API_SECRET")
TWITTER_API_BEARER = os.environ.get("BEARER_TOKEN")


def tradingview_formatter(exchange, coins, pair="USD"):
    return [f"{exchange.upper()}:{c}{pair}" for c in coins]


def get_latest_from_coinbase():
    """ Checks each tweet from the "CoinbaseAssets" & "CoinbaseExch" account for new assets
        Uses regex to find coins using their tweet template: (DESO) -> DESO

    Returns:
        string: Returns a formatted list of strings so we can load TradingView Charts
        Example: ["COINBASE:BTCUSD",."COINBASE:ETHUSD",...]
    """
    client = tweepy.Client(TWITTER_API_BEARER)
    usr_id = client.get_user(username="coinbaseAssets").data['id']
    coinbase_tweets = client.get_users_tweets(id=usr_id, max_results=100).data
    latest_coins = set()
    for tweet in coinbase_tweets:
        t = tweet.text
        [latest_coins.add(c) for c in re.findall('\((.*?)\)', t)]

    return tradingview_formatter('coinbase', list(latest_coins))
