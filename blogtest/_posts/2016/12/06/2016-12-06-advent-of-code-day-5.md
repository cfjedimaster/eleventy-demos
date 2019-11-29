---
layout: post
title: "Advent of Code - Day 5"
date: "2016-12-06T08:37:00-07:00"
categories: [development]
tags: [advent of code,javascript]
banner_image: 
permalink: /2016/12/06/advent-of-code-day-5
---

Another easy day for [Advent of Code](http://adventofcode.com/). The first challenge was to simply iterate over a string (take an input string, add 1 to it, and increase that number), make a hash, and check to see if the hash begins with 5 zeroes. If it does, you take the number after the 5 zeroes as a password character. You keep appending to a password until you have seven characters:

<pre><code class="language-javascript">
var crypto = require(&#x27;crypto&#x27;);


var input = &#x27;ojvtpuvg&#x27;;
generatePassword(input);

function generatePassword(s) {
    console.log(&#x27;input = &#x27;+s);
    let password = &#x27;&#x27;;

    let i = -1;
    while(password.length &lt; 8) {
        i++;
        var hash = crypto.createHash(&#x27;md5&#x27;).update(s + i).digest(&#x27;hex&#x27;);
        if(hash.indexOf(&#x27;00000&#x27;) === 0) {
            let pchar = hash.substr(5,1);
            password += pchar;
            console.log(&#x27;Generating password: &#x27;+password);
        }
    }

    console.log(&#x27;Final password: &#x27;+password);
}
</code></pre>

The only real difficult part was finding the Node Hash function and that was just one Google search. Looking over it now, having a <code>generatePassword</code> function seems a bit silly but I was assuming part would possibly need it. (It didn't.)

Speaking of part 2 - all it did was specify that the two characters after the five zeroes now represent a password position and password character. So the solution got a bit more complex.

<pre><code class="language-javascript">
var crypto = require(&#x27;crypto&#x27;);


let input = &#x27;ojvtpuvg&#x27;;
generatePassword(input);

function generatePassword(s) {
    console.log(&#x27;input = &#x27;+s);
    let password = [&#x27;&#x27;,&#x27;&#x27;,&#x27;&#x27;,&#x27;&#x27;,&#x27;&#x27;,&#x27;&#x27;,&#x27;&#x27;,&#x27;&#x27;];

    let i = -1;
    while(!passwordDone(password)) {
        i++;
        var hash = crypto.createHash(&#x27;md5&#x27;).update(s + i).digest(&#x27;hex&#x27;);
        if(hash.indexOf(&#x27;00000&#x27;) === 0) {
            let pchar = hash.substr(6,1);
            let pos = hash.substr(5,1);
            if(pos &gt;= 0 &amp;&amp; pos &lt;= 7 &amp;&amp; password[pos] === &#x27;&#x27;) {
                console.log(hash, pchar, pos);
                password[pos] = pchar;
                console.log(&#x27;Generating password: &#x27;+password);
            }
        }
    }

    console.log(&#x27;Final password: &#x27;+password.join(&#x27;&#x27;));
}

function passwordDone(inp) {
    for(i=0;i&lt;inp.length;i++) {
        if(inp[i] === &#x27;&#x27;) return false;
    }
    return true;
}
</code></pre>

As I said - pretty easy. But that's how Advent of Code works. It lulls you into a sense of confidence and then destroys that without mercy.

You can find my repo of solutions here: https://github.com/cfjedimaster/adventofcode