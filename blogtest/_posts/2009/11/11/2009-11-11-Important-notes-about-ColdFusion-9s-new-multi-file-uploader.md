---
layout: post
title: "Important notes about ColdFusion 9's new multi file uploader"
date: "2009-11-11T12:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/11/11/Important-notes-about-ColdFusion-9s-new-multi-file-uploader
guid: 3600
---

<b>Note - the following applies to <i>any</i> multi file uploader - not just the one that ships with ColdFusion 9.</b> Earlier today I read a great <a href="http://www.adobe.com/devnet/coldfusion/articles/coldfusion9_uicontrols.html">article</a> by Dan Vega about some of the new UI controls in ColdFusion 9. One of them was the new multi file uploader. If you haven't had a chance to play with it, I highly encourage you take a quick look at the demos Dan uses in his article. Reading his article brought up some interesting things that I think people need to be aware of before making use of the control. I had a long talk with Dan about this, and unfortunately, the more we talked, the more we discovered that there are quite a few <b>non-trivial</b> things you need to concern yourself with before adding this feature to your site.
<!--more-->
The primary, and most important,  thing to keep in mind is that the multi file uploader performs a HTTP post by itself. Consider the following simple form.

<code>
&lt;form action="form.cfm" method="post"&gt;
Name: &lt;input type="text" name="name"&gt;&lt;br/&gt;
Email: &lt;input type="text" name="email"&gt;&lt;br/&gt;
Attachments: &lt;cffileupload url="uploadall.cfm" name="files" &gt;&lt;br/&gt;
&lt;input type="submit"&gt;
&lt;/form&gt;
</code>

This example is different than what you see typically demonstrated with the control. However, it represents a more real world scenario. Users don't normally just upload files by themselves, but in context with other data as well. In this case my form has 3 "fields", a name, a email, and a attachments area. Our business logic needs to work with the data as whole. It will probably want to insert the two simple values into a table. It will probably then want to log the files attached to the submission in another table, where that tables links back to the original. 

Right off the bat you can see the problem. The files post to uploadall.cfm. The form itself posts back to form.cfm. So on top of that - guess what - we have other problems as well. What if the user uploads files and never hits submit? What if the user picks files and never hits the upload button? As you can see - the more we approach a real world scenario, the less trivial this "simple" feature becomes. Let's talk about some possible solutions.

First - let's focus on how we can handle keeping the files together with the rest of the form submission. We have to accept that - at minimum - we may or may not have files waiting when the form is submitted. We need to also accept that we may have multiple people using the same form. Because of this, it may make sense to use a file location based on a value unique to the session. So for example:

<code>
&lt;cfset session.storage = replace(createUUID(), "-","_","all")&gt;
</code>

This creates a UUID based variable stored within the session scope. I called it "storage" which is a bit vague. If I had 2 or more forms on my site then I'd maybe want to use a prefix:

<code>
&lt;cfset session.storage = "resumeform_" & replace(createUUID(), "-","_","all")&gt;
</code>

We can then use this for our uploadall.cfm file. 

<code>
&lt;cfif not directoryExists("ram://#session.storage#")&gt;
	&lt;cfdirectory action="create" directory="ram://#session.storage#"&gt;
&lt;/cfif&gt;

&lt;cffile action="upload" destination="ram://#session.storage#" nameconflict="makeunique"/&gt;
</code>

Now that I have a place to store my files, I can look in that folder when I submit the rest of the form. However, this leads to more problems. (Does anything in life go from complex to simple??) First, what happens if I go to the form, upload some files, change my mind, come back and decide to start over? Most likely I want the form itself to remove all files that exist within my own storage directory. This means a simple page reload will also cause the storage folder to empty out. Secondly - what happens if I upload some files - go eat lunch - and then come back and complete the form? Well all of a sudden my storage system is empty. My form will think that no files were associated with the submission. If a form didn't require a login, then this could lead to confusion. What I'd probably suggest here is a warning if the form is submitted long after it was initially created. (You can use a hidden form field with the current time for this.) Then the user can decide if they need to bother to do the form again. Using this system also allows us to make use of onSessionEnd to empty out the folder when the session expires - again only if the user never bothers to submit the form. If they do we should process the folder immediately.

And unfortunately - we have another problem as well. When the multi file uploader sends data to the server, it does NOT pass along cookies. What does that mean? It means it uses another session. Luckily we can get around that by appending the session values to the URL:

<code>
&lt;cffileupload url="uploadall.cfm?#urlEncodedFormat(session.urltoken)#" name="files" /&gt;
</code>

Note the use of urlEncodedFormat. <b>This is required!</b> Session.URLToken is URL safe already, but for some reason when I left this off, only the CFID portion was sent to the server.

Now that you have wrapped your brain around that issue - let's bring up another thing to consider. What if the user selects a few files, but never hits Upload? Unfortunately, there is <b>no</b> JavaScript API that let's you look at the list of files to see if anything is there. You are basically out of luck. The best I can recommend here is to put a nice message next to the control and by the submit button as well. Of course, users hate to read, but at some point they need to take some responsibility!

Finally - let me leave with two quick things I found while testing. First - if you use onComplete and forget to actually write the JavaScript function, the multi file control won't load at all. Firefox correctly reported an error, but with it "hidden" in the Error Console (boy that really bugs me - I wish Firefox would add something to to the status bar on errors) I completely missed this at first. Secondly - if you do not use the cffile action="upload" on your form process, then you will never get a response in the form control. I guess this is to be expected, but I thought I could simply ignore the file uploads while testing. Nope - when I had a blank file, the form control waited forever for a response. Again - not surprising.