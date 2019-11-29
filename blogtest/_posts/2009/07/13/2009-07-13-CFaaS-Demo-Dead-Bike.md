---
layout: post
title: "CFaaS Demo - Dead Bike"
date: "2009-07-13T16:07:00+06:00"
categories: [coldfusion,flex]
tags: []
banner_image: 
permalink: /2009/07/13/CFaaS-Demo-Dead-Bike
guid: 3437
---

One of the cool new features of ColdFusion 9 is CFaaS, or ColdFusion as a Service. I'll be honest, I hate the abbreviation. It makes me think of a disease. But - I'll get over it since the feature itself is so impressive. During the ColdFusion Meetup (recording <a href="http://experts.na3.acrobat.com/p53217737/">here</a>), ColdFusion Evangelist Terry Ryan demonstrated using CFDOCUMENT remotely via Flex. In his demo, he enters some text, clicks a button, and gets the URL to download a PDF. This reminded me that many moons ago, earlier in the ColdFusion 9 beta, I had created a simple demo called DeadBike. (I'll buy you a beer at CFUNITED if you can guess why.) Here is a quick video showing it in action (clicking will take you to a full screen view, so I'd recommend 'open in new tab'):

<a href="http://screencast.com/t/1VUtdwZmwY"><img src="https://static.raymondcamden.com/images//Picture 172.png"></a>

So the code behind this is very similar to what Terry showed. Note that I've been lazy and hard coded all the security information within Flex.

<code>
&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;mx:WindowedApplication xmlns:mx="http://www.adobe.com/2006/mxml" xmlns:cf="coldfusion.service.mxml.*" layout="absolute" viewSourceURL="srcview/index.html"&gt;

&lt;cf:Config id="conf" cfServer="127.0.0.1" cfPort="8502" serviceUserName="service" servicePassword="service" /&gt; 

&lt;cf:Document id="doctestnow" action="generate" format="pdf" result="handleResult(event)" fault="handleError(event)" /&gt; 

&lt;mx:Script&gt;
&lt;![CDATA[
import mx.rpc.events.ResultEvent;

public var res:String = new String();

private function renderSourceAsPDF():void {
	var source:String = sourceText.text;
	if(source.length == 0) return
	doctestnow.content = source;
	doctestnow.execute();
}		

private function handleResult(event:ResultEvent):void {  
	res=event.result.toString(); 
	pdfviewer.location=res;	
} 
        
private function handleError(event:Event):void { 
    mx.controls.Alert.show(event.toString()); 
} 

]]&gt;
&lt;/mx:Script&gt;

&lt;mx:HDividedBox width="100{% raw %}%" height="100%{% endraw %}"&gt;

	&lt;!-- source side --&gt;	
	&lt;mx:VBox width="50{% raw %}%" height="100%{% endraw %}"&gt;
		
		&lt;mx:Panel title="Source" width="100{% raw %}%" height="100%{% endraw %}"&gt;	
			&lt;mx:TextArea id="sourceText" width="100{% raw %}%" height="100%{% endraw %}" /&gt;
		&lt;/mx:Panel&gt;
	
		&lt;mx:HBox horizontalAlign="right" width="100%"&gt;
			&lt;mx:Button label="Render PDF" click="renderSourceAsPDF()" /&gt;
		&lt;/mx:HBox&gt;

	&lt;/mx:VBox&gt;
	
	&lt;!-- render side --&gt;
	&lt;mx:Panel title="PDF" width="50{% raw %}%" height="100%{% endraw %}"&gt;	
		
		 &lt;mx:HTML id="pdfviewer" width="100{% raw %}%" height="100%{% endraw %}" /&gt;

	&lt;/mx:Panel&gt;

&lt;/mx:HDividedBox&gt;	

&lt;/mx:WindowedApplication&gt;
</code>

Let's focus on the interesting bits first. You can find the connection/service information here:

<code>
&lt;cf:Config id="conf" cfServer="127.0.0.1" cfPort="8502" serviceUserName="service" servicePassword="service" /&gt; 

&lt;cf:Document id="doctestnow" action="generate" format="pdf" result="handleResult(event)" fault="handleError(event)" /&gt; 
</code>

CFaaS has two special security requirements. First, you must go to User Management and specifically create a user and then give them access to particular services. In this case I gave the user, service, access to the Document service. Secondly, you have to specify which IP addresses are allowed to use the service. Now - I have to say - this is a bit troubling. I get the idea behind it - but it's going to be a problem for an intranet. I can't imagine you would need to enter each and every single IP address of your corporation by hand. But - that seems to be the case for right now. Hopefully that will change before release. 

The code handling rendering is about as simple as it gets:

<code>
private function renderSourceAsPDF():void {
	var source:String = sourceText.text;
	if(source.length == 0) return
	doctestnow.content = source;
	doctestnow.execute();
}		
</code>

Essentially - if I ttyped something, execute the CF service. My services result handler then simply uses the HTML component to render the PDF.

<code>
private function handleResult(event:ResultEvent):void {  
	res=event.result.toString(); 
	pdfviewer.location=res;	
} 
</code>

Note that I had gotten a URL back, like Terry's demo, but I went ahead and loaded the result in the component. 

I was going to package up the demo, but it's usability by the public is very limited. I'd recommend simply copying my code into a new Flex Builder project. Remember to include the cfservices.swc file with your project!