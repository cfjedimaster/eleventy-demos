---
layout: post
title: "Another OpenWhisk Alexa Skill - Death Clock"
date: "2017-03-31T13:02:00-07:00"
categories: [serverless]
tags: [openwhisk,alexa]
banner_image: /images/banners/deathclock.jpg
permalink: /2017/03/31/another-openwhisk-alexa-skill-death-clock
---

Earlier this week I had my second Alexa skill released, the [Unofficial Death Clock](https://www.amazon.com/Raymond-Camden-Unofficial-Death-Clock/dp/B06XTHN5KL/ref=sr_1_1?s=digital-skills&ie=UTF8&qid=1490983438&sr=1-1&keywords=death+clock). Like most things, this was a silly demo that became interesting the more I worked on it. I thought I'd share the code and the issues I ran into building it, but as always, I'll warn folks I'm still new to Alexa skills, so I probably (most likely) didn't do this the best way. 

As a quick aside, I built the original [Death Clock](http://www.deathclock.com) many, many, <i>many</i> years ago as just a fun toy. I sold the site probably close to 15 years ago or so and haven't really thought about it much. That being said, I thought it would be a fun skill to build. 

The basic idea is this: 

* I ask Alexa when I'm going to die.
* Alexa responds with the question, "What is your birth date?"
* On answering, I take that date, figure out how much time you have left to live based on an average life span, and then tell your estimated day of death as well as how many seconds you have left to live.

Now - if you're reading this and shaking your head about how inaccurate this is... great. You're absolutely right. I'd get letters about this *every week* when I ran the site. It's a joke, that's it. 

Alright - with that out of the way - let me demonstrate the first version of the skill. This version does *not* actually support a conversation (and that turned out to be more difficult than I thought). Instead it simply supported a default greeting, and if you said a date value, it supported returning the 'death' info.

<pre><code class="language-javascript">let alexaVerifier = require('alexa-verifier');

//life expectancy for Americans, rounded down
const LIFE_MAX = 78;

const DAYS_MAX = LIFE_MAX * 365;

function getDeathDay(d) {
    let date = new Date(d);
    let now = new Date();

    if(date &gt; now) return -1;

    //ok, first get day diff
    // http://stackoverflow.com/a/3224854/52160
    let timeDiff = Math.abs(now.getTime() - date.getTime());
    let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
    //console.log('diffDays', diffDays);
    let daysLeft = DAYS_MAX - diffDays;
    let secondsLeft = daysLeft * 24 * 60 * 60;
    //console.log('now.getDate', now.getDate());

    let deathDay = new Date(now.valueOf());
    deathDay.setDate(deathDay.getDate() + daysLeft);
    //console.log('deathDay', deathDay);
    deathDay = new Intl.DateTimeFormat('en-US',
        {% raw %}{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }{% endraw %}
        ).format(deathDay);
    return {
        deathDay:deathDay,
        secondsLeft:secondsLeft
    };
}

function main(args) {

    return new Promise(function(resolve, reject) {

        let signaturechainurl = args.__ow_headers.signaturecertchainurl;
        let signature =  args.__ow_headers.signature;
        let body = new Buffer(args.__ow_body,'base64').toString('ascii');
        let request = JSON.parse(body).request;

        alexaVerifier(signaturechainurl, signature, body, function(err) {
            console.log('in verifier cb');
            if(err) {
                console.log('err? '+JSON.stringify(err));
                reject(err);
            } else {
                console.log(request);
                if(!request.intent) request.intent = {% raw %}{name:'intro'}{% endraw %};
                let intent = request.intent;

                let text = &quot;&quot;;

                if(intent.name === &quot;intro&quot;) {
                    text = &quot;When is your birthday, including the year?&quot;;
                } else if(intent.name === &quot;birthday&quot;) {
                    let bday = intent.slots.bday.value;
                    let result = getDeathDay(bday);
                    if(result === -1) {
                        text = &quot;You should be dead already!&quot;;
                    } else {
                        text = &quot;You will die on &quot; + result.deathDay + 
                        &quot;. That will be in &quot;+result.secondsLeft + &quot; seconds.&quot;;
                    }
                }

                var response = {
                &quot;version&quot;: &quot;1.0&quot;,
                &quot;response&quot; :{
                    &quot;shouldEndSession&quot;: true,
                    &quot;outputSpeech&quot;: {
                        &quot;type&quot;: &quot;PlainText&quot;,
                        &quot;text&quot;: text
                        }
                    }
                }

                resolve(response);

            }
        });

    });

}

exports.main = main;
</code></pre>

So the core of the skill is basically a branch based on the intent. As I said, I just supported a 'default' that returned a message asking for your date and then one that actually worked with the date. If a date was passed, and Alexa has *really* good support for parsing dates, I then run `getDeathDay` to return your estimated day of the death as well as the number of seconds till that date. I return a -1 value for people who should be dead already. (Sorry, sucks to be you.)

This worked, but was *not* a conversation. In other words, I couldn't say, "Ask Death Clock when will I die" and then immediately respond with my birthday after it asked for it.

For some reason, I just could not find out how to do this in the docs. The answer turned out to be a 'reprompt' value. Here is an example of the JSON I returned:

<pre><code class="language-javascript">{
	"version": "1.0",
	"response" :{
		"shouldEndSession": false,
		"outputSpeech": {
			"type": "PlainText",
			"text": text
			},
		"reprompt": {
			"outputSpeech":{
				"type": "PlainText",
				"text": text
				}
			}
		}
}
</code></pre>

Note that I had to include an `outputSpeech` and a `reprompt` in order for it to work. I'm 99% sure I've got that wrong since I'm basically repeating the same text value twice. That being said, when I made this change, I could visibly see the Alexa device wait for my response. (Basically, the light stayed on.) I could answer with just the date and then it would work.

Cool! So I went to verify it and then ran into some interesting issues.

First, Amazon reported that there was a trademark on Death Clock. Fair enough - I sold it. I literally had to rename my skill to the "unofficial Death Clock" and that was enough. Cool.

Then, and... I'm still shaking my head at this - they told me this:

<blockquote>
Your skill's descriptions do not clearly state the skill is a prank skill. We provide our customers with a trusted environment. Please update your skill to edit the description to comply with our content guidelines, and resubmit your skill for reconsideration.
</blockquote>

<i>sigh</i>

Ok, Amazon, I get it. We don't want to scare people, but... fine. So I made that change too.

The more difficult problems though involved the fact that my app didn't support a "Stop" and "Cancel" event. I guess since my first skill was 'one step' this wasn't necessary. 

I fixed this in two steps. First, I added the intents, and again, Amazon makes this easy:

<pre><code class="language-javascript">{
	"intent": "AMAZON.StopIntent"
},
{
	"intent": "AMAZON.CancelIntent"
}
</code></pre>

And then I added code to handle these events and return a simple "Bye" message. Here is the complete version of the final skill.

<pre><code class="language-javascript">let alexaVerifier = require(&#x27;alexa-verifier&#x27;);

&#x2F;&#x2F;life expectancy for Americans, rounded down
const LIFE_MAX = 78;

const DAYS_MAX = LIFE_MAX * 365;

function getDeathDay(d) {
    let date = new Date(d);
    let now = new Date();

    if(date &gt; now) return -1;

    &#x2F;&#x2F;ok, first get day diff
    &#x2F;&#x2F; http:&#x2F;&#x2F;stackoverflow.com&#x2F;a&#x2F;3224854&#x2F;52160
    let timeDiff = Math.abs(now.getTime() - date.getTime());
    let diffDays = Math.ceil(timeDiff &#x2F; (1000 * 3600 * 24)); 
    &#x2F;&#x2F;console.log(&#x27;diffDays&#x27;, diffDays);
    let daysLeft = DAYS_MAX - diffDays;
    let secondsLeft = daysLeft * 24 * 60 * 60;
    &#x2F;&#x2F;console.log(&#x27;now.getDate&#x27;, now.getDate());

    let deathDay = new Date(now.valueOf());
    deathDay.setDate(deathDay.getDate() + daysLeft);
    &#x2F;&#x2F;console.log(&#x27;deathDay&#x27;, deathDay);
    deathDay = new Intl.DateTimeFormat(&#x27;en-US&#x27;,
        {% raw %}{ weekday: &#x27;long&#x27;, year: &#x27;numeric&#x27;, month: &#x27;long&#x27;, day: &#x27;numeric&#x27; }{% endraw %}
        ).format(deathDay);
    return {
        deathDay:deathDay,
        secondsLeft:secondsLeft
    };
}

function main(args) {

    return new Promise(function(resolve, reject) {

        let signaturechainurl = args.__ow_headers.signaturecertchainurl;
        let signature =  args.__ow_headers.signature;
        let body = new Buffer(args.__ow_body,&#x27;base64&#x27;).toString(&#x27;ascii&#x27;);
        let request = JSON.parse(body).request;

        alexaVerifier(signaturechainurl, signature, body, function(err) {
            if(err) {
                console.log(&#x27;err? &#x27;+JSON.stringify(err));
                reject(err);
            } else {
                console.log(JSON.stringify(request));
                if(!request.intent) request.intent = {% raw %}{name:&#x27;intro&#x27;}{% endraw %};
                let intent = request.intent;

                let text = &quot;&quot;;

                let response;

                if(intent.name === &quot;intro&quot;) {
                    text = &quot;When is your birthday, including the year?&quot;;

                    response = {
                    &quot;version&quot;: &quot;1.0&quot;,
                    &quot;response&quot; :{
                        &quot;shouldEndSession&quot;: false,
                        &quot;outputSpeech&quot;: {
                            &quot;type&quot;: &quot;PlainText&quot;,
                            &quot;text&quot;: text
                            },
                        &quot;reprompt&quot;: {
                            &quot;outputSpeech&quot;:{
                                &quot;type&quot;: &quot;PlainText&quot;,
                                &quot;text&quot;: text
                                }
                            }
                        }
                    }

                } else if(intent.name === &quot;help&quot;) {
                    text = &quot;I can tell you when you will die. When is your birthday, including the year?&quot;;

                    response = {
                    &quot;version&quot;: &quot;1.0&quot;,
                    &quot;response&quot; :{
                        &quot;shouldEndSession&quot;: false,
                        &quot;outputSpeech&quot;: {
                            &quot;type&quot;: &quot;PlainText&quot;,
                            &quot;text&quot;: text
                            },
                        &quot;reprompt&quot;: {
                            &quot;outputSpeech&quot;:{
                                &quot;type&quot;: &quot;PlainText&quot;,
                                &quot;text&quot;: text
                                }
                            }
                        }
                    }
                    
                } else if(intent.name === &quot;AMAZON.StopIntent&quot; || intent.name === &quot;AMAZON.CancelIntent&quot;) {

                    response = {
                    &quot;version&quot;: &quot;1.0&quot;,
                    &quot;response&quot; :{
                        &quot;shouldEndSession&quot;: true,
                        &quot;outputSpeech&quot;: {
                            &quot;type&quot;: &quot;PlainText&quot;,
                            &quot;text&quot;: &quot;Bye!&quot;
                            }
                        }
                    }

                } else if(intent.name === &quot;birthday&quot;) {
                    let bday = intent.slots.bday.value;
                    if(!bday || bday === &#x27;&#x27;) {
                        text = &quot;I&#x27;m sorry, but that isn&#x27;t a valid day.&quot;;
                    } else {
                        let result = getDeathDay(bday);
                        if(result === -1) {
                            text = &quot;You should be dead already!&quot;;
                        } else {
                            text = &quot;You will die on &quot; + result.deathDay + 
                            &quot;. That will be in &quot;+result.secondsLeft + &quot; seconds.&quot;;
                        }
                    }

                    response = {
                    &quot;version&quot;: &quot;1.0&quot;,
                    &quot;response&quot; :{
                        &quot;shouldEndSession&quot;: true,
                        &quot;outputSpeech&quot;: {
                            &quot;type&quot;: &quot;PlainText&quot;,
                            &quot;text&quot;: text
                            }
                        }
                    }
 
               }

                resolve(response);

            }
        });

    });

}

exports.main = main;
</code></pre>

As a reminder, you can find this and more of my serverless examples up here: https://github.com/cfjedimaster/Serverless-Examples

And that's that. Here it is in action. Forgive the pause on "Death Clock", I have a bit of a stammer with "D" words so it's a struggle sometimes to say those words.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Death Clock Alexa skill in action: <a href="https://t.co/wRnTyLUucf">pic.twitter.com/wRnTyLUucf</a></p>&mdash; Raymond Camden (@raymondcamden) <a href="https://twitter.com/raymondcamden/status/847879639997358080">March 31, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>