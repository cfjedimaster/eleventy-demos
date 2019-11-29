---
layout: post
title: "Ask a Jedi: Getting started with SVN"
date: "2008-01-21T11:01:00+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2008/01/21/Ask-a-Jedi-Getting-started-with-SVN
guid: 2604
---

Joshua asks:

<blockquote>
<p>
I'm wanting to start a project and I'm wanting to do it using methods like SVN, Versioning, Builds, etc. I've never done any of this and was curious if you had any pointers or guides out there about this. I just don't know where to start on learning or practicing.
</p>
</blockquote>

I have to admit that I take a fairly simple view to Subversion. I don't follow the guidelines for creating versions, builds, etc. 

I can say that I make heavy use of the online book for SVN:

<a href="http://svnbook.red-bean.com/">Version Control with
Subversion</a>

The book does a good job of covering server and repository setup, and it also discusses <a href="http://svnbook.red-bean.com/en/1.4/svn.tour.importing.html#svn.tour.importing.layout">recommended repository layout</a> for handling stuff like versioning and builds. 

Outside of Subversion itself, I can make the following recommendations for clients:

<ul>
<li>On Windows, I loved <a href="http://tortoisesvn.tigris.org/">TortoiseSVN</a>. It acts as a mod to Windows Explorer and makes it real easy to work with SVN.
<li>On the Mac, I've used <a href="http://zigversion.com/">ZigVersion</a>, but have not been happy with it. Frankly, I haven't like <i>any</i> Mac SVN client. 
<li>Luckily though there is <a href="http://subclipse.tigris.org/">Subclipse</a>, a very well done Eclipse plugin for Subversion. This will obviously work on both Mac and PC, so it may be the best choice.
</ul>

Again - I barely scratch the surface of SVN myself, so I can't offer a lot of advice. I will share one thing that I wish I had known early on. If you want to create a copy of your SVN repository to share with others, use the Export command. This creates a version of your code without any of the .svn folders. For a long time I was doing Check Outs and manually cleaning up the .svn folder stuff. Dumb.

I'll also point out a recent article by Mark Drew: <a href="http://www.markdrew.co.uk/blog/index.cfm/2008/1/11/Using-keyword-substitution-in-Subversion">Using keyword substitution in Subversion</a>. This demonstrates a cool feature of SVN you may miss out on if you skim the docs (as I did!).