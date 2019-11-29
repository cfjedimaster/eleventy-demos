---
layout: post
title: "cfdump ER you may want to vote for"
date: "2011-02-14T23:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/02/14/cfdump-ER-you-may-want-to-vote-for
guid: 4122
---

This has been bugging me for a while but I finally got around to logging a bug for it. If you agree with the following, please vote for it <a href="http://cfbugs.adobe.com/cfbugreport/flexbugui/cfbugtracker/main.html#bugId=86367">here</a>. (And note - I accidentally filed it as a bug. To be clear, this is an ER, not a bug.) When dumping an entity, if my entity contains child entities, the dump can end up being huge. So for example, consider a Group entity that has a Members property. That could contain 200 members. If I dump the Group most likely I'll end up getting a timeout error. That really isn't a bug per se it's just ColdFusion trying to output a ginormous amount of HTML. cfdump does provide a TOP attribute, but that tends to be too restrictive. If I had a list of Groups perhaps and I didn't like how the Members were too big, using top=2 for example would restrict both the list of members but also the list of Groups. 

What I thought may make sense (and what ER 86367 tries to describe), is the ability to suppress display of child entities. Given you are dumping parent object X, I'd like to tell the tag that any <i>children</i> of X that are entities should be suppressed. Ideally their class name only should be printed.

What do you think? Writing it out it seems kind of dumb. But I feel like I run into this <i>every day</i> almost when working with ORM.