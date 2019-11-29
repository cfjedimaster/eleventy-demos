---
layout: post
title: "Neat little ColdFusion 10 REST Trick"
date: "2012-10-05T18:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2012/10/05/Neat-little-ColdFusion-10-REST-Trick
guid: 4753
---

One of the marquee features of ColdFusion 10 is REST support. I think we did a good job in our support, but over all, I'm not terribly impressed. REST kinda feels like complexity for complexity sake. Of course, it is nowhere as complex or difficult as WSDL, but, I couldn't really see using REST over a regular simple HTTP-based service. Then - I tried something kinda cool - and when it worked - I changed my mind.
<!--more-->
Ok, to be fair, this isn't a trick. It's working exactly as advertised. But I suppose I wasn't thinking about REST and its rules to the full extent. One of the basic features you get with ColdFusion's REST support is the ability to respond differently based on the type of connection as well as the type of desired response. That's an important detail there. So imagine this simple method in a REST-enabled CFC:

<script src="https://gist.github.com/3842589.js?file=gistfile1.cfm"></script>

The main logic of the method handles getting one piece of art work and returning it as a structure. In the method metadata I've defined that it responds to GET requests and looks for /X in the URL path. X must be a number and is used as the ID arguments.

On the client side, we can use this in jQuery to get a nice little JSON response back:

<script src="https://gist.github.com/3842597.js?file=gistfile1.js"></script>

This little event handler is fired when you click on the name of a piece of art. Note that we specify a JSON response in the jQuery code. This actually modifies the XHR request to let the server know we want JSON back. Our actual url (host/rest/artservice/11 as an example) doesn't change. Conversely, if we take that same URL and plop it into our browser, ColdFusion will default to displaying the data as XML. (And if I want, I can add ".json" to the URL to force JSON instead.)

So - all of this worked as I expected. As I said, cool, but, not sure how often I'd go this route over a 'regular' CFC. But then I thought of something. Given that URL, what happens when I do:

&lt;img src="host/rest/artservice/11"&gt;

Turns out - this also creates a GET request, but it tells the server it wants an image in response. You can then add a method to your REST CFC to handle this:

<script src="https://gist.github.com/3842614.js?file=gistfile1.cfm"></script>

Note the use of "produces" in the metadata. This is basically the method's way of saying, "Hey, if anybody comes here and says they want their data in an image format, I'm your guy!"

So to be clear - I can take the exact same URL and output JSON, XML, and even an image. That's pretty slick.