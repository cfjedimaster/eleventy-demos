---
layout: post
title: "My Own OpenWhisk Stat Tool"
date: "2017-05-15T09:22:00-07:00"
categories: [serverless]
tags: [openwhisk]
banner_image: 
permalink: /2017/05/15/my-own-openwhisk-stat-tool
---

While waiting at the airport this past weekend, I worked on a little utility to help me retrieve information about my OpenWhisk actions. As you know (hopefully know!), Bluemix provides a "stats" page for your OpenWhisk stuff but it is a bit limited in terms of how far it goes back and doesn't yet provide good aggregate data about your action. So for example, I really wanted to see how well my action was responding in a simple tabular fashion. With that in mind, I built a command line tool that provides a report:

![Screen shot](https://static.raymondcamden.com/images/2017/5/owstats.jpg)

You'll notice in the screen shot above that the action I tested has exactly 2000 activations. That's because I put an upper limit on the total number of activations returned by the code. This was somewhat arbitrary and could be tweaked of course. This particular action, `getTraffic`, has been running for months and probably has around 20k activations. Currently there isn't way to get the total number of activations though. (I've filed a [bug report](https://github.com/apache/incubator-openwhisk/issues/2242) on that though.) 

The code in question is relatively simple, although a bit ugly in terms of how I progressively load the data. I tried a Promise-based approach but had difficulties figuring out how to make that work with the API. Note that the code expects your credentials in a file called `creds.json`. This needs to include two values, `apihost` and `api_key`, both of which you can get from the OpenWhisk CLI.

<pre><code class="language-javascript">
#!&#x2F;usr&#x2F;bin&#x2F;env node
const openwhisk = require(&#x27;openwhisk&#x27;);
const creds = require(&#x27;.&#x2F;creds.json&#x27;);

const ow = openwhisk({
    apihost: creds.apihost, 
    api_key: creds.api_key}
);

&#x2F;&#x2F;used to max out the number of activations we fetch
const MAX_ACTS = 2000;

const chalk = require(&#x27;chalk&#x27;);

if(process.argv.length == 2) {
    process.stdout.write(chalk.blue(&#x27;Usage: .&#x2F;index.js &lt;&lt;actionname&gt;&gt;\n&#x27;));
    process.exit();
}

const action = process.argv[2];
process.stdout.write(chalk.blue(&#x27;Fetching data for action &#x27;+action+&#x27;..&#x27;));

let results = {
    total:0,
    duration:0,
    fastduration:99999999,
    slowduration:0,
    successful:0,
    firstInvocation:&#x27;&#x27;,
    lastInvocation:&#x27;&#x27;
};

&#x2F;*
Going to store dates in an array and sort. Right now the package is returning
items reverse date sorted, but its not documented and may change in the future.
*&#x2F;
let dates = [];

let activations = [];
function getAllActivations(cb,acts,skip) {
    if(!acts) acts=[];
    if(!skip) skip=0;
    process.stdout.write(chalk.blue(&#x27;.&#x27;));
    ow.activations.list({% raw %}{limit:200, name:action, docs:true, skip:skip}{% endraw %}).then(result =&gt; {
        if(result.length === 0 || acts.length &gt;= MAX_ACTS) return cb(acts);
        acts = acts.concat(result);
        getAllActivations(cb,acts,skip+200);
    });
}

getAllActivations((result) =&gt; {
    
    results.total = result.length;
    result.forEach((act) =&gt; {
        results.duration += act.duration
        if(act.duration &lt; results.fastduration) results.fastduration = act.duration;
        if(act.duration &gt; results.slowduration) results.slowduration = act.duration;
        if(act.response.success) results.successful++;
        dates.push(act.start);  
    });

    dates.sort((a,b) =&gt; {
        if(a &lt; b) return -1;
        if(a === b) return 0;
        if(a &gt; b) return 1;
    });

    results.firstInvocation = new Date(dates[0]);
    results.lastInvocation = new Date(dates[dates.length-1]);
       
    results.avgduration = Number((results.duration&#x2F;results.total).toFixed(2));
    results.successfulperc = Number((results.successful&#x2F;results.total*100).toFixed(2));

    let finalResult = `
Total Number of Invocations:    ${% raw %}{results.total}{% endraw %}
Total Successful:               ${% raw %}{results.successful}{% endraw %} (${% raw %}{results.successfulperc}{% endraw %}%)
First Invocation:               ${% raw %}{results.firstInvocation}{% endraw %}
Last Invocation:                ${% raw %}{results.lastInvocation}{% endraw %}
Total Duration (ms):            ${% raw %}{results.duration}{% endraw %}
Quickest Duration (ms):         ${% raw %}{results.fastduration}{% endraw %}
Slowest Duration (ms):          ${% raw %}{results.slowduration}{% endraw %}
Average Duration (ms):          ${% raw %}{results.avgduration}{% endraw %}
`;
    process.stdout.write(chalk.green(finalResult));
    &#x2F;&#x2F;console.log(results);

});
</code></pre>

You can find this code (and make improvements!) here in my GitHub repo:

https://github.com/cfjedimaster/Serverless-Examples/blob/master/stats2/getstats.js