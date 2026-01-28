//=========================================================
//
//     FILE  : DVCanvas2D_Test.js
//
//   PROJECT : Data Visualization Widget Support
//
//  FUNCTION : Testing of the DVCanvas2D class
//
//   AUTHOR  : Bill Daniels
//             Copyright 2023-2026, D+S Tech Labs, Inc.
//             All Rights Reserved
//
//=========================================================

//--- Imports ---------------------------------------------

import { DVCanvas2D } from "./DVCanvas2D.js";

//--- Globals ---------------------------------------------

// Create a DVCanvas2D object
const myCanvas2D = new DVCanvas2D ("canvas2D");
const ccx        = myCanvas2D.cWidth  / 2;
const ccy        = myCanvas2D.cHeight / 2;

let interval2D = undefined;  // for interval timers
let keydown2D  = undefined;  // for keydown event listener

function rand2DWidth  () { return Utils.randInt (0, myCanvas2D.cWidth ); }
function rand2DHeight () { return Utils.randInt (0, myCanvas2D.cHeight); }
function isTrans      () { return document.getElementById("cb_transparent").checked; }
function isGrad       () { return document.getElementById("cb_gradient"   ).checked; }

//--- reset -------------------------------------------------------------------

function reset ()
{
  // Clear interval timer and keydown event listener, if any
  if (interval2D != undefined) { clearInterval (interval2D); interval2D = undefined; }
  if (keydown2D  != undefined) { removeEventListener (keydown2D, 'keyDown'); keydown2D = undefined; }

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
export function test_TestBounds ()
{
  // Reset this demo
  reset();

  if (drawn)
  {
    myCanvas2D.clear ();
    drawn = false;
  }
  else
  {
    myCanvas2D.drawRectangle (0, 0, myCanvas2D.cWidth, myCanvas2D.cHeight, "#FFFF00");
    drawn = true;
  }
}

//--- test_drawPixel ----------------------------------------------------------

export function test_drawPixel ()
{
  // Reset this demo
  reset();

  // Draw it
  for (let i=0; i<1000; i++)
    myCanvas2D.drawPixel (rand2DWidth(), rand2DHeight(), Utils.randColor());
}

//--- test_drawPoint ----------------------------------------------------------

export function test_drawPoint ()
{
  // Reset this demo
  reset();

  // Non-filled points
  for (let i=0; i<100; i++)
    myCanvas2D.drawPoint (rand2DWidth(), rand2DHeight(), Utils.randInt(1,20), Utils.randColor(), Utils.randBin() ? myCanvas2D.fill : Utils.randInt(1,10));
}

//--- test_drawLine -----------------------------------------------------------

export function test_drawLine ()
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
    const c  = isGrad() ? Utils.randGradient(myCanvas2D.cc, x1, y1, x2, y2) : Utils.randColor();
    myCanvas2D.drawLine (x1, y1, x2, y2, c, Utils.randInt(1,10), myCanvas2D.endCaps[Utils.randInt(0,2)]);
  }
}

//--- test_drawRectangle ------------------------------------------------------

export function test_drawRectangle ()
{
  // Reset this demo
  reset();

  // Draw it
  for (let i=0; i<50; i++)
  {
    const x = rand2DWidth  ();
    const y = rand2DHeight ();
    const w = Utils.randInt (1, myCanvas2D.cWidth - x);
    const h = Utils.randInt (1, myCanvas2D.cHeight - y);
    const c = isGrad() ? Utils.randGradient(myCanvas2D.cc, x, y, x+w, y+h) : Utils.randColor();
    myCanvas2D.drawRectangle (x, y, w, h, c, Utils.randBin() ? myCanvas2D.fill : Utils.randInt(1,10));
  }
}

//--- test_drawPoly -----------------------------------------------------------

export function test_drawPoly ()
{
  // Reset this demo
  reset();

  // Draw it
  let vertices = [];
  for (let i=0; i<10; i++)
  {
    const numVertices = Utils.randInt(3,10);
    vertices.length = 0;
    for (let j=0; j<numVertices; j++)
      vertices.push ({ x:rand2DWidth(), y:rand2DHeight() });

    const c = isGrad() ? Utils.randGradient(myCanvas2D.cc, vertices[0].x, vertices[0].y, vertices[1].x, vertices[1].y) : Utils.randColor();
    const t = Utils.randBin() ? myCanvas2D.fill : Utils.randInt(1,10);
    const j = myCanvas2D.joints[Utils.randInt(0,myCanvas2D.joints.length-1)];
    myCanvas2D.drawPoly (vertices, c, t, j, Utils.randBin());
  }
}

