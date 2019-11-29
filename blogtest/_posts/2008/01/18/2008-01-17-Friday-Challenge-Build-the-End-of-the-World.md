---
layout: post
title: "Friday Challenge - Build the End of the World"
date: "2008-01-18T10:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/01/18/Friday-Challenge-Build-the-End-of-the-World
guid: 2600
---

Ok, so maybe that title is just a <i>tiny</i> bit over dramatic, but if it helps get you motivated, I say go for it. Today's challenge focuses on the little known fact that UDFs in ColdFusion act just like normal variables. By that I mean you can define a UDF and than treat it like any other variable, including passing it to another UDF or CFC method. A practical example of this is the <a href="http://www.cflib.org/udf.cfm/quicksort">quickSort</a> UDF at CFLib. It is a sorting function that lets you pass in a UDF to customize how things are sorted. Today's challenge is based on that.
<!--more-->
I've created a CFC I've named SkyNet. This CFC helps manage a computer network that also happens to be tied into the military networks. Nothing wrong with that, right? Let's look at the code behind it:

<code>
&lt;cfcomponent output="false"&gt;

&lt;cffunction name="init" access="public" returnType="skynet" output="false"&gt;
	&lt;cfargument name="targetfunction" required="true" type="any"&gt;
	&lt;cfset variables.targetfunction = arguments.targetfunction&gt;
	&lt;cfreturn this&gt;
&lt;/cffunction&gt;

&lt;cffunction name="pickTargets" access="public" returnType="array" output="false"&gt;
	&lt;cfargument name="targets" required="true" type="struct"&gt;
	
	&lt;cfset var besttargets = variables.targetfunction(targets)&gt;
	&lt;cfreturn besttargets&gt;
&lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code>

As you can see - it has 2 methods. The init method takes one argument, targetfunction. The pickTargets method takes a structure argument. Notice what it does then:

<code>
&lt;cfset var besttargets = variables.targetfunction(targets)&gt;
</code>

It actually uses the UDF you pass in to process the data. It then returns besttargets back to the caller. Now let's switch to the front end:

<code>
&lt;cfscript&gt;
function milfunc(targets) {
	var sorted = structSort(targets,"numeric","desc","militaryvalue");
	return sorted;
}

function popfunc(targets) {
	var sorted = structSort(targets,"numeric","desc","population");
	return sorted;
}

&lt;/cfscript&gt;

&lt;cfset ai = createObject("component", "skynet").init(milfunc)&gt;

&lt;cfset targets = structNew()&gt;
&lt;cfset targets[1] = structNew()&gt;
&lt;cfset targets[1].name = "Lafayette, LA"&gt;
&lt;cfset targets[1].population = 90000&gt;
&lt;cfset targets[1].militaryvalue = 0&gt;
&lt;cfset targets[2] = structNew()&gt;
&lt;cfset targets[2].name = "Area 51, Nevada"&gt;
&lt;cfset targets[2].population = 900&gt;
&lt;cfset targets[2].militaryvalue = 10&gt;

&lt;cfset sortedtargets = ai.pickTargets(targets)&gt;

&lt;cfoutput&gt;
Best Target: #targets[sortedtargets[1]].name#&lt;br&gt;
&lt;/cfoutput&gt;
</code>

So I want you to skip over the UDFs and go first to the createObject. Notice that I pass in milfunc. I'll come back to those UDFs later. I create a structure of targets where each key is also a structure with 3 keys: Name, Population, and Military Value. 

I pass these targets to SkyNet and ask it to return the sorted targets, and lastly I simply output the best target, which would be the first item. It is assumed that pickTargets returns an array of keys only.

Ok, now go back up to those 2 UDFs. Notice I have a popfunc and milfunc. PopFunc represents sorting by population with the highest first. MilFunc represents sorting by military value.

So to make SkyNet target population centers instead of military targets, I'd just switch which function I pass in.

So your task, if you chose to take it, is to write a few more sample functions. It's pretty open ended today. One function that might be nice is a UDF that tries to balance population versus military value. How would you do that? I don't know. :) You could find the average population and military values and find the targets that best balance those two. 

You could also build a "sendAMessage" target function. This one would pick the <i>lowest</i> population and military value target. The idea would be to use the mushroom cloud as a policy statement. (Of course, I don't mean to imply that our current leader would do such a thing.)

Feel free to add to the my datalist of targets, I was trying to keep it short and sweet.

Enjoy.