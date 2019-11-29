---
layout: post
title: "Ask a Jedi: Dumping ColdFusion Variables"
date: "2005-09-19T11:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/09/19/Ask-a-Jedi-Dumping-ColdFusion-Variables
guid: 787
---

Here is an interesting question:

<blockquote>
What are the methods of dumping and can you explain them?
</blockquote>

The simple, short answer to this is <a href="http://livedocs.macromedia.com/coldfusion/7/htmldocs/00000239.htm">&lt;cfdump&gt;</a>. The cfdump tag will take <i>any</i> possible value and attempt to display it's value in a nice format. However, you may be curious how cfdump works. Let's take a look at how values can be inspected and then displayed. We will do this by creating a new custom tag called simpledump. I'm using the name "simpledump" because this code will <i>not</i> be as good as the built-in dump tag. Why bother? Well, I'm a big fan of writing code for the fun of it. That's why I built my own blog and my own forums. You can learn a lot from just building something yourself. That being said, let's get started!
<!--more-->
Custom tags, as a topic, are something I'll assume you have a basic knowledge of already. If not, don't worry. The only line that may be a bit odd to you will be the very first line of our code:

<div class="code"><FONT COLOR=MAROON>&lt;cfparam name=<FONT COLOR=BLUE>"attributes.data"</FONT>&gt;</FONT></div>

This line simply requires that we pass a variable named data to the tag. It is a simple way of doing validation for our tag. Everything else we write will be specific to the topic at hand - inspecting and dumping the data.

The cfdump tag first checks to see what kind of value something is. To do this, it runs various tests on the data. One of the simplest tests is for strings and numbers. Strings and numbers (and dates and boolean values like true or false) are all considered simple values in ColdFusion. There is a built-in function that tests for such values: <a href="http://livedocs.macromedia.com/coldfusion/7/htmldocs/00000530.htm">isSimpleValue</a>. So the first thing our tag will do is check for simple values:

<div class="code"><FONT COLOR=MAROON>&lt;cfif isSimpleValue(attributes.data)&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfif len(trim(attributes.data))&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT>#attributes.data#<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfelse&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT>SimpleDump: Empty String<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfif&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cfif&gt;</FONT></div>

What's the deal with the len(trim()) check? I'm stealing a trick from cfdump. If you pass an empty string to cfdump, the tag will output a message saying the string was empty. If it didn't do this, you may think the tag wasn't running at all. So far so good. Now let's tackle our next data type: Arrays. Once again, ColdFusion comes with a nice built-in function: <a href="http://livedocs.macromedia.com/coldfusion/7/htmldocs/00000512.htm">isArray</a>. The following code portion will be added to our custom tag, right before the closing cfif statement above:

<div class="code"><FONT COLOR=MAROON>&lt;cfelseif isArray(attributes.data)&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;table border=<FONT COLOR=BLUE>"1"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;tr bgcolor=<FONT COLOR=BLUE>"yellow"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;td colspan=<FONT COLOR=BLUE>"2"</FONT>&gt;</FONT>Array of #arrayLen(attributes.data)# item(s)<FONT COLOR=TEAL>&lt;/td&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;/tr&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfloop index=<FONT COLOR=BLUE>"x"</FONT> from=<FONT COLOR=BLUE>"1"</FONT> to=<FONT COLOR=BLUE>"#arrayLen(attributes.data)#"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;tr&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;td&gt;</FONT>#x#<FONT COLOR=TEAL>&lt;/td&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;td&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cf_simpledump data=<FONT COLOR=BLUE>"#attributes.data[x]#"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;/td&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;/tr&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfloop&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;/table&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT></div>

So, nothing terribly exciting here. I'm using a table to display my array. Like the built-in tag, cfdump, I create a header that tells me I'm working with an array. I also say how many items the array has. Sure this will be obvious, but I like the header to be more informative. I use the <a href="http://livedocs.macromedia.com/coldfusion/7/htmldocs/00000387.htm">arrayLen</a> function to determine how many items the array has, and for each item, I call simpledump again. This is called recursion, but don't worry about that now. Basically all I'm saying is - use the custom tag to handle the display of the array items, since I don't know what kind of data is in the array.

