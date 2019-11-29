---
layout: post
title: "Cool (and undocumented) ColdFusion 9 Feature"
date: "2009-08-18T22:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/08/18/Cool-and-undocumented-ColdFusion-9-Feature
guid: 3493
---

This didn't quite make the docs, nor do I think it was mentioned at CFUNITED, but one of the more interesting functions added to ColdFusion 9 is getFunctionCalledName. This returns the name of the calling function. Here is a somewhat useless example:
<!--more-->
<code>
&lt;cfscript&gt;
function foobar() {
    return getFunctionCalledName();
}
&lt;/cfscript&gt;

&lt;cfoutput&gt;#foobar()#&lt;/cfoutput&gt;
</code>

This returns foobar, since the result of getFunctionCalledName is the name of the currently executing method. A slightly more sensible example, created by <a href="http://www.elliottsprehn.com/blog/">Elliott Sprehn</a>, is the following:

<code>
component {
   variables.x = 1;
   variables.y = 2;

   function init() {
       return this;
   }

   function get() {
       var name = getFunctionCalledName();
       return variables[mid(name,4,len(name))];
   }

   function set(value) {
       var name = getFunctionCalledName();
       variables[mid(name,4,len(name))] = value;
   }

   this.getX = get;
   this.getY = get;
   this.setX = set;
   this.setY = set;
}
</code>

Notice a few things in play here. He created one generic get and set function and then made copies of them for getX/getY and setX/setY. The generic functions work by using the getFunctionCalledName to figure out the real name of the function and update the appropriate value. As an example:

<code>
&lt;cfset es = new es()&gt;
&lt;cfdump var="#es#"&gt;
&lt;cfset es.setX("foo")&gt;
&lt;cfoutput&gt;#es.getX()#&lt;/cfoutput&gt;
</code>

So can folks think of any interesting uses for this?