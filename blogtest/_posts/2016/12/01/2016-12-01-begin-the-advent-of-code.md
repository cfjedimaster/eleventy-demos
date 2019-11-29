---
layout: post
title: "Begin the Advent of Code!"
date: "2016-12-01T10:14:00-07:00"
categories: [development]
tags: [advent of code,javascript]
banner_image: /images/banners/adventofcode.jpg
permalink: /2016/12/01/begin-the-advent-of-code
---

Forgive the somewhat dramatic title, but today begins one of the coolest coding challenges I've ever done, the [Advent of Code](http://adventofcode.com/). The Advent of Code presents you with two coding challenges a day. (The second is typically a minor modification of the first one.) You can solve the challenge anyway you want. They start off - mostly - kind of simple and then kind of go off the deep end towards the end. 

Last year I was able to do all but, maybe, 4 of them, without "cheating", and by "cheating" I just looked at solutions in other languages and rebuilt them in JavaScript. I was still practicing my JavaScript so I still had fun even when I couldn't figure out the solution myself. 

In order to encourage my readers to participate, I've decided to share, and blog, my solutions, for every day of contest. I'll probably fall a bit behind on the weekends, and I probably won't code on the 25th (last year I just did it the day after), but if folks want to see how I'm solving these challenges, I'm more then willing to share. 

I've set up a repo for my solutions here: https://github.com/cfjedimaster/adventofcode

To be clear, my solutions are going to be pure crap. Do not consider these solutions as examples of best practices or anything even close to intelligent code. But they will work, and I'll have fun writing them, so that's good enough for me. ;)

One piece of advice I'd like to share, and the site makes this suggestion as well. If your solution isn't working, take the sample, smaller input they provide with answers and check your code again. I had to do that today.

Day One
---

