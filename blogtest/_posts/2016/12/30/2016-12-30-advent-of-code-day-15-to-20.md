---
layout: post
title: "Advent of Code - Day 15 to 20"
date: "2016-12-30T08:16:00-07:00"
categories: [development]
tags: [advent of code,javascript]
banner_image: 
permalink: /2016/12/30/advent-of-code-day-15-to-20
---

So yep - I definitely didn't finish Advent of Code before Christmas, but I'm mostly done (20 out of 25 days) and I plan to keep at it in the next week or so. This post will cover a bunch of days, so forgive the length!

Day 15
---

[Day 15](http://adventofcode.com/2016/day/15) had an interesting concept. Given a set of discs with holes in them that turn every second, at what point would you be able to drop a ball so that as it fell, it would always hit holes. The ball falls through one disc at a time, so you have to simulate the discs turning and the ball trying to fall over time. The solution involves finding out what time to drop the ball so it falls perfectly.

My solution was a brute force solution that was *very* slow:

<pre><code class="language-javascript">
let initTime = 0;

let input2 = `Disc #1 has 5 positions; at time=0, it is at position 4.
&#x2F;&#x2F;Disc #2 has 2 positions; at time=0, it is at position 1.`;
let input = `Disc #1 has 5 positions; at time=0, it is at position 2.
Disc #2 has 13 positions; at time=0, it is at position 7.
Disc #3 has 17 positions; at time=0, it is at position 10.
Disc #4 has 3 positions; at time=0, it is at position 2.
Disc #5 has 19 positions; at time=0, it is at position 9.
Disc #6 has 7 positions; at time=0, it is at position 0.`;

function initDiscs(s) {
	let discs = [];

	s.split(&#x27;\n&#x27;).forEach(function(i) {
		let parts = i.split(&#x27; &#x27;);
		let numpos = Number(parts[3]);
		let inipos = Number(parts[11].substr(0, parts[11].length-1));
		discs.push({% raw %}{name:parts[1], numpos:numpos, inipos:inipos, pos:inipos}{% endraw %});
	});

	return discs;

}

function moveDiscs(d) {
	d.forEach(function(disc) {
		disc.pos++;
		if(disc.pos == disc.numpos) disc.pos = 0;
		&#x2F;&#x2F;console.log(&#x27;Disc &#x27;+disc.name+&#x27; is at position &#x27;+disc.pos);
	});
	return d;
}


sanity = 0;
while(1) {

	discs = initDiscs(input);

	&#x2F;&#x2F;do initial moves
	for(x=0;x&lt;initTime;x++) {% raw %}{ discs = moveDiscs(discs); }{% endraw %}
	time = initTime++;
&#x2F;&#x2F;	console.log(&#x27;TESTING TIME &#x27;+time);
	if(time % 10000 === 0) process.stdout.write(&#x27;#&#x27;);
	let capsule = 0;

	done = false; 

	while(!done) {
		time++;
		discs = moveDiscs(discs);
&#x2F;&#x2F;		console.log(&#x27;At time &#x27;+time+&#x27; the capsule is at &#x27;+capsule);

		&#x2F;&#x2F;move the discs
		if(discs[capsule].pos === 0) {
&#x2F;&#x2F;			console.log(&#x27;i can fall&#x27;);
			capsule++;
			if(capsule === discs.length) {
				done = true;
				console.log(&#x27;\nSuccess for time &#x27;+(initTime-1));
				process.exit();
			}
		} else {
			done = true;
&#x2F;&#x2F;			console.log(&#x27;Failure for time &#x27;+(initTime-1));
		}

		sanity++;
		&#x2F;&#x2F;if(sanity &gt; 3) process.exit();
	}


}

&#x2F;&#x2F;right answer was 148737
</code></pre>

You'll notice the last line is a comment with the right answer. How did I get that? I cheated. This [Reddit post](https://www.reddit.com/r/adventofcode/comments/5ifn4v/2016_day_15_solutions/db7ttta/) points out that it can be solved with simple math. Insane. 

<pre><code class="language-javascript">
&#x2F;*
https:&#x2F;&#x2F;www.reddit.com&#x2F;r&#x2F;adventofcode&#x2F;comments&#x2F;5ifn4v&#x2F;2016_day_15_solutions&#x2F;db7ttta&#x2F;
*&#x2F;

function d1(t) {% raw %}{ return ((t+2) %{% endraw %} 5 == 0); };
function d2(t) {% raw %}{ return ((t+7) %{% endraw %} 13 == 0); };
function d3(t) {% raw %}{ return ((t+10) %{% endraw %} 17 == 0); };
function d4(t) {% raw %}{ return ((t+2) %{% endraw %} 3 == 0); };
function d5(t) {% raw %}{ return ((t+9) %{% endraw %} 19 == 0); };
function d6(t) {% raw %}{ return ((t+0) %{% endraw %} 7 == 0); };

let t = 0;
while(true) {
	if(
		d1(t+1) &amp;&amp;
		d2(t+2) &amp;&amp;
		d3(t+3) &amp;&amp;
		d4(t+4) &amp;&amp;
		d5(t+5) &amp;&amp;
		d6(t+6)
	) {
		console.log(t);
		process.exit();
	}
	t++;
}
</code></pre>

The second part of the day simply added another disc - so my solution simply took the above solution and added the additional logic. So yep - I cheated - but it was still cool.

Day 16
---

[Day 16](http://adventofcode.com/2016/day/16) was an easy one. Given an input string, you simply transform it in such a way that it grows to a certain point. When it hits that point, you generater a checksum that shrinks the string again. The second part simply changes the desired length. Here is my solution.

<pre><code class="language-javascript">
let input = &#x27;10001110011110000&#x27;;
&#x2F;&#x2F;let neededSize = 272;
let neededSize = 35651584;

let result = input;
while(result.length &lt;= neededSize) {
    result = doIt(result);
}

console.log(&#x27;Done with initial...&#x27;);
&#x2F;&#x2F;we only want neededSize

result = result.substr(0, neededSize);

console.log(&#x27;Checksum:&#x27;);
console.log(checkSum(result));

&#x2F;&#x2F;console.log(doIt(&#x27;111100001010&#x27;)==&#x27;1111000010100101011110000&#x27;);


function doIt(a) {
    let b = reverse(a);
    &#x2F;&#x2F;prob could be regex
    let newB = &#x27;&#x27;;
    for(let i=0;i&lt;b.length;i++) {
        let char = b.substr(i, 1);
        if(char === &#x27;1&#x27;) {
            newB += &#x27;0&#x27;;
        } else if(char === &#x27;0&#x27;) {
            newB += &#x27;1&#x27;;
        } else newB += char;
    }
    return a + &#x27;0&#x27; + newB;
}

function reverse(s) {
    let result = &#x27;&#x27;;
    for(let i=0;i&lt;s.length;i++) {
        result = s.substr(i,1) + result;
    }
    return result;
}

function checkSum(s) {
    let done = false;
    while(!done) { 
        let checksum = &#x27;&#x27;;
        for(var i=0;i&lt;s.length;i=i+2) {
            let set1 = s.substr(i,1);
            let set2 = s.substr(i+1,1);
            if(set1 === set2) checksum += &#x27;1&#x27;;
            else checksum += &#x27;0&#x27;; 
        }
        if(checksum.length % 2 === 1) {
            return checksum;
        } else {
            s = checksum;
        }
    }
}
</code></pre>

Day 17
---

[Day 17](http://adventofcode.com/2016/day/17) involves moving through a room where the possible allowed directions based on a hash of a path you've taken through the room. Yeah, weird. The first part involves just finding the shortest path.

<pre><code class="language-javascript">
var crypto = require(&#x27;crypto&#x27;);

function hash(s) {
    return crypto.createHash(&#x27;md5&#x27;).update(s).digest(&#x27;hex&#x27;);
}

let pos = {% raw %}{x:1, y:1}{% endraw %};

var input = &#x27;njfxhljp&#x27;;
let path = &#x27;&#x27;;

let sanity = 0;
let doIt = true;
while(doIt) {

    var h = hash(input);
    var dir = h.substr(0,4);
    console.log(dir);

    let doors = checkDoors(dir);
    console.log(doors);
    &#x2F;&#x2F; prefer R or D if we can
    if(doors.d &amp;&amp; pos.y &lt;=3) {
        console.log(&#x27;move down&#x27;);
        pos.y++;
        input += &#x27;D&#x27;;
        path += &#x27;D&#x27;;
    } else if(doors.r &amp;&amp; pos.x &lt;= 3) {
        console.log(&#x27;move right&#x27;);
        pos.x++;
        input += &#x27;R&#x27;;
        path += &#x27;R&#x27;;
    } else if(doors.u &amp;&amp; pos.y &gt; 1) {
        console.log(&#x27;move up&#x27;);
        pos.y--;
        input += &#x27;U&#x27;;
        path += &#x27;U&#x27;;
    } else if(doors.l &amp;&amp; pos.x &gt; 1) {
        console.log(&#x27;move left&#x27;);
        pos.x--;
        input += &#x27;L&#x27;;
        path += &#x27;L&#x27;;
    }

    &#x2F;&#x2F;are we at 4 4?
    if(pos.x === 4 &amp;&amp; pos.y === 4) {
        console.log(&#x27;WIN&#x27;);
        console.log(path);
        doIt = false;
    }

    sanity++; if(sanity &gt; 10) process.exit();
}

function checkDoors(s) {
    let u = s.substr(0,1);
    let d = s.substr(1,1);
    let l = s.substr(2,1);
    let r = s.substr(3,1);

    let result = {};
    result.u = isOpen(u);
    result.d = isOpen(d);
    result.l = isOpen(l);
    result.r = isOpen(r);
    return result;
}

function isOpen(x) {
    if(x === &#x27;b&#x27; {% raw %}|| x === &#x27;c&#x27; |{% endraw %}{% raw %}| x === &#x27;d&#x27; |{% endraw %}{% raw %}| x === &#x27;e&#x27; |{% endraw %}| x === &#x27;f&#x27;) return true;
    return false;
}
</code></pre>

The second part asks you to reverse this and find the longest path. I couldn't do it so I cheated again using this solution I could paste in my browser console: https://www.reddit.com/r/adventofcode/comments/5isvxv/2016_day_17_solutions/dbatx5a/

Day 18
---

[Day 18](http://adventofcode.com/2016/day/18) was another simple one. The concept is that you are in a room full of tiles and traps and you have to figure out how many safe tiles there are. You generate the room data by simply taking an initial string of room data and generating one line at a time, where each line is based on the last line. Simple! Part 2 just increases the number of lines.

<pre><code class="language-javascript">
&#x2F;&#x2F;let totalRows = 40;
&#x2F;&#x2F;part 2
let totalRows = 400000;

let input = &#x27;.^.^..^......^^^^^...^^^...^...^....^^.^...^.^^^^....^...^^.^^^...^^^^.^^.^.^^..^.^^^..^^^^^^.^^^..^&#x27;;

let room = [];

&#x2F;&#x2F;let input = &#x27;.^^.^.^^^^&#x27;;

room.push(input);

for(var i=0;i&lt;totalRows-1;i++) {

    let newRow = getRow(room[room.length-1]);
    room.push(newRow);
}

&#x2F;&#x2F;console.log(room);
let safeTiles = 0;
for(var i=0;i&lt;room.length;i++) {
    let row = room[i];
    for(var x=0;x&lt;row.length;x++) {
        let char = row.substr(x,1);
        if(char === &#x27;.&#x27;) safeTiles++;
    }
}
&#x2F;&#x2F;2047 is too high
console.log(safeTiles);

function getRow(input) {
    let newRow = &#x27;&#x27;;
    for(var i=0;i&lt;input.length;i++) {
        let left, center, right;
        if(i === 0) {
            left = &#x27;.&#x27;;
        } else {
            left = input.substr(i-1,1);
        }
        center = input.substr(i,1);
        if(i &lt; input.length -1) {
            right = input.substr(i+1,1);
        } else {
            right = &#x27;.&#x27;;
        }
&#x2F;&#x2F;        console.log(&#x27;for &#x27;+i+ &#x27; l=&#x27;+left+&#x27; c=&#x27;+center+&#x27; r=&#x27;+right);

        if(
            (left === &#x27;^&#x27; &amp;&amp; center === &#x27;^&#x27; &amp;&amp; right === &#x27;.&#x27;)
            ||
            (center === &#x27;^&#x27; &amp;&amp; right === &#x27;^&#x27; &amp;&amp; left === &#x27;.&#x27;)
            ||
            (left === &#x27;^&#x27; &amp;&amp; center === &#x27;.&#x27; &amp;&amp; right === &#x27;.&#x27;)
            ||
            (right === &#x27;^&#x27; &amp;&amp; left === &#x27;.&#x27; &amp;&amp; center === &#x27;.&#x27;)
        ) {
            newRow += &#x27;^&#x27;;
        } else {
            newRow += &#x27;.&#x27;;
        }

    }
    return newRow;
}
</code></pre>

Day 19
---

[Day 19](http://adventofcode.com/2016/day/19) involved simulating a game where elves sit in a circle and each elf takes the gifts of the person to their left. When you lose your gifts, you're taken out of the circle. The idea is to figure out which elf will get all the gifts. Part one was easy enough:

<pre><code class="language-javascript">
&#x2F;&#x2F;let numElves = 5;
let numElves = 3005290;
let elves = [];

for(var i=0;i&lt;numElves;i++) {
    elves[i] = 1;
}

let done = false;

let sanity = 0;
while(!done) {

    &#x2F;&#x2F;go around
    for(var i=0;i&lt;numElves;i++) {
        let nextElfPos;
&#x2F;&#x2F;        console.log(&#x27;Working with elf &#x27;+(i+1));
        if(elves[i] &gt; 0) {
            &#x2F;*
            if(i &lt; numElves-1) {
                nextElfPos = i+1;
            } else {
                nextElfPos = 0;
            }
            *&#x2F;
            &#x2F;&#x2F; nextElfPos is the next elf with presents

            if(i &lt; numElves-1) {
                nextElfPos = i+1;
            } else {
                nextElfPos = 0;
            }
            while(elves[nextElfPos] === 0) {
                nextElfPos++;
                if(nextElfPos == numElves) nextElfPos = 0;
            }

            elves[i] += elves[nextElfPos];
            elves[nextElfPos] = 0;
&#x2F;&#x2F;            console.log(&#x27;Took from elf &#x27;+(nextElfPos+1));
            if(elves[i] === numElves) {
                console.log(&#x27;Winner for &#x27;+(i+1));
                process.exit();
            }
        } else {
&#x2F;&#x2F;            console.log(&#x27;No presents, skipping.&#x27;);
        }            
    }
    sanity++;
    if(sanity &gt; 2000) {% raw %}{ console.log(&#x27;Abort&#x27;); process.exit(); }{% endraw %}
}
</code></pre>

Part two added the twist that instead of taking the gift from the elf next to you, you take the one "across" from you. Figuring out which elf to take from was incredibly difficult for me. My logic was:

        the elf across from me is:
            floor(len/2)+1 offset

When len is the number of elves. My solution tooked about 40 minutes to run and ended up giving the wrong answer. (I checked it into the repo anyway.) This [solution](https://www.reddit.com/r/adventofcode/comments/5j4lp1/2016_day_19_solutions/dbdhfsp/ ) from Reddit ran near instantly:

<pre><code class="language-javascript">
function solve(input) {
    let target = +input, pow = Math.pow(3, target.toString(3).length - 1)
    if (pow === target) return pow
    else if (pow &gt;= target &#x2F; 2) return target - pow
    else return pow + (2 * (target - 2 * pow))
}

console.log(solve(3005290));
</code></pre>

Some people are scary smart. 

Day 20
---

[Day 20](http://adventofcode.com/2016/day/20) seemed simple at first. Imagine you have a set of restricted numbers:

	0-2
	5-9
	4-8

Given that set, what is the first *allowed* number? You can see it is three. Your input is a huge set of ranges like this. My solution was to sort by the lower end of the range and then loop over the ranges creating a smaller set of ranges. For example, imagine:

	0-50
	30-90

You can rewrite that as 0-90. Now imagine:

	0-50
	51-60

That can be merged into 0-60. While this seems simple, this took me forever to get working right.

<pre><code class="language-javascript">
const fs = require(&#x27;fs&#x27;);
const input = fs.readFileSync(&#x27;.&#x2F;input.txt&#x27;,&#x27;utf8&#x27;);

let gates = [];
let lines = input.split(&#x27;\n&#x27;);

const MAX = 4294967295;

lines.forEach((l)=&gt;{
    let [min,max] = l.split(&#x27;-&#x27;);
    gates.push({% raw %}{min:Number(min), max:Number(max)}{% endraw %});
});

gates.sort(function(a, b) {
    if(a.min &lt; b.min) return -1;
    if(a.min &gt; b.min) return 1;
    return 0;
});

console.log(&#x27;len is &#x27;+gates.length);


&#x2F;&#x2F;simplify gates
for(var i=1;i&lt;gates.length;i++) {

    let thisGate = gates[i];
    let lastGate = gates[i-1];

    &#x2F;*
    imagine: 
    last 0-100
    this: 49-150

    we can say that&#x27;s the same as 0-150

    imagine:
    last 0-100
    this: 101-150 
    *&#x2F;
    if(
        (thisGate.min &gt; lastGate.min &amp;&amp; thisGate.min &lt; lastGate.max &amp;&amp; thisGate.max &gt; lastGate.max &amp;&amp; thisGate.max &lt;= MAX) 
        ||
        (thisGate.min-1 == lastGate.max &amp;&amp; thisGate.max &lt;= MAX)) {
        let newGate = {% raw %}{ min:lastGate.min, max:thisGate.max}{% endraw %};
        &#x2F;&#x2F; remove i
        gates[i-1] = newGate;
        gates.splice(i, 1);
        &#x2F;&#x2F;reset i
        i=0;
    }
}

console.log(&#x27;new len is &#x27;+gates.length);

&#x2F;&#x2F;console.log(&#x27;Winner=&#x27;+format(gates[0].max+1));
console.log(&#x27;Winner=&#x27;+(gates[0].max+1));

function format(r) {
    return new Intl.NumberFormat().format(r);
}
</code></pre>

Part two had you determining how many 'available' numbers were allowed.

<pre><code class="language-javascript">
const fs = require(&#x27;fs&#x27;);
const input = fs.readFileSync(&#x27;.&#x2F;input.txt&#x27;,&#x27;utf8&#x27;);

let gates = [];
let lines = input.split(&#x27;\n&#x27;);

const MAX = 4294967295;

lines.forEach((l)=&gt;{
    let [min,max] = l.split(&#x27;-&#x27;);
    gates.push({% raw %}{min:Number(min), max:Number(max)}{% endraw %});
});

gates.sort(function(a, b) {
    if(a.min &lt; b.min) return -1;
    if(a.min &gt; b.min) return 1;
    return 0;
});

console.log(&#x27;len is &#x27;+gates.length);


&#x2F;&#x2F;simplify gates
for(var i=1;i&lt;gates.length;i++) {

    let thisGate = gates[i];
    let lastGate = gates[i-1];

    &#x2F;*
    imagine: 
    last 0-100
    this: 49-150

    we can say that&#x27;s the same as 0-150

    imagine:
    last 0-100
    this: 101-150 
    *&#x2F;

    &#x2F;*
    if inside last one, just plain kill it
    *&#x2F;
    if(thisGate.min &gt; lastGate.min &amp;&amp; thisGate.max &lt; lastGate.max) {
        gates.splice(i, 1);
        &#x2F;&#x2F;reset i
        i=0;
    }
    else if(
        (thisGate.min &gt; lastGate.min &amp;&amp; thisGate.min &lt; lastGate.max &amp;&amp; thisGate.max &gt; lastGate.max &amp;&amp; thisGate.max &lt;= MAX) 
        ||
        (thisGate.min-1 == lastGate.max &amp;&amp; thisGate.max &lt;= MAX)) {
        let newGate = {% raw %}{ min:lastGate.min, max:thisGate.max}{% endraw %};
        &#x2F;&#x2F; remove i
        gates[i-1] = newGate;
        gates.splice(i, 1);
        &#x2F;&#x2F;reset i
        i=0;
    }
}

console.log(&#x27;new len is &#x27;+gates.length);
let allowed = 0;
for(var i=1;i&lt;gates.length;i++) {
    if(gates[i].min &gt; gates[i-1].max) {
        &#x2F;&#x2F;console.log(gates[i], gates[i-1],gates[i].min-gates[i-1].max);
        allowed += gates[i].min - gates[i-1].max - 1;
    }
}
&#x2F;&#x2F; 6460818460 is too much
console.log(allowed);

function format(r) {
    return new Intl.NumberFormat().format(r);
}

</code></pre>

Whew! Only five more days to solve. If I can solve two of them without cheating I'll consider myself lucky.

You can find my repo of solutions here: https://github.com/cfjedimaster/adventofcode