---
layout: post
title: "CFUNITED 08 Opening Keynote"
date: "2008-06-18T09:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/06/18/CFUNITED-08-Opening-Keynote
guid: 2885
---

Welcome to CFUNITED 08. I'm going to be taking notes during the opening keynote, so please be sure to reload this entry for updates. Right now Michael Smith is speaking about the various things we can do to improve our applications. Adobe will be up in a few minutes and I'll do more frequent updates then.
<!--more-->
<b>8:47AM</b>: Michael is still talking, so while we wait for Adobe, an update on my 'free book if you find my room' note. I discovered that my floor is blocked to anyone who doesn't have a room on the floor, so I need to figure out another way to give away the WACK. The first person to ask me about my tat will get a copy. (Although you have to guess where it is - so you may be in some danger...)

<b>9:00AM</b>: Ben Forta and Adam Lehman are about to begin. Michael is still wrapping (needs to speed it up a bit).

<b>9:02AM</b>: Ben says, normally, this is where we show new features of CF, make big announcements, etc. "Cool stuff" Ben will cover higher end management stuff while Adam will be showing off the cool code stuff.

<b>9:05AM</b>: Where CF is today. Sales are "superb". Adobe doesn't say numbers, but it's doing very well. CF sales numbers are the best since Adobe got Macromedia. CF801 released early 2008. Added new OS support, 3rd party library updates, and other stuff. 

<b>9:08AM</b>: What's next? Public bug database, public enhancement request system. Customer advistory boards (with enterprise developers/community leaders) - includes focused subgroups (language, ria, frameworks, etc). And earlier access to Alpha/Beta releases.

<b>9:10AM</b>: Centaur development is on going. Themes: Advancing CFML, improved integration story, and improving the developer experience. Details are coming later in the keynote.

<b>9:12AM</b>: Planning for the Future. Biggest problem is lack of available developers. Everyone has small little language issues, or issues with pricing, but the lack of developers is the biggest problem (in Adobe's eyes). Speaking about reaching out to <b>educational</b> market. They did it will w/ Flex. CF will <b>FREE</b> for students and faculty for academic use (similar to Flex model). Full unrestricted version of CF. (Enterprise version.)

<b>9:16AM</b>: Protecting the integrity of CFML. Over the years, language has become fragmented and inconsistent. We need rules and guidelines for how the language evolves. Also need to play well with other CFML implementations. <b>CFML Advistory Committe</b>. Sean Corfield, Ben Forta, Sanjeev Kumar, Gert Franz, Me, Rob Brooks-Bilson. To help define the rules and guidelines around the use and evolution of CFML.

<b>9:20AM</b>: Centaur Sneak Peek time

<b>9:22AM</b>: What follows may or may not be in Centaur. (FYI, I hope to have a 'what I think of all this' post later today - focusing on just taking notes). Create UDFs and CFCs using CFSCRIPT. You can do argument def. and validation, roles, access, return types - again in cfscript.

<b>9:23AM</b>: Showing an example of a CFC with a method all done in script. (I won't bother typing the slide code, we all know what script syntax looks like.)

<b>9:24AM</b>: Explicit Local scope. cfset local.foo = 1. Can be used ANYWHERE in the func (no need to var crap all on top)

They will add a cfsetting thing to let you say all variables are var scoped.

<b>9:25AM</b>: cffinally/cfcontinue tags. Surprised it took this long for cfcontinue. cffinally is a bit obscure.

<b>9:27AM</b>: New keyword. implicit getter/setters for CFCs. implicit constructors (finally) for method's name init. import keyword. You can also use a method with the same name as CFC for an implicit constructor. You can do cfcomponent init=".." to define a constructor to run on init.

<b>9:29am</b>: implicit getter/setters - useful for bean cfcs. cfproperty will have more meaning to help with this. you will be able to override these as well.

<b>9:30am</b>: onServerStart and end - done with an Server.cfc file. All Application.cfcs will inherit this. Server.cfc is per server instance.

<b>9:33AM</b>: ColdFusion + AIR. Centaur will make AIR integration easier (big surprise there).

<b>9:35AM</b>: About to show a demo (which isn't working). Flex code with a cf:datasource tag and N cf:query tags. Kinda cool looking. Looks like he defined N queries so he can easily run a create, read, list, etc. Showing import com.adobe.coldfusion.*. 

<code>
&lt;cf:datasource id="..." datasource=".." offline="true" valueObject="somecfc"&gt;
&lt;cf:Query name="create" sql="insert into artists() ..." /&gt;
&lt;cf:Query name="read" sql="select * from artists where artistid = @artistid" /&gt;
&lt;/cf:datasource&gt;
</code>

Note I really abbreviated the code there.

<b>9:38AM</b>: This is big. Looking at exposing CF stuff, like cfmail, directly to AIR. Ie, you don't need to write a CFC to just wrap a CF service.

<b>9:41AM</b>: Adam is going to show his favorite feature. Database integration via ORM. Centaur will support ORM natively with Hibernate!

<b>9:42AM</b>: Example:

<code>
&lt;cfcomponent orm="true" datasource="cfartgallery"&gt;

&lt;/cfcomponent&gt;
</code>

This is the least amount of code you need. It uses the CFC name to see if it matches the table name. You get auto get/set.

<code>
&lt;cfscript&gt;
hibernate = request.getORMSession(;
artist = createObject("component", "com.etc").init();
artist.setFirstName("Ben");
artist.setLastName("Forta")
artist = hibernate.save(artist)
</code>

Ray's note: I think this can be done cleaner. Ie, artist.save(). Todd made a good point - if CF knows the tables and stuff, why even require a CFC?

Now showing the XML to help define mappings. It's the exact same schema as Hibernate normally uses. 

<code>
&lt;class name="cf:Artist" table="artists"&gt;
etc - looks like transfer
</code>

Now showing adding cfproperty tags to the cfc. 

<code>
&lt;cfpropery name="city" type="string" accessor="true"&gt;
etc
</code>

Showing an example of getting a record via hibernate.

<code>
artist = hibernatr.getById(33, 'cfc path here');
artist.setAddress('new');
hibernate.save(artist);
</code>

<b>9:51AM</b> Awesome question. "What about performance" Awesome anaswer. "It will be fast." 

<b>9:56AM</b>: To learn more about Centaur, go to MAX.

<b>9:57AM</b>: Open to questions now so the updates will slow down a bit.