//--- test_drawEllipse --------------------------------------------------------

export function test_drawEllipse ()
{
  // Reset this demo
  reset();

  // Draw it
  for (let i=0; i<50; i++)
  {
    const x = rand2DWidth  ();
    const y = rand2DHeight ();
    const w = Utils.randInt (1, myCanvas2D.cWidth  - x) / 4;
    const h = Utils.randInt (1, myCanvas2D.cHeight - y) / 4;
    const c = isGrad() ? Utils.randGradient(myCanvas2D.cc, x, y, x+w, y+h) : Utils.randColor();
    myCanvas2D.drawEllipse (x, y, w, h, c, Utils.randBin() ? myCanvas2D.fill : Utils.randInt(1,10), Utils.randAngle());
  }
}

//--- test_drawArc ------------------------------------------------------------

export function test_drawArc ()
{
  //Reset this demo
  reset();

  // Draw it
  for (let i=0; i<20; i++)
  {
    const cx = rand2DWidth();
    const cy = rand2DHeight();
    const r  = Utils.randInt(10,300);
    const c  = isGrad() ? Utils.randGradient(myCanvas2D.cc, cx, cy, cx+r, cy+r) : Utils.randColor();
    const a1 = Utils.randAngle();
    const a2 = Utils.randAngle();
    const t  = Utils.randInt(0,50);

    myCanvas2D.drawArc (cx, cy, r, c, a1, a2, t);
  }
}

//--- test_drawCurve ----------------------------------------------------------

export function test_drawCurve ()
{
  //Reset this demo
  reset();

  for (let i=0; i<50; i++)
    myCanvas2D.drawCurve (rand2DWidth(), rand2DHeight(), rand2DWidth(), rand2DHeight(), Utils.randColor(), Utils.randBin() ? "h":"v", Utils.randInt(1,10));
}

//--- test_drawPie ------------------------------------------------------------

export function test_drawPie ()
{
  //Reset this demo
  reset();

  // Draw it
  for (let i=0; i<20; i++)
  {
    const cx = rand2DWidth();
    const cy = rand2DHeight();
    const r  = Utils.randInt(10,200);
    const c  = isGrad() ? Utils.randGradient(myCanvas2D.cc, cx, cy, cx+r, cy+r) : Utils.randColor();
    const p1 = Utils.randInt(0, 360);
    const p2 = Utils.randInt(0, 360);

    myCanvas2D.drawPie (cx, cy, r, c, p1, p2);
  }
}

//--- test_adjustBrightness ---------------------------------------------------

export function test_adjustBrightness ()
{
  // Reset this demo
  reset();

  for (let x=20; x<myCanvas2D.cWidth-40; x+=40)
  {
    const color = Utils.randColor();

    for (let y=20, amount=-90; amount<=90; y+=35, amount+=10)
      myCanvas2D.drawRectangle (x, y, 30, 35, myCanvas2D.adjustBrightness (color, amount), myCanvas2D.fill);
  }
}

//--- test_shadows ------------------------------------------------------------

export function test_shadows ()
{
  // Reset this demo
  reset();

  myCanvas2D.drawRectangle (0, 0, myCanvas2D.cWidth, myCanvas2D.cHeight, '#F0F0F0', myCanvas2D.fill);
  myCanvas2D.drawText (10, 10, "Shadows work with rectangles, polygons, text and images.", 'black');
  myCanvas2D.drawText (10, 25, "Notice the shadow conforms to the shape of transparent PNG images.", 'black');

  // Set shadow specs
  myCanvas2D.setShadow (10, 10, '#202020', 10);

  // Set some shadowed stuff
  myCanvas2D.drawRectangle (100, 80, 300, 100, '#004080', myCanvas2D.fill);
  myCanvas2D.drawPoly      ([{ x:100, y:250 }, { x:400, y:250 }, { x:250, y:450 }], '#004080');

  // Test if transparent PNG can cast a shadow according to its visible shape
  myCanvas2D.drawImage (100, 500, "ship.png", () =>
  {
    myCanvas2D.setShadow (0, 0, 'transparent', 0);  // turn off shadows
    myCanvas2D.drawImage (300, 500, "ship.png");    // draw ship without shadows
  });
}

