---
layout: post
title: "Best of CF9: Collyba"
date: "2010-01-12T13:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/01/12/Best-of-CF9-Collyba
guid: 3681
---

<img src="https://static.raymondcamden.com/images/cfjedi/bestcfcontest1.jpg" title="Best of ColdFusion 9" a style="float:left;margin-right:5px;margin-bottom:5px"/>Welcome to another (and almost the last!) entry in the Best of ColdFusion 9 contest. Today's entry is Collyba created by Marko Simic. It was reviewed by Francisco Paulino - Tofinha and includes his comments and mine. So what is Collyba? I'll quote directly from Marko's INSTALL.txt file:

<p>

<blockquote>
This application is collaboration tool made for companies that frequently communicate (at this stage - chat) with their clients.Difference compared to IM is that this application (will) provide to its consumers ability to store, archive and search communication logs.
On the other side clients, won't need anything else but link to their chat room (once it's done:)). Of course username and pass is mandatory.
Once application is complete sessions will support video links (1:1) which, also, could be archived server-side. To make communcation richer, application will (or already does) provide many useful tools, like sharable Google Maps and file sharing.
</blockquote>

<p>

Before getting into the bits, take a look at the screen shot of the chat UI:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-01-12 at 12.37.43 PM.png" />

<p>

And here is an example of the integrated map tool from the sender's side:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-01-12 at 12.38.33 PM.png" />

<p>

and here is what the other people in the room see:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-01-12 at 12.39.12 PM.png" />

<p>

And finally, a shot of the log interface (still a work in progress).

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-01-12 at 12.39.31 PM.png" />

<p>

Ok, so what's behind this chat? Two very cool things that I'd love to see more ColdFusion developers make use of. First off - the chat data is sent back and forth using BlazeDS, part of ColdFusion 9. Secondly, and what I find most cool, is that this is an Ajax application. It makes use of Blaze via the Flex-Ajax bridge, which, if I understand right, allows Ajax applications to make use of Flash Remoting via a SWF embedded on the page. I don't think I've seen <i>any</i> tool like this out in the wild and I'm super happy to see a great example.

<p>

Also of note is that this is another example of an application using the <a href="http://fw1.riaforge.org">FW/1</a> framework. I believe this is the third one so far which is really saying something for a brand new framework. 

<p>

I'm surprised to see a mistake here that I've seen elsewhere - the use of the THIS scope within Application.cfc for Application variables. You can see these values copied in setupApplication. As I said, I've seen a few of these entries make the same mistake. Well, maybe it isn't a mistake per se, but it just feels wrong. In general, I think the THIS scope for Application.cfc should stick to what it was designed for - the application setup in terms of how it interacts with ColdFusion. 

<p>

Also of note is how he seeds the data. Within Application.cfc he has:

<p>

<code>
if (arrayLen(application.companyService.getAll())==0){include"_addinitdata.cfm";
}
</code>

<p>

While this works, don't forget that ColdFusion 9 ORM also supports seeding databases. You can see an example of this here: <a href="http://www.manjukiran.net/2009/10/09/coldfusion-orm-auto-generation-of-tables-naming-strategy-and-automatically-populating-data/">
ColdFusion-ORM: Auto-generation of tables, Naming Strategy and automatically populating data</a>
<p>

All in all, a pretty darn cool application. Any comments? Note - the license file in the zip prohibits anyone from doing, well, anything. I spoke to the author and he updated the license to the text below:
<p>
Copyright (c) 2009 Marko Simic (marko.simic@gmail.com)
<p>
This software may be freely used, copied and distributed as long as it is not sold, and all original files are included, including this license
<p><p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fcollyba%{% endraw %}2Ezip'>Download attached file.</a></p>