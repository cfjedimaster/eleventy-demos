---
layout: post
title: "Small formatting issue with emails sent via ColdFusion 9 Mail.cfc"
date: "2010-08-28T12:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/08/28/Small-formatting-issue-with-emails-sent-via-ColdFusion-9-Mailcfc
guid: 3927
---

Using the new mail.cfc to send emails in ColdFusion 9? You may notice an odd formatting issue. Check out this screen shot:

<p>

<img src="https://static.raymondcamden.com/images/Screen shot 2010-08-28 at 10.39.31 AM.png" />

<p>

I thought this was whitespace in my code, but turns out it is the code that implements mail in script. Find base.cfc in your cf install\customtags\com\adobe\coldfusion folder. Open it and go to line 417. (Note - the tags as script stuff changed in 901. So if you are still on 900, your line number may be different.) On line 417 you will see #mailbody# as a variable, tabbed over. Simply remove the tabs. Here is a slice of the file:

<p>

<b>Quick note - the white space did not render perfectly on my blog - so you will just have to imagine that mailbody is the online code all the way to the left.</b>

<p>

<code>
                &lt;cfmail attributeCollection="#tagAttributes#"&gt;
#mailbody#
                    &lt;cfloop array="#params#" index="mailparam"&gt;
                        &lt;cfmailparam attributeCollection="#mailparam#"&gt;
                    &lt;/cfloop&gt;
                    &lt;cfloop array="#parts#" index="mailpart"&gt;
                        &lt;!--- Capture mailpart content into a local variable and delete body attribute ---&gt; 
                        &lt;cfif structkeyexists(mailpart,"body")&gt;
                             &lt;cfset var mailpartbody = mailpart["body"]&gt;
                             &lt;cfset structdelete(mailpart,"body")&gt;
                        &lt;/cfif&gt;
                        &lt;cfmailpart attributeCollection="#mailpart#"&gt;
                            #trim(mailpartbody)#
                        &lt;/cfmailpart&gt;
                    &lt;/cfloop&gt;
                &lt;/cfmail&gt;
</code>

<p>

This fixes it up. You still get some whitespace <i>after</i> the message, but that should be pretty much invisible to the end user. You could remove <i>all</i> the white space if you wanted to, but I thought that was overkill.

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-08-28 at 10.42.49 AM.png" />