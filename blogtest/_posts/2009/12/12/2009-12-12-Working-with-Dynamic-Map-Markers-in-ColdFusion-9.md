---
layout: post
title: "Working with Dynamic Map Markers in ColdFusion 9"
date: "2009-12-12T16:12:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2009/12/12/Working-with-Dynamic-Map-Markers-in-ColdFusion-9
guid: 3644
---

John asks:

<blockquote>
How would you go about dynamically adding and removing cfmapitems from a cfmap?
</blockquote>

This was a question that came in yesterday. I fired off a quick reply because the answer was so simple, but I said I'd follow up with a proper example later. I wrote up a quick example and was ready to blog when I noticed the evil, mean, nasty part of his email "removing". Yeah.... that one word made me dig into code for an additional two hours trying to get it to work. I'm really upset now. Ok, I'm not. I freaking <i>love</i> solving problems. That's why I got into coding in the first place! Anyway, let's talk ColdFusion 9, maps, and markers.
<!--more-->
As you can probably guess by what I said above, it is pretty simple to add markers to a map. ColdFusion provides a simple API with: ColdFusion.Map.addMarker(). I began by creating a simple demo. 

<code>
&lt;html&gt;
&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;

$(document).ready(function() {

    $("#mapButton").click(function() {
        var address = $("#address").val()
		$.trim(address)		
		if(address == "") return
		ColdFusion.Map.addMarker("mainMap", {% raw %}{address:address, markerwindowcontent:address}{% endraw %})		
        $("#address").val("")
    })

})
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;
&lt;form&gt;
&lt;input type="text" id="address" size="50" value="Lafayette, LA"&gt; &lt;input type="button" id="mapButton" value="Look Up Address"&gt;
&lt;/form&gt;

&lt;cfmap name="mainMap" width="500" height="400" centerAddress="St. Louis, MO" showcentermarker="false"&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

This demo creates a map centered on St. Louis (where I was raised if people are curious). I turned off the marker since I was just using the address to center the map. Above it I've got a text field (with a default value to save me some typing) and a button. 

I'm using some jQuery to monitor the click even on the button. Whenever it is pressed I grab the address value and create a marker object out of it. The API takes two values: the name of the map and a structure of data to help define the marker. Here is an example of what the maps looks like after a few markers have been added:

<img src="https://static.raymondcamden.com/images/Picture 196.png" />

Woot. Works like a charm. So it was at this point I fired up my blog editor and began to write. However when I noticed he wanted to <i>remove</i> markers as well, I hit a brick wall. There is no simple ColdFusion wrapper for that part of the maps API. There is, however, a way to get the core Map object and then use any supported API there. So it should be easy, right? I discovered that there was a removeOverlay function. Markers are an overlay object and therefore if you have access to the marker object, you can simply do:

somemap.removeOverlay(marker)

However, when you add the marker to the map, you don't get access to the marker object that was added. It would perhaps be nice if ColdFusion.Map.addMarker returned the object, but as it turns out, the action itself is asynchronous. 

Dang.

So I dug some more. I noticed that ColdFusion provides a wrapper to the map event system. Looking back at the Google Maps API I found that when a new items is added to the map, an "addoverlay" event is fired. Woot. I wrote a quick proof of concept that would a) listen for addoverlay and b) remember the object added. This would then let me remove it - in theory. Here is what I came up with:

<code>
&lt;html&gt;
&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;

function markerListener(e) {
    markertarget=e
}

function init() {
    map = ColdFusion.Map.getMapObject('mainMap')
    ColdFusion.Map.addEvent('mainMap','addoverlay',markerListener)   

    $("#mapButton").click(function() {
        var address = $("#address").val()
        $.trim(address)     
        if(address == "") return
        ColdFusion.Map.addMarker("mainMap", {% raw %}{address:address, markerwindowcontent:address}{% endraw %})     
        $("#address").val("")
    })

	$("#test2").click(function() {
	    map = ColdFusion.Map.getMapObject('mainMap')
	    map.removeOverlay(markertarget) 
	})

}
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;
&lt;form&gt;
&lt;input type="text" id="address" size="50" value="Lafayette, LA"&gt; &lt;input type="button" id="mapButton" value="Look Up Address"&gt;
&lt;input type="button" id="test2" value="test2"&gt;
&lt;/form&gt;

&lt;cfmap name="mainMap" width="500" height="500" centerAddress="St. Louis, MO" showcentermarker="false"&gt;

&lt;/body&gt;
&lt;/html&gt;

&lt;cfset ajaxOnLoad('init')&gt;
</code>

If you read from the bottom up, notice that I am not using the jQuery document.ready block anymore. Why? Because it actually runs when the document is loaded, but <b>before</b> the map is ready. ColdFusion's ajaxOnLoad functionality will wait for everything to be done so I've switched to that. Within the init I've added the event listener I mentioned before. Notice it simply copies the value sent to it. Finally note I added a button I can click that will test running removeOverlay. 

