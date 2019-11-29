---
layout: post
title: "ColdFusion Contest Entry Examined - Part 2"
date: "2005-10-05T10:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/10/05/ColdFusion-Contest-Entry-Examind-Part-2
guid: 830
---

Today we are going to look at the second <a href="http://ray.camdenfamily.com/index.cfm/2005/9/20/Contest-Shall-We-Play-a-Game">contest</a> entry. What is interesting about this one is that it takes the opposite approach from the <a href="http://ray.camdenfamily.com/index.cfm/2005/10/4/ColdFusion-Contest-Entry-Examined">first entry</a>. In the first entry, the user had to guess the right number. In this entry, the computer has to guess it. This is what I had originally wanted, but to be honest, either way is fine, so I have no problem with the first entry's approach.
<!--more-->
The second entry can be viewed <a href="http://ray.camdenfamily.com/demos/contest1/entry2/index.cfm">here</a>. Please go take a look at it before reading on. Now that you have looked at it, here is the code.

<code>
&lt;!--Set Default Values --&gt;
&lt;cfparam name="numhigh" default="100"&gt;
&lt;cfparam name="numlow" default="1"&gt;
&lt;cfparam name="numcurrent" default="0"&gt;
&lt;cfparam name="guess" default=""&gt;

&lt;!--- Set Try Counter ---&gt;
&lt;cfparam name="counter" default="-1"&gt;
&lt;cfset counter=counter + 1&gt;

&lt;!-- If guess is HIGH --&gt;
&lt;cfif guess is 'High'&gt;
&lt;cfset numhigh=numcurrent&gt;
&lt;/cfif&gt;

&lt;!-- If guess is LOW --&gt;
&lt;cfif guess is 'Low'&gt;
&lt;cfset numlow=numcurrent&gt;
&lt;/cfif&gt;

&lt;!--- Generate random number between low and high set points ---&gt;
&lt;cfset oldcurrent = numcurrent&gt;
&lt;cfset numcurrent= RandRange(numlow, numhigh)&gt;
&lt;cfloop condition="oldcurrent is numcurrent"&gt;
&lt;cfset numcurrent= RandRange(numlow, numhigh)&gt;
&lt;/cfloop&gt;



&lt;!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"&gt;
&lt;html xmlns="http://www.w3.org/1999/xhtml"&gt;
&lt;head&gt;
&lt;meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" /&gt;
&lt;title&gt;Number Guessing Game&lt;/title&gt;
&lt;style type="text/css"&gt;
&lt;!--
.style1 {
	color: #999999;
	font-family: Arial, Helvetica, sans-serif;
	font-size: 14px;
	font-weight: bold;
	text-decoration: none;
}
.style2 {
	color: #FF0000;
	font-weight: bold;
	text-decoration: none;
}
.textformat {
	font-family: Arial, Helvetica, sans-serif;
	font-size: 14px;
	text-decoration: none;
}
.start {
	font-family: Arial, Helvetica, sans-serif;
	font-size: 14px;
	font-weight: bold;
	color: #FF0000;
}
.guess {
	font-family: Arial, Helvetica, sans-serif;
	font-size: 14px;
	font-weight: bold;
	color: #0000FF;
	text-decoration: none;
}
.title {
	font-family: Arial, Helvetica, sans-serif;
	font-size: 18px;
	font-weight: normal;
	color: #000099;
	text-decoration: none;
}
.newgame {
	font-family: Arial, Helvetica, sans-serif;
	font-size: 10px;
	color: #000099;
}
--&gt;
&lt;/style&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;table width="100%" border="0" class="textformat"&gt;
  &lt;tr&gt;
    &lt;td align="center"&gt;&lt;!--Title area --&gt;
	 &lt;span class="title"&gt;Number guessing game&lt;/span&gt;
	&lt;/td&gt;
  &lt;/tr&gt;
  &lt;tr&gt;
    &lt;td align="center"&gt;&lt;!--Title area --&gt;
	 &lt;p&gt;
	&lt;/td&gt;
  &lt;/tr&gt;
  &lt;tr&gt;
    &lt;td&gt;&lt;!--Data Area --&gt;


