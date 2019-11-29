---
layout: post
title: "Ask a Jedi: Dynamically updating line items on a form"
date: "2008-09-10T12:09:00+06:00"
categories: [javascript]
tags: []
banner_image: 
permalink: /2008/09/10/Ask-a-Jedi-Dynamically-updating-line-items-on-a-form
guid: 3007
---

Sid had the following problem. He has a form with a dynamic number of line items. Each line item has 3 fields. A product quantity, a price per product, and a total for the line item. He wanted to know if it was possible to automatically update the total as you entered prices and quantities, and to also have a grand total. This is solvable via JavaScript of course, with a bit of complexity involved to handle the dynamic number of fields. Here is how I solved it - with both my own JavaScript and a jQuery solution.
<!--more-->
First let's begin by creating our form. I've hard coded the number of line items. 

<code>
&lt;cfset numItems = 5&gt;

&lt;form id="lineitems"&gt;
&lt;table&gt;
	&lt;tr&gt;
		&lt;th&gt;Product Qty&lt;/th&gt;
		&lt;th&gt;Price Per Unit&lt;/th&gt;
		&lt;th&gt;Total&lt;/th&gt;
	&lt;/tr&gt;
	
&lt;cfloop index="x" from="1" to="#numItems#"&gt;
	&lt;cfoutput&gt;
	&lt;tr&gt;
		&lt;td&gt;&lt;input type="text" name="qty_#x#" id="qty_#x#" onChange="updateData(#x#)"&gt;&lt;/td&gt;
		&lt;td&gt;&lt;input type="text" name="ppu_#x#" id="ppu_#x#" onChange="updateData(#x#)"&gt;&lt;/td&gt;
		&lt;td&gt;&lt;input type="text" name="total_#x#" id="total_#x#"&gt;&lt;/td&gt;
	&lt;/tr&gt;
	&lt;/cfoutput&gt;
&lt;/cfloop&gt;

	&lt;tr&gt;&lt;td colspan="3" bgcolor="yellow"&gt;&lt;B&gt;TOTALS:&lt;/b&gt;&lt;/td&gt;&lt;/tr&gt;
	&lt;tr&gt;
		&lt;td&gt;&lt;input type="text" name="total_qty" id="total_qty"&gt;&lt;/td&gt;
		&lt;td&gt;&nbsp;&lt;/td&gt;
		&lt;td&gt;&lt;input type="text" name="total_price" id="total_price"&gt;&lt;/td&gt;
	&lt;/tr&gt; 
&lt;/table&gt;
&lt;/form&gt;
</code>

Notice that for each line item, I've used a dynamically named ID based on the current row. Also note I use an event handler to pass the row number to an updateData function. I check the change event for both quantity and the price per unit field. (My examples will assume that folks don't mess with the totals.)

Lastly I added a row for the grand totals. It didn't make sense to me to have a grand total of the price per unit column, so I just use a grand total for quantity and the price.

Ok, now let's look at the JavaScript:

<code>
&lt;script&gt;
function updateData(x) {
	//x is the index
	var qty = document.getElementById('qty_'+x).value;
	var ppu = document.getElementById('ppu_'+x).value;
	var liTotal = document.getElementById('total_'+x);
	//if we have numbers for both, do math, else, nuke result
	if(!isNaN(qty) && !isNaN(ppu)) liTotal.value = qty*ppu;
	else liTotal.value = '';

	//now update grand total
	var i = 1;
	var totalQty = 0;
	var totalPrice = 0;
	while(thisQty = document.getElementById('qty_'+i)) {
		qty = document.getElementById('qty_'+i).value;
		liTotal = document.getElementById('total_'+i).value;
		if(!isNaN(qty)) totalQty += Number(qty);
		if(!isNaN(liTotal)) totalPrice += Number(liTotal);
		i++;
	}
	document.getElementById('total_qty').value = totalQty;
	document.getElementById('total_price').value = totalPrice;
}	
&lt;/script&gt;
</code>

So what am I doing here? I first get both the quantity and price per unit fields for the current row. If both are numbers, I do simple math to get the total.

Now look at the second part. This is going to loop over all my rows. I used a while loop, but since the total number of rows was generated server side, I could have output that as a hard coded JavaScript variable as well. For each row I get the quantity and the total. If they are numbers, I add them each to a variable. My final step is to update the grand total fields.

Ok, easy enough, right? To get me some more practice in jQuery, I decided to rewrite the template using jQuery code. Please remember I'm new at jQuery so this may not be the best way to do things. 

The first thing I wanted to do was to get rid of the event handlers. I knew that jQuery had a way to select all items of a certain type. I also knew that jQuery could add event handlers to things. So my first job was to combine that into one action. I began with the basic "run this on document ready" wrapper:

<code>
$(document).ready(function() {
//insert Skynet here...
});
</code>

Now for the hard part. If you remember the previous example, I had change events on the quantity and ppu fields. I needed a way to select all those fields. My knowledge of jQuery selectors was a bit slim - but I found that I could select all input fields based on an ID property. What I couldn't figure out was how to do "ID begins with qty_ or ID begins with ppu+". So I cheated. I modified my CFML to use dyn_ in front of all my IDs for the line items:

