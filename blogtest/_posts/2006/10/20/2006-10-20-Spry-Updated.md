---
layout: post
title: "Spry Updated"
date: "2006-10-20T17:10:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2006/10/20/Spry-Updated
guid: 1601
---

While the official 1.4 release is still not ready yet, the folks over on the Spry team have released a new update today. You can read more about this at <a href="http://www.adobe.com/cfusion/webforums/forum/messageview.cfm?forumid=72&catid=602&threadid=1206959&enterthread=y">this forum</a> post. This release focuses mostly on widgets and form validation - two areas that Spry doesn't have a lot of tools in - so I'm very happy to see this update. 

Check out the <a href="http://labs.adobe.com/technologies/spry/samples/preview.html">examples</a> first, then check out the new cool <a href="http://labs.adobe.com/technologies/spry/demos/formsvalidation/">demo</a>.

This is definitely a prerelease - so use with caution, but it does look pretty darn cool. Consider the tab menus. Here is a simple example:

<code>
&lt;script language="JavaScript" type="text/javascript" src="../../widgets/tabbedpanels/SpryTabbedPanels.js"&gt;&lt;/script&gt;

&lt;div class="TabbedPanels" id="tp1"&gt;
  &lt;ul class="TabbedPanelsTabGroup"&gt;

    &lt;li class="TabbedPanelTab" tabindex="0"&gt;Tab 1&lt;/li&gt;
    &lt;li class="TabbedPanelTab" tabindex="0"&gt;Tab 2&lt;/li&gt;
    &lt;li class="TabbedPanelTab" tabindex="0"&gt;Tab 3&lt;/li&gt;
    &lt;li class="TabbedPanelTab" tabindex="0"&gt;Tab 4&lt;/li&gt;
  &lt;/ul&gt;
  &lt;div class="TabbedPanelsContentGroup"&gt;
    &lt;div class="TabbedPanelContent"&gt;

      &lt;p&gt;By default, the Tabbed Panel CSS does not define a height or width to the widget.&lt;/p&gt;
      &lt;p&gt;The height of the widget will change depending on the size of the content of the current open panel.&lt;/p&gt;
      &lt;p&gt;To set a fixed size for the widget, set the 'height' of the class .TabbedPanelContent to whatever value you need. Overflow should be set to handle content longer than the set height. &lt;/p&gt;
    &lt;/div&gt;
    &lt;div class="TabbedPanelContent"&gt; Tab 2 Content &lt;/div&gt;
    &lt;div class="TabbedPanelContent"&gt;

      &lt;p&gt;Default Panel set to open the 3rd panel onLoad. Spry has a 0 based counting system, so the constructor option {% raw %}{defaultTab: 2}{% endraw %} will open the 3rd panel. &lt;/p&gt;
      &lt;p&gt;.TabbedPanels class has been set to a width of 500 pixels, so all widgets that use that class on this page will be that width. &lt;/p&gt;
      &lt;p&gt;Also, tabindex=&quot;0&quot; has to be set on every tab element for keyboard navigation to work correctly. &lt;/p&gt;
    &lt;/div&gt;
    &lt;div class="TabbedPanelContent"&gt;Tab 4 Content&lt;/div&gt;

  &lt;/div&gt;
&lt;/div&gt;
</code>

Pretty simple, eh?