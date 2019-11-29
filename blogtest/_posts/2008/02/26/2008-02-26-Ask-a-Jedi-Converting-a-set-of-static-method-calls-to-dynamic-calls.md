---
layout: post
title: "Ask a Jedi: Converting a set of static method calls to dynamic calls"
date: "2008-02-26T15:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/02/26/Ask-a-Jedi-Converting-a-set-of-static-method-calls-to-dynamic-calls
guid: 2676
---

Hatem asks:

<blockquote>
<p>
I have the following set of calls, currently hard coded:
&lt;cfif fileexists("#curpath##CaseStudy.getIMG1()#.jpg")&gt;<br> 
 &lt;cffile action="delete" file="#curpath##CaseStudy.getIMG1()#.jpg"&gt;<br>
 &lt;cffile action="delete" file="#curpath#thumbs\#CaseStudy.getIMG1()#.jpg"&gt;<br> 
 &lt;cffile action="delete" file="#curpath#small\#CaseStudy.getIMG1()#.jpg"&gt;<br>
 &lt;cffile action="delete" file="#curpath#large\#CaseStudy.getIMG1()#.jpg"&gt;<br>
&lt;/cfif&gt;<br>

As you can see, it calls getImg1 for each. I need to do this for images 1-4. How can I make it dynamic?
</p>
</blockquote>

As with most things, there are multiple solutions. The most direct answer is to simply switch to cfinvoke. Assume you are in a loop and N is your loop counter, this will get the value you want:

<code>
&lt;cfinvoke component="#casestudy#" method="getIMG#n#" returnVariable="image"&gt;
</code>

You would then use the variable image in your CFIF and your file deletes.

Another route would be to replace those 4 getImgN methods with one method that simply takes an index: getImg(n). I'd be willing to bet your 4 methods are <i>extremely</i> similar. Your CFC would be a bit cleaner if you switched up the API a bit. (This is my assumption however not having seen your entire CFC.)