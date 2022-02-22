from .util import tradingview_formatter, api_data, percentage_change
from pprint import pprint
BINANCE_API = "https://api.binance.com"


def get_data():
    url = f"{BINANCE_API}/api/v3/ticker/24hr"
    res = api_data(url)
    return res


def product_filter(product):
    # Stable coins, delisted coins, or high caps that may or may not have indexing problems on CoinGecko
    blacklist = ["USDC", "TUSD", "PAX", "USDT", "UST", "DAI", "BUSD", "USDP"]
    if product['symbol'][-4:] == "USDT":
        base = product['symbol'][:-4]
        # quote = product['symbol'].split("-")[1]
        if base not in blacklist and base[-2:] not in ['3L', '3S', 'UP'] and base[-4:] != "DOWN":
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
            symbol = stats['symbol'][:-4]
            coin_stats[symbol] = stats
            coin_stats[symbol].update(
                {"percentage_change": float(stats['priceChangePercent'])})
            coin_stats[symbol].update(
                {"last": stats['lastPrice']})

        sorted_products = sorted(coin_stats,
                                 key=lambda p: coin_stats[p]['percentage_change'], reverse=True)
        sorted_stats = dict(sorted(coin_stats.items(),
                                   key=lambda p: p[1]['percentage_change'], reverse=True))
        return tradingview_formatter("binance", sorted_products, pair="USDT"), sorted_stats
