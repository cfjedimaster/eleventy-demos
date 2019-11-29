---
layout: post
title: "Advent of Code - Day 2"
date: "2016-12-02T09:30:00-07:00"
categories: [development]
tags: [advent of code,javascript]
banner_image: 
permalink: /2016/12/02/advent-of-code-day-2
---

The second day's challenge for [Advent of Code](http://adventofcode.com/) was a bit easier than the first, so it was nice to tackle it a bit quicker. The puzzle involves a set of directions for moving your fingers over a numeric keypad. Imagine a typical security keypad layed out like so:

	1 2 3
	4 5 6
	7 8 9

Then take input in this form:

	LLRUDD
	UUD

Each line represents a set of movements to the left, right, up, and down. You navigate those movements, but do NOT leave the keypad even if the instructions tell you to. At the end of each line, you press the button. The solution then is simply the buttons you pressed. Here is my solution:


<pre><code class="language-javascript">
const fs = require(&#x27;fs&#x27;);
const input = fs.readFileSync(&#x27;.&#x2F;input.txt&#x27;,&#x27;utf8&#x27;);
&#x2F;&#x2F;const input = &#x27;RRRRDDDDLLLLLL&#x27;;
const instructions = input.split(&#x27;\n&#x27;);

&#x2F;*
1 2 3
4 5 6
7 8 9
*&#x2F;

let curPos = [1, 1];
var pressed = [];
instructions.forEach(function(instruction) {

    for(var i=0;i&lt;instruction.length;i++) {
        let d = instruction.substring(i,i+1);
        curPos = move(curPos,d);
        &#x2F;&#x2F;console.log(curPos);
    }
    
    pressed.push(button(curPos));

});

console.log(pressed.join(&#x27;&#x27;));

&#x2F;*
basically just ensure we don&#x27;t go too far off the edge
values are RLUD
*&#x2F;
function move(pos, dir) {

    if(dir === &quot;R&quot; &amp;&amp; pos[0] &lt; 2) {
        pos[0]++;
    }
    if(dir === &quot;L&quot; &amp;&amp; pos[0] &gt; 0) {
        pos[0]--;
    }
    if(dir === &quot;U&quot; &amp;&amp; pos[1] &lt; 2) {
        pos[1]++;
    }
    if(dir === &quot;D&quot; &amp;&amp; pos[1] &gt; 0) {
        pos[1]--;
    }
    return pos;
}

&#x2F;*
translate position to button
1 2 3
4 5 6
7 8 9
*&#x2F;
function button(p) {
    var l = p.toString();
    if(l === &quot;0,2&quot;) return 1;
    if(l === &quot;1,2&quot;) return 2;
    if(l === &quot;2,2&quot;) return 3;
    if(l === &quot;0,1&quot;) return 4;
    if(l === &quot;1,1&quot;) return 5;
    if(l === &quot;2,1&quot;) return 6;
    if(l === &quot;0,0&quot;) return 7;
    if(l === &quot;1,0&quot;) return 8;
    if(l === &quot;2,0&quot;) return 9;

}
</code></pre>

My solution simply parses the input, moves the 'finger', and ensures we stay on the keypad which is just a 2d array.

The second part mixes this up by changing the keypad:

<pre>
    1
  2 3 4
5 6 7 8 9
  A B C
    D
</pre>

Here's my solution:

<pre><code class="language-javascript">
const fs = require(&#x27;fs&#x27;);
const input = fs.readFileSync(&#x27;.&#x2F;input.txt&#x27;,&#x27;utf8&#x27;);
&#x2F;&#x2F;const input = &#x27;RRRRDDDDLLLLLL&#x27;;
const instructions = input.split(&#x27;\n&#x27;);

let curPos = [1, 1];
var pressed = [];
instructions.forEach(function(instruction) {

    for(var i=0;i&lt;instruction.length;i++) {
        let d = instruction.substring(i,i+1);
        curPos = move(curPos,d);
    }

    pressed.push(button(curPos));

});

console.log(pressed.join(&#x27;&#x27;));

&#x2F;*
basically just ensure we don&#x27;t go too far off the edge
values are RLUD

    1
  2 3 4
5 6 7 8 9
  A B C
    D
*&#x2F;
function move(pos, dir) {
    var orig = Array.from(pos);
    let grid = [
        &quot;  D  &quot;,
        &quot; ABC &quot;,
        &quot;56789&quot;,
        &quot; 234 &quot;,
        &quot;  1  &quot;];

    if(dir === &quot;R&quot; &amp;&amp; pos[0] &lt; 4) {
        pos[0]++;
    }
    if(dir === &quot;L&quot; &amp;&amp; pos[0] &gt; 0) {
        pos[0]--;
    }
    if(dir === &quot;U&quot; &amp;&amp; pos[1] &lt; 4) {
        pos[1]++;
    }
    if(dir === &quot;D&quot; &amp;&amp; pos[1] &gt; 0) {
        pos[1]--;
    }

    &#x2F;&#x2F;if value is blank, we don&#x27;t move
    let row = grid[pos[0]];
    let picked = row.substring(pos[1], pos[1]+1);
    if(picked === &quot; &quot;) {
        return orig;
    } 
    return pos;
}

&#x2F;*
translate position to button
    1
  2 3 4
5 6 7 8 9
  A B C
    D

*&#x2F;
function button(p) {
    var l = p.toString();
    if(l === &quot;2,4&quot;) return 1;
    if(l === &quot;1,3&quot;) return 2;
    if(l === &quot;2,3&quot;) return 3;
    if(l === &quot;3,3&quot;) return 4;
    if(l === &quot;0,2&quot;) return 5;
    if(l === &quot;1,2&quot;) return 6;
    if(l === &quot;2,2&quot;) return 7;
    if(l === &quot;3,2&quot;) return 8;
    if(l === &quot;4,2&quot;) return 9;
    if(l === &quot;1,1&quot;) return &quot;A&quot;;
    if(l === &quot;2,1&quot;) return &quot;B&quot;;
    if(l === &quot;3,1&quot;) return &quot;C&quot;;
    if(l === &quot;2,0&quot;) return &quot;D&quot;;
    console.log(&#x27;BAD &#x27;+l); process.exit();
}
</code></pre>

This time, my move logic does two things. It still ensures it is within a main 'bounding' box, but then looks to see if it fell on an 'empty' space, and if so, it ignores the move. 

Note how I copied the array: 

    var orig = Array.from(pos);

Originally I simply made a copy, and forgot it was a copy by reference. Oops.

You can find my repo of solutions here: https://github.com/cfjedimaster/adventofcode