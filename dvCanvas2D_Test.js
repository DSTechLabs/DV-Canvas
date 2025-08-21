//=============================================================================
//
//     FILE  : dvCanvas2D_Test.js
//
//   PROJECT : Data Visualization Widget Support
//
//  FUNCTION : Testing of the dvCanvas2D class
//
//   AUTHOR  : Bill Daniels
//             Copyright 2023, D+S Tech Labs, Inc.
//             All Rights Reserved
//
//=============================================================================


// Create a dvCanvas2D object and add its canvas element to the canvas2Ddiv
const myCanvas2D = new dvCanvas2D (1024, 768);
document.getElementById ("canvas2Ddiv").append (myCanvas2D.canvas);


//--- Globals -----------------------------------------------------------------

const ccx      = myCanvas2D.cWidth/2;
const ccy      = myCanvas2D.cHeight/2;
const endCaps  = [ "butt", "round", "square" ];
const joints   = [ "round", "bevel", "miter" ];
let   interval = undefined;  // for interval timers
let   keyDown  = undefined;  // for keydown event listener

//--- Random integer, float, width, height, color, etc. -----------------------

function randFloat    (min, max) { return (max-min) * Math.random() + min;                           }
function randInt      (min, max) { return Math.round (randFloat (min, max));                         }
function randBin      ()         { return (randInt(0, 1) == 0);                                      }
function rand2DWidth  ()         { return randInt (0, myCanvas2D.cWidth);                            }
function rand2DHeight ()         { return randInt (0, myCanvas2D.cHeight);                           }
function randAngle    ()         { return randFloat (0, 360);                                        }
function randColor    ()         { return "#" + randInt (0, 16777216).toString(16).padStart(6, '0'); }
function randGradient (x1, y1, x2, y2)
{
  const grad = myCanvas2D.cc.createLinearGradient(x1, y1, x2, y2);
  grad.addColorStop(0.0, randColor());
  grad.addColorStop(0.5, randColor());
  grad.addColorStop(1.0, randColor());
  return grad;
}

function isTrans () { return document.getElementById("cb_transparent").checked; }
function isGrad  () { return document.getElementById("cb_gradient"   ).checked; }


//--- reset -------------------------------------------------------------------

function reset ()
{
  // Clear interval timer and keydown event listener, if any
  if (interval != undefined) { clearInterval (interval); interval = undefined; }
  if (keyDown  != undefined) { removeEventListener (keyDown, 'keyDown'); keyDown = undefined; }

  // Reset the canvas
  myCanvas2D.reset ();

  // Check if transparency is checked
  if (isTrans()) myCanvas2D.cc.globalAlpha = 0.3;
}

//=============================================================================
//  App Button Functions
//=============================================================================

//--- test_TestBounds ---------------------------------------------------------

let drawn = false;
function test_TestBounds ()
{
  if (drawn)
  {
    myCanvas2D.clear ();
    drawn = false;
  }
  else
  {
    myCanvas2D.drawLine (0, 0, 0, myCanvas2D.cHeight, "#FFFF00");
    myCanvas2D.drawLine (myCanvas2D.cWidth-1, 0, myCanvas2D.cWidth-1, myCanvas2D.cHeight, "#FFFF00");

    myCanvas2D.drawLine (0, 0, myCanvas2D.cWidth-1, 0, "#FFFF00");
    myCanvas2D.drawLine (0, myCanvas2D.cHeight-1, myCanvas2D.cWidth-1, myCanvas2D.cHeight-1, "#FFFF00");

    drawn = true;
  }
}

//--- test_drawPixel ----------------------------------------------------------

function test_drawPixel ()
{
  // Reset this demo
  reset();

  // Draw it
  for (let i=0; i<1000; i++)
    myCanvas2D.drawPixel (rand2DWidth(), rand2DHeight(), randColor());
}

//--- test_drawPoint ----------------------------------------------------------

function test_drawPoint ()
{
  // Reset this demo
  reset();

  // Non-filled points
  for (let i=0; i<100; i++)
    myCanvas2D.drawPoint (rand2DWidth(), rand2DHeight(), randInt(1,20), randColor(), randBin() ? fill : randInt(1,10));
}

//--- test_drawLine -----------------------------------------------------------

