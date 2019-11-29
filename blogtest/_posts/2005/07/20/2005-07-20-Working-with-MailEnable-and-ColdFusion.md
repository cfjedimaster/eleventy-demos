---
layout: post
title: "Working with MailEnable and ColdFusion"
date: "2005-07-20T14:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/07/20/Working-with-MailEnable-and-ColdFusion
guid: 633
---

This blog (and the sites here, <a href="http://www.cflib.org">CFLib</a>, <a href="http://www.cfczone.org">CFCZone</a>, <a href="http://www.rsswatcher.com">RSSWatcher</a>) all use <a href="http://www.mailenable.com">MailEnable</a> for their mail server. I was setting up a new listserv today (more on that later) and was wondering if there was a way to let ColdFusion add a list member. I figured I'd probably have to append to some text file - but I was worried about the potential issues that could cause. Turns out - ME actually has a COM interface. All their demos are in ASP and PHP (sigh), but I was able to add a member using the code below:

<div class="code"><FONT COLOR=MAROON>&lt;cfset mel = createObject(<FONT COLOR=BLUE>"com"</FONT>, <FONT COLOR=BLUE>"MEAOLS.ListMember"</FONT>)&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;cfset mel.AccountName = <FONT COLOR=BLUE>"acadianammug.org"</FONT>&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;cfset mel.ListName = <FONT COLOR=BLUE>"LafayetteTech"</FONT>&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;cfset mel.ListMemberType = 1&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;cfset mel.Status = 1&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;cfset mel.Address = <FONT COLOR=BLUE>"[SMTP:"</FONT> & trim(form.addmember) & <FONT COLOR=BLUE>"]"</FONT> &gt;</FONT><br>
<FONT COLOR=MAROON>&lt;cfset result = mel.AddListMember()&gt;</FONT></div>

If the result is 1, then everything worked fine. The only odd thing is that a user added this way will <b>not</b> get a confirmation email. Therefore, I just send them an email myself.