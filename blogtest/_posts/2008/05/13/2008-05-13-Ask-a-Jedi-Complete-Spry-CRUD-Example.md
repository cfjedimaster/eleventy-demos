---
layout: post
title: "Ask a Jedi: Complete Spry CRUD Example"
date: "2008-05-13T11:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/05/13/Ask-a-Jedi-Complete-Spry-CRUD-Example
guid: 2823
---

Walter asks:

<blockquote>
<p>
I was wondering if you can help, I am trying to get my feet wet with Spry and CF, you have many blog posts that refer to this but I wanted to know if you can point me in (or have an example) of a : Add / List / Amend / Delete solution using Spry and CF, to a database. I have searched and cannot find help on this. I have managed to get CF and Spry to work, but just reading XML files, and am having a lot of trouble, getting Spry, ColdFusion and Database to play nicely.
</p>
</blockquote>

Spry really shines when it comes to 'Get the data and display it' site, but if you want a full "back and forth" type example, you need to do a bit more work. I still think it's easy, but you are right, there isn't a lot out there that shows examples of that. Here is a quick one I whipped up. I've included the code in a zip and it should work fine out of the box as I didn't use a database. (That's the only hackish part of this - but I wanted something quick and dirty to play with.)
<!--more-->
So let's start off with what our demo is going to cover. We have a database (again, not really) of products. Each product has an ID, Name, and price. Our RIA will:

<ul>
<li>List the products
<li>Have a delete link
<li>Have a form to let you update products
<li>Let you add a new product
</ul>

So let's first cover the basic listing of products, which is trivial in Spry. I wont get too detailed here as the main focus of this blog entry is on CRUD. 

We begin by simply creating a dataset:

<code>
var baseurl = "data.cfc?method=getProducts&returnFormat=json&queryFormat=column";
var mydata = new Spry.Data.JSONDataSet(baseurl,{% raw %}{path:"DATA", pathIsObjectOfArrays:true,useCache:false}{% endraw %});
mydata.setColumnType("price","number");
</code>

I'm pointing to a CFC named data.cfc. I'm using ColdFusion 8 so I can use the super-cool returnFormat support. I've specified that the price value is a number column. So far so good. Now let's look at the display.

<code>
&lt;div spry:region="mydata"&gt;
&lt;p&gt;
&lt;table width="100%" border="1"&gt;
	&lt;tr&gt;
		&lt;th spry:sort="name"  style="cursor: pointer;"&gt;Name&lt;/th&gt;
		&lt;th spry:sort="price" style="cursor: pointer;"&gt;Price&lt;/th&gt;
		&lt;th&gt;Delete&lt;/th&gt;
	&lt;/tr&gt;
	&lt;tr spry:repeat="mydata" spry:setrow="mydata" spry:select="red" spry:hover="hot"&gt;
		&lt;td style="cursor: pointer;"&gt;{% raw %}{name}{% endraw %}&lt;/td&gt;
		&lt;td style="cursor: pointer;"&gt;{% raw %}{price}{% endraw %}&lt;/td&gt;
		&lt;td&gt;&lt;a href="javascript:deleteRecord('{% raw %}{id}{% endraw %}')" onclick="return confirm('Are you sure?')"&gt;X&lt;/a&gt;&lt;/td&gt;
	&lt;/tr&gt;
&lt;/table&gt;
&lt;a href="javascript:clearForm()"&gt;Add Record&lt;/a&gt;	
&lt;/p&gt;	
&lt;/div&gt;
	
&lt;span spry:detailregion="mydata"&gt;
&lt;form name="editform"&gt;
&lt;input type="hidden" name="id" value="{% raw %}{id}{% endraw %}"&gt;
Name: &lt;input type="text" name="name" value="{% raw %}{name}{% endraw %}"&gt;&lt;br /&gt;
Price: &lt;input type="text" name="price" value="{% raw %}{price}{% endraw %}"&gt;&lt;br /&gt;
&lt;input type="button" value="Save" onclick="saveRecord()"&gt;
&lt;/form&gt;
&lt;/span&gt;
</code>

We begin with a fairly typical table to list our products. The only thing special really is the delete link. I've tied that to a JavaScript function named deleteRecord. Don't worry about the Add Record link just yet.

Moving on down the page, the form works both as a display for the products as well as our way of editing information.

So if we ignore adding records, we can focus on deleting and editing. Let's talk about deleting first as it's simple. To delete a record, we simply want to make an AJAX request with the proper information. We used deleteRecord() to handle this, so let's take a look at that code:

<code>
function deleteRecord(id) {
	Spry.Utils.loadURL("get", "data.cfc?method=deleteProduct&id=" + id, false, reloadData());
}
</code>

I use Spry.Utils.loadURL to - obviously - load a URL. In this case I simply hit my same CFC and pass the ID to delete. The false in this case signifies that I want the call to be synchronous. Why? Well when I'm done I want to reload the data so it makes sense to ensure the back end is done deleting. I <i>could</i> have deleted the record from my local copy. That would be a bit quicker than getting all the data again. But I kinda figured this was a bit safer. (Frankly, I still feel very new to the AJAX world and I reserve the right to change my mind on what's "best" at any moment. :)

The last argument, reloadData(), simply says to run this function when the AJAX call is done. This function is rather simple:

<code>
function reloadData(){
	mydata.loadData();
}
</code>

All this means is that Spry should reload the dataset. Note that when I created the dataset earlier, I specifically told Spry not to cache the results.

So that's deleting. For editing (and adding) I want to submit a form. If you remember, my form used a button that called saveRecord(). That JavaScript looks like so:

<code>
function saveRecord() {
	Spry.Utils.submitForm('editform',reloadData(),{% raw %}{url:'data.cfc?method=saveProduct'}{% endraw %});
}
&lt;/script&gt;
</code>

This uses another built-in Spry function, submitForm, to send in a collection of form data. One thing to keep in mind when using this function - you must give your form, and your form fields, name values. You can't just use IDs. 

So how do I support adding a record? All I did was write a simple JavaScript function to clear the form fields. Since the form was tied to Spry, I did this by setting the current row to an invalid value:

<code>
function clearForm(){
	mydata.setCurrentRow(-1);
}
</code>

I have some misgivings about this. It seems to work ok, but I'm not sure that what I've done is kosher. 

So that's basically it. The CFC - as I said - is a bit of a hack. In order to make a demo that would work "out of the box", I used the Application scope to create fake data. Adding, Editing, and Deleting simply manipulates this application variable. My getProducts method converts the variable to a query object on the fly. Please keep that in mind if you play with this code. "Real" code would use a database instead.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fspryfolder%{% endraw %}2Ezip'>Download attached file.</a></p>