---
layout: post
title: "Serverless BASIC"
date: "2017-08-01T09:40:00-07:00"
categories: [serverless]
tags: [openwhisk]
banner_image: /images/banners/serverless_basic.jpg
permalink: /2017/08/01/serverless-basic
---

I tend to tease myself a bit about the "useless demos" I like to build, but almost consistently I end up learning <em>something</em> new. It may not be an earth shattering realization of something incredibly deep, but generally, if I learn something, and if I can share it, I consider it a win. Case in point - running BASIC programs in a serverless environment. 

I have quite the soft spot in my heart for BASIC. I learned to code with Applesoft BASIC on a 2e (or 2+, not sure now) and I can still remember the joy of getting my first program to run. (After an incredibly stupid error that happened because I didn't read the docs. Thankfully that never occurred again.) I recently came across a great little on line BASIC interpreter at http://calormen.com/jsbasic/ and when I noticed it was open source, I thought it would be cool to get this up and running in OpenWhisk.

Now - let me be clear. This is a bad idea for (at least) three reasons.

<ol>
<li>The code is already 100% client-side. If my use-case is a client-side application, then putting it on OpenWhisk doesn't gain me anything. In fact, it slows things down as my code would have to make a HTTP call to the server to run the code.</li>
<li>BASIC is an interactive language. It can prompt you for input which doesn't necessarily make sense in a "run and return the output" context.</li>
<li>Finally, Applesoft BASIC in particular has a graphics mode. (Two actually.) In theory I could setup OpenWhisk to return images (and it would be fun to get that working), it doesn't necessarily make sense for my demo.</li>
</ol>

Of course, why should I let that stop me? I began by working on the action code. I ran into a problem right away as the documentation for the library is a bit lacking. But when I filed a [bug report](https://github.com/inexorabletash/jsbasic/issues/17) on it I got a response very quickly. The biggest issue is that I have to tell the library what to do on input and output. For input, I do nothing (I'm just not going to support program input) and for output, I just store it up into a string. Here is the action I built:

<pre><code class="language-javascript">const basic = require(&#x27;.&#x2F;basic&#x27;).basic;


function main(args) {
    let result = &#x27;&#x27;;
    let program = basic.compile(args.input);

    program.init({
        tty: {
            getCursorPosition: function() {% raw %}{ return { x: 0, y: 0 }{% endraw %}; },
            setCursorPosition: function() {% raw %}{ }{% endraw %},
            getScreenSize: function() {% raw %}{ return { width: 80, height: 24 }{% endraw %}; },
            writeChar: function(ch) { 
                &#x2F;&#x2F;console.log(&#x27;writeChar called with: &#x27;+ch);
                result += ch;
            },
            writeString: function(string) { 
                &#x2F;&#x2F;console.log(&#x27;writeString called with: &#x27;+string);
                result += string+&#x27;\n&#x27;;
            },
            readChar: function(callback) {
                &#x2F;&#x2F;callback(host.console.getc());
                callback(&#x27;&#x27;);
            },
            readLine: function(callback, prompt) {
                &#x2F;&#x2F;host.console.puts(prompt);
                &#x2F;&#x2F;callback(host.console.gets().replace(&#x2F;[\r\n]*&#x2F;, &#x27;&#x27;));
                callback(&#x27;&#x27;);
            }
        }
    });

    driver = function() {
        var state;
        do {
            try {
                state = program.step(driver);
            } catch(e) {
                console.log(&#x27;ERROR!&#x27;);
                return {
                    error:e
                }
            }
            &#x2F;&#x2F; may throw basic.RuntimeError
        } while (state === basic.STATE_RUNNING);
    }
    driver(); &#x2F;&#x2F; step until done or blocked

    return {% raw %}{result:result}{% endraw %};

}

exports.main = main;
</code></pre>

Basically I initialize the code with a string input (the BASIC code) and then "run" the program via the `driver` function until it is complete. This will totally fail if you write code expecting input, or if you use graphics modes, but it lets basic stuff work just fine. (Wow, I'm typing "basic" a lot.) Now let's look at the front end. I wrote it all in one quick file so forgive the mix of HTML, CSS, and JS.

<pre><code class="language-markup">&lt;!DOCTYPE html&gt;
&lt;html&gt;
    &lt;head&gt;
        &lt;meta charset=&quot;utf-8&quot;&gt;
        &lt;title&gt;&lt;&#x2F;title&gt;
        &lt;meta name=&quot;description&quot; content=&quot;&quot;&gt;
        &lt;meta name=&quot;viewport&quot; content=&quot;width=device-width&quot;&gt;
        &lt;style&gt;
        #code {
            width: 500px;
            height: 300px;
        } 
        &lt;&#x2F;style&gt;
    &lt;&#x2F;head&gt;
    &lt;body&gt;

        &lt;h1&gt;Serverless Basic&lt;&#x2F;h1&gt;

        &lt;textarea id=&quot;code&quot;&gt;
10 print &quot;hello&quot;
        &lt;&#x2F;textarea&gt;
        &lt;p&#x2F;&gt;
        &lt;button id=&quot;runButton&quot;&gt;Run&lt;&#x2F;button&gt;
        &lt;div id=&quot;result&quot;&gt;&lt;h2&gt;Output&lt;&#x2F;h2&gt;&lt;pre&gt;&lt;&#x2F;pre&gt;&lt;&#x2F;div&gt;

        &lt;script&gt;
        let API = &#x27;https:&#x2F;&#x2F;openwhisk.ng.bluemix.net&#x2F;api&#x2F;v1&#x2F;web&#x2F;rcamden{% raw %}%40us.ibm.com_My%{% endraw %}20Space&#x2F;basic&#x2F;basic.json&#x27;;
        let $code, $runButton, $result;

        document.addEventListener(&#x27;DOMContentLoaded&#x27;, init, false);

        function init(e) {
            $code = document.querySelector(&#x27;#code&#x27;);
            $runButton = document.querySelector(&#x27;#runButton&#x27;);
            $result = document.querySelector(&#x27;#result pre&#x27;);

            $runButton.addEventListener(&#x27;click&#x27;, runCode, false);
        }

        function runCode(e) {
            let code = $code.value;
            if(code === &#x27;&#x27;) return;
            console.log(&#x27;code&#x27;,code);
            fetch(API, {
                method:&#x27;POST&#x27;, 
                body:&#x27;input=&#x27;+encodeURIComponent(code),
                headers:{
                    &#x27;Content-Type&#x27;:&#x27;application&#x2F;x-www-form-urlencoded; charset=utf-8&#x27;
                }
            }).then((res) =&gt; res.json()).then((res) =&gt; {
                if(res.error) {
                    $result.innerHTML = &quot;An error was thrown. Write better code.&quot;;
                } else {
                    $result.innerHTML = res.result;
                }
            }).catch((err) =&gt; {
              console.error(&#x27;error&#x27;, err); 
            });
        }
        &lt;&#x2F;script&gt;
    &lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;
</code></pre>

It's a relatively simple web page. I use a text area for input (with some sample code in there already), a button to run it, and a div to display the output. Here's where I ran into two things that tripped me up.

To send data to my action, I wanted to use a POST instead of a GET. With the Fetch() API, this isn't too hard, but all the demos I saw used a FormData object. Doing this sends the data as a multipart form. From what I can tell, this is <strong>not</strong> support by OpenWhisk. To be clear, OpenWhisk ran just fine on this request, but it didn't take the form fields and automatically turn them into arguments. I could have handled that myself, but I wanted to keep the code as is.

In order to send a urlencoded fetch call, I first tried just adding the header you see above. But apparently - if you send a FormData() object, that will override the urlencoded value and keep it as a multipart post instead. So I had to manually urlencode my form post. Since it was just one value though it wasn't too hard. I'm still new at Fetch so if I missed something obvious, let me know.

If you want to run this yourself, you can do so here: https://cfjedimaster.github.io/Serverless-Examples/basic/test.html

And yes, you can write an infinite loop. I can remember doing that on machines at Sears back in the old days. (Never anything naughty of course.) OpenWhisk will automatically kill the process after 60 seconds so I'm not too concerned about you doing that, but, please, don't. ;)

Oh, and the code for the client and action may be found here: https://github.com/cfjedimaster/Serverless-Examples/tree/master/basic

Enjoy!