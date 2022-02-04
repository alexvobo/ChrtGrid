import requests
from bs4 import BeautifulSoup


def get_sandwich_urls():
    """Scrape sandwich.finance to get the market URLs for all exchanges

    Returns:
        list: List of objects containing the exchange, market name, and url
    """
    base_url = "https://www.sandwich.finance/"
    res = requests.get(base_url)
    soup = BeautifulSoup(res.content, 'html.parser')

    table = soup.select_one(
        "#__next > div > main > section.section.lists > div > div > div > div")

    sandwich_data = []
    markets_table = table.select("ul")
    exchange_list = [e.text.lower() for e in table.select("h2")]
    if len(markets_table) == len(exchange_list):
        for markets, exch in zip(markets_table, exchange_list):
            for market in markets.select("li"):
                a_tag = market.find('a')
                link = a_tag['href']
                market_name = a_tag['title'].split(
                    "-")[1].strip().replace(" ", "_").lower()
                sandwich_data.append(
                    {'exchange': exch, 'market': market_name, 'url': link})

    return sandwich_data


def get_coins(url):
    """Get coin list from URL

    Args:
        url (string): sandwich.finance URL to fetch

    Return:
        list: list of coins in text file on the page
    """
    res = requests.get(url)
    if res.ok:
        return [coin for coin in res.content.decode("utf-8").split("\n")]
