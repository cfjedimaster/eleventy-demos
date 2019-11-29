---
layout: post
title: "Flex Datagrids - not for simple arrays"
date: "2007-01-23T11:01:00+06:00"
categories: [coldfusion,flex]
tags: []
banner_image: 
permalink: /2007/01/23/Flex-Datagrids-not-for-simple-arrays
guid: 1791
---

Ok, so time for yet another "duh" moment in my Flex learning. Let me describe the situation I ran into a few days ago. I was working with a ColdFusion Component method that returned an array of objects. This array was being used in a datagrid. So far so good.
<!--more-->
One of the things I wanted to do was make it so that when you selected an item from the datagrid, a <i>second</i> datagrid would be populated with a value from the selected item in the first datagrid. My initial array of objects contained a field, typicalsongs, that was also an array.

So here is where things got weird. At runtime when I clicked on an item in the first datagrid, I got the following error:

<blockquote>
Variable Typical Song 1 for Station 1 is not defined
</blockquote>

So this was really confusing. "Typical Song 1" was the literal first value in the array that should have been loaded into the second datagrid. 

It didn't make any sense (and to defend my newbie-status, it confused a few experts as well). While I was trying to figure this out, I reminded myself that I needed to eventually added a DataGridColumn so I can provide a nice label.

Then it hit me. I was trying to load an array of simple values (strings) to the DataGrid. However, DataGrids want arrays of objects. That's where the grid gets the column labels in the first place.

So I'm not sure this is the best solution, but I fixed this in the Flex application. I tend to think I should keep my remote services more generalized and now build them just one for one client. Anyway, I used this code to handle the "rewriting" of the data:

<code>
private function loadSongs():void {
	var currItem:Object = stationlistDG.selectedItem;
	//The datagrid needs an "object", not a simple list
	//I'm fixing it here as I feel that the web service is "right"
	var newSongArray:Array = new Array();
	for(var i:int=0; i &lt; currItem.TYPICALSONGS.length; i++) {
		var newSong:Object = new Object;
		//matching case of stuff returned from CF
		newSong.SONG = currItem.TYPICALSONGS[i];
		newSongArray[newSongArray.length] = newSong;
		}
	songlistDG.dataProvider=newSongArray;
}	
</code>

I could probably do this using the result handler of the initial call. My initial dataset is pretty small (and is guaranteed to be small) so that may make more sense.

Any other opinions?