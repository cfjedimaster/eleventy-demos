---
layout: post
title: "Working with RARs in ColdFusion - Why I did it..."
date: "2011-04-14T18:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/04/14/Working-with-RARs-in-ColdFusion-Why-I-did-it
guid: 4196
---

A few months ago I wrote a <a href="http://www.raymondcamden.com/index.cfm/2011/2/21/Working-with-RARs-in-ColdFusion">blog post</a> about working with RAR files in ColdFusion. The short story is that RAR, a file archive format, is not supported by cfzip. Surprisingly there doesn't seem to be in Java packages out there that provide full integration with the format. I ended up writing a wrapper around the free 7-Zip command line program. I mentioned this in passing but the real reason I wanted to build this was to do something with the CBR files (Comic Book files) I had on my hard drive. I thought  it would be interesting to write code to extract the cover image from the files. You could imagine many uses for this. Perhaps simply creating a nice HTML page of covers would be neat. Whatever. To be honest, it's kind of pointless - but that hasn't stopped me before so why now. Here is what I built.
<!--more-->
<p>

I began by creating a list of comics from my hard drive. I assumed I was going to have multiple screw ups as I worked on my code so I also added basic caching in.

<p>

<code>
&lt;cfset dir = "H:\comics"&gt;
&lt;cfset comics = cacheGet("comics")&gt;
&lt;cfif isNull(comics)&gt;
	&lt;cfoutput&gt;
		&lt;p&gt;Getting initial list...&lt;/p&gt;
	&lt;/cfoutput&gt;
	&lt;cfset comics = directoryList(dir,true,"list","*.cbr")&gt;
	&lt;cfset cachePut("comics", comics,createTimeSpan(0,0,10,0))&gt;
&lt;/cfif&gt;

&lt;!--- make a copy since arraydelat will change copy ---&gt;
&lt;cfset comics = duplicate(comics)&gt;
</code>

<p>

That last bit of code there just handles breaking the reference to the cache since I end up manipulating the results a bit. Ok - now a quick output:

<p>

<code>
&lt;cfoutput&gt;
&lt;p&gt;There are #arrayLen(comics)# total comics.&lt;/p&gt;
&lt;/cfoutput&gt;
</code>

<p>

I then decided to grab 100 comics from the set:

<p>

<code>
&lt;!--- Given our list, pick a set ---&gt;
&lt;cfset chosen = []&gt;
&lt;cfset total = min(100, arrayLen(comics))&gt;
&lt;cfloop condition="arrayLen(chosen) lt total"&gt;
	&lt;cfset target = randRange(1, arrayLen(comics))&gt;
	&lt;!--- I had a few ._ files ---&gt;
	&lt;cfif not find("\._",comics[target])&gt;
		&lt;cfset arrayAppend(chosen, comics[target])&gt;
		&lt;cfset arrayDeleteAt(comics, target)&gt;
	&lt;/cfif&gt;
&lt;/cfloop&gt;
</code>

<p>

And just to be sure - output that size as well:

<p>

<code>
&lt;cfoutput&gt;
&lt;p&gt;Ok, we have #arrayLen(chosen)# comics.&lt;/p&gt;
&lt;/cfoutput&gt;
</code>

<p>

Next - I set up a temporary directory. Remember that I'm going to be shelling out to an executable. This means I won't be able to use RAM drives:

<p>

<code>
&lt;!--- make a temp dir  ---&gt;
&lt;cfset tmpDir = expandPath("./comics")&gt;
&lt;cfif not directoryExists(tmpDir)&gt;
	&lt;cfdirectory action="create" directory="#tmpDir#"&gt;
&lt;/cfif&gt;
</code>

<p>

Ok - now let's make our CFC:

<p>

<code>
&lt;!--- initialize our CFC ---&gt;
&lt;cfset sevenZipexe = "C:\Program Files\7-Zip\7z.exe"&gt;
&lt;cfset sevenzipcfc = new sevenzip(sevenzipexe)&gt;
</code>

<p>

Now we are going to loop through our comics and try to get the cover. In general, the first item in a list of files from a CBR RAR file is either an image, or a directory. So my code handles that and looks in the second item if the first is a directory:

