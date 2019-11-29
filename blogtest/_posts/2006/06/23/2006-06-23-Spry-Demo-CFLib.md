---
layout: post
title: "Spry Demo: CFLib"
date: "2006-06-23T12:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/06/23/Spry-Demo-CFLib
guid: 1351
---

Ok, so I bet folks may be tired of hearing me rave about <a href="http://labs.adobe.com/technologies/spry/">Spry</a>, but I wanted to share another demo I created this morning:

<blockquote>
<a href="http://www.cflib.org/spry/">http://www.cflib.org/spry/</a>
</blockquote>

This is pretty much a clone of my <a href="http://ray.camdenfamily.com/spry/blog3.cfm">blog demo</a>, but I did add two interesting things here.

First - note the use of the filter. This is pretty easy to do in Spry. You create a filter function, and then assign it to the data set. You can do both destructive and non-destructive filtering. I did non-destructive so folks could remove the filter as well. Here is the code behind the filter. I cribbed a bit from Simon Horwith's <a href="http://www.aboutweb.com/jobs.cfm">example</a> and the Spry demos. 

<code>
function MyFilterFunc(ds, row, rowNumber) {
	if(document.filterForm != null) {
		if(document.filterForm.filter.value == '') return row;
		else {
			
			var regExpStr = document.filterForm.filter.value;				
			var regExp = new RegExp(regExpStr, "i");
			if (row["NAME"].search(regExp) != -1) return row;                   	
			else return null;
		}
	} else return row;
}

dsUDFs.filter(MyFilterFunc);
</code>

As you can see, I don't do anything too complex. The filter function is passed the ds, row, and rownumber attributes, and I just examine the row and compare it to my form data. Pretty easy, eh? I had more trouble with the regex stuff (which is why I ... 'borrowed' a bit from Simon) then I did with the Spry stuff. 

The second change was to add a simple loading message. I did this by using an observer function. This function waits for changes from the dataset. I don't actually check the result, which is kind of bad, but it does clear the "Loading" message. Here is the code behind the notification logic:

<code>
var myObserver = new Object;
myObserver.onDataChanged = function(dataSet, notificationType) {
	setNote('');
};

dsUDFs.addDataChangedObserver("myObserverName", myObserver);

function setNote(str) {
	var noteRegion = document.getElementById('notification');
	noteRegion.innerHTML = str;	
}
</code>

As with the other Spry demos, if you want to see the full code behind it, just view source. The CFLib proxy CFC isn't anything different from the BlogCFC one, just different methods. I'm going to break out my Spry "helper" methods into it's own CFC so that next time, my proxy can be even more light weight.