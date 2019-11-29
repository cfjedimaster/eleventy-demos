---
layout: post
title: "Important Note for OpenWhisk Developers"
date: "2017-07-05T08:52:00-07:00"
categories: [serverless]
tags: [openwhisk]
banner_image: 
permalink: /2017/07/05/important-note-for-openwhisk-developers
---

Yesterday while working on a new book (yep - I'm writing a book for OpenWhisk!) I discovered something pretty important. I generally use the OpenWhisk docs on IBM Bluemix as my reference: https://console.bluemix.net/docs/openwhisk/index.html. I knew that the docs were sourced from the [GitHub repo](https://github.com/apache/incubator-openwhisk), but what I did not know is how far behind the Bluemix docs were. 

This is probably just a random fluke, but it bit me in the rear (and I'll explain why next) so I'm now updating my own bookmarks to the GitHub docs: https://github.com/apache/incubator-openwhisk/tree/master/docs.

Ok, so why was this a big deal to me? In the past when I've blogged about Web Actions, I've mentioned that you need to manually add a CORS header to use it in client-side applications. In fact, about a month ago I shared a generic solution for this: [Using a Generic CORS Enabler in OpenWhisk](https://www.raymondcamden.com/2017/06/12/using-a-generic-cors-enabler-in-openwhisk/)

While working on my book though, I discovered that I no longer needed to do this! In fact, the CORS header is now automatically added. This is [documented](https://github.com/apache/incubator-openwhisk/blob/master/docs/webactions.md#options-requests) along with a new annotation you can add if you want more control over this behavior. This is a great new addition and one that makes a lot of sense I think.

In the docs you'll also see a note about another new feature, [Vanity URLs](https://github.com/apache/incubator-openwhisk/blob/master/docs/webactions.md#vanity-url). All this does is make your API urls a bit nicer looking, so it isn't a huge big deal, but it's nice to know about. You may be curious though how you can actually use it since it requires a namespace with pretty strict restrictions. 

<blockquote>
The namespaces must match the regular expression [a-zA-Z0-9-]+ (and should be 63 characters or fewer) ...
</blockquote>

My namespace fails this right away: <code>/rcamden@us.ibm.com_My Space/</code>. However, I forgot that in the Bluemix you can rename both your org (the "rcamden@us.ibm.com") part above and the space ("My Space"). However... currently the OpenWhisk UI on Bluemix does not handle the rename correctly. Until the bug is fixed, I'd avoid renaming your org/space on Bluemix if you have existing OpenWhisk actions.

I said this feature "just" adds a nicer URL, but is does include a way to automatically load an HTML resource as well, and that could be handy for quick documentation purposes.