function test_drawLine ()
{
  // Reset this demo
  reset();

  // Draw it
  for (let i=0; i<50; i++)
  {
    const x1 = rand2DWidth  ();
    const y1 = rand2DHeight ();
    const x2 = rand2DWidth  ();
    const y2 = rand2DHeight ();
    const c  = isGrad() ? randGradient(x1, y1, x2, y2) : randColor();
    myCanvas2D.drawLine (x1, y1, x2, y2, c, randInt(1,10), endCaps[randInt(0,2)]);
  }
}

//--- test_drawRectangle ------------------------------------------------------

function test_drawRectangle ()
{
  // Reset this demo
  reset();

  // Draw it
  for (let i=0; i<50; i++)
  {
    const x = rand2DWidth  ();
    const y = rand2DHeight ();
    const w = randInt (1, myCanvas2D.cWidth - x);
    const h = randInt (1, myCanvas2D.cHeight - y);
    const c = isGrad() ? randGradient(x, y, x+w, y+h) : randColor();
    myCanvas2D.drawRectangle (x, y, w, h, c, randBin() ? fill : randInt(1,10));
  }
}

//--- test_drawPoly -----------------------------------------------------------

function test_drawPoly ()
{
  // Reset this demo
  reset();

  // Draw it
  vertices = [];
  for (let i=0; i<10; i++)
  {
    numVertices = randInt(3,10);
    vertices.length = 0;
    for (let j=0; j<numVertices; j++)
      vertices.push ({ x:rand2DWidth(), y:rand2DHeight() });

    const c = isGrad() ? randGradient(vertices[0].x, vertices[0].y, vertices[1].x, vertices[1].y) : randColor();
    const t = randBin() ? fill : randInt(1,10);
    const j = joints[randInt(0,joints.length-1)];
    myCanvas2D.drawPoly (vertices, c, t, j, randBin());
  }
}

//--- test_drawEllipse --------------------------------------------------------

function test_drawEllipse ()
{
  // Reset this demo
  reset();

  // Draw it
  for (let i=0; i<50; i++)
    myCanvas2D.drawEllipse (rand2DWidth(), rand2DHeight(), rand2DWidth()/4, rand2DHeight()/4, randColor(), randBin() ? fill : randInt(1,10), randAngle());
}

//--- test_drawArc ------------------------------------------------------------

function test_drawArc ()
{
  //Reset this demo
  reset();

  // Draw it
  for (let i=0; i<20; i++)
  {
    const cx = rand2DWidth();
    const cy = rand2DHeight();
    const r  = randInt(10,300);
    const c  = isGrad() ? randGradient(cx, cy, cx+r, cy+r) : randColor();
    const a1 = randAngle();
    const a2 = randAngle();
    const t  = randInt(0,50);

    myCanvas2D.drawArc (cx, cy, r, c, a1, a2, t);
  }
}

//--- test_drawCurve ----------------------------------------------------------

function test_drawCurve ()
{
  //Reset this demo
  reset();

  for (let i=0; i<50; i++)
    myCanvas2D.drawCurve (rand2DWidth(), rand2DHeight(), rand2DWidth(), rand2DHeight(), randColor(), randBin() ? "h":"v", randInt(1,10));
}

//--- test_drawPie ------------------------------------------------------------

function test_drawPie ()
{
  //Reset this demo
  reset();

  // Draw it
  for (let i=0; i<20; i++)
  {
    const cx = rand2DWidth();
    const cy = rand2DHeight();
    const r  = randInt(10,200);
    const c  = isGrad() ? randGradient(cx, cy, cx+r, cy+r) : randColor();
    const p1 = randInt(0, 360);
    const p2 = randInt(0, 360);

    myCanvas2D.drawPie (cx, cy, r, c, p1, p2);
  }
}

//--- test_adjustBrightness ---------------------------------------------------

function test_adjustBrightness ()
{
  // Reset this demo
  reset();

  for (let x=20; x<myCanvas2D.cWidth-40; x+=40)
  {
    const color = randColor();

    for (let y=20, amount=-90; amount<=90; y+=35, amount+=10)
      myCanvas2D.drawRectangle (x, y, 30, 35, myCanvas2D.adjustBrightness (color, amount), fill);
  }
}

