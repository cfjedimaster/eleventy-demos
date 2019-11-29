---
layout: post
title: "Advent of Code - Day 13 and 14"
date: "2016-12-16T11:33:00-07:00"
categories: [development]
tags: [advent of code,javascript]
banner_image: 
permalink: /2016/12/16/advent-of-code-day-13-and-14
---

Every day I fall farther and farther behind in the [Advent of Code](http://adventofcode.com/), but I figure this
will give me something fun to do in the week of Christmas. Days 13 and 14 were a bit rough, but I got through them (with a lot of help).

Day 13
---

[Day 13](http://adventofcode.com/2016/day/13) basically involved generating a maze and then finding the solution. As
you can imagine, this is a well known problem and loads of solutions exist. You can also find the general algorithm for 
it as well, but I decided to take the easy way out and simply find a JavaScript module that did it for me. I used
[PathFinding.js](https://github.com/qiao/PathFinding.js) from Xueqiao Xu and it worked great. Here's my solution for part 1.

<pre><code class="language-javascript">
var PF = require(&#x27;pathfinding&#x27;);

let maxY = 50;
let maxX = 50;
const MGR_FAV = 1362;
&#x2F;&#x2F;const MGR_FAV = 10;

&#x2F;&#x2F;let targetX = 7;
&#x2F;&#x2F;let targetY = 4;
let targetX = 31;
let targetY = 39;

let cells = [];

for(let x=0;x&lt;maxX;x++) {
    cells[x] = [];
    for(let y=0;y&lt;maxY;y++) {
        let thing = getThing(x,y);
        cells[x][y] = thing;
    }
}

renderMaze(cells);

var pfgrid = new PF.Grid(maxX, maxY);
for(let x=0;x&lt;cells.length;x++) {
    for(let y=0;y&lt;cells[x].length;y++) {
        let v = cells[x][y];
        let walkable = (v == &quot;.&quot;);
        pfgrid.setWalkableAt(x,y,walkable);
    }
}
var finder = new PF.AStarFinder();
var path = finder.findPath(1, 1, targetX, targetY, pfgrid);
console.log(path.length-1);

&#x2F;*
Horrible name, but this returns wall&#x2F;empty space

Find x*x + 3*x + 2*x*y + y + y*y.
Add the office designer&#x27;s favorite number (your puzzle input).
Find the binary representation of that sum; count the number of bits that are 1.
If the number of bits that are 1 is even, it&#x27;s an open space.
If the number of bits that are 1 is odd, it&#x27;s a wall.
*&#x2F;
function getThing(x,y) {
&#x2F;&#x2F;    console.log(x,y);
    let initialResult = (x*x) + (3*x) + (2*x*y) + y + (y*y);
    initialResult += MGR_FAV;
    &#x2F;&#x2F;http:&#x2F;&#x2F;stackoverflow.com&#x2F;a&#x2F;16155417&#x2F;52160
    let binaryVersion = (initialResult &gt;&gt;&gt; 0).toString(2);
    let bitCount = 0;
    for(let i=0;i&lt;binaryVersion.length;i++) {
        let char = binaryVersion.substr(i,1);
        if(char === &quot;1&quot;) bitCount++;
    }
    if(bitCount % 2 === 0) return &quot;.&quot;;
    return &quot;#&quot;;
}

function renderMaze(cells) {
    &#x2F;*
    for(let x=0;x&lt;cells.length;x++) {
        for(let y=0;y&lt;cells[x].length;y++) {
            process.stdout.write(cells[x][y]);
        }
        process.stdout.write(&#x27;\n&#x27;);
    }
    *&#x2F;
    for(let y=0;y&lt;cells[0].length;y++) {
        for(let x=0;x&lt;cells[y].length;x++) {
            process.stdout.write(cells[x][y]);
        }
        process.stdout.write(&#x27;\n&#x27;);        
    }
}
</code></pre>

For me the fun part was actually seeing my maze. I didn't render the solution, but would have been easy.

![The Maze](https://static.raymondcamden.com/images/2016/12/maze1.png)

Part 2 simply has you find all the cells that are within a certain range. This was simple after I discovered that PathFinder modifies the 
original data and you need to clone it if you are 'walking' it more than once.

<pre><code class="language-javascript">
var PF = require(&#x27;pathfinding&#x27;);

let maxY = 50;
let maxX = 50;
const MGR_FAV = 1362;


let cells = [];

for(let x=0;x&lt;maxX;x++) {
    cells[x] = [];
    for(let y=0;y&lt;maxY;y++) {
        let thing = getThing(x,y);
        cells[x][y] = thing;
    }
}

&#x2F;&#x2F;renderMaze(cells);

var pfgrid = new PF.Grid(maxX, maxY);
for(let x=0;x&lt;cells.length;x++) {
    for(let y=0;y&lt;cells[x].length;y++) {
        let v = cells[x][y];
        let walkable = (v == &quot;.&quot;);
        pfgrid.setWalkableAt(x,y,walkable);
    }
}
var finder = new PF.AStarFinder();
var found = 0;
for(let x=0;x&lt;maxX;x++) {
    for(let y=0;y&lt;maxY;y++) {
        var gridBackup = pfgrid.clone();
        &#x2F;&#x2F;good place?
        if(cells[x][y] == &quot;.&quot;) {
            var path = finder.findPath(1, 1, x, y, gridBackup);
            if(path.length) {
                var steps = path.length - 1;
                if(steps &lt;= 50) found++;
            }
        }
    }
}
&#x2F;&#x2F;1242 is too high
console.log(&#x27;found&#x27;,found);
&#x2F;*
Horrible name, but this returns wall&#x2F;empty space

Find x*x + 3*x + 2*x*y + y + y*y.
Add the office designer&#x27;s favorite number (your puzzle input).
Find the binary representation of that sum; count the number of bits that are 1.
If the number of bits that are 1 is even, it&#x27;s an open space.
If the number of bits that are 1 is odd, it&#x27;s a wall.
*&#x2F;
function getThing(x,y) {
&#x2F;&#x2F;    console.log(x,y);
    let initialResult = (x*x) + (3*x) + (2*x*y) + y + (y*y);
    initialResult += MGR_FAV;
    &#x2F;&#x2F;http:&#x2F;&#x2F;stackoverflow.com&#x2F;a&#x2F;16155417&#x2F;52160
    let binaryVersion = (initialResult &gt;&gt;&gt; 0).toString(2);
    let bitCount = 0;
    for(let i=0;i&lt;binaryVersion.length;i++) {
        let char = binaryVersion.substr(i,1);
        if(char === &quot;1&quot;) bitCount++;
    }
    if(bitCount % 2 === 0) return &quot;.&quot;;
    return &quot;#&quot;;
}

function renderMaze(cells) {
    &#x2F;*
    for(let x=0;x&lt;cells.length;x++) {
        for(let y=0;y&lt;cells[x].length;y++) {
            process.stdout.write(cells[x][y]);
        }
        process.stdout.write(&#x27;\n&#x27;);
    }
    *&#x2F;
    for(let y=0;y&lt;cells[0].length;y++) {
        for(let x=0;x&lt;cells[y].length;x++) {
            process.stdout.write(cells[x][y]);
        }
        process.stdout.write(&#x27;\n&#x27;);        
    }
}
</code></pre>

Day 14
---

[Day 14](http://adventofcode.com/2016/day/14) seemed easy enough. Loop from 0 and create a hash of some salt plus the number. Look for 
3 matching characters in a row. Remember where you found it. Now keep looping and if you find the *same* character but with
5 in a row *and* if the previous match was within one thousand loops, you add it as a valid key. Once you hit 64 keys, stop.

I struggled like crazy with this because I missed an important detail. If you have found the 'closing' 5 character match, it can actually
'close' multiple earlier matches. Credit goes to some smart users on Reddit:  [the4ner](https://www.reddit.com/user/the4ner) and
[AustinVeolnaut](https://www.reddit.com/user/AustinVelonaut).

<pre><code class="language-javascript">
&#x2F;*
https:&#x2F;&#x2F;www.reddit.com&#x2F;r&#x2F;adventofcode&#x2F;comments&#x2F;5ioh1b&#x2F;2016_day_14_part_1_missing_something_stupid_im&#x2F;
credit goes to 
    https:&#x2F;&#x2F;www.reddit.com&#x2F;user&#x2F;the4ner
and
https:&#x2F;&#x2F;www.reddit.com&#x2F;user&#x2F;AustinVelonaut
*&#x2F;

var crypto = require(&#x27;crypto&#x27;);


let input = &#x27;qzyelonm&#x27;;
&#x2F;&#x2F;let input = &#x27;abc&#x27;;

let threeKeys = {};
let keys = [];

for(var i=0;i&lt;999999;i++) {
    let test = input + i;
    let hash = crypto.createHash(&#x27;md5&#x27;).update(test).digest(&#x27;hex&#x27;).toLowerCase();
    let matches5 = hash.match(&#x2F;(\w)(\1{% raw %}{4}{% endraw %})&#x2F;);

    if(matches5) {
        let match = matches5[0];
        let smatch = match.substr(0,3);

        if(threeKeys[smatch]) {

            let threeKey = threeKeys[smatch];

            for(var x=0;x&lt;threeKey.length;x++) {

                if(i - threeKey[x] &lt;= 1000) {
                    keys.push(threeKey[x]);
                    if(keys.length === 900) {

                        keys = keys.sort(function(a,b) {
                            if(a &gt; b) return 1;
                            if(a &lt; b) return -1;
                            return 0;
                        });
                        console.log(keys[63]);
                        process.exit();
                    }
                }
            }

            delete threeKeys[smatch];
        }
    }


    let matches = hash.match(&#x2F;(\w)(\1{% raw %}{2}{% endraw %})&#x2F;);
    if(matches) {
        let match = matches[0];
        if(!threeKeys[match]) {
            threeKeys[match] = [i];
        } else {
            threeKeys[match].push(i);
        }
    }

}
</code></pre>

Part 2 simply had you re-hash your hash 2017 times, which slowed things down quite a bit, but still returned an answer in about 5 minutes.
I saw folks on Reddit who did theirs a heck of a lot faster, but I was ok with five minutes.

<pre><code class="language-javascript">
var crypto = require(&#x27;crypto&#x27;);

let input = &#x27;qzyelonm&#x27;;
&#x2F;&#x2F;let input = &#x27;abc&#x27;;

let threeKeys = {};
let keys = [];

function makeHash(s) {
	for(var x=0;x&lt;2017;x++) {
		s = crypto.createHash(&#x27;md5&#x27;).update(s).digest(&#x27;hex&#x27;).toLowerCase();
	}
	return s;
}

for(var i=0;i&lt;999999;i++) {
    let test = input + i;
&#x2F;&#x2F;    let hash = crypto.createHash(&#x27;md5&#x27;).update(test).digest(&#x27;hex&#x27;).toLowerCase();
	let hash = makeHash(test);
	if(i % 2000 === 0) process.stdout.write(&#x27;#&#x27;);
    let matches5 = hash.match(&#x2F;(\w)(\1{% raw %}{4}{% endraw %})&#x2F;);

    if(matches5) {
        let match = matches5[0];
        let smatch = match.substr(0,3);

        if(threeKeys[smatch]) {

            let threeKey = threeKeys[smatch];

            for(var x=0;x&lt;threeKey.length;x++) {

                if(i - threeKey[x] &lt;= 1000) {
                    keys.push(threeKey[x]);
                    if(keys.length === 900) {

                        keys = keys.sort(function(a,b) {
                            if(a &gt; b) return 1;
                            if(a &lt; b) return -1;
                            return 0;
                        });
						process.stdout.write(&#x27;\n&#x27;);
                        console.log(keys[63]);
                        process.exit();
                    }
                }
            }

            delete threeKeys[smatch];
        }
    }


    let matches = hash.match(&#x2F;(\w)(\1{% raw %}{2}{% endraw %})&#x2F;);
    if(matches) {
        let match = matches[0];
        if(!threeKeys[match]) {
            threeKeys[match] = [i];
        } else {
            threeKeys[match].push(i);
        }
    }

}
</code></pre>

You can find my repo of solutions here: https://github.com/cfjedimaster/adventofcode