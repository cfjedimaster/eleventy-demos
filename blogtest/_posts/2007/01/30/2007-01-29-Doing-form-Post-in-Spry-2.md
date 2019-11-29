---
layout: post
title: "Doing  form Post in Spry (2)"
date: "2007-01-30T00:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/01/30/Doing-form-Post-in-Spry-2
guid: 1803
---

Last week or so I <a href="http://ray.camdenfamily.com/index.cfm/2007/1/14/Doing-a-form-POST-in-Spry">blogged</a>  about doing form postings with Spry. I was asked to provide a bit more documentation so I thought I'd show a slightly more detailed example.
<!--more-->
First lets start with a very simple form:

<code>
&lt;form&gt;
number one: &lt;input type="text" name="one" id="one"&gt;&lt;br&gt;
number two: &lt;input type="text" name="two" id="two"&gt;&lt;br&gt;
&lt;/form&gt;
</code>

This form has two simple text fields named one and two. I want to use Spry to send the values of these two fields to the server. First lets add a simple button:

<code>
&lt;input type="button" value="Add" onClick="doAddPost()"&gt;
</code>

This simply fires off a JavaScript function. I'm going to break the function up and explain each and every line to make it as clear as possible. First, start the function.

<code>
function doAddPost() {
</code>

We need to know <i>where</i> we will be posting the form, so next I define the URL:

<code>
	var url = "moon.cfm";
</code>

Now I need to grab the values I want to post. Normally with a submit button you don't have to worry about this. The browser simply sends all the form fields. In this case though I have to specify the fields manually. First I'll grab the value of the form field, one, using the Spry/Prototype $() shortcut:

<code>
	var one = $("one").value;
</code>

Then I'll grab the value from the second form field:

<code>
	var two = $("two").value;	
</code>

The form post data must be sent like a query string: foo1=value1&foo2=value2. Again, I have to do this by hand:

<code>
	var formData = 'one='+one+'&two='+two;
</code>

Next I encode any values in the string, like spaces or other special characters:

<code>
	formData = encodeURI(formData);
</code>

So the last thing we do is run the Spry code that will handle the form post. I talked about this more in the <a href="http://ray.camdenfamily.com/index.cfm/2007/1/14/Doing-a-form-POST-in-Spry">last post</a> so I won't spend a lot of time on it.

<code>
	Spry.Utils.loadURL('POST', url, true, resFunc, {% raw %}{postData: formData, headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"}{% endraw %}});
</code>

The first argument defines the type of request (GET or POST). The second argument is the URL value I defined earlier. The third argument defines if the call is asynchronous or not. The fourth argument defines a function to run with the result of the HTTP call. Lastly there is a structure of arguments that define the request. Again I have to thank Keith for figuring this out.

So here is the function again all in one code block:

<code>
function doAddPost() {
	var url = "moon.cfm";
	var one = $("one").value;
	var two = $("two").value;	
	var formData = 'one='+one+'&two='+two;
	formData = encodeURI(formData);
	Spry.Utils.loadURL('POST', url, true, resFunc, {% raw %}{postData: formData, headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"}{% endraw %}});
}
</code>

So how do we handle this server side? We have a few options. As I mentioned, the loadURL function lets you define code to run with the result. So whatever the server returned I can work with in JavaScript. This can be either a string or XML or WDDX. To make it easier I'll just return a simple string:

<code>
&lt;cfsetting enablecfoutputonly=true&gt;
&lt;cfparam name="form.one" default="0"&gt;
&lt;cfparam name="form.two" default="0"&gt;

&lt;cfif isNumeric(form.one) and isNumeric(form.two)&gt;
	&lt;cfoutput&gt;#form.one+form.two#&lt;/cfoutput&gt;
&lt;cfelse&gt;
	&lt;cfoutput&gt;0&lt;/cfoutput&gt;
&lt;/cfif&gt;
</code>

Obviously there isn't anything too complex here, just the addition of two numbers. I take the result and simply output it directly to the client requesting the data. With me so far? 

Now let's return to JavaScript and work with the result. I had specified the a function named resFunc would handle the result. The function is all of 4 lines:

<code>
function resFunc(request) {
	var result = request.xhRequest.responseText; 
	$("result").innerHTML = "Result was: " + result;	
}
</code>

Spry automatically passes a collection of data back. The information I'm interested in resides in xhRequest.responseText. Once I have that, I can write out the result in the browser. 

So I had mentioned more than once I wanted to make this process a bit simpler. Here is my first draft at it:

<code>
function doFormPost(url,formlist,resfunc) {
	var formdata = '';
	var formarray = formlist.split(',');
	for(var i=0; i &lt; formarray.length; i++) {
		formdata+='&'+formarray[i]+'=';
		var fValue = $(formarray[i]).value;
		formdata+=fValue;
	}
	formData = encodeURI(formdata);
	Spry.Utils.loadURL('POST', url, true, resfunc, {% raw %}{postData: formdata, headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"}{% endraw %}});
}
</code>

This lets you pass in a url and a list of form fields to post. The third argument is optional. So to do a Spry post you can do this instead of the button and custom function I had before:

<code>
&lt;input type="button" value="Add3" onClick="doFormPost('moon.cfm', 'one,two',resFunc)"&gt;
</code>

As I said though this is just a first draft. Right now it assumes just text fields.