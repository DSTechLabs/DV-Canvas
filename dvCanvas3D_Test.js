//=========================================================
//
//     FILE  : DVCanvas3D_Test.js
//
//   PROJECT : DVCanvas3D.js testing
//
//   AUTHOR  : Bill Daniels
//             Copyright 2023-2026, D+S Tech Labs, Inc.
//             All Rights Reserved
//
//=========================================================

//--- Imports ---------------------------------------------

import { DVCanvas3D } from './DVCanvas3D.js'
import * as Utils from './utils.js';

//--- Globals ---------------------------------------------

// Create a DVCanvas2D object
const myCanvas3D = new DVCanvas3D (1024, 768, 'black');

// Add its canvas element to the placeholder div
$('#canvas3D').append (myCanvas3D.canvas);


//--- Event Handlers --------------------------------------

$('#cb_axes' ).on ('change', () => { myCanvas3D.toggleAxes  (); });
$('#cb_grid' ).on ('change', () => { myCanvas3D.toggleGrid  (); });
$('#cb_floor').on ('change', () => { myCanvas3D.toggleFloor (); });


//--- Startup ---------------------------------------------

try
{
  // Render the current Scene
  myCanvas3D.render ();
}
catch (ex)
{
  ShowException (ex);
}

//--- reset -----------------------------------------------

function reset ()
{
  try
  {
    myCanvas3D.clearScene ();
    myCanvas3D.setLoop (null);
  }
  catch (ex)
  {
    ShowException (ex);
  }
}



//=========================================================
//  Primitives
//=========================================================

//--- Points ----------------------------------------------

export function test_Points ()
{
  try
  {
    reset ();

    let mat;

    for (let i=0; i<500; i++)
    {
      mat = new myCanvas3D.threejs.PointsMaterial ( { color:Utils.randColorNum(), size: Utils.randFloat(0.1,0.5) } );  //, size:1 } );
      mat.sizeAttenuation = false;
      myCanvas3D.addPoint (Utils.randFloat(-5,5), Utils.randFloat(-5,5), Utils.randFloat(-5,5), mat);
    }

    myCanvas3D.render ();
  }
  catch (ex)
  {
    ShowException (ex);
  }
}

//--- Lines -----------------------------------------------

export function test_Lines ()
{
  try
  {
    reset ();

    let mat;

    for (let i=0; i<100; i++)
    {
      mat = new myCanvas3D.threejs.LineBasicMaterial ( { color:Utils.randColorNum() } );
      myCanvas3D.addLine (Utils.randFloat(-5,5), Utils.randFloat(-5,5), Utils.randFloat(-5,5),
                          Utils.randFloat(-5,5), Utils.randFloat(-5,5), Utils.randFloat(-5,5), mat);
    }

    myCanvas3D.render ();
  }
  catch (ex)
  {
    ShowException (ex);
  }
}

//--- Planes ----------------------------------------------

export function test_Planes ()
{
  try
  {
    reset ();

    let mat;

    for (let i=0; i<100; i++)
    {
      mat = new myCanvas3D.threejs.MeshStandardMaterial ( { color:Utils.randColorNum() } );
      myCanvas3D.addPlane (Utils.randFloat(-5,5), Utils.randFloat(-5,5), Utils.randFloat(-5,5),  // (x, y, z, width, height, rotX=0, rotY=0, rotZ=0, material);
                           Utils.randFloat(0.1,3.0), Utils.randFloat(0.1,3.0),
                           Utils.randFloat(-3,3), Utils.randFloat(-3,3), Utils.randFloat(-3,3),
                           mat);
    }

    myCanvas3D.render ();
  }
  catch (ex)
  {
    ShowException (ex);
  }
}

//--- Boxes -----------------------------------------------

export function test_Boxes ()
{
  try
  {
    reset ();

    let mat;

    for (let i=0; i<50; i++)
    {
      mat = new myCanvas3D.threejs.MeshStandardMaterial ( { color:Utils.randColorNum() } );
      myCanvas3D.addBox (Utils.randFloat(-5,5), Utils.randFloat(-5,5), Utils.randFloat(-5,5),
                         Utils.randFloat(0.1,2.0), Utils.randFloat(0.1,2.0), Utils.randFloat(0.1,2.0),
                         mat);
    }

    myCanvas3D.render ();
  }
  catch (ex)
  {
    ShowException (ex);
  }
}



//=========================================================
//  Examples
//=========================================================

//--- test_Cube3D -----------------------------------------

export function test_Cube3D ()
{
  try
  {
    reset ();

    const cube = myCanvas3D.addBox (0,1.5,0,  1,1,1);

    // myCanvas3D.camera.position.set (0, 2, 5);
    myCanvas3D.orbitControls.target.set (0, 1.5, 0);

    // Create an animation function
    // This function renders the Scene and moves all objects, camera position, lighting, etc.
    function animate ()
    {
      // Render the current Scene
      myCanvas3D.render();
      // myCanvas3D.orbitControls.update();

      // Rotate the Cube slightly
      cube.rotation.x += 0.02;
      cube.rotation.y += 0.02;
    }

    myCanvas3D.setLoop (animate);
  }
  catch (ex)
  {
    ShowException (ex);
  }
}

//--- test_Wave3D -----------------------------------------

export function test_Wave3D ()
{
  try
  {
    reset ();

    const cubeGeometry = new myCanvas3D.threejs.BoxGeometry (.04, .04, .04);
    const cubeMaterial = new myCanvas3D.threejs.MeshStandardMaterial ({ color: 0x4040C0 });

    // Create a wave of points
    for (let x=-22; x<22; x+=.3)
    {
      for (let z=-22; z<22; z+=.3)
      {
        const cube = new myCanvas3D.threejs.Mesh (cubeGeometry, cubeMaterial);
        const p    = Math.sqrt(x*x + z*z);
        const y    = 10 * Math.sin (2 * p) / p;
        cube.position.set (x, y, z);
        myCanvas3D.scene.add (cube);
      }
    }

    myCanvas3D.camera.position.set (0, 10, 20);
    myCanvas3D.orbitControls.target.set (0, 0, 0);

    // Render first frame
    myCanvas3D.render ();
  }
  catch (ex)
  {
    ShowException (ex);
  }
}

//--- test_Lidar ------------------------------------------

export function test_Lidar ()
{
  try
  {
    reset ();



    myCanvas3D.addLine (0,0,0,  4,4,4);




    myCanvas3D.render ();
  }
  catch (ex)
  {
    ShowException (ex);
  }
}

//--- test_Cosmic -----------------------------------------

export function test_Cosmic ()
{
  try
  {
    reset ();





    // Create an animation function
    // This function renders the Scene and moves all objects, camera position, lighting, etc.
    function animate ()
    {
      // Render the current Scene
      myCanvas3D.render();
      // myCanvas3D.orbitControls.update();

      // Move camera thru space



    }

    myCanvas3D.setLoop (animate);
  }
  catch (ex)
  {
    ShowException (ex);
  }
}
