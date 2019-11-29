---
layout: post
title: "CFImage and paths with spaces"
date: "2013-01-09T09:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2013/01/09/CFImage-and-paths-with-spaces
guid: 4825
---

A reader ran into an interesting issue:

<blockquote>
I was working with CFIMAGE tag. Lets say<br/><br/>

&lt;cfset VARIABLES.myImage="http://somesite.com/imageFolder/image.jpg"&gt;<br/>
 &lt;cfimage source="#VARIABLES.myImage#" name="VARIABLES.isLargeImage"&gt;<br/><br/>

This works perfect, but when I have space in my image path like
&lt;cfset VARIABLES.myImage="http://somesite.com/image Folder/image.jpg"&gt;
It throws error. My path comes dynamically from DB in actual code.
I also tried urlEncodedFormat on my path but that did not worked too.
I think CF running on window server should be able enough to resolve paths which have spaces in its folder/file names.
</blockquote>
<!--more-->
To show you an example of what he said, I dropped an image with a space in it into a folder and then tried to cfimage it as he did:

<script src="https://gist.github.com/4493627.js"></script>

When run, you get an error:

<img src="https://static.raymondcamden.com/images/screenshot50.png" />

Interestingly enough, the browser has no issue with this. I've noticed this for years now - browsers (well at least Chrome) simply automatically escape the spaces for you.

If you try to fix it with URLEncodedFormat, it still fails. It is rather easy to see why if you output the result of the URL:

http{% raw %}%3A%{% endraw %}2F{% raw %}%2F127%{% endraw %}2E0{% raw %}%2E0%{% endraw %}2E1{% raw %}%2Ftestingzone%{% endraw %}2Fcats{% raw %}%20star%{% endraw %}20wars%2Ejpg

So to fix it, we need to urlEncode the file name. To do this we need to break apart the URL. There are <b>multiple</b> ways of doing this, but for simplicity sake, I used the <a href="http://www.cflib.org/udf/parseUrl">parseURL</a> UDF from CFLib.org. It uses string functions to break apart a URL into its components. As an example, this code...

<script src="https://gist.github.com/4493679.js"></script>

Returns these values:

<img src="https://static.raymondcamden.com/images/screenshot51.png" />

Based on what I saw here, I thought this might be a nice way to rebuild the URL. I would not call this code 100% safe as it wouldn't pick up the username and password if they existed, but I wanted something simple.

<script src="https://gist.github.com/4493697.js"></script>

And the result...

<img src="https://static.raymondcamden.com/images/screenshot52.png" />

I hope this is helpful!