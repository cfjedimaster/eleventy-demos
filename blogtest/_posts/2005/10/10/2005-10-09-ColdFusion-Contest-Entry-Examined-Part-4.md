---
layout: post
title: "ColdFusion Contest Entry Examined - Part 4"
date: "2005-10-10T11:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/10/10/ColdFusion-Contest-Entry-Examined-Part-4
guid: 842
---

Welcome to the fourth (getting bored yet?) entry in the <a href="http://ray.camdenfamily.com/index.cfm/2005/9/20/Contest-Shall-We-Play-a-Game">ColdFusion contest</a> I am running. If you haven't yet, take a look at entries <a href="http://ray.camdenfamily.com/index.cfm/2005/10/4/ColdFusion-Contest-Entry-Examined">one</a>, <a href="http://ray.camdenfamily.com/index.cfm/2005/10/5/ColdFusion-Contest-Entry-Examind--Part-2">two</a>, and <a href="http://ray.camdenfamily.com/index.cfm/2005/10/7/ColdFusion-Contest-Entry-Examined--Part-3">three</a>.
<!--more-->
This entry is a bit simpler so I won't have much to say with it. You can demo it <a href="http://ray.camdenfamily.com/demos/contest1/entry4">here</a>, and the source code follows:

<b>Application.cfm:</b>
<code>
&lt;cfapplication name="GuessaNumber" applicationtimeout="#CreateTimeSpan(1,0,0,0)#" sessionmanagement="true" sessiontimeout="#CreateTimeSpan(1,0,0,0)#" setclientcookies="true"&gt;
</code>

<b>index.cfm</b>
<code>
&lt;script&gt;
var xmlhttp=false;
/*@cc_on @*/
/*@if (@_jscript_version &gt;= 5)
// JScript gives us Conditional compilation, we can cope with old IE versions.
// and security blocked creation of the objects.
 try {
  xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
 } catch (e) {
  try {
   xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  } catch (E) {
   xmlhttp = false;
  }
 }
@end @*/
if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
  xmlhttp = new XMLHttpRequest();
}

// function getfile will perform our request using our created xmlhttp object //
&lt;cfoutput&gt;
function guess(number) {
	var Current = "guess.cfm?guess="+number+"&RandomKey=" + Math.random() * Date.parse(new Date());
	xmlhttp.open("GET", Current, true);
	xmlhttp.onreadystatechange=function() {
		if (xmlhttp.readyState==4) {
		document.getElementById('results').innerHTML = document.getElementById('results').innerHTML + xmlhttp.responseText;
		}
	}
	xmlhttp.send(null)
}
&lt;/cfoutput&gt;
&lt;/script&gt;


&lt;body&gt;

&lt;cfif NOT isNumeric("session.HiddenNumber")&gt;
  &lt;cfset session.HiddenNumber = RandRange(1,100)&gt;
&lt;/cfif&gt;

&lt;style&gt;
#results {
  position: absolute;
  width: 400px;
  border: 1px solid black;
}

#guess {
  position: absolute;
  margin-left: 410px;
  width: 300px;
  height: auto;
  padding: 10px;
  border: 1px solid black;
}

.low {
  color: blue;
}

.high {
  color: red;
}
.win {
  color: purple;
}
&lt;/style&gt;

&lt;div id="results"&gt;
I am thinking of a number between 1 and 100!  Guess what it is!&lt;BR&gt;
&lt;/div&gt;

&lt;div id="guess"&gt;
&lt;h1&gt;Guess the Number!&lt;/h1&gt;
&lt;i&gt;Please key in the number you wish to guess, then click the link!&lt;/i&gt;
&lt;form name="myform"&gt;
  &lt;input name="myguess"&gt; &lt;a href="javascript:void(0);" onclick="guess(myform.myguess.value);" onkeypress="checkenter();"&gt;Click to Guess!&lt;/a&gt;
&lt;/form&gt;
&lt;/div&gt;
</code>

<b>guess.cfm</b>
<code>
&lt;cfif NOT IsNumeric(URL.Guess)&gt;
I am sorry, you must enter a number to guess. Please try again!
&lt;cfabort&gt;
&lt;/cfif&gt;
&lt;cfset yourguess="#session.Hiddennumber - URL.guess#"&gt;

&lt;cfoutput&gt;
&lt;cfif yourguess eq 0&gt;
  &lt;p class="win"&gt;You got it! The number was indeed #Session.Hiddennumber#!&lt;BR&gt;
  &lt;cfset Session.Hiddenmenu = 'done'&gt;
  &lt;a href="index.cfm"&gt;Click to Play Again!&lt;/a&gt;&lt;/p&gt;
&lt;cfelseif yourguess LT 0&gt;
  &lt;p class="high"&gt;You guessed #URL.Guess# - that is too high!&lt;/p&gt;
&lt;cfelseif yourguess GT 0&gt;
  &lt;p class="low"&gt;You guessed #URL.Guess# - that is too low!&lt;/p&gt;
&lt;/cfif&gt;
&lt;/cfoutput&gt;
</code>

Here are my comments in no particular order.

He uses a simple form of AJAX, which means he loses points for applying a buzzword. (Kidding.) For a simple reload, it seems like overkill, but I kinda like it. 

As I've mentioned in the previous entries, I did <b>not</b> expect great design, but I have been <b>very</b> pleased with the simple things these beginners are doing. In this demo, he uses two different colors for the messages for "Too High" and "Too Low". Simple - yet very effective. 

He uses a timeout value for his application, and session, of one day. I'd say that is a bit of a security risk for his session data. Not a big huge deal, obviously, but I'd question why a session needs to stay around for a full day. I'd recommend changing it to the default 20 minute timeout unless he has a good reason.

He does validation for the guess number (yeah!), but only part way. He checks to ensure the guess is numeric, but does not check to see if it is an integer (3.14159 is numeric as well) and does not check to see that it is between one and a hundred. This brings me back to my last <a href="http://ray.camdenfamily.com/index.cfm/2005/9/14/Macrochat-Recording-and-Downloads">Macrochat</a> about being sure to go the extra mile in validation. 

Lastly, there is another bug he missed, and I missed it as well. I had noticed this block:

<code>
&lt;cfif NOT isNumeric("session.HiddenNumber")&gt;
  &lt;cfset session.HiddenNumber = RandRange(1,100)&gt;
&lt;/cfif&gt;
</code>

And I had asked myself - why isn't this code throwing an error since he never defaulted session.HiddenNumber? It took me a minute or so before I noticed the quotes around session.hiddenNumber. He wasn't checking the <i>variable</i>, but the actual string. What he should have had was this:

<code>
&lt;cfif NOT structKeyExists(session,"hiddenNumber") or not isNumeric(session.hiddenNumber)&gt;
  &lt;cfset session.HiddenNumber = RandRange(1,100)&gt;
&lt;/cfif&gt;
</code>

Bugs that don't throw errors are always the hardest to debug, luckily this one was a bit easier once my eyes actually focused. (Need...more...coffee...) I kept the isNumeric check in there since his "win" state sets the value to "done" as a way to flag index.cfm to reset the value. You could change that to simply remove the value as well as an alternative.