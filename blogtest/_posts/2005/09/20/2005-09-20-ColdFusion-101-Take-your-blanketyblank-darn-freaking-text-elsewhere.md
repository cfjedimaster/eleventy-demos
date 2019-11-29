---
layout: post
title: "ColdFusion 101: Take your blankety-blank darn freaking text elsewhere!"
date: "2005-09-20T15:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/09/20/ColdFusion-101-Take-your-blanketyblank-darn-freaking-text-elsewhere
guid: 791
---

You've just launched your latest site. It is a smashing success, especially amongst your target audience, teenagers and young adults. You built a community section where your visitors could participate in the site by posting comments, starting conversations, hooking up with friends, and generally just chatting away.
<!--more-->
Then it happens. You get an angry letter from a parent saying they found all kind of curse words and objectionable material. You don't want to have to monitor every single piece of content on your site, so what options do you have? One option would be to search for, and automatically replace, words that you don't want on your site. This is <b>not</b> perfect. The point isn't for the solution to be perfect. The point is to help alleviate a bit of the work it takes to monitor a site. Let's look at a simple user-defined function (UDF) that will check for, and replace, "naughty" words. 

Note: I know that my readers are adults. (If not, hey, kudos to you for learning ColdFusion at a young age. Be happy you don't have to learn with AppleSoft BASIC.) Normally I would use a real set of curse words in my checking since it would be incredibly silly for someone to get offended at a list of curse words in a post talking about how to <i>filter</i> such words. That being said, I'm worried about people behind firewalls with checks in them for bad content. Secondly - yes - I know - 1st Ammendment and all that. That's great. I'm not advocating censorship. I am hoping to provide people ideas with how to deal with keyword matching in general. Even if you don't want to remove the curse words, maybe you want to simply notify someone. This code could then be helpful for you. So, let's start with the code:

<div class="code"><FONT COLOR=MAROON>&lt;cffunction name=<FONT COLOR=BLUE>"sanitizeString"</FONT> returnType=<FONT COLOR=BLUE>"string"</FONT> output=<FONT COLOR=BLUE>"false"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfargument name=<FONT COLOR=BLUE>"string"</FONT> type=<FONT COLOR=BLUE>"string"</FONT> required=<FONT COLOR=BLUE>"true"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfargument name=<FONT COLOR=BLUE>"badwords"</FONT> type=<FONT COLOR=BLUE>"string"</FONT> required=<FONT COLOR=BLUE>"false"</FONT> default=<FONT COLOR=BLUE>"apple,microsoft,kerry"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfargument name=<FONT COLOR=BLUE>"replaceWith"</FONT> type=<FONT COLOR=BLUE>"string"</FONT> required=<FONT COLOR=BLUE>"false"</FONT> default=<FONT COLOR=BLUE>"--CENSORED--"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset var word = <FONT COLOR=BLUE>""</FONT>&gt;</FONT>&nbsp;&nbsp;&nbsp;<br>
<br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfloop index=<FONT COLOR=BLUE>"word"</FONT> list=<FONT COLOR=BLUE>"#arguments.badwords#"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset arguments.string = replaceNoCase(arguments.string, word, arguments.replaceWith, <FONT COLOR=BLUE>"all"</FONT>)&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfloop&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfreturn arguments.string&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cffunction&gt;</FONT></div>

The UDF is pretty simple. We have three arguments. The string to sanitize. The list of bad words, with a default. (I figure since I beat up on Bush in my last example, it was Kerry's turn.) Lastly we have the string that we will use as a replacement. So far so good? Next we loop over each word in our badword list, and use replaceNoCase to replace the word in the string. Here is an example that uses the UDF:

<div class="code"><FONT COLOR=MAROON>&lt;cfsavecontent variable=<FONT COLOR=BLUE>"test"</FONT>&gt;</FONT><br>
This is a test of the National Word System. I'm going to talk about Apple. Then I'm going to mention Microsoft.<br>
I am then going to mention John Kerry. When I'm all done, we will have a great time.<br>
<FONT COLOR=MAROON>&lt;/cfsavecontent&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT>#sanitizeString(test)#<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT></div>

Works like a charm, right? However, it is pretty easy to break. Imagine you wanted to replace the ruder form of excrement. Then suppose someone writes a nice entry on Shitake mushrooms. Take a wild guess at what will happen. Luckily, regular expressions can come to the rescue. If you haven't look at regular expressions (regex) yet, you really should. Regex allows you to do some <i>powerful</i> magic on strings. I've been using regex for around ten years now, and I've barely scratched the surface of what can be done with it. Look <a href="http://livedocs.macromedia.com/coldfusion/7/htmldocs/00000980.htm">here</a> for more information about regex and ColdFusion. For now, let's look at the second version of the UDF:

<div class="code"><FONT COLOR=MAROON>&lt;cffunction name=<FONT COLOR=BLUE>"sanitizeString2"</FONT> returnType=<FONT COLOR=BLUE>"string"</FONT> output=<FONT COLOR=BLUE>"false"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfargument name=<FONT COLOR=BLUE>"string"</FONT> type=<FONT COLOR=BLUE>"string"</FONT> required=<FONT COLOR=BLUE>"true"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfargument name=<FONT COLOR=BLUE>"badwords"</FONT> type=<FONT COLOR=BLUE>"string"</FONT> required=<FONT COLOR=BLUE>"false"</FONT> default=<FONT COLOR=BLUE>"apple,microsoft,kerry"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfargument name=<FONT COLOR=BLUE>"replaceWith"</FONT> type=<FONT COLOR=BLUE>"string"</FONT> required=<FONT COLOR=BLUE>"false"</FONT> default=<FONT COLOR=BLUE>"--CENSORED--"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset var word = <FONT COLOR=BLUE>""</FONT>&gt;</FONT><br>
<br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfloop index=<FONT COLOR=BLUE>"word"</FONT> list=<FONT COLOR=BLUE>"#arguments.badwords#"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset arguments.string = reReplaceNoCase(arguments.string, <FONT COLOR=BLUE>"\b#word#\b"</FONT>, arguments.replaceWith, <FONT COLOR=BLUE>"all"</FONT>)&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfloop&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfreturn arguments.string&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cffunction&gt;</FONT></div>

I've only made one change here. I've changed replaceNoCase with reReplaceNOCase, the regex version of replaceNoCase. I'm using a special marker around the word, "\b", that simply says, look for boundries. A boundry is defined as a change from alphanumeric characters to something else, or vice versa. Now consider my new test string:

<div class="code"><FONT COLOR=MAROON>&lt;cfsavecontent variable=<FONT COLOR=BLUE>"test"</FONT>&gt;</FONT><br>
This is a test of the National Word System. I'm going to talk about Apple. Then I'm going to mention Microsoft.<br>
I am then going to mention John Kerry. John Kerry is Kerrylicious. When I'm all done, we will have a great time.<br>
<FONT COLOR=MAROON>&lt;/cfsavecontent&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT>#sanitizeString(test)#<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
<br>
<FONT COLOR=NAVY>&lt;hr&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT>#sanitizeString2(test)#<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT></div>

If you run this, you will notice the second call leaves Kerrylicious alone, since the bad word, Kerry, is part of a bigger word. This is a double-edge sword however. If "fudge" was our bad word, it would allow "fudging" unless we specifically add it to our list. As I said, this wasn't going to be perfect. It also won't catch F(space)U(space)D(space)G(space)E(space). Luckily, that is easy enough to catch with one more modification.

<div class="code"><FONT COLOR=MAROON>&lt;cffunction name=<FONT COLOR=BLUE>"sanitizeString3"</FONT> returnType=<FONT COLOR=BLUE>"string"</FONT> output=<FONT COLOR=BLUE>"false"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfargument name=<FONT COLOR=BLUE>"string"</FONT> type=<FONT COLOR=BLUE>"string"</FONT> required=<FONT COLOR=BLUE>"true"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfargument name=<FONT COLOR=BLUE>"badwords"</FONT> type=<FONT COLOR=BLUE>"string"</FONT> required=<FONT COLOR=BLUE>"false"</FONT> default=<FONT COLOR=BLUE>"apple,microsoft,kerry"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfargument name=<FONT COLOR=BLUE>"replaceWith"</FONT> type=<FONT COLOR=BLUE>"string"</FONT> required=<FONT COLOR=BLUE>"false"</FONT> default=<FONT COLOR=BLUE>"--CENSORED--"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset var word = <FONT COLOR=BLUE>""</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset var y = <FONT COLOR=BLUE>""</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset var newword = <FONT COLOR=BLUE>""</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfloop index=<FONT COLOR=BLUE>"word"</FONT> list=<FONT COLOR=BLUE>"#arguments.badwords#"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset newword = <FONT COLOR=BLUE>""</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfloop index=<FONT COLOR=BLUE>"y"</FONT> from=<FONT COLOR=BLUE>"1"</FONT> to=<FONT COLOR=BLUE>"#len(word)#"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset newword = newword & mid(word, y,<FONT COLOR=BLUE> 1</FONT>) & <FONT COLOR=BLUE>"\s*"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfloop&gt;</FONT><br>
<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset arguments.string = reReplaceNoCase(arguments.string, <FONT COLOR=BLUE>"\b#newword#\b"</FONT>, arguments.replaceWith, <FONT COLOR=BLUE>"all"</FONT>)&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfloop&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfreturn arguments.string&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cffunction&gt;</FONT></div>

What's different this time? We take our original word and create a new word where an "\s*" is added to the end of each letter. This changes kerry to k\s*e\s*r\s*r\s*y\s*. \s simply means any white space character. It could be a space, a tab, a newline, whatever. The * simply means "0 or more times". So what we have done is changed the word to the word plus combinations of the word with white space. Since browsers ignore white space, it is a trick a user could use to get past your filters. (How dare they!)

Here is the final piece of code, with all three UDFs, a test string, and examples on how each UDF does a slightly better job "cleaning" up the string. 

<div class="code"><FONT COLOR=MAROON>&lt;cffunction name=<FONT COLOR=BLUE>"sanitizeString"</FONT> returnType=<FONT COLOR=BLUE>"string"</FONT> output=<FONT COLOR=BLUE>"false"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfargument name=<FONT COLOR=BLUE>"string"</FONT> type=<FONT COLOR=BLUE>"string"</FONT> required=<FONT COLOR=BLUE>"true"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfargument name=<FONT COLOR=BLUE>"badwords"</FONT> type=<FONT COLOR=BLUE>"string"</FONT> required=<FONT COLOR=BLUE>"false"</FONT> default=<FONT COLOR=BLUE>"apple,microsoft,kerry"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfargument name=<FONT COLOR=BLUE>"replaceWith"</FONT> type=<FONT COLOR=BLUE>"string"</FONT> required=<FONT COLOR=BLUE>"false"</FONT> default=<FONT COLOR=BLUE>"--CENSORED--"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset var word = <FONT COLOR=BLUE>""</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfloop index=<FONT COLOR=BLUE>"word"</FONT> list=<FONT COLOR=BLUE>"#arguments.badwords#"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset arguments.string = replaceNoCase(arguments.string, word, arguments.replaceWith, <FONT COLOR=BLUE>"all"</FONT>)&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfloop&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfreturn arguments.string&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cffunction&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cffunction name=<FONT COLOR=BLUE>"sanitizeString2"</FONT> returnType=<FONT COLOR=BLUE>"string"</FONT> output=<FONT COLOR=BLUE>"false"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfargument name=<FONT COLOR=BLUE>"string"</FONT> type=<FONT COLOR=BLUE>"string"</FONT> required=<FONT COLOR=BLUE>"true"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfargument name=<FONT COLOR=BLUE>"badwords"</FONT> type=<FONT COLOR=BLUE>"string"</FONT> required=<FONT COLOR=BLUE>"false"</FONT> default=<FONT COLOR=BLUE>"apple,microsoft,kerry"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfargument name=<FONT COLOR=BLUE>"replaceWith"</FONT> type=<FONT COLOR=BLUE>"string"</FONT> required=<FONT COLOR=BLUE>"false"</FONT> default=<FONT COLOR=BLUE>"--CENSORED--"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset var word = <FONT COLOR=BLUE>""</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfloop index=<FONT COLOR=BLUE>"word"</FONT> list=<FONT COLOR=BLUE>"#arguments.badwords#"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset arguments.string = reReplaceNoCase(arguments.string, <FONT COLOR=BLUE>"\b#word#\b"</FONT>, arguments.replaceWith, <FONT COLOR=BLUE>"all"</FONT>)&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfloop&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfreturn arguments.string&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cffunction&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cffunction name=<FONT COLOR=BLUE>"sanitizeString3"</FONT> returnType=<FONT COLOR=BLUE>"string"</FONT> output=<FONT COLOR=BLUE>"false"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfargument name=<FONT COLOR=BLUE>"string"</FONT> type=<FONT COLOR=BLUE>"string"</FONT> required=<FONT COLOR=BLUE>"true"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfargument name=<FONT COLOR=BLUE>"badwords"</FONT> type=<FONT COLOR=BLUE>"string"</FONT> required=<FONT COLOR=BLUE>"false"</FONT> default=<FONT COLOR=BLUE>"apple,microsoft,kerry"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfargument name=<FONT COLOR=BLUE>"replaceWith"</FONT> type=<FONT COLOR=BLUE>"string"</FONT> required=<FONT COLOR=BLUE>"false"</FONT> default=<FONT COLOR=BLUE>"--CENSORED--"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset var word = <FONT COLOR=BLUE>""</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset var y = <FONT COLOR=BLUE>""</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset var newword = <FONT COLOR=BLUE>""</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfloop index=<FONT COLOR=BLUE>"word"</FONT> list=<FONT COLOR=BLUE>"#arguments.badwords#"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset newword = <FONT COLOR=BLUE>""</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfloop index=<FONT COLOR=BLUE>"y"</FONT> from=<FONT COLOR=BLUE>"1"</FONT> to=<FONT COLOR=BLUE>"#len(word)#"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset newword = newword & mid(word, y,<FONT COLOR=BLUE> 1</FONT>) & <FONT COLOR=BLUE>"\s*"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfloop&gt;</FONT><br>
<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset arguments.string = reReplaceNoCase(arguments.string, <FONT COLOR=BLUE>"\b#newword#\b"</FONT>, arguments.replaceWith, <FONT COLOR=BLUE>"all"</FONT>)&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfloop&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfreturn arguments.string&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cffunction&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfsavecontent variable=<FONT COLOR=BLUE>"test"</FONT>&gt;</FONT><br>
This is a test of the National Word System. I'm going to talk about Apple. Then I'm going to mention Microsoft.<br>
I am then going to mention John Kerry. John Kerry is Kerrylicious. When I'm all done, we will have a great time.<br>
I voted for K E R R Y!.<br>
<FONT COLOR=MAROON>&lt;/cfsavecontent&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT>#sanitizeString(test)#<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
<br>
<FONT COLOR=NAVY>&lt;hr&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT>#sanitizeString2(test)#<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
<br>
<FONT COLOR=NAVY>&lt;hr&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT>#sanitizeString3(test)#<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT></div>