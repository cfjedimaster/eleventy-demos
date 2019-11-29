---
layout: post
title: "Adding Login/Registration to a Flex Mobile project"
date: "2011-05-29T11:05:00+06:00"
categories: [flex,mobile]
tags: []
banner_image: 
permalink: /2011/05/29/Adding-LoginRegistration-to-a-Flex-Mobile-project
guid: 4251
---

What follows is a simple experiment in adding login and registration to a Flex Mobile project. There are probably better ways of doing this but my main interest here was to see what was possible. I've done this before with Flex applications. It's not difficult at all. But Flex Mobile has a different way of handling user views. There's a push/pop system that makes it easier to direct the user throughout the application. Specifically I was curious about the tabbed navigator - one of two main views Flex Mobile applications start with - and how it could handle presenting a User/Registration view that could be swapped to the 'real' UI once finished. Again - this was just me playing around to see what was possible. Consider it a proof of concept. Also - I avoided doing "real" login/registration as you will see. Doing network calls in a Flex Mobile application is no more difficult than a traditional Flex application. If readers want to see that, I can definitely make it real. (I'd estimate it would take me longer to FTP the ColdFusion files to my server than it would to actually write the code.)

<p>
<!--more-->
I began with a new Flex Mobile application that started off with the Tabbed view.

<p>


<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip98.png" />

<p>

One of the things I really like about Flash Builder is how far it goes to help you get things done quicker. Notice in the UI above I was able to add my two tabs (Login and Registration) before I even finished creating the project. My finished application is going to need more tabs of course, but these are the two initial tabs I'll be starting off with. Once done I can immediately run my application and switch between my Login and Registration views.

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip99.png" />

<p>

Ok - so what next? Remember I said I didn't want to bother with a real login/registration process. I just needed to fake it. I decided to add a simple form with a static login process that once done would 'speak' to my parent application to begin the 'switch to normal' process. Here's the login view:

<p>

<code>

&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;s:View xmlns:fx="http://ns.adobe.com/mxml/2009" 
		xmlns:s="library://ns.adobe.com/flex/spark" title="Login"&gt;
	
	&lt;fx:Script&gt;
	&lt;![CDATA[
	import mx.core.FlexGlobals;

	protected function handleLogin(event:MouseEvent):void {
		if(username.text == "user" && password.text == "password") {
			FlexGlobals.topLevelApplication.loadMain();
		} else {
			statusLabel.text = "Incorrect. (Try user/password)";
		}
	}
	]]&gt;
	&lt;/fx:Script&gt;
	
	&lt;s:layout&gt;
		&lt;s:VerticalLayout gap="10" paddingTop="10" paddingLeft="10" paddingRight="10" /&gt;
	&lt;/s:layout&gt;

	&lt;s:Label text="Username: " /&gt;
	&lt;s:TextInput id="username" width="100%" /&gt;
	
	&lt;s:Label text="Password: " /&gt;
	&lt;s:TextInput id="password" displayAsPassword="true" width="100%" /&gt;
	
	&lt;s:Button label="Login" click="handleLogin(event)" width="100%" /&gt;

	&lt;s:Label id="statusLabel" color="#FF0000" fontWeight="bold" /&gt;
	
&lt;/s:View&gt;
</code>

<p>

The bottom of this template is just a form. Two labels and a button. I also added a label that will be used for a status message when login fails. If you go to the top and look at the handleLogin function, you can see I've hard coded a valid username and password. The truly important line to focus in on here is this:

<p>

<code>
FlexGlobals.topLevelApplication.loadMain();
</code>

<p>

The use of FlexGlobals is something I recently discovered from another Flex Mobile application. By using FlexGlobals.topLevelApplication I get a quick and simple pointer to the top level file of my application. The registration view is even simpler. My form is a little different, but the click handler does even less.

<p>

<code>

