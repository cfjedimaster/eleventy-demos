---
layout: post
title: "Ask a Jedi:Using cfdirectory and a form to delete files"
date: "2008-10-22T21:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/10/22/Ask-a-JediUsing-cfdirectory-and-a-form-to-delete-files
guid: 3066
---

This was a simple request, but I thought I'd share the code in case any other beginners would find it interesting. Joe asks:

<blockquote>
<p>
I was after a method of being able to select results from a
cfdirectory query using a form check box, then once a "delete selected" button is pressed it will then go on to delete them from the directory.
</p>
<p>
I currently have a page displaying all the files and folders now I just need a way so delete the selected records could you please help?
</p>
</blockquote>
<!--more-->
So as Joe pointed out, it's rather simple to use cfdirectory to create a list of files. Joe mentioned checkboxes and a simple form, so let's look at that part of the script first:

<code>
&lt;cfset directory="#expandPath('.')#"&gt;

&lt;cfdirectory action="list" directory="#directory#" name="entries" type="file"&gt;

&lt;cfoutput&gt;&lt;form action="#cgi.script_name#" method="post"&gt;&lt;/cfoutput&gt;
&lt;table&gt;
	&lt;cfoutput query="entries"&gt;
    	&lt;tr&gt;
        	&lt;td&gt;&lt;input type="checkbox" name="files" value="#name#" /&gt;&lt;/td&gt;
            &lt;td&gt;#name#&lt;/td&gt;
        &lt;/tr&gt;
	&lt;/cfoutput&gt;
&lt;/table&gt;
&lt;input type="submit" value="DELETE" /&gt;
&lt;/form&gt;
</code>

Normally the directory variable would point to some other folder instead of the current folder. This script would actually let you delete the script itself, which is probably <i>not</i> a good idea. Notice that I filtered by files. You can actually perform a recursive delete on a directory, but since Joe mentioned files I figured I'd keep it at that.

Notice next to each file we use a checkbox with the name files. When the form is submitted, each and every file will exist in the form value, files. If the user selects multiple files, then the values will be a list. Here is how I processed the form submission:

<code>
&lt;cfif structKeyExists(form, "files") and len(form.files)&gt;
	&lt;cfloop index="f" list="#form.files#"&gt;
		&lt;cfif fileExists(directory & "/" & getFileFromPath(f))&gt;
			&lt;cffile action="delete" file="#directory#/#getFileFromPath(f)#"&gt;
		&lt;/cfif&gt; 
	&lt;/cfloop&gt;
&lt;/cfif&gt;
</code>

Nothing crazy here. Note though that I go the extra step to ensure the file exists before I delete it. In theory it is possible someone else could have deleted the file. (And to be <i>real</i> anal, I should use a cflock as well.)

As I said - easy stuff, but hopefully this example will help Joe. I'll print the entire sample below. Before doing so, don't forget that any web based application that lets you delete files is a risky. <b>Please be sure</b> you know what your doing before deploy code like this.

<code>
&lt;cfset directory="#expandPath('.')#"&gt;

&lt;cfif structKeyExists(form, "files") and len(form.files)&gt;
	&lt;cfloop index="f" list="#form.files#"&gt;
		&lt;cfif fileExists(directory & "/" & getFileFromPath(f))&gt;
			&lt;cffile action="delete" file="#directory#/#getFileFromPath(f)#"&gt;
		&lt;/cfif&gt; 
	&lt;/cfloop&gt;
&lt;/cfif&gt;

&lt;cfdirectory action="list" directory="#directory#" name="entries" type="file"&gt;

&lt;cfoutput&gt;&lt;form action="#cgi.script_name#" method="post"&gt;&lt;/cfoutput&gt;
&lt;table&gt;
	&lt;cfoutput query="entries"&gt;
    	&lt;tr&gt;
        	&lt;td&gt;&lt;input type="checkbox" name="files" value="#name#" /&gt;&lt;/td&gt;
            &lt;td&gt;#name#&lt;/td&gt;
        &lt;/tr&gt;
	&lt;/cfoutput&gt;
&lt;/table&gt;
&lt;input type="submit" value="DELETE" /&gt;
&lt;/form&gt;
</code>