//--- test_drawText -----------------------------------------------------------

export function test_drawText ()
{
  // Reset this demo
  reset();

  const textSamples  = [ "Hello", "HTML5", "Canvas Element", "Fast", "Browser", "2D", "Graphics" ];

  // Draw it
  for (let i=0; i<100; i++)
  {
    const font = Utils.randInt(5,50).toString() + "px Arial";  // 5px..50px
    myCanvas2D.drawText (rand2DWidth(), rand2DHeight(), textSamples[Utils.randInt(0, textSamples.length-1)], Utils.randColor(), font);
  }
}

//--- test_getTextSize --------------------------------------------------------

export function test_getTextSize ()
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
    const font = Utils.randInt(5,50).toString() + "px Arial";  // 5px..50px
    const text = textSamples[Utils.randInt(0, textSamples.length-1)];
    const size = myCanvas2D.getTextSize (text, font);
    myCanvas2D.drawText (x, y, text, Utils.randColor(), font);
    myCanvas2D.drawText (x, y+size.height+2, `(${size.width} x ${size.height})`, "#FFFFFF", standardFont);
  }
}

//--- test_getDrawBlock -----------------------------------------------------

export function test_getDrawBlock ()
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
      for (let i=0; i<20; i++)
        myCanvas2D.drawBlock (Utils.randInt(0, 800), Utils.randInt(0, 500), imageBlock);
    }
  });
}

//--- test_drawImage ----------------------------------------------------------

export function test_drawImage ()
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
    myCanvas2D.drawImage (rand2DWidth()/2, rand2DHeight()/2, images[Utils.randInt(0,images.length-1)]);
}

//--- test_drawDraggable ----------------------------------------------------------

export function test_drawDraggable ()
{
  // Reset this demo
  reset();

  // Fill canvas with background
  myCanvas2D.drawImage (0, 0, "Planet&Moons.jpg", () =>
  {
    myCanvas2D.drawText (5,  5, "Drag spaceship", '#FFFFFF');
    myCanvas2D.drawText (5, 20, "See new coords in console", '#FFFFFF');
    // myCanvas2D.drawDraggable (200, 100, "ship.png", (x, y)=>{ console.info (x + ', ' + y); }, (x, y)=>{ console.info ('Done: x=' + x + ', y=' + y); }, true, true);
    myCanvas2D.drawDraggable (200, 100, "ship.png", myDraggable, myDraggableDone, false, true, true);
  });
}

export function myDraggable (x, y)
{
  console.info ('X:' + x + '  Y:' + y);
}

export function myDraggableDone (x, y)
{
  console.info ('Done: ' + x + ', ' + y);
}

//--- test_drawLinearScale ----------------------------------------------------

