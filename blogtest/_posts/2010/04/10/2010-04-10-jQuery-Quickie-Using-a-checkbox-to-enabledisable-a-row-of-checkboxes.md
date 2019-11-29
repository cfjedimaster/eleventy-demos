---
layout: post
title: "jQuery Quickie: Using a checkbox to enable/disable a row of checkboxes"
date: "2010-04-10T16:04:00+06:00"
categories: [javascript,jquery]
tags: []
banner_image: 
permalink: /2010/04/10/jQuery-Quickie-Using-a-checkbox-to-enabledisable-a-row-of-checkboxes
guid: 3778
---

I ran into an interesting UI issue today. My solution may not be the best, but I thought others might be interested in it and be able to comment. First, let me describe the problem I was trying to solve. I'm working with a system that has Resource Types and Resources. A Resource Type is a high level definition of a group of content, like a Blog or a Forum. It contains various bits of a metadata that includes a name, description, types of content within it, and security settings. To keep things simple, imagine security is limited to logged in users and the general public. You can define then, for example, that the general public can read any content in the blog, but only logged in users can post content.
<!--more-->
<p>

Below the Resource Type level we have Resources. A Resource is simply an instance of the Resource Type. For our example, let's say it belongs to a group, so it has a pointer to that. It also has it's own name. This allows me to create a Blog instance and give it a specific name. So instead of it being called "Blog" I could call it "Pepersnitchzel." (Yes, I want to call it that.) 

<p>

Now here is where things get interesting. Along with being able to give a Resource a unique name, I also needed the ability to override security settings. So imagine we have a private blog. Unlike the normal blog where anyone can read the content, the private blog is restricted so that only logged in users can see it. So here was my problem. When editing the resource, I needed to allow the administrator to override security settings on a <b>per role and per access</b> level. Imagine the following table describes the settings for blogs in general:

<p>

<img src="https://static.raymondcamden.com/images/Screen shot 2010-04-10 at 2.53.04 PM.png" title="Permissions for the Blog" />

<p>

In this screen shot the permissions for the resource type are listed. There is no edit control here. Instead, I make the admin go to a resource type edit page to make changes. (I should possibly add a quick a link to that.) Below this I have the form where the admin can decide to override permissions. My first problem was this: How do I allow the admin to say, "I want to override permissions for guests", and allow them to select <i>nothing</i> to mean guests have no rights? In other words, given a simple row of checkboxes, how do I differentiate between "I didn't pick crap because I don't want to override security" versus "I want to override security and this role can't do squat."

<p>

For my solution I decided on a simple additional checkbox. This checkbox would be labelled OVERRIDE (Yes, I used caps, thought it would make it more obvious. This is also why I don't make many UI decision). If the checkbox is enabled, then that row is "hot" and it implies an override. I wanted to make it even more clear though. I decided to use the disabled attribute when you weren't overriding. Here is how it turned out:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-04-10 at 3.02.31 PM.png" title="Permissions for Resource" />

<p>

By default the boxes are all disabled. When I enable one, I can then select permissions for that role, or leave it blank to imply no permissions. Here is an example:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-04-10 at 3.03.40 PM.png" title="Modified Permissions" />

<p>

Ok, so enough pretty pictures. How do I actually code this in jQuery? Here is the event handler I used:

<p>

<code>

$(document).ready(function() {
	$("input[name^='perm_']").change(function() {
		if($(this).attr("checked")) $(this).closest("tr").children().children().removeAttr("disabled")
		else { 
			//remove checks
			$(this).closest("tr").children().children().removeAttr("checked")
			//make all disabled
			$(this).closest("tr").children().children().attr("disabled","true")
			//but fix me
			$(this).removeAttr("disabled")
		}
	})
})
</code>

<p>

Let's step through this line by line. My initial selector, input[name^='perm_'], is based on the name scheme I used for my OVERRIDE column. Each column's checkbox HTML looks like so:

<code>
&lt;input type="checkbox" name="perm_groupadmin" &gt;
</code>

<p>

My selector says, "Match inputs with a name that begins with perm_. Since each override checkbox is named perm_X, where X is the role, it basically matches that entire column of checkboxes. Next I simply figure out if I'm checking or not checking the box. If we are checking, I need to enable the checkboxes in the same TR row. I do this by going up to my nearest TR, and then back down my grandkids (ie, the checkboxes under the TDs). Unchecking is a bit more complex. I need to first remove the checkboxes. (I could ignore them server side, but I want this as obvious as possible to the end user.) I use removeAttr to do that. I then add in the disabled attribute. Finally, because my previous statement made <i>all</i> the checkboxes in the row disabled, I re-enable the main override checkbox I had just changed.

<p>

Thoughts? I kind of think the parent.child.child stuff feels a bit clunky. Perhaps I should use children("input") after the closest? That would remove one of the children() calls I believe.