//--- test_shadows ------------------------------------------------------------

function test_shadows ()
{
  // Reset this demo
  reset();

  myCanvas2D.drawRectangle (0, 0, myCanvas2D.cWidth, myCanvas2D.cHeight, '#F0F0F0', fill);
  myCanvas2D.drawText (10, 10, "Shadows work with rectangles, polygons, text and images.", 'black');
  myCanvas2D.drawText (10, 25, "Notice the shadow conforms to the shape of transparent PNG images.", 'black');

  // Set shadow specs
  myCanvas2D.setShadow (10, 10, '#202020', 10);

  // Set some shadowed stuff
  myCanvas2D.drawRectangle (100, 80, 300, 100, '#004080', fill);
  myCanvas2D.drawPoly      ([{ x:100, y:250 }, { x:400, y:250 }, { x:250, y:450 }], '#004080');

  // Test if transparent PNG can cast a shadow according to its visible shape
  myCanvas2D.drawImage (100, 500, "ship.png", () =>
  {
    myCanvas2D.setShadow (0, 0, 'transparent', 0);  // turn off shadows
    myCanvas2D.drawImage (300, 500, "ship.png");    // draw ship without shadows
  });
}

//--- test_drawText -----------------------------------------------------------

function test_drawText ()
{
  // Reset this demo
  reset();

  const textSamples  = [ "Hello", "HTML5", "Canvas Element", "Fast", "Browser", "2D", "Graphics" ];

  // Draw it
  for (let i=0; i<100; i++)
  {
    const font = randInt(5,50).toString() + "px Arial";  // 5px..50px
    myCanvas2D.drawText (rand2DWidth(), rand2DHeight(), textSamples[randInt(0, textSamples.length-1)], randColor(), font);
  }
}

//--- test_getTextSize --------------------------------------------------------

function test_getTextSize ()
{
  // Reset this demo
  reset();

  const standardFont = "16px sans-serif";
  const textSamples  = [ "Hello", "HTML5", "Canvas Element", "Fast", "Browser", "2D", "Graphics" ];

  // Draw it
  for (let i=0; i<20; i++)
  {
    const x    = rand2DWidth();
    const y    = rand2DHeight();
    const font = randInt(5,50).toString() + "px Arial";  // 5px..50px
    const text = textSamples[randInt(0, textSamples.length-1)];
    const size = myCanvas2D.getTextSize (text, font);
    myCanvas2D.drawText (x, y, text, randColor(), font);
    myCanvas2D.drawText (x, y+size.height+2, `(${size.width} x ${size.height})`, "#FFFFFF", standardFont);
  }
}

//--- test_getDrawBlock -----------------------------------------------------

function test_getDrawBlock ()
{
  // Reset this demo
  reset();

  // Draw sample image
  myCanvas2D.drawImage (50, 50, "img1.jpg", () =>
  {
    // Once loaded, get image block
    const imageBlock = myCanvas2D.getBlock (120, 180, 180, 60);
    if (imageBlock == null)
      PopupMessage ('Application Error', 'Unable to read data from canvas.<br>There may be a security issue.<br>This action may need to be performed from a secure context (https://...)');
    else
    {
      // Draw it
      for (i=0; i<20; i++)
        myCanvas2D.drawBlock (randInt(0, 800), randInt(0, 500), imageBlock);
    }
  });
}

//--- test_drawImage ----------------------------------------------------------

function test_drawImage ()
{
  // Reset this demo
  reset();

  const images =
  [
    "img1.jpg",
    "img2.jpg",
    "img3.jpg",
    "img4.jpg",
    "img5.jpg",
  ];

  for (let i=0; i<10; i++)
    myCanvas2D.drawImage (rand2DWidth()/2, rand2DHeight()/2, images[randInt(0,images.length-1)]);
}

//--- test_drawDraggable ----------------------------------------------------------

function test_drawDraggable ()
{
  // Reset this demo
  reset();

  // Fill canvas with background
  myCanvas2D.drawImage (0, 0, "Planet&Moons.jpg", () =>
  {
    myCanvas2D.drawText (5,  5, "Drag spaceship", '#FFFFFF');
    myCanvas2D.drawText (5, 20, "See new coords in console", '#FFFFFF');
    myCanvas2D.drawDraggable (200, 100, "ship.png", (x, y)=>{ console.info (x + ', ' + y); }, (x, y)=>{ console.info ('Done: x=' + x + ', y=' + y); }, true, true);
  });
}

