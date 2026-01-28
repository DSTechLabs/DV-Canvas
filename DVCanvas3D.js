//=========================================================
//
//     FILE  : DVCanvas3D.js
//
//   PROJECT : Any browser-based project
//
//  FUNCTION : Wrapper methods for Three.js plus some Data Visualization methods
//
//     NOTES : This class takes the ID to your canvas element.
//             ∙ The canvas element performs better when its height
//               is a power of 2 (height = 16, 32, 64, 128, 256, 512, 1024, ...
//             ∙ Do not use style to set canvas dimensions (causes blurry dithered plots).
//             ∙ Full Spec   : https://html.spec.whatwg.org/multipage/canvas.html
//             ∙ Performance : https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas
//             ∙ Compositing : https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
//
//   AUTHOR  : Bill Daniels
//             Copyright 2025-2026, D+S Tech Labs, Inc.
//             All Rights Reserved
//
//=========================================================

//--- Load Three.js for WebGL 3D Stuff ---
import * as THREE from "three";                                       // "https://cdn.jsdelivr.net/npm/three@0.182.0/build/three.module.js";
import { OrbitControls } from "three/addons/three.orbitControls.js";  // "https://cdn.jsdelivr.net/npm/three@0.182.0/examples/jsm/controls/OrbitControls.js";


//=========================================================
//  DVCanvas3D class (3D Data Visualization Canvas)
//=========================================================

export class DVCanvas3D
{
  //--- Public properties ---------------------------------
  threejs       = THREE;
  canvas3D      = undefined;
  renderer      = undefined;
  scene         = undefined;
  camera        = undefined;
  light         = undefined;
  floor         = undefined;
  axes          = undefined;
  orbitControls = undefined;

  //--- Constructor ---------------------------------------

  constructor (canvasElementID)
  {
    try
    {
      // Get provided canvas element
      this.canvas3D = document.getElementById (canvasElementID);  // Must have width and height attributes set in the HTML
      const cWidth  = this.canvas3D.getAttribute ("width" );
      const cHeight = this.canvas3D.getAttribute ("height");

      // Create WebGL Renderer for the canvas element
      // this.canvas3D = document.getElementById (canvasElementID);
      this.renderer = new THREE.WebGLRenderer ({ canvas:this.canvas3D, antialias:true });
      this.renderer.setSize (cWidth, cHeight);
      this.renderer.shadowMap.enabled = true;

      // Create Scene and Camera
      this.scene  = new THREE.Scene ();
      this.camera = new THREE.PerspectiveCamera (60, this.canvas3D.width / this.canvas3D.height, 0.1, 50);  // (fov, aspect ratio, near, far)
      this.camera.position.set (0, 2, 5);  // x, z, y


      // // Ambient Light
      // this.light = new THREE.AmbientLight ();


      // // Point Light
      // this.light = new THREE.PointLight (0xFFFFFF, 1000);
      // this.light.position.set (5, 10, 10);
      // this.light.castShadow = true;


      // Directional Light
      this.light = new THREE.DirectionalLight (0xFFFFFF, 2);
      this.light.position.set (5, 10, 10);
      this.light.castShadow = true;

      // // Shadow tweeking
      // this.light.shadowBias      = 0.0001;
      // this.light.shadowDarkness  = 0.2;
      // this.light.shadowMapWidth  = 2048;
      // this.light.shadowMapHeight = 2048;
      this.scene.add (this.light);


      // Axes
      this.axes = new THREE.AxesHelper (3);
      this.axes.visible = false;
      this.scene.add (this.axes);


      // Grid
      this.grid = new THREE.GridHelper (20, 20);
      this.grid.visible = false;
      this.scene.add (this.grid);


      // Floor (Ground Plane)
      this.floor = this.addPlane (0, 0, 0, 20, 20, -Math.PI/2);
      this.floor.visible = false;


      // Add-ons
      this.orbitControls = new OrbitControls (this.camera, this.renderer.domElement);
      // const gltfLoader = new GLTFLoader();


      // First render
      this.render ();


      // Only render when camera moves
      this.orbitControls.addEventListener ('change', () => { this.render(); });
    }
    catch (ex)
    {
      ShowException (ex);
    }
  }


  //--- Remove Object -------------------------------------
  // Caller should nullify its reference to the object

  removeObject (object)
  {
    try
    {
      if (!object) return;

      this.scene.remove (object);

      if (object.geometry)
        object.geometry.dispose ();

      if (object.material)
      {
        if (Array.isArray (object.material))
        {
          object.material.forEach (material =>
          {
            // Dispose textures first
            Object.keys (material).forEach (key =>
            {
              if (material[key] && material[key].isTexture)
                material[key].dispose ();
            });

            // Dispose material
            material.dispose ();
          });
        }
        else
          object.material.dispose ();
      }
    }
    catch (ex)
    {
      ShowException (ex);
    }
  }

