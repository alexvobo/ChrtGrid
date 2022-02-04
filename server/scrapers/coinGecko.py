import requests
import json

COINGECKO_API = "https://api.coingecko.com/api/v3"


def api_data(url, headers={"Accept": "application/json"}):
    response = requests.request("GET", url, headers=headers)
    if response.ok:
        return json.loads(response.text)


def fetch_marketcaps(products):
    """Given a list of products, fetch the marketcaps for each product from CoinGecko.

    Args:
        products (list): List of products ["BTC","ETH",...] or ["BTC-USD","ETH-USD",...]

    Returns:
        dict: Keys = products, Values = market data
    """

    # Get list of coins on coingecko
    coinlist_url = f"{COINGECKO_API}/coins/list"
    coinlist = api_data(coinlist_url)
    if coinlist is not None:
        coingecko_data = {}
        products = [p.split("-")[0].upper() if "-" in p else p.upper()
                    for p in products]

        for symbol in products:
            coingecko_data[symbol] = {}
            # Try to find a match for each product
            for c in coinlist:
                if symbol == c['symbol'].upper() or symbol == c['name'].upper() or symbol == c['id'].upper():
                    coingecko_data[symbol].update({'coingecko_id': c['id']})

        # Get the coingecko IDs for each product and make a string for the API
        coingecko_ids = "%2C".join([coingecko_data[p]['coingecko_id']
                                    for p in coingecko_data if "coingecko_id" in coingecko_data[p]])
        url = f"{COINGECKO_API}/coins/markets?vs_currency=usd&ids={coingecko_ids}"
        cg_market_data = api_data(url)

        if cg_market_data is not None:
            print(cg_market_data)
            for p in cg_market_data:
                sym = p['symbol'].upper()

                if coingecko_data[sym]['coingecko_id'] == p['id']:

                    market_cap_rank = (p['market_cap_rank'] if p['market_cap_rank']
                                       is not None else 0)

                    coingecko_rank = (p['coingecko_rank'] if "coingecko_rank" in p
                                      else market_cap_rank)

                    cap = (p['market_cap'] if p['market_cap']
                           is not None else 0)

                    circ_supp = (p['circulating_supply']
                                 if p['circulating_supply'] is not None else 0)

                    total_supply = (p['total_supply']
                                    if p['total_supply'] is not None else 0)

                    max_supply = (p['max_supply']
                                  if p['max_supply'] is not None else 0)

                    data_to_add = {"market_cap_rank": market_cap_rank, "coingecko_rank": coingecko_rank,
                                   "market_cap": cap, "circulating_supply": circ_supp, "total_supply": total_supply, "max_supply": max_supply}

                    coingecko_data[sym].update(data_to_add)

            return coingecko_data
