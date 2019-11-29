---
layout: post
title: "Ask a Jedi: Question on Application based CFCs"
date: "2008-03-24T13:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/03/24/Ask-a-Jedi-Question-on-Application-based-CFCs
guid: 2725
---

David asks a good question about what he thinks may be a possible negative side effect of using Application-based CFCs:

<blockquote>
<p>
What are the implications of using a single instance of a CFC that all users' requests will access to handle performing some arbitrary functionality compared with just referencing the CFC normally (not stored in Application scope)? The most important part of my question is, do users 2-1000 have to wait for
access to the #application.cfcInstance# to perform the arbitrary functionality while it's handling user 1's request?

If not, is it safe to say that using an application-scoped CFC instance could improve performance significantly if it's a CFC whose methods need to be accessed repeatedly by all users?
</p>
</blockquote>
<!--more-->
So first off - no - there is no "locking" involved when it comes to Application-based CFCs. You can have N issues run the same method and they will <b>not</b> have to wait in line. The only exception to this is if you go out of your way to make it act like so. You can add your own locking to a CFC method that could possibly single-thread the access. Unless you do this though the calls will not be handled like that.

Is it safe to say using Application-scoped instances would improve performance? Certainly in CF7 where CFC creation was a bit slow. In CF8 however this slowdown was greatly removed.

I'm wary of saying that this will always increase performance as there are always so many factors that can be in play. I <b>can</b> say though that if your intent is to create a service used by your entire Application, I can't think of a reason <b>not</b> to create it one time only. Now whether you store it in the Application scope or load it via ColdSpring (or whatever), that depends on the application at hand, but in general, I'd recommend creating it once and keeping it in RAM.