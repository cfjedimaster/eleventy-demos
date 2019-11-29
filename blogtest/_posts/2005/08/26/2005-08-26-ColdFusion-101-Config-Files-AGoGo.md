---
layout: post
title: "ColdFusion 101: Config Files A-Go-Go"
date: "2005-08-26T18:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/08/26/ColdFusion-101-Config-Files-AGoGo
guid: 733
---

One of the first things a beginning ColdFusion developer realizes, at least after their first few applications, is that configuration is something you want to make as easy as possible. What do we mean by configuration? Well imagine your web site has various forms. Forms for product reviews. Forms for job applications. Forms for budding Jedi Masters. You can build all of these forms so that on submission, they email to some email address, let's say junkbin@microsoft.com. This is all fine and good until the client says, "Hey, can we have all forms go to bjork@scandi.com instead?"
<!--more-->
So, if you are using a <a href="http://www.cfeclipse.org/">decent editor</a>, this isn't a big deal. But obviously a multi-file search and replace isn't the answer.

What you need is a config file, son! (Funny, and off-topic story on where that quote came from later on.)

What do we mean by a config file? A config file is a human-readable file that contains configuration information about the application. A perfect example is the scenario we described above. If the "Send All Forms Here" value had been in a config file, it would have been even easier to update the value based on customer demand. It may even have been something the client could do! (Yes, I know, scary, but it's ok. Clients are perfectly ok working with files as long as take deep breaths and type very slowly.)

There are a couple different ways we can create a config file. For this first post, we are going to start with the venerable "ini" file format. (Don't worry, the XML example will be in the next post.) What is an ini file? Ini files have been a part of Windows for many years. Scientists have reported discovering early versions of ini files buried deeply under prehistory middens. Basically they are text files with name/value pairs. Here is a simple example:

<div class="code">name=Jacob Camden<br>
age=5<br>
rank=Padawan</div>

Simple enough, right? Along with name/value pairs, an ini file will be separated into sections, using bracket notation. Every ini file will have at least one section. Here is a simple example:

<div class="code">[live]<br>
email=<A HREF="mailto:admin@bigclient.com">admin@bigclient.com</A><br>
<br>
[staging]<br>
email=<A HREF="mailto:ray@camdenfamily.com">ray@camdenfamily.com</A>,<A HREF="mailto:admin@bigclient.com">admin@bigclient.com</A><br>
<br>
[dev]<br>
email=<A HREF="mailto:ray@camdenfamily.com">ray@camdenfamily.com</A></div>

In the ini file above, there are three sections: live, staging, and dev. (I'll talk more about these sections in my third post.) Each section has an email entry with a different value. My application can select the email key from any section it wants to, or load them all up.


So how can ColdFusion use ini files? ColdFusion comes with a set of built in functions to read and write ini files: <a href="http://livedocs.macromedia.com/coldfusion/7/htmldocs/00000491.htm">GetProfileSections</a>, <a href="http://livedocs.macromedia.com/coldfusion/7/htmldocs/00000492.htm">GetProfileString</a>, and <a href="http://livedocs.macromedia.com/coldfusion/7/htmldocs/00000625.htm">SetProfileString</a>. Let's start by defining a simple ini file. Take the code below and save it as test.ini.

<div class="code">[default]<br>
email=<A HREF="mailto:ray@camdenfamily.com">ray@camdenfamily.com</A></div>

Now let's look at how we can read the file. We will begin with a simple example of getProfileString:

<div class="code"><FONT COLOR=MAROON>&lt;cfset iniFile = expandPath(<FONT COLOR=BLUE>"./test.ini"</FONT>)&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;cfset email = getProfileString(iniFile, <FONT COLOR=BLUE>"default"</FONT>, <FONT COLOR=BLUE>"email"</FONT>)&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT>Email=#email#<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT></div>

The first line simply creates a full path to our ini file. The first attribute that getProfileString expects is the full path to the file. (Am I the only who wishes that more ColdFusion functions would allow for relative paths?) The second argument we pass is the name of the section. In this case, we know it is default. Lastly we tell the function what key to retrieve. If you run this example in your browser, you will see my email address. (Spam away, folks.)

What happens if you pass a section or a key that doesn't exist? No error is thrown. Instead you get a simple empty string. You could example the ini file before hand using getProfileSections:

<div class="code"><FONT COLOR=MAROON>&lt;cfset iniFile = expandPath(<FONT COLOR=BLUE>"./test.ini"</FONT>)&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;cfdump var=<FONT COLOR=BLUE>"#getProfileSections(iniFile)#"</FONT>&gt;</FONT></div>

The function getProfileSections returns both the sections of the ini file and all the keys within that ini file. Since our ini file had one section, our returned structure will have one key, "default". Because that section had one key, "email", the value of the struct's "default" key will be "email":

<img src="http://ray.camdenfamily.com/images/inifilearticle.jpg">

So we can now read ini file settings. Obviously you would want to store and cache these settings:

<div class="code"><FONT COLOR=MAROON>&lt;cfif not isDefined(<FONT COLOR=BLUE>"application.settings"</FONT>) or isDefined(<FONT COLOR=BLUE>"url.reinit"</FONT>)&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset iniFile = expandPath(<FONT COLOR=BLUE>"./test.ini"</FONT>)&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset sections = getProfileSections(iniFile)&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset data = structNew()&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfif structKeyExists(sections, <FONT COLOR=BLUE>"default"</FONT>)&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfloop index=<FONT COLOR=BLUE>"key"</FONT> list=<FONT COLOR=BLUE>"#sections.default#"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset data[key] = getProfileString(iniFile, <FONT COLOR=BLUE>"default"</FONT>, key)&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfloop&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset application.settings = data&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfelse&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfthrow message=<FONT COLOR=BLUE>"Ini file has a missing default section!"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfif&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cfif&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfdump var=<FONT COLOR=BLUE>"#application#"</FONT>&gt;</FONT></div>

What's going on here? First we check to see if an application variable called settings is defined. If it isn't, or if we pass in a special URL variable to refresh the cache, we know we need to load our settings. We use getProfileSections to first load up the sections from the ini file. After checking to see the there is a default section, we loop over the keys from the section and copy over the values. The data structure is basically a copy of all the name/value pairs from the ini file. Once done with the loop, we copy them over to the application scope. Notice we also do a bit of error checking. If for some reason the default section doesn't exist, we immediately throw an error. This makes sense if you think about it - if the application isn't properly configured, we should stop everything.

So, the last function we need to talk about is setProfileString. As you can probably guess, this allows you to update an ini file. It takes four arguments: The name of the ini file, the section, the key, and lastly the value. I'm not really going to bother with an example of this since I don't find myself updating ini files from code very often. In fact, I've never done it. But it is there if you need to. 

In my next entry (most likely not till Monday) I will discuss using XML files for application configuration.

So, this was my first 101 posting. Too much? Too little? Be critical!