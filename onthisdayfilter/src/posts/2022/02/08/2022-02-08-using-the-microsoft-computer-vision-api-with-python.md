---
layout: post
title: "Using the Microsoft Computer Vision API with Python"
date: "2022-02-08T18:00:00"
categories: ["development"]
tags: ["python"]
banner_image: /images/banners/collage.jpg
permalink: /2022/02/08/using-the-microsoft-computer-vision-api-with-python.html
description: A simple example of using an API to recognize what is found in a picture. It uses the Microsoft Computer Vision API and Python"
---

A few weeks ago I blogged about using the [Adobe PDF Extract API](https://www.adobe.io/document-services/apis/pdf-extract/) and Microsoft's Computer Vision API: ["Integrating AI Computer Vision with Your PDF Documents"](https://medium.com/adobetech/integrating-ai-computer-vision-with-your-pdf-documents-fc12c9055d6c). The idea was to extract images from a PDF and then analyze them to help provide more context about the document. While working on that article, I got to play with Microsoft's [image recognition API](https://azure.microsoft.com/en-us/services/cognitive-services/computer-vision/#overview) again and I was impressed by how easy it was to use. As I'm learning Python, I thought it would be a good exercise to convert my JavaScript code to Python and see what results I'd get. Here's what I came up with.

The first issue I ran into was needing to find a replacement for the `dotenv` npm module. This lets you put environment defaults in a `.env` file that get replaced with "real" values in production. Turns out there's a Python version of this, [python-dotenv](https://pypi.org/project/python-dotenv/). 

You make your `.env` file and it's then accessible in your code by doing the following:

```python
from dotenv import load_dotenv

load_dotenv()
```

Of course, I then realized I didn't know how to read environment variables in Python. That's not hard either:

```python
import os

something = os.getenv('something')
```

All together, it looks like so:

```python
import os
from dotenv import load_dotenv

load_dotenv()

MS_IMAGE_KEY = os.getenv('MS_IMAGE_KEY')
MS_IMAGE_ENDPOINT = os.getenv('MS_IMAGE_ENDPOINT')
```

For the Microsoft image API two special values are needed hence the two variables above. 

Cool. Next, we need to hit the API. Microsoft ships a [Python SDK](https://docs.microsoft.com/en-us/python/api/azure-cognitiveservices-vision-computervision/?view=azure-python) for the service, but I was worried that, like the Node one, it wouldn't support local images, only those loaded from URL. From what I can see the Python one *does* support local images, but as the 'just hit the API' version I built in Node was so simple, I figured I'd take the same track using the Python `requests` library. Here now is the entire script, with the important bits being the `scanImage` function:

```python
import requests
import sys
import os
from dotenv import load_dotenv
import json 

load_dotenv()

MS_IMAGE_KEY = os.getenv('MS_IMAGE_KEY')
MS_IMAGE_ENDPOINT = os.getenv('MS_IMAGE_ENDPOINT')

def scanImage(path):

	theUrl = MS_IMAGE_ENDPOINT + 'vision/v3.2/analyze?visualFeatures=Categories,Tags,Description&language=en'

	headers = {
		'Content-Type':'application/octet-stream',
		'Ocp-Apim-Subscription-Key':MS_IMAGE_KEY
	}

	body = open(path,'rb')

	response = requests.post(
		theUrl,
		headers = headers,
		data = body
	)

	body.close()

	return response.json()


def main(path):
	results = scanImage(path)
	print(json.dumps(results, indent=4))

if len(sys.argv) == 1:
	print("Usage: scan.py <image filename>")
	sys.exit()

if __name__ == "__main__":
	main(sys.argv[1])
```

I can then test this at the command line like so:

```bash
python scan.py myimage.jpg
```

Using my [avatar in the upper left](https://www.raymondcamden.com/images/avatar.jpg) as a source, here's what I get:

```js
{
    "categories": [
        {
            "name": "people_portrait",
            "score": 0.99609375,
            "detail": {
                "celebrities": []
            }
        }
    ],
    "tags": [
        {
            "name": "human face",
            "confidence": 0.9980896711349487
        },
        {
            "name": "person",
            "confidence": 0.9944546222686768
        },
        {
            "name": "human beard",
            "confidence": 0.9923844337463379
        },
        {
            "name": "selfie",
            "confidence": 0.9785255193710327
        },
        {
            "name": "facial hair",
            "confidence": 0.9742406606674194
        },
        {
            "name": "indoor",
            "confidence": 0.9726375937461853
        },
        {
            "name": "moustache",
            "confidence": 0.9702584743499756
        },
        {
            "name": "forehead",
            "confidence": 0.968742847442627
        },
        {
            "name": "man",
            "confidence": 0.9670464992523193
        },
        {
            "name": "chin",
            "confidence": 0.9610129594802856
        },
        {
            "name": "smile",
            "confidence": 0.9607347249984741
        },
        {
            "name": "jaw",
            "confidence": 0.9544980525970459
        },
        {
            "name": "clothing",
            "confidence": 0.9503325819969177
        },
        {
            "name": "eyebrow",
            "confidence": 0.9393746852874756
        },
        {
            "name": "wall",
            "confidence": 0.9386157393455505
        },
        {
            "name": "cheek",
            "confidence": 0.9332408905029297
        },
        {
            "name": "eyewear",
            "confidence": 0.9194544553756714
        },
        {
            "name": "portrait",
            "confidence": 0.8989632725715637
        },
        {
            "name": "vision care",
            "confidence": 0.8983044624328613
        },
        {
            "name": "skin",
            "confidence": 0.8747736215591431
        },
        {
            "name": "cool",
            "confidence": 0.865845799446106
        },
        {
            "name": "beard",
            "confidence": 0.8605197668075562
        },
        {
            "name": "throat",
            "confidence": 0.8569018244743347
        },
        {
            "name": "neck",
            "confidence": 0.8547131419181824
        },
        {
            "name": "lip",
            "confidence": 0.8515200614929199
        },
        {
            "name": "glasses",
            "confidence": 0.8465250730514526
        },
        {
            "name": "wearing",
            "confidence": 0.6854460835456848
        },
        {
            "name": "shirt",
            "confidence": 0.5346012711524963
        }
    ],
    "description": {
        "tags": [
            "wall",
            "person",
            "man",
            "indoor"
        ],
        "captions": [
            {
                "text": "a man with a beard and glasses",
                "confidence": 0.5318448543548584
            }
        ]
    },
    "requestId": "b3a07360-1a12-42f0-9c28-00fb5e255bdb",
    "metadata": {
        "height": 900,
        "width": 900,
        "format": "Jpeg"
    },
    "modelVersion": "2021-05-01"
}
```

Yep, I'm a man with beard and glasses.

I then modified my script in a new file, `checkfor.py`. That's a horrible name, but basically, I wanted to have a utility that would scan an image and tell you if there was match to a term. So for example:

```bash
python checkfor.py ray.jpg beard
```

Would get the results and then look for the term. While it could be more complex, here's the method I built:

```python
# Given a set of results, look for str in tags or description. I return a dict with:
# found: Boolean and optionally, "where" being { "type":"tag", "tag": the tag } or
# caption with the matched caption
def lookFor(data, term):
	result = { "found": False }

	for tag in data["tags"]:
		if tag["name"] == term:
			result["found"] = True
			result["where"] = { "type": "tag", "tag": tag }
			return result

	# Not sure about the If here
	if data["description"] and data["description"]["captions"]:
		for caption in data["description"]["captions"]:
			if caption["text"].find(term) >= 0:
				result["found"] = True
				result["where"] = { "type": "caption", "caption": caption }

	return result 
```

It will return a dictionary that signifies if a match was found, and if so, where and how. When I ran that, I got:

```js
{
	'found': True, 
	'where': {
		'type': 'caption', 
		'caption': {
			'text': 'a man with a beard and glasses', 
			'confidence': 0.5318448543548584
		}
	}
} 
```

If I repeat it with a search for a cat, I (sadly) get:

```js
{'found': False}
```

All in all, pretty simple and direct, and as always, remember I'm learning Python, so definitely keep in mind that this could probably be done better. Here's the entire final script.

```python
import requests
import sys
import os
from dotenv import load_dotenv
import json 

load_dotenv()

MS_IMAGE_KEY = os.getenv('MS_IMAGE_KEY')
MS_IMAGE_ENDPOINT = os.getenv('MS_IMAGE_ENDPOINT')

def scanImage(path):

	theUrl = MS_IMAGE_ENDPOINT + 'vision/v3.2/analyze?visualFeatures=Categories,Tags,Description&language=en'

	headers = {
		'Content-Type':'application/octet-stream',
		'Ocp-Apim-Subscription-Key':MS_IMAGE_KEY
	}

	body = open(path,'rb')

	response = requests.post(
		theUrl,
		headers = headers,
		data = body
	)

	body.close()

	return response.json()

# Given a set of results, look for str in tags or description. I return a dict with:
# found: Boolean and optionally, "where" being { "type":"tag", "tag": the tag } or
# caption with the matched caption
def lookFor(data, term):
	result = { "found": False }

	for tag in data["tags"]:
		if tag["name"] == term:
			result["found"] = True
			result["where"] = { "type": "tag", "tag": tag }
			return result

	# Not sure about the If here
	if data["description"] and data["description"]["captions"]:
		for caption in data["description"]["captions"]:
			if caption["text"].find(term) >= 0:
				result["found"] = True
				result["where"] = { "type": "caption", "caption": caption }

	return result 

def main(path,term):
	scanresults = scanImage(path)
	result = lookFor(scanresults, term)
	print(result)

if len(sys.argv) <= 2:
	print("Usage: checkfor.py <image filename> <term>")
	sys.exit()

if __name__ == "__main__":
	main(sys.argv[1], sys.argv[2])
```

Photo by <a href="https://unsplash.com/@hjrc33?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Héctor J. Rivas</a> on <a href="https://unsplash.com/s/photos/images?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  