---
layout: post
title: "Advent of Code - Day 3 and 4"
date: "2016-12-05T09:22:00-07:00"
categories: [development]
tags: [advent of code,javascript]
banner_image: 
permalink: /2016/12/05/advent-of-code-day-3-and-4
---

Only 5 days into [Advent of Code](http://adventofcode.com/) and already this thing is kicking my rear. Both challenges over the weekend were (mostly) simply, but I'm already having trouble keeping up. This is a good thing though. I'm still absolutely loving the hell out of these challenges!

Day 3
---

Day 3 was a rather simple problem. Given three numbers, can you determine if they could be a triangle? Turns out there's a simple mathematical formula for that - any two side lengths must add to a number larger than the third side. So given an input of numbers, the task was to just count the total number of valid triangles.

<pre><code class="language-javascript">
const fs = require(&#x27;fs&#x27;);
const input = fs.readFileSync(&#x27;.&#x2F;input.txt&#x27;,&#x27;utf8&#x27;);
const shapes = input.split(&#x27;\n&#x27;);

var triangles = 0;

shapes.forEach(function(shape) {
    shape = shape.trim();
    shape = shape.replace(&#x2F; {% raw %}{2,}{% endraw %}&#x2F;g, &quot; &quot;);
    let sizes = shape.split(&#x27; &#x27;);
    let sidea = Number(sizes[0]);
    let sideb = Number(sizes[1]);
    let sidec = Number(sizes[2]);
    if(validTriangle(sidea,sideb,sidec)) triangles++;
&#x2F;&#x2F;    console.log(sidea+&#x27; &#x27;+sideb+&#x27; &#x27;+sidec+&#x27; : &#x27;+validTriangle(sidea,sideb,sidec));
});

function validTriangle(a,b,c) {
    if((a+b) &lt;= c) return false;
    if((a+c) &lt;= b) return false;
    if((b+c) &lt;= a) return false;
    return true;
}

console.log(triangles);
</code></pre>

The second part did something evil. Instead of reading the file line by line, now each column of the file represented input. So you needed to read 'down' each column to generate the list of triangle inputs, and *then* validate them. I cursed this one, but still had fun.

<pre><code class="language-javascript">
const fs = require(&#x27;fs&#x27;);
const input = fs.readFileSync(&#x27;.&#x2F;input.txt&#x27;,&#x27;utf8&#x27;);

&#x2F;*
now we need to make a new list of inputs based on columns
*&#x2F;
let shapes = [];
&#x2F;&#x2F;var colA = []; var colB = []; var colC = [];
const lines = input.split(&#x27;\n&#x27;);

let colA = [];
let colB = [];
let colC = [];

lines.forEach(function(line) {
    line = line.trim();
    line = line.replace(&#x2F; {% raw %}{2,}{% endraw %}&#x2F;g, &quot; &quot;);
    let inputs = line.split(&#x27; &#x27;);
    colA.push(inputs[0]); colB.push(inputs[1]); colC.push(inputs[2]);
});

&#x2F;&#x2F; now we have 3 arrays of input we need to add to shapes
function makeShapes(inp) {
    let results = [];
    for(var i=0;i&lt;inp.length;i+=3) {
        results.push({% raw %}{sidea:Number(inp[i]), sideb:Number(inp[i+1]), sidec:Number(inp[i+2])}{% endraw %});
    }
    return results;
}

shapes = shapes.concat(makeShapes(colA));
shapes = shapes.concat(makeShapes(colB));
shapes = shapes.concat(makeShapes(colC));
&#x2F;&#x2F;console.log(&#x27;shapes = &#x27;+shapes.length);

var triangles = 0;

shapes.forEach(function(shape) {
    if(validTriangle(shape.sidea,shape.sideb,shape.sidec)) triangles++;
&#x2F;&#x2F;    console.log(shape.sidea+&#x27; &#x27;+shape.sideb+&#x27; &#x27;+shape.sidec+&#x27; : &#x27;+validTriangle(shape.sidea,shape.sideb,shape.sidec));
});

function validTriangle(a,b,c) {
    if((a+b) &lt;= c) return false;
    if((a+c) &lt;= b) return false;
    if((b+c) &lt;= a) return false;
    return true;
}

console.log(triangles);
</code></pre>

Random question - how much of our job is taking crap input and making it useable?

Day 4
---

This one was a bit fascinating. Our input is a string that looks like so:

	aaaaa-bbb-z-y-x-123[abxyz]

Everything up to the last number represents the name of the room, encrypted. The number represents a 'sector'. Finally, the code inside the brackets is a checksum. You can determine if the string is valid if:

* You count each instance of letters used in the name.
* You sort out the top 5 used letters, and in case of a tie, sort alphabetically. 
* The checksum then is the top 5 letters as sorted above.

So I wrote a generic function to validate that input and used it on the samples they provided. I mentioned how they suggest that as a good way to test your code and I cannot recommend that enough. Once done, I modified my simple validRoom function to return the sector if the room was valid. This is because the main goal is to sum all the sectors. I don't like my function returning something non-boolean, but I got over it.

<pre><code class="language-javascript">
const fs = require(&#x27;fs&#x27;);
const input = fs.readFileSync(&#x27;.&#x2F;input.txt&#x27;,&#x27;utf8&#x27;);
const rooms = input.split(&#x27;\n&#x27;);

let answer = 0;
rooms.forEach(function(room) {
    answer += validRoom(room);
});

console.log(&#x27;answer = &#x27; + answer);
&#x2F;*
if true, returns sector, otherwise returns 0
*&#x2F;
function validRoom(str) {
&#x2F;&#x2F;    console.log(&#x27;input = &#x27;+str);
    var parts = str.split(&#x27;-&#x27;);
    &#x2F;&#x2F;first, get the room, which is all but the last
    var room = parts.slice(0, parts.length - 1).join(&#x27;-&#x27;);
    var endPart = parts[parts.length-1];
    var sector = Number(endPart.replace(&#x2F;\[.+\]&#x2F;g,&#x27;&#x27;));
    var checksumInitial = endPart.replace(&#x2F;.+\[(.*?)\].*&#x2F;,&#x27;$1&#x27;);
    &#x2F;&#x2F;remove trailing newline, this could be done above I think
    checksumInitial = checksumInitial.replace(&#x2F;\s&#x2F;,&#x27;&#x27;);
&#x2F;&#x2F;    console.log(&#x27;room=&#x27;+room);
&#x2F;&#x2F;    console.log(&#x27;sector=&#x27;+sector);
&#x2F;&#x2F;    console.log(checksumInitial.length);
    &#x2F;*
    now generate data on length of chars
    *&#x2F;
    var chars = [];

    for(var i=0;i&lt;room.length;i++) {
        var char = room.substr(i,1);
        if(char === &#x27;-&#x27;) continue;
        var curr = chars.findIndex(function(x) {% raw %}{ return x.letter === char; }{% endraw %});
        if(curr != -1) {
            chars[curr].size++;
        } else {
            chars.push({% raw %}{letter:char, size:1}{% endraw %});
        }
    }

    &#x2F;&#x2F;now generate checksum based on # of letters and alpha sort
    var sorted = chars.sort(function(a,b) {
        if(a.size &gt; b.size) return -1;
        if(a.size &lt; b.size) return 1;
        if(a.size === b.size) {
            if(a.letter &gt; b.letter) return 1;
            if(a.letter &lt; b.letter) return -1;
            return 0;
        }
        return 1;
    });
&#x2F;&#x2F;    console.log(sorted);
    &#x2F;&#x2F;checksum is just top 5
    var checksum = &#x27;&#x27;;
&#x2F;&#x2F;    console.log(sorted);
    for(var i=0;i&lt;Math.min(5, sorted.length);i++) {
        checksum += sorted[i].letter;
    }
&#x2F;&#x2F;    console.log(&#x27;checksum=&#x27;+checksum);
    if(checksum === checksumInitial) return sector;
    return 0;
}
</code></pre>

The second part then had you decrypt the room name using a shift cipher based on the sector. I found a great caesarShift function [here](https://gist.github.com/EvanHahn/2587465) and that worked fine. What wasn't fine was that the puzzle said, "What is the sector ID of the room where North Pole objects are stored?". That made absolutely no sense to me. What they were trying to say is - look at the decrypted room names for something you think makes sense. I saved my output to a file and then CTRL-F for "storage" and found: "northpole object storage". That felt a bit unnecessarily confusing, but heck, it's just like most client-work, right?

You can find my repo of solutions here: https://github.com/cfjedimaster/adventofcode