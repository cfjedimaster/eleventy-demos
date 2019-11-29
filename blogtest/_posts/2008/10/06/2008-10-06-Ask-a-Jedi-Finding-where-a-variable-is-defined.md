---
layout: post
title: "Ask a Jedi: Finding where a variable is defined"
date: "2008-10-06T11:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/10/06/Ask-a-Jedi-Finding-where-a-variable-is-defined
guid: 3043
---

Sean asks:

<blockquote>
<p>
Do you know of a function, either built in or user defined, that will display the scope where a variable exists. I'm working with old code that does not always scope the variables and I'm having a hard time tracking some of them down.
</p>
</blockquote>

While I'm not aware of such a function, I'm sure we can write one easily enough. Here is what I came up with.
<!--more-->
<code>
function findScope(v) {
	var scopes = "arguments,variables,thread,cgi,cffile,url,form,cookie,client";
	var s = "";
	var ptr = "";
	var i = 1;
	
	for(;i &lt; listLen(scopes); i++) {
		s = listGetAt(scopes,i);
		ptr = structGet(s);
		if(structKeyExists(ptr, v)) return s;
	}
	
	return "";
}
</code>

This UDF works with a predefined list of scopes based on the scopes that ColdFusion will check when you do not define a scope. (More on this <a href="http://livedocs.adobe.com/coldfusion/8/htmldocs/Variables_32.html">here</a>.) This isn't an exact match to the list ColdFusion checks as some of them are unnamed. Also, you may want to extend this list to include Application and Session. Those scopes are <b>not</b> checked with unscoped variables, but if you want, just add them to the list. 

Once we have our list, the rest of the code isn't too exciting. We loop over each scope and use structGet to get a pointer to the scoper. We then do a simple structKeyExists and if the key exists, we return the scope name. Here is a simple test script I wrote to demonstrate the UDF in action:

<code>
&lt;cfset variables.x = 1&gt;
&lt;cfset url.y = 2&gt;
&lt;cfset form.z = 3&gt;
&lt;cfset cookie.a = 'peanut butter jelly'&gt;
	
&lt;cfoutput&gt;
findScope('x')=#findScope('x')#&lt;br /&gt;
findScope('y')=#findScope('y')#&lt;br /&gt;
findScope('z')=#findScope('z')#&lt;br /&gt;
findScope('a')=#findScope('a')#&lt;br /&gt;
findScope('idontexist')=#findScope('idontexist')#
&lt;/cfoutput&gt;
</code>

Note - this UDF will only work in ColdFusion 8 because of the &lt; and ++. You can modify that easily enough. Frankly now that I've got these in cfscript under CF8 I'm going to use them everywhere I can! You would also need to remove the thread value from the list.