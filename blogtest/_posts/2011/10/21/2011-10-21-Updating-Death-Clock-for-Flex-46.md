---
layout: post
title: "Updating Death Clock for Flex 4.6"
date: "2011-10-21T15:10:00+06:00"
categories: [flex,mobile]
tags: []
banner_image: 
permalink: /2011/10/21/Updating-Death-Clock-for-Flex-46
guid: 4403
---

Adobe has been talking lately about the next update to Flex and Flash Builder, version 4.6. There's a lot of cool stuff planned, but some of the things that interest me most are the new UI components. You can read a good article on them here, <a href="http://www.adobe.com/devnet/flex/articles/whats-new-flex-flash-builder-46.html">What's new in Flex 4.6 SDK and Flash Builder 4.6</a>. I thought it might be interesting to update one of my own application, the Death Clock mobile app, to use some of these new components.
<!--more-->
<p>

When I built the <a href="https://market.android.com/details?id=air.DeathClock&feature=search_result#?t=W251bGwsMSwxLDEsImFpci5EZWF0aENsb2NrIl0.">Death Clock</a> application, one of the first things I ran into was handling the UI for picking gender and the month of your birth. Dropdowns just don't work well on a mobile device. I ended up using a hybrid approach that used states and groups of radio buttons. You can read more about this in my <a href="http://www.raymondcamden.com/index.cfm/2010/10/21/My-First-Android-Application">original blog post</a> from ... wow... exactly one year ago. Man - I'd love to say I planned that but it was completely random! Anyway - be sure to look at that post for an example of the UI.

<p>

For my new application, I decided to get rid of this work around and make use of the new ToggleSwitch and DateSpinner classes. I thought the ToggleSwitch would be a good replacement for the gender selection and the date spinner would - obviously - replace the date drop downs. Here's what the Flex code looks like for the original version, again, with the work around:

<p>

<code>