The [first challenge](http://adventofcode.com/2016/day/1) wasn't too difficult, but it took me a few reads to figure out exactly what they were asking. Essentially the challenge is this. You're given input that includes a direction and distance traveled across city blocks. Figure out where you end up, then figure out a minimum distance to that point. This is called [Taxiway geometry](https://en.wikipedia.org/wiki/Taxicab_geometry) and it turns out there is a super simple solution once you know points 1 and 2:

	Math.abs(x1-x2) + Math.abs(y1-y2)

Here is my solution. Again, be gentle.

<pre><code class="language-javascript">
var fs = require(&#x27;fs&#x27;);
var input = fs.readFileSync(&#x27;.&#x2F;input.txt&#x27;,&#x27;utf8&#x27;);
&#x2F;&#x2F;var input = &#x27;R2, R2, R2&#x27;;
var steps = input.split(&#x27;, &#x27;);

&#x2F;*
we start at 1,1
loop over each step and figure out the new pos
*&#x2F;
var currentPos = [1,1];
var currentDir = &quot;N&quot;;  &#x2F;&#x2F; North

steps.forEach((step) =&gt; {
    var dir = step.substring(0,1);
    var dis = Number(step.substring(1));
    console.log(dir+&#x27;,&#x27;+dis);

    console.log(&#x27;current direction &#x27;+currentDir);
    if(dir === &quot;R&quot;) turnRight();
    if(dir === &quot;L&quot;) turnLeft();
    console.log(&#x27;new direction &#x27;+currentDir);
    console.log(&#x27;current pos &#x27;+currentPos);
    move(dis);
    console.log(&#x27;new pos &#x27;+currentPos);
});

var distance = Math.abs(1-currentPos[0]) + Math.abs(1-currentPos[1]);
console.log(&#x27;Distance is &#x27;+distance);

function move(x) {
    &#x2F;*
    given a direction and current pos, um, move
    *&#x2F;
    if(currentDir === &quot;N&quot;) currentPos = [currentPos[0] + x, currentPos[1]];
    if(currentDir === &quot;E&quot;) currentPos = [currentPos[0], currentPos[1] + x];
    if(currentDir === &quot;S&quot;) currentPos = [currentPos[0] - x, currentPos[1]];
    if(currentDir === &quot;W&quot;) currentPos = [currentPos[0], currentPos[1] - x];

}

function turnRight() {
    switch(currentDir) {
        case &quot;N&quot;: {
            currentDir = &quot;E&quot;;
            break;
        }
        case &quot;E&quot;: {
            currentDir = &quot;S&quot;;
            break;
        }
        case &quot;S&quot;: {
            currentDir = &quot;W&quot;;
            break;
        }
        case &quot;W&quot;: {
            currentDir = &quot;N&quot;;
            break;
        }
    }
}

function turnLeft() {
    switch(currentDir) {
        case &quot;N&quot;: {
            currentDir = &quot;W&quot;;
            break;
        }
        case &quot;E&quot;: {
            currentDir = &quot;N&quot;;
            break;
        }
        case &quot;S&quot;: {
            currentDir = &quot;E&quot;;
            break;
        }
        case &quot;W&quot;: {
            currentDir = &quot;S&quot;;
            break;
        }
    }
}
</code></pre>

For the most part, it should make sense, but the general idea is to read in the input, parse it, and then iterate over every step of the directions. Once I'm done, I simply use the math I described above to get the result. 

The second part to the challenge was interesting. Instead of getting the distance to the last point of the path, you now need to get the distance to the first point you traveled to twice. My code above made this difficult as I make my moves in whole blocks, ie if I'm going 5 blocks east, I move 5 at once. I needed to change my code to "step" through each part of the movement and keep track of how many times I visited it. Here's that version:

<pre><code class="language-javascript">
var fs = require(&#x27;fs&#x27;);
var input = fs.readFileSync(&#x27;.&#x2F;input.txt&#x27;,&#x27;utf8&#x27;);
&#x2F;&#x2F;var input = &#x27;R8, R4, R4, R8&#x27;;
var steps = input.split(&#x27;, &#x27;);

&#x2F;*
we start at 1,1
loop over each step and figure out the new pos
*&#x2F;
var currentPos = [1,1];
var currentDir = &quot;N&quot;;  &#x2F;&#x2F; North
var visited = {};
var target = &quot;&quot;;
steps.forEach((step) =&gt; {
    var dir = step.substring(0,1);
    var dis = Number(step.substring(1));
&#x2F;&#x2F;    console.log(dir+&#x27;,&#x27;+dis);

&#x2F;&#x2F;    console.log(&#x27;current direction &#x27;+currentDir);
    if(dir === &quot;R&quot;) turnRight();
    if(dir === &quot;L&quot;) turnLeft();
&#x2F;&#x2F;    console.log(&#x27;new direction &#x27;+currentDir);
&#x2F;&#x2F;    console.log(&#x27;current pos &#x27;+currentPos);
    move(dis);
&#x2F;&#x2F;    console.log(&#x27;new pos &#x27;+currentPos);
});

console.log(&#x27;my target is &#x27;+target);

var distance = Math.abs(1-target[0]) + Math.abs(1-target[1]);
console.log(&#x27;Distance is &#x27;+distance);

function move(x) {
    &#x2F;*
    given a direction and current pos, um, move
    *&#x2F;
    for(var i=0;i&lt;x;i++) {
        if(currentDir === &quot;N&quot;) currentPos = [currentPos[0] + 1, currentPos[1]];
        if(currentDir === &quot;E&quot;) currentPos = [currentPos[0], currentPos[1] + 1];
        if(currentDir === &quot;S&quot;) currentPos = [currentPos[0] - 1, currentPos[1]];
        if(currentDir === &quot;W&quot;) currentPos = [currentPos[0], currentPos[1] - 1];
&#x2F;&#x2F;        console.log(&#x27;MOVE :&#x27;+currentPos);
        var newPosLabel = currentPos.toString(); &#x2F;&#x2F; 1,2
        if(!visited[newPosLabel]) visited[newPosLabel] = 0;
        visited[newPosLabel]++;
        if(visited[newPosLabel] === 2) {
  &#x2F;&#x2F;          console.log(&#x27;been to &#x27;+newPosLabel+ &#x27; twice!&#x27;);
            &#x2F;&#x2F;only record once. there is no break in a foreach
            if(target === &quot;&quot;) target = newPosLabel.split(&#x27;,&#x27;);
        }

    }


}

function turnRight() {
    switch(currentDir) {
        case &quot;N&quot;: {
            currentDir = &quot;E&quot;;
            break;
        }
        case &quot;E&quot;: {
            currentDir = &quot;S&quot;;
            break;
        }
        case &quot;S&quot;: {
            currentDir = &quot;W&quot;;
            break;
        }
        case &quot;W&quot;: {
            currentDir = &quot;N&quot;;
            break;
        }
    }
}

function turnLeft() {
    switch(currentDir) {
        case &quot;N&quot;: {
            currentDir = &quot;W&quot;;
            break;
        }
        case &quot;E&quot;: {
            currentDir = &quot;N&quot;;
            break;
        }
        case &quot;S&quot;: {
            currentDir = &quot;E&quot;;
            break;
        }
        case &quot;W&quot;: {
            currentDir = &quot;S&quot;;
            break;
        }
    }
}
</code></pre>

And there ya go. Ugly, but workable.