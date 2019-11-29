---
layout: post
title: "AppFog and MongoDB 2 Configuration"
date: "2014-12-18T05:46:46+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2014/12/18/appfog-and-mongodb2-configuration
guid: 5460
---

Just a quick tip. I'm using <a href="http://www.appfog.com">AppFog</a> for my Node.js version of <a href="http://www.cflib.org">CFLib.org</a> and ran into an issue with their MongoDB2 support. When you use AppFog services, they document how your code can dynamically read configuration information from their server. This is required since things like MongoDB support are configured uniquely per deployed application.

<!--more-->

The <a href="https://support.appfog.com/hc/en-us/articles/202311853-MongoDB">documentation</a> demonstrates how to do this in various languages. Here is the code sample for Node.js:

<pre><code class="language-javascript">
if(process.env.VCAP_SERVICES){
    var env = JSON.parse(process.env.VCAP_SERVICES);
    var mongo = env['mongodb-1.8'][0]['credentials'];
}
else{
    var mongo = {
    "hostname":"localhost",
    "port":27017,
    "username":"",
    "password":"",
    "name":"",
    "db":"db"
    }
}

var generate_mongo_url = function(obj){
    obj.hostname = (obj.hostname || 'localhost');
    obj.port = (obj.port || 27017);
    obj.db = (obj.db || 'test');

    if(obj.username && obj.password){
        return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
    }
    else{
        return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
    }
}

var mongourl = generate_mongo_url(mongo);
</code></pre>

Simple, right? Except that AppFog offers both MongoDB 1.8 and 2.4.8. If you use 2.4.8, you <strong>must</strong> change the line reading credentials too:

<pre><code class="language-javascript">var mongo = env['mongodb2-2.4.8'][0]['credentials'];</code></pre>

The error is pretty obvious when deploying from the CLI, but I wasn't sure of the exact change until I console.logged the JSON variable and viewed my log.