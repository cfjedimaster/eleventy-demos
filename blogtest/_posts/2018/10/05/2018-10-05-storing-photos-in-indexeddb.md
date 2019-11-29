---
layout: post
title: "Storing (and Retrieving) Photos in IndexedDB"
date: "2018-10-05"
categories: ["javascript"]
tags: ["javascript"]
banner_image: /images/banners/storage.jpg
permalink: /2018/10/05/storing-retrieving-photos-in-indexeddb
---

Hey folks - welcome to the first post in October! Yep, I'm still going rather slow when it comes to posting. Looking for a new job has thrown a monkey wrench into my creativity a bit so I apologize for the lack of content here. I worked on something a bit interesting today so I thought I'd share it here. 

I'm working with a client who has a Cordova application that makes use of the camera as well as the device file system for storage. I'm adding some code to handle storing form data, and associated pictures, in a queue for posting to a server while the device is offline. I decided to avoid, like the plague, any *additional* use of the file system and instead see if I could use IndexedDB (IDB) instead. IDB has pretty decent support now (thank you Apple, really, thanks) and also has good support for storing binary data. I decided to whip up a quick web demo so that I could test on my Android device and see how well it would work. What follows is my test, which is totally *not* production ready code (and this is why I fail the Google tests), but I hope it's of use to others. I'm going to share bits of the code base and explain them and then at the end I'll share the entire file. Again though - use with caution.