export function test_drawLinearScale ()
{
  // Reset this demo
  reset();

  if (Utils.randInt(0, 1) == 0)
  {
    // Horizontal Tests
    myCanvas2D.drawLinearScale (50,  80+70*0, 900, 20, myCanvas2D.ScaleOrientation.HorizTop   , Utils.randFloat(-100,100), Utils.randFloat(101,1000), "sec", Utils.randColor(), Utils.randColor());
    myCanvas2D.drawLinearScale (50,  80+70*1, 900, 20, myCanvas2D.ScaleOrientation.HorizTop   , Utils.randFloat(-100,100), Utils.randFloat(101,1000), "sec", Utils.randColor(), Utils.randColor());
    myCanvas2D.drawLinearScale (50,  80+70*2, 900, 20, myCanvas2D.ScaleOrientation.HorizTop   , Utils.randFloat(-100,100), Utils.randFloat(101,1000), "sec", Utils.randColor(), Utils.randColor());
    myCanvas2D.drawLinearScale (50,  80+70*3, 900, 20, myCanvas2D.ScaleOrientation.HorizTop   , Utils.randFloat(-100,100), Utils.randFloat(101,1000), "sec", Utils.randColor(), Utils.randColor());
    myCanvas2D.drawLinearScale (50, 100+70*4, 900, 20, myCanvas2D.ScaleOrientation.HorizBottom, Utils.randFloat(-100,100), Utils.randFloat(101,1000), "sec", Utils.randColor(), Utils.randColor());
    myCanvas2D.drawLinearScale (50, 100+70*5, 900, 20, myCanvas2D.ScaleOrientation.HorizBottom, Utils.randFloat(-100,100), Utils.randFloat(101,1000), "sec", Utils.randColor(), Utils.randColor());
    myCanvas2D.drawLinearScale (50, 100+70*6, 900, 20, myCanvas2D.ScaleOrientation.HorizBottom, Utils.randFloat(-100,100), Utils.randFloat(101,1000), "sec", Utils.randColor(), Utils.randColor());
    myCanvas2D.drawLinearScale (50, 100+70*7, 900, 20, myCanvas2D.ScaleOrientation.HorizBottom, Utils.randFloat(-100,100), Utils.randFloat(101,1000), "sec", Utils.randColor(), Utils.randColor());
    myCanvas2D.drawLinearScale (50, 100+70*8, 900, 20, myCanvas2D.ScaleOrientation.HorizBottom, Utils.randFloat(-100,100), Utils.randFloat(101,1000), "sec", Utils.randColor(), Utils.randColor());
  }
  else
  {
    // Vertical Tests
    myCanvas2D.drawLinearScale (100+100*0, 700, 20, 650, myCanvas2D.ScaleOrientation.VertLeft , Utils.randFloat(-100,100), Utils.randFloat(101,1000), "sec", Utils.randColor(), Utils.randColor());
    myCanvas2D.drawLinearScale (100+100*1, 700, 20, 650, myCanvas2D.ScaleOrientation.VertLeft , Utils.randFloat(-100,100), Utils.randFloat(101,1000), "sec", Utils.randColor(), Utils.randColor());
    myCanvas2D.drawLinearScale (100+100*2, 700, 20, 650, myCanvas2D.ScaleOrientation.VertLeft , Utils.randFloat(-100,100), Utils.randFloat(101,1000), "sec", Utils.randColor(), Utils.randColor());
    myCanvas2D.drawLinearScale (100+100*3, 700, 20, 650, myCanvas2D.ScaleOrientation.VertLeft , Utils.randFloat(-100,100), Utils.randFloat(101,1000), "sec", Utils.randColor(), Utils.randColor());
    myCanvas2D.drawLinearScale (120+100*4, 700, 20, 650, myCanvas2D.ScaleOrientation.VertRight, Utils.randFloat(-100,100), Utils.randFloat(101,1000), "sec", Utils.randColor(), Utils.randColor());
    myCanvas2D.drawLinearScale (120+100*5, 700, 20, 650, myCanvas2D.ScaleOrientation.VertRight, Utils.randFloat(-100,100), Utils.randFloat(101,1000), "sec", Utils.randColor(), Utils.randColor());
    myCanvas2D.drawLinearScale (120+100*6, 700, 20, 650, myCanvas2D.ScaleOrientation.VertRight, Utils.randFloat(-100,100), Utils.randFloat(101,1000), "sec", Utils.randColor(), Utils.randColor());
    myCanvas2D.drawLinearScale (120+100*7, 700, 20, 650, myCanvas2D.ScaleOrientation.VertRight, Utils.randFloat(-100,100), Utils.randFloat(101,1000), "sec", Utils.randColor(), Utils.randColor());
    myCanvas2D.drawLinearScale (120+100*8, 700, 20, 650, myCanvas2D.ScaleOrientation.VertRight, Utils.randFloat(-100,100), Utils.randFloat(101,1000), "sec", Utils.randColor(), Utils.randColor());
  }
}

//--- test_drawLogScale ----------------------------------------------------

