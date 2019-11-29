---
layout: post
title: "One example of dealing with JSON deserialization issues"
date: "2010-01-28T18:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/01/28/One-example-of-dealing-with-JSON-deserialization-issues
guid: 3700
---

There have been a few blog posts recently about issues with JSON and ColdFusion. Specifically issues concerning data being "transformed" into other data types. While there are a variety of ways to solve this issue, I thought I'd share one particular example, and one particular solution, I shared with a reader earlier today.

<p>

The reader was dealing with JSON returned from Facebook. This JSON packet contained a key called actor_id. When the data was translated from JSON some corruption occurred. You can see an example of this here. Notice how the third actor's ID was changed to scientific notation:

<p>

<img src="https://static.raymondcamden.com/images/Screen shot 2010-01-28 at 5.19.16 PM.png" title="Screen shot of JSON issue" />

<p>

I took a look at the JSON string and noticed that the actor IDs all took this form:

<p>

<code>
"actor_id":XXXXXXXX
</code>

<p>

I decided to simply wrap the value portion in quotes using regex:

<p>

<code>
&lt;cfset json = rereplace(json, '"actor_id":(.*?)([,}])', '"actor_id":"\1"\2', "all")&gt;
</code>

<p>

Notice that the end of my regex matches either a comma or a } to handle it being in a middle position of the object at the end. (I also had to do this for a UID value that was being corrupted.) The result clearly shows that this helped:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-01-28 at 5.22.59 PM.png" title="Regex to the rescue - again" />

<p>

I really, <b>really</b> like JSON, but I'm thinking that those of us who make use of it will need to be vigilant for issues like this. Considering that only <i>some</i> of the actor IDs values were transformed, it's easily something that could be missed earlier in development.