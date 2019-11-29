---
layout: post
title: "CFCs and the Base Component"
date: "2006-07-11T11:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/07/11/CFCs-and-the-Base-Component
guid: 1392
---

So I totally dropped the ball during my <a href="http://ray.camdenfamily.com/index.cfm/2006/6/28/CFC-Presentation-Posted">CFC presentation</a> at CFUNITED and forgot to mention one of the features of ColdFusion components. I didn't mention it as I rarely have a use for it.
<!--more-->
If you look into your {% raw %}{cfinstall folder}{% endraw %}\wwwroot\WEB-INF\cftags folder, you will find an empty tag called component.cfc. Whenever you create a CFC, ColdFusion will automatically make it extend this CFC. 

So if you wanted all your CFCs to have a sayHello() method, you could just write it there. Hal Helms has a much better explanation <a href="http://halhelms.com/index.cfm?fuseaction=newsletters.show&issue=112805_basecomponent">here</a>.

So as I said, I almost never use this file. For one - I typically don't want to modify code in the cfusion folder. (Um, of course, that's not exactly true. I've written mods to the exception handling and debugging templates, but that's the Mirror Universe Ray for those Trek nerds out there.) 

Last night though I had a need to quickly examine a bean CFC. My bean CFCs typically have a bunch of set/get methods, and I thought it would be nice if I could quickly call all the get() methods. I rewrote my base Component.cfc like so:

<code>
&lt;cfcomponent&gt;

&lt;cffunction name="dump" output="true" access="public" returnType="void"&gt;
	&lt;cfset var md = getMetaData(this)&gt;
	&lt;cfset var x = ""&gt;
	&lt;cfset var result = structNew()&gt;
	&lt;cfset var value = ""&gt;
	
	&lt;cfloop index="x" from="1" to="#arrayLen(md.functions)#"&gt;
		&lt;cfif left(md.functions[x].name,3) is "get"&gt;
			&lt;cfinvoke method="#md.functions[x].name#" returnvariable="value"&gt;
			&lt;cfset result[md.functions[x].name] = value&gt;	
		&lt;/cfif&gt;
	&lt;/cfloop&gt;
	
	&lt;cfdump var="#result#"&gt;	
&lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code>

So what does this code do? It uses the meta data feature of CFCs to return the functions of the CFC itself. I loop over them, and if the method is getSomething, I simply invoke the method. Pay special attention to the cfinvoke tag:

<code>
&lt;cfinvoke method="#md.functions[x].name#" returnvariable="value"&gt;
</code>

Notice how I didn't use a component attribute? When you don't do that, cfinvoke simply looks for a method locally. So, I call all the get methods, store the result in a struct, and then dump the struct. So now my beans have a dump method. 

If I wanted I could have gotten more complex. Since I have the metadata, I could check the return type, and if it isn't complex, call the method, no matter what the name. One day I need to package up all my little dangerous mods to the CF core files.