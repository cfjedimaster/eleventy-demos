---
layout: post
title: "Flex Mobile/ColdFusion Example - Art Search"
date: "2011-06-25T11:06:00+06:00"
categories: [coldfusion,flex,mobile]
tags: []
banner_image: 
permalink: /2011/06/25/Flex-MobileColdFusion-Example-Art-Search
guid: 4283
---

During my <a href="http://www.raymondcamden.com/index.cfm/2011/6/24/Slides-code-and-recording-from-my-Flex-MobileColdFusion-presentation">presentation</a> earlier this week, I showed an example of a Flex Mobile application that spoke to ColdFusion for it's data. It was a simple application (search and detail records for art work), but I thought I'd take the time to explain it a bit more. It shouldn't be considered a 100% complete application (and I'll end with some notes about what I'd consider adding to make it complete), but I hope it can give you an example what it's like to mix Flex and ColdFusion on the mobile platform.
<!--more-->
<p/>

Let me begin by talking about the application's features. When the application starts up, it will contain a text field and a search button.

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip124.png" />

<p/>

Here's the code just for the field and the button. Note how I disable the button until something is typed:

<p/>

<code>
&lt;s:TextInput id="searchTerm" width="100%" /&gt;
&lt;s:Button id="searchButton" label="Search" width="100{% raw %}%" click="doSearch(event)" enabled="{searchTerm.text!=''}{% endraw %}" /&gt;
</code>

<p/>

Searching is done via ColdFusion and Flash Remoting. Setting that up is pretty trivial. I begin by creating a RemoteObject in Flex:

<p/>

<code>
&lt;s:RemoteObject id="artService" destination="ColdFusion" source="testingzone.flexpreso.artservice" endpoint="http://127.0.0.1/flex2gateway/ "&gt;
&lt;/s:RemoteObject&gt;
</code>

<p/>

The ID there, artService, gives me a way to refer to my ColdFusion code (coming up in a bit). If you look back up at the button code, you can see clicking runs doSearch. Let's look at that.

<p/>

<code>
protected function doSearch(event:MouseEvent):void
{
	artService.search(searchTerm.text);
}
</code>

<p/>

So you may be asking yourself. Where's the "when done, do this" code? Here's an interesting little trick I really love. I'm going to display the results of the call in a List control, check it out:

<p/>

<code>
&lt;s:List id="resultsList" width="100{% raw %}%" height="100%{% endraw %}" visible="{% raw %}{resultsList.dataProvider.length&gt;0}{% endraw %}" dataProvider="{% raw %}{artService.search.lastResult}{% endraw %}"
		 labelField="ARTNAME" click="doDetail(event)"
		 showEffect="Fade" hideEffect="Fade"/&gt;
</code>

<p/>

There's a bit going on here, but pay particular attention to the dataProvider. I basically create a binding between my control and the last result of calling the search method on my API. I don't have to actually listen out for it. It's automatic. Here's an example of how it looks when a search is performed.

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip125.png" />

<p/>

The last bit I want to call out is the doDetail handler. That's run when a user clicks on a search result.

<p/>

<code>
protected function doDetail(event:MouseEvent):void
{
	var artid:int = resultsList.selectedItem.ARTID;
	navigator.pushView(ArtView,{% raw %}{artid:artid}{% endraw %});
}
</code>

<p/>

There isn't anything terribly special about this - but note the navigator.pushView line. This is an example of how Flex 4.5's view based framework can make it easy to build a multi-page mobile application. The pushView call there allows me to quickly load a new view up as well as pass data. What's cool then is that the hardware's back button will automatically know where to return. You'll see a quick example of that in a sec. Ok, so before I go any further, here is the complete page so you can see it in context.

<p/>

<code>

