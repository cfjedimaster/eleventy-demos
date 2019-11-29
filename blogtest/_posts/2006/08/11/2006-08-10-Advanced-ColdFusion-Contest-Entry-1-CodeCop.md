---
layout: post
title: "Advanced ColdFusion Contest Entry 1: CodeCop"
date: "2006-08-11T10:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/08/11/Advanced-ColdFusion-Contest-Entry-1-CodeCop
guid: 1465
---

Welcome to the first entry review for my <a href="http://ray.camdenfamily.com/index.cfm/2006/6/11/Advanced-ColdFusion-Contest-Announced">Advanced ColdFusion</a> contest.  Our first entry is from Steve Bryant. I have to say that if every other entry is like this, I will be incredibly happy. You may download it using the Download link below. 

As a reminder, I will be picking apart these applications and pointing out things I think are done well, and done badly. This is not meant to attack the author, but merely to give my opinion on how he did things. I am not perfect myself, but one of the points of this exercise is for us to learn from each other. So, enough touchy-feely crap, let's get to it.
<!--more-->
<h2>Presenting CodeCop</h2>

<a href=" http://ray.camdenfamily.com/demos/contest4/cc1.jpg">
<img src="http://ray.camdenfamily.com/demos/contest4/cc1_small.jpg" align="left" border="0" hspace="5"></a>

I'm going to begin by commenting on something  that isn't ColdFusion related, or even contest related. I currently run a few <a href="http://ray.camdenfamily.com/projects/projects.cfm">open source projects</a>, and I think I'm getting the hang of how to do it right. One nit picky thing I saw right out with his zip file is that the install files are intermingled with the rest of his code. I always recommend folks use a "install" subfolder. This makes it easier to find the installation instructions, and makes it easier to remove the install files from a production box. Since install files could potentially be dangerous, it is always a good idea to make it easy to remove them. 

My next issue was with the installation instructions.  In particular, he mentions that you will be asked to pick a datasource, but he doesn't say why. The application installs itself into a database, but nowhere is that made clear. I was naturally concerned so I first picked some old database. The application did not like that (but handled the error gracefully). I then made a new DSN with an empty database and that made things work nicely. Note to Steve - you simply cannot provide enough information in your instructions. Always provide as much as possible. For example, would any DSN have worked? SQL Server worked, but what about MySQL? As a quick side note - he also provides a "contest_notes.txt" file which talks about his thought process. To be honest, that's pretty cool. None of my applications talk about why I did stuff, the philosophy behind design decisions, etc. 

So - after a bit of fuss setting things up, I had the application running. The first thing you are asked to do is to pick a folder of code to scan. You have the option to specify particular extensions or to simply use all extensions. (I assume he meant cfc and cfm and not really *.*. If he did, he should document that.) You are also prompted to select a rules package. I chose the default. After a few seconds your report shows up.

The report gives you a nice breakdown of all the issues discovered in the code you processed. You can then jump into the file and see the issue, or click on the issue type and get more information about what it means. Reports are automatically stored into the database and you have the option to export to PDF as well. All in all, the UI is very nice and clean. Now let's talk about the engine.

<a href=" http://ray.camdenfamily.com/demos/contest4/cc2.jpg">
<img src="http://ray.camdenfamily.com/demos/contest4/cc2_small.jpg" align="left" border="0" hspace="5"></a>

When I created this contest, it was my assumption that folks would extend the rules engine by writing code, much like how I built <a href="http://ray.camdenfamily.com/projects/canvas">Canvas</a>. Steve however made the configuration all web based. Rules are added and edited via the interface. Rules have various metadata associated with them so you can assign a severity and other properties. Rules can be either regex or tag based, but here again the lack of documentation makes it a bit difficult to know which to use. For example, for a tag based rule, do I do &lt;cffoo&gt; or just cffoo? Looking at another rule, it seems as if you write it without the brackets. However, my test threw an error when I tried to search for cfquery. You can also write custom code, again via the interface, to do specific checking for the rule. I'd imagine this is a bit hard to test though. 

Rules can be placed in packages, which is nice, since you may not like the "Prefer structKeyExists over isDefined" rule. One thing that would have been nice, but potentially complex, is the ability to assign different rule priorities in packages. So for example, I may want to keep the structKeyExists rule, but change the priority in a different package. 

Another cool aspect of this application is that it doesn't have to run under the ColdFusion Administrator, and if it doesn't, it actually changes the skin used to display the application. 

So, that's it. If you want a sample of the output, check this <a href="http://ray.camdenfamily.com/demos/contest4/cc.pdf">PDF</a>, it is a report created by running the default rule package on CodeCop itself. All in all I'm very impressed with this product, and by how the extensibility doesn't require you to write code. Again, that isn't what I expected, but I like being surprised. The primary issue he has now is simply documentation. Don't forget that you can download this application below.
<br clear="left"><p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Cdev%{% endraw %}2Ecamdenfamily{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FCodeCop%{% endraw %}2Ezip'>Download attached file.</a></p>