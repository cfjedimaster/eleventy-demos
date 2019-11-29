---
layout: post
title: "Using IBM Watson Tone Analyzer in OpenWhisk"
date: "2017-03-22T16:34:00-07:00"
categories: [serverless]
tags: [openwhisk]
banner_image: 
permalink: /2017/03/22/using-ibm-watson-tone-analzyer-in-openwhisk
---

Earlier today I decided to write up a quick wrapper to the [IBM Watson Tone Analyzer](https://www.ibm.com/watson/developercloud/tone-analyzer.html) using [OpenWhisk](https://developer.ibm.com/openwhisk/). It ended up being so incredibly trivial I doubted it made sense to even blog about it, but then I realized - this is part of what makes OpenWhisk, and serverless, so incredible. 

I was able to deploy a function that acts as a proxy to the REST APIs Tone Analyzer uses. All this action does is literally expose the Watson Developer npm package interface to an OpenWhisk user. Here it is in its entirety:

<pre><code class="language-javascript">var watson = require(&#x27;watson-developer-cloud&#x27;);

function main(args) {

    var tone_analyzer = watson.tone_analyzer({
        username: args.username,
        password: args.password,
        version: &#x27;v3&#x27;,
        version_date: &#x27;2016-05-19&#x27;
    });

    return new Promise( (resolve, reject) =&gt; {

        tone_analyzer.tone({% raw %}{text:args.text}{% endraw %}, (err, tone) =&gt; {
            if(err) return reject(err);
            return resolve(tone);
        });

    });
}

exports.main = main;
</code></pre>

If you weren't aware, the [watson-developer-cloud](https://www.npmjs.com/package/watson-developer-cloud) package provides simple Node interfaces for over twenty different Watson services. And how well does it handle it? I've got one block of code to create an instance of `watson.tone_analyzer` and one call to `tone` to perform the analysis. 

So yes - my code here is stupid simple, but within seconds I was able to deploy this to OpenWhisk in a package, mark the package shared, and now it's available to any OpenWhisk user. I can also use it with other actions as part of a sequence. You do need to provision the service in Bluemix of course, but that's fairly trivial to do as well. 

This is *exactly* the kind of thing that is making me love serverless more and more every day. I didn't have to provision a server. I didn't have to setup Express or heck, even a Node.js server in general. I wrote my function and was done. In terms of cost - I just pay for my Tone Analyzer usage and I only pay for my action when it's actually invoked. 

Here's an example of it in action. First, the call:

<pre><code class="language-javascript">wsk action invoke "/rcamden@us.ibm.com_My Space/watson/tone" 
--param username secret --param password ilovecats 
--param text "I am so mad!" -b -r
</code></pre>

And the result. It's a pretty big set of data, and my input was *way* too small, but it certainly did pick up on the anger.

<pre><code class="language-javascript">{
    "document_tone": {
        "tone_categories": [
            {
                "category_id": "emotion_tone",
                "category_name": "Emotion Tone",
                "tones": [
                    {
                        "score": 0.881688,
                        "tone_id": "anger",
                        "tone_name": "Anger"
                    },
                    {
                        "score": 0.022428,
                        "tone_id": "disgust",
                        "tone_name": "Disgust"
                    },
                    {
                        "score": 0.074133,
                        "tone_id": "fear",
                        "tone_name": "Fear"
                    },
                    {
                        "score": 0.006716,
                        "tone_id": "joy",
                        "tone_name": "Joy"
                    },
                    {
                        "score": 0.092043,
                        "tone_id": "sadness",
                        "tone_name": "Sadness"
                    }
                ]
            },
            {
                "category_id": "language_tone",
                "category_name": "Language Tone",
                "tones": [
                    {
                        "score": 0,
                        "tone_id": "analytical",
                        "tone_name": "Analytical"
                    },
                    {
                        "score": 0,
                        "tone_id": "confident",
                        "tone_name": "Confident"
                    },
                    {
                        "score": 0,
                        "tone_id": "tentative",
                        "tone_name": "Tentative"
                    }
                ]
            },
            {
                "category_id": "social_tone",
                "category_name": "Social Tone",
                "tones": [
                    {
                        "score": 0.022751,
                        "tone_id": "openness_big5",
                        "tone_name": "Openness"
                    },
                    {
                        "score": 0.234966,
                        "tone_id": "conscientiousness_big5",
                        "tone_name": "Conscientiousness"
                    },
                    {
                        "score": 0.366922,
                        "tone_id": "extraversion_big5",
                        "tone_name": "Extraversion"
                    },
                    {
                        "score": 0.567783,
                        "tone_id": "agreeableness_big5",
                        "tone_name": "Agreeableness"
                    },
                    {
                        "score": 0.001604,
                        "tone_id": "emotional_range_big5",
                        "tone_name": "Emotional Range"
                    }
                ]
            }
        ]
    }
}

</code></pre>