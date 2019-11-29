---
layout: post
title: "Forcing ColdFusion to recognize changes made to data used for Ajax bindings"
date: "2009-07-08T14:07:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2009/07/08/Forcing-ColdFusion-to-recognize-changes-made-to-data-used-for-Ajax-bindings
guid: 3426
---

While I'm definitely a jQuery fanboy to the extreme, I still have quite a bit of respect for the Ajax stuff that ships out of the box with ColdFusion 8. One of the slickest features is bindings. I love how you can simply say, "This form element monitors another and loads this URL for data." I mean look at this example:

<code>
&lt;cfselect bind="cfc:ajax.remoteCowBellService.getCowBellLocations( {% raw %}{cowbellid}{% endraw %} )" name="locationID" id="locationId" bindonload="true" queryPosition="below" display="name" value="id"&gt;
	&lt;option value="0"&gt;Choose a location ...&lt;/option&gt;
&lt;/cfselect&gt;
</code>
<!--more-->
In the above example, the drop down has its data populated by the result of a CFC call. The use of {% raw %}{cowbellid}{% endraw %} will "link" to a form field that that name or ID. When that changes, ColdFusion handles rerunning the Ajax call to populate the drop down. Brain dead simple. 

However (isn't there always a however) there is one small problem with bindings. If you ever change a value via JavaScript, and not via 'real' user interaction, then the code behind the bindings do not notice the change. 

I created a simple demo to help demonstrate this and the fix I found. First, my Ajax application:

<code>
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {

	$('#button').click(function() {
	})

})
&lt;/script&gt;

&lt;cfform name="fooform"&gt;
&lt;cfinput type="text" name="name" id="foo"&gt;
&lt;input type="button" id="button" value="test"&gt;
&lt;/cfform&gt;

&lt;cfdiv bind="url:test3.cfm?foo={% raw %}{name}{% endraw %}" /&gt;
</code>

Real impressive, right? The cfdiv is boudn to the name form field (notice I can use the name value, not the ID). When I enter stuff in the name, and then click elsewhere, ColdFusion will automatically note the change and fire off the URL request. Each type of form field that supports bindings will have a default event type to use. In this case it is "change". I can change that by using @XX on my bind to specify another event, just remembering to <b>not</b> include "on". So onKeypress would be: {% raw %}{name@keypress}{% endraw %}.

Alright - so I added a button and used jQuery to listen in to the click event. jQuery is <b>not</b> required for what I'm demonstrating today, but as I now do everything with jQuery, I just figured it would be quicker. 

I spent about an hour digging into cfajax.js. This is one of the core files automatically included when you use bindings. I combined this with Firefox and the awesome dir command. While cfajax.js is pretty obtuse (to help save size), I noticed the core object created was named ColdFusion. I began my investigation then by doing:

<code>
console.dir(ColdFusion)
</code>

Repeat after me. If I have not installed Firebug, I will do so today. Anyway, this gave me enough information to help me dig into the proper function with cfajax.js:

<code>
$E.callBindHandlers=function(id,_1e9,ev){
var el=document.getElementById(id);
if(!el){
return;
}
console.log('EXISTED')
var ls=$E.listeners;
for(var i=0;i&lt;ls.length;i++){
console.log((ls[i].ev==ev)+' ev is '+ev+' want is '+ls[i].ev)
if(ls[i].el==el&&ls[i].ev==ev&&ls[i].fn._cf_bindhandler){
console.log('FOUND MATCH')
ls[i].fn.call(null,null,ls[i].params);
}
}
}
</code>

As you can see, I added a few log messages in there to help me debug. Turns out the basic syntax you need is:

callBindHandlers(IDNAME, null, EVENTYPE)

So I tried this:

<code>
$('#button').click(function() {
ColdFusion.Event.callBindHandlers('foo',null,'change')
})
</code>

In this case I switched to the ID, not the name, and it was important that I matched my event type as well. This worked wonderfully. As I clicked the button I saw the Ajax requests being fired off. To be real sure, I did this as well:

<code>
$('#button').click(function() {
	$('#foo').val(999)
	ColdFusion.Event.callBindHandlers('foo',null,'change')
})
</code>

This worked wonderfully as well. Anyway, I hope this helps others. Obviously this is <b>not</b> documented, so use with care. I'm going to file an official ER with the ColdFusion team to see if this can be exposed and supported.