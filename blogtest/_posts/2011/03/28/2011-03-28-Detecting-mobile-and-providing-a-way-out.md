---
layout: post
title: "Detecting mobile, and providing a way out"
date: "2011-03-28T13:03:00+06:00"
categories: [coldfusion,mobile]
tags: []
banner_image: 
permalink: /2011/03/28/Detecting-mobile-and-providing-a-way-out
guid: 4174
---

After a little run in with a Gawker site this weekend that pushed me into a mobile version of their site and wouldn't let me out, I thought I'd share two quick tips, and examples, of how to both auto detect a mobile device as well as allowing mobile devices to run your normal web site.
<!--more-->
<p/>

First, for detection, myself and others have been making use of a free script from <a href="http://detectmobilebrowser.com">Detect Mobile Browser</a>. This little one page site provides scripts in multiple languages including ColdFusion. It's user agent based which means it won't be perfect. If some new device uses a unique user agent in the future then you will need to update, but for quick and dirty nothing beats it. Here's an example of the output from the site.

<p/>

<code>
&lt;cfif reFindNoCase("android{% raw %}|avantgo|{% endraw %}blackberry{% raw %}|blazer|{% endraw %}compal{% raw %}|elaine|{% endraw %}fennec{% raw %}|hiptop|{% endraw %}iemobile{% raw %}|ip(hone|{% endraw %}od){% raw %}|iris|{% endraw %}kindle{% raw %}|lge |{% endraw %}maemo{% raw %}|midp|{% endraw %}mmp{% raw %}|opera m(ob|{% endraw %}in)i{% raw %}|palm( os)?|{% endraw %}phone{% raw %}|p(ixi|{% endraw %}re)\/{% raw %}|plucker|{% endraw %}pocket{% raw %}|psp|{% endraw %}symbian{% raw %}|treo|{% endraw %}up\.(browser{% raw %}|link)|{% endraw %}vodafone{% raw %}|wap|{% endraw %}windows (ce{% raw %}|phone)|{% endraw %}xda{% raw %}|xiino",CGI.HTTP_USER_AGENT) GT 0 OR reFindNoCase("1207|{% endraw %}6310{% raw %}|6590|{% endraw %}3gso{% raw %}|4thp|{% endraw %}50[1-6]i{% raw %}|770s|{% endraw %}802s{% raw %}|a wa|{% endraw %}abac{% raw %}|ac(er|{% endraw %}oo{% raw %}|s\-)|{% endraw %}ai(ko{% raw %}|rn)|{% endraw %}al(av{% raw %}|ca|{% endraw %}co){% raw %}|amoi|{% endraw %}an(ex{% raw %}|ny|{% endraw %}yw){% raw %}|aptu|{% endraw %}ar(ch{% raw %}|go)|{% endraw %}as(te{% raw %}|us)|{% endraw %}attw{% raw %}|au(di|{% endraw %}\-m{% raw %}|r |{% endraw %}s ){% raw %}|avan|{% endraw %}be(ck{% raw %}|ll|{% endraw %}nq){% raw %}|bi(lb|{% endraw %}rd){% raw %}|bl(ac|{% endraw %}az){% raw %}|br(e|{% endraw %}v)w{% raw %}|bumb|{% endraw %}bw\-(n{% raw %}|u)|{% endraw %}c55\/{% raw %}|capi|{% endraw %}ccwa{% raw %}|cdm\-|{% endraw %}cell{% raw %}|chtm|{% endraw %}cldc{% raw %}|cmd\-|{% endraw %}co(mp{% raw %}|nd)|{% endraw %}craw{% raw %}|da(it|{% endraw %}ll{% raw %}|ng)|{% endraw %}dbte{% raw %}|dc\-s|{% endraw %}devi{% raw %}|dica|{% endraw %}dmob{% raw %}|do(c|{% endraw %}p)o{% raw %}|ds(12|{% endraw %}\-d){% raw %}|el(49|{% endraw %}ai){% raw %}|em(l2|{% endraw %}ul){% raw %}|er(ic|{% endraw %}k0){% raw %}|esl8|{% endraw %}ez([4-7]0{% raw %}|os|{% endraw %}wa{% raw %}|ze)|{% endraw %}fetc{% raw %}|fly(\-|{% endraw %}_){% raw %}|g1 u|{% endraw %}g560{% raw %}|gene|{% endraw %}gf\-5{% raw %}|g\-mo|{% endraw %}go(\.w{% raw %}|od)|{% endraw %}gr(ad{% raw %}|un)|{% endraw %}haie{% raw %}|hcit|{% endraw %}hd\-(m{% raw %}|p|{% endraw %}t){% raw %}|hei\-|{% endraw %}hi(pt{% raw %}|ta)|{% endraw %}hp( i{% raw %}|ip)|{% endraw %}hs\-c{% raw %}|ht(c(\-|{% endraw %} {% raw %}|_|{% endraw %}a{% raw %}|g|{% endraw %}p{% raw %}|s|{% endraw %}t){% raw %}|tp)|{% endraw %}hu(aw{% raw %}|tc)|{% endraw %}i\-(20{% raw %}|go|{% endraw %}ma){% raw %}|i230|{% endraw %}iac( {% raw %}|\-|{% endraw %}\/){% raw %}|ibro|{% endraw %}idea{% raw %}|ig01|{% endraw %}ikom{% raw %}|im1k|{% endraw %}inno{% raw %}|ipaq|{% endraw %}iris{% raw %}|ja(t|{% endraw %}v)a{% raw %}|jbro|{% endraw %}jemu{% raw %}|jigs|{% endraw %}kddi{% raw %}|keji|{% endraw %}kgt( {% raw %}|\/)|{% endraw %}klon{% raw %}|kpt |{% endraw %}kwc\-{% raw %}|kyo(c|{% endraw %}k){% raw %}|le(no|{% endraw %}xi){% raw %}|lg( g|{% endraw %}\/(k{% raw %}|l|{% endraw %}u){% raw %}|50|{% endraw %}54{% raw %}|e\-|{% endraw %}e\/{% raw %}|\-[a-w])|{% endraw %}libw{% raw %}|lynx|{% endraw %}m1\-w{% raw %}|m3ga|{% endraw %}m50\/{% raw %}|ma(te|{% endraw %}ui{% raw %}|xo)|{% endraw %}mc(01{% raw %}|21|{% endraw %}ca){% raw %}|m\-cr|{% endraw %}me(di{% raw %}|rc|{% endraw %}ri){% raw %}|mi(o8|{% endraw %}oa{% raw %}|ts)|{% endraw %}mmef{% raw %}|mo(01|{% endraw %}02{% raw %}|bi|{% endraw %}de{% raw %}|do|{% endraw %}t(\-{% raw %}| |{% endraw %}o{% raw %}|v)|{% endraw %}zz){% raw %}|mt(50|{% endraw %}p1{% raw %}|v )|{% endraw %}mwbp{% raw %}|mywa|{% endraw %}n10[0-2]{% raw %}|n20[2-3]|{% endraw %}n30(0{% raw %}|2)|{% endraw %}n50(0{% raw %}|2|{% endraw %}5){% raw %}|n7(0(0|{% endraw %}1){% raw %}|10)|{% endraw %}ne((c{% raw %}|m)\-|{% endraw %}on{% raw %}|tf|{% endraw %}wf{% raw %}|wg|{% endraw %}wt){% raw %}|nok(6|{% endraw %}i){% raw %}|nzph|{% endraw %}o2im{% raw %}|op(ti|{% endraw %}wv){% raw %}|oran|{% endraw %}owg1{% raw %}|p800|{% endraw %}pan(a{% raw %}|d|{% endraw %}t){% raw %}|pdxg|{% endraw %}pg(13{% raw %}|\-([1-8]|{% endraw %}c)){% raw %}|phil|{% endraw %}pire{% raw %}|pl(ay|{% endraw %}uc){% raw %}|pn\-2|{% endraw %}po(ck{% raw %}|rt|{% endraw %}se){% raw %}|prox|{% endraw %}psio{% raw %}|pt\-g|{% endraw %}qa\-a{% raw %}|qc(07|{% endraw %}12{% raw %}|21|{% endraw %}32{% raw %}|60|{% endraw %}\-[2-7]{% raw %}|i\-)|{% endraw %}qtek{% raw %}|r380|{% endraw %}r600{% raw %}|raks|{% endraw %}rim9{% raw %}|ro(ve|{% endraw %}zo){% raw %}|s55\/|{% endraw %}sa(ge{% raw %}|ma|{% endraw %}mm{% raw %}|ms|{% endraw %}ny{% raw %}|va)|{% endraw %}sc(01{% raw %}|h\-|{% endraw %}oo{% raw %}|p\-)|{% endraw %}sdk\/{% raw %}|se(c(\-|{% endraw %}0{% raw %}|1)|{% endraw %}47{% raw %}|mc|{% endraw %}nd{% raw %}|ri)|{% endraw %}sgh\-{% raw %}|shar|{% endraw %}sie(\-{% raw %}|m)|{% endraw %}sk\-0{% raw %}|sl(45|{% endraw %}id){% raw %}|sm(al|{% endraw %}ar{% raw %}|b3|{% endraw %}it{% raw %}|t5)|{% endraw %}so(ft{% raw %}|ny)|{% endraw %}sp(01{% raw %}|h\-|{% endraw %}v\-{% raw %}|v )|{% endraw %}sy(01{% raw %}|mb)|{% endraw %}t2(18{% raw %}|50)|{% endraw %}t6(00{% raw %}|10|{% endraw %}18){% raw %}|ta(gt|{% endraw %}lk){% raw %}|tcl\-|{% endraw %}tdg\-{% raw %}|tel(i|{% endraw %}m){% raw %}|tim\-|{% endraw %}t\-mo{% raw %}|to(pl|{% endraw %}sh){% raw %}|ts(70|{% endraw %}m\-{% raw %}|m3|{% endraw %}m5){% raw %}|tx\-9|{% endraw %}up(\.b{% raw %}|g1|{% endraw %}si){% raw %}|utst|{% endraw %}v400{% raw %}|v750|{% endraw %}veri{% raw %}|vi(rg|{% endraw %}te){% raw %}|vk(40|{% endraw %}5[0-3]{% raw %}|\-v)|{% endraw %}vm40{% raw %}|voda|{% endraw %}vulc{% raw %}|vx(52|{% endraw %}53{% raw %}|60|{% endraw %}61{% raw %}|70|{% endraw %}80{% raw %}|81|{% endraw %}83{% raw %}|85|{% endraw %}98){% raw %}|w3c(\-|{% endraw %} ){% raw %}|webc|{% endraw %}whit{% raw %}|wi(g |{% endraw %}nc{% raw %}|nw)|{% endraw %}wmlb{% raw %}|wonu|{% endraw %}x700{% raw %}|xda(\-|{% endraw %}2{% raw %}|g)|{% endraw %}yas\-{% raw %}|your|{% endraw %}zeto|zte\-",Left(CGI.HTTP_USER_AGENT,4)) GT 0&gt;&lt;cflocation url="http://detectmobilebrowser.com/mobile"&gt;&lt;/cfif&gt;
</code>

