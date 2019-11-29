---
layout: post
title: "Adding Referrer Protection to OpenWhisk Actions"
date: "2017-12-11"
categories: [serverless]
tags: [openwhisk,javascript]
banner_image: 
permalink: /2017/12/11/adding-referrer-protection-to-openwhisk-actions
---

Today I was thinking about what it would take to add referrer-style protection to an OpenWhisk API. What I mean by that is the ability to say that a particular API can only be called from certain domains. To be clear, this is *not* secure in any "real" fashion. This Stack Overflow question does a great job of addressing why not: ["Does referrer header checking offer any real world security improvement?"](https://security.stackexchange.com/questions/66165/does-referrer-header-checking-offer-any-real-world-security-improvement) However, I do think it can help prevent *some* misuse, and perhaps even help prevent accidental versus malicious misuse. As long as you keep in mind that this is *minimally* protective, then I think you will be fine. Also note that you should look into the [API Gateway](https://console.bluemix.net/docs/openwhisk/openwhisk_apigateway.html#openwhisk_apigateway) feature for more ways to lock down your APIs. Ok, with that out of the way, let's look at how this could be implemented.

First off - when an OpenWhisk action is enabled for web usage, you automatically get access to multiple different aspects of the request. The docs cover this in the ["HTTP Context"](https://console.bluemix.net/docs/openwhisk/openwhisk_webactions.html#http-context) section. The crucial bit is under `__ow_headers` where you get access to all of the HTTP headers used for the request. To help illustrate this, I built a simple "echo" action that looks like so:

<pre><code class="language-javascript">function main(args) {

    return {% raw %}{ arguments: args }{% endraw %};

}
</code></pre>

I then enabled it as a web action and built a web page to call it:

<pre><code class="language-markup">&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
    &lt;meta charset=&quot;utf-8&quot; &#x2F;&gt;
    &lt;meta http-equiv=&quot;X-UA-Compatible&quot; content=&quot;IE=edge&quot;&gt;
    &lt;title&gt;Page Title&lt;&#x2F;title&gt;
    &lt;meta name=&quot;viewport&quot; content=&quot;width=device-width, initial-scale=1&quot;&gt;
&lt;&#x2F;head&gt;
&lt;body&gt;

    &lt;pre id=&quot;result&quot;&gt;

    &lt;&#x2F;pre&gt;

    &lt;script&gt;
    document.addEventListener(&#x27;DOMContentLoaded&#x27;, init);
    function init() {
        fetch(&#x27;https:&#x2F;&#x2F;openwhisk.ng.bluemix.net&#x2F;api&#x2F;v1&#x2F;web&#x2F;rcamden{% raw %}%40us.ibm.com_My%{% endraw %}20Space&#x2F;safeToDelete&#x2F;webecho.json&#x27;)
        .then(res =&gt; res.json())
        .then(res =&gt; {
            document.querySelector(&#x27;#result&#x27;).innerHTML = JSON.stringify(res,null, &#x27;\t&#x27;);
        });
    }
    &lt;&#x2F;script&gt;

&lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;
</code></pre>

Basically - on page load, call the API and dump the results into a div. I then used [Surge.sh](https;//surge.sh) to host the static file. You can see this here: http://grieving-skate.surge.sh/temp.html Note - like most of my demos of this nature, I cannot promise the host/API will be up forever. So with that in mind, here is what the output looks like:

<pre><code class="language-javascript">{
	"arguments": {
		"__ow_method": "get",
		"__ow_headers": {
			"accept": "*/*",
			"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36",
			"x-client-ip": "76.72.12.163",
			"accept-language": "en-US, en;q=0.9",
			"x-forwarded-proto": "https",
			"host": "openwhisk.ng.bluemix.net:443",
			"cache-control": "no-transform",
			"origin": "http://grieving-skate.surge.sh",
			"via": "1.1 CQAAAI+qTCs-",
			"x-global-transaction-id": "3840698005",
			"referer": "http://grieving-skate.surge.sh/temp.html",
			"accept-encoding": "gzip, deflate, br",
			"x-forwarded-for": "76.72.12.163"
		},
		"__ow_path": ""
	}
}
</code></pre>

As you can see, under `__ow_headers.referer` I have access to the page where the API was used. Ok, so let's try using this in a semi-real action:

<pre><code class="language-javascript">const allowedRef = [&#x27;grieving-skate.surge.sh&#x27;];

function main(args) {

    if(safeCaller(args.__ow_headers.referer)) {
        return {% raw %}{ arguments: args }{% endraw %};
    } else {
        throw new Error(&#x27;Invalid Referer&#x27;);
    }
}

function safeCaller(referrer) {
    let ok = false;
    allowedRef.forEach(ref =&gt; {
        if(referrer.indexOf(ref) &gt;= 0) ok = true;
    });
    return ok;
}
</code></pre>

On top I've added a new array called `allowedRef`. This will contain a list of hostnames allowed to use the API. I then built a new function, `safeCaller`, that checks the current referrer value to see if it matches any of the domains. If yes, everything carries on. If not, we return false and the action throws an error. I put this up on Surge in another domain - http://level-glove.surge.sh/temp.html. If you run that, the output will be:

<pre><code class="language-javascript">{
	"error": "There was an error processing your request.",
	"code": 14186297
}
</code></pre>

Woot. Ok, but I don't like messing up my original action (as simple as it was) with unrelated logic, so let's break this apart. Now - at this point I went ahead and built a "generic" referrer checker that could be combined with an action sequence. My first demo used arguments to let you specify the domains that were allowed to run the sequence. You may think that specifying allowed domains in an parameter is risky, but default parameters specified for web actions [are set as protected](https://console.bluemix.net/docs/openwhisk/openwhisk_webactions.html#openwhisk_webactions_protected) and can't be overridden. 

However, you can't specify default parameters for sequences. There is an open bug for this (https://github.com/apache/incubator-openwhisk/issues/2008) and there is a workaround for packages, but in that case, the parameter isn't protected. Unfortunately, we have to hard code the domains. 

First, I'll create the referrer checker. 

<pre><code class="language-javascript">const allowedRef = ['grieving-skate.surge.sh'];

function main(args) {

    let referrer = args.__ow_headers.referer;
    let ok = false;
    allowedRef.forEach(ref => {
        if(referrer.indexOf(ref) >= 0) ok = true;
    });

    if(ok) {
        return {% raw %}{ args:args }{% endraw %};
    } else {
        throw new Error('Invalid Referrer');
    }

}
</code></pre>

I've taken the code from the previous action and simply moved it into a new action. For the reasons I stated above I still have to include the allowed referrers in my code, but I can live with it. On success, I simply pass along the original arguments that were sent, and on failure, I then throw an error. I built this as a new action sequence:

	wsk action update safeToDelete/webecho2 --sequence safeToDelete/checkReferrer,safeToDelete/webecho --web true

I updated both of my demos on Surge with the new URLs and confirmed they both still work correctly.

So all in all, rather simple, although remember the warnings up top - this isn't going to be very secure and should only be used for a 'casual' check of where the API is being used. But what do you think?