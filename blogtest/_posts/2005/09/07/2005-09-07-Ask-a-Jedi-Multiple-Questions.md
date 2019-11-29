---
layout: post
title: "Ask a Jedi: Multiple Questions"
date: "2005-09-07T13:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/09/07/Ask-a-Jedi-Multiple-Questions
guid: 756
---

I've gotten numerous questions from the Ask a Jedi pod to the right. Here are a bunch of short questions answered in one post.

Q: Can you put a select control or radio buttons into a cfgrid?<br>
A: Yes and No. The Applet version of cfgrid supports a drop down. Both versions allow you to specify boolean as a type with cfgridcolumn. This will display a checkbox, not a radio control.

Q: Is there a way to send the output of a cflocation call to a new page or for us firefox users a new tab?<br>
A: No. Let's be honest though. Opening up new windows or tabs should be up to the user, not us web developers. 

Q: Is there a way to set a submit button to be the default when you hit the enter key?<br>
A: This is up to the browser. Most browsers, I believe, will default to submit if only one field exists. Like on my Ask a Jedi form to the right. I did a quick test in Firefox, and enter worked fine to submit a form, even with 2 text fields. I'm not sure I'd "trust" that to be very cross platform though.

Q: I have an application that has to be deployed multiple times on the same web server.  I would like to be able to use an external configuration file (xml or ini) to set up all of the application level variables, including application name, client variable storage, etc.  Do you know if it is possible to dynamically set these properties during the OnApplicationStart event when using Application.cfc or are those application properties already initialized by the time that event is called?<br>
A:  Yes, you can use dynamic application names. BlogCFC does this. You would need to read in the configuration information, then set the name like so:

<div class="code"><FONT COLOR=MAROON>&lt;cfset this.name = someValue&gt;</FONT></div>

Q: Could a BlogCFC install with a unique name on a site where the isp is using shared IPs make scopecache unclearable? Or only clearable by rebooting the server?<br>
A: Only BlogCFC installs would have a conflict if any other blog had the same name on a box. Now they should be unique based on file path. Make sure you have the latest. If you still have trouble, try the BlogCFC <a href="http://ray.camdenfamily.com/forums/forums.cfm?conferenceid=CBD210FD-AB88-8875-EBDE545BF7B67269">support forums</a>.

Q: We are looking for a small child displaced by Hurricane Katrina, where and how can we adopt one?<br>
Not really a ColdFusion question, but I did say to ask anything. :) My wife is looking into this now. When I find something out, I'll post to <a href="http://www.theadoptionnews.com">The Adoption News</a>.

Q: I'm looking for a ColdFusion consultant.<br>
A: I'd use the <a href="http://www.houseoffusion.com/cf_lists/threads.cfm/13">CF-Jobs</a> mailing list.

Q: Do you have to have flex installed to use drag and drop in cfform format=flash?<br>
A: The presence of Flex doesn't change flash forms per se, so I think the answer to this is no. Can you do drag and drop in Flash Forms? Maybe. I haven't tried it. I'd check over at <a href="http://www.asfusion.com">ASFusion.com</a>.