---
layout: post
title: "Question on Instant Messenger Gateway"
date: "2006-09-12T08:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/09/12/Question-on-Instant-Messenger-Gateway
guid: 1526
---

Kevin asks, 

<blockquote>
I read Forta's blog post from about 1 year ago where he dealt with GTalk and your own post to rewrite Eliza to work with GTalk.  I tried both systems and liked them, but neither of you Jedi's went the step further to take the functionality a little more...

So here as one of your fans I am sending in my own ask a jedi question.  Would it be possible to ask the XMMP event gateway and cfc to check a users online status and keep a database updated with the changes... 

I am thinking an Online/Offline image system using GTalk / Jabber as the protocol? In my specific case, we have a new board for our church... If you could see a users status and interact with them if they were online.. that would be a great function to add to the page...
</blockquote>
<!--more-->
I had to do a little bit of checking on this, but absolutely. Part of the Instant Messenger Event Gateway spec is an onBuddyStatus message. This is called whenever a buddy's status changed. You could log the changes to the database (for the history part) and store the current status so that it could be reflect on the web page. 

To see all the methods for the IM gateway, go <a href="http://livedocs.macromedia.com/coldfusion/7/htmldocs/00000745.htm">here</a>. For more information about onBuddyStatus, see <a href="http://livedocs.macromedia.com/coldfusion/7/htmldocs/00000749.htm">this page</a> from livedocs. It shows you all the parameters and an example of how to use it.

For folks interested in learning more about the IM Gateway, Ben wrote an excellent <a href="http://www.forta.com/blog/index.cfm?mode=entry&entry=A61BCF71-3048-80A9-EF0BE0C72724D84E">series</a> on the topic. (The link I used is to the third item in the series. Be sure to follow the links for the earlier items.)

FYI - I promise to have the third part to my asynch gateway series up this week. It is just a wrap up mainly with links to examples and a few interesting things I've found.