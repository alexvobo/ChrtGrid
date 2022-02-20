import json
import requests


def tradingview_formatter(exchange, coins, pair="USD"):
    return [f"{exchange.upper()}:{c}{pair}" for c in coins]


def api_data(url, headers={"Accept": "application/json"}):
    response = requests.request("GET", url, headers=headers)
    if response.ok:
        return json.loads(response.text)


def percentage_change(price, last_price):
    try:
        return round((float(last_price)-float(price))/float(price), 2)*100
    except ZeroDivisionError as e:
        return 0
