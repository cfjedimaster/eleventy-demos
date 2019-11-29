---
layout: post
title: "Web Sockets with server side logic"
date: "2012-02-29T16:02:00+06:00"
categories: [coldfusion,html5]
tags: []
banner_image: 
permalink: /2012/02/29/Web-Sockets-with-server-side-logic
guid: 4545
---

<b>Edit on March 2nd: Note that I've found that I had a misunderstanding of web sockets. Instead of beforeSendMessage, this code should be using beforePublish. See <a href="http://www.raymondcamden.com/index.cfm/2012/3/2/Web-Sockets-with-server-side-logic-2">this blog entry</a> for details.</b>

<p>

It's been a few days since my last ColdFusion 10 web socket demo, mostly because my server went nuclear and took out a few small towns in the process. While I work with engineering to figure out the issue (hey, it <i>is</i> a beta after all), I decided I'd just take advantage of Hostek's <a href="http://hostek.com/hosting/coldfusion/coldfusion10-hosting.asp">free offer</a> of ColdFusion 10 hosting. It took about 30 minutes for my account to be approved and I was up and running. So without further ado, let's carry on. (But note, if you don't remember my earlier chat demos, please see the links below.)
<!--more-->
<p>

In my <a href="http://www.raymondcamden.com/index.cfm/2012/2/23/ColdFusion-10-Web-Socket-JavaScript-APIs">last blog entry</a>, I modified the chat to return the number of users logged in. This is cool, but it would be even better to provide a <i>list</i> of users. It would also be cool if we could use that list as a way of validating your username. We don't want two people with the same name in the chat room. Luckily there is a pretty simple way of handling both of these.

<p>

Let's first discuss how we're going to create a list of users. In our earlier versions, you picked a name and began chatting. Other users knew who you were because you sent a message packet that contained your name and your message. But the server didn't really have an idea of who was who. Yes, the server knew who was connected. You can even get a list of all those clients:

<p>

<code>
allMyPeeps = wsGetSubscribers("chat");
</code>

<p>

But that information only contains metadata about the clients. Here's an example:

<p>

<img src="https://static.raymondcamden.com/images/ws1.png" />

<p>

How do we pass custom data to the server? Simple. When you subscribe to a web socket, you have the option of passing an optional structure of data. That data can be anything you want. The first change we have to make, however, is to change our cfwebsocket to <b>not</b> automatically subscribe us to the chat channel. Now we only want to subscribe after we've picked a name. So here is the tag:

<p>

<code>
&lt;cfwebsocket name="chatWS" onMessage="msgHandler"&gt;
</code>

<p>

Basically, we just have said we want our JavaScript handle to be chatWS and msgHandler to be the message handler. The user will not be subscribed. Now we update our handler for the dialog that asks for the username:

<p>

<code>
$("#usernamebutton").click(function() {
	var u = $.trim($("#username").val());
	if (u == "") {
		return;
	}
	//copies it to global scope
	username=u;
	chatWS.subscribe("chat", {userinfo: {
		username: u
	}});
			
});
</code>

<p>

So far so good? Now that server side call can get all the users:

<p>

<img src="https://static.raymondcamden.com/images/ws2.png" />

<p>

Woot. Ok, simple enough. But how do we handle "blocking" a subscription if you picked the same name as someone else? With web sockets and ColdFusion 10, you can use a CFC to handle various events in the web socket lifetime. One of them is allowSubscribe. This allows you to prevent the subscription. So first I tell ColdFusion to connect  my chat channel to a CFC (this is from Application.cfc):

<p>

<code>
this.wschannels = [
	{% raw %}{name="chat",cfclistener:"chatws"}{% endraw %}
];
</code>

<p>

Next, we define the CFC. I've got a few additional functions here, but for now, focus on allowSubscribe:

<p>

<code>
component extends="CFIDE.websocket.ChannelListener" {

   public boolean function allowSubscribe(struct subscriberInfo) {
   	   if(!structKeyExists(arguments.subscriberInfo, "userinfo")) return false;
   	   var attemptuser = arguments.subscriberInfo.userinfo.username;
   	   
   	   //lock me baby
   	   lock type="exclusive" scope="application" timeout=30 {

			var users = getUserList();
			if(arrayFind(users,attemptuser) != 0) return false;
			arrayAppend(users, attemptuser);
			
			var msg = {% raw %}{"type":"list","userlist":users}{% endraw %};
			wspublish("chat",msg);

			return true;
	   }
   }

	public any function beforeSendMessage(any message, Struct subscriberInfo) {
  	  	if(structKeyExists(message, "type") && message.type == "chat") message.chat=rereplace(message.chat, "&lt;.*?&gt;","","all");
		return message;
	}

	public function afterUnsubscribe(Struct subscriberInfo) {
		var users = getUserList();			
		var msg = {% raw %}{"type":"list","userlist":users}{% endraw %};
		wspublish("chat",msg);
	}
	
	public function getUserList() {
		var users = [];
		arrayEach(wsGetSubscribers('chat'), function(item) {
			arrayAppend(users, item.subscriberinfo.userinfo.username);
		});
		return users;
	}

}
</code>

<p>

The logic is simple. Look at our request to see what the username is. Then - within a lock to ensure it's single threaded - get a list of users (via the getUserlist utility method I wrote) and see if we're logged in. Something else interesting is going on in there too:

<p>

<code>
var users = getUserList();
if(arrayFind(users,attemptuser) != 0) return false;
arrayAppend(users, attemptuser);
			
var msg = {% raw %}{"type":"list","userlist":users}{% endraw %};
wspublish("chat",msg);
</code>

<p>

This code will take the userlist, and if everything is kosher, add the new guy, and publish the list. Basically, our server now broadcasts out that the user list has changed. There's no need then for me to write code to handle asking the server for a recent user list. The server is smart enough to tell the clients instead. 

<p>

Notice that we also have afterUnsubscribe. This would normally then handle updating the list when people leave. However, there is a bug in the current build where this method is not called when you close your browser (or tab). To be clear, the client is removed from the list, but the event handler isn't fired. (It's reported and will be fixed soon.) 

