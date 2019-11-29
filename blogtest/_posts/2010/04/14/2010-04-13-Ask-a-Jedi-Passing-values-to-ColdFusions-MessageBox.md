---
layout: post
title: "Ask a Jedi: Passing values to ColdFusion's MessageBox"
date: "2010-04-14T09:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/04/14/Ask-a-Jedi-Passing-values-to-ColdFusions-MessageBox
guid: 3781
---

Richard asks:
<p>
<blockquote>
I have a table displaying a query with a delete button for each item. I'm trying to use the cfmessagebox - confirm dialog to confirm that the user want's to delete that item but cannot find a way of sending the item id to the callback function. Am I missing something obvious.
<p/>
For example click the delete button creates and then shows the confirm dialog.
<p/>
ColdFusion.MessageBox.create(messageBoxName, 'confirm', 'Delete Confirmation', 'Are you sure you want to delete this user?', deleteUserCallback);
<p/>
ColdFusion.MessageBox.show(messageBoxName);
<p/>
The user then clicks one of the buttons which calls the callback handler
<p/>
var deleteUserCallback = function(btn){<br/>
       if(btn == 'yes') {<br/>
             ColdFusion.navigate('user-delete.cfm?userid=1', 'cfdivName');<br/>
       }<br/>
}<br/>
<p/>
How would you get the user id from the delete button to the ColdFusion.navigate function via the confirm dialog?
</blockquote>
<p/>
<!--more-->
There are a couple of different ways you can solve this. Here is one solution I came up with. I began with a simple query from the cfartgallery database. For each row, I generate a button that will run a JavaScript function passing the primary key.
<p>
<code>
&lt;cfquery name="getmedia" datasource="cfartgallery"&gt;
select mediaid, mediatype
from media
&lt;/cfquery&gt;

&lt;table&gt;
	&lt;tr&gt;
		&lt;th&gt;Media Type&lt;/th&gt;
		&lt;th&gt; &lt;/th&gt;
	&lt;/tr&gt;
	&lt;cfoutput query="getmedia"&gt;
	&lt;tr&gt;
		&lt;td&gt;#mediatype#&lt;/td&gt;
		&lt;td&gt;&lt;input type="button" onClick="promptDelete(#mediaid#)" value="Delete"&gt;&lt;/td&gt;
	&lt;/tr&gt;
	&lt;/cfoutput&gt;
&lt;/table&gt;
</code>
<p>
Now let's take a look at my JavaScript:
<p>
<code>

&lt;cfajaximport tags="cfmessagebox"&gt;

&lt;script&gt;
function promptDelete(x) {
	console.log(x)
	if(!ColdFusion.MessageBox.isMessageBoxDefined('mymb'+x)) {
		ColdFusion.MessageBox.create('mymb'+x, 'confirm', 'Delete Confirmation', 'Are you sure you want to delete this user?', 
			function(picked) { 
				if(picked == 'yes') console.log("Going to delete " +x) 
			}
			);
	}
	ColdFusion.MessageBox.show('mymb'+x);
}
&lt;/script&gt;
</code>
<p>
I begin by warning ColdFusion that I need MessageBox support. The promptDelete function is passed the ID of the database record. That ID is then used to generate a dynamic name for the message box. It's possible that the user may deny the delete, and if so, the box will go away. But if they click it again we don't want to recreate the MessageBox. Therefore we first use the isMessageBoxDefined function to see if we need to create the box at all. The next critical aspect is the call back handler. Instead of pointing to an existing function, I define it inline. Because I did, I've got access to the X value (the ID that was passed in). Unfortunately the docs for the callback handler don't specify what is sent, but for a confirm based box, the first argument is the label of the button. Therefore I do a quick test to see if the value was yes, and if so... well at this point you would either submit a form or do some other type of Ajax hit. For now, I just console.log it.
<p>
I want to point out another alternative. As I mentioned, my code will generate a new MessageBox for each row clicked. You could use one core MessageBox. There is an API (ColdFusion.MessageBox.update) that allows you to reset the callback handler for the object. You could use that to simply rewrite the handler to have the right primary key.