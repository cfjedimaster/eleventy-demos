---
layout: post
title: "JavaScript - Opening a new window with little to no chrome"
date: "2006-12-08T10:12:00+06:00"
categories: [javascript]
tags: []
banner_image: 
permalink: /2006/12/08/JavaScript-Opening-a-new-window-with-little-to-no-chrome
guid: 1702
---

This is an old question, covered in hundreds of FAQs, but a reader asked me this today and I'm nothing if not responsive. (Especially when I know the answer. ;) The question was - how do you open a new window in JavaScript with as little chrome as possible. JavaScript makes this rather simple. The syntax to open a new window is:

<code>
foo = window.open(url, varname, features);
</code>

Where features is a list of ... well, features. This includes chrome, size, and other options. I found a good list <a href="http://www.devguru.com/Technologies/ecmaScript/quickref/win_open.html">here</a>. 

So to answer the question - you can simply disable all the features that are chrome related like so:

<code>
&lt;script&gt;
function popup() {
	var features = 'directories=no,menubar=no,status=no,titlebar=no,toolbar=no,width=500,height=500';
	var mypopup = window.open('http://ray.camdenfamily.com', 'mypopup', features);
}
&lt;/script&gt;

&lt;form&gt;
&lt;input type="button" onclick="popup()" value="Click me, baby"&gt;
&lt;/form&gt;
</code>

In my features list I disabled directories, menubar, status, titlebar, and toolbar. Note though that status=no will not work in Firefox or IE7, due to security settings, which is probably a good thing.