<p>

Ok - so now let's go back to our front end code. Our message handler has gotten a bit complex. (And I really should rewrite it to use a switch statement.)

<p>

<code>
function msgHandler(message) {

	if (message.type == "data") {
		var data = JSON.parse(message.data);
		if (data.type == "chat") {
			$("#chatlog").append(data.username + " says: " + data.chat + "\n");
			$("#chatlog").scrollTop($('#chatlog')[0].scrollHeight);
		}
		else if (data.type == "subscribe") {
				$("#chatlog").append(data.chat + "\r");
				$("#chatlog").scrollTop($('#chatlog')[0].scrollHeight);
		} else if (data.type == "list") {
			var list = data.userlist.join(", ");
			$("#userCount").html(list);		
		}			
	}

	//handle failed sub
	if (message.type == "subscribe" && message.code == -1) {
		$("#modalerror").text("Username already taken!");
	}
		
	//handle subscription
	if(message.type == "response" && message.reqType == "subscribe") {
	msg = {
		type: "subscribe",
		username: username,
		chat: username+" joins the chat."
	};
	chatWS.publish("chat",msg);
	$("#usernamemodal").modal("hide");
		//run a manual invoke to get the user list
		chatWS.invoke("chat4.chatws","getUserList");
	}
		
	//handle user list
	if(message.type == "response" && message.reqType == "invoke") {
		if (message.code != 0) {
			console.log("ERROR");
			console.dir(message);
		}
		var data = JSON.parse(message.data);
		var list = data.join(", ");
		$("#userCount").html(list);		
	}
}
</code>

<p>

As I said - a bit complex, right? Our message handler is now being used for multiple purposes. It gets basic chats. It gets responses for subscriptions. It also gets user lists. We have to be able to handle all of that. I could definitely write this cleaner, more documented, etc. I'll call out one line in particular:

<p>

<code>
//run a manual invoke to get the user list
chatWS.invoke("chat4.chatws","getUserList");
</code>

<p>

The purpose of this is that when you first login, the broadcast of users is sent to subscribed users, but it's sent before we return true in the CFC handler, therefore you aren't actually included. The invoke method on the chatWS object lets me run a CFC method. In this case, I'm just hitting that utility method I set up.

<p>

Make sense?

<p>

So - that's it for now. I've got one more modification coming up soon (a user found another hack with my code, and I'll blog how to fix it next). You can test the demo below. I've also included a zip of the code.

<p>


<a href="http://fivetag-cf10beta.securecb1cf10.ezhostingserver.com/chat4/"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a><p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2012%{% endraw %}2Eraymondcamden{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fchat4%{% endraw %}2Ezip'>Download attached file.</a></p>