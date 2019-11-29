---
layout: post
title: "Ask a Jedi: Keeping it Together..."
date: "2005-12-26T22:12:00+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2005/12/26/Ask-a-Jedi-Keeping-it-Together
guid: 996
---

This is the second question I've gotten like this, so I thought I'd take the time to answer it:

<blockquote>
Ray, With all of the projects that you maintain, I am interested in hearing about how you manage to keep everything straight.  What tools and processes to you use on a daily basis that might help others?  How much sharing of code to you do between projects?  Thanks, Scott
</blockquote>

First off, the number one thing I have to be clear about is my memory is crap. Worse than crap. If you rated my brain as RAM, it would be equivalent to my old Apple IIe <i>before</i> I increased it to 128K. I do <i>not</i> do a great job of managing my open source projects. More than once someone will mention a bug that will get forgotten. So what do I try to do as much as possible? Use a bug tracker. Obviously I use <a href="http://ray.camdenfamily.com/projects/lhp">Lighthouse Pro</a>, but you can use <i>any</i> issue tracker. I think this is the number one tool you can have for your project. Don't think of this just as a "bug" tracker. A good issue tracker will help you with new ideas, suggestions, or even reminders for documentation updates. Basically - don't trust your memory, or a collection of email. Find a good issue manager to help manage your project. Can my readers recommend which tools they use? (Although if you aren't using Lighthouse Pro, what's wrong with you??? ;)

As for sharing code - I try as much as possible. Typically the code that works between projects are the most generic of functions, and typically they come from <a href="http://www.cflib.org">CFLib.org</a>. I probably do not consilidate as much as possible.