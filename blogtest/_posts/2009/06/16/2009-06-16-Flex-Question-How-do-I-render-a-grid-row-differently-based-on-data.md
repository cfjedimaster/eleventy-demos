---
layout: post
title: "Flex Question: How do I render a grid row differently based on data?"
date: "2009-06-17T00:06:00+06:00"
categories: [coldfusion,flex]
tags: []
banner_image: 
permalink: /2009/06/16/Flex-Question-How-do-I-render-a-grid-row-differently-based-on-data
guid: 3397
---

Wow. So this is one of those questions that I would have sworn would be easy in Flex. The Flex Datagrid has really nice support for handling custom display of cells. But while Flex makes it easy to say, "Do this to a cell when rendering", doing something for an entire row was definitely <i>not</i> as easy. I want to thank <a href="http://www.infoaccelerator.net/blog/">Andrew Powell</a> for a lot of help with this blog entry. Any mistakes you see are entirely my fault though, not his.
<!--more-->
Ok, so before before we even begin to worry about custom row styling, let me demonstrate a very simple Flex DataGrid to ColdFusion example. Based on the <a href="http://www.raymondcamden.com/index.cfm/2009/6/3/Simple-example-of-accessing-ColdFusion-data-with-Flex">earlier example</a> I blogged about, I came up with the following simple page:

<code>
&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;mx:Application xmlns:mx="http://www.adobe.com/2006/mxml" layout="vertical" minWidth="1024" minHeight="768" creationComplete="init()"&gt;

&lt;mx:RemoteObject destination="ColdFusion" source="user" id="userService"&gt;
	&lt;mx:method name="getUsers" fault="handleFault(event)" result="getUsersResult(event)" /&gt;
&lt;/mx:RemoteObject&gt;
	
&lt;mx:Script&gt;
&lt;![CDATA[
import mx.controls.Alert;

function init():void {
	userService.getUsers()	
}


function handleFault(evt):void {
	mx.controls.Alert.show(evt.fault.faultString)
}         
   
function getUsersResult(evt):void {
	users.dataProvider=evt.result
}      		
		
]]&gt;
&lt;/mx:Script&gt;
	
&lt;mx:DataGrid id="users"&gt;
	
&lt;/mx:DataGrid&gt;

&lt;/mx:Application&gt;
</code>

You can see my RemoteObject on top. Remember that is like an alias to my CFC. On the application's creationComplete, I run the init function. This fires off the getUsers() method on my CFC. The result then simply takes the data and binds it to my data grid. Short and sweet, right? I won't bore you with my CFC. It just returns a query containing an id, age, and name column. The result is spectacular:

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 165.png">

Truly I am an experience designer, wouldn't you say? Ok, so I created a new Application in my Flex project, cut and pasted the code in, and began to dig into Google. Turned out, a <i>lot</i> of people were asking the same question. Turned out, it wasn't that simple. After a lot of digging (and bugging Andrew), I came to the conclusion that the only nice way I was going to modify a grid row based on my data was to use a cell renderer. That meant that each cell would have to do the same check to determine if it should highlight itself.

My first updated example shows this in action. I've pasted just the relevant updates below:

<code>
&lt;mx:Style&gt;
.old {% raw %}{ fontSize:12px; color: red; }{% endraw %}
.new {}	
&lt;/mx:Style&gt;
	
&lt;mx:DataGrid id="users"&gt;
	&lt;mx:columns&gt;
		&lt;mx:DataGridColumn headerText="Name" dataField="name"&gt;
			&lt;mx:itemRenderer&gt;
				&lt;mx:Component&gt;
				&lt;mx:Text text="{% raw %}{data.name}{% endraw %}" styleName="{% raw %}{data.age&gt;21?'old':'new'}{% endraw %}" /&gt;
				&lt;/mx:Component&gt;
			&lt;/mx:itemRenderer&gt;
		&lt;/mx:DataGridColumn&gt;
		&lt;mx:DataGridColumn headerText="Age" dataField="age"&gt;
			&lt;mx:itemRenderer&gt;
				&lt;mx:Component&gt;
				&lt;mx:Text text="{% raw %}{data.age}{% endraw %}" styleName="{% raw %}{data.age&gt;21?'old':'new'}{% endraw %}" /&gt;
				&lt;/mx:Component&gt;
			&lt;/mx:itemRenderer&gt;
		&lt;/mx:DataGridColumn&gt;
	&lt;/mx:columns&gt;

&lt;/mx:DataGrid&gt;
</code>

As you can see, I added 2 new styles, old and new. I'm not doing anything with new so it's empty. The old style uses both a font size and color change. There is no simple way to change the entire cell background. I'm <i>really</i> surprised by this, but, for now let's not worry about it. 

Notice that each column now has an inline itemRenderer. This is pretty darn cool. I can essentially build a custom 'block' to handle displaying my column data. The argument, data, is passed in, so I can use that in my display, as well as my stylng. Notice the use of the ternary operator there to check the data and specify the right style sheet based on age. 

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 241.png">

Not bad, right? I think now I'll call myself an "Advanced Experience Designer." I decided to take it one step further and see if I could use an externally defined item renderer. For my last example, I created a new file, MyCustomCell.mxml, and used the following code:

<code>
&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;mx:Label xmlns:mx="http://www.adobe.com/2006/mxml"&gt;

&lt;mx:Script&gt;
&lt;![CDATA[
override public function set data(value:Object):void {
	super.data = value
	if(value.age &gt; 21) this.styleName="old"
	else this.styleName="new"
}		
]]&gt;
&lt;/mx:Script&gt;

&lt;/mx:Label&gt;
</code>

This file will be used for my item renderer. It will always have data passed to it, so note the use of the data setter to handle receiving the data. Like before, I set the style based on the age. (Thanks to reader JeremyH for commenting that I needed to set the new style in the ELSE condition. When I didn't do that, it failed to work when the grid had to scroll.) My datagrid can now do:

<code>
&lt;mx:DataGrid id="users"&gt;
	&lt;mx:columns&gt;
		&lt;mx:DataGridColumn headerText="Name" dataField="name" itemRenderer="MyCustomCell" /&gt;
		&lt;mx:DataGridColumn headerText="Age" dataField="age" itemRenderer="MyCustomCell" /&gt;
	&lt;/mx:columns&gt;
&lt;/mx:DataGrid&gt;
</code>

A bit slimmer, right? Anyway, I hope this helps. For folks curious about doing true background colors, here is one of the better URLs I found. <a href="http://weblogs.macromedia.com/pent/archives/2007/02/coloring_the_ba.html">Coloring the Background of Cells</a> I have to admit - it is a bit above me. I <i>mostly</i> get what is going on here, but I thought it was a bit too complex for the blog post though so I kept things simple and stuck to updating just the text properties.