export function test_drawLogScale ()
{
  // Reset this demo
  reset();

  if (Utils.randInt(0, 1) == 0)
  {
    // Horizontal Tests
    myCanvas2D.drawLogScale (50,  80+70*0, 900, 20, myCanvas2D.ScaleOrientation.HorizTop   , Utils.randFloat(1,100), Utils.randFloat(101,1000000), "Hz", Utils.randColor(), Utils.randColor());
    myCanvas2D.drawLogScale (50,  80+70*1, 900, 20, myCanvas2D.ScaleOrientation.HorizTop   , Utils.randFloat(1,100), Utils.randFloat(101,1000000), "Hz", Utils.randColor(), Utils.randColor());
    myCanvas2D.drawLogScale (50,  80+70*2, 900, 20, myCanvas2D.ScaleOrientation.HorizTop   , Utils.randFloat(1,100), Utils.randFloat(101,1000000), "Hz", Utils.randColor(), Utils.randColor());
    myCanvas2D.drawLogScale (50,  80+70*3, 900, 20, myCanvas2D.ScaleOrientation.HorizTop   , Utils.randFloat(1,100), Utils.randFloat(101,1000000), "Hz", Utils.randColor(), Utils.randColor());
    myCanvas2D.drawLogScale (50, 100+70*4, 900, 20, myCanvas2D.ScaleOrientation.HorizBottom, Utils.randFloat(1,100), Utils.randFloat(101,1000000), "Hz", Utils.randColor(), Utils.randColor());
    myCanvas2D.drawLogScale (50, 100+70*5, 900, 20, myCanvas2D.ScaleOrientation.HorizBottom, Utils.randFloat(1,100), Utils.randFloat(101,1000000), "Hz", Utils.randColor(), Utils.randColor());
    myCanvas2D.drawLogScale (50, 100+70*6, 900, 20, myCanvas2D.ScaleOrientation.HorizBottom, Utils.randFloat(1,100), Utils.randFloat(101,1000000), "Hz", Utils.randColor(), Utils.randColor());
    myCanvas2D.drawLogScale (50, 100+70*7, 900, 20, myCanvas2D.ScaleOrientation.HorizBottom, Utils.randFloat(1,100), Utils.randFloat(101,1000000), "Hz", Utils.randColor(), Utils.randColor());
    myCanvas2D.drawLogScale (50, 100+70*8, 900, 20, myCanvas2D.ScaleOrientation.HorizBottom, Utils.randFloat(1,100), Utils.randFloat(101,1000000), "Hz", Utils.randColor(), Utils.randColor());
  }
  else
  {
    // Vertical Tests
    myCanvas2D.drawLogScale (100+100*0, 700, 20, 650, myCanvas2D.ScaleOrientation.VertLeft , Utils.randFloat(1,100), Utils.randFloat(101,1000000), "Hz", Utils.randColor(), Utils.randColor());
    myCanvas2D.drawLogScale (100+100*1, 700, 20, 650, myCanvas2D.ScaleOrientation.VertLeft , Utils.randFloat(1,100), Utils.randFloat(101,1000000), "Hz", Utils.randColor(), Utils.randColor());
    myCanvas2D.drawLogScale (100+100*2, 700, 20, 650, myCanvas2D.ScaleOrientation.VertLeft , Utils.randFloat(1,100), Utils.randFloat(101,1000000), "Hz", Utils.randColor(), Utils.randColor());
    myCanvas2D.drawLogScale (100+100*3, 700, 20, 650, myCanvas2D.ScaleOrientation.VertLeft , Utils.randFloat(1,100), Utils.randFloat(101,1000000), "Hz", Utils.randColor(), Utils.randColor());
    myCanvas2D.drawLogScale (120+100*4, 700, 20, 650, myCanvas2D.ScaleOrientation.VertRight, Utils.randFloat(1,100), Utils.randFloat(101,1000000), "Hz", Utils.randColor(), Utils.randColor());
    myCanvas2D.drawLogScale (120+100*5, 700, 20, 650, myCanvas2D.ScaleOrientation.VertRight, Utils.randFloat(1,100), Utils.randFloat(101,1000000), "Hz", Utils.randColor(), Utils.randColor());
    myCanvas2D.drawLogScale (120+100*6, 700, 20, 650, myCanvas2D.ScaleOrientation.VertRight, Utils.randFloat(1,100), Utils.randFloat(101,1000000), "Hz", Utils.randColor(), Utils.randColor());
    myCanvas2D.drawLogScale (120+100*7, 700, 20, 650, myCanvas2D.ScaleOrientation.VertRight, Utils.randFloat(1,100), Utils.randFloat(101,1000000), "Hz", Utils.randColor(), Utils.randColor());
    myCanvas2D.drawLogScale (120+100*8, 700, 20, 650, myCanvas2D.ScaleOrientation.VertRight, Utils.randFloat(1,100), Utils.randFloat(101,1000000), "Hz", Utils.randColor(), Utils.randColor());
  }
}

