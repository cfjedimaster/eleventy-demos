---
layout: post
title: "Interesting little bug with query columns"
date: "2007-08-20T10:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/08/20/Interesting-little-bug-with-query-columns
guid: 2292
---

An interesting bug (not a ColdFusion bug, but a user bug) cropped up in a discussion last week in the ColdFusion IRC channel. Unfortunately I don't remember his IRC name (<b>Edited:</b> It was Baz!), but after we worked together on this for an hour or so, he was kind enough to send me a real nice and simple code sample to replicate the issue.

So let's back up a bit and talk about what he saw. The user had a web service that returned a structure. Before he actually used it as a web service he did his testing locally like so:
<!--more-->
<code>
&lt;cfset Local=createobject('component','test').invokeFunction() /&gt;
&lt;cfdump var="#Local#" label="Local"&gt;
</code>

This worked perfectly fine for him. Let's take a look at the code he was using in the component (and give yourself a pat on the back if you see the problem):

<code>
&lt;cfcomponent output="false"&gt;

&lt;cffunction name="invokeFunction" access="remote" returntype="struct"&gt;

        &lt;cfscript&gt;
            var MyQuery=QueryNew('ColumnA,ColumnB');
            var MyStruct=structnew();

            // Populate 1 row of the query
            QueryAddRow(MyQuery, 1);
            QuerySetCell(MyQuery, 'ColumnA', 'ValueA');
            QuerySetCell(MyQuery, 'ColumnB', 'ValueB');

            // Copy the values of that row to a struct
            MyStruct.KeyA=MyQuery['ColumnA'];
            MyStruct.KeyB=MyQuery['ColumnB'];
        &lt;/cfscript&gt;

        &lt;cfreturn MyStruct /&gt;
    &lt;/cffunction&gt;
&lt;/cfcomponent&gt;
</code>

As you can see, the function creates a query and then copies values to a structure. His real code was obviously a bit more complex. So he then switched to using a web service:

<code>
&lt;cfset Remote=createobject('webservice', 'http://localhost/test.cfc?WSDL').invokeFunction() /&gt;
&lt;cfdump var="#Remote#" label="Remote"&gt;
</code>

And something odd occurred. This is the output from running both his local and remote tests:

<img src="https://static.raymondcamden.com/images/aug20ss.png">

As you can see - the remote call returned a structure of arrays - not a structure of simple values. Why? While I can't answer why one method returned different data then the other, I can point out the problem with the code in the method. Notice how he copied the values from the query:

<code>
// Copy the values of that row to a struct
MyStruct.KeyA=MyQuery['ColumnA'];
MyStruct.KeyB=MyQuery['ColumnB'];
</code>

When working with a query like this, you are supposed to specify which particular row you want. When called locally, the function was able to guess he meant the first row, but when called remotely this no longer worked. Again - I don't know why, but the fix is simple enough:

<code>
// Copy the values of that row to a struct
MyStruct.KeyA=MyQuery['ColumnA'][1];
MyStruct.KeyB=MyQuery['ColumnB'][1];
</code>

What helped diagnose this issue was inspecting the data he had in MyStruct. When he examined the particular Java class when invoked remotely, he saw that it was a QueryColumn (I don't have the full class name in front of me, but that is the approximate name), not a simple value as he would have expected.