&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;s:View xmlns:fx="http://ns.adobe.com/mxml/2009" 
		xmlns:s="library://ns.adobe.com/flex/spark" title="Art Search" destructionPolicy="never"&gt;

	
	&lt;fx:Declarations&gt;
		&lt;s:RemoteObject id="artService" destination="ColdFusion" source="testingzone.flexpreso.artservice" endpoint="http://127.0.0.1/flex2gateway/ "&gt;
		&lt;/s:RemoteObject&gt;
	&lt;/fx:Declarations&gt;

	&lt;fx:Script&gt;
	&lt;![CDATA[

		import mx.rpc.events.FaultEvent;
		import mx.rpc.events.ResultEvent;

		protected function doSearch(event:MouseEvent):void
		{
			artService.search(searchTerm.text);
		}

		private function updateResults(evt:ResultEvent):void {
			trace("Done");
		}
		
		public function handleFault(evt:FaultEvent):void {
			trace(evt.toString());
			//Do something nice!
		}

		protected function doDetail(event:MouseEvent):void
		{
			var artid:int = resultsList.selectedItem.ARTID;
			navigator.pushView(ArtView,{% raw %}{artid:artid}{% endraw %});
		}
		
	]]&gt;
	&lt;/fx:Script&gt;
	
	&lt;s:layout&gt;
		&lt;s:VerticalLayout gap="5" paddingTop="5" paddingLeft="5" paddingRight="5" /&gt;
	&lt;/s:layout&gt;

	&lt;s:TextInput id="searchTerm" width="100%" /&gt;
	&lt;s:Button id="searchButton" label="Search" width="100{% raw %}%" click="doSearch(event)" enabled="{searchTerm.text!=''}{% endraw %}" /&gt;
	
	&lt;s:List id="resultsList" width="100{% raw %}%" height="100%{% endraw %}" visible="{% raw %}{resultsList.dataProvider.length&gt;0}{% endraw %}" dataProvider="{% raw %}{artService.search.lastResult}{% endraw %}"
			 labelField="ARTNAME" click="doDetail(event)"
			 showEffect="Fade" hideEffect="Fade"/&gt;
	
&lt;/s:View&gt;
</code>

<p/>

Let's look at the detail now for the art work. When you click one of the results, you get a view with information about the art and the actual picture.

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip126.png" />

<p/>

Woot. Fancy, right? Ok, not so much. But let's take a look at the code. When the view loads, I need to immediately get information about the art work. Now technically, I could have gotten that information back when I searched. My data isn't that heavy. But typically your search will probably just return the bare minimum it needs to render results and your detail will need to make another call for more information. My Art View begins by saying, when loaded, run a function:

<p/>

<code>
&lt;s:View xmlns:fx="http://ns.adobe.com/mxml/2009" 
		xmlns:s="library://ns.adobe.com/flex/spark" viewActivate="init(event)"&gt;
</code>

<p/>

I also define a pointer to my service. (And yes, this is a duplication of code and something I should address.)

<p/>

<code>
&lt;fx:Declarations&gt;
	&lt;s:RemoteObject id="artService" destination="ColdFusion" source="testingzone.flexpreso.artservice" endpoint="http://127.0.0.1/flex2gateway/ "&gt;
		&lt;s:method name="getDetail" result="showDetail(event)" fault="handleFault(event)" /&gt;
	&lt;/s:RemoteObject&gt;
&lt;/fx:Declarations&gt;
</code>

<p/>

Notice in this version I've explicitly defined a result and fault handler for my getDetail call. This is just another way to handle calls. I could have used that with my search call as well. My init function is simple:

<p/>

<code>
protected function init(event:ViewNavigatorEvent):void
{
	artService.getDetail(data.artid);
}
</code>

<p/>

And the result than simply grabs the values from the remote call.

<p/>


<code>
protected function showDetail(event:ResultEvent):void
{
	title = event.result.name;
	artImage.source = new URLRequest(event.result.image);
	priceText.text = "Price: " + myCFormatter.format(event.result.price);
	descText.text = event.result.description;
}
</code>

<p/>

At this point it probably make sense to just display the entire view. Here it is:

<p/>

<code>

