---
layout: post
title: "Converting a dynamic web site to a PhoneGap application"
date: "2012-05-05T13:05:00+06:00"
categories: [coldfusion,development,html5,javascript,jquery,mobile]
tags: []
banner_image: 
permalink: /2012/05/05/converting-a-dynamic-web-site-to-a-phonegap-application
guid: 4608
---

Earlier today a reader asked me about the possibility of converting his mobile-friendly site into a "real" application via PhoneGap. I told him that this <i>could</i> be very easy. You can take your HTML, upload it to the PhoneGap Builder service, and see what you get. This works with simple HTML sites, but is not going to work well with dynamic sites built with server-side languages. In this blog post, I'll explain why it won't work, and also walk you through an example of converting a (simple) dynamic web site into a PhoneGap application.

Before I begin - two quick notes. I'll be using jQuery Mobile for the UI and ColdFusion for the back-end. <b>This is completely inconsequential to the task at hand.</b> Ok, ready?

First, let's discuss why a dynamic web site can't be simply converted as is into a PhoneGap application. Most of my readers are web developers so you should know this, but when it comes to dynamic server-side languages like ColdFusion, PHP, Ruby, etc, the HTML your browser gets is created dynamically. 

Take for example this simple ColdFusion <a href="http://www.raymondcamden.com/demos/2012/may/5/v1/">site</a>. When you request this URL with your browser, my web server hands off the request to ColdFusion. ColdFusion does its magic (hits the database) and outputs raw HTML. That HTML is returned to the browser and rendered as is. The same would apply for PHP, Ruby, etc. When you click on the detail page, we hit <i>one</i> template that is passed a URL parameter that instructs the code to load a particular record and display it.

Now - consider PhoneGap. PhoneGap takes your HTML files and packages them up into a native application for your mobile platform. But it is <b>not</b> a web server. You can't bundle in ColdFusion or PHP and have it execute server-side code like in the example above. 

Does this mean you're completely out of luck? Not at all. Let's look at how we can convert our code into a PhoneGap application.

First, let's look at the initial application. As I said above, the choice of the server-side language isn't relevant to the discussion. Therefore, I won't go into detail about what the ColdFusion code is doing. Those of you who don't know ColdFusion should be able to mentally map it to the language of your choice. First - the index page.

<script src="https://gist.github.com/2603895.js?file=index.cfm"></script>

Then the detail page:

<script src="https://gist.github.com/2603902.js?file=detail.cfm"></script>

And finally - here is the component that drives the data. Basically it just wraps up the logic to get our list and detail.

<script src="https://gist.github.com/2603913.js?file=art.cfc"></script>

Ok - so that's our old school (although nicely mobile optimized) web site. To begin the conversion to PhoneGap, I create a new file for my home page that is pure HTML, no ColdFusion.

<script src="https://gist.github.com/2603927.js?file=index.html"></script>

Notice that the layout is the same as before, but our content is gone. Previously that was sourced on the server by a database call. So how do we add this dynamic data back in? With JavaScript.

First - let's add some logic to run when the home page is created. This specific event is based on how jQuery Mobile does things, but again, you could do this without any particular UI framework.

<script src="https://gist.github.com/2603940.js?file=gistfile1.js"></script>

This code block performs a HTTP request to our server. (Note: I'm using localhost in the example above but in a real application it would be your site's domain, something.com.)  I've built a new set of server-side code just to handle getting and returning data in JSON format. So there's still a server involved, but now it's simply returning data, nothing more. I loop over the result and render it out into the page.

The detail page is built much like the index page. It's a copy of the earlier version minus any code or actual content.

<script src="https://gist.github.com/2603957.js?file=detail.html"></script>

To handle this, back in my JavaScript I added code to run when the page is loaded.

<script src="https://gist.github.com/2603977.js?file=gistfile1.js"></script>

And that - as they say - is basically it. To summarize:

<ul>
<li>The code in the PhoneGap application is just HTML and JavaScript.
<li>The dynamic data from the earlier application was rewritten to expose itself remotely.
<li>PhoneGap then simply uses Ajax to fetch that data.
</ul>

I've attached a zip of all the code used for this blog post below. If any part of this doesn't make sense, let me know, and I hope this was helpful.<p><a href='https://static.raymondcamden.com/enclosures/conversion.zip'>Download attached file.</a></p>