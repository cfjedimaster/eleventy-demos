---
layout: post
title: "Another CFLOG/JSON Tip"
date: "2010-10-04T11:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/10/04/Another-CFLOGJSON-Tip
guid: 3960
---

Almost a year ago I <a href="http://www.raymondcamden.com/index.cfm/2009/11/19/Quick-Tip--CFLOG-and-JSON">blogged</a> about how I like to use a combination of cflog and serializeJSON as a way to quickly log complex data. I've often said I'm a "log every single darn thing" type of debugger. It may be messy - but it is my preferred way to see what's going on in my ColdFusion application. Last week I found another interesting use for this technique.

<p/>

I was trying to diagnose an odd performance issue I was having with Model-Glue. (If you are curious, you can read about it <a href="http://trac.model-glue.com/ticket/420">here</a>.) While I was chasing down the issue I was littering Model-Glue code with a bunch of cflog statements. One problem I ran into though was figuring out what a particular CFC instance actually was. So for example, imagine your method looks like this:

<p/>

<code>
&lt;cffunction name="makeCool"&gt;
  &lt;cfargument name="person" type="person"&gt;
</code>

<p/>

In the above method signature, my method takes a person argument. Person just so happens to be an interface with implementors like Geek, Nerd, Supermodel. You get the idea. I ran into code like this and wasn't quite sure what the actual <i>implementor</i> was. It then occurred to me I could do this:

<p/>

<code>
&lt;cflog file="mylog" text="person=#serializeJSON(getMetadata(arguments.person))#"&gt;
</code>

<p/>

Note I'm not serializing the CFC but the call to getMetadata. This returns something like so:

<p/>

<code>
"Information","jrpp-282","09/24/10","11:50:53","MAVERICK","eventRequestPhase: preload {% raw %}{""NAME"":""ModelGlue.gesture.eventrequest.phase.Initialization"",""FULLNAME"":""ModelGlue.gesture.eventrequest.phase.Initialization"",""FUNCTIONS"":[{""ACCESS"":""private"",""NAME"":""load"",""RETURNTYPE"":""void"",""PARAMETERS"":[{""HINT"":""I am the event context to use for loading.  Duck typed for speed.  Should have no queued events, but this isn't checked (to save time)."",""NAME"":""eventContext""}{% endraw %}],""HINT"":""I perform the loading for this phase."",""OUTPUT"":false},{% raw %}{""NAME"":""execute"",""RETURNTYPE"":""void"",""PARAMETERS"":[{""HINT"":""I am the event context to act upon.  Duck typed for speed.  Should have no queued events when execute() is called, but this isn't checked (to save time)."",""NAME"":""eventContext""}{% endraw %}],""HINT"":""Executes the request phase."",""OUTPUT"":false}],""HINT"":""Represents the beginning of the Model-Glue lifecycle.  Execution only does work when Model-Glue is not initialized."",""PATH"":""C:\\projects\\newHotness\\frameworks\\modelglue\\ModelGlue\\gesture\\eventrequest\\phase\\Initialization.cfc"",""EXTENDS"":{% raw %}{""NAME"":""ModelGlue.gesture.eventrequest.phase.ModuleLoadingRequestPhase"",""FULLNAME"":""ModelGlue.gesture.eventrequest.phase.ModuleLoadingRequestPhase"",""FUNCTIONS"":[{""ACCESS"":""private"",""NAME"":""load"",""RETURNTYPE"":""void"",""PARAMETERS"":[{""HINT"":""I am the event context to use for loading.  Duck typed for speed.  Should have no queued events, but this isn't checked (to save time)."",""NAME"":""eventContext""}{% endraw %}],""HINT"":""I perform the loading for this phase."",""OUTPUT"":false},{% raw %}{""OUTPUT"":false,""NAME"":""init"",""PARAMETERS"":[{""HINT"":""I am the factory through which module loaders may be attained."",""REQUIRE"":true,""NAME"":""moduleLoaderFactory""}{% endraw %},{% raw %}{""HINT"":""I am the list of XML modules to load as part of this phase."",""NAME"":""modules"",""TYPE"":""array"",""REQUIRED"":true}{% endraw %}]},{% raw %}{""ACCESS"":""private"",""NAME"":""loadModules"",""PARAMETERS"":[{""NAME"":""modelglue""}{% endraw %}],""HINT"":""Loads modules associated with this phase."",""OUTPUT"":false}],""HINT"":""Abstract of an execution phase that loads modules."",""PATH"":""C:\\projects\\newHotness\\frameworks\\modelglue\\ModelGlue\\gesture\\eventrequest\\phase\\ModuleLoadingRequestPhase.cfc"",""EXTENDS"":{% raw %}{""NAME"":""ModelGlue.gesture.eventrequest.EventRequestPhase"",""FULLNAME"":""ModelGlue.gesture.eventrequest.EventRequestPhase"",""FUNCTIONS"":[{""NAME"":""setup"",""RETURNTYPE"":""void"",""PARAMETERS"":[{""HINT"":""I am the event context to use for loading.  Duck typed for speed.  Should have no queued events, but this isn't checked (to save time)."",""NAME"":""eventContext""}{% endraw %},{% raw %}{""HINT"":""Prefix for name of lock to use for setup"",""NAME"":""lockPrefix"",""TYPE"":""string"",""REQUIRED"":true}{% endraw %},{% raw %}{""HINT"":""Timeout for setup lock"",""NAME"":""lockTimeout"",""TYPE"":""numeric"",""REQUIRED"":true}{% endraw %}],""HINT"":""I make sure the phase is loaded exactly once."",""OUTPUT"":false},{% raw %}{""ACCESS"":""private"",""NAME"":""load"",""RETURNTYPE"":""void"",""PARAMETERS"":[{""HINT"":""I am the event context to use for loading.  Duck typed for speed.  Should have no queued events, but this isn't checked (to save time)."",""NAME"":""eventContext""}{% endraw %}],""HINT"":""I perform the loading for this phase."",""OUTPUT"":false},{% raw %}{""NAME"":""execute"",""RETURNTYPE"":""void"",""PARAMETERS"":[{""HINT"":""I am the event context to act upon.  Duck typed for speed.  Should have no queued events when execute() is called, but this isn't checked (to save time)."",""NAME"":""eventContext""}{% endraw %}],""HINT"":""Executes the request phase."",""OUTPUT"":false}],""HINT"":""I represent a phase inside of an event request.  I'm basically a Command script for how this phase should execute."",""PATH"":""C:\\projects\\newHotness\\frameworks\\modelglue\\ModelGlue\\gesture\\eventrequest\\EventRequestPhase.cfc"",""EXTENDS"":{% raw %}{""PATH"":""C:\\ColdFusion9\\wwwroot\\WEB-INF\\cftags\\component.cfc"",""NAME"":""WEB-INF.cftags.component"",""FULLNAME"":""WEB-INF.cftags.component"",""TYPE"":""component""}{% endraw %},""OUTPUT"":false,""TYPE"":""component""},""OUTPUT"":false,""TYPE"":""component""},""OUTPUT"":false,""TYPE"":""component""}"
</code>

<p/>

That one is a bit large - but you can see in the beginning the Name value can tell you right away what the CFC actually is. I ran into this 4 or 5 times while digging into Model-Glue and it was pretty darn helpful.