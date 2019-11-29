---
layout: post
title: "Example of authentication and ColdFusion 10 WebSockets (2)"
date: "2012-06-08T12:06:00+06:00"
categories: [coldfusion,html5,javascript]
tags: []
banner_image: 
permalink: /2012/06/08/Example-of-authentication-and-ColdFusion-10-WebSockets-2
guid: 4644
---

So last week I <a href="http://www.raymondcamden.com/index.cfm/2012/6/1/Examples-of-authentication-and-ColdFusion-10-WebSockets">wrote</a> a blog entry talking about how to add authentication to an application using WebSockets under ColdFusion 10. I discussed how there were two main ways of doing it. The previous entry discussed onWSAuthenticate, where authentication is done via JavaScript after the client has already viewed the page. In this entry I'll discuss the second mode, called "Single Sign On" mode.
<!--more-->
Single Sign On mode, or SSO for short, is basically a way to have your websocket code recognize an already existing login. However, this does not work with just any regular session-based login. You must make use of cflogin. I have to admit that it has been a little while since I used this feature in ColdFusion. Luckily though once you make use of it, it "just works", which is always a good thing. 

Let's begin with my Application.cfc file. In order for cflogin-based authentication to work, I must make use of the tags within my onRequestStart method and handle both a login attempt and forcing the user to a login page if they are not authenticated.

<script src="https://gist.github.com/2896103.js?file=gistfile1.cfm"></script>

Note that our authentication here is rather trivial. If you pass in a username of admin or bob, you're kosher. If you pass in admin, we also set your roles to admin. I'm not going to bother sharing the code for login.cfm, it will be part of the zip attached to the entry, but all it has is a simple form.

Now - once you login - you can run the main index.cfm. This script has a basic WebCocket 'chat' setup where you select a category of messages you want to receive and then start messaging. Unlike the <a href="http://www.raymondcamden.com/index.cfm/2012/6/1/Examples-of-authentication-and-ColdFusion-10-WebSockets">previous demo</a>, I am <b>not</b> running the authenticate API as I'm already logged in, or should be. 

<script src="https://gist.github.com/2896136.js?file=gistfile1.cfm"></script>

While there is nothing here specific to security, ColdFusion is aware of your authentication. In fact, check out the message handler CFC I'm using for my WebSocket.

<script src="https://gist.github.com/2896139.js?file=gistfile1.cfm"></script>

Notice that I'm checking the authenticated key of the subscriberInfo data. This is similar to my last blog entry. You will also notice that I'm logging the data so I can see what is being passed. Here is what gets logged when I first subscribe:

allowSubscribe: {% raw %}{""connectioninfo"":{""connectiontime"":""June, 08 2012 10:25:21"", ""roles"":""admin"", ""clientid"":2137173390, ""authenticated"":true, ""username"":""admin""}{% endraw %},""channelname"":""news""}

Note that my username and roles were both picked up by the WebSocket. I could use this when generating and handling messages. For example, I could broadcast out messages that only get sent to people in the admin role. 

Finally - in case you're curious - when you run wsGetSubscribers on the server side you can also see the same information. 

If you would like to demo this, just hit the link below. As I said earlier, you must login with either 'admin' or 'bob'. You can also download the full source code below.

<a href="http://raymondcamden.com/demos/2012/jun/8/index.cfm"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a><p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2012%{% endraw %}2Eraymondcamden{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fexample8%{% endraw %}2Ezip'>Download attached file.</a></p>