//--- test_drawLinearScale ----------------------------------------------------

function test_drawLinearScale ()
{
  // Reset this demo
  reset();

  if (randInt(0, 1) == 0)
  {
    // Horizontal Tests
    myCanvas2D.drawLinearScale (50,  80+70*0, 900, 20, ScaleOrientation.HorizTop   , randFloat(-100,100), randFloat(101,1000), "sec", randColor(), randColor());
    myCanvas2D.drawLinearScale (50,  80+70*1, 900, 20, ScaleOrientation.HorizTop   , randFloat(-100,100), randFloat(101,1000), "sec", randColor(), randColor());
    myCanvas2D.drawLinearScale (50,  80+70*2, 900, 20, ScaleOrientation.HorizTop   , randFloat(-100,100), randFloat(101,1000), "sec", randColor(), randColor());
    myCanvas2D.drawLinearScale (50,  80+70*3, 900, 20, ScaleOrientation.HorizTop   , randFloat(-100,100), randFloat(101,1000), "sec", randColor(), randColor());
    myCanvas2D.drawLinearScale (50, 100+70*4, 900, 20, ScaleOrientation.HorizBottom, randFloat(-100,100), randFloat(101,1000), "sec", randColor(), randColor());
    myCanvas2D.drawLinearScale (50, 100+70*5, 900, 20, ScaleOrientation.HorizBottom, randFloat(-100,100), randFloat(101,1000), "sec", randColor(), randColor());
    myCanvas2D.drawLinearScale (50, 100+70*6, 900, 20, ScaleOrientation.HorizBottom, randFloat(-100,100), randFloat(101,1000), "sec", randColor(), randColor());
    myCanvas2D.drawLinearScale (50, 100+70*7, 900, 20, ScaleOrientation.HorizBottom, randFloat(-100,100), randFloat(101,1000), "sec", randColor(), randColor());
    myCanvas2D.drawLinearScale (50, 100+70*8, 900, 20, ScaleOrientation.HorizBottom, randFloat(-100,100), randFloat(101,1000), "sec", randColor(), randColor());
  }
  else
  {
    // Vertical Tests
    myCanvas2D.drawLinearScale (100+100*0, 700, 20, 650, ScaleOrientation.VertLeft , randFloat(-100,100), randFloat(101,1000), "sec", randColor(), randColor());
    myCanvas2D.drawLinearScale (100+100*1, 700, 20, 650, ScaleOrientation.VertLeft , randFloat(-100,100), randFloat(101,1000), "sec", randColor(), randColor());
    myCanvas2D.drawLinearScale (100+100*2, 700, 20, 650, ScaleOrientation.VertLeft , randFloat(-100,100), randFloat(101,1000), "sec", randColor(), randColor());
    myCanvas2D.drawLinearScale (100+100*3, 700, 20, 650, ScaleOrientation.VertLeft , randFloat(-100,100), randFloat(101,1000), "sec", randColor(), randColor());
    myCanvas2D.drawLinearScale (120+100*4, 700, 20, 650, ScaleOrientation.VertRight, randFloat(-100,100), randFloat(101,1000), "sec", randColor(), randColor());
    myCanvas2D.drawLinearScale (120+100*5, 700, 20, 650, ScaleOrientation.VertRight, randFloat(-100,100), randFloat(101,1000), "sec", randColor(), randColor());
    myCanvas2D.drawLinearScale (120+100*6, 700, 20, 650, ScaleOrientation.VertRight, randFloat(-100,100), randFloat(101,1000), "sec", randColor(), randColor());
    myCanvas2D.drawLinearScale (120+100*7, 700, 20, 650, ScaleOrientation.VertRight, randFloat(-100,100), randFloat(101,1000), "sec", randColor(), randColor());
    myCanvas2D.drawLinearScale (120+100*8, 700, 20, 650, ScaleOrientation.VertRight, randFloat(-100,100), randFloat(101,1000), "sec", randColor(), randColor());
  }
}

//--- test_drawLogScale ----------------------------------------------------

