---
layout: post
title: "Testing Globalization Support in PhoneGap 2.2"
date: "2012-11-15T18:11:00+06:00"
categories: [javascript,jquery,mobile]
tags: []
banner_image: 
permalink: /2012/11/15/Testing-Globalization-Support-in-PhoneGap-22
guid: 4783
---

One of the more interesting new features in PhoneGap 2.2 iss the inclusion of a globalization plugin into the core of the SDK itself. This plugin has many features, but basically boils down to the ability to get the user's locale and language as well as being able to format numbers and dates. You can read the <a href="http://docs.phonegap.com/en/2.2.0/cordova_globalization_globalization.md.html#Globalization">full API docs</a> for a complete guide, but I thought it would be interesting to build a simple proof of concept application that tested out this feature.
<!--more-->
I began with a simple idea. I'd build an application that showed a table of product orders. There would be a column of dates, a column of order quantities, and an order of profit. This would give me a chance to demonstrate localization formatting of dates, numbers, and currencies. (Note that you can also do percentages as well. Again, check the docs!)

The HTML of my application was essentially just a div to support the injected report. Here is the JavaScript code that generates the report. I'm using fake data as opposed to doing an AJAX request.

<script src="https://gist.github.com/4082217.js?file=gistfile1.js"></script>

The result is pretty much as you would expect:

<img src="https://static.raymondcamden.com/images/iOS Simulator Screen shot Nov 15, 2012 3.48.18 PM.png" />

So - obviously the solution would be to make use of the API to format those columns. Unfortunately, here is where I ran into a snag. The API calls are all asynchronous. Ouch. Normally this isn't a big deal, I can handle callbacks, but we've got N*3 cells of data all of which must be fired off asynchronously. In order to create our display we have to wait for these to finish.

Luckily there is a solution for this. Unluckily, for me, it involves jQuery Deferreds. This is one of the most powerful features of jQuery and also the one that makes my brain bleed. 

The solution comes down to creating an array of deferred promises, essentially, an array of things that finish in an unknown time. This array can then be passed to the jQuery when() and then() operators which handles all of the chaining/waiting/collecting for me. Ready? Here's the updated coded.

<script src="https://gist.github.com/4082258.js?file=gistfile1.js"></script>

Taking this step by step, what I've done is this:

<ol>
<li>First, create the array that will store the promises.
<li>For each order, we create three deferred objects. One for the date. One for the quantity. And one for the price. Notice that the Globalization API supports a failure callback if it can't format the value. For this application I simply then default to the original value.
<li>I pass this to when(), and then use then() to begin working with my result.
<li>The arguments passed to then match the array of data I sent in. So the first 3 array elements relate to the first order. And so on. You can see the math I use in the fakeOrder loop to handle getting the right value from that array.
</ol>

So did it work? Hell yes. Here is the result on my iOS simulator:

<img src="https://static.raymondcamden.com/images/iOS Simulator Screen shot Nov 15, 2012 4.51.16 PM.png" />

How did I test other locales? I went into my iOS Simulator settings, went to General, then International. At first I changed the Language value. That was wrong. I then noticed Region Format. That's the one you want to tweak:

<img src="https://static.raymondcamden.com/images/iOS Simulator Screen shot Nov 15, 2012 4.50.46 PM.png" />

I set it to French/France, closed my application and reran it, and got...

<img src="https://static.raymondcamden.com/images/iOS Simulator Screen shot Nov 15, 2012 4.50.02 PM.png" />

Pretty sweet, right? Now my PhoneGap application will display data in a format that makes sense to my end users. For numbers and currencies this may not be a big deal, but for dates it can be huge.

So - obviously the asynchronous nature of the code may be a bit problematic. But it's not something you can't overcome. If I were building this for a client I'd build a JavaScript function that would handle this behind the scenes so they could do one call and a callback and be done with it. That would keep my getData() function much cleaner.

I've attached a zip of my code to this blog entry. Enjoy.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2012%{% endraw %}2Eraymondcamden{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fwww2%{% endraw %}2Ezip'>Download attached file.</a></p>