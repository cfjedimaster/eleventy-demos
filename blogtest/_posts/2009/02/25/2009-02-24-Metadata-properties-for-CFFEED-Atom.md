---
layout: post
title: "Metadata properties for CFFEED - Atom"
date: "2009-02-25T09:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/02/25/Metadata-properties-for-CFFEED-Atom
guid: 3251
---

Many, many moons ago (August 07 to be precise), I wrote a blog entry on <a href="http://www.raymondcamden.com/index.cfm/2007/8/22/Metadata-properties-for-CFFEED">metadata properties</a> for created feeds when using the CFFEED tag. I mentioned how the docs only cover a few of the possible items and mentioned <i>nothing</i> about metadata for Atom feeds. I said I'd follow up with an Atom example never got around to it. A reader graciously reminded me of this so I took a look earlier this week. Here is what I found.
<!--more-->
First, I want to thank Ben Garret for sharing some links to the Atom specs. That is what I used for my testing and it was a great help. Specifically, this link inside the Atom spec focused on the elements that cover an Atom feed as a whole: <a href="http://www.atomenabled.org//developers/syndication/atom-format-spec.php#atom.documents">http://www.atomenabled.org//developers/syndication/atom-format-spec.php#atom.documents</a>

Specifically, here are the items supported:

<blockquote>
atomFeed =<br>
   element atom:feed {<br>
      atomCommonAttributes,<br>
      (atomAuthor*<br>
       & atomCategory*<br>
       & atomContributor*<br>
       & atomGenerator?<br>
       & atomIcon?<br>
       & atomId<br>
       & atomLink*<br>
       & atomLogo?<br>
       & atomRights?<br>
       & atomSubtitle?<br>
       & atomTitle<br>
       & atomUpdated<br>
       & extensionElement*),<br>
      atomEntry*<br>
   }<br>
</blockquote>

For each item, a * at the end signifies 1 or multiple values are allowed. This is important because ColdFusion's CFFEED tag will require you to use an array. Read the docs for a full explanation on the rest, but in general, it is a mix of 'must have' and 'must have, but just one.' In my testing, nothing at all was required. I was able to use a metadata struct of just:

<code>
&lt;cfset p = {}&gt;
&lt;cfset p.version = "atom_1.0"&gt;
</code>

Obviously this isn't very descriptive, so I went down the list picking and choose various items to pick. Many of the items use what is called an <a href="http://www.atomenabled.org//developers/syndication/atom-format-spec.php#text.constructs">atomTextConstruct</a>. Take the feed title value. Because it is an atomTextConstruct, it requires a simple structure to work for cffeed:

<code>
&lt;cfset p.title = {}&gt;
&lt;cfset p.title.type = "text"&gt;
&lt;cfset p.title.value = "Atom Title"&gt;
</code>

The type can be text, html, or xhtml. Text seemed to be the simplest so it's what I went with. Looking at the spec then you can see that subtitle is of the same type, so I can also do:

<code>
&lt;cfset p.subtitle = {}&gt;
&lt;cfset p.subtitle.type = "text"&gt;
&lt;cfset p.subtitle.value = "My Sub Title"&gt;
</code>

I then played with categories. Again, I read the spec for that <a href="http://www.atomenabled.org//developers/syndication/atom-format-spec.php#element.category">item</a> and saw that it contained keys for term, scheme and label. I also knew the feed could have multiple categories, so I went with an array of structs:

<code>
&lt;cfset p.category = []&gt;
&lt;cfset p.category[1] = {}&gt;
&lt;cfset p.category[1].term = "Fun Stuff"&gt;
&lt;cfset p.category[2] = {}&gt;
&lt;cfset p.category[2].term = "Boring Stuff"&gt;
</code>

Both author and contributor shared a spec type of atomPersonConstruct, so once I figured how that worked, it was also pretty trivial:

<code>
&lt;cfset p.author = []&gt;
&lt;cfset p.author[1] = {}&gt;
&lt;cfset p.author[1].name = "Bill Gates"&gt;
&lt;cfset p.author[1].uri = "http://www.microsoft.com"&gt;
&lt;cfset p.author[1].email = "billg@microsoft.com"&gt;

&lt;cfset p.contributor = []&gt;
&lt;cfset p.contributor[1] = {}&gt;
&lt;cfset p.contributor[1].name = "Raymond Camden"&gt;
&lt;cfset p.contributor[1].uri = "http://www.coldfusionjedi.com"&gt;
&lt;cfset p.contributor[1].email = "ray@camdenfamily.com"&gt;
</code>

That's really it I guess. I played around with other items and had luck with some - but not others. The updated value worked fine:

<code>
&lt;cfset p.updated = now()&gt;
</code>

I had been worried that it wouldn't use the right time format for Atom, but cffeed took care of it. You could add other items such as rights, id, logo, by just chercking the spec as I did.

Anyway, hope this helps. Personally I think Atom is a bit too verbose to work with. I'd rather just stick with RSS 2 feeds.