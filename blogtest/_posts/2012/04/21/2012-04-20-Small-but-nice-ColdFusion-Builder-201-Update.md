---
layout: post
title: "ColdFusion Builder 2.0.1 Extension Updates"
date: "2012-04-21T10:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2012/04/21/Small-but-nice-ColdFusion-Builder-201-Update
guid: 4594
---

One of the most critical features of ColdFusion Builder, in my opinion, has been its extension API. ColdFusion Builder 2.0.1, currently in <a href="http://labs.adobe.com/technologies/coldfusion10/#coldfusion_builder">beta</a>, adds some very nice updates to the API, including...

<ul>
<li>Extensions can get a list of projects
<li>Extensions can reload extensions (now you can truly build extensions that are self-updating)
<li>Extensions can talk to each other (this one is so interesting I don't even know what to think yet!)
<li>The getFunctionsAndVariables command can now be used for varScoping - even <b>script-based CFCs</b>. I'm working on this right now. It's got one small issue (you can't get line numbers), but it seems to work well.
<li>You can open a view and have it <i>not</i> take focus from the editor
<li>You can now notice when the active file in the editor is changed
<li>You can now notice when you switch selected tables in the RDS view
<li>You can now notice when files are saved
<li>For RDS, you can now add right-click menus for the top level server, database, and file items
</ul>

And finally - and this one I think is not mentioned in the docs - your extensions can now work with non-CFM/CFC files. I think that's a big one and it really opens up the possibilities with extensions.

<img src="https://static.raymondcamden.com/images/ScreenClip71.png" />