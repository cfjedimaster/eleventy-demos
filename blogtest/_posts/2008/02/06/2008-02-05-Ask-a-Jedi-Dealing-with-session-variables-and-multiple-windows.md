---
layout: post
title: "Ask a Jedi: Dealing with session variables and multiple windows"
date: "2008-02-06T10:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/02/06/Ask-a-Jedi-Dealing-with-session-variables-and-multiple-windows
guid: 2633
---

Michael asks an interesting question about a conflict he is having with multiple windows and session data:

<blockquote>
<p>
I have an application that uses the session scope to store a single record in a table for editing. it all works great until some user forgets he has a window buried and starts editing another of the same kind of record. if it was a contact record he would then be using the session scope to store two contacts
and that doesn't work because the variables would all have the same name (i.e. session.contactInstance.FirstName) so when the user saves the two records, one of them gets over written with values from the other record and you end up with two of one and none of the other. So how to keep them separate? is there an easy way to dynamically name the variables? How is this problem normally handled?
</p>
</blockquote>
<!--more-->
First off - let me address the simpler part of your question, and that is about dynamically naming the variables. Since the Session scope is a structure like everything else in ColdFusion, that makes dynamically storing data very easy. Instead of session.contactInstance having your data, you could easily have session.contactInstances exist as a structure, and the primary key of each contact would point to a structure of data. So if I'm editing user ID number 6, I'd have session.contactInstances[6].firstName.

But that isn't really what you are concerned about I think. The issue you are having is with your edit process in general. You didn't say it - but are you using a multi-step form? That's typically the only time you would bother storing the data in the session scope. If it is a one page form, then you shouldn't be storing it in the session scope at all.

If you are indeed using a multi-step form, you could simply update your code to notice if a record was being edited and never finished. If the user created a new window and tried to edit user 8, you could throw an error and tell the user to finish editing user 6, or simply clear out all the data you had stored before. In other words - ensure that the first step of your multi-step form performs a 'clear' of any and all data that may have been there before. 

If you do want to support multiple windows, then you can use what I suggested above about a struct of structs using the primary key of the data.