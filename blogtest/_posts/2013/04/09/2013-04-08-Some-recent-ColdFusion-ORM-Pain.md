---
layout: post
title: "Some recent ColdFusion ORM Pain"
date: "2013-04-09T10:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2013/04/09/Some-recent-ColdFusion-ORM-Pain
guid: 4906
---

I'm working on a relatively simple ColdFusion ORM application. It is focused around a core entity type called Content. This entity type is rather large, around 50 or so properties. As you can imagine, some of the properties are simple, some are many-to-one, and some are many-to-many. I ran into some <b>very</b> frustrating issues though and I thought I'd share them.
<!--more-->
<h2>Invoke</h2>

The first issue I ran into was a bit of code I used to set a set of simple values. I've got a bunch of values that don't (really) need any validation and can simply be copied from a structure directly into the entity. So I created a simple list and iterated over it to set my values.

<script src="https://gist.github.com/cfjedimaster/5345927.js"></script>

Simple, right? But note the use of invoke. This is a ColdFusion 10 addition that lets you call dynamic methods in CFCs. I noticed that none of my data was actually persisting. Why?

Turns out - in order for my calls to setX (where X is a entity method) to work, I have to pass the value as a structure. Here is the modification:

<script src="https://gist.github.com/cfjedimaster/5345944.js"></script>

Why? I've got no freaking clue. To be fair, the docs show passing a structure of arguments, but they don't explicitly state that you must do this. Even worse, an error was never thrown when I passed the argument as a simple value instead. I <b>hate</b> errors that are ignored. 

<h2>Error Reporting</h2>

The second issue was much, much worse. Not that it was difficult to fix once I knew what the issue was, but the problem was in <i>how</i> the issue was reported.

As I mentioned above, my entity has simple properties, many-to-one properties, and a many-to-many. I began by coding in the simple properties (using the technique I described above). I then did my many-to-one. I then did the many-to-many.

I noticed that my join table was not populating. I didn't get an error though. What makes this more frustrating was that I could dump my entity before the save operation and clearly see my related data in the entity. Yet I'd run the save, it would insert a new record into the core table, and just... do nothing else. Again - no damn error. Anywhere.

So I backed up a bit. First I decided - let's turn off the auto flush feature and use transactions. I didn't think that would help per se, I just decided to give it a try. All of a sudden I got something - an error:

coldfusion.orm.PersistentTemplateProxy cannot be cast to java.util.Collection

Ok... so.... first off. Why would ColdFusion persist the entity, have a problem, and just not report it until I started handling the flush myself with a transaction? I can't imagine any reason why that would make sense. 

Here's where things got even more interesting. I commented out the code handling the many-to-many and I <b>still</b> got the error!

On a whim, I decided to comment out the code handling 3 of my many-to-one properties. All of a sudden, that fixed the issue. I then uncommented out the many-to-many and it still worked fine (and persisted data to the join table). So obviously my issue was in the many-to-one blocks. 

When you work with relationships, you're supposed to ensure you set both sides of a relationship. You can sometimes get by without, but you really shouldn't. In order to make this simpler, you can simply use some custom code in the core entity and have it do both sides of the relationship. So for example, here is one of those methods:

<script src="https://gist.github.com/cfjedimaster/5346001.js"></script>

Simple, right? In my content entity I call setSegment. The method handles the logic of translating an ID to an entity, setting it, and doing the reverse side. But something in here was wrong.

At no time, though, was I told what was wrong. Outside of the error message I pasted above, I was lost. 

Finally I started commenting the lines in that method and got it down to this:

segment.setContent(this);

And then it hit me. On the content side, it has one segment. On the segment side, it has many content entities. 

So right away I've learned that the built-in methods are apparently not validating for the cases when an array is required. 

Ugh.