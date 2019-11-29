---
layout: post
title: "Advanced ColdFusion Contest Announced"
date: "2006-06-11T21:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/06/11/Advanced-ColdFusion-Contest-Announced
guid: 1325
---

I've run three contests so far on this blog - a <a href="http://ray.camdenfamily.com/index.cfm/2005/9/20/Contest-Shall-We-Play-a-Game">beginner</a> contest, an <a href="http://ray.camdenfamily.com/index.cfm/2005/10/30/Intermediate-ColdFusion-Contest">intermediate</a> contest, and an <a href="http://ray.camdenfamily.com/index.cfm/2006/2/22/Advanced-Contest-Announced">advanced</a> contest. The last contest wasn't quite as successful as I had hoped, and a lot of people weren't happy with the Flex 2 requirement. I promised another contest and today I'm delivering on that promise. As before, the number one requirement will be that you open source your contest entry. You do <b>not</b> need to actively support it, but you do need to allow folks to download it and use it. (Feel free to use the license of your choice though.) So let's get into the details.
<!--more-->
Back when ColdFusion went from version 5 to MX, there was a code analyzer tool added to the ColdFusion administrator. This was (and still is) a handy tool to examine your files and point out potential problems. For this contest I'd like you to work on a new version of the code analyzer. Like the ColdFusion Administrator version, your version should let you pick files and then run the report. However, and this is the critical portion, I want you to focus on extensibility. What do I mean by that? 

You should consider your code analyzer as two applications. One is the front end section that presents you with options and shows results. The second part is the actual engine that checks your code. You can imagine that engine as a collection of rules. So for example: "Don't use ParameterExists" That rule could simply do a regex check and return the line #s where the function is used. Another rule could be to use structKeyExists over isDefined. But the important thing is that the rules themselves should be as abstracted as possible. I'd suggest taking a look at <a href="http://ray.camdenfamily.com/projects/canvas">Canvas</a> for inspiration. All of the rendering rules for the wiki are written as CFC methods. The token type rules are written as CFCs. To be honest, that extensibility is one of the things I'm most proud of writing. You should use this for your inspiration.

To be clear - an entry with 2 rules, but a dang good extensibility engine will win over an entry with 200 rules and a worse engine. 

So let's go over the rules:

<ul>
<li>The application will allow the user to select a file or folders to be parsed. You can ask for extensions if you want, but by default it should scan CFM and CFC. 
<li>The application will present a report of the issues found. Bonus points if you offer PDF and emailed results. You should also link to the file, potentially displaying the file using the same code color techniques BlogCFC uses.
<li>The application should allow for rules to be written. These rules define what the code analyzer looks for. These rules should be easy to use and install. The front end should offer a way to turn on and off these rules, but that is not required. So for example, if you don't agree with the use of StructKeyExists over IsDefined, you can simply turn it off. <b>To be clear:</b> This is the most important part of the application. 
<li>Bonus points for good documentation of the rule API. 
<li>Your application should run well in the ColdFusion administrator as a custom extension.
<li>As stated above, you must agree to share your code. I know that may sound scary. You are not promising to support the code. You are simply allowing folks to download it and use it. If you choose not to support it, I may host the application here. 
</ul>

The contest will run from now till the end of July, almost a full two months. Are there prizes? Of course there are! Prizes include:

<ul>
<li>One copy of Fusion Reactor 2. (Not yet released, but may be by the end of this contest. Look for a review soon on this blog.) Thanks to <a href="http://www.fusion-reactor.com">Fusion Reactor</a>.
<li>One copy of KTML. Thanks to <a href="http://www.interaktonline.com">Interakt</a>.
<li>Will Tomlinson is offering a ColdFusion tee shirt and mug.
<li>I'm also working on other prizes as well.
</ul>