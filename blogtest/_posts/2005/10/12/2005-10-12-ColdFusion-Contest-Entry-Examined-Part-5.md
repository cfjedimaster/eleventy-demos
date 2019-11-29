---
layout: post
title: "ColdFusion Contest Entry Examined - Part 5"
date: "2005-10-12T17:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/10/12/ColdFusion-Contest-Entry-Examined-Part-5
guid: 846
---

ColdFusion Contest Entry Examined - Part 5
Welcome to (yet another) entry in the <a href="http://ray.camdenfamily.com/index.cfm/2005/9/20/Contest-Shall-We-Play-a-Game">ColdFusion contest</a>. This is turning into a much bigger series than I imagined, but there is so much to learn from looking at how people solve problems. Are people getting bored yet? Check out the <a href="http://ray.camdenfamily.com/index.cfm/2005/10/10/ColdFusion-Contest-Entry-Examined--Part-4">last entry</a> which also contains links to all the old entries as well.
<!--more-->
Our new entry can be viewed <a href="http://ray.camdenfamily.com/demos/contest1/entry5/contest1.cfm">here</a>. The code consists of two files. 

<b>contest1.cfm:</b>
<code>
&lt;!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"&gt;
&lt;html&gt;
&lt;head&gt;
&lt;meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1"&gt;
&lt;title&gt;Guess My Number Contest&lt;/title&gt;
&lt;/head&gt;

&lt;body&gt;
&lt;cfoutput&gt;
&lt;form action="contest2.cfm" method="post"&gt;
Please, pick a number between 1 and 100 &lt;BR&gt;
Your number: &lt;input size="3" maxlength="3" type="text" name="test_number"&gt;
&lt;input type="hidden" name="right_number" value="#RandRange(1,100)#"&gt;
&lt;input type="hidden" name="total_times" value="1"&gt;
&lt;input type="submit" name="GO" value="GO"&gt;
&lt;/form&gt;
&lt;/cfoutput&gt;
&lt;/body&gt;
&lt;/html&gt;
</code>

<b>contest2.cfm:</b>
<code>
&lt;!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"&gt;
&lt;html&gt;
&lt;head&gt;
&lt;meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1"&gt;
&lt;title&gt;Guess My Number Contest&lt;/title&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;!-- Is this the number in the good range--&gt;
&lt;cfif #form.test_number# GT 100 OR #form.test_number# LT 1&gt;
&lt;cfoutput&gt;
Your number is not within 1 and 100&lt;BR&gt;
&lt;cfset total_times_added = #form.total_times#&gt;
&lt;form action="contest2.cfm" method="post"&gt;
Please, pick a number between 1 and 100 &lt;BR&gt;
Your number: &lt;input size="3" maxlength="3" type="text" name="test_number"&gt;
&lt;input type="hidden" name="right_number" value="#form.right_number#"&gt;
&lt;input type="hidden" name="total_times" value="#total_times_added#"&gt;
&lt;input type="submit" name="GO" value="GO"&gt;
&lt;/form&gt;
&lt;/cfoutput&gt;
&lt;cfelse&gt;


&lt;!-- Is this the right number --&gt;
&lt;cfif form.test_number IS form.right_number&gt;
You got it in &lt;cfoutput&gt; #form.total_times# &lt;/cfoutput&gt;times. Congratulations!&lt;BR&gt;
Wanna play &lt;a href="contest1.cfm"&gt;again&lt;/a&gt; ???
&lt;/cfif&gt;

&lt;!-- Is this the number too high--&gt;
&lt;cfif #form.test_number# GT #form.right_number#&gt;
&lt;cfoutput&gt;
#form.test_number# is too high, please try again&lt;BR&gt;
&lt;cfset total_times_added = #form.total_times# + 1&gt;
&lt;form action="contest2.cfm" method="post"&gt;
Your number: &lt;input size="3" maxlength="3" type="text" name="test_number"&gt;
&lt;input type="hidden" name="right_number" value="#form.right_number#"&gt;
&lt;input type="hidden" name="total_times" value="#total_times_added#"&gt;
&lt;input type="submit" name="GO" value="GO"&gt;
&lt;/form&gt;
&lt;/cfoutput&gt;
&lt;/cfif&gt;

&lt;!-- Is this the number too low--&gt;
&lt;cfif form.test_number LT form.right_number&gt;
&lt;cfoutput&gt;
#form.test_number# is too low, please try again&lt;BR&gt;
&lt;cfset total_times_added = #form.total_times# + 1&gt;
&lt;form action="contest2.cfm" method="post"&gt;
Your number: &lt;input size="3" maxlength="3" type="text" name="test_number"&gt;
&lt;input type="hidden" name="right_number" value="#form.right_number#"&gt;
&lt;input type="hidden" name="total_times" value="#total_times_added#"&gt;
&lt;input type="submit" name="GO" value="GO"&gt;
&lt;/form&gt;
&lt;/cfoutput&gt;
&lt;/cfif&gt;
&lt;/cfif&gt;
&lt;/body&gt;

&lt;/html&gt;
</code>

I think this code sample is an excellent example of a topic I wanted to bring up at a later time - organization, specifically, organization of a form. ColdFusion is a simple language. One of the primary examples of how easy it is can be demonstrated by examining a simple form. What <i>isn't</i> so obvious is how one should set up a form to handle the display of the form, the validation of the form, and finally the result of the successful completion of the form. 

Not to be too mean, but I think this code sample shows a perfect example of how <i>not</i> to do things. Let's start with contest1.cfm. This file displays the initial form and posts to contest2. After that, the file isn't used again until you finish the game. 

Now look in contest2.cfm. Notice that for the scenario where the user guesses too high or too low, the entire form is duplicated. The same applies for a case where the number was below 1 or above 100. Taken together, the same form is written four times. As you can imagine, when the designer comes in and hands you the spec sheet, you are in trouble. 

The primary solution for this is self-posting forms. All this is means is that your form posts to itself, instead of some other file. Here is a <b>pseudo-code</b> example of what I mean:

<code>
if(form was submitted) {
  do a bunch of processing
  was the form ok?
    email someone, or store to db, or both
 }

was there an error? 
  show it

show the form
</code>

This isn't terribly complex, but does prevent a lot of the problems the submission above creates. It also makes it a bit simpler to handle since you are dealing with one file, not two. (Of course, some validation may be in outside sources, like CFCs, but let's not worry about that right now.)

Outside of that - there isn't much else to complain about. He does forget to go all the way with validation, but I've made that complaint about all the other entries (and I make that mistake myself). I did notice a few extra uses of # signs where he didn't need them:

<code>
&lt;cfif #form.test_number# GT 100 OR #form.test_number# LT 1&gt;
</code>

This could be:

<code>
&lt;cfif form.test_number GT 100 OR form.test_number LT 1&gt;
</code>

The basic rule to remember is - if you aren't in a cfoutput, you typically don't need the pound signs. The only other time you will need them is inside quotes, for example:

<code>
&lt;cfset formalName = "Mr. #form.name#"&gt;
</code>

But even that could be:

<code>
&lt;cfset formalName = "Mr. " & form.name&gt;
</code>