<p>

(Note - I may add a space or two in the block above if it renders poorly on the site.) I've used this in a few places and it's been fine for me. That's only part of the issue though. This will work fine if someone comes to your site's home page, but what if they come to a deeper page? You have a few different options here. One is to simply look at the requested page, <i>and</i> the query string, and pass them along to the mobile version. So a request for entry.cfm?id=X means you want to redirect to mobile/entry.cfm?id=x. A site that makes use of cgi.path_info, like BlogCFC, required slightly different code. Here's how Dave Ferguson handled it with BlogCFC:

<p>

<code>
&lt;!--- this is all wrapped in a CFIF like shown above ---&gt;
&lt;cfset urlVars=reReplaceNoCase(trim(cgi.path_info), '.+\.cfm/? *', '')&gt;
&lt;cfif listlen(urlVars, '/') LTE 1&gt; &lt;!---NOT AN SES URL---&gt;
	&lt;cfset urlVars = ''&gt;
&lt;/cfif&gt;	
&lt;cfset path = cgi.http_host & ListDeleteAt(cgi.script_name, listLen(cgi.script_name, "/"), "/")&gt;
&lt;cfif NOT right(path, 6) EQ "mobile"&gt;
	&lt;cflocation url="http://#path#/mobile/index.cfm#urlVars#" addToken="false"&gt;
