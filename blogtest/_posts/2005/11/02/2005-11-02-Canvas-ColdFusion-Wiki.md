---
layout: post
title: "Canvas ColdFusion Wiki"
date: "2005-11-02T17:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/11/02/Canvas-ColdFusion-Wiki
guid: 893
---

Today the 13th (and final -sigh-) Macromedia DRK was released. My final DRK application, Canvas, is one of two ColdFusion applications featured on the DRK. Canvas is a Wiki application built using the <a href="http://www.model-glue.com">Model-Glue</a> framework. 

What I like best about it is how extensible it is. So for example, all formatting and token replacement rules are either CFC methods or CFCs. So for example, to support bold text, this is all that I needed to write:

<code>
&lt;cffunction name="render_bold" output="false" returnType="string" priority="1" hint="Use plus signs for bold. Example: +Foo+"&gt;
	&lt;cfargument name="string" type="string" required="true"&gt;
	&lt;cfargument name="webpath" type="string" required="true"&gt;

	&lt;cfset arguments.string = reReplace(arguments.string,"\+(.*?)\+", "&lt;b&gt;\1&lt;/b&gt;", "all")&gt;
		
	&lt;cfreturn arguments.string&gt;	
&lt;/cffunction&gt;
</code>

The hint from the method is used to automatically generate editing instructions for the user. More information can be found at the project page:

<a href="http://ray.camdenfamily.com/projects/canvas">http://ray.camdenfamily.com/projects/canvas</a>

I hope to have a demo set up soon.