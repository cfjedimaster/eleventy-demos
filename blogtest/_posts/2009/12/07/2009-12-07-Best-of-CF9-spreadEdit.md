---
layout: post
title: "Best of CF9: spreadEdit"
date: "2009-12-07T21:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/12/07/Best-of-CF9-spreadEdit
guid: 3635
---

<img src="https://static.raymondcamden.com/images/cfjedi/bestcfcontest1.jpg" title="Best of ColdFusion 9" align="left" style="margin-right:5px"/> Welcome to the first (of many) "Best of ColdFusion 9" entry reviews. The first entry is spreadEdit by <a href="http://samfarmer.instantspot.com/blog/">Sam Farmer</a>. This entry was reviewed by Paul Hastings. (I've added a few notes as well.) 

At a basic level, spreadEdit is an Excel spreadsheet editor. However it goes beyond just simple editing. It makes use of ORM and the VFS in a way that I didn't think was possible. Each spreadsheet is parsed into an entity CFC stored in the VFS. These virtual CFCs then become database tables. I'm not sure what's going to happen after my server restarts, but it's a unique approach and it's cool to see it in action. (I literally went back and forth looking at the code and shaking my head in disbelief.) 

Paul listed out what he liked about the application:

<ul>
<li>ease of setup making use of the gifts God gave cf9 ;-) it would have setup the derby DB automagically (if it had actually worked on our ubuntu server, see below)
<li>nice wizardy approach
<li>excel file upload page is nice & clean, uses new cf9 "web 2.0"-ish bits
<li>data entry grids also used new cf9 "web 2.0"-ish bits
<li>liked the display of spreadhseet metadata for uploaded files (nit pick that maybe shouldn't strip timezone info from date formats, but of course i would nit pick that), pretty thoughtful
<li>liked that it uses the VFS for temp model/view/etc storage, nice touch & illustrates one use case (that i hadn't thought about before)
<li>liked the bits to keep track of the VFS usage, though the graph was kind of crappy looking (the more flex/AIR we do, the more i notice this sort of thing)
<li>use of ORM
<li>use of built-in derby db
<li>threw unicode spreadsheets at it & more or less worked (one rather large & complex one brought it crashing down though, not sure if it's a bug in cf9 or the app's not accounting for embedded quotes, "weird" char stuff
<li>kudos for still using cf tags (i actually don't like to use them even for output anymore but gotta give him credit for going old school ;-) <b>[Ray's Note: Paul is - I assume, talking about Sam's use of custom tags for layout. I've got a nit on that below.]</b>
<li>use of new style CFC syntax
</ul>

So Paul definitely like the setup wizard, and I agree, it's pretty dang cool.

<img src="https://static.raymondcamden.com/images/cfjedi/setup.png" />

My only complaint here is that my CF Admin doesn't have a password and the application demanded I enter one. (I put something in bogus and it worked fine.) 

Paul also complimented the "web 2" stuff, and they do look pretty snazzy here. Here is an example of the multi-file uploader:

<img src="https://static.raymondcamden.com/images/cfjedi/mf.png" />

and another example of the grid editor:

<img src="https://static.raymondcamden.com/images/cfjedi/edit_data.png" />

Paul liked the VFS lister, but not the chart, which I thought was fine.

<img src="https://static.raymondcamden.com/images/cfjedi/view vfs.png" />

As to what Paul <i>didn't</i> like...

<ul>
<li>linux - adminapi NOT adminAPI <b>[Ray: Case is a bitch, isn't it? ;) You will never convince case sensitivity for files is a good thing!]</b>
<li>linux -
<ul>
<li>security is usually "fiercer" (or you know, better) than windows
<li>the app needs more than simply copying to the web server to actually
       work, gotta have correct permissions on the right dir, blah, blah, blah
<li>because of that, the step 2 bits never actually get uploaded & the
       write spreadsheet bits failed
</ul>
<li>"any more files" popup constantly hidden behind file datagrid, kind of a big UI no-no (another of the many reasons why we usually prefer flex front ends these days, also if flex UI maybe a nice sparkline for the VFS tracking instead of that crappy looking pie chart ;-)
<li>no clean way back after viewing file on VFS, just "save" instead of a "cancel" button as well
<li>not enough error trapping for things like blank metadata (eg no "last edited" bits for brand new spreadsheet)
<li>didn't use the new CFC syntax everywhere
</ul>

Some of my own comments in response to Paul - first off - the file permissions <i>is</i> kind of a big deal, especially for folks who write code for multiple operating systems. You really do have to be careful when working with the file system. Hopefully the VFS will help with that... but let me point out something I think Sam missed. He makes use of a VFS folder called "/se". What if some other application uses the same folder? One thing I really wish VFS would do differently is work at the Application RAM level, not the Server level. If I ever decided to make use of VFS for BlogCFC for example, I'd probably use a root directory based on a UUID, just to ensure I was in a unique server space. 

Also - I'll nit that I don't like the fact that Sam uses custom tags for layout but has two separate files:

<code>
&lt;cf_header title="Credits"&gt;
... stuff here ...
&lt;cf_footer&gt;
</code>

It may be a minor thing, but I'm much more a fan of wrapper tags:

<code>
&lt;cf_layout title="Credits"&gt;
... stuff here ...
&lt;/cf_layout&gt;
</code>

Ok folks - you can download the bits below. It's been a while since my last contest, but I want to remind folks of something. The point here is to play and share. <b>Please be polite.</b> I know Sam wants feedback, but be constructive. Thanks Sam!<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FspreadEdit%{% endraw %}2Ezip'>Download attached file.</a></p>