&lt;/cfif&gt;
</code>

<p>

Obviously you have a few options here, but I think the critical point is this: <b>Do not bother auto pushing someone to a mobile site if you're going to lose the original context of their request.</b> Supporting this should be considering a required, not optional feature.

<p>

And speaking of what's required, I also believe, very strongly, that you should provide a way for folks to <i>leave</i> your mobile site. I recently acquired a Motorola Xoom tablet (long story short - I love it), and it renders web pages really well. On more then one site I get automatically pushed to a mobile version. Most support allowing me to click a link and return to the normal version. Unfortunately, all of Gawker's web sites do not. (But let's be honest, their entire network has been pretty badly redesigned lately so this comes as no surprise. I swear I'm not bitter. Honest.) Here is a simple way to support allowing people to leave your mobile site, again, based on BlogCFC.

<p>

First, provide a link with some kind of flag:

<p>

<code>
&lt;p&gt;&lt;a href="http://www.foo.com/?nomobile=1" id="leaveMobileLink"&gt;Click Here&lt;/a&gt; to exit mobile version.&lt;/p&gt;
</code>

<p>

Then simply look for it in your core Application file:

<p>

<code>
&lt;cfif structKeyExists(url, "nomobile")&gt;
	&lt;cfset session.nomobile = true&gt;
&lt;/cfif&gt;
</code>

<p>

You can then look for this session variable when detecting mobile...

<p>

<code>
&lt;cfif not structKeyExists(session, "nomobile") and ....&gt;
</code>

<p>

In my case, I've used a session variable, but you could use a cookie to have more control over how long the "no mobile" flag persists. 

<p>

Anyway, I hope this helps out. One thing I'm curious about - and I think it will take some time to really flesh out - is to see what "real" users think about this. If a typical user is pushed to a mobile site, will they get confused seeing a link out? Will they get confused in general if the site doesn't match what they see on the desktop (even if it's much better for their device).