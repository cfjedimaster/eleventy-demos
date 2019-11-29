---
layout: post
title: "Changes to an existing ORM entity are automatically persisted."
date: "2009-12-28T14:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/12/28/Changes-to-an-existing-ORM-entity-are-automatically-persisted
guid: 3666
---

I'm tempted to say "See Title" and end the blog entry here, but that probably wouldn't be helpful. ;) So I ran into something unexpected today. After talking it over with <a href="http://www.briankotek.com/blog">Brian Kotek</a> it makes more sense to me, but what I'm about to explain certainly was behavior I did not expect. I was doing some testing with ORM entities today, specifically one with a One-To-Many relationship. During my testing I ran a few set operations but I never persisted my changes. In my mind I was simply testing methods and didn't really care to persist the change. 

However - I noticed that after I reloaded the page, the changes I made were being persisted. I had thought that to persist changes you <b>always</b> needed to use entitySave. However, that appears to not be the case. If you run setX on an entity, Hibernate assumes you mean to persist that change. 

It just feels wrong to me that this happens automatically. In my mental model, it's like opening a Word document. I may modify the title and print it, but I don't expect my changes to persist unless I explicitly click the Save button.

Brian shared with this <a href="http://help.adobe.com/en_US/ColdFusion/9.0/Developing/WS00180FBE-6DE0-43f0-84CB-DCE04A9FCCA4.html">URL</a> over at the help documentation. It talks a bit about ORM session management. Now I'm already aware of how Hibernate handles sessions. What I didn't expect was that an update to a persistent component would be automatically persisted. However, from the doc page I think it is quite clear from the second item (2. all entity updates) that this would indeed be the case.

In my example I was just writing a test script, but Brian pointed out that one place this tends to trip people up quite a bit is in edit handlers. You take in some form input, run your SETs, and then you may conditionally entitySave based on error checking. However, even without the entitySave there is a chance your changes will be persisted anyway. 

So... maybe I'm alone in this. <a href="http://www.bennadel.com/">Ben Nadel</a> mentioned to me that this behavior (save existing entities automatically) was what he expected. Did other people know this?