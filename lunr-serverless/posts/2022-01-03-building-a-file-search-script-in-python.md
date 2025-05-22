---
layout: post
title: "Building a File Search Script in Python"
date: "2022-01-03T18:00:00"
categories: ["development"]
tags: "post"
description: How I built a Python script to search my blog posts 
---

As I've said *many* times lately, I'm trying to learn Python. I used it for last years [Advent of Code](https://adventofcode.com/) and successfully finished ten days of challenges. I'm also on the lookout for other places I can use it, even if just to provide a way to practice the language. Today I looked into making a change to my [search](/search) interface. It uses [Algolia](https://www.algolia.com/) for indexing and searching. Currently it sorts results by the strength of the match, but I was looking for a way to *optionally* sort by date instead. Algolia supports this via "replicas", a copy of your index. It supports the idea of a "virtual replica" which is the most optimal way of doing it. Unfortunately, this is not supported on their free tier. To be clear, Algolia provides **awesome** value at their free tier so I don't blame them for charging for this, but I needed a solution of *some* sort. Enter Python!

Since my search page doesn't really get a lot of traffic anyway (mostly me actually), I decided a local script solution would be fine. I decided to build a Python script that would:

* Be a runnable script like I've done with Node (and by that I mean something I could run without specifying the python command first)
* Take a number of arguments for search terms
* Parse all my local data
* Find the matches
* Sort by date

Pretty much all of the above was new to me, so even though I knew my "search" logic would *not* be as good as Algolia's, I figured it was a worthwhile use of my time. First things first, I had to figure out how to make a Python script "runnable" without needing to specify the python executable. Not surprisingly, it followed the typicaly bash style that I've used for Node scripts:

```bash
#!/usr/bin/python
```

And of course, I had to `chmod a+x` the file too. Cool. Next, I needed a way to check the number of arguments sent to the script. If none were sent, I wanted to print out a usage command and exit out. That was done via the `sys` module:

```python
if len(sys.argv) == 1:
	print("Usage: search.py A B C where you can have N search term arguments.")
	sys.exit()
```

`sys.argv` is a list of arguments where the first item is the file name. Now if I do: `./search.py`, I'll get a reminder of how to use it.

Next I added a `main` method, and followed what I believe is the standard way of writing Python scripts:

```python
#!/usr/bin/python

import sys

def main(terms):

	print("Going to search for:", ', '.join(terms))

if len(sys.argv) == 1:
	print("Usage: search.py A B C where you can have N search term arguments.")
	sys.exit()

if __name__ == "__main__":
   main(sys.argv[1:])
```

Note how I pass all the args to `main` except the first one. I have to say, the way you join an array is still really awkward to me. I much prefer the syntax in JS of arr.join(string to use). But I can get over it. 

Now I started to build out my main method. First, I get all of my Markdown files. I defined a variable defining a glob string pointing to my bolog posts:

```python
INPUT = "./_posts/**/*.md"
```

And then used the builtin `glob` module to get the files:

```python
# get all the MD files, ALL OF EM!!!
files = glob.glob(INPUT, recursive=True)
```

It's a bit weird that the glob pattern isn't recursive by default, but I'm sure I won't forget that next time I use it. Surely.

Alright, next I needed to create an "index", or an in-memory respresentation of the files. This is not ideal, and not scalable, but in my testing, the performance with my data was fine. The process took a bit less than a second, which is quick enough for me. I began with:

```python
# now we need to parse into an array of content with dates
print("Creating index of "+str(len(files)) +" files.")
index = makeIndex(files)
```

And wrote the following method:

```python
def makeIndex(f):
	result = []
	for file in f:
		with open(file) as reader:
			
			content = reader.read()

			# Get date from filename, could use fm, but its easier with the filename I think
			parts = file.split("-")
			year = parts[0].split('/').pop()
			month = parts[1]
			# I discovered some files have a time stamp in the day part:
			# ./_posts/2021/05/24/2021-05-24T18:00:00-quick-netlify-tip-for-redirects.md
			day = parts[2]
			if day.find("T") >= -1:
				dayParts = day.split("T")
				day = dayParts[0]

			postDate = datetime.date(int(year), int(month), int(day))

			# get the url path which is filename minus the first parts
			path = year + "/" + month + "/" + day + "/" + '-'.join(parts[3:])
			path = path.replace(".md", "")

			result.append({
				"content":content,
				"date":postDate,
				"path":path
			})

	return result
```

This should start off sensible - I loop over the files and for each, slurp the contents in. The weird part comes into how I parse out the date and path. All of my blog posts follow a file format that looks like this:

	_posts/YEAR/MONTH/DAY/YYYY-MM-DD-slug.md

So I can get the date by parsing the file. It's also in the file's front matter, but the path was easier to parse. For the most part. As you can see in the comment, a least one file had a timestamp in the day part. Not sure what happened there to be honest. 

Anyway, I get the date parts and then make a date object. I then need to translate the filename to the URL path, which is the date values again and the slug part of the filename without the md extension. It makes sense. Kinda. 

Finally, I take the three parts, add them to a dictionary, and add them to the result list. 

Alright, next up is the actual search portion. I call it like so:

```python
result = searchIndex(index, terms)
```

And defined the method like so:

```python
def searchIndex(index, terms):
	result = []

	for post in index:
		addPost = True
		for term in terms:
			term = term.lower()
			if post["content"].find(term) == -1:
				addPost = False
		
		if addPost:
			result.append(post)

	result = sorted(result, key = lambda p: p["date"], reverse=True)

	return result
```

Basically, go over every item in the index, and then loop over every search term (remember I said I wanted it to AND the input). I check to see if every term is there, and as long as they all are, the item is added to a result list. As I write this I noticed I'm lowercasing my search term once per file which is wasteful and I'll fix that later. Surely.

Finally, I sort my result list. Honestly, I don't quite "grok" that syntax, but I both don't 100% understand it *and* think it's freaking cool as hell. 

I want to stress that me doing a simple string match is nowhere near as cool as Algolia's search API. But it's good enough for my purposes. Back in the `main` method, I handle the results like so:

```python
if len(result) == 0:
	print("No results were found.")
	sys.exit()

print("Found " + str(len(result)) + " results:")
for result in result:
	# create url based on path
	url = "https://www.raymondcamden.com/" + result["path"]
	print(result["date"],url)
```

I print out the results with my domain because in both VS Code and Terminal, the links can be clicked. Here's an example:

<p>
<img src="https://static.raymondcamden.com/images/2022/01/p1.jpg" alt="Example output from the Python script" class="lazyload imgborder imgcenter">
</p>

Here's the entire script if you wish to see it, and feel free to critique my Python code - I'm sure it could be done a lot better!

```python
#!/usr/bin/python

"""
A script to handle date based searching for my blog content. 

Reads all the markdown into a ginormous array.
Takes N args as a list of terms that must appear (ie, AND)
terms are:  "foo" or "moo zoo", such that a multi word term is a phrase essentially
"""

import sys
import glob
import datetime

INPUT = "./_posts/**/*.md"


def makeIndex(f):
	result = []
	for file in f:
		with open(file) as reader:
			
			content = reader.read()

			# Get date from filename, could use fm, but its easier with the filename I think
			parts = file.split("-")
			year = parts[0].split('/').pop()
			month = parts[1]
			# I discovered some files have a time stamp in the day part:
			# ./_posts/2021/05/24/2021-05-24T18:00:00-quick-netlify-tip-for-redirects.md
			day = parts[2]
			if day.find("T") >= -1:
				dayParts = day.split("T")
				day = dayParts[0]

			postDate = datetime.date(int(year), int(month), int(day))

			# get the url path which is filename minus the first parts
			path = year + "/" + month + "/" + day + "/" + '-'.join(parts[3:])
			path = path.replace(".md", "")

			result.append({
				"content":content,
				"date":postDate,
				"path":path
			})

	return result

def searchIndex(index, terms):
	result = []

	for post in index:
		addPost = True
		for term in terms:
			term = term.lower()
			if post["content"].find(term) == -1:
				addPost = False
		
		if addPost:
			result.append(post)

	result = sorted(result, key = lambda p: p["date"], reverse=True)

	return result

def main(terms):

	print("Going to search for:", ', '.join(terms))

	# get all the MD files, ALL OF EM!!!
	files = glob.glob(INPUT, recursive=True)

	# temp
	# files = files[0:10]

	# now we need to parse into an array of content with dates
	print("Creating index of "+str(len(files)) +" files.")
	index = makeIndex(files)

	result = searchIndex(index, terms)
	if len(result) == 0:
		print("No results were found.")
		sys.exit()

	print("Found " + str(len(result)) + " results:")
	for result in result:
		# create url based on path
		url = "https://www.raymondcamden.com/" + result["path"]
		print(result["date"],url)

if len(sys.argv) == 1:
	print("Usage: search.py A B C where you can have N search term arguments.")
	sys.exit()

if __name__ == "__main__":
   main(sys.argv[1:])
```

