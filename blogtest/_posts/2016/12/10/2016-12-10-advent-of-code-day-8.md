---
layout: post
title: "Advent of Code - Day 8"
date: "2016-12-10T09:04:00-07:00"
categories: [development]
tags: [advent of code,javascript]
banner_image: 
permalink: /2016/12/10/advent-of-code-day-8
---

Yes - I'm falling behind, but let's just pretend today is still the 8th. [Day 8](http://adventofcode.com/2016/day/8) was a difficult one (I feel like I'm saying that more and more) as it required working with 2D arrays, something I always have trouble with. Specifically - you needed to represent a 2D array of cells on a screen. You then had to take input in the form of:

* rect AxB - which would turn on lights in a rectangle A wide and B high in the upper left corner of the screen.
* rotate row y=A by B - which "rotates" lights in row A B steps lower. You have to handle wrapping too as a light that 'falls off' the bottom then returns to the top.
* rotate column x=A by B - same concept, but in a column.

The answer to this puzzle would simply be the number of lit lights.

The rect part was trivial, but the rotation took me forever. I figured out that given an set of values like so:

	ABCDE

and wanting to rotate by, let's say 2, you could create a new set by starting on the third letter and selecting from the original set until you get to the end, and then wrap around, so:

	CDEAB

As I've said many times before, using their sample input/output was a huge help. In this case, it helped so much that when I switched from the sample input to the real input, my code returned the right answer immediately!

(I have to admit though, this one was so difficult I contemplated cheating. When you enter a numeric answer in Advent of Code, it usually tells if it is too high or too low. So in theory, I could have gotten the max number of lights and then began guessing by supplying a number half-way through the range and just narrowing it down.)

Here is my solution:

<pre><code class="language-javascript">
&#x2F;&#x2F;screen size
let width = 50;
let height = 6;
let screen = seedScreen(width,height);

renderScreen(screen, width, height);
&#x2F;*
let input = &#x27;rect 3x2&#x27;;
screen = parseInput(screen, input);
renderScreen(screen, width, height);

console.log(&#x27;NOW DO COL&#x27;);
screen = parseInput(screen, &#x27;rotate column x=1 by 1&#x27;);
renderScreen(screen, width, height);

console.log(&#x27;NOW DO RECT&#x27;);

screen = parseInput(screen, &#x27;rotate row y=0 by 4&#x27;);
renderScreen(screen, width, height);

console.log(&#x27;NOW DO COL&#x27;);
screen = parseInput(screen, &#x27;rotate column x=1 by 1&#x27;);
renderScreen(screen, width, height);
*&#x2F;

const fs = require(&#x27;fs&#x27;);
const input = fs.readFileSync(&#x27;.&#x2F;input.txt&#x27;,&#x27;utf8&#x27;);

let good = 0;
let lines = input.split(&#x27;\n&#x27;);
lines.forEach(function(line) {
	screen = parseInput(screen, line);
	renderScreen(screen, width, height);
});

let total = getTotal(screen);
console.log(total);

function getTotal(s) {
	let total = 0;
	for(let x=0;x&lt;s.length;x++) {
		for(let y=0;y&lt;s[x].length;y++) {
			if(s[x][y] === &quot;#&quot;) total++;
		}
	}
	return total;
}

function parseInput(screen, i) {
	if(i.indexOf(&#x27;rect&#x27;) === 0) {
		let dim = i.split(&#x27; &#x27;)[1];
		let width = dim.split(&#x27;x&#x27;)[0];
		let height = dim.split(&#x27;x&#x27;)[1];
		return drawRect(screen, width, height);
	}

	&#x2F;&#x2F;	rotate row y=A by B
	if(i.indexOf(&#x27;rotate row&#x27;) === 0) {
		let dim = i.split(&#x27; row y=&#x27;)[1];
		let row = Number(dim.split(&#x27; by &#x27;)[0]);
		let offset = Number(dim.split(&#x27; by &#x27;)[1]);
		return rotateRow(screen, width, height, row, offset);
	}

	&#x2F;&#x2F;	otate column x=1 by 1
	if(i.indexOf(&#x27;rotate column&#x27;) === 0) {
		let dim = i.split(&#x27; column x=&#x27;)[1];
		let col = Number(dim.split(&#x27; by &#x27;)[0]);
		let offset = Number(dim.split(&#x27; by &#x27;)[1]);
		return rotateColumn(screen, width, height, col, offset);
	}

	throw(&#x27;Unknown command: &#x27;+i);
}

function rotateColumn(s, w, h, c, o) {
	&#x2F;&#x2F;##.  =&gt; .## (1)
	&#x2F;&#x2F;##. =&gt; #.# (2)
	let originalCol = s[c];
&#x2F;&#x2F;	console.log(&#x27;offset is &#x27;+o);
&#x2F;&#x2F;	console.log(&#x27;origCol=&#x27;+originalCol.join(&#x27;&#x27;));
	let newCol = [];
	for(let x=0;x&lt;originalCol.length;x++) {
		let thisVal = originalCol[x];
		let newPos = x + o;
&#x2F;&#x2F;		console.log(&#x27;thisVal=&#x27;+thisVal+&#x27; newPos=&#x27;+newPos);
		if(newPos &gt;= originalCol.length) newPos =  newPos - originalCol.length;
&#x2F;&#x2F;		console.log(&#x27; newPos=&#x27;+newPos);
		newCol[newPos] = thisVal;
	}
&#x2F;&#x2F;	console.log(&#x27;newCol=&#x27;+newCol);
	s[c] = newCol;
	return s;
}

function rotateRow(s, w, h, r, o) {
	&#x2F;*
	so given ##00# and offset of 2, 
	we make a new list starting at 2. 
	#00##
	*&#x2F;
	let originalRow = [];
    for(let x=0;x&lt;w;x++) {
        for(let i=0;i&lt;h;i++) {
			if(i === r) {
				originalRow.push(s[x][i]);
			}
        }
    }
&#x2F;&#x2F;	console.log(&#x27;or: &#x27;+originalRow.join(&#x27;&#x27;)+&#x27;-&#x27;);
	let newRow = [];
	let done = 0;
	&#x2F;&#x2F;because:
	o++;
	for(let x = o; x &lt; o+originalRow.length; x++) {
		let pos = x;
&#x2F;&#x2F;		console.log(&#x27;trying to set &#x27;+pos);
		if(pos &gt; w) pos = pos-w;
&#x2F;&#x2F;		console.log(&#x27;really &#x27;+pos);
&#x2F;&#x2F;		newRow.push(originalRow[x]);
&#x2F;&#x2F;console.log(&#x27;val to set is &#x27;+originalRow[done]);
		newRow[pos-1] = originalRow[done];
		done++;
&#x2F;&#x2F;		console.log(&#x27;new Row len is now &#x27;+newRow.length);
	}
&#x2F;&#x2F;	console.log(&#x27;newRow: &#x27;+newRow.join(&#x27;&#x27;));
    for(let x=0;x&lt;w;x++) {
        for(let i=0;i&lt;h;i++) {
			if(i === r) {
				s[x][i] = newRow[x];
			}
        }
    }

	return s;
	
}

function drawRect(s,w,h) {
	console.log(&#x27;going to draw &#x27;+w+&#x27;,&#x27;+h);
	for(let i=0;i&lt;w;i++) {
		for(let x=0;x&lt;h;x++) {
			s[i][x] = &quot;#&quot;;
		} 
	}
	return s;
}

function seedScreen(w,h) {
    let screen = [];
    for(let i=0;i&lt;w;i++) {
        for(let x=0;x&lt;h;x++) {
            &#x2F;&#x2F;console.log(&#x27;setting s[&#x27;+i+&#x27;][&#x27;+x+&#x27;]&#x27;);
            if(!screen[i]) screen[i] = [];
            screen[i][x] = &quot;.&quot;;
        }
    }
    return screen;
}

function renderScreen(s,width,height) {
    var result = &#x27;&#x27;;
    for(let x=0;x&lt;height;x++) {
        for(let i=0;i&lt;width;i++) {
            result += s[i][x];
        }
        result += &#x27;\n&#x27;;
    }
    console.log(result);
}
</code></pre>

Notice the `renderScreen` function. I built this to help me debug and it was a fortuitous decision. I noticed when I rendered the 'real' input, the output was a set of letters. Part two to the puzzle was to simply input those letters. Here is what my output looked like:

![Text output](https://static.raymondcamden.com/images/2016/12/aoc1.png)

You can find my repo of solutions here: https://github.com/cfjedimaster/adventofcode