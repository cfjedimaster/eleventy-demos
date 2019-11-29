---
layout: post
title: "Some Canvas Experiments"
date: "2011-11-16T16:11:00+06:00"
categories: [html5,javascript,jquery]
tags: []
banner_image: 
permalink: /2011/11/16/Some-Canvas-Experiments
guid: 4436
---

I spent some time yesterday reading an excellent article on a simple Canvas-based version of the old Snake game: <a href="http://www.netmagazine.com/tutorials/create-mobile-version-snake-html5-canvas-and-javascript">Create a mobile version of Snake with HTML5 canvas and JavaScript</a>. This article, by Eoin McGrath, does a great job explaining how he used Canvas to animate the game. (If you've never played Snake before, think Tron light cycles, single player, and not as cool.) I've been meaning to work on some simple games with Canvas, and while there are some very cool frameworks out there (<a href="http://easeljs.com/">EaselJS</a> and <a href="http://impactjs.com/">Impact</a> for example), I wanted to play around a bit with the raw code before I started punting some of the grunt work to other libraries. What follows is a series of experiments based on McGrath's core code set. Be gentle - this is my first time.

<p/>
<!--more-->
I began by creating a ball that would bounce around. I know - not rocket science. McGrath's original code animated the snake and had it die as soon as it hit a wall. For my logic I needed to simply make the ball bounce. Here's the code for version 1:

<p>

<code>
&lt;!DOCTYPE HTML&gt;
&lt;html&gt;
	
	&lt;head&gt;
		&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
		&lt;script&gt;
		$(document).ready(function() {

			var canvas = $("#gamearea")[0];
			canvas.width = 400;
			canvas.height = 400;
			var ctx = canvas.getContext("2d");


		    var draw = {
		        clear: function () {
		            ctx.clearRect(0, 0, canvas.width, canvas.height);
		        },    
		 
		        rect: function (x, y, w, h, col) {
		            ctx.fillStyle = col;
		            ctx.fillRect(x, y, w, h);
		        },
		       
		      circle: function (x, y, radius, col) {
		          ctx.fillStyle = col;
		          ctx.beginPath();
		          ctx.arc(x, y, radius, 0, Math.PI*2, true);
		          ctx.closePath();
		          ctx.fill();
		      },
		 
		        text: function (str, x, y, size, col) {
		            ctx.font = 'bold ' + size + 'px monospace';
		            ctx.fillStyle = col;
		            ctx.fillText(str, x, y);
		        }
		    };

			var ballOb = function() {

				this.init = function() {
					this.speed = 8;
					this.x = 19;
					this.y = 89;
					this.w = this.h = 10;
					this.col = "darkgreen";
					this.xdir = this.ydir = 1;
				}

				this.move = function() {

					if ((this.x-this.w) &lt; 0 || this.x &gt; (canvas.width - this.w)) this.xdir*=-1;
					if ((this.y-this.w) &lt; 0 || this.y &gt; (canvas.height - this.h)) this.ydir*=-1;
					
					this.x += (this.xdir * this.speed);
				    this.y += (this.ydir * this.speed);
			
				}

				this.draw = function () {
					draw.circle(this.x, this.y, this.w, this.col);
				}
				

			}

			var ball = new ballOb();
			ball.init();
			
			function loop() {
				draw.clear();
				ball.move();
				ball.draw();
			}
		
			setInterval(loop, 30);
		})
		&lt;/script&gt;
	&lt;/head&gt;
	
	&lt;body&gt;
		&lt;canvas id="gamearea" style="background-color:red"&gt;&lt;/canvas&gt;
		
	&lt;/body&gt;
	
&lt;/html&gt;
</code>

<p>

You can demo this here: <a href="http://www.raymondcamden.com/demos/2011/nov/15_2/index.html">http://www.coldfusionjedi.com/demos/2011/nov/15_2/index.html</a>. Notice the wall hit isn't exactly perfect. I made it a bit better as I went on. I apologize for the horrible color schemes. I wanted something <i>very</i> clear to see. 

<p>

In the next iteration, I added a paddle object and added event listeners so I could move the paddle:

<p>

<code>
&lt;!DOCTYPE HTML&gt;
&lt;html&gt;
	
	&lt;head&gt;
		&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
		&lt;script&gt;
		var ball;
		var paddle;

		$(document).ready(function() {

			
			var canvas = $("#gamearea")[0];
			canvas.width = 400;
			canvas.height = 400;
			var ctx = canvas.getContext("2d");
			var input = {
				left: false,
				right: false
			};

			$(window).keydown(function(e) {
		       switch (e.keyCode) {
		            case 37: input.left = true; break;                            
		            case 39: input.right = true; break;                            
		       } 
			});

			$(window).keyup(function(e) {
		       switch (e.keyCode) {
		            case 37: input.left = false; break;                            
		            case 39: input.right = false; break;                            
		       } 
			});
	

		    var draw = {
		        clear: function () {
		            ctx.clearRect(0, 0, canvas.width, canvas.height);
		        },    
		 
		        rect: function (x, y, w, h, col) {
		            ctx.fillStyle = col;
		            ctx.fillRect(x, y, w, h);
		        },
		       
		      circle: function (x, y, radius, col) {
		          ctx.fillStyle = col;
		          ctx.beginPath();
		          ctx.arc(x, y, radius, 0, Math.PI*2, true);
		          ctx.closePath();
		          ctx.fill();
		      },
		 
		        text: function (str, x, y, size, col) {
		            ctx.font = 'bold ' + size + 'px monospace';
		            ctx.fillStyle = col;
		            ctx.fillText(str, x, y);
		        }
		    };

			var ballOb = function() {

				this.init = function() {
					this.speed = 8;
					this.x = 19;
					this.y = 89;
					this.w = this.h = 10;
					this.col = "darkgreen";
					this.xdir = this.ydir = 1;
				}

				this.move = function() {

					if (this.x &lt; 0 || this.x &gt; (canvas.width-this.w)) this.xdir*=-1;
					if (this.y &lt; 0 || this.y &gt; (canvas.height-this.h)) this.ydir*=-1;
					
					this.x += (this.xdir * this.speed);
				    this.y += (this.ydir * this.speed);
					
					//handle hitting the edge
					if(this.x-this.w &lt; 0) {% raw %}{ this.x = 0+this.w; this.xdir=1 }{% endraw %}
					if(this.x+this.w &gt; canvas.width) {% raw %}{ this.x = canvas.width-this.w; this.xdir= -1 }{% endraw %}
					if(this.y-this.w &lt; 0) {% raw %}{ this.y = 0+this.w; this.ydir=1 }{% endraw %}					
					if(this.y+this.w &gt; canvas.height) {% raw %}{ this.y = canvas.height-this.w; this.ydir=-1 }{% endraw %}			
				}

				this.draw = function () {
					draw.circle(this.x, this.y, this.w, this.col);
				}
				

			}

			var paddleOb = function() {

				this.init = function() {
					this.speed = 8;
					this.w = 0.25 * canvas.width;
					this.h = 20;
					this.x = 10;
					this.y = canvas.height - this.h - 10;
					this.col = "white";
					//this.xdir = this.ydir = 1;
				}

				this.move = function() {
					if(input.left) {
						this.x -= this.speed;
						if(this.x &lt; 0) this.x=0;
					}
					if(input.right) {
						this.x += this.speed;
						if((this.x+this.w) &gt; canvas.width) this.x=canvas.width-this.w;
					}
				}

				this.draw = function () {
					draw.rect(this.x, this.y, this.w, this.h,this.col);
				}
				

			}
			
			ball = new ballOb();
			ball.init();
			
			paddle = new paddleOb();
			paddle.init();
			
			function loop() {
				draw.clear();
				ball.move();
				ball.draw();
				paddle.draw();
				paddle.move();
			}
		
			setInterval(loop, 30);
		})
		&lt;/script&gt;
	&lt;/head&gt;
	
	&lt;body&gt;
		&lt;canvas id="gamearea" style="background-color:red"&gt;&lt;/canvas&gt;
		
	&lt;/body&gt;
	
&lt;/html&gt;
</code>

<p>

And here is the demo: <a href="http://www.coldfusionjedi.com/demos/2011/nov/15_2/index2.html">http://www.coldfusionjedi.com/demos/2011/nov/15_2/index2.html</a>. Note that this version has better detection for hitting the walls. 

<p>

So next I added support for noticing when I hit the paddle and keeping score. Nothing too crazy - just a call to the collides method McGrath created for this own game.

<p>

<code>
&lt;!DOCTYPE HTML&gt;
&lt;html&gt;
	
	&lt;head&gt;
		&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
		&lt;script&gt;
		var ball;
		var paddle;

		$(document).ready(function() {

			
			var canvas = $("#gamearea")[0];
			canvas.width = 400;
			canvas.height = 400;
			var score = 0;
			
			var ctx = canvas.getContext("2d");
			var input = {
				left: false,
				right: false
			};

			$(window).keydown(function(e) {
		       switch (e.keyCode) {
		            case 37: input.left = true; break;                            
		            case 39: input.right = true; break;                            
		       } 
			});

			$(window).keyup(function(e) {
		       switch (e.keyCode) {
		            case 37: input.left = false; break;                            
		            case 39: input.right = false; break;                            
		       } 
			});
	

		    var draw = {
		        clear: function () {
		            ctx.clearRect(0, 0, canvas.width, canvas.height);
		        },    
		 
		        rect: function (x, y, w, h, col) {
		            ctx.fillStyle = col;
		            ctx.fillRect(x, y, w, h);
		        },
		       
		      circle: function (x, y, radius, col) {
		          ctx.fillStyle = col;
		          ctx.beginPath();
		          ctx.arc(x, y, radius, 0, Math.PI*2, true);
		          ctx.closePath();
		          ctx.fill();
		      },
		 
		        text: function (str, x, y, size, col) {
		            ctx.font = 'bold ' + size + 'px monospace';
		            ctx.fillStyle = col;
		            ctx.fillText(str, x, y);
		        }
		    };

			var ballOb = function() {

				this.init = function() {
					this.speed = 8;
					this.x = 19;
					this.y = 89;
					this.w = this.h = 10;
					this.col = "darkgreen";
					this.xdir = this.ydir = 1;
				}

				this.move = function() {

					if (this.x &lt; 0 || this.x &gt; (canvas.width-this.w)) this.xdir*=-1;
					if (this.y &lt; 0 || this.y &gt; (canvas.height-this.h)) this.ydir*=-1;
					
					this.x += (this.xdir * this.speed);
				    this.y += (this.ydir * this.speed);
					
					//handle hitting the edge
					if(this.x-this.w &lt; 0) {% raw %}{ this.x = 0+this.w; this.xdir=1 }{% endraw %}
					if(this.x+this.w &gt; canvas.width) {% raw %}{ this.x = canvas.width-this.w; this.xdir= -1 }{% endraw %}
					if(this.y-this.w &lt; 0) {% raw %}{ this.y = 0+this.w; this.ydir=1 }{% endraw %}					
					if(this.y+this.w &gt; canvas.height) {% raw %}{ this.y = canvas.height-this.w; this.ydir=-1; score++ }{% endraw %}	
					
					//handle hitting paddle
					if(this.collides(paddle)) this.ydir = -1;		
				}

				this.draw = function () {
					draw.circle(this.x, this.y, this.w, this.col);
				}

				this.collides = function(obj) {
				
					// this sprite's rectangle
					this.left = this.x;
					this.right = this.x + this.w;
					this.top = this.y;
					this.bottom = this.y + this.h;
					
					// other object's rectangle
					// note: we assume that obj has w, h, w & y properties
					obj.left = obj.x;
					obj.right = obj.x + obj.w;
					obj.top = obj.y;
					obj.bottom = obj.y + obj.h;
					
					// determine if not intersecting
					if (this.bottom &lt; obj.top) {% raw %}{ return false; }{% endraw %}
					if (this.top &gt; obj.bottom) {% raw %}{ return false; }{% endraw %}
					
					if (this.right &lt; obj.left) {% raw %}{ return false; }{% endraw %}
					if (this.left &gt; obj.right) {% raw %}{ return false; }{% endraw %}
					
					// otherwise, it's a hit
					return true;
				};
						

			}

			var paddleOb = function() {

				this.init = function() {
					this.speed = 8;
					this.w = 0.25 * canvas.width;
					this.h = 20;
					this.x = 10;
					this.y = canvas.height - this.h - 10;
					this.col = "white";
					//this.xdir = this.ydir = 1;
				}

				this.move = function() {
					if(input.left) {
						this.x -= this.speed;
						if(this.x &lt; 0) this.x=0;
					}
					if(input.right) {
						this.x += this.speed;
						if((this.x+this.w) &gt; canvas.width) this.x=canvas.width-this.w;
					}
				}

				this.draw = function () {
					draw.rect(this.x, this.y, this.w, this.h,this.col);
				}
				

			}
			
			ball = new ballOb();
			ball.init();
			
			paddle = new paddleOb();
			paddle.init();
			
			function loop() {
				draw.clear();
				ball.move();
				ball.draw();
				paddle.draw();
				paddle.move();
				draw.text("Score: "+score, 10, 20, 20);
			}
		
			setInterval(loop, 30);
		})
		&lt;/script&gt;
	&lt;/head&gt;
	
	&lt;body&gt;
		&lt;canvas id="gamearea" style="background-color:red"&gt;&lt;/canvas&gt;
		
	&lt;/body&gt;
	
&lt;/html&gt;
</code>

<p>

And this demo may be found here: <a href="http://www.coldfusionjedi.com/demos/2011/nov/15_2/index3.html">http://www.coldfusionjedi.com/demos/2011/nov/15_2/index3.html</a>

<p>

I then got mean and built this one: <a href="http://www.coldfusionjedi.com/demos/2011/nov/15_2/index4.html">http://www.coldfusionjedi.com/demos/2011/nov/15_2/index4.html</a> Don't click. Seriously. I warned you. 

<p>

Finally I went the extra step of doing a Google search and making the graphics not quite so ugly. 

<p>

<code>
&lt;!DOCTYPE HTML&gt;
&lt;html&gt;
	
	&lt;head&gt;
		&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
		&lt;script&gt;
		var ball;
		var paddle;

		$(document).ready(function() {

			
			var canvas = $("#gamearea")[0];
			canvas.width = 400;
			canvas.height = 400;
			var score = 0;
			
			var ctx = canvas.getContext("2d");
			var input = {
				left: false,
				right: false
			};

			$(window).keydown(function(e) {
		       switch (e.keyCode) {
		            case 37: input.left = true; break;                            
		            case 39: input.right = true; break;                            
		       } 
			});

			$(window).keyup(function(e) {
		       switch (e.keyCode) {
		            case 37: input.left = false; break;                            
		            case 39: input.right = false; break;                            
		       } 
			});
	

		    var draw = {
		        clear: function () {
		            ctx.clearRect(0, 0, canvas.width, canvas.height);
		        },    
		 
		        rect: function (x, y, w, h, col) {
		            ctx.fillStyle = col;
		            ctx.fillRect(x, y, w, h);
		        },
		       
		      circle: function (x, y, radius, col) {
		          ctx.fillStyle = col;
		          ctx.beginPath();
		          ctx.arc(x, y, radius, 0, Math.PI*2, true);
		          ctx.closePath();
		          ctx.fill();
		      },
		 
		        text: function (str, x, y, size, col) {
		            ctx.font = 'bold ' + size + 'px monospace';
		            ctx.fillStyle = col;
		            ctx.fillText(str, x, y);
		        }
		    };

			var ballOb = function() {

				this.init = function() {
					this.speed = 10;
					this.x = 19;
					this.y = 89;
					this.w = this.h = 10;
					this.col = "green";
					this.xdir = this.ydir = 1;
				}

				this.move = function() {

					if (this.x &lt; 0 || this.x &gt; (canvas.width-this.w)) this.xdir*=-1;
					if (this.y &lt; 0 || this.y &gt; (canvas.height-this.h)) this.ydir*=-1;
					
					this.x += (this.xdir * this.speed);
				    this.y += (this.ydir * this.speed);
					
					//handle hitting the edge
					if(this.x-this.w &lt; 0) {% raw %}{ this.x = 0+this.w; this.xdir=1 }{% endraw %}
					if(this.x+this.w &gt; canvas.width) {% raw %}{ this.x = canvas.width-this.w; this.xdir= -1 }{% endraw %}
					if(this.y-this.w &lt; 0) {% raw %}{ this.y = 0+this.w; this.ydir=1 }{% endraw %}					
					if(this.y+this.w &gt; canvas.height) {% raw %}{ this.y = canvas.height-this.w; this.ydir=-1; score++ }{% endraw %}	
					
					//handle hitting paddle
					if(this.collides(paddle)) this.ydir = -1;		
				}

				this.draw = function () {
					draw.circle(this.x, this.y, this.w, this.col);
				}

				this.collides = function(obj) {
				
					// this sprite's rectangle
					this.left = this.x;
					this.right = this.x + this.w;
					this.top = this.y;
					this.bottom = this.y + this.h;
					
					// other object's rectangle
					// note: we assume that obj has w, h, w & y properties
					obj.left = obj.x;
					obj.right = obj.x + obj.w;
					obj.top = obj.y;
					obj.bottom = obj.y + obj.h;
					
					// determine if not intersecting
					if (this.bottom &lt; obj.top) {% raw %}{ return false; }{% endraw %}
					if (this.top &gt; obj.bottom) {% raw %}{ return false; }{% endraw %}
					
					if (this.right &lt; obj.left) {% raw %}{ return false; }{% endraw %}
					if (this.left &gt; obj.right) {% raw %}{ return false; }{% endraw %}
					
					// otherwise, it's a hit
					return true;
				};
						

			}

			var paddleOb = function() {

				this.init = function() {
					this.speed = 8;
					this.w = 0.25 * canvas.width;
					this.h = 20;
					this.x = 10;
					this.y = canvas.height - this.h - 10;
					this.col = "white";
					//this.xdir = this.ydir = 1;
				}

				this.move = function() {
					if(input.left) {
						this.x -= this.speed;
						if(this.x &lt; 0) this.x=0;
					}
					if(input.right) {
						this.x += this.speed;
						if((this.x+this.w) &gt; canvas.width) this.x=canvas.width-this.w;
					}
				}

				this.draw = function () {
					draw.rect(this.x, this.y, this.w, this.h,this.col);
				}
				

			}
			
			ball = new ballOb();
			ball.init();
			
			paddle = new paddleOb();
			paddle.init();
			
			function loop() {
				draw.clear();
				ball.move();
				ball.draw();
				paddle.draw();
				paddle.move();
				draw.text("Score: "+score, 10, 20, 20);
			}
		
			setInterval(loop, 30);
		})
		&lt;/script&gt;
	&lt;/head&gt;
	
	&lt;body&gt;
		&lt;canvas id="gamearea" style="background:url(brick.jpg)"&gt;&lt;/canvas&gt;
		&lt;p&gt;
		Brick wall picture credit: &lt;a href="http://www.flickr.com/photos/richard_wasserman/5510266273/"&gt;Nutch Bicer&lt;/a&gt;
		&lt;/p&gt;
	&lt;/body&gt;
	
&lt;/html&gt;
</code>

<p>

You can find this final demo here: <a href="http://www.coldfusionjedi.com/demos/2011/nov/15_2/index5.html">http://www.coldfusionjedi.com/demos/2011/nov/15_2/index5.html</a>.

<p>

Enjoy. I've got an idea for a simple zombie game name. Yes - I love my job. I <i>really</i> love my job.