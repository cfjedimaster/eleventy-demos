---
layout: post
title: "ColdFusion Quickie - Scan and Report on Exception Logs"
date: "2009-08-19T22:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/08/19/ColdFusion-Quickie-Scan-and-Report-on-Exception-Logs
guid: 3496
---

A client sent me a set of exception logs and asked me to make fixes where I could. I have a limited set of hours so I needed to focus on the errors that occurred most often. I wrote up a quick ColdFusion script that would parse the exception logs and keep count of unique errors. Here is the code I came up with along with some explanation as to how it works.
<!--more-->
First, I specified a list of files. This could be a cfdirectory call too I suppose:

<code>
&lt;!--- list of logs to parse ---&gt;
&lt;cfset logs = "/Users/ray/Desktop/fwfeedsubmission/examples-sjc1-3_exception.log,/Users/ray/Desktop/fwfeedsubmission/examples-sjc1-4_exception.log"&gt;
</code>

I then created a structure to store unique errors:

<code>
&lt;cfset errors = {}&gt;
</code>

Next, I looped over each file and each line in the file:

<code>
&lt;cfloop index="logfile" list="#logs#"&gt;
    &lt;cfloop index="line" file="#logFile#"&gt;
</code>

Exception logs have 'blocks' of errors where one line looks like a standard CFML log and is then followed by more details and a stack track. So for example:

<blockquote>
"Error","jrpp-541","06/21/09","20:24:31",,"Context validation error for the cfmail tag.The start tag must have a matching end tag.  An explicit end tag can be provided by adding </cfmail>.  If the body of the tag is empty, you can use the shortcut <cfmail .../>. The specific sequence of files included or processed is: /Library/WebServer/Documents/test3.cfm, line: 3 "<br/>
coldfusion.compiler.UnmatchedStartTagException: Context validation error for the cfmail tag.<br/>
	at coldfusion.compiler.cfml40.start(cfml40.java:2769)<br/>
	at coldfusion.compiler.NeoTranslator.parsePage(NeoTranslator.java:503)
</blockquote>

So my code simply says - look for "Error", in front, and if so, get the item:

<code>
        &lt;!--- only use if line begins with "Error", ---&gt;
		&lt;cfif find("""Error"",", line)&gt;
		  &lt;!--- convert to array, keeping nulls ---&gt;
		  &lt;cfset arr = listToArray(line, "," , true)&gt;
		  &lt;!--- remove 1-5 ---&gt;
		  &lt;cfloop index="x" from="1" to="5"&gt;
    		  &lt;cfset arrayDeleteAt(arr, 1)&gt;
		  &lt;/cfloop&gt;
		  
		  &lt;cfset errorLog = arrayToList(arr, " ")&gt;
		  &lt;cfif not structKeyExists(errors, errorLog)&gt;
		      &lt;cfset errors[errorLog] = 0&gt;
		  &lt;/cfif&gt;
		  &lt;cfset errors[errorLog]++&gt;
		&lt;/cfif&gt;
</code>

What's with the funky listToArray/arrayToList? Well some of the error detail messages includes commas, but the first 5 items never do. So I convert the line to an array and tell it to include empty items. I then delete the first 5. I'm not left with N items, where N is dependent on how many commas were in the message. I convert it back to a list with a space delimiter and I'm good to go.

Next I wrap the loops:

<code>
    &lt;/cfloop&gt;
&lt;/cfloop&gt;
</code>

Reporting is as simple as doing a structSort and displaying an ugly table:

<code>
&lt;cfset sorted = structSort(errors,"numeric","desc")&gt;
&lt;table border="1"&gt;
    &lt;tr&gt;
        &lt;th&gt;Error&lt;/th&gt;
        &lt;th&gt;Count&lt;/th&gt;
    &lt;/tr&gt;
    &lt;cfloop index="k" array="#sorted#"&gt;
	&lt;cfoutput&gt;
	   &lt;tr&gt;
	       &lt;td&gt;#k#&lt;/td&gt;
		   &lt;td&gt;#numberFormat(errors[k])#&lt;/td&gt;
	   &lt;/tr&gt;
	&lt;/cfoutput&gt;
    &lt;/cfloop&gt;
&lt;/table&gt;
</code>

Here is some sample output from my local exception.log:

<img src="https://static.raymondcamden.com/images/Picture 336.png" />

Enjoy. The complete script may be found here:

<code>
&lt;!--- list of logs to parse ---&gt;
&lt;cfset logs = "/Users/ray/Desktop/fwfeedsubmission/examples-sjc1-3_exception.log,/Users/ray/Desktop/fwfeedsubmission/examples-sjc1-4_exception.log,/Users/ray/Desktop/fwfeedsubmission/examples-sjc1-5_exception.log,/Users/ray/Desktop/fwfeedsubmission/examples-sjc1-6_exception.log"&gt;

&lt;cfset errors = {}&gt;
&lt;cfloop index="logfile" list="#logs#"&gt;
    &lt;cfloop index="line" file="#logFile#"&gt;
        &lt;!--- only use if line begins with "Error", ---&gt;
		&lt;cfif find("""Error"",", line)&gt;
		  &lt;!--- convert to array, keeping nulls ---&gt;
		  &lt;cfset arr = listToArray(line, "," , true)&gt;
		  &lt;!--- remove 1-5 ---&gt;
		  &lt;cfloop index="x" from="1" to="5"&gt;
    		  &lt;cfset arrayDeleteAt(arr, 1)&gt;
		  &lt;/cfloop&gt;
		  
		  &lt;cfset errorLog = arrayToList(arr, " ")&gt;
		  &lt;cfif not structKeyExists(errors, errorLog)&gt;
		      &lt;cfset errors[errorLog] = 0&gt;
		  &lt;/cfif&gt;
		  &lt;cfset errors[errorLog]++&gt;
		&lt;/cfif&gt;
    &lt;/cfloop&gt;
&lt;/cfloop&gt;

&lt;cfset sorted = structSort(errors,"numeric","desc")&gt;
&lt;table border="1"&gt;
    &lt;tr&gt;
        &lt;th&gt;Error&lt;/th&gt;
        &lt;th&gt;Count&lt;/th&gt;
    &lt;/tr&gt;
    &lt;cfloop index="k" array="#sorted#"&gt;
	&lt;cfoutput&gt;
	   &lt;tr&gt;
	       &lt;td&gt;#k#&lt;/td&gt;
		   &lt;td&gt;#numberFormat(errors[k])#&lt;/td&gt;
	   &lt;/tr&gt;
	&lt;/cfoutput&gt;
    &lt;/cfloop&gt;
&lt;/table&gt;
</code>