<p>

<code>

&lt;!--- now get our covers ---&gt;
&lt;cfloop index="c" array="#chosen#"&gt;
	&lt;cftry&gt;
		&lt;cfset files = sevenzipcfc.list(c)&gt;
		&lt;!--- first item may be a directory - for now we see if size is 0, and if 0, skip to the next ---&gt;
		&lt;cfif files.size[1] neq 0 and listLast(files.name[1],".") is "jpg"&gt;
			&lt;cfset sevenzipcfc.extract(c,files.name[1],tmpdir)&gt;
			&lt;cfoutput&gt;Just extracted #files.name[1]# from #c#&lt;br/&gt;&lt;/cfoutput&gt;
		&lt;cfelseif files.recordCount gte 2 and files.size[2] neq 0 and listLast(files.name[2],".") is "jpg"&gt;
			&lt;cfset sevenzipcfc.extract(c,files.name[2],tmpdir)&gt;
			&lt;cfoutput&gt;Just extracted #files.name[2]# from #c#&lt;br/&gt;&lt;/cfoutput&gt;
		&lt;/cfif&gt;
		&lt;cfcatch&gt;
			&lt;cfoutput&gt;&lt;b&gt;Error: #cfcatch.message#&lt;/b&gt;&lt;br/&gt;&lt;/cfoutput&gt;
		&lt;/cfcatch&gt;
	&lt;/cftry&gt;
&lt;/cfloop&gt;
</code>

<p>

At this point I had a bunch of images! It worked. Then I thought - let's do something neat with the images...

<p>

<code>

&lt;cfset images = directoryList(tmpdir)&gt;
&lt;cfset canvas = imageNew("", 1500, 1145)&gt;
&lt;cfset processed = 0&gt;
&lt;cfset i = 1&gt;
&lt;cfset x = 0&gt;
&lt;cfset y = 0&gt;
&lt;cfloop condition="processed lt 50"&gt;
	&lt;cfif isImageFile(images[i])&gt;
		&lt;cfset myimg = imageRead(images[i])&gt;
		&lt;cfset imageResize(myimg,150,229)&gt;
		&lt;!--- Position is based on the index ---&gt;
		&lt;cfset imagePaste(canvas, myimg, x, y)&gt;
		&lt;cfset processed++&gt;
		&lt;cfset x+= 150&gt;
		&lt;cfif x is 1500&gt;
			&lt;cfset x = 0&gt;
			&lt;cfset y+= 229&gt;
		&lt;/cfif&gt;		
	&lt;/cfif&gt;
	&lt;cfset i++&gt;
&lt;/cfloop&gt;
</code>

<p>

Basically - read in a list of images, process line by line and resize each one. I then paste it into a large canvas moving from left to right. And finally...

<p>

<code>
&lt;cfset imageWrite(canvas, "c:\Users\Raymond\Desktop\finalcover.jpg")&gt;
</code>

<p>

So the result? Click to make it bigger...

<p>

<a href="http://www.coldfusionjedi.com/images/finalcover.jpg"><img src="https://static.raymondcamden.com/images/cfjedi/finalcoversmall.jpg" title="Cover Cover Cover" /></a>

<p>

Not perfect - but kind of cool I think. Here is the entire template. Please note I wrote this rather quickly. It's not meant to be production ready.

<p>

<code>
&lt;cfset dir = "H:\comics"&gt;
&lt;cfset comics = cacheGet("comics")&gt;
&lt;cfif isNull(comics) or 0&gt;
	&lt;cfoutput&gt;
		&lt;p&gt;Getting initial list...&lt;/p&gt;
	&lt;/cfoutput&gt;
	&lt;cfset comics = directoryList(dir,true,"list","*.cbr")&gt;
	&lt;cfset cachePut("comics", comics,createTimeSpan(0,0,10,0))&gt;
&lt;/cfif&gt;

&lt;!--- make a copy since arraydelat will change copy ---&gt;
&lt;cfset comics = duplicate(comics)&gt;

