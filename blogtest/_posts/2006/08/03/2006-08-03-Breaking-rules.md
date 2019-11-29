---
layout: post
title: "Breaking rules"
date: "2006-08-03T15:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/08/03/Breaking-rules
guid: 1447
---

If you read my blog regularly, you know that I have certain "rules" I tend to harp on. Always var scope. Always check your input scopes. Etc. However, one thing to keep in mind is that there <i>are</i> perfectly good times to break the rules. Development rules and processes are there to ensure your code works well, is secure, and can be easily updated. When the rules get in the way of those things, it's time to reconsider.
<!--more-->
Here is a good example. In my <a href="http://www.blogcfc.com">blogware</a>, I support localization of the blog by use of a "resource bundle". This is basically an INI file with translations. So instead of having:

<code>
&lt;input type="submit" name="cancel" value="Cancel"&gt;
</code>

I have:

<code>
&lt;input type="submit" name="cancel" value="#application.resourceBundle.getResource("cancel")#"&gt;
</code>

What this does is look up in a translation file for a key named 'cancel' and returns the value. So one translation file exists for English, one for French, etc. (Actually, I don't ship a French file, but BlogCFC users can write their own.) 

So this works great. But it is a <b><u>major</u></b> pain in the rear to type. So, I just added this to my application.cfm file:

<code>
&lt;cfset rb = application.resourceBundleData&gt;
</code>

Application.resouceBundleData is a struct of keys and pairs. I can now do this in my cancel example:

<code>
&lt;input type="submit" name="cancel" value="#rb["cancel"]#"&gt;
</code>

This bugs me. First, the variable name is way too short. Secondly, there is no method call, so if the key doesn't exist I get an error. The "old" way would return a nice __UNKNOWNTRANSLATION__ string to let you know. Third - I don't like setting Variables (note the cap) in the Application.cfm file, and when I do, I at least use the full scope. 

So I don't like it. But I'm over it. My code is now a heck of a slot easier to read and work with. How do folks feel about things like this? I tend to be pragmatic so it doesn't <i>really</i> bug me much.