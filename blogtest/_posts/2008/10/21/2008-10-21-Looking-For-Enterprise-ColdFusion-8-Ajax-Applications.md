---
layout: post
title: "Looking For: \"Enterprise\" ColdFusion 8 Ajax Applications"
date: "2008-10-21T15:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/10/21/Looking-For-Enterprise-ColdFusion-8-Ajax-Applications
guid: 3063
---

This question came in today from reader Marwan:

<blockquote>
<p>
Have you, or someone you know, developed anything sophisticated with the Ajax features in CF8. While it is easy to sprinkle some Ajax here and there; developing complete apps is not very easy with all kinds of problems. I have started on 3 projects and eventually gave up and went back to traditional CF. I am interested in enterprise class apps completely developed with Ajax interfaces and functionality. Thank you.
</p>
</blockquote>

This is a pretty open ended question and I thought it would be a good discussion for the blog. I think a lot would depend on what you mean by sophisticated and enterprise (hence the quotes above). I do think a fair way to phrase this question is - has anyone developed a 100% Ajax based app using CF8's Ajax features? Ie, something akin to Gmail where all (or almost all) of the application runs via one main Ajax-based controller. So that's the first part of the discussion I want to bring up. If you know of such a site, please share it. But I also want to address some of the implied shortcomings you allude to in your question.
<!--more-->
While you didn't call out any particular bug, I'm willing to bet your problems are probably in these areas:

<ul>
<li>Customizing the UI (color, padding, whatever) for ajax-bound controls like the new grid
<li>Customizing the functionality of UI controls (I don't want X to happen when I click, but Y instead)
<li>The size (file size) of a page when CF8's Ajax stuff is in use
</ul>

This is typically what I hear on lists, blogs, etc. Maybe folks have heard other complaints and if so, please share. All of these issues typically focus on the visual side of the Ajax features added to ColdFusion 8. It is important to remember that ColdFusion's Ajax support is not limited to the 'pretty' UI widgets. I see three distinct areas of support:

<ol>
<li>Visual Components: Mentioned above - the grids, pods, windows, etc.
<li>Bridging Tools: Things that connect the front end to the back end. This really boils down to cfajaxproxy, one tag. Considering what it does, though, it is an incredible amount of functionality to have in one tag.
<li>Server Side Functionality: What does ColdFusion do on the server side to help with Ajax? Specific to ColdFusion 8 I'd say this mainly consists of JSON support and returnFormat. I know it may be a small thing really, but isn't it awesome that we can take an existing CFC with existing logic, and simply use returnFormat=json in the URL to get a JSON based response? 
</ol>

When I do presentations on ColdFusion and Ajax I try to spend much more time on 2 and 3 since they don't cause quite as much controversy. I'm not surprised at all that the UI items would cause problems. UI - by its very nature - is going to be something that folks will either love or hate. I'm not trying to excuse Adobe for any bugs they may have in this area, but do note that you can do quite sophisticated things pretty quickly with tags like cfwindow, cfgrid, and cfdiv. For folks who may not be comfortable using other AJAX libraries, I think ColdFusion does what it always does - try to make web development as quick and practical as possible. 

Speaking for myself - now that I'm getting more comfortable with Ajax and jQuery, I find myself using the UI items less but still using the bridging/back end stuff quite a bit. So enough rambling. Any comments?