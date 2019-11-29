---
layout: post
title: "cfObjective - Jason Delmore: Scorpio: 1337"
date: "2007-05-06T11:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/05/06/cfObjective-Jason-Delmore-Scorpio-1337
guid: 2011
---

Again, pardon the haphazard nature of these notes.


I believe this has all been mentioned before, but here are the notes from Jason's talk this morning on Scorpio 'geek' features.

You can now create arrays inline like so:

<code>
&lt;cfset arr = ["x","y","z"]&gt;
</code>

This creates an with three strings.

You can do the same with structs:

<code>
&lt;cfset person = {% raw %}{name="ray",age="34"}{% endraw %}&gt;
</code>

You can specify argmentsCollection to let you pass a structure of arguments/values to a CF tag. This will be <i>real</i> useful for cfmail.

Demonstrating CFTHREAD (which I won't cover - it's been covered quite a bit).

Tons of new functions to handle file operations. FileOpen, FileDelete, FileReadLine, etc. Pay special attention to the FileReadLine function. This will be very useful for reading large files. CFLOOP modded to let you loop over a file:

<code>
&lt;cfloop file="" index="line"&gt;
</code>

or

<code>
&lt;cfloop file="" index="chars" characters="100"&gt;
</code>

AJAX integration with the cfajaxproxy tag. One tag handles <b>all</b> the JavaScript plumbing to let you invoke any CFC method from JavaScript. Example:

<code>
&lt;cfajaxproxy name="validator" component="myvalidation.cfc"&gt;
</code>

Invoke CFC method, perform validation:

<code>
&lt;script&gt;
function checkEail(emailAddr) {
 if(!validator.validateEmail(email.value)) alert('error here');
}
&lt;/script&gt;

&lt;input type="text" name="email" onChange="checkEmail(this.value)"&gt;
</code>

AJAX UI elements - you can have an AJAX grid where when you select an item, other form fields are bound to it and are updated.

There are AJAX JavaScript functions to let you work with AJAX from JS. Stuff like refreshing an AJAX grid. Sorting a grid. Etc. ColdFusion.navigate() lets you display the output of a URL in a cfdiv, cflayoutarea, cfpod, cfwindow, etc. All of these JS functions are loaded up whenever you use one of the new AJAX features. 

The ColdFusion Admin has a new UI. Sorry - no camera on me. Still frames based, but, um, shinier. 

CFC interfaces (not a big deal to me). IsInstanceOf() - checks to see if an object is an instance of a CFC type.

getComponentMetaData - lets you get metadata by passing a path of a CFC. In the past you needed an instance of a CFC to do this.

Roles based security in the CF admin. You can set the admin to single password mode, or separate usernames and passwords. New user editor in the CF Admin. RDS can be setup the same way. Users can be restricted to just the Admin API or the Administrator itself. You can specify roles for users (like allowing a user to just see the Code Analyzer). 

cfstoredproc now supports caching

query caching now works when usig cfqueryparam

cfftp  now supports sftp

cfc serialization for session replication

Flash form restrictions removed (yawn, just move to Flex 2 folks!)

Apache Derby supported. A 100% Java database. 

You can create a Spry dataset in CF.