&lt;cfif guess is ''&gt;
&lt;table width="100%" border="0" class="textformat"&gt;
  &lt;tr&gt;
    &lt;td align="center"&gt;Welcome to the number guessing game. Please select a number between 1 and 100. Once you have your number selected, please click Start.&lt;/td&gt;
  &lt;/tr&gt;
  &lt;tr&gt;
    &lt;td align="center"&gt;&lt;a href="index.cfm?guess=new" class="start"&gt;Start&lt;/a&gt;&lt;/td&gt;
  &lt;/tr&gt;
&lt;/table&gt;



&lt;cfelse&gt;


&lt;cfif guess is 'correct'&gt;
&lt;table width="100%" border="0" class="textformat"&gt;
  &lt;tr&gt;
    &lt;td align="center"&gt;I guessed your number within &lt;cfoutput&gt;#counter#&lt;/cfoutput&gt; tries.&lt;/td&gt;
  &lt;/tr&gt;
  &lt;tr&gt;
    &lt;td align="center"&gt;&lt;a href="index.cfm?guess=new" class="start"&gt;Play Again&lt;/a&gt;&lt;/td&gt;
  &lt;/tr&gt;
&lt;/table&gt;



&lt;cfelse&gt;


&lt;cfif numcurrent gte 0&gt;


&lt;table width="100%" border="0" cellpadding="0" cellspacing="0" class="textformat"&gt;
  &lt;tr&gt;
    &lt;td colspan="100" align="center"&gt;
		&lt;cfoutput&gt;
			My current guess is the number is &lt;span class="style2"&gt;#numcurrent#&lt;/span&gt;
			&lt;p&gt; Is this number
			&lt;cfif numcurrent is numhigh&gt;
                &lt;span class="style1"&gt; Low&lt;/span&gt;
			&lt;cfelse&gt;
			&lt;a href="index.cfm?numcurrent=#numcurrent#&numhigh=#numhigh#&numlow=#numlow#&guess=low&counter=#counter#" class="guess"&gt;Low&lt;/a&gt; 
			&lt;/cfif&gt;
			: 
			&lt;a href="index.cfm?numcurrent=#numcurrent#&numhigh=#numhigh#&numlow=#numlow#&guess=correct&counter=#counter#" class="guess"&gt;Correct&lt;/a&gt;
			 : 
			 &lt;cfif numcurrent is numlow&gt;
               &lt;span class="style1"&gt; High&lt;/span&gt;
			 &lt;cfelse&gt;
			 &lt;a href="index.cfm?numcurrent=#numcurrent#&numhigh=#numhigh#&numlow=#numlow#&guess=high&counter=#counter#" class="guess"&gt;High&lt;/a&gt;
			 &lt;/cfif&gt;
		&lt;/cfoutput&gt;
	&lt;/td&gt;
  &lt;/tr&gt;
  &lt;tr&gt;
    &lt;td colspan="100" align="center"&gt;&lt;hr /&gt;&lt;/td&gt;
  &lt;/tr&gt;
  &lt;tr&gt;
    &lt;td colspan="100" align="center"&gt;Current guess range&lt;/td&gt;
  &lt;/tr&gt;
  &lt;tr&gt;
    &lt;td colspan="100" align="center"&gt;&nbsp;&lt;/td&gt;
  &lt;/tr&gt;
  &lt;tr&gt;
  &lt;cfloop from="1" to="100" index="numtest" step="1"&gt;
  	&lt;cfif numtest gte numlow and numtest lte numhigh&gt;
		&lt;td width="1%" bgcolor="#00FF00"&gt;&nbsp;&lt;/td&gt;
  	&lt;cfelse&gt;
		&lt;td width="1%" bgcolor="#FF0000"&gt;&nbsp;&lt;/td&gt;
  	&lt;/cfif&gt;
    
  &lt;/cfloop&gt;
  &lt;/tr&gt;
  &lt;cfoutput&gt;
  &lt;cfset colspannum=100 - numlow&gt;  
  &lt;tr&gt;
  	&lt;td colspan="#numlow#" align="right"&gt;#numlow#&lt;/td&gt;

  	&lt;td colspan="#colspannum#"&gt;&lt;/td&gt;
  &lt;/tr&gt;
	&lt;cfset colspannum=100 - numhigh&gt; 
  &lt;tr&gt;
  	&lt;td colspan="#numhigh#" align="right"&gt;#numhigh#&lt;/td&gt;
  	&lt;td colspan="#colspannum#"&gt;&lt;/td&gt;
  &lt;/tr&gt;
  &lt;tr&gt;
    &lt;td align="center" class="newgame" colspan="100"&gt;&lt;/td&gt;
  &lt;/tr&gt;
  &lt;tr&gt;
    &lt;td align="center" class="newgame" colspan="100"&gt;&lt;a href="index.cfm?guess=new" class="newgame"&gt;Start new game&lt;/a&gt;&lt;/td&gt;
  &lt;/tr&gt;
