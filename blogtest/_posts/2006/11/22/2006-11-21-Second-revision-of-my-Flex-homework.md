---
layout: post
title: "Second revision of my Flex homework"
date: "2006-11-22T09:11:00+06:00"
categories: [flex]
tags: []
banner_image: 
permalink: /2006/11/22/Second-revision-of-my-Flex-homework
guid: 1669
---

Yesterday I <a href="http://ray.camdenfamily.com/index.cfm/2006/11/21/First-stab-at-my-Flex-homework">posted</a> the first version of the Flex assignment I created for myself.  (For more information about what I'm doing, read this <a href="http://ray.camdenfamily.com/index.cfm/2006/11/21/My-Thanksgiving-Flex-Homework">entry</a>.)

I mentioned that I had a bit of trouble with states but that I felt I was slowly getting it. However - after speaking a bit with Mike Kollen, I think I realized that I was using states incorrectly. He said that he only uses states when he is modifying controls on screen. An example of this would be a search form that has an "Advanced" mode with more buttons. He said for full "change the whole page" type operations, ViewStacks may be more appropriate. 

So I switched my code from using States to ViewStacks. The nice thing about ViewStacks is that they work exactly like I imagined States would. You basically wrap a set of components in the ViewStack, and only one child is visible at a time. Here is the new ViewStack-ified version of my code:

<code>
&lt;mx:ViewStack id="mainView" width="100{% raw %}%" height="100%{% endraw %}"&gt;
		
	&lt;mx:HBox horizontalAlign="center" verticalAlign="middle" id="loginStage" width="100{% raw %}%" height="100%{% endraw %}"&gt;
			
		&lt;mx:Panel id="loginScreen" title="The Logon Screen" width="500"&gt;
			
			&lt;mx:Form id="login" defaultButton="{% raw %}{loginButton}{% endraw %}"&gt;
				&lt;mx:FormItem label="Username:" required="true"&gt;
						&lt;mx:TextInput id="username" /&gt;
				&lt;/mx:FormItem&gt;
				&lt;mx:FormItem label="Password:" required="true"&gt;
						&lt;mx:TextInput id="password" displayAsPassword="true" /&gt;
				&lt;/mx:FormItem&gt;
		
			&lt;/mx:Form&gt;
				
			&lt;mx:ControlBar horizontalAlign="right"&gt;
				&lt;mx:Button id="loginButton" label="Login" click="checkForm()" /&gt;
			&lt;/mx:ControlBar&gt;
		            
		&lt;/mx:Panel&gt;
	
	&lt;/mx:HBox&gt;
		
	&lt;mx:HBox id="mainStage" width="100{% raw %}%" height="100%{% endraw %}"&gt;
		&lt;mx:Text text="Main Stage" /&gt;	
	&lt;/mx:HBox&gt;
	
&lt;/mx:ViewStack&gt;
</code>

Notice that my two HBoxs act like pages of the application. How do I switch my current page? My checkForm function now does this:

<code>
mainView.selectedIndex=1;
</code>

mainView was the name of the ViewStack container itself. If you want to see the complete code, go here:

<a href="http://ray.camdenfamily.com/demos/flexsec2/SimpleRemotingTest.html">http://ray.camdenfamily.com/demos/flexsec2/SimpleRemotingTest.html</a>

You can also right click/view source on this demo to see the complete code. 

Next up is the actual authentication. I'm going to do the simple Flash Remoting call at first and then look at how I can use this to call secured CFC methods.

Open Question: Look at the code I used to select the ViewStack. That feels fragile to me. What if, for some reason, I swap the children of my ViewStack? It seems like it would be nicer to do something like:

<code>
mainView.selectedChild("id of the child");
</code>

As far as I know, ViewStacks don't support that - but a utility function could be created to do that I suppose. Thoughts?