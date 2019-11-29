---
layout: post
title: "Ask a Jedi: Complex security possible in ColdFusion?"
date: "2008-06-23T18:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/06/23/Ask-a-Jedi-Complex-security-possible-in-ColdFusion
guid: 2897
---

Michael asks:

<blockquote>
<p>
We are inheriting a ColdFusion application written in ColdFusion. This application is be modified by us to conform to our business process. Our current application is written in PowerBuilder. 

The crux of the question is it possible to implement complex security. By complex each page needs to have business rules to a specific user/role. IE some users will need to be allowed to perform a specific function some not. Some will need to see certain parts of the page some not. Some buttons will be enabled some not etc.

All of the examples that I am seeing in relation to security is based on hackers trying to infiltrate the system not controlling the actions of the users using the system
base on a role. 

Is this realistically possible with ColdFusion? I have been
investigating Ajax, but I am to much a CF newbie to make a determination as this time. 
</p>
</blockquote>

You've got a lot here so let me try to break this up into a few sections.
<!--more-->
So first off - you are right - if you search for security you will most likely find articles talking about blocking hacking attempts. I'm not even quite sure the best way to describe the difference between that and what you are talking about. One is more attack prevention and one is more business rule security. So I'll start off this response with a plea to my readers to provide any URLs they may know of. I did a quick search at Charlie Arehart's UGTV site (<a href="http://www.carehart.org/ugtv/index.cfm">http://www.carehart.org/ugtv/index.cfm</a>) and found 7 results, but these don't seem to be exactly what you want either. 

Turns out I actually have a presentation on the topic - but it's rather simple. You can find the Connect recording <a href="http://adobechats.adobe.acrobat.com/p14319489/">here</a> and the associated files <a href="http://www.raymondcamden.com/enclosures/secpreso1%2Ezip">here</a>.

What this really boils down to is having ColdFusion understand authorization and authentication. Authenticating is simply proving that the user is who they say they are. This is normally done via database queries, which ColdFusion makes trivial. You may also do it via LDAP - which again is trivial in ColdFusion.

Authorization is a bit more tricky. You talked about users and roles and how some users could do X, see Y, etc. In general it might make sense to simply think of these both as actions on resources. So for example:

User A has the right to VIEW a page that is RESOURCE 5.<br/>
User B has the right to VIEW a page that is RESOURCE 4.<br/>
User C has the right to VIEW,EDIT a page that is resource 5.<br/>

In the above list, you see 3 users and their permissions. The text in capitals refers to both the action they can do (view, edit, etc) and the resource. The action could be anything. In general it tends to boil down to viewing, editing, creating, and deleting. The resource can be anything to - and generally matches the database. So for Amazon the resources could be books, CDs, movies, etc.

So really this comes down to having ColdFusion recognize who you are (authentication) and authorizing you when you do an action. How you implement this is a matter of personal preference. If you download <a href="http://galleon.riaforge.org">Galleon</a> you can see one example. In Galleon, users can have VIEW, POST, and EDIT permissions in forums. I stored a table of things you could do (galleon_rights) and a store of who could do (galleon_permissions). The permissions table basically said that a group X could do right Y on a resource (thread). In Galleon I took a simpler route where permissions are only associated with groups, not individual users, but this simpler view worked fine for the application as everyone is in a group.

So I guess the upshot is that - yes - it is possible. The implementation though is really going to come down to your exact business rules. I've linked to one of my presentations and one of my open source applications, and my readers will add to this as well.