&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;s:View xmlns:fx="http://ns.adobe.com/mxml/2009" 
		xmlns:s="library://ns.adobe.com/flex/spark" title="Death Clock" initialize="init()" xmlns:mx="library://ns.adobe.com/flex/mx" backgroundColor="0x000000"&gt;
	&lt;fx:Declarations&gt;
		&lt;mx:NumberValidator id="dayValidator" source="{% raw %}{dayBorn}{% endraw %}" property="text" allowNegative="false" minValue="1" maxValue="31" 
							invalidCharError="Day Born must be a number." integerError="Day Born must be a number." negativeError="Day Born must be a positive number."
							lowerThanMinError="Day Born must be over 0." exceedsMaxError="Day Born must be lower than 31."/&gt;
		
		&lt;mx:NumberValidator id="yearValidator" source="{% raw %}{yearBorn}{% endraw %}" property="text" allowNegative="false" minValue="1900" maxValue="2020" 
							invalidCharError="Year Born must be a number." integerError="Year Born must be a number." negativeError="Year Born must be a positive number." 
							lowerThanMinError="Year Born must be over 1900." exceedsMaxError="Year Born must be lower than 2020." /&gt;
		
		&lt;s:RadioButtonGroup id="monthRBG" change="setMonthLabel()"/&gt;
		&lt;s:RadioButtonGroup id="genderRBG" change="setGenderLabel()"/&gt;
	&lt;/fx:Declarations&gt;
	
	&lt;fx:Style&gt;
		@namespace s "library://ns.adobe.com/flex/spark";
		@namespace mx "library://ns.adobe.com/flex/mx";
		
		#errorDiv {
			font-weight: bold;
			color: red;
		}
	&lt;/fx:Style&gt;
	
	&lt;fx:Script&gt;
		&lt;![CDATA[
			import mx.collections.ArrayCollection;
			import mx.events.ValidationResultEvent;
			
			[Bindable] private var months:ArrayCollection;		
			[Bindable] private var days:ArrayCollection;
			[Bindable] private var years:ArrayCollection;
			
			private var selectedMonth:int;
			private var selectedGender:int;
			
			private function setGenderLabel():void {
				if(genderRBG.selection) { 
					genderButton.label = genderRBG.selection.label;
					selectedGender = int(genderRBG.selection.value);
				}
				toggleGenderState();
			}
			
			private function setMonthLabel():void {
				if(monthRBG.selection) { 
					monthButton.label = monthRBG.selection.label;
					selectedMonth = int(monthRBG.selection.value);
				}
				toggleMonthState();
			}
			
			private function toggleGenderState():void {
				if(this.currentState == 'normal') this.currentState='selectedGender';		
				else this.currentState='normal';
			}
			
			private function toggleMonthState():void {
				if(this.currentState == 'normal') this.currentState='selectedMonth';		
				else this.currentState='normal';
			}
			
			private function init():void {
				this.currentState = 'normal';
				
			}
			
			private function doClock():void {
				
				var validation:ValidationResultEvent;
				validation = dayValidator.validate();
				if(validation.type == "invalid") {
					errorDiv.text = validation.message;
					return;			
				}
				validation = yearValidator.validate();
				if(validation.type == "invalid") {
					errorDiv.text = validation.message;
					return;			
				}
				
				errorDiv.text = '';
				
				var bDay:Date = new Date();
				bDay.fullYear = int(yearBorn.text);
				
				bDay.month = selectedMonth;
				bDay.date = int(dayBorn.text);
				
				var now:Date = new Date();
				
				//Life expectancy will be 75.6 for men, 80.8 for women (http://en.wikipedia.org/wiki/List_of_countries_by_life_expectancy)
				//for the .6 and .8 we just guestimate based on 60 and 80% of 365
				//date math idea from: http://blog.flexexamples.com/2007/08/24/date-math-for-lazy-people/
				var deathDate:Date = new Date(bDay.time);
				if(selectedGender == 0) {
					deathDate["fullYear"] += 72;
					deathDate["date"] += 219;
				} else {
					deathDate["fullYear"] += 78;
					deathDate["date"] += 292;
				}
				
				//are you dead already?
				if(deathDate.getTime() &lt; now.getTime()) {			
					errorDiv.text = 'Sorry, but you are already dead. Have a nice day.';
					return;
				}
				
				var timeLeft:Number = Math.round((deathDate.time - now.time)/1000);
				trace('death is '+deathDate.toString()+ ' v='+deathDate.time);
				trace('Now is ' +now.toString()+ ' v='+now.time);
				trace('diff is '+timeLeft);
				//trace(bDay.toString()+'\n'+deathDate.toString()+'\n'+timeLeft.toString());
				
				navigator.pushView(Counter,{% raw %}{deathDate:deathDate,timeLeft:timeLeft}{% endraw %});
				
			}
		]]&gt;
	&lt;/fx:Script&gt;
	
	&lt;s:states&gt;
		&lt;s:State name="normal"/&gt;
		&lt;s:State name="selectedMonth"/&gt;
		&lt;s:State name="selectedGender"/&gt;
	&lt;/s:states&gt;
	
	&lt;s:layout&gt;
		&lt;s:VerticalLayout paddingTop="10" paddingLeft="5" paddingRight="5" /&gt;
	&lt;/s:layout&gt;
	
	&lt;!--
	The idea of button groups to handle drop downs is from Dirk Eismann (DEismann@herrlich-ramuschkat.de)
	--&gt;
	&lt;s:HGroup width="100{% raw %}%" height.selectedGender="100%{% endraw %}"&gt;
		&lt;s:Label text="Gender: " width="50%" /&gt;
		&lt;s:Button id="genderButton" label="Male" click="toggleGenderState()" includeIn="normal,selectedMonth" /&gt;
		&lt;s:Scroller includeIn="selectedGender" height="100{% raw %}%" width="100%{% endraw %}"&gt;			
			&lt;s:Group&gt;			
				&lt;s:layout&gt;
					&lt;s:VerticalLayout/&gt;
				&lt;/s:layout&gt;
				&lt;s:RadioButton label="Male" value="0" selected="true" groupName="genderRBG"/&gt;
				&lt;s:RadioButton label="Female" value="1" groupName="genderRBG"/&gt;
			&lt;/s:Group&gt;
		&lt;/s:Scroller&gt;
		
	&lt;/s:HGroup&gt;
	
	&lt;s:HGroup width="100{% raw %}%" height.selectedMonth="100%{% endraw %}"&gt;
		&lt;s:Label text="Month Born: " width="50%" /&gt;
		&lt;s:Button id="monthButton" label="January" click="toggleMonthState()" includeIn="normal,selectedGender" /&gt;
		&lt;s:Scroller includeIn="selectedMonth" height="100{% raw %}%" width="100%{% endraw %}"&gt;			
			&lt;s:Group &gt;			
				&lt;s:layout&gt;
					&lt;s:VerticalLayout/&gt;
				&lt;/s:layout&gt;
				&lt;s:RadioButton label="January" value="0" selected="true" groupName="monthRBG"/&gt;
				&lt;s:RadioButton label="February" value="1"  groupName="monthRBG"/&gt;
				&lt;s:RadioButton label="March" value="2" groupName="monthRBG"/&gt;
				&lt;s:RadioButton label="April" value="3" groupName="monthRBG"/&gt;
				&lt;s:RadioButton label="May" value="4" groupName="monthRBG"/&gt;
				&lt;s:RadioButton label="June" value="5" groupName="monthRBG"/&gt;
				&lt;s:RadioButton label="July" value="6" groupName="monthRBG"/&gt;
				&lt;s:RadioButton label="August" value="7" groupName="monthRBG"/&gt;
				&lt;s:RadioButton label="September" value="8" groupName="monthRBG"/&gt;
				&lt;s:RadioButton label="October" value="9" groupName="monthRBG"/&gt;
				&lt;s:RadioButton label="November" value="10" groupName="monthRBG"/&gt;
				&lt;s:RadioButton label="December" value="11" groupName="monthRBG"/&gt;
			&lt;/s:Group&gt;
		&lt;/s:Scroller&gt;
		
	&lt;/s:HGroup&gt;
	
	&lt;s:HGroup width="100%"&gt;
		&lt;s:Label text="Day Born: " width="50%" /&gt;
		&lt;s:TextInput id="dayBorn" width="50%" text="1" /&gt;
	&lt;/s:HGroup&gt;
	
	&lt;s:HGroup width="100%"&gt;
		&lt;s:Label text="Year Born: " width="50%" /&gt;
		&lt;s:TextInput id="yearBorn" width="50%" text="1973" /&gt;
	&lt;/s:HGroup&gt;
	
	&lt;s:Button id="runClockBtn" label="Begin" width="100%" bottom="5" click="doClock()" /&gt;
	
	&lt;s:Label id="errorDiv" width="100%" /&gt;
