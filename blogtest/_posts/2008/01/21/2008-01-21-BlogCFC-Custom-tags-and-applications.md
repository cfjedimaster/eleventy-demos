---
layout: post
title: "BlogCFC, Custom tags and applications"
date: "2008-01-21T17:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/01/21/BlogCFC-Custom-tags-and-applications
guid: 2606
---

This really isn't a BlogCFC post, but more a post about custom tags and application scopes. A quick quiz. Given a root folder and Application.cfc/cfm file named AAA, what Application scope is used if you call a custom in folder /test that has it's own Application.cfc/cfm file?
<!--more-->
The answer is the original Application, AAA. Even though your custom tag is being run in a folder with another Application.cfc/cfm file, ColdFusion isn't going to run it. Your custom tag (or cfinclude) is run in context of the original Application.

I'm bringing this up because of the following question from a user:

<blockquote>
<p>
I obviously don't have a good grasp of the way the application scope work.

When I add a new app that I have written to my intranet, I would just make sure to call it the same as my pplicationName in the root.  I do this to be able to use the same login information.
 
I recently downloaded blogcfc and got it working by itself.  However when I try to cfmodule the index.cfm file, I keep getting: "Element ISCOLDFUSIONMX7 is undefined in APPLICATION."
 
To get it work I have to run the blog by itself, then go back to my intranet page, and the intranet works.
 
I am having a hard time integrating blogCFC into another app.  Should I be having trouble?
</p>
</blockquote>

Yep, you should be. When you run index.cfm from within BlogCFC, it never loaded up it's own Application scoped variables.

What options do you have? Specifically for BlogCFC, you could simply move the application setup stuff into your own file, or cfinclude my Application.cfm from your own file. You would want to modify it a bit to remove the custom application name, <i>and</i> you have to be a bit concerned about my application variables overwriting yours.

Another option is to simply use the applicationToken value of cflogin (discussed <a href="http://www.raymondcamden.com/index.cfm/2008/1/11/Ask-a-Jedi-One-login-multiple-applications">here</a>). That assumes both applications make use of the CFLOGIN feature.

To be fair, making BlogCFC "plugable" is not something I worked on very well, but it is something I can look into for v6.