---
layout: post
title: "Preselecting data with Spry"
date: "2006-10-09T19:10:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2006/10/09/Preselecting-data-with-Spry
guid: 1576
---

I was working with a friend today who had an interesting question. How do you preselect a row in a Spry Dataset? Turns out this was pretty simple (at first).
<!--more-->
The initial solution is to simply add an "observer" to the dataset. You can think of this as a watcher. He will sit there until a certain event (the one he cares about) is fired. At that point he will then execute custom code. There are a set of default events you can observe:

onPreLoad, onPostLoad, onLoadError, onDataChanged, onPreSort, onPostSort, onCurrentRowChanged.

You can find details about these by scrolling down to "Observer Notifications" on the <a href="http://labs.adobe.com/technologies/spry/articles/data_set_overview/">Spry documentation</a> page.

So obviously onPostLoad will do it for you. Let's take a look at an example:

<code>
var myObserver = new Object;
myObserver.onPostLoad = function(dataSet, data) {
 	var preselected = 1;
 	var id = entries.getData()[preselected]["ds_RowID"];
 	//sets the ds row
 	entries.setCurrentRow(id);
};
 
entries.addObserver(myObserver);
</code>

In this example I created a function within a JavaScript object named myObserver. This is tied to a dataset named entries. My preselect value is 1 and hard coded, but obviously it could be dynamic:

<code>
var preselected = &lt;cfoutput&gt;#form.foo#&lt;/cfoutput&gt;;
</code>

Remember that dataset rows start with 0. (Who else thinks ten million years from now we will still be starting arrays with 0 instead of 1??) Next we get the ID of the row we want:

<code>
var id = entries.getData()[preselected]["ds_RowID"];
</code>

And then lastly we use that ID to set the current selected row:

<code>
entries.setCurrentRow(id);
</code>

So this works like a charm.... almost. My friend was using a select box. I needed to preselect that as well. That's simple, right?

<code>
formfieldid.selectedIndex=preselected;
</code>

However when I ran this, the dropdown went away completely! Turns out my observer was running when the data was loaded. This was expected. But it was firing before Spry had a chance to actually update the HTML!

Luckily there is another way of handling it. Instead of watching over the dataset, we simply observe the region! I've blogged about <a href="http://ray.camdenfamily.com/index.cfm/2006/7/14/New-features-in-Spry#more">region notifications</a> before, using the simpler format of div's with state values. You can also write custom JavaScript code as well. Consider this new example:

<code>
var myObserver = new Object;
myObserver.onPostUpdate = function(notifier, data) {
	var preselected = 1;
	var id = entries.getData()[preselected]["ds_RowID"];
	//sets the ds row
	entries.setCurrentRow(id);
	//sets the drop down
	entrydd.selectedIndex=preselected;
};

Spry.Data.Region.addObserver('entry', myObserver);
</code>

This code is pretty similar, except that I use the Spry.Data.Region.addObserver function to assign the observer code to the region. Thanks go to Kin Blas of Adobe for the help with this.