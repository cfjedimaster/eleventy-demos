---
layout: post
title: "Best of CF9: GView"
date: "2009-12-08T21:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/12/08/Best-of-CF9-GView
guid: 3638
---

<img src="https://static.raymondcamden.com/images/cfjedi/bestcfcontest1.jpg" title="Best of ColdFusion 9" align="left" style="margin-right:5px;margin-bottom:5px"/> Welcome to the next entry in the Best of ColdFusion 9 Contest. Today's entry is GView by <a href="http://www.bennadel.com/index.cfm">Ben Nadel</a>. This entry was reviewed by Daniel Short (and as before, I'll chime in here and there and interpret some of his comments). GView is a simple GMail viewer. It makes use of ColdFusion 9's new IMAP support primarily, but also hits the caching system, VFS, and other new features. <b>Note:</b> Ben was nice and sent us a pre-configured configuration for a demo GMail account. I've removed those credentials from the zip. You can find the settings within the Application.cfc file and they must be updated if you want to test the code.
<!--more-->
So what did Daniel like?

<ol>
<li>No cfscript components (YAY FOR TAGS!)
<li>Lots of new caching functionality to build an email reader with no
local storage. No database needed for this one.
<li>New isNull checks for dealing with empty mail folders.
<li>I believe he may have used every imap function available :-).
<li>Implicit getters and setters with cfproperty
<li>Did I mention lots of caching?
</ol>

Ben points out that some functionality is missing in the demo - the big one being able to reply to email messages. But dang - for an incomplete application it works well and has a very clean UI. This is the default view:

<img src="https://static.raymondcamden.com/images/cfjedi/Picture 195.png" />

And this is the compose message UI:

<img src="https://static.raymondcamden.com/images/cfjedi/Picture 265.png" />

I can't explain exactly why - but I really, really like the design. Daniel went on to say:

<blockquote>
While the app at it's core is very simple (read and write emails), the
implementation is very well done and easy to understand. There are
just a few external points of contact with the front end UI, which
would make it easy to wrap up this functionality for use just about
anywhere.
</blockquote>

I think that is pretty accurate. The code is very clear and concise (well, not vertically concise, like most of Ben's code it goes vertical in a <b>big</b> way). 

If I had to get picky, one thing I don't like is the use of this.X() method calls within a CFC. Whenever you are inside a CFC and call an internal method via this.X() you run the risk of being blocked if the method is private. I've pinged Ben on this before but I think it's just a personal preference of his. (Ben, that is cue to set me right!) 

Oh - here is something slick. Not new to ColdFusion 9, but not used by very many people, Ben makes use of attributeCollection when running his IMAP calls. So for example:

<code>
&lt;cfimap
	name="local.message"
	action="delete"
	uid="#arguments.uid#"
	folder="#arguments.folder#"
	attributecollection="#this.getImapConfig()#"
	/&gt;
</code>

All the boring config data is abstracted out of the call and you focus just on the particular action. Handy. 

Lastly - when I downloaded an attachment, the zip extracted to a 0 length file. Anyone else have an issue with attachments? 

Another nice little touch - note the dynamic application name:

<code>
&lt;cfset this.name = hash( getCurrentTemplatePath() ) /&gt;
</code>

Most of my OS applications use a method like this to name themselves. By hashing the current path you are guaranteed a unique name per server.  If he had used something simple like "gview", it's possible that another application on the server may use the same name.

Anyway - that's it. As always, keep the comments friendly, download it, and check it out by clicking the download link below.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fgview%{% endraw %}5Fcfimap%2Ezip'>Download attached file.</a></p>