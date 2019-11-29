---
layout: post
title: "Simple CFML Trick - Add logging to ColdFusion Administrator"
date: "2010-03-15T16:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/03/15/Simple-CFML-Trick-Add-logging-to-ColdFusion-Administrator
guid: 3749
---

Earlier today I filed an ER to add <a href="http://cfbugs.adobe.com/cfbugreport/flexbugui/cfbugtracker/main.html#bugId=82437">logging to the ColdFusion Administrator</a>. This would add simple auditing to actions done within the administrator. So for example you could see when a user added a DSN, or when another user tweaked mail settings. In theory this should be easy to implement, and I think it would be a great addition. If you agree, don't forget that you can vote for bugs on the public bug tracker so add yours to the <a href="http://cfbugs.adobe.com/cfbugreport/flexbugui/cfbugtracker/main.html#bugId=82437">request</a>. On a whim though I thought I'd try to see if I could hack it in. I know that the administrator hasn't really been updated a lot lately (except for new settings!) and I guessed - correctly - that it still made use of Application.cfm, <i>not</i> Application.cfc.
<p/>
For the heck of it, I just dropped this in my /CFIDE/Administrator folder as a new Application.cfc file:
<p/>
<code>
component {
	
	public boolean function onRequest(string req) {
		include "Application.cfm";
		include arguments.req;
		writelog(file="admin", text="User #getauthuser()# running #req#?#cgi.query_string#");
		return true;
	}
	
}
</code>

<p/>

And guess what? It worked like a charm:

<p/>

"Information","jrpp-107","03/15/10","14:21:41","CFADMIN","User admin running /CFIDE/administrator/settings/server_settings.cfm?targeted=false"<br/>
"Information","jrpp-109","03/15/10","14:21:41","CFADMIN","User admin running /CFIDE/administrator/navserver.cfm?"<br/>
"Information","jrpp-111","03/15/10","14:21:42","CFADMIN","User admin running /CFIDE/administrator/settings/limits.cfm?"<br/>
"Information","jrpp-101","03/15/10","14:21:43","CFADMIN","User admin running /CFIDE/administrator/settings/server_settings.cfm?"<br/>
"Information","jrpp-109","03/15/10","14:21:45","CFADMIN","User admin running /CFIDE/administrator/settings/memoryvariables.cfm?"<br/>

<p/>

Obviously it isn't as nice as it could be, but it took all of two minutes to write. The CFC above will only work in ColdFusion 9, but you could convert it to old school tags in a few additional minutes.