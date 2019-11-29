---
layout: post
title: "Ask a Jedi: UDFs and CFCs"
date: "2006-05-11T12:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/05/11/Ask-a-Jedi-UDFs-and-CFCs
guid: 1262
---

Sorry for the light ColdFusion content this week. As you can tell, I'm really getting into Flex 2. Anyway, here is an interesting question from Todd:

<blockquote>
Can you clarify how/when/if it is appropriate to use/not use a UDF within a CFC?  Any thoughts on the topic?  I've seen a lot of conflicting opinions on the topic and I was hoping you could clarify.  Would it be better to just convert the UDF to a CFC and call that CFC from another CFC?  Are there best practices surrounding this topic?
</blockquote>

So first off, let's clarify something. A CFC is a collection of methods, normally written using the cffunction tag. A UDF can be written the same way. So to be precise, your question involves the use of "general purpose" routines for a CFC. Here is an example: I have a CFC that abstracts a bank account. I have another CFC that abstracts a bank customer. It just so happens that both CFCs have a need for a utility method called <a href="http://www.cflib.org/udf.cfm/paragraphformat2">paragraphFormat2 </a>. How would you add this code to your two CFCs?

One option is to simply cut and paste the cfscript into the CFC. This works (but is a bit ugly). Of course, if you find a bug in the UDF, you then need to duplicate the fix amongst multiple CFCs. You could use a cfinclude instead of course. However another problem is that the UDF will be available outside of the CFC as a public method. The cfscript format for UDFs doesn't allow for access permission changes. 

So what do I do? Normally I do exactly what you suggested. I create a CFC called "Utils" to store my UDFs. I then create an instance of this CFC inside my other CFCs. You can see this in <a href="http://ray.camdenfamily.com/projects/blogcfc">BlogCFC</a> and <a href="http://ray.camdenfamily.com/projects/canvas">Canvas</a> as well as other of my projects. 

Along with including the "Utils" CFC in my CFCs, I'll also put a copy of the CFC in the Application scope. This way I can use the UDFs in normal CFML pages as well. (As just an FYI, if for some reason you are still on CF5, Adobe recommends <i>against</i> storing UDFs in the shared scopes.)

Is this best practice? I would say so. But as always, my readers are nice and diverse, so please chime in.