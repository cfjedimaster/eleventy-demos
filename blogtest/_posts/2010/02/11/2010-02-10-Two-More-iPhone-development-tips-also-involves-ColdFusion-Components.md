---
layout: post
title: "Two (More) iPhone development tips (also involves ColdFusion Components)"
date: "2010-02-11T09:02:00+06:00"
categories: [coldfusion,development]
tags: []
banner_image: 
permalink: /2010/02/11/Two-More-iPhone-development-tips-also-involves-ColdFusion-Components
guid: 3718
---

Earlier in the week I helped a reader with a iPhone issue he was having. From this came two things I'd like to share with folks. Number one - don't use Flash (sorry, couldn't resist!).
<!--more-->
First - don't forget that Safari on the iPhone has a development mode. This is <b>critical</b> for getting any type of feedback for JavaScript errors. How do you enable this? Go to your Settings, Safari page. At the <i>very</i> bottom is a Developer menu. Click it and you will see...

<img src="https://static.raymondcamden.com/images/Screen shot 2010-02-09 at 4.12.44 PM.png" />

Obviously you want to ensure the Debug Console is turned on. Once done, if you return to the browser and rerun your page with the error, you will see a new notice:

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-02-09 at 4.13.02 PM.png" />

Clicking that option will give you some details about the error:

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-02-09 at 4.13.13 PM.png" />

It's no Firebug, but it's better than nothing.

So what's the second tip? The error the user had involved a simple jQuery call to a CFC that returned JSON. It worked perfectly everywhere <i>but</i> the iPhone. Why? The iPhone didn't like the fact that the result didn't have the proper mime type. I asked him to add this line before his cfreturn: &lt;cfcontent type="application/json" reset="true"&gt;. Unfortunately this kinda breaks the reusability of the component. To be a bit more abstract, he could add a quick check for URL.returnFormat first and only use the content type when necessary.