With me so far? Now let's add support for ColdFusion structures. Once again we have a simple function we can use: <a href="http://livedocs.macromedia.com/coldfusion/7/htmldocs/00000532.htm">isStruct</a>. Like the code sample above, this code block would be in the main cfif area. (Don't worry, at the end, I'll post the full code.) One little note - you will notice the <a href="http://livedocs.macromedia.com/coldfusion/7/htmldocs/00000527.htm">isObject</a> check. Turns out - a ColdFusion Component actually returns <b>true</b> for isStruct. Don't ask me why. I had forgotten about that feature when I was writing this entry and it certainly surprised me. I added the not isObject check and it seems to handle it fine. 

<div class="code"><FONT COLOR=MAROON>&lt;cfelseif isStruct(attributes.data) and not isObject(attributes.data)&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;table border=<FONT COLOR=BLUE>"1"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;tr bgcolor=<FONT COLOR=BLUE>"yellow"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;td colspan=<FONT COLOR=BLUE>"2"</FONT>&gt;</FONT>Struct of #structCount(attributes.data)# item(s)<FONT COLOR=TEAL>&lt;/td&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;/tr&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
<br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfloop item=<FONT COLOR=BLUE>"key"</FONT> collection=<FONT COLOR=BLUE>"#attributes.data#"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;tr&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;td&gt;</FONT>#key#<FONT COLOR=TEAL>&lt;/td&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;td&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cf_simpledump data=<FONT COLOR=BLUE>"#attributes.data[key]#"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;/td&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;/tr&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfloop&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;/table&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT></div>

In general, this is almost the exact same code that we used for the array dump. Once again I use a table. This time however I use the <a href="http://livedocs.macromedia.com/coldfusion/7/htmldocs/00000636.htm">structCount</a> function which returns the number of keys in the structure. My loop this time uses the item/collection syntax, which will basically loop once per key in the collection. The display code inside, again, is almost the exact same as the array code earlier. So now we are handling simple values, arrays, and structures. Let's look at the last type we will handle, queries. Once again, I'll show the code block then explain what I'm doing:

<div class="code"><FONT COLOR=MAROON>&lt;cfelseif isQuery(attributes.data)&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset columns = listLen(attributes.data.columnList) + 1&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;table border=<FONT COLOR=BLUE>"1"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;tr bgcolor=<FONT COLOR=BLUE>"yellow"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;td colspan=<FONT COLOR=BLUE>"#columns#"</FONT>&gt;</FONT>Query of #attributes.data.recordCount# row(s)<FONT COLOR=TEAL>&lt;/td&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;/tr&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;tr&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;td&gt;</FONT><B><I>&amp;nbsp;</I></B><FONT COLOR=TEAL>&lt;/td&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfloop index=<FONT COLOR=BLUE>"col"</FONT> list=<FONT COLOR=BLUE>"#attributes.data.columnList#"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;td&gt;</FONT>#col#<FONT COLOR=TEAL>&lt;/td&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfloop&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;/tr&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
<br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfloop query=<FONT COLOR=BLUE>"attributes.data"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;tr&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;td&gt;</FONT>#currentRow#<FONT COLOR=TEAL>&lt;/td&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfloop index=<FONT COLOR=BLUE>"col"</FONT> list=<FONT COLOR=BLUE>"#attributes.data.columnList#"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT><FONT COLOR=TEAL>&lt;td&gt;</FONT><FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cf_simpledump data=<FONT COLOR=BLUE>"#attributes.data[col][currentRow]#"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT><FONT COLOR=TEAL>&lt;/td&gt;</FONT><FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfloop&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;/tr&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfloop&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;/table&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT></div>

You probably guessed the function we would start off with, <a href="http://livedocs.macromedia.com/coldfusion/7/htmldocs/00000529.htm">isQuery</a>. Inside this block, the first thing we do is create a variable called columns. I need to know the number of columns the query has. Luckily there is a built-in value that exists in all queries, columnList. I take the length of this list and add one to it. My query display will need one column per query column (obviously), and one additional column for the row number. I use the columns value in my header so the span is correct. Note that in the header I also use the built-in value, recordCount, to report how many rows are in the query. I want the header to contain the column names, so we use the built-in variable, columnList, and loop over it. Next we begin our loop for the main data of the query. We use another built-in feature whereby the variable, currentRow, inside the output of a query, will always equal the current row of the query data. Like in the header area, we again loop over each column in the query. To display the current column and row, we use this format: attributes.data[col][currentRow]. As with our struct and array dumps, we call the custom tag to display the value of each query cell. 