&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;s:View xmlns:fx="http://ns.adobe.com/mxml/2009" 
		xmlns:s="library://ns.adobe.com/flex/spark" title="Register"&gt;

	&lt;fx:Script&gt;
	&lt;![CDATA[
	import mx.core.FlexGlobals;
			
	protected function handleRegister(event:MouseEvent):void {
		//Any value for registration is ok with me...
		FlexGlobals.topLevelApplication.loadMain();
	}
	]]&gt;
	&lt;/fx:Script&gt;
	
	&lt;s:layout&gt;
		&lt;s:VerticalLayout gap="10" paddingTop="10" paddingLeft="10" paddingRight="10" /&gt;
	&lt;/s:layout&gt;
	
	&lt;s:Label text="Username: " /&gt;
	&lt;s:TextInput id="username" width="100%" /&gt;
	
	&lt;s:Label text="Password: " /&gt;
	&lt;s:TextInput id="password" displayAsPassword="true" width="100%" /&gt;

	&lt;s:Label text="Confirm Password: " /&gt;
	&lt;s:TextInput id="password2" displayAsPassword="true" width="100%" /&gt;

	&lt;s:Button label="Register" click="handleRegister(event)" width="100%" /&gt;
	
	&lt;s:Label id="statusLabel" color="#FF0000" fontWeight="bold" /&gt;
&lt;/s:View&gt;
</code>

<p>

Ok - hopefully everything so far seems pretty simple. Remember that Flash Builder set up my tabbed navigator and my views for me. I just had to add the forms and the click handlers. If we run the project now we can see both views. Here's a shot of both views.

<p>


<img src="https://static.raymondcamden.com/images/cfjedi/login.png" align="left" />
<img src="https://static.raymondcamden.com/images/cfjedi/reg.png" />

<br clear="left">

<p>

Now for the fun part. Let's switch to the root file of my application and see what loadMain() is doing. Remember, this function is called after a user has either logged in or registered. Basically, it's where we need to switch the application's UI.

<p>

<code>

&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;s:TabbedViewNavigatorApplication xmlns:fx="http://ns.adobe.com/mxml/2009" 
								  xmlns:s="library://ns.adobe.com/flex/spark"&gt;
	&lt;fx:Declarations&gt;
		&lt;!-- Place non-visual elements (e.g., services, value objects) here --&gt;
	&lt;/fx:Declarations&gt;

	&lt;fx:Script&gt;
	&lt;![CDATA[
	import views.*;
	
	public function loadMain():void {
		trace('called');

		var vn1:ViewNavigator = new ViewNavigator();
		vn1.firstView = views.HomeView;
		vn1.label = "Home";
		vn1.percentWidth=100;

		var vn2:ViewNavigator = new ViewNavigator();
		vn2.firstView = views.Part2View;
		vn2.label = "Foo";
		vn2.percentWidth=100;

		var vn3:ViewNavigator = new ViewNavigator();
		vn3.firstView = views.Part3View;
		vn3.label = "Something";
		vn3.percentWidth=100;

		this.tabbedNavigator.removeAll();
		//Bug - credit for fix: Dynamic_Internet_Dev and thread: http://forums.adobe.com/message/3702163
		this.tabbedNavigator.validateNow();
		this.tabbedNavigator.addItem(vn1);
		this.tabbedNavigator.addItem(vn2);
		this.tabbedNavigator.addItem(vn3);
		
	}
	]]&gt;
	&lt;/fx:Script&gt;

	&lt;s:navigators&gt;
		&lt;s:ViewNavigator label="Login" firstView="views.LoginView" width="100%"/&gt;
		&lt;s:ViewNavigator label="Register" firstView="views.RegisterView" width="100%"/&gt;
	&lt;/s:navigators&gt;

&lt;/s:TabbedViewNavigatorApplication&gt;
</code>

<p>

So - what's going on here? The TabbedViewNavigator has a few APIs that allow you to change the tabs that are visible. Unfortunately I ran into multiple bugs when working with this API. Luckily there's a work around. Look at loadMain(). I begin by defining thee view navigators objects. These represent my new tabs for the "real" application. HomeView, Part2View, and Part3View were made by me creating new files in Flash Builder. 

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip100.png" />

<p>

For now those views don't do anything so I won't bother posting the code here. (But <i>everything</i> will be available in in the download.) Once I've defined my three views, I clear the tab navigator using removeAll. Here is where a bug exists. I initially had just the three addItem's there. When run I'd get an error from within the Flex framework itself. A user (whose name I don't know - but thank you!) from the Flex forums provided the fix you see there - validateNow(). Don't ask me why it works - it just does. The main point though is that we end up with all new tabs within our application. Here's the view after logging in.

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip101.png" />

<p>

That's it. I've included the FXP if you want to play with this yourself. As always - I'm open to alternatives and better ways of doing this.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FLoginRegisterExample%{% endraw %}2Efxp'>Download attached file.</a></p>