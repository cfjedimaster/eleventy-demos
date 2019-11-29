---
layout: post
title: "Reading MP3 ID3 tags with ColdFusion"
date: "2006-06-13T07:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/06/13/Reading-MP3-ID3-tags-with-ColdFusion
guid: 1328
---

You may have heard of a file format called MP3. It is an audio format that is small and compact and easy to share. If you don't have any MP3s, you can contact that RIAA. They seem to be pretty good at finding them. If you do have a few MP3s, you may know that some programs, like iTunes, will show you information about the MP3, like song title, artist, duration, etc. This information is stored in the MP3 file itself and is called ID3. ID3 is a format to embed information in the MP3 file itself. (For more information, see the <a href="http://www.id3.org/intro.html">site</a>.) Since I have a few MP3s on my hard drive, I decided to see how hard it would be to get ColdFusion to read and parse these tags. It's been done before. Christian Cantrell released code on one of the first DRKs that did this. Since this isn't public domain though, let's start from scratch and see how hard it is.
<!--more-->
Of course, the nice thing is that most of the work is done for us. I did a quick Google search and came across the <a href="http://javamusictag.sourceforge.net/">Java ID3 Tag Library</a>. I downloaded the JAR and copied it to $CFMX_HOME/runtime/servers/lib/. I then restarted ColdFusion. So what next? I checked the project's <a href="http://javamusictag.sourceforge.net/QuickStart.html">quick start</a> guide and saw this Java example:

<pre><code class="language-javascript">File sourceFile;
MP3File mp3file = new MP3File(sourceFile);
</code></pre>

I knew this could be translated to ColdFusion as:

<pre><code class="language-javascript">&lt;cfset mp3file = createObject("java", "xxxx")&gt;
&lt;cfset mp3file.init(somefilepath)&gt;
</code></pre>

The problem was - what to use for the class name? I fumbled around a bit and found the <a href="http://javamusictag.sourceforge.net/api/index.html">API</a> documentation. I looked up MP3File in the API and saw that it's path was org.farng.mp3.MP3File. I'm not sure how folks would be able to figure that out without documentation, but I was finally able to create an instance of the object using this path. 

I then checked the API and looked into how it returned ID3 tag information. The code supports two versions of ID3 information, ID3v1 and ID3v2. (There are actually subversions for each of these two versions.) For a quick test, I wrote some code to examine one of my folders and grab the information from the ID3v1 tag:

<pre><code class="language-markup">&lt;cfset dir = "g:\music\80s\"&gt;

&lt;cfdirectory action="list" directory="#dir#" filter="*.mp3" name="music"&gt;

&lt;cfloop query="music"&gt;
	&lt;cfoutput&gt;filename = #name#&lt;br&gt;&lt;/cfoutput&gt;
	
	&lt;cftry&gt;
		&lt;cfset mp3 = createObject("java", "org.farng.mp3.MP3File")&gt;
		&lt;cfset mp3.init(dir & name)&gt;
		
		&lt;cfset tag = mp3.getID3v1Tag()&gt;
		
		&lt;cfoutput&gt;
		artist=#tag.artist#&lt;br&gt;
		album=#tag.album#&lt;br&gt;
		comment=#tag.comment#&lt;br&gt;
		genre=#tag.genre#&lt;br&gt;
		title=#tag.title#&lt;br&gt;
		year=#tag.year#&lt;br&gt;
		has v1? #mp3.hasID3v1Tag()#&lt;br&gt;
		has v2? #mp3.hasID3v2Tag()#&lt;br&gt;
		&lt;/cfoutput&gt;
		&lt;cfcatch&gt;
		bad file
		&lt;/cfcatch&gt;
	&lt;/cftry&gt;
	&lt;hr&gt;
&lt;/cfloop&gt;	
</code></pre>

How did I know what methods and fields I could use? It all came from the API. So - not the cleanest of code, but you can see how it works. I create an instance of the MP3 code, and then fetch the ID3v1 tag information. To be safer, I should have used the convenience function, hasID3v1Tag() first. Notice the try/catch around the code. From what I could tell, there was no easy way to tell the code to check first for a valid MP3 file. 

So what next? This works easily enough - but what if I switch to a different Java library? Tomorrow I'll write a ColdFusion Component and show how we can wrap this into a nicer and easier to use system. What I want to end up with is a tool that is 100% ColdFusion based. The developer using the tool should have no idea that behind the scenes I'm just using a JAR file.