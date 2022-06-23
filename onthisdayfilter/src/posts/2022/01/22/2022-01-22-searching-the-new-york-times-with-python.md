---
layout: post
title: "Searching the New York Times with Python"
date: "2022-01-22T18:00:00"
categories: ["development"]
tags: ["python"]
banner_image: /images/banners/newspapers.jpg
permalink: /2022/01/22/searching-the-new-york-times-with-python.html
description: Using the New York Times API with Python - some simple demos
---

In my effort to keep practicing Python and build fun stuff to help me learn, today I built a few demos of using the [New York Times API](https://developer.nytimes.com/). I last played with this *way* back in 2014: ["Using the New York Times API to Chart Occurrences in Headlines"](https://www.raymondcamden.com/2014/09/15/using-the-new-york-times-api-to-chart-occurrences-in-headlines). In that demo I let you enter a simple search term and then I report on the number of occurrences of that term over time. I think my favorite image from that post is a search for "Internet":

<p>
<img data-src="https://static.raymondcamden.com/images/s2_small.png" alt="Occurrences of Internet in NYT Headlines" class="lazyload imgborder imgcenter">
</p>

Today the API popped up back in my head and I thought it would be fun to play with it again, this time in Python. I had some success with it today and thought I'd share the results. It's nothing too exciting and is basic Python stuff, but I love getting the practice and I did learn a bit, so that's always a good use of my time, especially on a Saturday, right?

Note that the [New York Times API](https://developer.nytimes.com/) is free. You can sign up and get a key in seconds. Oddly, they don't link to their [FAQ](https://developer.nytimes.com/faq) which includes important information about their rate limiting. (Spoiler - I hit it.) Definitely reference that before you go live with any real code. 

My first demo makes use of the general [Archive API](https://developer.nytimes.com/docs/archive-product/1/overview). My intent was to return a random article for a day in history. Here's that script.

```python
import requests 
from datetime import datetime 
import random 

year = 1964
month = 1
day = 9
api = f"https://api.nytimes.com/svc/archive/v1/{year}/{month}.json?api-key=myKeyBringsTheBoystoTheYard"

def filter_by_day(list, day):
	result = []
	for article in list:
		d = datetime.strptime(article["pub_date"], "%Y-%m-%dT%H:%M:%S%z")
		if d.day == day:
			result.append(article)
	return result

response = requests.get(api)
data = response.json()
articles = data["response"]["docs"]

# First, get by day
articles = filter_by_day(articles, day)

print("Total",data["response"]["meta"]["hits"])
print("Total for today", len(articles))

selected = random.choice(articles)
print(selected["headline"]["main"])
```

The day, month, and year, are all hard coded here. The Archive API lets you filter by year and month, not day, so first I get all the articles for a month and then I filter it down to ones that match the target date. Dates are still pretty hard for me in Python. I used `strptime` to get the day value out of the resutls from the API and had to build the match by hand. I wonder if Python has a way to make that simpler - like - look at the string and take a guess? 

Anyway, once I've filtered to articles for a day, I then `random.choice` to pick one. I then print out the headline. I ran this a few times and here's the output:

<p>
<img data-src="https://static.raymondcamden.com/images/2022/01/nyt1.jpg" alt="Example output from random article selection" class="lazyload imgborder imgcenter">
</p>

For my second iteration, I simply removed the hard coded year, month, and day. This gave me a bit more practice with Python date support. You can see that in the top portion of the code below. 

```python
import requests 
from datetime import datetime 
from datetime import date
import calendar

import random 
import sys

KEY = "damnRightItsBetterThanYours"

# earliest year supported by NYT API
NYT_MIN_YEAR = 1851

lastYear = (date.today()).year-1
year = random.randint(NYT_MIN_YEAR, lastYear)
print("Select year", year)

month = random.randint(1,12)
print("Select month", month)

daysInMonth = calendar.monthrange(year,month)[1]
day = random.randint(1, daysInMonth)
print("Selected day", day)


api = f"https://api.nytimes.com/svc/archive/v1/{year}/{month}.json?api-key={KEY}"

def filter_by_day(list, day):
	result = []
	for article in list:
		d = datetime.strptime(article["pub_date"], "%Y-%m-%dT%H:%M:%S%z")
		if d.day == day:
			result.append(article)
	return result

response = requests.get(api)
data = response.json()
articles = data["response"]["docs"]

# First, get by day
articles = filter_by_day(articles, day)

print("Total",data["response"]["meta"]["hits"])
print("Total for today", len(articles))

selected = random.choice(articles)
print(selected["headline"]["main"])
```

Getting a random year and month was easy thanks to Python's `random` library. Figuring out the total number of days in the month was a bit harder, and by that I mean I had to google for it. The `calendar` module provides a simple API for it. I'll be honest - in the past I've been lazy with code like this and simply used 28 as a max day. Don't tell my employers. After that, it's pretty much the same code as before. Get by year/month, filter to day, and select one. 

<p>
<img data-src="https://static.raymondcamden.com/images/2022/01/nyt2.jpg" alt="Random articles from the NYT" class="lazyload imgborder imgcenter">
</p>

For my final demo, I decided to rebuild the logic I first did nearly ten years ago. Given a term, report on the number of occurrences in headlines over time. Not surprisingly, this is where I first hit the API limits. Thankfully Python has a `sleep` module to make it easy to 'slow' down my code. I also put a limit of 100 years into the code to make it a bit more reasonable. Here's my little command line utility:

```python
#!/usr/bin/python

"""
Given a term X, search for it over years from MIN to now

FYI - the NYT API FAQ: https://developer.nytimes.com/faq

"""
from datetime import date
import requests
import time 
import sys

KEY = "still kinda secret"

# earliest year supported by NYT API
NYT_MIN_YEAR = 1851

# now 
YEAR = (date.today()).year 

# But to keep things rational, maybe just do 100 years
MIN_YEAR = YEAR - 100

# Given a term, I return the total in a year
def countForTerm(term,year):
	# Note, we filter to one key cuz we only really care about the count
	api = f"https://api.nytimes.com/svc/search/v2/articlesearch.json?&api-key={KEY}&fl=web_url"
	# pass term here, requests will url encode
	response = requests.get(api, params=[("fq",f"pub_year:{year} AND headline:{term}")])
	data = response.json()

	if "fault" in data:
		print("ERROR:",data["fault"]["faultstring"])
		sys.exit()

	total = data["response"]["meta"]["hits"]

	return total

def main(term):
	# it's an array, but reduce to a string
	term = " ".join(term)
	print(f"Searching for {term} from {MIN_YEAR} to {YEAR}")
	for year in range(MIN_YEAR, YEAR):
		total = countForTerm(term, year)
		print(year,total)
		time.sleep(6)

if len(sys.argv) == 1:
	print("Usage: nyt3.py termToSearchFor")
	sys.exit()

if __name__ == "__main__":
   main(sys.argv[1:])
```

As you can see, this script is meant to be run from the command like per the usage instructions printed if you don't pass an argument. Instead of a fancy graph (which I know Python can do, I'm not quite there yet), I simply output to the terminal. I also discovered that the `requests` library can handle URL encoding for you. I do that in the second argument to the `get` call. Also note I'm filtering the results to one key, `web_url`, because I don't actually care about the matches, just the count. I ran a test on this on "iraq war" and here's the result. I'm sharing this as text and not a graphic as it's quite big:

```
Searching for iraq war from 1922 to 2022
1922 0
1923 0
1924 6
1925 31
1926 15
1927 11
1928 17
1929 34
1930 39
1931 38
1932 25
1933 35
1934 18
1935 15
1936 27
1937 21
1938 23
1939 23
1940 19
1941 181
1942 34
1943 20
1944 15
1945 30
1946 52
1947 59
1948 102
1949 93
1950 69
1951 79
1952 79
1953 45
1954 97
1955 118
1956 141
1957 130
1958 302
1959 284
1960 107
1961 106
1962 63
1963 163
1964 47
1965 44
1966 73
1967 64
1968 59
1969 114
1970 46
1971 41
1972 47
1973 51
1974 51
1975 55
1976 25
1977 16
1978 25
1979 36
1980 328
1981 143
1982 138
1983 123
1984 154
1985 124
1986 122
1987 114
1988 157
1989 47
1990 663
1991 791
1992 286
1993 198
1994 104
1995 111
1996 182
1997 131
1998 539
1999 154
2000 82
2001 149
2002 984
2003 3597
2004 2820
2005 2258
2006 3524
2007 3047
2008 1814
2009 761
2010 524
2011 378
2012 143
2013 173
2014 776
2015 386
2016 143
2017 134
2018 115
2019 95
2020 74
2021 80
```

All in all, fun and fascinating! I've got some ideas on another demo with this but will call it quits for today. Let me know what you think.

Photo by <a href="https://unsplash.com/@freegraphictoday?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">AbsolutVision</a> on <a href="https://unsplash.com/s/photos/newspaper?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  