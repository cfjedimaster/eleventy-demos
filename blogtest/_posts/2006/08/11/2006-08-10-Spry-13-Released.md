---
layout: post
title: "Spry 1.3 Released"
date: "2006-08-11T09:08:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2006/08/11/Spry-13-Released
guid: 1464
---

The title says it all. You can now get <a href="http://labs.adobe.com/technologies/spry/">Spry 1.3</a> from the Adobe Labs site. I'll blog a bit more about it later in the day when I get a chance to play with it. One main change seems to be the effects library. Check the demo <a href="http://labs.adobe.com/technologies/spry/demos/effects/#">here</a>.

Here is the changelog from the zip:
<!--more-->
<ul>
<li>Introduced Spry Effects, the 3rd portion of the Spry Framework.
<ul>
<li>Provided SpryEffects.js in the includes folder.</li>
<li>Provided Effects sample files in Effect folder.   </li>
<li><a href="articles/effects_model/index.htm">Effects Overview</a> doc posted online.</li>
<li><a href="articles/effects_coding/index.html">Effects Coding</a><strong> </strong>doc posted online.  </li>
<li><a href="articles/effects_api/index.html">Effects API </a></li>
</ul>
</li>
            <li>Removed documentation from the zip. All docs will be available online on Labs site as HTML and PDF. </li>
            <li>Changes to SpryData.js:
            	<ul>
            		<li>Fix the loop in Spry.Utils.createXMLHttpRequest() so that it doesn't skip the next progID in the array after removing a non-existent one.</li>
            		<li>Make sure all initialization of the Spry.Utils.loadURL.Request headers property uses an object so that it works properly when used with Prototype 1.5 rc0.   </li>
            		<li>Fix Spry.Utils.Notifier.prototype.notifyObservers() so that it uses a normal for loop instead of a &quot;for in&quot; loop. </li>

            		<li>Added support for {% raw %}{ds_UnfilteredRowCount}{% endraw %}. </li>
            	</ul>
            </li>
	        <li>Updates to SpryAccordion.js
	          <ul>
	            <li>Added panel opening function: openNextPanel(), openPreviousPanel(), openFirstPanel, and openLastPanel()</li>
                <li>Added current panel accessor: getCurrentPanel() - return the panel, getCurrentPanelIndex() - returns the index of the current panel in the getPanels() array.</li>
	            <li>Added addNewPanel(tab, content) function to dynamically add new panels in Javascript. Panels get added after the current panel.  </li>

          	  </ul>
	        </li>
        	<li>Gallery Demo updated to use new SpryEffects.js. </li>
		  </ul>