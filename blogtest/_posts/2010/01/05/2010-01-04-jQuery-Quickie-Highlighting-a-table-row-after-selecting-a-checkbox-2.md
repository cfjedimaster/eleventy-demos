---
layout: post
title: "jQuery Quickie: Highlighting a table row after selecting a checkbox (2)"
date: "2010-01-05T09:01:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2010/01/05/jQuery-Quickie-Highlighting-a-table-row-after-selecting-a-checkbox-2
guid: 3673
---

This is a follow to an <a href="http://www.raymondcamden.com/index.cfm/2009/11/18/jQuery-Quickie-Highlighting-a-table-row-after-selecting-a-checkbox">earlier post</a> that discussed how to use jQuery and checkboxes to highlight a row. A user wrote in with two requests that were fairly sensible so I thought I'd share them here.

The first thing the user asked about was how to handle pre-selected rows. Another reader had asked that as well and I said I didn't support that because I was following a "GMail" style model where, normally, nothing is checked when the page loads. It's a fairly simple enough modification though. Consider the following.
<!--more-->
<code>
&lt;html&gt;

&lt;head&gt;
&lt;script type="text/javascript"
src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {

       $("#artTable input:checkbox").click(function() {
               $(this).parent().parent().toggleClass("highlight")
       })
})
&lt;/script&gt;
&lt;style&gt;
.highlight {
       background-color:pink;
}
&lt;/style&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;cfquery name="art" datasource="cfartgallery" maxrows="15"&gt;
select  *
from    art
&lt;/cfquery&gt;

&lt;table id="artTable" border="1"&gt;
       &lt;tr&gt;
               &lt;td&gt; &lt;/td&gt;
               &lt;th&gt;Name&lt;/th&gt;
               &lt;th&gt;Price&lt;/th&gt;
       &lt;/tr&gt;
       &lt;cfoutput query="art"&gt;
               &lt;tr &lt;cfif isSold&gt;class="highlight"&lt;/cfif&gt;&gt;
                       &lt;td&gt;&lt;input type="checkbox" name="select" value="#artid#" &lt;cfif
isSold&gt;checked&lt;/cfif&gt;&gt;&lt;/td&gt;
                       &lt;td&gt;#artname#&lt;/td&gt;
                       &lt;td&gt;#dollarFormat(price)#&lt;/td&gt;
               &lt;/tr&gt;
       &lt;/cfoutput&gt;
&lt;/table&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

I've added code so that when a piece of art is sold, it's automatically marked with the highlight class. And, um, that's it. The magic of the jQuery toggle() function means it <b>just plain works</b> which is part of the reason I love jQuery. So whether it has the class or not, the toggle() will handle it.

The second request was a bit odder. He actually wanted to use two tables to display his data. The table on top had just the name of the art and the second table had the description. He wanted to make it so that on clicking the checkbox in the first table, the corresponding record in the second table would be updated. 

I began by adding the second table:

<code>
&lt;table id="artTable1" border="1"&gt;
 &lt;tr&gt;
 &lt;th&gt;Description&lt;/th&gt;

 &lt;/tr&gt;
 &lt;cfoutput query="art"&gt;
 &lt;tr class="&lt;cfif isSold&gt;highlight&lt;/cfif&gt; id#artid#"&gt;
 &lt;td&gt;
 #description#

 &lt;/td&gt;
 &lt;/tr&gt;
 &lt;/cfoutput&gt;
 &lt;/table&gt;
</code>

As you can see, it duplicates the logic of adding the highlight class when the art is sold. But I've also added a new class, id#artid#. I'm using this as a marker. It just occurred to me that I could have tried an ID on the TR tag as well. Anyway - back to our jQuery code. The checkboxes already had a value that was the ID, so I added:

<code>
var myid = $(this).val()
</code>

and then:

<code>
$("#artTable1 tr.id"+myid).toggleClass("highlight")
</code>

The complete code listing is below, and I've set up a demo of this <a href="http://www.coldfusionjedi.com/demos/jan52010/test.cfm">here</a>.

<code>
&lt;html&gt;

&lt;head&gt;
&lt;script type="text/javascript"
src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {

       $("#artTable input:checkbox").click(function() {
				var myid = $(this).val()
               $(this).parent().parent().toggleClass("highlight")
			   $("#artTable1 tr.id"+myid).toggleClass("highlight")
       })
})
&lt;/script&gt;
&lt;style&gt;
.highlight {
       background-color:pink;
}
&lt;/style&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;cfquery name="art" datasource="cfartgallery" maxrows="15"&gt;
select  *
from    art
&lt;/cfquery&gt;

&lt;table id="artTable" border="1"&gt;
       &lt;tr&gt;
               &lt;td&gt; &lt;/td&gt;
               &lt;th&gt;Name&lt;/th&gt;
               &lt;th&gt;Price&lt;/th&gt;
       &lt;/tr&gt;
       &lt;cfoutput query="art"&gt;
               &lt;tr &lt;cfif isSold&gt;class="highlight"&lt;/cfif&gt;&gt;
                       &lt;td&gt;&lt;input type="checkbox" name="select" value="#artid#" &lt;cfif
isSold&gt;checked&lt;/cfif&gt;&gt;&lt;/td&gt;
                       &lt;td&gt;#artname#&lt;/td&gt;
                       &lt;td&gt;#dollarFormat(price)#&lt;/td&gt;
               &lt;/tr&gt;
       &lt;/cfoutput&gt;
&lt;/table&gt;

&lt;table id="artTable1" border="1"&gt;
 &lt;tr&gt;
 &lt;th&gt;Description&lt;/th&gt;

 &lt;/tr&gt;
 &lt;cfoutput query="art"&gt;
 &lt;tr class="&lt;cfif isSold&gt;highlight&lt;/cfif&gt; id#artid#"&gt;
 &lt;td&gt;
 #description#
 &lt;/td&gt;
 &lt;/tr&gt;
 &lt;/cfoutput&gt;
 &lt;/table&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>