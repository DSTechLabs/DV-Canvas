//=============================================================================
//
//     FILE  : dvCanvas3D_Test.js
//
//   PROJECT : dvCanvas3D.js testing
//
//   AUTHOR  : Bill Daniels
//             Copyright 2023-2024, D+S Tech Labs, Inc.
//             All Rights Reserved
//
//=============================================================================





//--- Load Three.js for WebGL 3D Stuff ---
import * as THREE from 'three';





// Create WebGL Renderer for the canvas element
const canvas3D = document.getElementById ("canvas3D");
const renderer = new THREE.WebGLRenderer ({ canvas:canvas3D, antialias:true });
renderer.setSize (canvas3D.width, canvas3D.height);
renderer.shadowMap.enabled = true;

// Create Scene and Camera
const scene  = new THREE.Scene ();
const camera = new THREE.PerspectiveCamera (60, canvas3D.width / canvas3D.height, 0.1, 50);  // (fov, aspect ratio, near, far)
camera.position.set (0, 2, 5);  // x, z, y

// // Add-ons
// const orbitControls = new OrbitControls( camera, renderer.domElement );
// const gltfLoader = new GLTFLoader();

// Add light to the Scene
const pointLight = new THREE.PointLight (0xFFFFFF, 1000);
pointLight.position.set (5, 10, 10);
pointLight.castShadow = true;




// // Shadow tweeking
// pointLight.shadowBias      = 0.0001;
// pointLight.shadowDarkness  = 0.2;
// pointLight.shadowMapWidth  = 2048;
// pointLight.shadowMapHeight = 2048;




scene.add (pointLight);

//--- Clear scene (except for light) ------------------------------------------

function clearScene ()
{
  for (let i=scene.children.length-1; i>0; i--)
    scene.children[i].removeFromParent();

  // MEMORY LEAK !!!
  // Needs to remove/dispose geometries, materials, textures, shaders, etc.)
  // https://discourse.threejs.org/t/three-js-dispose-things-so-hard/46664/10
}



//=============================================================================
//  App Button Functions - 3D Using three.js
//=============================================================================

//--- canvas3D_Cube -----------------------------------------------------------

export const canvas3D_Cube = function ()
{
  clearScene();

  // Add a Plane (floor) to the Scene
  const planeGeometry = new THREE.PlaneGeometry (100, 200);
  planeGeometry.rotateX (-Math.PI / 2);
  const planeMaterial = new THREE.MeshStandardMaterial();
  const plane = new THREE.Mesh (planeGeometry, planeMaterial);
  plane.receiveShadow = true;
  scene.add (plane);

  // Add a Cube to the Scene
  const cubeGeometry = new THREE.BoxGeometry (1, 1, 1);
  const cubeMaterial = new THREE.MeshStandardMaterial ({ color: 0x4040C0 });
  const cube = new THREE.Mesh (cubeGeometry, cubeMaterial);
  cube.castShadow = cube.receiveShadow = true;
  cube.position.set (0, 1.5, 0);
  scene.add (cube);

  camera.position.set (0, 2, 5);
  camera.lookAt (new THREE.Vector3 (0, 1.5, 0));

  // Create an animation function
  // This function renders the Scene and moves all objects, camera position, lighting, etc.
  function animate()
  {
    // Render the current Scene
    renderer.render (scene, camera);

    // Rotate the Cube slightly
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    // Continue animation
    requestAnimationFrame (animate);
  }

  // Begin the animation
  animate();
}

//--- canvas3D_Wave -----------------------------------------------------------

export const canvas3D_Wave = function ()
{
  clearScene();

  const cubeGeometry = new THREE.BoxGeometry (.04, .04, .04);
  const cubeMaterial = new THREE.MeshStandardMaterial ({ color: 0x4040C0 });

  // Create a wave of points
  for (let x=-22; x<22; x+=.3)
  {
    for (let z=-22; z<22; z+=.3)
    {
      const cube = new THREE.Mesh (cubeGeometry, cubeMaterial);
      const y    = Math.sin (Math.sqrt(x*x + z*z));
      cube.position.set (x, y, z);
      scene.add (cube);
    }
  }

  // Set initial Camera position
  let camX = 0;
  let camY = 5;
  let camZ = 5;
  camera.position.set (camX, camY, camZ);

  const camVector = new THREE.Vector3 (0, 0, 0);
  camera.lookAt (camVector);

  let   angle = 0;
  const step  = 0.01;

  interval = setInterval (() =>
  {
    camX = 10 * Math.sin (angle);
    camZ = 10 * Math.cos (angle);

    camera.position.set (camX, camY, camZ);
    camera.lookAt (camVector);
    renderer.render (scene, camera);

    angle += step;
    if (angle > 6.2832)
      angle = 0;

  }, 30);
}

//--- canvas3D_Pivot ----------------------------------------------------------

export const canvas3D_Pivot = function ()
{
  clearScene();

  // Add a Plane (floor) to the Scene
  const planeGeometry = new THREE.PlaneGeometry (100, 200);
  planeGeometry.rotateX (-Math.PI / 2);
  const planeMaterial = new THREE.MeshStandardMaterial();
  const plane = new THREE.Mesh (planeGeometry, planeMaterial);
  plane.receiveShadow = true;
  scene.add (plane);



  // Add two red pillars
  const pillarMaterial = new THREE.MeshStandardMaterial({ color: 0x600000 });

  const pillar1Geometry = new THREE.BoxGeometry(.2, 4, .2);
  const pillar2Geometry = new THREE.BoxGeometry(.2, 4, .2);
  const pillar1 = new THREE.Mesh(pillar1Geometry, pillarMaterial);
  const pillar2 = new THREE.Mesh(pillar2Geometry, pillarMaterial);
  pillar1.castShadow = pillar1.receiveShadow = true;
  pillar2.castShadow = pillar2.receiveShadow = true;
  pillar1.position.set(-2, 2, -2);
  pillar2.position.set( 2, 2, -2);
  scene.add(pillar1);
  scene.add(pillar2);



  // Set initial Camera position
  let camX = 0;
  let camY = 2;
  let camZ = 10;
  camera.position.set(camX, camY, camZ);

  const camVector = new THREE.Vector3(0, 1.5, 0);
  camera.lookAt(camVector);



  // Render the current Scene
  renderer.render (scene, camera);




  document.addEventListener("keydown", moveCamera);





  let camStep = .1;    // Camera motion step
  let redraw  = false;



  function moveCamera (event)
  {
         if (event.key == "ArrowLeft" ) { camX -= camStep; redraw = true; }
    else if (event.key == "ArrowRight") { camX += camStep; redraw = true; }
    else if (event.key == "ArrowUp"   ) { camZ -= camStep; redraw = true; }
    else if (event.key == "ArrowDown" ) { camZ += camStep; redraw = true; }

    if (redraw)
    {
      camera.position.set (camX, camY, camZ);
      camera.lookAt(camVector);
      renderer.render(scene, camera);
    }
  }


}





// // Create an animation function
// // This function renders the Scene and moves all objects, camera position, lighting, etc.
// function animate()
// {
//   // Render the current Scene
//   renderer.render(scene, camera);
//
//   // Rotate the Cube slightly
//   cube.rotation.x += 0.01;
//   cube.rotation.y += 0.01;
//
//   // Move the cube back/forth
//   cubeZ -= cubeStep;
//   if (cubeZ < -20 || cubeZ > 4) cubeStep *= -1;
//   cube.position.set(cubeX, cubeY, cubeZ);
//
//   // Continue animation
//   requestAnimationFrame(animate);
// }
//
// // Begin the animation
// animate();
