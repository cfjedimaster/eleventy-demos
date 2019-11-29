---
layout: post
title: "Ask a Jedi: Caching \"constant\" structures?"
date: "2010-09-07T11:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/09/07/Ask-a-Jedi-Caching-constant-structures
guid: 3933
---

Adobe evangelist <a href="http://gregsramblings.com/">Greg Wilson</a> just asked me the following on IM and I thought it would be good to share with others. I also think it's something that folks may have strong opinions on so I'd like to see what kind of debate this can cause. Here is his question:

<blockquote>
I've got a CFC method that returns a static structure. Basically it creates the struct on the fly and returns it. The data in the structure is all hard coded - no dynamic portion at all. Does it make sense to cache that data?
</blockquote>
<!--more-->
<p>

Ok, so first, let me demonstrate what he is talking about. 

<p>

<code>
component {

	public struct function getCoolRankings() {
		s = {};
		s["low"] = "Raymond Camden";
		s["medium"] = "Ben Forta";
		s["high"] = "The Fonz";
		return s;
	}

}
</code>

<p>

In this component I've got one method, getCoolRankings. It returns a structure of labels and the person who most exemplifies the value of that label. Every time you call getCoolRankings, the structure will be recreated and returned to the caller. So the question is, would you get much benefit from caching this? Obviously the answer is yes, you would. But the savings would be so minimal that I don't think it is worth really worrying about. That being said, I did mention to Greg that I like to do things a bit differently. 

<p>

ColdFusion does not have a concept of a constant, a variable that once created cannot change. But even so, I like to think of such variables as Greg's structure as a constant. I'll then create them in the constructor area of the CFC like so.

<p>

<code>
component {

	variables.COOL_RANKINGS = {% raw %}{ low="Raymond Camden", medium="Ben Forta", high="The Fonz" }{% endraw %};
	
	public struct function getCoolRankings() {
		return variables.COOL_RANKINGS;
	}

}
</code>

<p>

As you can see, I've moved the structure into the constructor area of my CFC. I've also used an all caps name to help make it obvious that this is a special variable. Finally I modified my method to return the variable. This by itself won't cache the structure, but if the CFC itself is cached then the variable is only created once. 

<p>

Finally, I also mentioned to Greg that another option would be to define the keys/data within ColdSpring. This separates the static data into your ColdSpring XML and may make for a "cleaner" separation of your CFC and the static data. I've done that a few times in the past myself.