  //--- Clear scene (except for light) --------------------

  clearScene ()
  {
    try
    {
      // Remove all objects except the first four(4) (Light, Axes, Grid and Floor)
      for (let i=this.scene.children.length-1; i>3; i--)
        this.removeObject (this.scene.children[i]);
    }
    catch (ex)
    {
      ShowException (ex);
    }
  }

  //--- render --------------------------------------------

  render ()
  {
    try
    {
      // Render the current Scene
      this.renderer.render (this.scene, this.camera);
    }
    catch (ex)
    {
      ShowException (ex);
    }
  }

  //--- setLoop -------------------------------------------

  setLoop (animateFunction)
  {
    try
    {
      this.renderer.setAnimationLoop (animateFunction);
    }
    catch (ex)
    {
      ShowException (ex);
    }
  }

  //--- toggleAxes ----------------------------------------

  toggleAxes ()
  {
    try
    {
      this.axes.visible = !this.axes.visible;
      this.render ();
    }
    catch (ex)
    {
      ShowException (ex);
    }
  }

  //--- toggleGrid ----------------------------------------

  toggleGrid ()
  {
    try
    {
      this.grid.visible = !this.grid.visible;
      this.render ();
    }
    catch (ex)
    {
      ShowException (ex);
    }
  }

  //--- toggleFloor ---------------------------------------

  toggleFloor ()
  {
    try
    {
      this.floor.visible = !this.floor.visible;
      this.render ();
    }
    catch (ex)
    {
      ShowException (ex);
    }
  }


  //=======================================================
  //  Primitives
  //=======================================================

  //--- addPoint ------------------------------------------

  addPoint (x, y, z, material)
  {
    let point = undefined;

    try
    {
      // Add a Point to the Scene
      const points = [];
      points.push (new THREE.Vector3 (x, y, z));

      const pointGeometry = new THREE.BufferGeometry().setFromPoints (points);

      let pointMaterial = material;
      if (material == undefined)
      {
        pointMaterial = new THREE.PointsMaterial ({ color: 0xF0F0F0 });
        pointMaterial.sizeAttenuation = false;
      }

      point = new THREE.Points (pointGeometry, pointMaterial);

      this.scene.add (point);
    }
    catch (ex)
    {
      ShowException (ex);
    }

    return point;
  }

  //--- addLine -------------------------------------------

  addLine (x1, y1, z1, x2, y2, z2, material)
  {
    let line = undefined;

    try
    {
      // Add a Line to the Scene
      const points = [];
      points.push (new THREE.Vector3 (x1, y1, z1));  // Start point
      points.push (new THREE.Vector3 (x2, y2, z2));  // End point

      const lineGeometry = new THREE.BufferGeometry().setFromPoints (points);
      const lineMaterial = material == undefined ? new THREE.LineBasicMaterial ({ color: 0xFFFFFF }) : material;
      line = new THREE.Line (lineGeometry, lineMaterial);

      this.scene.add (line);
    }
    catch (ex)
    {
      ShowException (ex);
    }

    return line;
  }

  //--- addPlane ------------------------------------------

  addPlane (x, y, z, width, height, rotX=0, rotY=0, rotZ=0, material)
  {
    let plane = undefined;

    try
    {
      // Add a Plane to the Scene
      const planeGeometry = new THREE.PlaneGeometry (width, height);
      const planeMaterial = material == undefined ? new THREE.MeshStandardMaterial ( { color: 0xC0C0C0 } ) : material;
      plane = new THREE.Mesh (planeGeometry, planeMaterial);

      plane.castShadow = plane.receiveShadow = true;
      plane.position.set (x, y, z);
      plane.rotation.set (rotX, rotY, rotZ);

      this.scene.add (plane);
    }
    catch (ex)
    {
      ShowException (ex);
    }

    return plane;
  }

  //--- addBox --------------------------------------------

  addBox (x, y, z, width, height, depth, material)
  {
    let box = undefined;

    try
    {
      // Add a Box to the Scene
      const boxGeometry = new THREE.BoxGeometry (width, height, depth);
      const boxMaterial = material == undefined ? new THREE.MeshStandardMaterial({ color: 0x4040C0 }) : material;
      box = new THREE.Mesh (boxGeometry, boxMaterial);
      box.castShadow = box.receiveShadow = true;
      box.position.set (x, y, z);

      this.scene.add (box);
    }
    catch (ex)
    {
      ShowException (ex);
    }

    return box;
  }








}
