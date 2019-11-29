---
layout: post
title: "Reading MP3 ID3 tags with ColdFusion (2)"
date: "2006-07-09T23:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/07/09/Reading-MP3-ID3-tags-with-ColdFusion-2
guid: 1385
---

So, almost a month ago I wrote about <a href="http://ray.camdenfamily.com/index.cfm/2006/6/13/Reading-MP3-ID3-tags-with-ColdFusion">reading  MP3 information</a> using ColdFusion. I promised a follow up the next day and ended up getting a bit busy with a new job, trips, etc. The sad thing is that I wrote the code a few days afterwards and it ended up being exceptionally simple. So - first off - sorry for the delay. Let's look at the CFC I ended up with. As you can see, it is so simple I can share all the code right here:
<!--more-->

<pre><code class="language-markup">&lt;cfcomponent displayName="MP3" hint="Reads ID3 information from an MP3" output="false"&gt;

	&lt;cfset variables.filename = ""&gt;
	&lt;cfset variables.loaded = false&gt;
	&lt;cfset variables.id3tag = ""&gt;
	
	&lt;cffunction name="init" access="public" returnType="mp3" output="false"&gt;
		&lt;cfargument name="filename" type="string" required="false"&gt;
		
		&lt;!--- create an instance of the java code ---&gt;
		&lt;cfset variables.mp3 = createObject("java", "org.farng.mp3.MP3File")&gt;

		&lt;cfif structKeyExists(arguments, "filename")&gt;
			&lt;!--- read it in ---&gt;
			&lt;cfset variables.filename = arguments.filename&gt;
			&lt;cfset read(variables.filename)&gt;			
		&lt;/cfif&gt;
		
		&lt;cfreturn this&gt;
	&lt;/cffunction&gt;
	
	&lt;cffunction name="checkLoaded" access="private" returnType="void" output="false"
				hint="Helper function to throw error if no mp3 loaded."&gt;
		&lt;cfif not variables.loaded&gt;
			&lt;cfthrow message="You must first read in an MP3!"&gt;
		&lt;/cfif&gt;
	&lt;/cffunction&gt;

	&lt;cffunction name="getAlbumTitle" access="public" returnType="string" output="false"
				hint="Returns the album title."&gt;
		&lt;cfreturn variables.id3tag.getAlbumTitle()&gt;
	&lt;/cffunction&gt;

	&lt;cffunction name="getSongGenre" access="public" returnType="string" output="false"
				hint="Returns the song genre."&gt;
		&lt;cfreturn variables.id3tag.getSongGenre()&gt;
	&lt;/cffunction&gt;
	
	&lt;cffunction name="getSongTitle" access="public" returnType="string" output="false"
				hint="Returns the song title."&gt;
		&lt;cfreturn variables.id3tag.getSongTitle()&gt;
	&lt;/cffunction&gt;

	&lt;cffunction name="getTrackNumber" access="public" returnType="string" output="false"
				hint="Returns the song title."&gt;
		&lt;cfreturn variables.id3tag.getTrackNumberOnAlbum()&gt;
	&lt;/cffunction&gt;

	&lt;cffunction name="getYearReleased" access="public" returnType="string" output="false"
				hint="Returns the song's release date."&gt;
		&lt;cfreturn variables.id3tag.getYearReleased()&gt;
	&lt;/cffunction&gt;
	
	&lt;cffunction name="hasID3V1" access="public" returnType="boolean" output="true"
				hint="Returns true if the mp3 has id3v1 information."&gt;
		&lt;cfset checkLoaded()&gt;

		&lt;cfreturn variables.mp3.hasID3v1Tag()&gt;
	&lt;/cffunction&gt;

	&lt;cffunction name="hasID3V2" access="public" returnType="boolean" output="false"
				hint="Returns true if the mp3 has id3v2 information."&gt;
		&lt;cfset checkLoaded()&gt;
		
		&lt;cfreturn variables.mp3.hasID3v2Tag()&gt;
	&lt;/cffunction&gt;
	
	&lt;cffunction name="read" access="public" returnType="void" output="false"&gt;
		&lt;cfargument name="filename" type="string" required="true"&gt;

		&lt;!--- does the file exist? ---&gt;	
		&lt;cfif not fileExists(arguments.fileName)&gt;
			&lt;cfthrow message="#arguments.fileName# does not exist."&gt;
		&lt;/cfif&gt;

		&lt;!--- copy to global scope ---&gt;
		&lt;cfset variables.filename = arguments.filename&gt;
		
		&lt;cftry&gt;
			&lt;cfset variables.mp3.init(variables.filename)&gt;
			&lt;cfset variables.loaded = true&gt;
			
			&lt;cfif hasID3V1()&gt;
				&lt;cfset variables.id3tag = variables.mp3.getID3v1Tag()&gt;
			&lt;/cfif&gt;
			&lt;cfif hasID3V2()&gt;
				&lt;cfset variables.id3tag = variables.mp3.getID3v2Tag()&gt;
			&lt;/cfif&gt;
			
			&lt;cfcatch&gt;
				&lt;cfthrow message="Invalid MP3 file: #arguments.filename# #cfcatch.message#"&gt;
			&lt;/cfcatch&gt;
		&lt;/cftry&gt;
	&lt;/cffunction&gt;
	
&lt;/cfcomponent&gt;
</code></pre>

So - first - a recap. In the last entry I talked about the <a href="http://javamusictag.sourceforge.net/">Java ID3 Tag Library</a>. This is the open source project that I'm wrapping with ColdFusion. ID3 tags are the encoded information in the MP3 file that tslks about the song. It contains different bits of information based on the style of ID3 tag used in the file. There are two main version of ID3, and various sub versions of each. The Java ID3 Tag Library supports working with both main styles of ID3 tags and has specific API calls to work with them.

But - and this is why I love the project so much - the author also wrote a set of simple methods that will work with any version ID3 tag. In the code above, check out getAlbumTitle and getSongTitle. While I could have used specific API calls for the two versions of ID3, I didn't have to since there were generic functions built into the code. 

To be honest, I got lucky. This was one of the first Java libraries I found, and it just turned out to be darn easy and useful. So how could you use this? You can imagine a site that let's users upload mp3s. (Legal of course.) Instead of asking the user to enter information about the song, you can use ColdFusion to read out all the ID3 information automatically. 

Anyway - let me know if you actually use this on a production site. I'd be curious to see it in use.