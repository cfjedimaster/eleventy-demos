---
layout: post
title: "Searching for array elements in IndexedDB"
date: "2012-08-10T14:08:00+06:00"
categories: [html5,javascript]
tags: []
banner_image: 
permalink: /2012/08/10/Searching-for-array-elements-in-IndexedDB
guid: 4700
---

As I continue my research into <a href="http://www.w3.org/TR/IndexedDB/">IndexedDB</a>, today I decided to look into how you could perform a search for data based on an array property. Search is - to me - the most critical weak point of IndexedDB now. But "weak" doesn't imply powerless, and maybe I'm just not fully appreciating the power of IndexedDB yet. Today I was specifically curious about the following use-case:
<!--more-->
Imagine an object called Person. This object contains a number of properties, but for now, imagine it only contains a field called name and a field called tags. The name is - obviously - the name. Tags is an array of strings. Here are a few simple examples:

<script src="https://gist.github.com/3316222.js?file=gistfile1.txt"></script>

In the data above, we have three people defined. Note the array of tags assigned to each person. I wanted to know how I would search for a particular tag. So for example, how would I find the people with "beer" as a tag?

I began my test by writing my IndexedDB setup logic. (As a side note - I did <b>not</b> do the "hack" to make this code work in Chrome. The hack isn't terribly bad. I blogged about it <a href="http://www.raymondcamden.com/index.cfm/2012/6/12/Issues-with-IndexedDB-and-Chrome">here</a>. But since I didn't want to muddy up my code too much I focused on writing to the <a href="http://www.w3.org/TR/IndexedDB/">spec</a> and tested with Firefox.) Note that my objectstore has two indexes. One for name and one for tags.

<script src="https://gist.github.com/3316246.js?file=gistfile1.js"></script>

I then whipped up a simple form that would let me enter data, click a button, and have it added to my objectstore. The form is simple enough for me to skip showing the HTML, but here is how I handle the action in JavaScript.

<script src="https://gist.github.com/3316278.js?file=gistfile1.js"></script>

The only thing I'll call out there is the split call on the tags value. This lets me enter lists in the form field ("a,b") and have it converted to an array for storage. For my testing I made 3 people. One with tag A, one with tags A and B, and one with tag C.

Finally - I wrote a super quick 'dump' utility that would write out the data to a div. This was made to write everything out and give me something to compare against when I did my searches.

<script src="https://gist.github.com/3316286.js?file=gistfile1.js"></script>

Ok - so at this point I had a form to let me enter data and a button I could click to quickly list out what data existed in the objectstore. Now I needed to search.

I added a simple text field and button to my page that would let me enter a tag and run a function. Getting data from an IndexedDB objectstore can be done in two basic ways. You either ask for data based on a particular value (people where name = ray) or ask for a range of data (people where the name begins with A and higher). Both can return one or many results. I began with a simple 'get' type operation:

<script src="https://gist.github.com/3316474.js?file=gistfile1.js"></script>

For the most part this should make sense (if you know anything about IndexedDB or have been reading my earlier entries). The core sticking point is line 9. You can see I pass the string to the get call. This "felt" wrong to me since the value of tag is an array. I tried it anyway. As I expected, it failed. 

I then modified the code to pass an array to the get API:

<script src="https://gist.github.com/3316530.js?file=gistfile1.js"></script>

And voila - it worked... <i>kinda</i>. If I searched for A, it would work for a person that only had A as a tag. It would not match a person with A and B as tags. In fact, I couldn't even search for B. But C <i>did</i> work. So it seemed as if I couldn't find a match in the second element or match against a person that had more than one item at all. If you want to see this for yourself, point your Firefox browser at <a href="http://www.raymondcamden.com/demos/2012/aug/10/test4.html">http://www.raymondcamden.com/demos/2012/aug/10/test4.html</a>.

So at this point I paused and did something crazy... reread the spec a bit. Specifically the <a href="http://www.w3.org/TR/IndexedDB/#widl-IDBObjectStore-createIndex-IDBIndex-DOMString-name-any-keyPath-IDBIndexParameters-optionalParameters">portion</a> pertaining to creating indexes. Turns out there is an option that is specifically there for arrays. Specifically this clause is what helped me figure something out:

<blockquote>
An index also contains a multiEntry flag. This flag affects how the index behaves when the result of evaluating the index's key path yields an Array. If the multiEntry flag is false, then a single record whose key is an Array is added to the index. If the multiEntry flag is true, then the one record is added to the index for each item in the Array. The key for each record is the value of respective item in the Array.
</blockquote>

Ahah! I updated my index creation code to enable this option:

objectStore.createIndex("tags","tags", {% raw %}{unique:false,multiEntry:true}{% endraw %});	

I then did more testing. The change above was not quite enough by itself. Now that I knew the index was being stored by item, I removed the code that split my input into an array. Basically I went back to this:

<script src="https://gist.github.com/3316668.js?file=gistfile1.js"></script>

And this got me back to where I was before. A matched a person with an A tag but not anyone with A as one of many tags. I felt like I was on the right track though so I took another tack. What if I did a range search? One of the options for a range search is to match only against one thing - which sounds a bit confusing. But I figured what the hell. In the code below I've switched to a range and used the only operator:

<script src="https://gist.github.com/3316727.js?file=gistfile1.js"></script>

And that worked. I mean, <i>of course</i> it worked. It allowed me to search for A and find both results. It also allowed me to search for B and find the person who had it as a second tag. 

I'm not 100% sure I get why the range search was required, but it doesn't feel too entirely wonky to me. For those of you without a modern Firefox, here's a quick screen capture of the display:

<img src="https://static.raymondcamden.com/images/ScreenClip109.png" />

And for those of you want to test, hit the demo button below and enjoy. I apologize if this blog post is a bit confusing. Please feel free to ask any questions, or correct any mistakes. 

<a href="http://www.raymondcamden.com/demos/2012/aug/10/test2.html"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a>