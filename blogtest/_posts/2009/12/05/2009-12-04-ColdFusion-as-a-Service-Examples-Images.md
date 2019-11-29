---
layout: post
title: "ColdFusion as a Service Examples - Images"
date: "2009-12-05T10:12:00+06:00"
categories: [coldfusion,flex]
tags: []
banner_image: 
permalink: /2009/12/05/ColdFusion-as-a-Service-Examples-Images
guid: 3632
---

I promised a few weeks ago that I'd eventually get around to posting some of the code from my RIAUnleashed presentation. This morning I'm going to share two of them - both related to the Image service. The first one is really simple. It allows you to enter a URL to an image. CFaaS is then used to perform a gray scale on the image and return the result to the user. The code behind this demo could be a bit cleaner perhaps, but let's take a look at it.
<!--more-->
<code>
&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;mx:WindowedApplication xmlns:mx="http://www.adobe.com/2006/mxml" layout="vertical" xmlns:cf="coldfusion.service.mxml.*" backgroundColor="0xFFFFFF"&gt;

&lt;mx:Script&gt;
&lt;![CDATA[
import mx.controls.Alert
import mx.rpc.events.ResultEvent

private function doGray():void {
	imageService.execute()
}

private function handleResult(event:ResultEvent):void {
	image.source=event.result.toString()
}

private function handleError(event:Event):void {
	mx.controls.Alert.show(event.toString())
}

]]&gt;
&lt;/mx:Script&gt;

&lt;cf:Config id="conf" cfServer="127.0.0.1" cfPort="80" serviceUserName="cfremoteuser1" servicePassword="password" /&gt;

&lt;cf:Image id="imageService" action="GrayScale" source="{% raw %}{sourceurl.text}{% endraw %}" result="handleResult(event)" fault="handleError(event)" /&gt;

&lt;mx:HBox width="100%"&gt;
	&lt;mx:Label text="Enter source url: " /&gt; &lt;mx:TextInput id="sourceurl" width="100%" /&gt; &lt;mx:Button label="Render" click="doGray()" /&gt;		
&lt;/mx:HBox&gt;

&lt;mx:Image width="100{% raw %}%" height="100%{% endraw %}" id="image" /&gt;

&lt;/mx:WindowedApplication&gt;
</code>

I want go over every line, but let's look at the CFaaS specific portions. First note the import of the namespace:

<code>
xmlns:cf="coldfusion.service.mxml.*"
</code>

This works because my project imported the cfservices SWC that ships with ColdFusion. This gives me access to the Flex components that make use of CFaaS. This demo only uses two of them. The first is the config block:

<code>
&lt;cf:Config id="conf" cfServer="127.0.0.1" cfPort="80" serviceUserName="cfremoteuser1" servicePassword="password" /&gt;
</code>

This is obviously hard coded for my server. You would need to edit this as well as ensuring you actually create a user for CFaaS in your administrator. A better application would abstract that out as well. The next component is for the image service:

<code>
&lt;cf:Image id="imageService" action="GrayScale" source="{% raw %}{sourceurl.text}{% endraw %}" result="handleResult(event)" fault="handleError(event)" /&gt;
</code>

Now one thing that confused me about CFaaS was why they used components with actions in them. In a way, it's like saying you only want to use one particular action (in this case, GrayScale) for images. What I realized later is that you certainly do not need to hard code in the action. You can easily change the action at run time with ActionScript. The flip side to this though is that we can provide specific event handlers for our operation. We probably want to react differently if a gray scale fails compared to some other call. Any way, the real magic is within the click handler for the button:

<code>
private function doGray():void {
	imageService.execute()
}
</code>

All CFaaS components (except for config) have an execute() method which - as you can probably guess - will execute the desired action. The result of this is plopped with a simple image component. Altogether you get this kick butt AIR application that I plan on selling for $9.99:

<img src="https://static.raymondcamden.com/images/Picture 263.png" />

Pretty trivial, right? The second example is a bit more full featured. Along with providing hooks to various ColdFusion services, CFaaS also provides simple file upload support. This allows you to send files to the ColdFusion server so that they can be processed. Before working on my CFaaS presentation I had never done any file uploads with Flex before, so forgive me if the code below is a bit off. 