&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;s:View xmlns:fx="http://ns.adobe.com/mxml/2009" 
		xmlns:s="library://ns.adobe.com/flex/spark" viewActivate="init(event)"&gt;
	&lt;fx:Declarations&gt;
		&lt;s:RemoteObject id="artService" destination="ColdFusion" source="testingzone.flexpreso.artservice" endpoint="http://127.0.0.1/flex2gateway/ "&gt;
			&lt;s:method name="getDetail" result="showDetail(event)" fault="handleFault(event)" /&gt;
		&lt;/s:RemoteObject&gt;
		&lt;s:CurrencyFormatter id="myCFormatter" /&gt;
	&lt;/fx:Declarations&gt;
	
	&lt;fx:Script&gt;
	&lt;![CDATA[
		import mx.rpc.events.FaultEvent;
		import mx.rpc.events.ResultEvent;
		
		import spark.events.ViewNavigatorEvent;

		protected function showDetail(event:ResultEvent):void
		{
			title = event.result.name;
			artImage.source = new URLRequest(event.result.image);
			priceText.text = "Price: " + myCFormatter.format(event.result.price);
			descText.text = event.result.description;
		}
		
		protected function handleFault(event:FaultEvent):void
		{
			// TODO Auto-generated method stub
			
		}
		
		protected function init(event:ViewNavigatorEvent):void
		{
			artService.getDetail(data.artid);
		}
	
		private function goBack(event:MouseEvent):void {
			navigator.popView();
		}

	]]&gt;
	&lt;/fx:Script&gt;

	
	&lt;s:actionContent&gt;
		&lt;s:Button label="Back" click="goBack(event)" /&gt;		
	&lt;/s:actionContent&gt;
	
	&lt;s:layout&gt;
		&lt;s:VerticalLayout gap="10" paddingLeft="10" paddingRight="10" paddingTop="10" /&gt;
	&lt;/s:layout&gt;

	&lt;s:Label id="priceText" /&gt;
	&lt;s:Label id="descText" width="100%" /&gt;
	
	&lt;s:Image id="artImage" width="100{% raw %}%" height="100%{% endraw %}" /&gt;
	
&lt;/s:View&gt;
</code>

<p/>

So the only thing I didn't show yet was the ColdFusion. My service is a CFC with two methods: search and getDetail. Here's the entire file.

<p/>

<code>
component {

	remote query function search(required string term) {
		var q = new com.adobe.coldfusion.query();    
	    q.setDatasource("cfartgallery");    
	    q.setSQL("select artid, artname from art where artname like :term or description like :term");    
	    q.addParam(name="term",value="{% raw %}%#arguments.term#%{% endraw %}",cfsqltype="cf_sql_varchar");    
	    return q.execute().getResult();	
	}
	
	remote function getDetail(required numeric id) {
		var q = new com.adobe.coldfusion.query();    
	    q.setDatasource("cfartgallery");    
	    q.setSQL("select artid, artname, description, price, largeimage from art where artid = :id");    
	    q.addParam(name="id",value="#arguments.id#",cfsqltype="cf_sql_integer");    
		var qresult = q.execute().getResult();	
		var result = { "id"=qresult.artid, "name"=qresult.artname, 
					   "description"=qresult.description, "price"=qresult.price
					  };
		//handle image
		result["image"] = "http://127.0.0.1/cfdocs/images/artgallery/" & qresult.largeimage;
		
		return result;
	}
}
</code>

<p/>

What I like about this is it isn't anything special, <b>which is kind of the point</b>. The same CFCs you've been - hopefully - writing for a while can usually be just used as is via your mobile applications. Sometimes you'll literally just need to add remote access to a method and be done with it. Most of the time you'll probably need to do <i>some</i> tweaking, but what I'm hoping is clear here is that the actual CFML isn't anything special in regards to having it work in the mobile space. This is probably no surprise. You've seen this in all my jQuery (AJAX) demos. But it bears repeating. ColdFusion is the absolute easiest way to build services for a variety of clients. 

<p/>

So I mentioned that this is a bit incomplete. What would I modify to make this more "production" ready?

<p/>

<ul>
<li>There's simple support for adding a splash screen. I could add that.
<li>My fault handlers are horrible incomplete. You really, really should plan for faults. For an application like this, I could ship a local database of art data. That way if there is some fault on the server side, or, more likely, the user is offline, they can still view data. It may be older data, but it's better than nothing.
</ul>

<p/>

I've included the FXP for this project in the attached zip. This allows you to easily import it into Flash Builder if you want to play with it. I also included the code as is (because you may not have Flash Builder) and a copy of the CFC.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FForBlogPost3%{% endraw %}2Ezip'>Download attached file.</a></p>