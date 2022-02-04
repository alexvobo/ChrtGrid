
def get_exchange_data():
    base_url = "https://www.sandwich.finance/"
    res = requests.get(base_url)
    soup = BeautifulSoup(res.content, 'html.parser')

    table = soup.select_one(
        "#__next > div > main > section.section.lists > div > div > div > div")

    exchange_list = {}
    for e in table.select("h2"):
        exchange_list[e.text.lower()] = {}

    markets_table = table.select("ul")
    if len(markets_table) == len(exchange_list):
        for mkts_table, exch in zip(markets_table, exchange_list):
            for market in mkts_table.select("li"):
                link = market.find('a')
                title = link['title'].split(
                    "-")[1].strip().replace(" ", "_").lower()

                exchange_list[exch][title] = link['href']

    return exchange_list


@app.route("/<exchange>/")
@app.route("/<exchange>/<market>")
def get_markets(exchange, market="all_markets"):
    if sandwich_urls:
        return json.dumps(sandwich_urls[exchange, market])


if __name__ == "__main__":
    app.run(debug=True)