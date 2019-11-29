---
layout: post
title: "Adding \"Filter as you type\" support to IndexedDB"
date: "2012-05-14T15:05:00+06:00"
categories: [development,html5,javascript,jquery]
tags: []
banner_image: 
permalink: /2012/05/14/Adding-Filter-as-you-type-support-to-IndexedDB
guid: 4616
---

One truly disappointing aspect of IndexedDB is that there is no (simple) support for search across your data. It is very much based on the idea of knowing your keys and fetching data based on those keys. You can easily retrieve the "Ray" user object, but you can't search for user objects that have an age within a certain range and a skill property of so and so. That's not to imply you can't do some sorting and filtering though.

IndexedDB supports the idea of <a href="https://developer.mozilla.org/en/IndexedDB/Using_IndexedDB#Specifying_the_range_and_direction_of_cursors">key range objects</a>. As you can probably guess, these allow you return objects based on a range of values that match with a particular index. Remember that IndexedDB objects can have any number of properties, but you have to specify which are indexed. And now you know a good reason why - it gives you a chance to filter later on. 

Ranges can go in either direction and can be inclusive or exclusive. By that I mean, you can say "Anything object with a name 'above' and including Barry" or "Anything object with a name 'below' Zelda but not including that name."  You can also combine both and get a single object too. 

For my use-case, I wanted to use a range filter so that I could support 'filter as you type'. My data consists of notes that include a title, body, and created property. I'm not going to go through the steps of setting that up as my previous blog entries (linked at the bottom) went over most of the detail there. Instead, let's focus on how I built in the 'filter as you type' metaphor.

To begin with, I had a function that handled "get all" and displaying the data. It worked by opening a cursor and looping while data existed. Here's how that version looked:

<script src="https://gist.github.com/2696417.js?file=gistfile1.js"></script>

In order to support a bound range, you have to change how you open your object store (remember, think of this like a database table). When we just get everything, we run openCursor on the objectStore (line 18 above). When we want a bound list of data, we get an index first (this is the property we said we wanted to be able to filter on), create the range, and then open a cursor on that. So with a small amount of work, we can update our displayNotes function to take an optional filter. (Note that I also switched to a table display. The change in HTML isn't terribly important here so I won't cover it.)

<script src="https://gist.github.com/2696452.js?file=gistfile1.js"></script>

Focus on lines 31 to 40. You can see the different ways to open the cursor. Note specifically we do our binding based on an input string, like "ra" and append "z" to give an end to the range. So typing in "ra" means we want all notes with a title from "raa" to "raz". 

Outside of that - the code is identical. I moved the success portion into a new inner function (handleResult), but it works the same no matter how I get the cursor itself. 

You can demo this yourself by hitting the demo button below, but as before, this is Firefox only due to - what I believe - is a bad implementation in Chrome. (I think it could be made to work in Chrome, but as I'm building these examples to help me learn more about IndexedDB, I'm fine supporting the most compatible browser.)


<a href="http://raymondcamden.com/demos/2012/may/14/test6.html?"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a>

You can find the complete source by .... viewing source. ;)