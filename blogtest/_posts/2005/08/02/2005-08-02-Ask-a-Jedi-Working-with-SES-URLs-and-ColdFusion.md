---
layout: post
title: "Ask a Jedi: Working with SES URLs and ColdFusion"
date: "2005-08-02T17:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/08/02/Ask-a-Jedi-Working-with-SES-URLs-and-ColdFusion
guid: 664
---

Joe asks:

<blockquote>
I really like how you did the udf.cfm/NAME on your site.  Can you point me to where and how you did this and/or if this is a UDF.  Thanks!!!
</blockquote>

Joe is talking about the "shorthand" URL tool I built at CFLib.org. It allows for simpler URLs like so: <a href="http://www.cflib.org/udf.cfm/isEmail"> http://www.cflib.org/udf.cfm/isEmail</a>. How is this done? 

It's really two parts. First we have to recognize the "weird" URL form - and once we do - we then parse it. The second part is specific to <a href="http://www.cflib.org">CFLib</a> and I'll only cover it briefly.

To begin with - whenever a URL comes in with the form, http://host/filename.cfm/stuff/at/the/end, your web server will recognize that "filename.cfm" is the file you want. It will then take the "extra" stuff and store it in a CGI variable, path_info. So consider this blog entry. Everything after index.cfm is located in the path_info CGI variable. Sometimes - this CGI variable will also contain the filename. Luckily, Michael Dinowitz wrote a nice little article showing sample regex to "clean" this value. I don't seem to see a "direct" link to his article, but it on the front page at <a href="http://www.houseoffusion.com">House of Fusion</a>. (Look for the article, "Search Engine Safe (SES) URLs.) In this article he has a full blown UDF for dealing with the values, but I'm going to focus just on the regex. This example below shows it in action:

<div class="code"><FONT COLOR=MAROON>&lt;cfset pathInfo = reReplaceNoCase(trim(cgi.path_info), <FONT COLOR=BLUE>".+\.cfm/? *"</FONT>, <FONT COLOR=BLUE>""</FONT>)&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT><br>
cgi.path_info=#cgi.path_info#<FONT COLOR=NAVY>&lt;br&gt;</FONT><br>
stripped: #pathInfo#<br>
<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT></div>

You don't have to worry too much about the regex, it basically just handles removing any potential filename from the CGI variable. I'm not seeing any filename on my Apache or IIS server, but I know I've seen it in the past.

At this point we have a pathInfo variable that will store any information that added to the end of our filename. How do we parse this? Obviously you have a ColdFusion list using the / character are a delimiter. In my example above, "http://host/filename/stuff/at/the/end", my pathInfo variable would have: "/stuff/at/the/end". How I parse that is up to the application. In BlogCFC, I check the length of the value (using listLen and / as the delimiter) to make sure the length is 4. The firs three values refer to the date and the last item refers to the alias. 

You may want to use a format that is like typical URL variables. Something like: http://host/filename.cfm/product/323. In this form, the URL is simply another way of saying: http://host/filename.cfm?product=323. To parse this form, I would have to loop over the list and set URL variables. Here is a sample that will do that:

<div class="code">function parseSES() {<br>
&nbsp;&nbsp;&nbsp;var pathInfo = reReplaceNoCase(trim(cgi.path_info), '.+\.cfm/? *', '');<br>
&nbsp;&nbsp;&nbsp;var i = 1;<br>
&nbsp;&nbsp;&nbsp;var lastKey = <FONT COLOR=BLUE>""</FONT>;<br>
&nbsp;&nbsp;&nbsp;var value = <FONT COLOR=BLUE>""</FONT>;<br>
&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;if(not len(pathInfo)) return;<br>
<br>
&nbsp;&nbsp;&nbsp;for(i=1; i lte listLen(pathInfo, <FONT COLOR=BLUE>"/"</FONT>); i=i+1) {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;value = listGetAt(pathInfo, i, <FONT COLOR=BLUE>"/"</FONT>);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if(i mod 2 is<FONT COLOR=BLUE> 0</FONT>) url[lastKey] = value; <br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;else lastKey = value;<br>
&nbsp;&nbsp;&nbsp;}<br>
<FONT COLOR=GRAY><I>&nbsp;&nbsp;&nbsp;//did we end with a <FONT COLOR=BLUE>"dangler?"</FONT></I></FONT><br>
&nbsp;&nbsp;&nbsp;if((i-1) mod 2 is<FONT COLOR=BLUE> 1</FONT>) url[lastKey] = <FONT COLOR=BLUE>""</FONT>; <br>
&nbsp;&nbsp;&nbsp;return;<br>
&nbsp;&nbsp;&nbsp;<br>
}</div>

What are we doing here? As I mentioned before, we begin by looking for stuff after the final slash. If we find nothing, we exit the function. (Normally a UDF returns something. A return statement by itself just means to leave the function without returning anything at all.) 

Next we treat the value as a list and loop over it. We want to do things in twos - in other words, the first item is a variable, the second is a value. We simply check our list counter, i, and on odd numbers, we store the value as "lastKey", and on even numbers, we write to the URL scope. (UDFs should never directly access variables outside their own scope. Except when they should. ;) This code assumes an even number of values. So what happens if the pathInfo variable is odd? (Ex: /products/5/foo) We treat this then as a "empty" variable and create the value in the URL scope with an empty string. This could be used as a flag. So for example, /productid/5/short, could mean set url.productid to 5, which is the database record to load, and "short" simply means show the shorthand version of the content.