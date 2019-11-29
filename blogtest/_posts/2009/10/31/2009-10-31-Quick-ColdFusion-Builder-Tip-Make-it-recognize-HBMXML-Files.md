---
layout: post
title: "Quick ColdFusion Builder Tip - Make it recognize HBMXML Files"
date: "2009-10-31T15:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/10/31/Quick-ColdFusion-Builder-Tip-Make-it-recognize-HBMXML-Files
guid: 3583
---

I'm currently fighting (ok, not fighting - debugging - it just feels like a fight) an issue with a ColdFusion 9 site that makes heavy use of ORM. I thought it might help to take a look at the Hibernate config files generated, so I added this to my ormSettings structure in Application.cfc:

<code>
&lt;cfset this.ormsettings = {
	dbcreate="update",
	logsql="true",
	eventhandling="true",
	savemapping="true"
}&gt;
</code>

I reloaded my application and confirmed that in every folder containing my entity CFCs there was now a file named cfcname.hbmxml, where cfcname matched the name of the CFC.

Ok, so far so good. Back in ColdFusion Builder I refreshed my project so I could see the files. But since the extension wasn't recognized, CFB didn't know how to handle it. I had previously opened up HBMXML files with TextMate, so CFB recognized that and sent all requests for such files to TextMate. I wanted to see them within CFB instead so this is what I did. (And to be clear, this should work for any Eclipse product, not just CFB.)

I opened up my Preferences and went to General/Editors/File Associations. 

<img src="https://static.raymondcamden.com/images/Picture 192.png" />

Click add and specify *.hbmxml for the file type.

<img src="https://static.raymondcamden.com/images/cfjedi/Picture 262.png" />

Lastly - click Add under Associated editors. Select CF Builder XML Editor.

<img src="https://static.raymondcamden.com/images/cfjedi/Picture 339.png" />

Hit Ok to dismiss the preferences panel and you are done.