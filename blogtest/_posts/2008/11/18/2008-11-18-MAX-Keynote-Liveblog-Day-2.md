---
layout: post
title: "MAX Keynote Liveblog - Day 2"
date: "2008-11-18T13:11:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2008/11/18/MAX-Keynote-Liveblog-Day-2
guid: 3111
---

Woot, any presentation that begins with Tim Buntel is going to kick butt. They re doing a 'spy spoof' thing now with Lynch as the chief. Way to start a keynote Adobe!
<!--more-->
Tim and Ben are on stage now - biggest mission yet - "Quantum of Richness" - nice. ;) Tim to Ben: Hello Q. Ben to Tim: Its F, not Q! 

Talking about home automation which has an AIR client. Showing AIR controlling lights, fan, etc. Curious - I wonder how they do the communication? 

Ecotours example: Talking about design and showing Flash CS4 IDE. To be honest, I don't quite get what he is showing - talking about InDesign import. I assume this is a good thing. Showing making an animation with drag and drop (is this new?). Ok, so the point is, the animation he shows would require AS work in CS3, but not CS4.

Shows 'bone tool' that lets you add bones to the object and move it realistic.

Moving on now to Photoshop CS4. Showing that cool feature where you can resize and not lose important details. That's been shown before but it still seriously kicks butt. Now showing the depth of field feature. Showing painting on a 3d object. She pained a suite case purple and it had no impact on the layer behind it.

Switching to Catalyst (new name for Thermo). Beginning with a static Photoshop comp. Importing it into Catalyst. FC recognizes the layers from the image in PS. Wants to make it so when you click on a small map, a large map appears. You make 'pages' in Catalyst (think States in Flex). Makes a new page named Map. He wants the map to slide in from the right. Putting the map to the right automatically made a transition he can tweak. He finds the map picture and turns it into a component (button). Picks onClick, Map. Now he wants to make zoom things for the map. Using artwork from Illustrator. Heh, he does Copy from Illustrator and can paste into FC. Nice. Converting the image into a thumb that can be moved up and down.

<b>HOT NEWS</b> Scott Stroz just found this: <a href="http://labs.adobe.com/wiki/index.php/Main_Page#Bolt">http://labs.adobe.com/wiki/index.php/Main_Page#Bolt</a>

From the page: Bolt is the codename for Adobe's new Eclipse™ based development tool that you can use to build applications for Adobe® ColdFusion®. 

Yes folks, the CF IDE is announced!

Correction - Todd found the link and shared it with Scott.

Switching to Development. (Woot) Talking about the C/C++ to AS converter I mentioned yesterday in my labs post. Project Alchemy. Showing hello world in C (god that looks ugly). C code was converted into ActionScript. Sweet - showing Zork!

Using C/C++ code they can add support to Flash for stuff it hasn't had before - like Org Vorbis audio (spelled wrong I'm sure).

Second example, using C/C++ code to support RAW image formats.

Wow - Quake in Flash. Freaking sweet. Oh heh, followed by a NES emulator in AIR. Games FTW!

FlexBuilder on the screen now. Gumbo MAX Preview. Tim just said it is available on DVD. What DVD? Maybe it was in the registration bag (still haven't looked inside). Importing the work from Flash Catalyst. 

Woot - ColdFusion is up! Showing Bolt as a CF perspective.

You can manage servers, launch server monitor from the IDE. Color coding (of course). Types cfinclude template=, popup to let you pick a file. Recognizes datasources available to you (nice!). cfoutput, query= and there was a popup of known queries. doing ccfobject and it knows your CFCs available. cfc introspection!

Showing db tables, right click on a table, generate orm. Showing new things in app.cfc to support ORM. Super simple CFC with 3 properties mapped to table. Generator for CRUD. They really need to push the ORM aspect more, but this may not be the time for it.

Ezra, a friend sitting next to me, just mentioned - he heard Ben say 'other frameworks' in terms of ORM. Does that mean support for Transfer/Reactor in the IDE?

Showing how Gumbo can let you connect to a CFC and begin testing via the IDE and generate some code rather quickly. Ie, real quick way to get your Flex app talking to CF. "Data Management" added to FB4. Lets you make a mapping between editing ops on the front end and the server. Ie, you tell FB what is your add, edit, delete, update methods in the CFC. You can right click on a button and easily write the event handlers. Code insight to the CFC from Flex Builder. My take on this again - very easy to do CRUD in FB w/ CF on the back end.

Network monitor in Flex Builder 4. As he edits data, in the IDE he can view the AMF calls. Very very nicely done. No more ServiceCapture for me.

Showing Themes in FB. Easier way to globally skin a Flex app. Nice. I need that. 

Ben showing Visual Studio. VS will now support Flex. .Net support for AMF.

AJAX and AIR. Talking about AJAX improvements in Dreamweaver CS4. Showing support of jQuery, Mootools, etc. Insert/jQuery UI accordion placed on page. Turn on live view and you see the UI control working. Showing the freeze javascript feature. (This is one reason I'll continue to use DW even with Bolt.) 

Deployment time. Talking about how to support search engine supporting dynamic content. On the Google side there is a concept of a virtual user that can run through all the states. On Adobe side there is a virtual Flash player that can listen to the virtual user. Showing the SWF being run and you get console output of the real data. Which means Google can index it now. Very interesting! Its a headless flash player essentially.

Flash Media Server 3.5. Handling multiple bit rates. Normally you switch files, but with "Dynamic Streaming", um, you still do, but it's better? Ok, showing CSI video and changing resolution, and its working really well. SreamFlashHD.com - new web site showing this off.

RTFMP - Real time flash media protocol. Lets any Flash client talk to another one. No server involved at all - 100% direct.

Ted Patrick on stage now. "Mr. Max" (I can attest to that - he works his butt off to make MAX work for speakers, etc.)

Adobe User Group community. 420 Adobe UGs. Problem - it is hard to find the UGs. Launching today is Adobe Groups: <a href="http://groups.adobe.com">groups.adobe.com</a>

Site will be localized - supports double byte characters (life would be easier if we just all spoke Klingon). Showing making a profile on the page.

MAX 2009 - LA - October 4-7.