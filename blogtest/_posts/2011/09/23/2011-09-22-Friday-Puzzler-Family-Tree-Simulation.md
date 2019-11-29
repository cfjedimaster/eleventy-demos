---
layout: post
title: "Friday Puzzler: Family Tree Simulation"
date: "2011-09-23T10:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/09/23/Friday-Puzzler-Family-Tree-Simulation
guid: 4371
---

<img src="https://static.raymondcamden.com/images/cfjedi/Family_Tree_img.jpg" align="left" style="margin-right:10px;margin-bottom:10px" /> Ok, so it's been a while (too long) since I ran a Friday Puzzler. As a reminder, these are meant to be very small, very quick code puzzles that you can solve in (hopefully!) five minutes or so. You have to use ColdFusion. But outside of that, you are welcome to solve the puzzle as you see fit. These puzzlers tend to be hit and miss. Sometimes I get a lot of people responding, sometimes, not so much. But I had this idea while exercising this morning and I thought it would be fun to see what you guys do with it. Don't forget. This is for fun. That means you can totally disobey the "rules" and just go crazy. I'm going to try to dig up a prize perhaps (who knows...), but the point is to have fun. Remember - do not post your code in the comment. Post a PasteBin link and a description of what you did. Since the puzzle involves output, you can also link to your demo.
<!--more-->
For today's puzzler, you are going to write code that simply simulates a family line. You will begin by creating a Person component. This component can be very simple. It doesn't even have to have a name. It does have to have a gender, a spouse pointer, and an array of children. Your family line will begin with two people.

Every generation your couple will have 0-N children. 

Every generation those children will have a chance to marry and also have 0-N children.

Your simulation ends when no more children or born (or none get married), or when you reach some other practical limit. It is entirely possible your family line could grow big enough to impact server memory. 

Your simulation must output <i>something</i> that displays the tree. It need not be graphical. 

Some things to consider to make things simpler:

<ul>
<li>There is no gay marriage, divorce, remarriage because of spousal death, or adoption. I think my readers know me well enough to know I'm pretty liberal, and as I have three adopted kids myself I'm definitely pro-adoption. But for the sake of simplicity, let's just assume those don't exist.  <b>(And please - if folks want to debate those topics with me, let's do it off blog. As it stands, I'm right, you're wrong. We're done. :)</b>
<li>Bonus points if you assign random names to people and have male children carry on the family name. In theory, it's as simple as an array of firstnames and lastnames and just randomly selecting them. You could pick 20 each and have quite a variety
<li>Super bonus points if you randomly decide that the child of a marriage will use a hyphenated named. But I have no idea what two kids with hyphenated names would do when they get married.
</ul>

<p>
Since this was maybe a bit larger than I expected, I'm extending this contest till EOD Monday. That's 5PM Cool Standard Time. Oh - and if you want a free copy of ColdFusion Builder 2... just enter. :) (Actually, it's Flash Builder <i>and</i> CFBuilder 2!)
<br clear="left">
<i>Family tree picture courtesy of <a href="http://genealogy.about.com/od/free_charts/ig/genealogy_charts/family_tree.htm">this blog post.</a></i>