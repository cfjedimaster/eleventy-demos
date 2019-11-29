---
layout: post
title: "Hooking up ColdFusion and SQLite"
date: "2009-09-24T10:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/09/24/Hooking-up-ColdFusion-and-SQLite
guid: 3539
---

Need to hookup ColdFusion to SQLite? I did. I normally only use SQLite for AIR development, but I had a situation where I needed to seed a database with a large set of data. While AIR can easily do this (it can create the database, the tables, and initial data), I thought it would be nicer if the database was simply prepoulated. 

I began by first creating my SQLite database by using <a href="http://www.dehats.com/drupal/?q=node/58">Lita</a>. This is an AIR based SQLite editor. I had a few issues with it, but eventually I got it working right. I created the file and my table to get it ready for ColdFusion.

My Google search for JDBC drivers turned up <a href="http://www.zentus.com/sqlitejdbc/">SQLiteJDBC</a>. I downloaded the first JAR file and save it to my ColdFusion classes folder. I restarted ColdFusion and then went and create my DSN. I selected Other for the type and used the following settings:

<b>JDBC URL:</b> jdbc:sqlite:/Users/ray/Documents/words.db

This value should begin with jdbc:sqlite: and then end with the full path to the file. 

<b>Driver Class:</b> org.sqlite.JDBC

And then everything else, but the name of course, was blank. I confirmed the datasource connected ok in both the ColdFusion Admin and in ColdFusion Builder's RDS panel.

Ok, now for the fun part. I wanted to use ColdFusion to seed the database with a set of words that came from a text file. I used the following code, which I assume is self-explanatory and not really an important part of the blog entry:

<code>
&lt;cfsetting enablecfoutputonly="true"&gt;
&lt;cfset wordList = "/Users/ray/Desktop/word_list_moby_freq_broad_corpus-flat/word_list_moby_freq_broad_corpus.flat.txt"&gt;

&lt;cfloop index="word" file="#wordList#"&gt;
	&lt;cfset word = trim(word)&gt;
	&lt;cfif len(word) gt 2&gt;
		&lt;cfoutput&gt;#word#&lt;br&gt;
		&lt;/cfoutput&gt;
		&lt;cfquery datasource="sqllitetest"&gt;
		insert into WORDS(word)
		values(&lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#word#"&gt;)
		&lt;/cfquery&gt;
		&lt;cfflush&gt;
	&lt;/cfif&gt;
&lt;/cfloop&gt; 
</code>

This threw an interesting error though: statement is not executing. I didn't quite know what to make of that, but on a whim, I changed my queryparam line to this:

<code>
		values('#word#')
</code>

And all of a sudden - it worked. So either the driver doesn't support bound parameters or I set up something wrong, but this did the trick. For another example, check this <a href="http://www.personal.psu.edu/mjs253/blogs/ntz/2008/12/coldfusion-with-sqlite-via-jdb.html">blog entry</a> that was shared with me on Twitter.