<code>
&lt;td&gt;&lt;input type="text" name="qty_#x#" id="dyn_qty_#x#"&gt;&lt;/td&gt;
&lt;td&gt;&lt;input type="text" name="ppu_#x#" id="dyn_ppu_#x#"&gt;&lt;/td&gt;
</code>

Once I had that, I could then write my selector:

<code>
$("input[@id^='dyn_']").bind("change",function(e) {
//smart logic here
});
</code>

Note the @id^'dyn_'. This is what means "all IDs that begin with dyn_. Since it's an attribute of input, it will only match inside input form fields. The .bind("change" portion says to bind the function I'm about to define to the change event.

Ok, now I have a new problem. I'm adding an event handler to both qty and ppu fields, but how do I know <i>which</i> one was changed?  The event handler is passed "this", which represents the item that changes. That has an ID. I can use regex then to get just the number:

<code>
var myid = this.id;
//get the Index
var index = myid.replace(/dyn_(qty|ppu)_/,"");
</code>

Now I'm back, kinda, to what I had before, a row number. The rest of the code is pretty similar to the previous edition, just a bit simpler:

<code>
var qty = $("#dyn_qty_"+index).val();
var ppu = $('#dyn_ppu_'+index).val();
var liTotal = $('#total_'+index);
//if we have numbers for both, do math, else, nuke result
if(!isNaN(qty) && !isNaN(ppu)) liTotal.val(Number(qty)*Number(ppu));
else liTotal.val('');
</code>

Now for the next part, which is updating the grand totals. My first edition used a while loop. I bet jQuery can do it better:

<code>
var totalQty = 0;
var totalPrice = 0;
$("input[@id^='dyn_qty_']").each(function() {
	if(!isNaN(this.value)) totalQty+=Number(this.value);
});

$("input[@id^='total_']").each(function() {
	if(!isNaN(this.value)) totalPrice+=Number(this.value);
});

$("#gtotal_qty").val(totalQty);
$("#gtotal_price").val(totalPrice);
</code>

Check it out. I use a selector along with the .each operator to say, do this on each instance of what was found. Note that I had to modify my form a bit to use "g" in front of the grand total fields. I did that so the @id^='total_' wouldn't match the grand total line, but just the line items.

I've attached the complete jQuery edition below. Every time I use it I like it a bit more!

<code>
&lt;script src="/jquery/jquery.js"&gt;&lt;/script&gt;
&lt;script&gt;

$(document).ready(function() {
	$("input[@id^='dyn_']").bind("change",function(e) {
		var myid = this.id;
		//get the Index
		var index = myid.replace(/dyn_(qty|ppu)_/,"");
		var qty = $("#dyn_qty_"+index).val();
		var ppu = $('#dyn_ppu_'+index).val();
		var liTotal = $('#total_'+index);
		//if we have numbers for both, do math, else, nuke result
		if(!isNaN(qty) && !isNaN(ppu)) liTotal.val(Number(qty)*Number(ppu));
		else liTotal.val('');

		var totalQty = 0;
		var totalPrice = 0;
		$("input[@id^='dyn_qty_']").each(function() {
			if(!isNaN(this.value)) totalQty+=Number(this.value);
		});
		$("input[@id^='total_']").each(function() {
			if(!isNaN(this.value)) totalPrice+=Number(this.value);
		});

		$("#gtotal_qty").val(totalQty);
		$("#gtotal_price").val(totalPrice);
		
	});

});

&lt;/script&gt;

&lt;cfset numItems = 5&gt;
&lt;form id="lineitems"&gt;
&lt;table&gt;
	&lt;tr&gt;
		&lt;th&gt;Product Qty&lt;/th&gt;
		&lt;th&gt;Price Per Unit&lt;/th&gt;
		&lt;th&gt;Total&lt;/th&gt;
	&lt;/tr&gt;
	
&lt;cfloop index="x" from="1" to="#numItems#"&gt;
	&lt;cfoutput&gt;
	&lt;tr&gt;
		&lt;td&gt;&lt;input type="text" name="qty_#x#" id="dyn_qty_#x#"&gt;&lt;/td&gt;
		&lt;td&gt;&lt;input type="text" name="ppu_#x#" id="dyn_ppu_#x#"&gt;&lt;/td&gt;
		&lt;td&gt;&lt;input type="text" name="total_#x#" id="total_#x#"&gt;&lt;/td&gt;
	&lt;/tr&gt;
	&lt;/cfoutput&gt;
&lt;/cfloop&gt;

	&lt;tr&gt;&lt;td colspan="3" bgcolor="yellow"&gt;&lt;B&gt;TOTALS:&lt;/b&gt;&lt;/td&gt;&lt;/tr&gt;
	&lt;tr&gt;
		&lt;td&gt;&lt;input type="text" name="gtotal_qty" id="gtotal_qty"&gt;&lt;/td&gt;
		&lt;td&gt;&nbsp;&lt;/td&gt;
		&lt;td&gt;&lt;input type="text" name="gtotal_price" id="gtotal_price"&gt;&lt;/td&gt;
	&lt;/tr&gt; 
&lt;/table&gt;
&lt;/form&gt;
</code>