As a quick note, I wrote a good (imho) <a href="https://www.amazon.com/gp/product/1491935111/ref=as_li_tl?ie=UTF8&tag=raymondcamd06-20&camp=1789&creative=9325&linkCode=as2&creativeASIN=1491935111&linkId=239944c4f3cbf1e35ce47f4eb857b2a7">book on client-side storage</a> as well as a [video](http://shop.oreilly.com/product/0636920043638.do) version. But they are both a bit old now. Instead of buying the book (although I won't stop you), I suggest reading the MDN guide: [Using IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB). As with everything on MDN, it kicks ass, and it's what I used today to refresh my memory.

### Storing Photos

To work with photos, I used a simple input field with the `capture` attribute:

```markup
<input type="file" id="pictureTest" capture>
```

If you've never seen this before, just a reminder that HTML is full of awesomeness and that you don't always need JavaScript to do cool stuff. I could have added some more to this tag to restrict the selection to images (which, of course, is not something your server should rely on since devtools can tweak that) but I was being lazy. I wrote about this more way back in 2016: [Capturing camera/picture data without PhoneGap - An Update](https://www.raymondcamden.com/2016/06/03/capturing-camerapicture-data-without-phonegap-an-update)

I added a `change` handler to this field so I'd notice as soon as a picture was selected:

```js
document.querySelector('#pictureTest').addEventListener('change', doFile);
```

Ok, so for my IndexedDB system, I set up the following code to initialize the database and objectstore. This is a bit "mixed" up a bit for simplicity and as a reminder, I'll share everything in one file below.

```js
let db;
//stuff
let request = indexedDB.open('testPics', dbVersion);

request.onerror = function(e) {
	console.error('Unable to open database.');
}

request.onsuccess = function(e) {
	db = e.target.result;
	console.log('db opened');
}

request.onupgradeneeded = function(e) {
	let db = e.target.result;
	db.createObjectStore('cachedForms', {keyPath:'id', autoIncrement: true});
	dbReady = true;
}
```

If you're new to IndexedDB I assume more of this makes sense, but feel free to ask me in a comment below if not. The last bit where I define the object store, I've told it to add an `id` field and auto number it for a primary key. 

Alright, so let's look at storage:

```js
function doFile(e) {
	console.log('change event fired for input field');
	let file = e.target.files[0];
	var reader = new FileReader();
	//reader.readAsDataURL(file);
	reader.readAsBinaryString(file);

	reader.onload = function(e) {
		//alert(e.target.result);
		let bits = e.target.result;
		let ob = {
			created:new Date(),
			data:bits
		};

		let trans = db.transaction(['cachedForms'], 'readwrite');
		let addReq = trans.objectStore('cachedForms').add(ob);

		addReq.onerror = function(e) {
			console.log('error storing data');
			console.error(e);
		}

		trans.oncomplete = function(e) {
			console.log('data stored');
		}
	}
}
```

This is the `change` handler for the input field. Note that I don't notice a change from "I picked a file" to "I cleared a file", but as I said, this is a quick test. I grab a handle to the file, create a `FileReader`, and then read the binary data. As you can see by the commented out line (which I normally remove from blog posts), I initially used `readAsDataURL` which returns Base64 string. In theory, binary data is smaller but I think you could use either. The only real difference would be in how you handle the data later. In my demo I re-display it on screen and that makes a difference. If you are storing it to the server via a POST operation, then your server-side code would need to handle it differently as well. 

When I've read in the binary data, I create an object with two fields, a `created` field and the binary data. In my real app, I'll have a bunch of form data too. I then open a transaction to the IndexedDB database and store my file. As I said, I'm a bit rusty with IDB but oh my god do I love the simplicity. (And if that still looks complex to you, there's multiple libraries out there like [Dexie](http://dexie.org/)).

Ok, so as I said, my intent was to load and POST this data, but for my test I decided to just render it in the DOM. I added a small form and blank image:

```markup
<h2>Test Image Below</h2>
<input type="number" id="recordToLoad">	<button id="testImageBtn">Test</button>

<img id="testImage"> 
```

I added a click handler to that button with the idea that you would enter the PK of the data to load. I'm using Chrome and their DevTools for IDB are *incredibly* well done. 

```js
function doImageTest() {
	let image = document.querySelector('#testImage');
	let recordToLoad = parseInt(document.querySelector('#recordToLoad').value,10);
	if(recordToLoad === '') recordToLoad = 1;

	let trans = db.transaction(['cachedForms'], 'readonly');

	let req = trans.objectStore('cachedForms').get(recordToLoad);
	req.onsuccess = function(e) {
		let record = e.target.result;
		console.log('get success', record);
		image.src = 'data:image/jpeg;base64,' + btoa(record.data);
	}
}
```

Note that you have to return the binary data to base64 for rendering, that's the `btoa` part at the bottom there. That's one of those functions I never use until I find it some random StackOverflow question. I also totally read it in Maui's voice:

<img title="Closeup of Maui" src="https://static.raymondcamden.com/images/2018/10/maui.jpg" class="imgborder imgcenter">

And it works. I tested on the desktop and on mobile Chrome on my Android device. 

<img title="Chrome Devtools" src="https://static.raymondcamden.com/images/2018/10/maui2.jpg" class="imgborder imgcenter">

That may be a bit hard to see, but in case you didn't know, Chrome can "remote debug" Android devices connected via USB. You can open URLs via the desktop, open dev tools, and even get a screen shot of the browser. It's damn handy and while not new, it's a great tool to have at your disposal.

Oops! I forgot to include the entire script. Here ya go!

```markup
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
		<meta name="description" content="">
		<meta name="viewport" content="width=device-width">
	</head>
	<body>

		<input type="file" id="pictureTest" capture>
		
		<h2>Test Image Below</h2>
		<input type="number" id="recordToLoad">	<button id="testImageBtn">Test</button>

		<img id="testImage"> 

		<script>
			let db;
			let dbVersion = 1;
			let dbReady = false;

			document.addEventListener('DOMContentLoaded', () => {
				console.log('dom content loaded');

				document.querySelector('#pictureTest').addEventListener('change', doFile);

				document.querySelector('#testImageBtn').addEventListener('click', doImageTest);

				initDb();
			});

			function initDb() {
				let request = indexedDB.open('testPics', dbVersion);

				request.onerror = function(e) {
					console.error('Unable to open database.');
				}

				request.onsuccess = function(e) {
					db = e.target.result;
					console.log('db opened');
				}

				request.onupgradeneeded = function(e) {
					let db = e.target.result;
					db.createObjectStore('cachedForms', {keyPath:'id', autoIncrement: true});
					dbReady = true;
				}
			}

			function doFile(e) {
				console.log('change event fired for input field');
				let file = e.target.files[0];
				var reader = new FileReader();
//				reader.readAsDataURL(file);
				reader.readAsBinaryString(file);

				reader.onload = function(e) {
					//alert(e.target.result);
					let bits = e.target.result;
					let ob = {
						created:new Date(),
						data:bits
					};

					let trans = db.transaction(['cachedForms'], 'readwrite');
					let addReq = trans.objectStore('cachedForms').add(ob);

					addReq.onerror = function(e) {
						console.log('error storing data');
						console.error(e);
					}

					trans.oncomplete = function(e) {
						console.log('data stored');
					}
				}
			}

			function doImageTest() {
				console.log('doImageTest');
				let image = document.querySelector('#testImage');
				let recordToLoad = parseInt(document.querySelector('#recordToLoad').value,10);
				if(recordToLoad === '') recordToLoad = 1;

				let trans = db.transaction(['cachedForms'], 'readonly');
				//hard coded id
				let req = trans.objectStore('cachedForms').get(recordToLoad);
				req.onsuccess = function(e) {
					let record = e.target.result;
					console.log('get success', record);
					image.src = 'data:image/jpeg;base64,' + btoa(record.data);
				}
			}
		</script>

	</body>
</html>
```

<i>Header photo by <a href="https://unsplash.com/photos/JuFcQxgCXwA?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Samuel Zeller</a> on Unsplash</i>