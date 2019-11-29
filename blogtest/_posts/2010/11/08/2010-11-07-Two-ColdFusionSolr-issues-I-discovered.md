---
layout: post
title: "Two ColdFusion/Solr issues I discovered"
date: "2010-11-08T07:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/11/08/Two-ColdFusionSolr-issues-I-discovered
guid: 4006
---

As I prepare for my Solr presentation at <a href="http://riaunleashed.com/">RIAUnleashed</a> I've run into two interesting issues that may trip people up. One is a bug proper and the other is simply misleading. Let's start with the bug.

<b>Status is incorrect.</b><br/>
If you run a cfindex tag with the update action in a folder with files in it, the status result is supposed to tell you how many items were added versus how many were updated. In my testing, I had a folder with 4 files in it. I added these to my index and correctly saw that 4 were inserts. I then dropped a new file in, ran the same script, and expected to see 4 updated files and 1 inserted files. Instead I saw that 5 were updates.

This isn't a huge issue but if you rely on the status result for reporting or validation then you need to be aware of this.

You can see the bug report here: <a href="http://cfbugs.adobe.com/cfbugreport/flexbugui/cfbugtracker/main.html#bugId=84938">http://cfbugs.adobe.com/cfbugreport/flexbugui/cfbugtracker/main.html#bugId=84938</a>

<b>Misleading error message.</b><br/>
When you use cfindex to index stuff into an index (wow, say that 3 times fast), if you provide a collection name that does not exist, you get a misleading error message. Here is what you get:

<blockquote>
<b>Unable to connect to the ColdFusion Search service.</b><br/><br/>
On Windows, you may need to start the ColdFusion Search Server from the services control panel.
On Unix, you may need to run the search startup script in the ColdFusion bin directory.
Error: java.io.IOException: unable to obtain from connection pool: cannot make connection to server at: k2://localhost:9953
</blockquote>

As you can see, the error implies that ColdFusion was trying to connect to a server - and based on the "k2" at the bottom - a Verity server. If you make the same mistake with cfsearch, you get an error clearly stating that the collection doesn't exist. 

You can see the bug report here: <a href="http://cfbugs.adobe.com/cfbugreport/flexbugui/cfbugtracker/main.html#bugId=84939">http://cfbugs.adobe.com/cfbugreport/flexbugui/cfbugtracker/main.html#bugId=84939</a>