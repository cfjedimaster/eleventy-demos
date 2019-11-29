---
layout: post
title: "First version of Share CFC Released"
date: "2007-10-06T21:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/10/06/First-version-of-Share-CFC-Released
guid: 2395
---

At MAX Adobe talked about <a href="http://labs.adobe.com/technologies/share/">Share</a>, their new document storage/sharing service. It's relatively simple to use. You upload a file - set permissions - and then get some nifty little widgets. For example - you can upload a PDF and then get a Flash Paper preview you can embed in a web page. (I've done one below.) Images should also allow for embedding as well, but I believe there is a bug with the thumbnail. Anyway - this was cool in itself - but when I heard there was an API during the keynote, I immediately opened my browser to the <a href="http://labs.adobe.com/wiki/index.php/Share:API">docs</a>.  (API is about the only word that gets my attention more than wishlist.)

I was surprised to find that their API didn't just allow for simple listings but also allowed you to upload and download your documents. What does this mean? It means you can leverage the complete Share service completely from within your own application. (Although check the licensing - I didn't really read it well and I'm sure you have to credit Adobe somewhere.)

I worked on the API and had some difficulty. I got some help from the Share team (thank you Patrick Rodriguez and Fang Chang!) and I'm releasing my first version of the wrapper.

Before using this wrapper, you must ensure you have a valid Adobe ID. Then you must get your API key and shared secret from <a href="https://api.share.adobe.com/webservices/index.do">here</a>. 

Once you have this information you can then initiate a connection to Share:

<code>
&lt;cfif not isDefined("application.share") or isDefined("url.reinit")&gt;
	&lt;cfset application.share = createObject("component", "share").init("ray@camdenfamily.com","parishiltonrules",appkey,sharedsecret)&gt;
&lt;/cfif&gt;
</code>

You must persist the CFC so that the authentication/session information sticks. Otherwise the CFC will be pretty slow. That first hit to get set up takes about 2-3 seconds. Here is what you can do with my API:

<h2>List</h2>

This returns a query of information about the files and folders in your Share account. What I find cool is that folders, as far as I can tell, don't even show up on the Adobe site. Maybe I'm using the Flex app wrong, but I could only work with folders via the API. So the API actually lets you organize things even better than the public site! Example:

<code>
&lt;cfdump var="#share.list()#"&gt;
</code>

And this example lists files under a folder:

<code>
&lt;cfdump var="#share.list('e0755f34-73b7-11dc-b75f-151d3f6d9313')#" label="List of stuff under my new folder"&gt;
</code>

<h2>Create New Folder</h2>

Does what it says. It can make a new folder at root or below another folder.

<code>
&lt;cfset r = share.newFolder("new folder one2")&gt;
</code>

Right now the result is a string. It will either be an error (if the folder already exists) or an XML packet for the node. I'm thinking of making it CFTHROW in case of a real error and for success doing nothing - or returning a structure representing the node. Comments?

<h2>Delete</h2>
This deletes folders or files. Like above - I need to tweak the return logic a bit.

<code>
&lt;cfset r = share.delete("9f801c1f-73b5-11dc-b75f-151d3f6d9313")&gt;
</code>

<h2>Upload</h2>

Uploads a file. Example:

<code>
&lt;cfset myfile = expandPath("./test.pdf")&gt;
&lt;cfset r = share.upload(myfile,"Test upload")&gt;
</code>

<h2>Download</h2>

Downloads a file. Duh. Example:

<code>
&lt;cfset destpath = expandPath(".") & "/" & replace(createUUID(), "-","_","all") & ".pdf"&gt;
&lt;cfset share.download("dd5b6c48-7464-11dc-b75f-151d3f6d9313", destpath)&gt;
</code>

To Do:

<ul>
<li>Rename is in there - but currently broken. Move is essentially the same and once I get rename done, I'll work on move.
<li>Permissions/Shares: I've done nothing in this area yet.
<li>Working with "file renditions" - which is a just a fancy way of making it easier for you to display stuff on your site. I'm thinking of something simple like this: &lt;cfoutput&gt;#share.renderPreview("nodeidhere")#&lt;cfoutput&gt;
</ul>

You can download the zip below. It isn't explicitly stated in the file, but this code follows the same OS license I use for the rest of my code. Once I get the above finished, I'll be moving it to RIAForge.

And lastly - here is a sample embed of a PDF:

Edit: Removed preview as it was throwing errors.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fshare%{% endraw %}2Ecfc%2Ezip'>Download attached file.</a></p>