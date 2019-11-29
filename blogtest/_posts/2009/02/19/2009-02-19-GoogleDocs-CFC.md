---
layout: post
title: "GoogleDocs CFC"
date: "2009-02-19T22:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/02/19/GoogleDocs-CFC
guid: 3245
---

Many, many moons ago I released some code to work with Google's Documents service. It supported listing documents and downloading... kinda. At the time, downloading wasn't officially documented, and the code completely failed for hosted accounts. Well, Google finally officially released download support, so I spent some time today updating the CFC. With the CFC you can now:

<ul>
<li>Download all documents
<li>Download a type of document (documents versus presentations versus spreadsheets)
<li>Download starred documents
<li>Search the text inside the documents
<li>Download a document in any format Google supports. This is rather cool actually. You can download a PNG of a document and you get a thumbnail. You can export a presentation into SWF format. You get the idea.
</ul>

I do not currently support folder operations or any document uploading. I figured that people would use this CFC to embed Google edited items within their own web site. It is a great way to give clients a nice editor while still displaying their content on their web site.

The download is below. Ok, so now I need to put on my cranky pants for a minute. While working with the API I ran into a few issues. An engineer from Google really helped me out on their <a href="http://groups.google.com/group/Google-Docs-Data-APIs/browse_thread/thread/adffd8716a180325">forums</a>, and I appreciate that, but as my readers know, I'm kinda snobbish about my APIs (can you be an API snob) so I thought I'd share some feedback. Who knows - maybe I'll get a job offer from the big G. Anyway, in no particular order, here is what caused me to yank a few hairs out today.

1. When it comes to exporting, Google offers a variety of formats. You can't use all the same formats for all the same document types, which is fine, I mean, I don't see how or why you would want a SWF export of a written document. However, for spreadsheets, instead of supplying a format like XLS or SWF, like you do for presentations and documents, you provide a number. You have to look up CSV, for example, and supply a number. Silly. My CFC simply wraps their numbers with a utility function.

2. Speaking of document types - all 3 use a different url for downloading. So that's one url to get your list, and 3 different ones for downloading. Eh? Would I be crazy to expect just one url with different actions?

3. For spreadsheets, if you get a text format, you must specify a sheet number. And it's 0 indexed. Ok, I know some people think 0 based arrays make sense. But you will never convince me that it makes sense to use 0-based indexing outside of arrays. Again, my CFC simply 'fixes' this for yo.

4. Before you do anything with Google, you perform an authentication request. But for some reason, the authentication request that lets you list docs and lets you download doesn't work downloading spreadsheets. You have to perform a second authentication request just to download a spreadsheet. -boggle- I got around this ok in the code (pretty nicely I think) but still, this is something Google should fix. (And they know about it so most likely the will.)

5. Oh, here is a good one. You need a document id to download a document. Ok, that's sensible enough. But the XML returned from the document list doesn't give you the ID "clean." You have to parse a string by splitting on %3A. Isn't XML supposed to make this simpler? (Again, Google knows about this and will eventually fix it.)

Anyway, enough ranting. I hope this helps folks. This isn't up on RIAForge yet. I'm considering consolidating my various Google projects into one uber Google codebase like my Yahoo stuff.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fgoogledocs%{% endraw %}2Ezip'>Download attached file.</a></p>