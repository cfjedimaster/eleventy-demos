---
layout: post
title: "Adding an ADD button for cfgrid - Part Deux"
date: "2008-03-03T17:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/03/03/Adding-an-ADD-button-for-cfgrid-Part-Deux
guid: 2687
---

Earlier today I <a href="http://www.raymondcamden.com/index.cfm/2008/3/3/Adding-an-ADD-button-for-cfgrid">blogged</a> an example of adding a button to a CFGRID control. A few readers asked I complete the example by hooking up the code to a back end CFC. Here is a simple example of how to do that. First off - be sure to read the <a href="http://www.coldfusionjedi.com/index.cfm/2008/3/3/Adding-an-ADD-button-for-cfgrid">first entry</a> so you understand where these code blocks fit in the total picture.
<!--more-->
Let's begin by looking at the function that currently responds to the grid click:

<code>
&lt;script&gt;
function testit(x) {% raw %}{ alert(x);}{% endraw %}
&lt;/script&gt;
</code>

My first task is to hook this up to the back end. ColdFusion makes this incredibly easy. First I'll add my cfajaxproxy tag:

<code>
&lt;cfajaxproxy cfc="test" jsclassname="myproxy"&gt;
</code>

Back in my JavaScript, I can now create an instance of my CFC using myproxy as a class name:

<code>
myproxy = new myproxy();
</code>

Next I want to run a function when my server CFC is done:

<code>
myproxy.setCallbackHandler(handleResult);
</code>

Now let me actually call the CFC back in my testit function:

<code>
function testit(x) { 
	myproxy.getData(x);
}
</code>

"getData" is the name of a CFC method. Let's look at it now:

<code>
&lt;cffunction name="getData" access="remote" returnType="string" output="false"&gt;
	&lt;cfargument name="data" type="any" required="true"&gt;
	&lt;cfreturn "Yo, you sent me #arguments.data#"&gt;
&lt;/cffunction&gt;
</code>

Obviously real code would do a bit more. The last bit is the result handler I told my code to use:

<code>
function handleResult(r) {
	alert("Result: "+r);
}
</code>

And that's it. I can't rave enough about cfajaxproxy. Let's look at the complete page (I won't bother posting test.cfc, as all it was was the method above):

<code>
&lt;cfajaxproxy cfc="test" jsclassname="myproxy"&gt;

&lt;cfquery name="entries" datasource="cfartgallery" maxrows="12"&gt;
select *
from art
&lt;/cfquery&gt;

&lt;cfset queryAddColumn(entries, "add", arrayNew(1))&gt;

&lt;cfloop query="entries"&gt;
   &lt;cfset querySetCell(entries, "add", "&lt;input value='Add' type='button' onclick='javascript:testit(#artid#)'&gt;", currentrow)&gt;
&lt;/cfloop&gt;

&lt;script&gt;
myproxy = new myproxy();
myproxy.setCallbackHandler(handleResult);

function testit(x) { 
	myproxy.getData(x);
}

function handleResult(r) {
	alert("Result: "+r);
}
&lt;/script&gt;

&lt;cfform name="test"&gt;
&lt;cfgrid autowidth="true" name="entries" format="html" query="entries" width="600"&gt;
&lt;cfgridcolumn name="artid" display="false"&gt;

&lt;cfgridcolumn name="artname" header="Name"&gt;
&lt;cfgridcolumn name="price" header="Price"&gt;
&lt;cfgridcolumn name="add" header="Add"&gt;
&lt;/cfgrid&gt;
&lt;/cfform&gt;
</code>

Any questions?