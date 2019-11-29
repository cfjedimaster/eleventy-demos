---
layout: post
title: "Connecting PouchDB to Cloudant on IBM Bluemix"
date: "2015-04-24T15:39:43+06:00"
categories: [development,javascript]
tags: [bluemix]
banner_image: 
permalink: /2015/04/24/connecting-pouchdb-to-ibm-bluemix
guid: 6054
---

So, as always, I tend to feel I'm a bit late to things. Earlier today my coworker <a href="http://www.tricedesigns.com/">Andy</a> was talking to me about <a href="http://pouchdb.com/">PouchDB</a>. PouchDB is a client-side database solution that works in all the major browsers (and Node) and intelligently picks the best storage system available. It is even smart enough to recognize that while Safari supports IDB, it doesn't make sense to use it and switches to WebSQL. It has a relatively simply API and best of all - it has <i>incredibly</i> simple sync built in. 

<!--more-->

I tend to work with client-side databases with just the vanilla JavaScript APIs available to them, but honestly, after an hour or so of using PouchDB I can't see going back. (And yes, I know other solutions exist too - and I'm going to explore this area more.) Probably the slickest aspect is the sync. If you have a CouchDB server setup, you can set up automatic sync between all the database instances in seconds. For my testing, I decided to use <a href="https://console.ng.bluemix.net">IBM Bluemix</a>. This blog post assumes you're following the <a href="http://pouchdb.com/getting-started.html">PouchDB Getting Started</a> guide.

First, add the <strong>Cloudant NoSQL DB</strong> service to your Bluemix app:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/shot13.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/shot13.png" alt="shot1" width="850" height="547" class="alignnone size-full wp-image-6055" /></a>

After you have added the service and restaged your app, select it, and then hit the Launch button:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/shot22.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/shot22.png" alt="shot2" width="850" height="434" class="alignnone size-full wp-image-6056" /></a>

This fires up the Cloudant administrator where you can do - well - pretty much everything related to setting up your database. But to work with that guide at PouchDB, select Databases and then "Add New Database":

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/shot31.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/shot31.png" alt="shot3" width="850" height="434" class="alignnone size-full wp-image-6057" /></a>

Then enter <code>todos</code> to match the guide:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/shot41.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/shot41.png" alt="shot4" width="500" height="243" class="alignnone size-full wp-image-6058" /></a>

Ok, you're almost done. You then want to enable CORS for your Cloudant install. In the Cloudant admin, click Account and then CORS. Enable it, and then select what origin domains you want. For now, it may be easier to just allow all domains.

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/shot51.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/shot51.png" alt="shot5" width="850" height="295" class="alignnone size-full wp-image-6059" /></a>

Woot - ok - one more step. When using PouchDB and sync, they expect you to supply a connection URL. You can get this back in your Bluemix console. Select the "Show Credentials" link to expand the connection data and then copy the "url" portion.

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/shot6.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/shot6.png" alt="shot6" width="435" height="600" class="alignnone size-full wp-image-6060" /></a>

And voila - that's it. If you open your test in multiple browsers, you'll see everything sync perfectly. Remember you can also use PouchDB in Node.js, which, coincidentally, you can <i>also</i> host up on Bluemix, so yeah, that works out well too. 

<strong>Edit on June 3, 2015:</strong> Oops, that isn't quite it - but close. The URL you get from the console is a <strong>root</strong> URL for your CouchDB instance. In order to work with a database, like todos, you want to add /todos (or whatever) to the end of the URL you use in your code.