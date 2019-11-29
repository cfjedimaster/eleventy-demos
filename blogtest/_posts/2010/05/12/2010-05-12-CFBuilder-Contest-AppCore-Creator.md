---
layout: post
title: "CFBuilder Contest: AppCore Creator"
date: "2010-05-13T00:05:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2010/05/12/CFBuilder-Contest-AppCore-Creator
guid: 3816
---

<img src="https://static.raymondcamden.com/images/cfjedi/cf_builder_appicon.jpg" align="left" style="margin-right:5px" title="ColdFusion Builder FTW!" /> It's been a few days since the last entry, and for that, I apologize. I'm in Rhode Island now in the middle of some big meetings, so I've been pretty much brain dead since Monday. Today's entry is a simple one - but I think it shows some promise and it's a good beginning. The entry was sent in by Akbarsait (aka Akbar, but not <i>that</i> one) and is called AppCore Creator.
<br clear="left">
<p>
<!--more-->
The idea behind the extension is a simple one. You right click in your project navigator and are prompted to select a ColdFusion version:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-05-12 at 9.59.49 PM.png" title="Shot One" />

<p>

You pick a version (for the old timers out there I picked 7) and then the extension does it's magic:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-05-12 at 10.00.00 PM.png" title="Shot Two" />

<p>

At this point you need to refresh your folder. When you do, you will see that it laid down an Application.cfc, error.html, and index.cfm. If you select ColdFusion 8 or 9 it will also lay down a 404.cfm. 

<p>

What's nice is about these files is that just about ever option is selected and documented. At that point it's easy to get in and start tweaking. In some ways you could do the same with snippets of course, but this extension has the logic in to determine which files (and settings) make sense for your ColdFusion version. 

<p>

There are a couple of places though where this extension could be updated to take much more advantage of the CFBuilder API:

<p>

<ul>
<li>First off - an extension like this is <i>perfect</i> for a project creation hook. Don't forget that CFB extensions can run both as "menu actions" and after the creation of a project. I'd add that as an option. 
<li>It's nice to give folks an option to pick their CF version. Even if the current environment is CF9, you may be writing for CF8. However, I'd consider making the drop down default to the current version of the server.
<li>Don't forget that CFBuilder extensions have the ability to refresh both folders and files. Save the user a bit of work and refresh the folder system after you lay down the files.
<li>I'd find a way to handle file conflicts. If the user has a file already it gets blown away. I'd gather the list of files, check for conflicts, and if any exist, prompt the user before going on. 
<li>Finally - I'd consider prompting for the application name too. It's a fine line to cross - should you ask for more settings? You don't want to present 200 input fields to the user. But I'd consider asking for the application name at least. 
</ul>

<p>

So what do folks think? Would this be useful for development? You can test it out yourself by downloading it below.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FCF%{% endraw %}20AppCore{% raw %}%20Creator%{% endraw %}2Ezip'>Download attached file.</a></p>