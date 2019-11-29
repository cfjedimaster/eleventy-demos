---
layout: post
title: "Selecting default items using ColdFusion 8's AJAX Controls"
date: "2007-08-07T15:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/08/07/Selecting-default-items-using-ColdFusion-8s-AJAX-Controls
guid: 2258
---

So here is an interesting question. Take a look at Ben's post on <a href="http://www.forta.com/blog/index.cfm/2007/5/31/ColdFusion-Ajax-Tutorial-2-Related-Selects">related selects</a> in ColdFusion 8 (and don't forget it is even <a href="http://www.forta.com/blog/index.cfm/2007/7/17/Last-Minute-ColdFusion-Ajax-Enhancements">easier</a> now). Pretty simple, right? Well how do you set a control to use Ajax <i>and</i> have a default selected item? Turns out this isn't so easy. 

The first thing I tried was selected=, figuring that would be the easiest solution, but unfortunately it didn't work.

I then tried ajaxOnLoad, thinking maybe I could set the default myself. But ajaxOnLoad() is fired when the page is complete, but <i>before</i> those Ajax calls to populate the drop downs are done.

I then tried onLoad in the cfform tag. This didn't work at all. So I threw the problem over to <a href="http://cfsilence.com/blog/client/">Todd Sharp</a>, and together we were able to come up with a solution. It ain't pretty, but it works. My hope is that folks can look at this and suggest something nicer. I'm actually a bit surprised this isn't supported out of the box. It seems like I use forms half the time to <i>edit</i> content, not create content, so being able to set defaults is a must.

Anyway - the code:

<code>
&lt;cfajaxproxy bind="javascript:test({% raw %}{mediaid}{% endraw %},2)"&gt;
&lt;head&gt;
&lt;script&gt;
var imdone = false;
function test(x,val) {
    if(!imdone) {
    var dd = document.getElementById('mediaid');
    for(var i = 0; i &lt; dd.length; i++){
        if(dd.options[i].value == val){
            dd.selectedIndex = i;
            
        }
    }
    imdone = true;
    }
}
&lt;/script&gt;
&lt;/head&gt;

&lt;cfform &gt;
&lt;table&gt;
   &lt;tr&gt;
      &lt;td&gt;Select Media Type:&lt;/td&gt;
      &lt;td&gt;&lt;cfselect name="mediaid" id="mediaid"
            bind="cfc:art.getMedia()"
            bindonload="true" value="mediaid" display="mediatype"  /&gt;&lt;/td&gt;
   &lt;/tr&gt;
   &lt;tr&gt;
      &lt;td&gt;Select Art:&lt;/td&gt;
      &lt;td&gt;&lt;cfselect name="artid"
            bind="cfc:art.getArt({% raw %}{mediaid}{% endraw %})" value="artid" display="artname" /&gt;&lt;/td&gt;
   &lt;/tr&gt;
&lt;/table&gt;
&lt;/cfform&gt;
</code>

So first off - note the use of cfajaxproxy. It is bound to the first drop down. When the value changes, and this occurs on initial load, code is run to set the default. In this case note the hard coded value of 2. This would be #form.selected# or whatever. Also note the use of a variable to remember that the default value has been selected. The cfajaxproxy will always run on change, so we want to be sure it is run only once.

Thoughts? This code only supports one selected item, and only supports defaulting the left control, but obviously it could be extended to handle both. Again though it is a bit disappointing that essentially one line of code:

<code>
cfselect name="mediaid" id="mediaid" bind="cfc:art.getMedia()" bindonload="true" value="mediaid" display="mediatype"  /&gt;
</code>

had to be extended by about 10 lines of JavaScript. To be fair, my beloved Spry doesn't make this much easier. You can use spry:if type conditionals so it is a <i>bit</i> slimmer. Maybe someone can speak to how other frameworks like Prototype does it?

<b>Edit:</b> A followup post by Todd: <a href="http://cfsilence.com/blog/client/index.cfm/2007/8/7/Selecting-Multiple-Default-Items-With-ColdFusion-8-Ajax-Controls">Selecting Multiple Default Items With ColdFusion 8 Ajax Controls</a>