function test_drawLogScale ()
{
  // Reset this demo
  reset();

  if (randInt(0, 1) == 0)
  {
    // Horizontal Tests
    myCanvas2D.drawLogScale (50,  80+70*0, 900, 20, ScaleOrientation.HorizTop   , randFloat(1,100), randFloat(101,1000000), "Hz", randColor(), randColor());
    myCanvas2D.drawLogScale (50,  80+70*1, 900, 20, ScaleOrientation.HorizTop   , randFloat(1,100), randFloat(101,1000000), "Hz", randColor(), randColor());
    myCanvas2D.drawLogScale (50,  80+70*2, 900, 20, ScaleOrientation.HorizTop   , randFloat(1,100), randFloat(101,1000000), "Hz", randColor(), randColor());
    myCanvas2D.drawLogScale (50,  80+70*3, 900, 20, ScaleOrientation.HorizTop   , randFloat(1,100), randFloat(101,1000000), "Hz", randColor(), randColor());
    myCanvas2D.drawLogScale (50, 100+70*4, 900, 20, ScaleOrientation.HorizBottom, randFloat(1,100), randFloat(101,1000000), "Hz", randColor(), randColor());
    myCanvas2D.drawLogScale (50, 100+70*5, 900, 20, ScaleOrientation.HorizBottom, randFloat(1,100), randFloat(101,1000000), "Hz", randColor(), randColor());
    myCanvas2D.drawLogScale (50, 100+70*6, 900, 20, ScaleOrientation.HorizBottom, randFloat(1,100), randFloat(101,1000000), "Hz", randColor(), randColor());
    myCanvas2D.drawLogScale (50, 100+70*7, 900, 20, ScaleOrientation.HorizBottom, randFloat(1,100), randFloat(101,1000000), "Hz", randColor(), randColor());
    myCanvas2D.drawLogScale (50, 100+70*8, 900, 20, ScaleOrientation.HorizBottom, randFloat(1,100), randFloat(101,1000000), "Hz", randColor(), randColor());
  }
  else
  {
    // Vertical Tests
    myCanvas2D.drawLogScale (100+100*0, 700, 20, 650, ScaleOrientation.VertLeft , randFloat(1,100), randFloat(101,1000000), "Hz", randColor(), randColor());
    myCanvas2D.drawLogScale (100+100*1, 700, 20, 650, ScaleOrientation.VertLeft , randFloat(1,100), randFloat(101,1000000), "Hz", randColor(), randColor());
    myCanvas2D.drawLogScale (100+100*2, 700, 20, 650, ScaleOrientation.VertLeft , randFloat(1,100), randFloat(101,1000000), "Hz", randColor(), randColor());
    myCanvas2D.drawLogScale (100+100*3, 700, 20, 650, ScaleOrientation.VertLeft , randFloat(1,100), randFloat(101,1000000), "Hz", randColor(), randColor());
    myCanvas2D.drawLogScale (120+100*4, 700, 20, 650, ScaleOrientation.VertRight, randFloat(1,100), randFloat(101,1000000), "Hz", randColor(), randColor());
    myCanvas2D.drawLogScale (120+100*5, 700, 20, 650, ScaleOrientation.VertRight, randFloat(1,100), randFloat(101,1000000), "Hz", randColor(), randColor());
    myCanvas2D.drawLogScale (120+100*6, 700, 20, 650, ScaleOrientation.VertRight, randFloat(1,100), randFloat(101,1000000), "Hz", randColor(), randColor());
    myCanvas2D.drawLogScale (120+100*7, 700, 20, 650, ScaleOrientation.VertRight, randFloat(1,100), randFloat(101,1000000), "Hz", randColor(), randColor());
    myCanvas2D.drawLogScale (120+100*8, 700, 20, 650, ScaleOrientation.VertRight, randFloat(1,100), randFloat(101,1000000), "Hz", randColor(), randColor());
  }
}

//--- test_drawCircularScale --------------------------------------------------

function test_drawCircularScale ()
{
  // Reset this demo
  reset();

  myCanvas2D.drawCircularScale (300, ccy, randInt(50, 250), randFloat(-400, 200), randFloat(201, 5000), randInt(-180, 0), randInt(1, 180), "°K", randColor());
  myCanvas2D.drawCircularScale (700, ccy, randInt(50, 250), randFloat(-400, 200), randFloat(201, 5000), randInt(-180, 0), randInt(1, 180), "°K", randColor());
}


