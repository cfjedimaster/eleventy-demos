---
layout: post
title: "ColdFusion 101: Sorting Directory Paths in ColdFusion"
date: "2005-08-29T17:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/08/29/ColdFusion-101-Sorting-Directory-Paths-in-ColdFusion
guid: 738
---

A reader asked how they could sort a set of directory paths in ColdFusion. The answer isn't that complex, and like most things in ColdFusion it can be done multiple ways. I thought it would be interesting to demonstrate as it may show a few tags/functions that beginners may not be familiar with. 

First off - let's look at the paths the reader wants to sort:

<div class="code">/banana/someFile.txt<br>
/banana/someOtherFile.txt<br>
/banana/dog<br>
/apple<br>
/<br>
/banana/dog/someFile.txt<br>
/banana/cat<br>
/banana<br>
/orange<br>
/banana/dog/someOtherFile.txt<br>
/banana/dog/yetAnotherFile.txt<br>
/orange/hamster/horse/someFile.txt<br>
/watermelon</div>

Imagine you got data like this. It could be in a file by itself. It could be the result of a external program, or in an email. Your first question may be - how do I turn what looks like an obvious list into a <i>real</i> ColdFusion list? Let's first see a simple way to turn a text block into a ColdFusion variable. Normally you wouldn't have to worry about this. The data would come from a file for example. In my case the text was in an email. I cut and pasted the text into a CFM file and simply surrounded it with <a href="http://livedocs.macromedia.com/coldfusion/7/htmldocs/00000327.htm">cfsavecontent</a> tags:

<div class="code"><FONT COLOR=MAROON>&lt;cfsavecontent variable=<FONT COLOR=BLUE>"paths"</FONT>&gt;</FONT>/banana/someFile.txt<br>
/banana/someOtherFile.txt<br>
/banana/dog<br>
/apple<br>
/<br>
/banana/dog/someFile.txt<br>
/banana/cat<br>
/banana<br>
/orange<br>
/banana/dog/someOtherFile.txt<br>
/banana/dog/yetAnotherFile.txt<br>
/orange/hamster/horse/someFile.txt<br>
/watermelon<br>
<FONT COLOR=MAROON>&lt;/cfsavecontent&gt;</FONT></div>

By simply wrapping the text in the cfsavecontent tags, the text is copied into a variable called "paths." So I know I'm going to need to sort these paths, but right now my data is just one big blob of text. How can I turn into something more manageable? 

Well, don't forget that ColdFusion can treat any string as a list. A list is any text that has delimiters. Typically a list will look like so: Jacob,Lynn,Noah. In this list, there are three items delimited by a comma. However, other characters can be considered a delimiter as well. In this case, we can consider the line feeds and carriage returns (the breaks basically) as delimiters. ColdFusion lets us work with lists containing multiple delimiters. All I need to do is use the <a href="http://livedocs.macromedia.com/coldfusion/7/htmldocs/00000564.htm">listToArray</a> function to treat the string as a list and turn it into an array:

<div class="code"><FONT COLOR=MAROON>&lt;cfset aPaths = listToArray(paths, <FONT COLOR=BLUE>"#chr(<FONT COLOR=BLUE>10</FONT>)##chr(<FONT COLOR=BLUE>13</FONT>)#"</FONT>)&gt;</FONT></div>

All this line says is to split the string whenever a chr(10) or a chr(13) is found. If any combination of them is found, it is considered a delimiter. So far so good? So how hard is it to sort the array? All we need is one more function: <a href="http://livedocs.macromedia.com/coldfusion/7/htmldocs/00000394.htm">arraySort</a>. The following code will take the original paths string, turn it into an array, dump it, then sort the data and dump it again:

<div class="code"><FONT COLOR=MAROON>&lt;cfset aPaths = listToArray(paths, <FONT COLOR=BLUE>"#chr(<FONT COLOR=BLUE>10</FONT>)##chr(<FONT COLOR=BLUE>13</FONT>)#"</FONT>)&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;cfdump var=<FONT COLOR=BLUE>"#aPaths#"</FONT>&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfset arraySort(aPaths, <FONT COLOR=BLUE>"textnocase"</FONT>)&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfdump var=<FONT COLOR=BLUE>"#aPaths#"</FONT>&gt;</FONT></div>

P.S. Notice something odd about the arraySort function? Unlike most ColdFusion functions, arraySort operates on the data you send to it and returns a status instead of the data it changed. If I were to dump the result of the arraySort I would get either a YES or NO, representing the result of the sort operation. If for some reason you needed to keep the original around, you would need to make a copy first. 

<b>For more information:</b> <a href="http://livedocs.macromedia.com/coldfusion/7/htmldocs/00000364.htm">List functions</a> and <a href="http://livedocs.macromedia.com/coldfusion/7/htmldocs/00000355.htm">Array functions</a>.