---
layout: post
title: "This is not the function you are looking for"
date: "2014-04-08T09:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2014/04/08/This-is-not-the-function-you-are-looking-for
guid: 5194
---

<p>
Yesterday I was doing some editing on the CFML Reference wiki when I ran across a function that is - as far as I know - one of the most misused functions in ColdFusion. What function is that? <a href="https://wikidocs.adobe.com/wiki/display/coldfusionen/ListContains">listContains</a>.
</p>
<!--more-->
<p>
<img src="https://static.raymondcamden.com/images/5ad1x.jpg" />
</p>

<p>
To be clear, listContains is not buggy. It works 100% as advertised. But in the 15 or so years I've used ColdFusion I have not seen one person use it the right way. Simply put, listContains searches a list for <strong>partial</strong> matches. So for example, given a list of: ray,scott,dave,adam,data. You want to see if the list of names includes ada. If you use listContains then you will get a <strong>false positive</strong> match on adam. Maybe you do want that. It can happen. But again, <strong>I've never seen someone using listContains that really wanted this</strong>.
</p>

<p>
So folks, please keep this in mind. What we really need is a good ColdFusion Linter to flag stuff like this.
</p>

<p>
p.s. Thank you to Brad Wood for the image!
</p>