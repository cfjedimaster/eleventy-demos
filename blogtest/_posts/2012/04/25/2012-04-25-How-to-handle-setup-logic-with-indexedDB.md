---
layout: post
title: "How to handle setup logic with IndexedDB"
date: "2012-04-25T18:04:00+06:00"
categories: [html5,javascript]
tags: []
banner_image: 
permalink: /2012/04/25/How-to-handle-setup-logic-with-indexedDB
guid: 4597
---

So - as much as I'd like to pretend I don't have to, I'm beginning to wrap my head around the joy that is <a href="http://www.w3.org/TR/IndexedDB/">IndexedDB</a>. WebSQL, which is pretty easy to understand if you've done SQL, is unfortunately deprecated and the future is IndexedDB. I like NoSQL/ObjectStore solutions in general. But the implementation of them in the browser is pretty confusing to me. (Quick note - if you've <i>never</i> seen IndexedDB, check out the links at the bottom.)  One of the most confusing aspects I've run into so far is the basic idea of dynamically creating an object store. In a WebSQL solution, it is pretty simple. You execute SQL that runs CREATE TABLE IF NOT EXISTS. On the first execution it creates a table. On any other execution it doesn't do anything. (Ok, technically it takes a tiny amount of time to execute, but the end result is no action.) Under IndexedDB this process is a bit weirder. Why?

<blockquote>
You can only add an object store (think of this as a table) when the version changes. 

Ok - no big deal.

But you can only see if an object store exists <i>after</i> you open it. Chicken - meet Egg. So what to do?
</blockquote>

From what I can tell - the best way to handle this is to make use of the onupgradeneeded function and a static version number that represents your current version. So for example, when I build my killer Web 3.0 application, I begin by knowing I need an object store for notes. So I open my database with a version of 2 (1 being the initial version) and use my event handler to create the store. But note I can check inside there too. Why I do that will make sense in a second.

<script src="https://gist.github.com/2493787.js?file=gistfile1.js"></script>

Now - let's say later on I need to add a new table, booger. I need to increment the version manually and add another small block of code.

<script src="https://gist.github.com/2493808.js?file=gistfile1.js"></script>

And that's it. Anything wrong this setup? Obviously this is focused on <i>structure</i> and not seeding the data, but I think you get idea.

I <b>strongly</b> recommend the following resources if you are learning IndexedDB:

<ul>
<li><a href="https://developer.mozilla.org/en/IndexedDB/Basic_Concepts_Behind_IndexedDB">Basic Concepts Behind IndexedDB</a></li>
<li><a href="https://developer.mozilla.org/en/IndexedDB/Using_IndexedDB">Using IndexedDB</a></li>
</ul>