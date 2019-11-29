---
layout: post
title: "Another Canvas Update"
date: "2006-04-04T13:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/04/04/Another-Canvas-Update
guid: 1187
---

Rob Gonda pointed out a bug in Canvas where it would throw an error when using a link as the first element. That has been fixed in the new release, 1.2.100. For the heck of it, I added three new "variablecomponents" to Canvas. Variable components are a method to add dynamic data to the Wiki. So for example, to include the version number of the current page, you simply do:

{% raw %}{version}{% endraw %}

How hard is it to write these? Here is how version.cfc was built:

<code>
&lt;cfcomponent hint="To display the page version, use {% raw %}{version}{% endraw %}"&gt;

	&lt;cffunction name="render" access="public" returnType="string" output="false"&gt;
		&lt;cfargument name="pageBean" type="any" required="true"&gt;
		
		&lt;cfreturn arguments.pageBean.getVersion()&gt;
		
	&lt;/cffunction&gt;
	
&lt;/cfcomponent&gt;
</code>

Canvas uses the hint in the page editing help. It passes the pageBean to the render method and all you need to do is work with that object. Once you have written the CFC, you drop it in the proper folder and refresh the Model-Glue cache with init=true. That's it.

So I added a few more of these. I also modified the last updated variable component to <i>not</i> prefix the result. This will let you add your own text to be placed in front of the date.

As always, you can download it from the <a href="http://ray.camdenfamily.com/projects/canvas">project page</a>.