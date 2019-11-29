---
layout: post
title: "Quick tip - using ColdFusion.navigate instead of bindings"
date: "2007-10-04T17:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/10/04/Quick-tip-using-ColdFusionnavigate-instead-of-bindings
guid: 2392
---

A user pinged me during MAX (what's wrong with you guys, didn't I warn you about questions??!? ;) with a problem. He wanted to use a CFDIV tag that bound to a form. The problem was - he didn't want to actually do anything until the form was complete. He was using bindings, and everytime the form changed, the div reloaded, even though the form wasn't complete. There are two simple solutions to this.
<!--more-->
First off - one simple solution is to build the source file, and by source file I mean what your CFDIV is pointing to - build it such that it recognizes an incomplete form and simply doesn't do anything. So consider this form:

<code>
&lt;form id="myform"&gt;
Name	&lt;input type="text" id="name" name="name"&gt;&lt;br&gt;
Age &lt;input type="text" id="age" name="age"&gt;&lt;br&gt;
&lt;/form&gt;
</code>

You could simply check to see if name and age have values before you output a response. But that doesn't technically answer his question. He wants the CFIDV to do nothing at all until the form is done. 

So the second option is to just use a submit handler or a button to run a JavaScript function. This function can check the form - and when happy, use ColdFusion.navigate, or ColdFusion.Ajax.submitForm. I tend to prefer navigate, so here is an example.

<code>
&lt;script&gt;
function checkForm() {
	var name = document.getElementById("name").value;
	var age = document.getElementById("age").value;
	//Employ Mr. T error handling
	if(name == '') {% raw %}{ alert('Enter a name, fool!'); return false; }{% endraw %}
	if(age == '') {% raw %}{ alert('I pity the fool who doesn\'t have an age!'); return false; }{% endraw %}
	ColdFusion.navigate('div.cfm?name='+escape(name)+'&age='+escape(age),'resultdiv');
	return false;
}
&lt;/script&gt;

&lt;form id="myform"&gt;
Name	&lt;input type="text" id="name" name="name"&gt;&lt;br&gt;
Age &lt;input type="text" id="age" name="age"&gt;&lt;br&gt;
&lt;input type="button" value="Test" onClick="checkForm()"&gt;
&lt;/form&gt;

&lt;cfdiv id="resultdiv" style="background-color:##fff271" /&gt;
</code>

As a quick FYI, div.cfm simply dumped the URL scope, and the background color on the div was just me being fancy.