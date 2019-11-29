---
layout: post
title: "Modified version of Zoids custom combo box to allow preselected value"
date: "2006-11-22T17:11:00+06:00"
categories: [flex]
tags: []
banner_image: 
permalink: /2006/11/22/Modified-version-of-Zoids-custom-combo-box-to-allow-preselected-value
guid: 1671
---

Wow that title sounds complex. If you don't remember, a few hours ago I blogged about an <a href="http://www.boyzoid.com/blog/index.cfm/2006/11/22/Flex-Custom-Components-and-Custom-Methods">article</a> that Boyzoid wrote about how easy it was to do a custom component in Flex 2. His example added a new method to ComboBox, selectedItemByValue.
<!--more-->
What if you wanted to set the selected item when the component is created? I made these modifications to Zoid's code:

<code>
&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;mx:ComboBox xmlns:mx="http://www.adobe.com/2006/mxml" creationComplete="checkSelected()"&gt;

&lt;mx:Script&gt;
&lt;![CDATA[
[Bindable] public var defaultSelectedValue:int;

public function selectedItemByValue(val:int):void{
	for (var i:int=0;i&lt;this.dataProvider.length;i++){
		var item:int = this.dataProvider[i].data;
                      
		if(item == val){
			this.selectedIndex = i;
			break;
		} else{% raw %}{ this.selectedIndex = 0;}{% endraw %}
	}
}

private function checkSelected():void {
	selectedItemByValue(defaultSelectedValue);
}
]]&gt;
&lt;/mx:Script&gt;
    	
&lt;/mx:ComboBox&gt;
</code>

Note first the use of creationComplete in the top tag. That just means - run checkSelected() when done. I then created a new public variable named defaultSelectedValue. My checkSelected function simply then calls the function Boyzoid had written. This then lets me do the following in the calling code:

<code>
&lt;comp:customComboBox dataProvider="{% raw %}{comboData}{% endraw %}" id="myCombo2" defaultSelectedValue="2" /&gt;
&lt;comp:customComboBox dataProvider="{% raw %}{comboData}{% endraw %}" id="myCombo3" defaultSelectedValue="3" /&gt;
&lt;comp:customComboBox dataProvider="{% raw %}{comboData}{% endraw %}" id="myCombo4" /&gt;
</code>

Not sure if this is best practice or not - and I did guess at a few things, but I thought I'd share.