//--- test_drawCircularScale --------------------------------------------------

export function test_drawCircularScale ()
{
  // Reset this demo
  reset();

  myCanvas2D.drawCircularScale (300, ccy, Utils.randInt(50, 250), Utils.randFloat(-400, 200), Utils.randFloat(201, 5000), Utils.randInt(-180, 0), Utils.randInt(1, 180), "°K", Utils.randColor());
  myCanvas2D.drawCircularScale (700, ccy, Utils.randInt(50, 250), Utils.randFloat(-400, 200), Utils.randFloat(201, 5000), Utils.randInt(-180, 0), Utils.randInt(1, 180), "°K", Utils.randColor());
}


//=============================================================================
//  App Button Functions - Cool Stuff
//=============================================================================

//--- test_Burst ------------------------------------------------------------

export function test_Burst ()
{
  // Reset this demo
  reset();

  const cx = rand2DWidth ();
  const cy = rand2DHeight();

  // Draw it
  for (let i=0; i<500; i++)
    myCanvas2D.drawLine (cx, cy, rand2DWidth(), rand2DHeight(), Utils.randColor());
}

//--- test_Web1 --------------------------------------------------------------

export function test_Web1 ()
{
  // Reset this demo
  reset();

  // Corner Web
  let step    = Utils.randInt (5, 15);
  let yFactor = myCanvas2D.cHeight / myCanvas2D.cWidth;

  for (let x=0; x<myCanvas2D.cWidth; x+=step)
  {
    let y = x * yFactor;

    myCanvas2D.drawPoly (
    [
      { x : x                    , y : myCanvas2D.cHeight     },
      { x : 0                    , y : y                      },
      { x : myCanvas2D.cWidth - x, y : 0                      },
      { x : myCanvas2D.cWidth    , y : myCanvas2D.cHeight - y }
    ], Utils.randColor());
  }

  // Ellipse Web
  let cx = myCanvas2D.cWidth  / 2;
  let cy = myCanvas2D.cHeight / 2;
  let rx = rand2DWidth ()     / 2;
  let ry = rand2DHeight()     / 2;

  step = Utils.randFloat (2, 5);
  for (let rot=-180; rot<180; rot+=step)
    myCanvas2D.drawEllipse (cx, cy, rx, ry, Utils.randColor(), 1, rot);
}

//--- test_Web2 --------------------------------------------------------------

export function test_Web2 ()
{
  // Reset this demo
  reset();

  const cx = myCanvas2D.cWidth /2;
  const cy = myCanvas2D.cHeight/2;

  let rotStep = Utils.randFloat (1, 10);
  for (let rot=0; rot<180; rot+=rotStep)
  {
    let radStep = Utils.randFloat(10, 30);
    let yFactor = myCanvas2D.cHeight / myCanvas2D.cWidth;
    for (let rx=0; rx<myCanvas2D.cWidth/2; rx+=radStep)
    {
      let ry = myCanvas2D.cHeight/2 - (rx * yFactor);
      myCanvas2D.drawEllipse (cx, cy, rx, ry, Utils.randColor(), 1, rot);
    }
  }
}

//--- test_FractalTree ------------------------------------------------------

export function test_FractalTree ()
{
  // Reset this demo
  reset();

  function drawBranch (startX, startY, len, angle, branchWidth)
  {
    myCanvas2D.cc.lineWidth = branchWidth;

    myCanvas2D.cc.beginPath();
    myCanvas2D.cc.save();

    myCanvas2D.cc.strokeStyle = Utils.randColor();

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

    let angleStep = Utils.randFloat (5, 30);
    drawBranch(0, -len, len*0.8, angle-angleStep, branchWidth*0.7);  // -15
    drawBranch(0, -len, len*0.8, angle+angleStep, branchWidth*0.7);  // +15

    myCanvas2D.cc.restore();
  }

  drawBranch (myCanvas2D.cWidth/2, myCanvas2D.cHeight, myCanvas2D.cHeight/4.7, 0, 10)
}

