---
layout: post
title: "ColdFusion 10 REST and Self-Documentation"
date: "2012-12-06T09:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2012/12/06/ColdFusion-10-REST-and-SelfDocumentation
guid: 4802
---

Big thanks to <a href="http://henrylearnstorock.blogspot.com/">Henry Ho</a> for asking about this during my REST presentation earlier this week. Apparently, it is common for REST services to notice an OPTIONS request (by that I mean a request made with the HTTP verb OPTIONS) and return an XML-descriptor of the service. I don't believe our docs cover this, but the feature works quite well actually. Here's a few examples.
<!--more-->
Let's start with a very simple REST service:

<script src="https://gist.github.com/4224826.js?file=gistfile1.cfm"></script>

To get the descriptor, I wrote a quick test script:

<script src="https://gist.github.com/4224828.js?file=gistfile1.cfm"></script>

Which gives:

<img src="https://static.raymondcamden.com/images/screenshot43.png" />

How about a more complex service? This one demonstrates dynamic resources.

<script src="https://gist.github.com/4224850.js?file=gistfile1.cfm"></script>

In the result, which I've cropped a bit due to the size, you can see that the dynamic nature of the sub resources are documented well.

<img src="https://static.raymondcamden.com/images/screenshot44.png" />

And finally - here's an example of how "produces" is represented. Here's a snapshot of a larger REST service. This method is used to return an image of a product.

<script src="https://gist.github.com/4224885.js?file=gistfile1.cfm"></script>

And here is how it is returned:
<img src="https://static.raymondcamden.com/images/screenshot45.png" />