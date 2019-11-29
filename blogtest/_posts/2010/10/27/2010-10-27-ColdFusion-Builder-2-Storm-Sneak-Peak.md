---
layout: post
title: "ColdFusion Builder 2 \"Storm\" - Sneak Peak"
date: "2010-10-27T17:10:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2010/10/27/ColdFusion-Builder-2-Storm-Sneak-Peak
guid: 3986
---

Ram Kulkarni (Adobe) just presented on  ColdFusion Builder 2 ("Storm") at the ColdFusion Unconference. I tweeted quite a bit about it but I thought I'd wrap it up. <b>Please do not ask me for details.</b> If you don't see it listed here, I can't say anything more about it. Ok, here we go:
<!--more-->
<ul>
<li>Code folding will now be remembered when you close and reopen the file.
<li>You can customize code folding (ie, close some random blocks of code, as long as it doesn't already have a fold).
<li>Support for tags, like TODO and FIXME added, and you can customize the recognized tags and their priority.
<li>You can jump through files, ie method to method or argument to argument. You can also quickly select blocks (like a function at a time). 
<li>Code assist can now cycle through different groups of stuff - so it may begin by assisting you the names of the local variables, and then switch to ColdFusion functions.
<li>Code assist will now be very intelligent - as in if you type in a collection based loop, it knows to assist you with item. It can also auto insert required attributes and is smart enough to know what is required for what.
<li>If you do something like: x = new foo, you can right click and it will offer to create a CFC for you if it doesn't exist. Ditto for UDFs and cfincludes. This was very slick. In fact, if you do foo(a,b,c) when it generates the method it will create those three arguments.
<li>Code assist is smart enough to suggest variables of the right type. So if you are in a cfexchange tag then it can suggest variables of a persisted exchange object.
<li>Code assist will bold the current argument, by that I mean, given a function that requires A, B, and C, when you are on the second argument, B is bolded in the help.
<li>A code formatter is built in and it is hella cool. Numerous options for stuff like, brackets on the same line or next, white space, etc. 
<li>Find and replace is now enhanced. You can search for CF tags with or without attributes and values, like cfinput tags where name="foo". You can also search and replace over FTP or RDS.
<li>Extensions now have access to a <b>lot</b> of data about the server - like datasources, tables, servers defined in CFBuilder, etc.
<li>Extensions can now create <b>views</b> and toolbars. So varScoper can run as a view. They show up in Show/Views/Other. (This is my favorite!)
<li>You can now do custom code assistance. Like when in an event.linkto you can write an extension to read the Model-Glue XML and provide values from that as assistance. 
<li>You can define custom key commands. You can also define where the cursor is applied. So if you build something to output a script block, you can put the cursor in the middle.
<li>You can right click on any file and make it the start file for a project.
<li>Refactoring (which seemed to surprise a lot of people - it exists right now!) has bug fixes to improve it's reliability.
<li><b>No</b> word on release.
<li>Want it on Linux? Keep making requests on the public bug tracker!
</ul>

That's it - folks - I'll be giving my borrowed laptop back after my next session so I may be even slower to respond till Friday. Hope this helps! I am very excited about ColdFusion Builder 2.