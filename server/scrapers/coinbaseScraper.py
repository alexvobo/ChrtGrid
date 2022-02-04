import json
import requests
from pprint import pprint
# import coinGecko as CoinGecko

COINBASE_API = "https://api.exchange.coinbase.com"


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


def product_filter(product):
    # Stable coins, delisted coins, or high caps that may or may not have indexing problems on CoinGecko
    blacklist = ["GYEN", "RAI", "XRP", "LINK", "CGLD", "WLUNA", "WBTC"]

    if product['base_currency'] not in blacklist and \
            product['fx_stablecoin'] == False and product['quote_currency'] == "USD":
        return True

    return False


def get_coinbase_products(product_id=False):
    url = f"{COINBASE_API}/products"
    cb_products = api_data(url)

    if cb_products is not None:
        filtered_products = [p['id'] if product_id else p['base_currency']
                             for p in cb_products if product_filter(p)]
        return filtered_products


def get_topgainers():
    products = get_coinbase_products(product_id=True)
    if products is not None:
        coin_stats = {}
        for product_id in products:
            url = f"{COINBASE_API}/products/{product_id}/stats"
            stats = api_data(url)
            if stats is not None:
                symbol = product_id.split("-")[0]
                coin_stats[symbol] = stats
                coin_stats[symbol].update(
                    {"percentage_change": percentage_change(stats['open'], stats['last'])})
        sorted_products = sorted(coin_stats,
                                 key=lambda c: coin_stats[c]['percentage_change'], reverse=True)
        sorted_stats = dict(
            sorted(coin_stats.items(), key=lambda c: c[1]['percentage_change'], reverse=True))

        return tradingview_formatter("coinbase", sorted_products), sorted_stats


# def get_lowcaps():
#     products = get_coinbase_products()

#     if products is not None:
#         coingecko_data = CoinGecko.fetch_marketcaps(products)
#         if coingecko_data is not None:
#             THRESHOLD = 150000000
#             filter1 = {k: v for (k, v) in coingecko_data.items()
#                        if v['market_cap'] <= THRESHOLD}
#             print(filter1.keys())
#             sort_products = sorted(filter1,
#                                    key=lambda c: filter1[c]['market_cap_rank'])
#             pprint(tradingview_formatter("coinbase", sort_products))
#             return sort_products