<code>
&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;mx:WindowedApplication xmlns:mx="http://www.adobe.com/2006/mxml" layout="vertical" xmlns:cf="coldfusion.service.mxml.*" creationComplete="init()" paddingTop="0" paddingLeft="5" paddingRight="5"&gt;
	
	&lt;mx:Script&gt;
	&lt;![CDATA[
	import mx.rpc.events.ResultEvent
	import coldfusion.service.Util
	
	private var uploadURL:URLRequest
	private var fileref:FileReference = new FileReference()
	private var fileTypes:Array = new Array()
	private var imageTypes:FileFilter = new FileFilter("Images (*.jpg; *.jpeg; *.gif; *.png)" ,"*.jpg; *.jpeg; *.gif; *.png");	
	
	[Bindable] private var imageSrc:String
	
	private function init():void {
		imageSrc = ''
		
		//Set up the uploader
		uploadURL = new URLRequest()		
		uploadURL.url = "http://"+conf.cfServer+":"+conf.cfPort+conf.cfContextRoot+"/"+Util.UPLOAD_URL; 
		var variables:URLVariables = new URLVariables();
		variables.serviceusername = conf.serviceUserName; 
		variables.servicepassword = conf.servicePassword; 
		uploadURL.data = variables; 
		uploadURL.method="POST";		
		trace(uploadURL.url)

		//add the image types to the fileTYpes array
		fileTypes.push(imageTypes)
		
		//listen for the button click
		btnFilePicker.addEventListener(MouseEvent.CLICK, browseFiles);

		//listen for picking a file
		fileref.addEventListener(Event.SELECT, selectHandler);
		
	}			

	private function browseFiles(event:Event):void {
		fileref.browse(fileTypes);
	}

	private function selectHandler(event:Event):void {
		var fileRef:FileReference = event.currentTarget as FileReference
		fileRef.addEventListener(DataEvent.UPLOAD_COMPLETE_DATA, dataHandler)
		fileRef.addEventListener(IOErrorEvent.IO_ERROR, uploadErrorHandler)
		fileRef.upload(uploadURL)
	}	

	private function dataHandler(event:DataEvent):void {
		//Util.extractURLFromUploadResponse(event.data.toString())}; 
		imageSrc = Util.extractURLFromUploadResponse(event.data.toString())
		trace('dataHandler')
		trace(Util.extractURLFromUploadResponse(event.data.toString()))
	}
	
	private function uploadErrorHandler(event:Event):void {
		trace("OH CRAP")
	}
	
	private function handleResult(event:ResultEvent):void {
		trace('result url='+event.result.toString())
		imageSrc = event.result.toString()
	}
	
	private function handleDownload():void {
		var request:URLRequest = new URLRequest();
		request.url = imageSrc;
		request.method = URLRequestMethod.GET;
		var fileToDownload:FileReference = new FileReference();
		try {
			fileToDownload.download(request);
		} catch (error:Error) {
			trace("Unable to download file.");
		}

	}
	
	private function doBatch():void {
		//Note to audience - bug with Flip via batchoperation requires us to pass transpose
		var attributes:Array = [
		{% raw %}{GrayScale:{}{% endraw %}},
		{% raw %}{Blur:{}{% endraw %}},
		{% raw %}{Flip:{transpose:"180"}{% endraw %}}
		]
		batchImageService.attributes = attributes
		batchImageService.execute()
	}
	]]&gt;
	&lt;/mx:Script&gt;

	&lt;cf:Config id="conf" cfServer="127.0.0.1" cfPort="80" cfContextRoot="" serviceUserName="cfremoteuser1" servicePassword="password" /&gt;
	
	&lt;cf:Image id="gsImageService" action="GrayScale" source="{% raw %}{imageSrc}{% endraw %}" result="handleResult(event)" /&gt;
	&lt;cf:Image id="blurImageService" action="Blur" source="{% raw %}{imageSrc}{% endraw %}" result="handleResult(event)" /&gt;
	&lt;cf:Image id="flipImageService" action="Flip" source="{% raw %}{imageSrc}{% endraw %}" result="handleResult(event)" /&gt;
	&lt;cf:Image id="batchImageService" action="batchoperation" source="{% raw %}{imageSrc}{% endraw %}" result="handleResult(event)" /&gt;
	
	
	&lt;mx:ControlBar width="100%"&gt;		
	&lt;mx:Button id="btnFilePicker" label="Select a Picture" /&gt;
	&lt;mx:Spacer width="100%" /&gt;
	&lt;mx:Button label="Gray" click="gsImageService.execute()" enabled="{% raw %}{imageSrc!=''}{% endraw %}" /&gt;
	&lt;mx:Button label="Blur" click="blurImageService.execute()" enabled="{% raw %}{imageSrc!=''}{% endraw %}" /&gt;	
	&lt;mx:Button label="Flip" click="flipImageService.execute()" enabled="{% raw %}{imageSrc!=''}{% endraw %}" /&gt;
	&lt;mx:Button label="Do all" click="doBatch()" enabled="{% raw %}{imageSrc!=''}{% endraw %}" /&gt;	
	&lt;mx:Button label="Download" click="handleDownload()" enabled="{% raw %}{imageSrc!=''}{% endraw %}" /&gt;	
	
	&lt;/mx:ControlBar&gt;

	&lt;mx:Image width="100{% raw %}%" height="100%{% endraw %}" id="image" source="{% raw %}{imageSrc}{% endraw %} "/&gt;
&lt;/mx:WindowedApplication&gt;
</code>

So there is a lot more going on in this one, but it's really just a minor update to the previous version. Going from the top to the bottom, the first big change is support for handling the file uploads. You can see that the URL is built dynamically based off both the config objects as well as a UPLOAD_URL constant returned by our ColdFusion server. When the user selects a file and uploads it, we display it in an image component below and turn on our buttons. Each button makes use of a different image operation. For the most part these are simple, but note the batch operation. This one, as you can guess, allows us to perform multiple operations at once. (And make note - GrayScale is buggy within a batch operation. You must pass an empty value for it's arguments if you want to use the default operation.) Each button/service will simply do it's thing and then update the image below. 

The last part of the application is the download button. As you can guess, this will let us download our modified image after we've played with it. We now have a mini-Photoshop if you will. I plan on selling this application for 19.99. 
<img src="https://static.raymondcamden.com/images/cfjedi/Picture 341.png" /><p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fimagedemos%{% endraw %}2Ezip'>Download attached file.</a></p>