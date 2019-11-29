---
layout: post
title: "Quick Example - Locking in ColdFusion 9"
date: "2009-09-25T14:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/09/25/Quick-Example-Locking-in-ColdFusion-9
guid: 3543
---

A reader just added a comment to a blog entry I had completely forgotten about I had written: <a href="https://www.raymondcamden.com/2005/08/12/Ask-a-Jedi-CFLOCK-in-CFSCRIPT">Ask a Jedi: CFLOCK in CFSCRIPT</a>. The blog entry details two UDFs I wrote so I could both read and write in a locked fashion via cfscript. I thought I'd quickly show an example of how you can lock now in ColdFusion 9. I had to do this for the first time in Picard a few days ago.

<!--more-->

I have a service CFC which wraps a save operation for Foo entities. I have two columns, aaa and bbb (sorry for the dumb names, but under heavy NDA here) that must be unique across the database. I wanted my logic then to simply say: Get a Foo with the same AAA, and if it isn't the same object, it's an error. Ditto for BBB. For this to work though it has to be single threaded. Here is the code I came up with, and notice how the lock wraps it:

```js
public function saveFoo(foo) {
	//Ensure we lock so we can check for dupes 
	lock name=variables.lockname type="exclusive" timeout="30" {

		//Alrighty, first check for a dupe AAA
		var dupe = entityLoad("foo", {% raw %}{aaa=foo.getAAA()}{% endraw %}, true);
		if(!isnull(dupe) && dupe.getId() != arguments.foo.getId()) throw "A foo with this AAA already exists.";
			
		//Check for a dupe BBB
		var dupe = entityLoad("foo", {% raw %}{bbb=foo.getBBB()}{% endraw %}, true);
		if(!isnull(dupe) && dupe.getId() != arguments.foo.getId()) throw "A foo with this BBB already exists.";
			
		//Ok save this puppy
		entitySave(foo);
		return foo;
	}
}
```

I'm not a big fan of the syntax (and the CFML Advisory committee has agreed on a nicer syntax), but it's good enough for now. FYI, `variables.lockname` is global to my CFC and used across the component.