---
layout: post
title: "PhoneGap RSS Reader - Part 4"
date: "2012-07-09T09:07:00+06:00"
categories: [javascript,jquery,mobile]
tags: []
banner_image: 
permalink: /2012/07/09/phonegap-rss-reader-part-4
guid: 4670
---

<b>Edited on August 4, 2012: Readers noted that this version didn't correctly handle trying to load the cache when offline. I confirmed that and posted a fix in the comments.</b>

For whatever reason, my articles on PhoneGap and RSS (see related entries below) have been incredibly popular. The <a href="http://www.raymondcamden.com/index.cfm/2012/1/24/PhoneGap-RSS-Reader--Part-3">last entry</a> currently has 163 comments. Some of the comments deal with the fact that RSS, while a standard, does have a bit of variation to it. My code made some assumptions that didn't always work for other feeds. I thought this was a great opportunity to look at ways I could make the code more applicable to other types of feeds, especially Atom. Luckily, there is an awesome service for this - the <a href="https://developers.google.com/feed/">Google Feed API</a>.
<!--more-->
As you can probably guess, the Google Feed API allows you to parse RSS feeds into simple to use data. It takes any valid RSS or Atom feed and parses it into a simple, <i>standard</i> data model. While the previous code I used wasn't too difficult, it was also very tied to one particular flavor of RSS. I could have continued to add in support for multiple styles of RSS feeds but this seemed far easier to me. 

To begin, I added a script tag to load in the <a href="http://code.google.com/apis/loader">Google Loader</a>. This is service Google provides that allows you to dynamically include in JavaScript support for various Google APIs.

&lt;script type="text/javascript" src="https://www.google.com/jsapi"&gt;&lt;/script&gt;

To load in support for the Feed API, I modified my mainPage pageinit event handler to ask Google Load to go grab the bits. <b>It is very important that you provide the callback option to this API. If you do not, Google Load will blow away the jQuery Mobile DOM completely.</b> 

<script src="https://gist.github.com/3076266.js?file=gistfile1.js"></script>

Now let's look at initialize. Previously, this is the portion that would have done the Ajax call, used XML parsing on the results, and stored the entries. Because Google's Feed API is doing this for me the code is now somewhat simpler. (I also added support for jQuery  Mobile's "showPageLoadingMsg" API to make it obvious to the user that something is happening.) 

<script src="https://gist.github.com/3076280.js?file=gistfile1.js"></script>

And that's pretty much it. My previous code stored the content of the RSS item in a key named content. Google uses a key named description so I modified my display code. 

As a final enhancement, I decided to make use of <a href="http://build.phonegap.com">PhoneGap Build</a> to create my mobile application. This allowed me to define a simple config.xml file to help define how the executables are generated. For example, I was able to provide simple icon support. (The icons I used were provided by <a href="http://www.fasticon.com/freeware/web-2-icons/">Fast Icon</a>.) 

<script src="https://gist.github.com/3076322.js?file=gistfile1.xml"></script>

You can see my application at the bottom here in the screen shot. And yes - I have a Selena Gomez app. Don't hate me for downloading apps my daughter loves.

<img src="https://static.raymondcamden.com/images/2012-07-09 07.56.02.png" />

Want to download the app yourself? Try the <a href="https://build.phonegap.com/apps/155702/share">public Build page</a> for every platform but iOS. You can also download all of the bits below.<p><a href='/enclosures/Archive26.zip'>Download attached file.</a></p>