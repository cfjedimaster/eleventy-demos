---
layout: post
title: "Monitor your ColdFusion server... Zelda style"
date: "2010-12-04T17:12:00+06:00"
categories: [flex,mobile]
tags: []
banner_image: 
permalink: /2010/12/04/Monitor-your-ColdFusion-server-Zelda-style
guid: 4041
---

Last week I had the idea that it might be kind of cool to port the <a href="http://cfam.riaforge.org">CFAM</a> project to the Blackberry Playbook. While that would be a lot of work (technically it wouldn't be if we just used a web view, but I'm talking about a proper conversion to Flex), I had the idea of a somewhat... simpler way to monitor ColdFusion on a mobile device - in this case my droid. To be honest, only video would do this justice.

<p/>

<object width="480" height="385"><param name="movie" value="http://www.youtube.com/v/zzjhSWXGJyQ?fs=1&amp;hl=en_US&amp;rel=0&amp;color1=0x234900&amp;color2=0x4e9e00"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="http://www.youtube.com/v/zzjhSWXGJyQ?fs=1&amp;hl=en_US&amp;rel=0&amp;color1=0x234900&amp;color2=0x4e9e00" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" width="480" height="385"></embed></object>

<p/>

I've included the source code for the project below. The CFC that returns the RAM usage is simple enough to just print below.

<p/>

<code>
&lt;cfcomponent&gt;

&lt;cffunction name="getHealth" access="remote" returnType="numeric" output="false"&gt;
	&lt;cfset var adminAPI = createObject("component", "CFIDE.adminapi.administrator")&gt;
	&lt;cfset var servermonitorAPI = createObject("component", "CFIDE.adminapi.servermonitoring")&gt;
	&lt;cfset adminAPI.login("admin", "admin")&gt;

	&lt;cfset var memstats = servermonitorAPI.getJVMMemoryStats()&gt;
	&lt;cfset var jvmused = fix(memstats.usedmemory/1024/1024)&gt;
	&lt;cfset var jvmfree = fix(memstats.freememory/1024/1024)&gt;

	&lt;cfset var total = jvmused+jvmfree&gt;
	&lt;cfset var freeperc = ceiling(jvmfree/total*100)&gt;
	&lt;cfset freeperc = round(freeperc/10)*10&gt;
	&lt;!---&lt;cfset var usedperc = 100-freeperc&gt;---&gt;

	&lt;cfreturn freeperc/10&gt;
	
&lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code>

<p/><p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FZeldaCF%{% endraw %}2Ezip'>Download attached file.</a></p>