Last but not least, even though we said we wouldn't handle as many things as the built-in dump tag, we should at least do <i>something</i> for components, COM objects, and other things we can't handle. We will add one more cfelse statement to handle them. Here is the custom tag in all it's (ugly) glory:

<div class="code"><FONT COLOR=MAROON>&lt;cfparam name=<FONT COLOR=BLUE>"attributes.data"</FONT>&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfif isSimpleValue(attributes.data)&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfif len(trim(attributes.data))&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT>#attributes.data#<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfelse&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT>SimpleDump: Empty String<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfif&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;cfelseif isArray(attributes.data)&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;table border=<FONT COLOR=BLUE>"1"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;tr bgcolor=<FONT COLOR=BLUE>"yellow"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;td colspan=<FONT COLOR=BLUE>"2"</FONT>&gt;</FONT>Array of #arrayLen(attributes.data)# item(s)<FONT COLOR=TEAL>&lt;/td&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;/tr&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfloop index=<FONT COLOR=BLUE>"x"</FONT> from=<FONT COLOR=BLUE>"1"</FONT> to=<FONT COLOR=BLUE>"#arrayLen(attributes.data)#"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;tr&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;td&gt;</FONT>#x#<FONT COLOR=TEAL>&lt;/td&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;td&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cf_simpledump data=<FONT COLOR=BLUE>"#attributes.data[x]#"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;/td&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;/tr&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfloop&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;/table&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;cfelseif isStruct(attributes.data) and not isObject(attributes.data)&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;table border=<FONT COLOR=BLUE>"1"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;tr bgcolor=<FONT COLOR=BLUE>"yellow"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;td colspan=<FONT COLOR=BLUE>"2"</FONT>&gt;</FONT>Struct of #structCount(attributes.data)# item(s)<FONT COLOR=TEAL>&lt;/td&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;/tr&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
<br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfloop item=<FONT COLOR=BLUE>"key"</FONT> collection=<FONT COLOR=BLUE>"#attributes.data#"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;tr&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;td&gt;</FONT>#key#<FONT COLOR=TEAL>&lt;/td&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;td&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cf_simpledump data=<FONT COLOR=BLUE>"#attributes.data[key]#"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;/td&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;/tr&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfloop&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;/table&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;cfelseif isQuery(attributes.data)&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset columns = listLen(attributes.data.columnList) + 1&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;table border=<FONT COLOR=BLUE>"1"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;tr bgcolor=<FONT COLOR=BLUE>"yellow"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;td colspan=<FONT COLOR=BLUE>"#columns#"</FONT>&gt;</FONT>Query of #attributes.data.recordCount# row(s)<FONT COLOR=TEAL>&lt;/td&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;/tr&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;tr&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;td&gt;</FONT><B><I>&amp;nbsp;</I></B><FONT COLOR=TEAL>&lt;/td&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfloop index=<FONT COLOR=BLUE>"col"</FONT> list=<FONT COLOR=BLUE>"#attributes.data.columnList#"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;td&gt;</FONT>#col#<FONT COLOR=TEAL>&lt;/td&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfloop&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;/tr&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
<br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfloop query=<FONT COLOR=BLUE>"attributes.data"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;tr&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;td&gt;</FONT>#currentRow#<FONT COLOR=TEAL>&lt;/td&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfloop index=<FONT COLOR=BLUE>"col"</FONT> list=<FONT COLOR=BLUE>"#attributes.data.columnList#"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT><FONT COLOR=TEAL>&lt;td&gt;</FONT><FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cf_simpledump data=<FONT COLOR=BLUE>"#attributes.data[col][currentRow]#"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT><FONT COLOR=TEAL>&lt;/td&gt;</FONT><FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfloop&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;/tr&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfloop&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;/table&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;cfelse&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT>SimpleDump: Complex Object<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cfif&gt;</FONT></div>

That's it! I hope you enjoyed this little trip into the various functions to introspect and play with ColdFusion data structures.