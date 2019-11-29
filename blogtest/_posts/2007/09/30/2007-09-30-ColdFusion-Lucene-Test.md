---
layout: post
title: "ColdFusion Lucene Test"
date: "2007-09-30T13:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/09/30/ColdFusion-Lucene-Test
guid: 2379
---

This morning I woke up rather early (I rarely sleep well away from home), and decided to play a bit more with Lucene. I've learned a few things about the project that I'm going to list out here. If I get them wrong, please correct me. I've only spent a few hours on this so I'm far from being an expert.
<!--more-->
First off - Lucene does not, by itself, have any support for binary data. That means you can't index PDF, Word Documents, MP3 files, etc. People have written libraries for it - but the important thing to note is that "out of the box", you just have string data and that's it. 

Secondly - Lucene lets you build an index with any set of fields, which is pretty cool. CFVerity (I'll use CFVerity to refer to the built-in Verity support in ColdFusion) has a set number of fields that you are forced to use. Now it is a pretty big set, but with Lucene you can create fields you want.

That is good - but a bit of a problem as well. One nice thing about the CFVerity stuff is that you have multiple, disparate sources that all must feed into a certain set of fields. You then get the same fields outs. So when searching an index in Lucene for example, you have to dynamically introspect the results to see what fields exist. That isn't hard to do at all - but I guess I'm saying it is both good and bad that Lucene is so open (more good than bad).

So I wrote up a simple file based demo. This is based heavily on Lucene's on demo code, and the <a href="http://www.cflucene.org/cflucene/index.cfm?event=showHome">CFLucene</a> project. My demo code <i>only</i> lets you index files. But it does try to mimic Verity a bit. So for example, you can define an index with just one word "name" and it uses a folder under CFROOT/lucenecollections. Ditto for searching. Here is the sample code I've used:

<code>
&lt;cf_index directory="/Library/WebServer/Documents" indexdirectory="test2"
filter="*.cfm,*.html,*.txt" recurse="true"&gt;
</code>

So the directory attribute is my source. Indexdirectory is where the index is stored. Filter is an optional list of filters (duh), and recurse tells the tag to recursively search my directory attribute. Searching is rather simple:

<code>
&lt;cf_search index="test2" term="#form.search#"&gt;
&lt;cfdump var="#result#"&gt;
</code>

I've included my demo files and custom tags in a zip attached to this blog entry. I will most likely <b>not</b> continue this code as I'm thinking of this as a first draft only. 

What I'm thinking of the final version is something along these lines:

a) We need a generic wrapper to index data. This wrapper takes in data (again, string only) and handles telling Lucene where to store the index.

b) Above this we need 'helpers' I think. The file I've included in my zip that indexes files could be considered a helper. Ie, it is simply a utility to easily send crap to the utility defined in A. I can imagine 2 basic helpers - a File helper and a Query helper. Again - I'm thinking of Verity as my base here. The File helper could be an interesting project. As I mentioned, Lucene supports strings only, so I could build a File helper that it itself takes plugins. This way folks could add PDF support (maybe using my <a href="http://pdfutils.riaforge.org/">pdfutils</a>), Word support, etc.

c) Search - This one is rather easy actually. Since Lucene lets you get the fields back dynamically, it wouldn't be hard to modify the search.cfm I have already.

d) Lastly - I want to build a CF Admin page that will let you do what you can do in Verity admin. You an index folders/files and see your indexes (again, assuming we use a default root folder). You can optimize - etc. And if I read the docs right - you can loop through the data, delete, etc, so a browser could be built to let you see what is in the index. (To be fair, CFVerity supports this as well, you just need to search for {% raw %}%.)<p><a href='enclosures/D%{% endraw %}3A{% raw %}%5Chosts%{% endraw %}5Cwww{% raw %}%2Ecoldfusionjedi%{% endraw %}2Ecom{% raw %}%5Cenclosures%{% endraw %}2FArchive10%2Ezip'>Download attached file.</a></p>