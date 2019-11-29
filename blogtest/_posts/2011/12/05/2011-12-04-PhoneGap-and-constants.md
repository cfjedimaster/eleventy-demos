---
layout: post
title: "PhoneGap and constants"
date: "2011-12-05T11:12:00+06:00"
categories: [javascript,mobile]
tags: []
banner_image: 
permalink: /2011/12/05/PhoneGap-and-constants
guid: 4455
---

One of the issues I've run into with PhoneGap is dealing with constants. For example, today I'm doing my first work with the file system. I ran into an issue using one of the methods. My error handler was called with the helpful value of:

<p>

<blockquote>
code:1
</blockquote>

<p>

Oh. Of course. Error code 1. Well, everyone knows what that is, right? If you check the docs, you see this for <a href="http://docs.phonegap.com/en/1.2.0/phonegap_file_file.md.html#FileError">FileError</a>:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip243.png" />

<p>

Ok, that's not helpful. You can clearly see the <i>types</i> of errors, but nothing here indicates what is what. 

<p>

Luckily I ran into this before (with the SQL stuff I believe) and I remembered that if you simply open up phonegap.js (the JavaScript file you include in every PhoneGap project), you can quickly search for your error object (in my case, FileError), and come across the code:

<p>

<code>
// File error codes
// Found in DOMException
FileError.NOT_FOUND_ERR = 1;
FileError.SECURITY_ERR = 2;
FileError.ABORT_ERR = 3;

// Added by this specification
FileError.NOT_READABLE_ERR = 4;
FileError.ENCODING_ERR = 5;
FileError.NO_MODIFICATION_ALLOWED_ERR = 6;
FileError.INVALID_STATE_ERR = 7;
FileError.SYNTAX_ERR = 8;
FileError.INVALID_MODIFICATION_ERR = 9;
FileError.QUOTA_EXCEEDED_ERR = 10;
FileError.TYPE_MISMATCH_ERR = 11;
FileError.PATH_EXISTS_ERR = 12;
</code>

<p>

If there is an automatic way to translate that error w/o enumerating over FileError, I don't know. In my case, I just needed this documented.