//=============================================================================
//  App Button Functions - Cool Stuff
//=============================================================================

//--- test_Burst ------------------------------------------------------------

function test_Burst ()
{
  // Reset this demo
  reset();

  const cx = rand2DWidth ();
  const cy = rand2DHeight();

  // Draw it
  for (let i=0; i<500; i++)
    myCanvas2D.drawLine (cx, cy, rand2DWidth(), rand2DHeight(), randColor());
}

//--- test_Web1 --------------------------------------------------------------

function test_Web1 ()
{
  // Reset this demo
  reset();

  // Corner Web
  step = randInt (5, 15);
  yFactor = myCanvas2D.cHeight / myCanvas2D.cWidth;
  for (x=0; x<myCanvas2D.cWidth; x+=step)
  {
    y = x * yFactor;

    myCanvas2D.drawPoly (
    [
      { x : x                    , y : myCanvas2D.cHeight     },
      { x : 0                    , y : y                      },
      { x : myCanvas2D.cWidth - x, y : 0                      },
      { x : myCanvas2D.cWidth    , y : myCanvas2D.cHeight - y }
    ], randColor());
  }

  // Ellipse Web
  cx   = myCanvas2D.cWidth  / 2;
  cy   = myCanvas2D.cHeight / 2;
  rx   = rand2DWidth ()     / 2;
  ry   = rand2DHeight()     / 2;
  step = randFloat (2, 5);

  for (rot=-180; rot<180; rot+=step)
    myCanvas2D.drawEllipse (cx, cy, rx, ry, randColor(), 1, rot);
}

//--- test_Web2 --------------------------------------------------------------

function test_Web2 ()
{
  // Reset this demo
  reset();

  const cx = myCanvas2D.cWidth /2;
  const cy = myCanvas2D.cHeight/2;

  rotStep = randFloat (1, 10);
  for (rot=0; rot<180; rot+=rotStep)
  {
    radStep = 20 * Math.random() + 10;  // 10...30
    yFactor = myCanvas2D.cHeight / myCanvas2D.cWidth;
    for (rx=0; rx<myCanvas2D.cWidth/2; rx+=radStep)
    {
      ry = myCanvas2D.cHeight/2 - (rx * yFactor);
      myCanvas2D.drawEllipse (cx, cy, rx, ry, randColor(), 1, rot);
    }
  }
}

//--- test_FractalTree ------------------------------------------------------

function test_FractalTree ()
{
  // Reset this demo
  reset();

  function drawBranch (startX, startY, len, angle, branchWidth)
  {
    myCanvas2D.cc.lineWidth = branchWidth;

    myCanvas2D.cc.beginPath();
    myCanvas2D.cc.save();

    myCanvas2D.cc.strokeStyle = randColor();

    myCanvas2D.cc.translate(startX, startY);
    myCanvas2D.cc.rotate(angle * Math.PI/180);
    myCanvas2D.cc.moveTo(0, 0);
    myCanvas2D.cc.lineTo(0, -len);
    myCanvas2D.cc.stroke();

    if (len < 10)
    {
      myCanvas2D.cc.restore();
      return;
    }

    angleStep = randFloat (5, 30);
    drawBranch(0, -len, len*0.8, angle-angleStep, branchWidth*0.7);  // -15
    drawBranch(0, -len, len*0.8, angle+angleStep, branchWidth*0.7);  // +15

    myCanvas2D.cc.restore();
  }

  drawBranch (myCanvas2D.cWidth/2, myCanvas2D.cHeight, myCanvas2D.cHeight/4.7, 0, 10)
}

//--- test_Mandelbrot -------------------------------------------------------