&lt;/s:View&gt;
</code>

<p>

That's right at 190 lines. Not bad for my first Flex mobile application. Now let's look at the new version.

<p>

<code>

&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;s:View xmlns:fx="http://ns.adobe.com/mxml/2009" 
		xmlns:s="library://ns.adobe.com/flex/spark" title="Death Clock" backgroundColor="0x000000" xmlns:mx="library://ns.adobe.com/flex/mx"&gt;
	&lt;fx:Declarations&gt;
				
	&lt;/fx:Declarations&gt;

	&lt;fx:Style&gt;
	@namespace s "library://ns.adobe.com/flex/spark";
	@namespace mx "library://ns.adobe.com/flex/mx";
	
	#errorDiv {
		font-weight: bold;
		color: red;
	}
	&lt;/fx:Style&gt;

	
	&lt;fx:Script&gt;
	&lt;![CDATA[
		import mx.collections.ArrayCollection;
					
		private function doClock():void {
				
			var bDay:Date = dob.selectedDate;
			
			var now:Date = new Date();
				
			//Life expectancy will be 75.6 for men, 80.8 for women (http://en.wikipedia.org/wiki/List_of_countries_by_life_expectancy)
			//for the .6 and .8 we just guestimate based on 60 and 80% of 365
			//date math idea from: http://blog.flexexamples.com/2007/08/24/date-math-for-lazy-people/
			var deathDate:Date = new Date(bDay.time);
			if(!selectedGender.selected) {
				deathDate["fullYear"] += 72;
				deathDate["date"] += 219;
			} else {
				deathDate["fullYear"] += 78;
				deathDate["date"] += 292;
			}
			deathDate["fullYear"] += 78;
			deathDate["date"] += 292;

			//are you dead already?
			if(deathDate.getTime() &lt; now.getTime()) {			
				errorDiv.text = 'Sorry, but you are already dead. Have a nice day.';
				return;
			}
				
			var timeLeft:Number = Math.round((deathDate.time - now.time)/1000);
			trace('death is '+deathDate.toString()+ ' v='+deathDate.time);
			trace('Now is ' +now.toString()+ ' v='+now.time);
			trace('diff is '+timeLeft);
			//trace(bDay.toString()+'\n'+deathDate.toString()+'\n'+timeLeft.toString());
			
			navigator.pushView(Counter,{% raw %}{deathDate:deathDate,timeLeft:timeLeft}{% endraw %});
		}
	]]&gt;
	&lt;/fx:Script&gt;
	
	&lt;s:layout&gt;
		&lt;s:VerticalLayout paddingTop="10" paddingLeft="5" paddingRight="5" /&gt;
	&lt;/s:layout&gt;

	&lt;s:HGroup width="100%"&gt;
		&lt;s:Label text="Gender: " width="30%" /&gt;
		&lt;s:ToggleSwitch id="selectedGender" skinClass="skins.GenderToggleSkin" width="70%"  /&gt;
	&lt;/s:HGroup&gt;

	&lt;s:HGroup width="100%"&gt;
		&lt;s:Label text="Birth Date:" width="30%"  /&gt;
		&lt;s:DateSpinner id="dob" width="70%" /&gt;
	&lt;/s:HGroup&gt;
	
	&lt;s:Button id="runClockBtn" label="Begin" width="100%" bottom="5" click="doClock()" /&gt;
	
	&lt;s:Label id="errorDiv" width="100%" /&gt;

&lt;/s:View&gt;
</code>

<p>

78 lines. Bit nicer, right? Here's a screen shot showing the new UI controls.

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip206.png" />

<p>

I just need to change that "Begin" button to a skull or something and it will be perfect.