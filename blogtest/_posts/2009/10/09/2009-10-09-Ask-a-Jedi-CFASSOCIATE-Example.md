---
layout: post
title: "Ask a Jedi: CFASSOCIATE Example"
date: "2009-10-09T16:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/10/09/Ask-a-Jedi-CFASSOCIATE-Example
guid: 3560
---

Kaushal asks:

<blockquote>
Can you give an example and explanation of <cfassociate> please?
</blockquote>

Certainly! The cfassociate tag is used to pass data between child custom tags and the parents above them. To be precise, the cfassociate tag allows you to pass <b>attribute data</b> from a child to a parent. That distinction may not make sense at first, so let's look at a simple example.
<!--more-->
First, our template:

<code>
&lt;cf_parent name="ray"&gt;

	&lt;cf_child name="jacob"&gt;
	&lt;cf_child name="lynn"&gt;
	&lt;cf_child name="noah"&gt;
	
&lt;/cf_parent&gt;
</code>

The code calls a custom tag called parent. Inside of this call are 3 calls to a custom tag named child. Within parent.cfm I'll just dump out the thisScope, but only in the End execution mode:

<code>
&lt;cfif thisTag.executionMode is "end"&gt;
	&lt;cfdump var="#thisTag#" label="thisTag"&gt;
&lt;/cfif&gt;
</code>

Assuming child.cfm is just an empty file, our dump will be:

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2009-10-09 at 2.31.16 PM.png" />

Nothing unusual here. So here is where cfassociate comes in. What if we wanted the parent tag to be able to introspect data from the kids? We can simply add a cfassociate tag like to create this connection. Here is child.cfm:

<code>
&lt;cfassociate basetag="cf_parent"&gt;
</code>

The cfassociate tag has only one required attribute, the name of the tag to share data with. Notice the cf_ in front. Even though, mentally, I'd "name" the tag parent, ColdFusion uses a cf_ in front to signify that it is a custom tag. Now when we run the tag we see something interesting:

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2009-10-09 at 2.33.25 PM.png" />

The thisTag structure has a new key, AssocAttribs, and an array of structures. Notice that the structure data matches what we passed to the child. This is an important point. The only data passed from the child to the parent are items in the child's Attributes scope. They need not be attributes passed in either. If child.cfm does:

<code>
&lt;cfset attributes.x = 1&gt;
</code>

Then this data will be passed back as well. So where did the name AssocAttribs come from? This is the default location where ColdFusion will pass back child data. So you might ask - what if I have something <i>really</i> complex going on? Maybe something like:

<code>
&lt;cf_parent name="ray"&gt;

	&lt;cf_child name="jacob"&gt;
	&lt;cf_child name="lynn"&gt;
	&lt;cf_child name="noah"&gt;
	
	&lt;cf_pet type="dog" name="phyliss"&gt;
	&lt;cf_pet type="dog" name="ginger"&gt;
	&lt;cf_pet type="cat" name="hoshi"&gt;
	&lt;cf_pet type="cat" name="that gray one"&gt;
	&lt;cf_pet type="cat" name="that orange fat one"&gt;
		
&lt;/cf_parent&gt;
</code>

If pet.cfm uses the same cfassociate tag, we end up with this:

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2009-10-09 at 2.40.00 PM.png" />

A bit confusing, isn't it? Luckily cfassociate allows us to specify another location for our data. By using the "datacollection" argument we can specify another structure key for the data. So I've modified child.cfm like so:

<code>
&lt;cfassociate basetag="cf_parent" datacollection="childdata"&gt;
</code>

and pet.cfm like so:

<code>
&lt;cfassociate basetag="cf_parent" datacollection="petdata"&gt;
</code>

Now the data is segregated and easier to deal with:

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2009-10-09 at 2.43.00 PM.png" />

Sweet. As for what you do with that data... well it's up to you. In my 10+ years of writing CFML applications I've used this feature only once or twice. Just to complete the example though I've modified parent.cfm to inspect the child data.

<code>

&lt;cfif thisTag.executionMode is "end"&gt;
	
	&lt;cfif structKeyExists(thisTag, "childdata")&gt;
		&lt;cfoutput&gt;
		I have #arrayLen(thisTag.childdata)# children. Their names are:&lt;br/&gt;
			&lt;cfloop index="x" from="1" to="#arrayLen(thisTag.childdata)#"&gt;
				#thisTag.childdata[x].name#&lt;cfif x lt arrayLen(thisTag.childdata)&gt;, &lt;/cfif&gt;
			&lt;/cfloop&gt;
		&lt;/cfoutput&gt;
		&lt;p/&gt;
	&lt;/cfif&gt;

	&lt;cfif structKeyExists(thisTag, "petdata")&gt;
		&lt;cfoutput&gt;
		I have #arrayLen(thisTag.petdata)# pet(s). Their names are:&lt;br/&gt;
			&lt;cfloop index="x" from="1" to="#arrayLen(thisTag.petdata)#"&gt;
				#thisTag.petdata[x].name# (#thisTag.petdata[x].type#)&lt;cfif x lt arrayLen(thisTag.petdata)&gt;, &lt;/cfif&gt;
			&lt;/cfloop&gt;
		&lt;/cfoutput&gt;
		&lt;/p&gt;
	&lt;/cfif&gt;
	
&lt;/cfif&gt;
</code>

I've simply checked to see if any child or pet custom tag was run, and if so, I inspect the array of data for each. To be more complete I should ensure that name and type exist in the relevant structures, but you could imagine that being done at the child/pet level instead. 

Anyway, I hope this helps.

p.s. An off topic tip not necessarily related to the main question. You may ask - why didn't you close the child tags? Ie &lt;cf_child name="jacob"/&gt;. I normally would. To ensure that a tag doesn't run twice (once in "end" mode) when you don't really want it to, just add a &lt;cfexit mode="exitTag"&gt; to the end of that tag.