//--- test_Mandelbrot -------------------------------------------------------

export function test_Mandelbrot ()
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

  const width  = Utils.randFloat (1.0, 6.0);
  const height = Utils.randFloat (0.5, 3.0);

  let xoffset=0, yoffset=0;

  for (let px=0; px < myCanvas2D.cWidth; px++)
  {
    for (let py=0; py < myCanvas2D.cHeight; py++)
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

export function test_Snake ()
{
  // Reset this demo
  reset();

  // Draw it
  let x = myCanvas2D.cWidth/2;
  let y = myCanvas2D.cHeight/2;

  interval2D = setInterval (() =>
  {
    const xRad = Utils.randInt (10, 30);
    const yRad = Utils.randInt (10, 30);

    myCanvas2D.drawEllipse (x, y, xRad, yRad, Utils.randColor());

    const xStep = Utils.randInt (10, 20);
    const yStep = Utils.randInt ( 8, 16);

    if (Utils.randBin ()) x += xStep; else x -= xStep;
    if (Utils.randBin ()) y += yStep; else y -= yStep;

         if (x > myCanvas2D.cWidth ) x = myCanvas2D.cWidth;
    else if (x < 0                 ) x = 0;

         if (y > myCanvas2D.cHeight) y = myCanvas2D.cHeight;
    else if (y < 0                 ) y = 0;
  },
  17);
}

//--- test_PolyBounce -------------------------------------------------------

export function test_PolyBounce ()
{
  // Reset this demo
  reset();

  let points = [];
  let xStep  = [];
  let yStep  = [];

  const numPoints = Utils.randInt (10, 50);

  // Init points and steps
  for (let i=0; i<numPoints; i++)
  {
    points.push ({ x : rand2DWidth(), y : rand2DHeight() });
    xStep .push (Utils.randInt(2,7) * (Utils.randBin() ? 1 : -1));
    yStep .push (Utils.randInt(2,7) * (Utils.randBin() ? 1 : -1));
  }

  const maxX      = myCanvas2D.cWidth  - 1;
  const maxY      = myCanvas2D.cHeight - 1;
  const color     = Utils.randColor();
  const thickness = Utils.randInt (1, 10);

  interval2D = setInterval (() =>
  {
    // Clear canvas
    myCanvas2D.clear();

    // Draw all lines
    myCanvas2D.drawPoly (points, color, thickness, true);

    // Move all vertices
    for (let i=0; i<numPoints; i++)
    {
      points[i].x += xStep[i];
      points[i].y += yStep[i];

           if (points[i].x > maxX) { points[i].x = maxX; xStep[i] *= -1; }
      else if (points[i].x < 0   ) { points[i].x = 0   ; xStep[i] *= -1; }

           if (points[i].y > maxY) { points[i].y = maxY; yStep[i] *= -1; }
      else if (points[i].y < 0   ) { points[i].y = 0   ; yStep[i] *= -1; }
    }
  }, 33);  // ~30fps
}

//--- test_Tunnel -----------------------------------------------------------

export function test_Tunnel ()
{
  let    rings    = [];
  const  maxRings = 40;
  const  speed    = 5;

  // Reset this demo
  reset ();

  for (let i=0; i<maxRings; i++)
    rings.push ({ z: i * 100, color: Utils.randColor() });

  interval2D = setInterval (() =>
  {
    myCanvas2D.clear ();

    for (let ring of rings)
    {
      const perspective = 500 / ring.z;
      const radius = perspective * 200;

      myCanvas2D.drawEllipse (ccx, ccy, radius, radius, ring.color, 3*perspective);

      ring.z -= speed;
      if (ring.z <= 0)
      {
        ring.z = maxRings * 100;
        ring.color = Utils.randColor();
      }
    }
  }, 33);  // ~30fps
}


// Add more from here:
// https://webdesign.tutsplus.com/21-ridiculously-impressive-html5-canvas-experiments--net-14210a