&lt;cfoutput&gt;
&lt;p&gt;There are #arrayLen(comics)# total comics.&lt;/p&gt;
&lt;/cfoutput&gt;

&lt;!--- Given our list, pick a set ---&gt;
&lt;cfset chosen = []&gt;
&lt;cfset total = min(100, arrayLen(comics))&gt;
&lt;cfloop condition="arrayLen(chosen) lt total"&gt;
	&lt;cfset target = randRange(1, arrayLen(comics))&gt;
	&lt;!--- I had a few ._ files ---&gt;
	&lt;cfif not find("\._",comics[target])&gt;
		&lt;cfset arrayAppend(chosen, comics[target])&gt;
		&lt;cfset arrayDeleteAt(comics, target)&gt;
	&lt;/cfif&gt;
&lt;/cfloop&gt;

&lt;cfoutput&gt;
&lt;p&gt;Ok, we have #arrayLen(chosen)# comics.&lt;/p&gt;
&lt;/cfoutput&gt;

&lt;!--- make a temp dir  ---&gt;
&lt;cfset tmpDir = expandPath("./comics")&gt;
&lt;cfif not directoryExists(tmpDir)&gt;
	&lt;cfdirectory action="create" directory="#tmpDir#"&gt;
&lt;/cfif&gt;

&lt;!--- initialize our CFC ---&gt;
&lt;cfset sevenZipexe = "C:\Program Files\7-Zip\7z.exe"&gt;
&lt;cfset sevenzipcfc = new sevenzip(sevenzipexe)&gt;

&lt;!--- now get our covers ---&gt;
&lt;cfloop index="c" array="#chosen#"&gt;
	&lt;cftry&gt;
		&lt;cfset files = sevenzipcfc.list(c)&gt;
		&lt;!--- first item may be a directory - for now we see if size is 0, and if 0, skip to the next ---&gt;
		&lt;cfif files.size[1] neq 0 and listLast(files.name[1],".") is "jpg"&gt;
			&lt;cfset sevenzipcfc.extract(c,files.name[1],tmpdir)&gt;
			&lt;cfoutput&gt;Just extracted #files.name[1]# from #c#&lt;br/&gt;&lt;/cfoutput&gt;
		&lt;cfelseif files.recordCount gte 2 and files.size[2] neq 0 and listLast(files.name[2],".") is "jpg"&gt;
			&lt;cfset sevenzipcfc.extract(c,files.name[2],tmpdir)&gt;
			&lt;cfoutput&gt;Just extracted #files.name[2]# from #c#&lt;br/&gt;&lt;/cfoutput&gt;
		&lt;/cfif&gt;
		&lt;cfcatch&gt;
			&lt;cfoutput&gt;&lt;b&gt;Error: #cfcatch.message#&lt;/b&gt;&lt;br/&gt;&lt;/cfoutput&gt;
		&lt;/cfcatch&gt;
	&lt;/cftry&gt;
&lt;/cfloop&gt;

&lt;cfset images = directoryList(tmpdir)&gt;
&lt;cfset canvas = imageNew("", 1500, 1145)&gt;
&lt;cfset processed = 0&gt;
&lt;cfset i = 1&gt;
&lt;cfset x = 0&gt;
&lt;cfset y = 0&gt;
&lt;cfloop condition="processed lt 50"&gt;
	&lt;cfif isImageFile(images[i])&gt;
		&lt;cfset myimg = imageRead(images[i])&gt;
		&lt;cfset imageResize(myimg,150,229)&gt;
		&lt;!--- Position is based on the index ---&gt;
		&lt;cfset imagePaste(canvas, myimg, x, y)&gt;
		&lt;cfset processed++&gt;
		&lt;cfset x+= 150&gt;
		&lt;cfif x is 1500&gt;
			&lt;cfset x = 0&gt;
			&lt;cfset y+= 229&gt;
		&lt;/cfif&gt;		
	&lt;/cfif&gt;
	&lt;cfset i++&gt;
&lt;/cfloop&gt;

&lt;cfset imageWrite(canvas, "c:\Users\Raymond\Desktop\finalcover.jpg")&gt;
</code>