function test_Mandelbrot ()
{
  // Reset this demo
  reset();

  // Draw single pixel to the imageData //
  function drawRGBPixel (x, y, r, g, b, a)
  {
    let index = (x + y * myCanvas2D.cWidth) * 4;

    canvasData.data[index + 0] = r;
    canvasData.data[index + 1] = g;
    canvasData.data[index + 2] = b;
    canvasData.data[index + 3] = a;
  }

  //Convert hue value to rgb
  function hToRgb(h)
  {
    if (h == 1)
      return [0,0,0];
    let r, g, b;
    let i = Math.floor(h * 6);
    let f = h * 6 - i;
    switch(i % 6)
    {
      case 0: r = 1, g = f, b = 0; break;
      case 1: r = f, g = 1, b = 0; break;
      case 2: r = 0, g = 1, b = f; break;
      case 3: r = 0, g = f, b = 1; break;
      case 4: r = f, g = 0, b = 1; break;
      case 5: r = 1, g = 0, b = f; break;
    }
    return [r * 255, g * 255, b * 255];
  }

  let canvasData = myCanvas2D.getBlock (0, 0, myCanvas2D.cWidth, myCanvas2D.cHeight);

  width  = 5 * Math.random() + 1.0;  // 3.5;
  height = 3 * Math.random() + 0.5;  // 2;

  xoffset=0; yoffset=0;

  for (px=0; px < myCanvas2D.cWidth; px++)
  {
    for (py=0; py < myCanvas2D.cHeight; py++)
    {
      let x0       = (px / myCanvas2D.cWidth ) * width  + (xoffset - 2.5);
      let y0       = (py / myCanvas2D.cHeight) * height + (yoffset - 1.0);
      let x        = 0;
      let y        = 0;
      let iter     = 0;
      let max_iter = 128;

      while ((x*x + y*y) < 4 && iter < max_iter)
      {
        let x_temp = x*x - y*y + x0;
        y = 2*x*y + y0;
        x = x_temp;
        iter++;
      }

      let rgb = hToRgb(iter/max_iter);
      drawRGBPixel(px, py, rgb[0], rgb[1], rgb[2], 255);
    }
  }

  myCanvas2D.drawBlock (0, 0, canvasData);
}

//--- test_Snake ------------------------------------------------------------

function test_Snake ()
{
  // Reset this demo
  reset();

  // Draw it
  x = myCanvas2D.cWidth/2;
  y = myCanvas2D.cHeight/2;

  interval = setInterval (() =>
  {
    xRad = 20 * Math.random() + 10;
    yRad = 20 * Math.random() + 10;

    myCanvas2D.drawEllipse (x, y, xRad, yRad, randColor());

    xStep = randInt (10, 20);
    yStep = randInt ( 8, 16);

    if (randInt(0,1) > 0) x += xStep; else x -= xStep;
    if (randInt(0,1) > 0) y += yStep; else y -= yStep;

         if (x > myCanvas2D.cWidth ) x = myCanvas2D.cWidth;
    else if (x < 0               ) x = 0;

         if (y > myCanvas2D.cHeight) y = myCanvas2D.cHeight;
    else if (y < 0               ) y = 0;
  },
  17);
}

//--- test_PolyBounce -------------------------------------------------------

function test_PolyBounce ()
{
  // Reset this demo
  reset();

  points = [];
  xStep  = [];
  yStep  = [];

  numPoints = randInt (10, 50);

  // Init points and steps
  for (let i=0; i<numPoints; i++)
  {
    points.push ({ x : rand2DWidth(), y : rand2DHeight() });
    xStep .push (randInt(2,7) * (randInt(0,1) > 0 ? 1 : -1));
    yStep .push (randInt(2,7) * (randInt(0,1) > 0 ? 1 : -1));
  }

  const color = randColor();

  interval = setInterval (() =>
  {
    // Clear canvas
    myCanvas2D.clear();

    // Draw all lines
    myCanvas2D.drawPoly (points, color, 1, true);

    // Move all vertices
    for (let i=0; i<numPoints; i++)
    {
      points[i].x += xStep[i];
      points[i].y += yStep[i];

           if (points[i].x > myCanvas2D.cWidth ) { points[i].x = myCanvas2D.cWidth ; xStep[i] *= -1; }
      else if (points[i].x < 0                 ) { points[i].x = 0                 ; xStep[i] *= -1; }

           if (points[i].y > myCanvas2D.cHeight) { points[i].y = myCanvas2D.cHeight; yStep[i] *= -1; }
      else if (points[i].y < 0                 ) { points[i].y = 0                 ; yStep[i] *= -1; }
    }
  },
  17);
}
