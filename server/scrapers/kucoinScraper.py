from .util import tradingview_formatter, api_data, percentage_change
from pprint import pprint
KUCOIN_API = "https://api.kucoin.com"


def get_data():
    url = f"{KUCOIN_API}/api/v1/market/allTickers"
    res = api_data(url)
    return res['data']['ticker'] if res['code'] == "200000" else None


def product_filter(product):
    # Stable coins, delisted coins, or high caps that may or may not have indexing problems on CoinGecko
    blacklist = ["USDC", "TUSD", "PAX", "USDT", "UST", "DAI"]
    base = product['symbol'].split("-")[0]
    quote = product['symbol'].split("-")[1]
    if base not in blacklist and base[-2:] not in ['3L', '3S'] and \
            quote == "USDT":
        return True

    return False


def get_filtered_data(data):
    if data is not None:
        filtered_products = [p for p in data if product_filter(p)]
        return filtered_products
    return None


def get_topgainers():
    api_data = get_data()
    data = get_filtered_data(api_data)
    if data is not None:
        coin_stats = {}
        for stats in data:
            symbol = stats['symbol'].split("-")[0]
            coin_stats[symbol] = stats
            coin_stats[symbol].update(
                {"percentage_change": float(stats['changeRate'])*100})

        sorted_products = sorted(coin_stats,
                                 key=lambda p: coin_stats[p]['percentage_change'], reverse=True)
        sorted_stats = dict(sorted(coin_stats.items(),
                                   key=lambda p: p[1]['percentage_change'], reverse=True))
        return tradingview_formatter("kucoin", sorted_products, pair="USDT"), sorted_stats
