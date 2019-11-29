---
layout: post
title: "Code and Design of Gameone"
date: "2009-04-26T22:04:00+06:00"
categories: [coldfusion,flex]
tags: []
banner_image: 
permalink: /2009/04/26/Code-and-Design-of-Gameone
guid: 3330
---

So now that I'm done enjoying <a href="http://www.festivalinternational.com/site47.php">Festival International</a>, I thought I'd do a quick write up about the code behind Gameone, the POC (proof of concept) AIR/Flex/Blaze/ColdFusion multiplayer game I released last week. I want to be sure folks remember that this is probably quite far away from 'Best Practice'. It was a learning experience for me, so please keep that in mind while reviewing the code and reading my comments. I've attached the full source code to both the front end and the server side. Note that the ColdFusion code was written very quickly and would benefit from ColdSpring. Anyway, enough with the foreplay, let's get down to it.

As I mentioned, the front end was built with Flex and AIR. I learned a <i>heck</i> of a lot while at <a href="http://www.broadchoice.com">Broadchoice</a>. One of the tools we used there was the <a href="http://code.google.com/p/swizframework/">Swiz</a> framework created by Chris Scott. Swiz helps solve one of the biggest issues I had with Flex - events. I don't mean stuff like click handlers for buttons, but more... communication between multiple files. Flex, then language, is pretty simple. But I found that once I got into multiple files, it became difficult for me to understand how best to have them work with even other.

Swiz let me set up the application almost like a Model-Glue/ColdSpring site. I created folders for the major sections of the application (which for me was just application and authentication) and within each I set up controller, model, and view folders. Swiz let me inject (copy in) code from one part of the application into another. For example, this line of code from the file that renders the Buy/Sell portion:

<code>
[Autowire(bean="stockController")]
public var stockController : StockController;
</code>

Swiz finds the controller via a Beans file that contains the stockController:

<code>
&lt;!-- stock controller --&gt;
&lt;stockControl:StockController id="stockController"/&gt; 
</code>

I was also able to define my remoteObject here:

<code>
&lt;mx:RemoteObject id="authenticationService" destination="ColdFusion" source="remoteservices.authenticationService" 
		showBusyCursor="true" channelSet="{% raw %}{myAmfChannel}{% endraw %}" /&gt;
</code>

As for events, I can define both listeners and broadcasts as well - very much like ModelGlue. So for example, I want my register form to listen for a 'registration failed' event so it could tell people when their registration failed:

<code>		Swiz.addEventListener(AuthenticationController.REGISTRATION_FAILED, registrationFailed)
</code>

The flip side, broadcasting an event, is also trivial:

<code>
private function getStockPricesResult(result:ResultEvent):void {
	var event:DynamicEvent = new DynamicEvent(StockController.STOCKS_LOADED)
	trace('back from get stocks')
	var stockData:ArrayCollection = result.result as ArrayCollection
	event.stockData = stockData
	Swiz.dispatchEvent(event);
}
</code>

Swiz does a heck of a lot more than what you will see in the code, but I can't describe how much of a relief it was to have this framework. It removed what was probably the biggest barrier to my Flex development. 

The other interesting aspect was the integration with BlazeDS. Well, not terribly interesting. The code actually is pretty trivial. The server setup was the worst part. (I talked about it more <a href="http://www.raymondcamden.com/index.cfm/2009/4/19/Have-you-installed-BlazeDS-with-ColdFusion">here</a>.) The Flex code for chatting came down to something like 10 lines of code. So for example, to tell the app to listen to and broadcast to the server begins with two declarations:

<code>
&lt;mx:Producer id="producer" destination="ColdFusionGateway" channelSet="{% raw %}{myAmfPollingChannel}{% endraw %}" fault="Alert.show(event.faultDetail)"/&gt;
&lt;mx:Consumer id="consumer"  message="handleMessage(event)" channelSet="{% raw %}{myAmfPollingChannel}{% endraw %}" destination="ColdFusionGateway" /&gt;
</code>

Sending a chat is just:

<code>
private function sendMessage():void {
	if(chatMsg.text == '') return
	var msg:AsyncMessage = new AsyncMessage();
	msg.headers.gatewayid = 'GameOne';
	msg.body = {% raw %}{ msg : chatMsg.text, user : authController.currentUser.username  }{% endraw %};
	producer.subtopic='chat'
	producer.send(msg);
	chatMsg.text=''
}
</code>

And code to handle listening (with the consumer) is first this in the init():

<code>
private function init():void {
	consumer.subtopic='chat'
 	consumer.subscribe();
}
</code>

and this for handling the actual message:

<code>
private function handleMessage(e:MessageEvent):void{
	var body :Object = e.message.body
	if(body.user != null) {
		chatWindow.htmlText = '&lt;b&gt;['+fmtDate.format(body.timestamp)+'] '+body.user + ' says: ' + body.msg + '&lt;/b&gt;\n' + chatWindow.htmlText;
	} else chatWindow.htmlText = '['+fmtDate.format(body.timestamp)+'] ' + body.msg + '\n' + chatWindow.htmlText;
}
</code>

Most of the code here is UI crap, and I think you can see that there really isn't a lot here. The one thing I'd point out is the subtopics. This is basically a 'filter' for the messages sent back and forth between the server. My game had 2 types of communications - stock updates and chat. So I simply used a different channel for each. The stock data view has a consumer as well:

<code>
stockConsumer.subtopic='stockupdate'
stockConsumer.subscribe();
</code>

Because it uses a different subtopic, it will ignore the chat messages going back and forth.

This is probably a good time to switch to the server side. The ColdFusion code is rather simple. I'll only point out the stuff specific to messaging. Stock updates are run every minute and cover both the actual price updates (which is game logic and I'll leave to those who download the code) and messaging. Here is the actual remote call invoked by the CF Scheduler. 

<code>
&lt;cfset application.stockService.updateStocks()&gt;
&lt;cfset application.messageService.notifyStockUpdate(application.stockService.getStockPrices())&gt;
</code>

The updateStock methods changes the prices and the messaging service will handle the broadcast.

<code>
&lt;cffunction name="notifyStockUpdate" access="public" returnType="void" output="false"&gt;
	&lt;cfargument name="stockdata" type="any" required="true"&gt;
	
	&lt;cfset var packet = StructNew()&gt; 
	&lt;cfset packet.body = {}&gt;
	&lt;cfset packet.body["data"] = arguments.stockdata&gt;
	
	&lt;cfset packet.destination = "ColdFusionGateway"&gt; 

	&lt;cfset packet["headers"]["DSSubtopic"] = "stockupdate" /&gt;
	&lt;cfset SendGatewayMessage("GameOne", packet)&gt; 

&lt;/cffunction&gt;
</code>

To be honest, I don't remember where I found the docs that said I should use "DSSubtopic" but it works. The last piece was the DataServicesMessaging event gateway. I set that up as a simple based on the documentation in the developer's guide. 

Ok, so this is going on a bit long. It may make sense to stop now and work on a simpler example for later in the week. But here is the thing. It is freaking <b>cool as surfboading ninja zombies</b> to see my ColdFusion scheduler run some code that then updated stuff on my AIR application. Let's wrap this now. Take a look at the code (please don't laugh too hard at any simple Flex mistakes I made), and let's talk again later in the week about some simpler examples (I have a few good ideas coming to me now).<p><a href='enclosures/E{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FGameOne%{% endraw %}20Source%2Ezip'>Download attached file.</a></p>