If you test this script, be sure to enter <b>one</b> address. It should show how you can add a marker and then remove it.

Ok... half way there. So now the question is - how do I keep track of the marker items added, and how do I provide a way to remove them? That proved to be more difficult. I decided to do the following:

<ul>
<li>First - I'd use jQuery to create a simple block of text under the map. This text would display the adress and a simple "Remove" link. 
<li>Second - I'd keep an array of map markers in memory. I'd then simply link up the "Remove" links with the relevant items in the array. 
</ul>

This worked fine until I discovered that there are more than one kind of overlay. When you click on a map marker you can, optionally, get a nice 'balloon' box of text. That counts an overlay as well. I did some research and discovered the instanceof operator. I've used that before in Flex but never knew it existed in JavaScript. This allowed me to refine my event listener to only record map marker items. Here is the code in question:

<code>
var markers = []

function markerListener(overlay) {
    if(overlay instanceof GMarker) {
	    markers[markers.length]=overlay
	    //add a new row of content
		var address = overlay.getTitle()
	    var s = '&lt;div class="markerlabel"&gt;&lt;b&gt;Address:&lt;/b&gt; '+address+'&lt;br/&gt;&lt;a href="'+(markers.length-1)+'" class="killmarker"&gt;Remove&lt;/a&gt;'
	    $("#addresses").append(s)
    }
}
</code>

As you can see, if the object passed is a marker, I append it to the array, grab the title, and then append some simple HTML to the DOM. Notice the class on the remove link? I handle that here:

<code>
    $(".killmarker").live("click", function() {
        //get the array pos which gives us a pointer to the marker
		var pos = $(this).attr('href')
        map.removeOverlay(markers[pos]) 
		$(this).parent().remove()
        return false
    })
</code>

I use "live" to handle new items being added at runtime. I stored the array position in the URL (which is probably a bad place to store it) and use that to know which item in my markers array to use. 

Everything worked perfectly until I noticed that the HTML appended never included the address. Why? The documentation has a bug. The docs for addMarker state that following properties are supported for the marker: latitude, longitude, address, title, markercolor, markericon, address, markerwindowcontent, andshowmarkerwindow. However the title attribute really should be <b>tip</b>. I discovered this by opening up the JavaScript file ColdFusion uses to support addMarker. You will also note that cfmapitem uses tip instead of title. 

Yeah, this was fun! I've pasted the entire script below, but if you want to play with this, you can do so <a href="http://www.coldfusionjedi.com/demos/map1209/test4.cfm">here</a>. You can try the first demo <a href="http://www.coldfusionjedi.com/demos/map1209/test2.cfm">here</a> too. 

<code>
&lt;html&gt;
&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
var markers = []

function markerListener(overlay) {
    if(overlay instanceof GMarker) {
	    markers[markers.length]=overlay
	    //add a new row of content
		var address = overlay.getTitle()
	    var s = '&lt;div class="markerlabel"&gt;&lt;b&gt;Address:&lt;/b&gt; '+address+'&lt;br/&gt;&lt;a href="'+(markers.length-1)+'" class="killmarker"&gt;Remove&lt;/a&gt;'
	    $("#addresses").append(s)
    }
}

function init() {
    map = ColdFusion.Map.getMapObject('mainMap')
    ColdFusion.Map.addEvent('mainMap','addoverlay',markerListener)   

    $("#mapButton").click(function() {
        var address = $("#address").val()
        $.trim(address)     
        if(address == "") return
        ColdFusion.Map.addMarker("mainMap", {% raw %}{address:address, tip:address, markerwindowcontent:address}{% endraw %})     
        $("#address").val("")
		
    })

    $(".killmarker").live("click", function() {
        //get the array pos which gives us a pointer to the marker
		var pos = $(this).attr('href')
        map.removeOverlay(markers[pos]) 
		$(this).parent().remove()
        return false
    })

}
&lt;/script&gt;
&lt;style&gt;
#addresses {
	width:400px;
}

.markerlabel {
	padding:5px;
	background-color:yellow;
	margin-bottom:5px;
}
&lt;/style&gt;
&lt;/head&gt;

&lt;body&gt;
&lt;form&gt;
&lt;input type="text" id="address" size="50" value="Lafayette, LA"&gt; &lt;input type="button" id="mapButton" value="Look Up Address"&gt;
&lt;/form&gt;

&lt;cfmap name="mainMap" width="400" height="300" centerAddress="St. Louis, MO" showcentermarker="false"&gt;

&lt;div id="addresses"&gt;
&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;

&lt;cfset ajaxOnLoad('init')&gt;
</code>