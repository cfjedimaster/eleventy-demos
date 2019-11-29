---
layout: post
title: "QuickSort in ColdFusion, with a ColdFusion 9 example as well"
date: "2009-07-19T12:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/07/19/QuickSort-in-ColdFusion-with-a-ColdFusion-9-example-as-well
guid: 3450
---

A reader on my forums <a href="http://www.raymondcamden.com/forums/messages.cfm?threadid=7A673595-E927-C5E4-2DCFFC748B0E6AF0">asked</a> about sorting structures. His problem was that he had an array of structs and needed to sort by one particular key within each struct.
<!--more-->
Here is a simple example of the type of data he wanted to sort:

<code>
&lt;cfset d = []&gt;
&lt;cfset d[1] = {% raw %}{name="Ray",rank="234",age="30"}{% endraw %}&gt;
&lt;cfset d[2] = {% raw %}{name="Joe",rank="423",age="18"}{% endraw %}&gt;
</code>

I've got an array with 2 structs. Each struct has the same 'form': name, rank, and age. structSort won't work on this as it required a structure, not an array. 

This is where <a href="http://www.cflib.org/udf/quicksort">QuickSort</a> comes in. QuickSort is a simple sorting function, but what makes it interesting is that you specify a unique sorting function. This lets you handle any particular type of data you can think of. So given his data, I can write a method that compares two struct nodes:

<code>
&lt;cfscript&gt;
function nodeCompare(node1, node2){
	if(node1.age lt node2.age) return -1;
	if(node1.age eq node2.age) return 0;
	if(node1.age gt node2.age) return 1;
}
&lt;/cfscript&gt;
</code>

The "API" requires that you return -1, 0, and 1 to represent less than, equal to, and greater than, but outside of that, the actual logic is 100% up to you. Assuming that the QuickSort function is already included, here is a complete example:

<code>
&lt;cfset d = []&gt;
&lt;cfset d[1] = {% raw %}{name="Ray",rank="234",age="30"}{% endraw %}&gt;
&lt;cfset d[2] = {% raw %}{name="Joe",rank="423",age="18"}{% endraw %}&gt;

&lt;cfscript&gt;
function nodeCompare(node1, node2){
	if(node1.age lt node2.age) return -1;
	if(node1.age eq node2.age) return 0;
	if(node1.age gt node2.age) return 1;
}
&lt;/cfscript&gt;

&lt;cfoutput&gt;&lt;b&gt;Unsorted data:&lt;/b&gt;&lt;/cfoutput&gt;
&lt;cfdump var="#d#"&gt;
&lt;cfset sorted = quickSort(d, nodeCompare)&gt;
&lt;cfoutput&gt;&lt;p&gt;&lt;b&gt;Sorted data:&lt;/b&gt;&lt;/cfoutput&gt;
&lt;cfdump var="#sorted#"&gt;
</code>

And the result:

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 248.png">

Ok, so it just plain works. Nice. So I next though - what about arrays of CFCs? I'd assume that would work as well, but I thought I'd give it a try and use it as another excuse to write a script-based CFC in ColdFusion 9.

I designed a super simple person.cfc with 3 properties, and then an init() function to let you quickly set up the object.

<code>
component {
	property string firstname;
	property string lastname;
	property string age;
	
	public function init(string firstname, string lastname, numeric age) {
		variables.firstname = arguments.firstname;
		variables.lastname = arguments.lastname;
		variables.age = arguments.age;
	}
}
</code>

Now that I've that, let's quickly create some people:

<code>

&lt;cfset ray = new person('Raymond','Camden',36)&gt;
&lt;cfset jeanne = new person('Jeanne','Camden',35)&gt;
&lt;cfset jacob = new person('Jacob','Camden',9)&gt;
&lt;cfset lynn = new person('Lynn','Camden',7)&gt;
&lt;cfset noah = new person('Noah','Camden',6)&gt;

&lt;cfset family = [ray,jeanne,jacob,lynn,noah]&gt;
</code>

This code demonstrates the new keyword, and notice it automatically runs my init function. Now for the sorting. I wrote two sort functions. One to sort by age and one to sort by name:

<code>
&lt;cfscript&gt;
function ageCompare(node1, node2){
	if(node1.getAge() lt node2.getAge()) return -1;
	if(node1.getAge() eq node2.getAge()) return 0;
	if(node1.getAge() gt node2.getAge()) return 1;
}
function fNameCompare(node1, node2){
	return compare(node1.getFirstName(),node2.getFirstName());
}
&lt;/cfscript&gt;
</code>

The first function is almost the exact same as my earlier example, but I've switched to calling getAge() on the component. The second function is pretty slim as it just so happens that the CFML compare function returns values in exactly the format we need for QuickSort. Altogether now, I can run my sorts:

<code>
&lt;cfset sorted = quickSort(family, ageCompare)&gt;
&lt;cfloop index="p" array="#sorted#"&gt;
	&lt;cfoutput&gt;#p.getLastName()#, #p.getFirstName()# - #p.getAge()#&lt;br/&gt;&lt;/cfoutput&gt;
&lt;/cfloop&gt;
&lt;p/&gt;
&lt;cfset sorted = quickSort(family, fNameCompare)&gt;
&lt;cfloop index="p" array="#sorted#"&gt;
	&lt;cfoutput&gt;#p.getLastName()#, #p.getFirstName()# - #p.getAge()#&lt;br/&gt;&lt;/cfoutput&gt;
&lt;/cfloop&gt;
</code>

Which gives me:

<code>
Camden, Noah - 6
Camden, Lynn - 7
Camden, Jacob - 9
Camden, Jeanne - 35
Camden, Raymond - 36

Camden, Jacob - 9
Camden, Jeanne - 35
Camden, Lynn - 7
Camden, Noah - 6
Camden, Raymond - 36
</code>

Nice. To be honest, I think I blogged about QuickSort before so this isn't something new (and I'm sure the computer scientists here will chime in about how it's not as efficient as other sorts ;) but I've always loved how the UDF works. Writing a UDF to use in another UDF just makes me happy all over.