&lt;!---  &lt;tr&gt;
    &lt;td colspan="100" align="center"&gt;Low:#numlow# &lt;br /&gt; High: #numhigh# &lt;br /&gt; Current: #numcurrent# &lt;br /&gt; Counter: #counter#&lt;/td&gt;
  &lt;/tr&gt;---&gt;
  &lt;/cfoutput&gt;
&lt;/table&gt;

&lt;/cfif&gt;
&lt;/cfif&gt;
&lt;/cfif&gt;



&lt;/td&gt;
  &lt;/tr&gt;

&lt;/table&gt;
&lt;/body&gt;
&lt;/html&gt;
              &lt;/span&gt;
</code>

So - let's talk about it. The first thing that struct me was the graphical representation of the guesses. I <b>love</b> this. I wasn't concerned about the design of these entries (I'm an 'advanced' programmer but can't design my way out of a paper bag), but this is a simple little thing that I thought was just plain cool. You can actually see the computer narrowing down it's choices. Nice.

Now it's time to get nasty. Like the first entry, this entry does not make use of RAM based variables in order to store information. All information is passed via URL parameters. One problem I have with the code is that he does not use the URL scope. This isn't a bug per se, but it is generally accepted as best practice to specify the scope. (Note my comments from the <a href="http://ray.camdenfamily.com/index.cfm/2005/10/4/ColdFusion-Contest-Entry-Examined">first entry</a>.) The fact that he uses URL variables also makes them easy to change. One of the first things I did was change a URL variable, numhigh, to an invalid value ("apple"), and the application broke. This is a typical mistake for beginner programmers, and is something I covered in my <a href="http://ray.camdenfamily.com/index.cfm/2005/9/14/Macrochat-Recording-and-Downloads">Macrochat</a>. You <i>must</i> perform validation before working with any variables from an outside source. In this case, he could have used isNumeric, and then check for integer (don't forget that 3.14159 is a number), and lastly check to ensure it was between one and a hundred. Similar validation must be added to all the URL variables he used. I was actually able to get the application to go into an infinite loop by playing with the URL values. (I modified the code on the live version so this wouldn't happen - hopefully.) This is one more reason why using the full scope would help. It gives you a visual cue that the variable is a URL value and cannot be trusted.

One thing I liked about his entry was how he guessed a new number. This is <b>not</b> the best way. The best way, as far as I know, is to make guesses exactly in the middle. I.e., first guess 50, and if too low, then 75, etc. However, his randomized guess is more fun. One of the issues game designers run into is "dumbing down" the computer. If they didn't do this, the computer would either win every time, or perform the exact same actions every time. I don't know if this was the author's intention, but I'm going to assume it was. 

In general, I don't have much else to say. I'm not happy with his formatting, but I've yet to find two developers who would actually agree on the same code formatting style (unless they have no choice). Does anyone else have a comment? (And remember, be nice!)