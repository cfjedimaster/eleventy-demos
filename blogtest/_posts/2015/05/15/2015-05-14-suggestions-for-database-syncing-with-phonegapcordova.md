---
layout: post
title: "Suggestions for Database Syncing with PhoneGap/Cordova"
date: "2015-05-15T07:55:54+06:00"
categories: [development,mobile]
tags: [cordova]
banner_image: 
permalink: /2015/05/15/suggestions-for-database-syncing-with-phonegapcordova
guid: 6146
---

Shai asked me an interesting question that I thought would be good to discuss here, and get feedback from my audience. Their question was:

<!--more-->

<blockquote>Hello Ray,

I'm a long follower of your blog. I am also a MobileFirst &amp; PhoneGap developer.

I wanted to consult with you, if I may, what is your suggestion about developing a PhoneGap app (not MobileFirst) which has to be synched with a remote DB. The user populated data on the app, and if the app is offline than it is stored locally. When the network returns, the app must upload the data to the remote server and it has to be done seamlessly. The amount of data in terms of records and/or size could become quite "big". I don't suppose it could 5 MB but we have to provide a solution in case it does, as part of it is pictures taken by the user.

Any suggestion would be most appreciated. Do you have a "reliable" plug-in you could recommend?

Thanks and BR's,

Shai.</blockquote>

I have no idea what BRs are, but you are welcome. ;) So first off, this can definitely be done, "by hand", if you would like. You can use the <a href="https://www.npmjs.com/package/cordova-plugin-network-information">Network</a> plugin to detect when a user is on or offline. You can use regular old Ajax to send the data, being sure to only send what you <i>need</i> to send, i.e. data that is new. Storing data locally you've got a few options as well. WebSQL is baked in, but has limits. You can also use the <a href="http://plugins.telerik.com/cordova/plugin/sqlite">SQLite</a> plugin. I haven't used this yet myself but plan on playing with it soon. As far as I know though it follows the same concept as WebSQL. Back in 2012, I blogged on this topic myself, <a href="http://www.raymondcamden.com/2012/04/03/adding-database-synchronization-to-your-phonegap-project">Adding database synchronization to your PhoneGap project</a>. (Hard to believe I've been blogging about PhoneGap/Cordova that long.) 

How about libraries? As far as I know, Parse's offline support is only for Android now. I recently played with <a href="http://pouchdb.com/">PouchDB</a> (<a href="http://www.raymondcamden.com/2015/04/24/connecting-pouchdb-to-ibm-bluemix">Connecting PouchDB to Cloudant on IBM Bluemix</a>) and I <i>really</i>, <i>really</i> like it, but haven't used it in production yet. Firebase has <a href="https://www.firebase.com/docs/web/guide/offline-capabilities.html">offline</a> support too, but I haven't yet tried their product. 

All of these solutions assume that you are ok with using their own database of course and not your own. If it <i>must</i> be your database than you'll want to go with the manual approach I described above.