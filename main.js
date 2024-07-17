import * as BABYLON from '@babylonjs/core'; // imported babylon.js directory 
import * as CANNON from 'cannon'; // i add cannon library to import the physics
import * as GUI from "@babylonjs/gui/2D";
import "@babylonjs/loaders";


const canvas = document.getElementById('renderCanvas'); // created canvas 
const engine = new BABYLON.Engine(canvas, true); // created engine 
var camera;
// create scene function
  var createScene =  function () { 

  // create simple scene
  var scene = new BABYLON.Scene(engine);

  // i enabled physics
  scene.enablePhysics(new BABYLON.Vector3(0, -30, 0), new BABYLON.CannonJSPlugin(true, 20, CANNON));
    scene.collisionsEnabled = true 


  // create camera and to determine possition 
  camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(-10, 7, 0), scene);
  camera.ellipsoid = new BABYLON.Vector3(1, 5, 1);  // create camera elipsoid for camera collision
  camera.ellipsoidOffset = new BABYLON.Vector3(0, 0.9, 0);  // i determine elipsoid position. (camera mid)
  camera.checkCollisions = true; // i turned on camera collisions
  camera.applyGravity = true; // i turned on gravity
  camera.attachControl(true);
  camera.speed = 1.2;



  // created a lights
  var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.7;

    // i created a ground and set a floor texture than added physics same logic
    var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 100, height: 100 }, scene);
    ground.position = new BABYLON.Vector3(0, 0, 0);
    ground.material = new BABYLON.StandardMaterial("groundMat", scene);
    ground.material.diffuseTexture = new BABYLON.Texture("assets/floor.jpg", scene);
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);
    ground.checkCollisions = true;

  BABYLON.SceneLoader.ImportMesh("", "assets/", "door.glb", scene, function (meshes) { 
  var door = meshes[0]; 
  door.position = new BABYLON.Vector3(0, 10, 0); 
  meshes.forEach(function(mesh) {
    meshes.forEach(function(mesh) {
      mesh.checkCollisions = true;
      });      
});
});
BABYLON.SceneLoader.ImportMesh("", "assets/", "roof.glb", scene, function (meshes) { 
  var roof = meshes[0]; 
  roof.position = new BABYLON.Vector3(0, 10, 0); 
  meshes.forEach(function(mesh) {
    meshes.forEach(function(mesh) {
      mesh.checkCollisions = true;
      });      
});
});


    const wall_textures = ["brick_room.glb", "black_room.glb", "wooden_room.glb", "white_room.glb"];
    const wall_textures_names = ["brick", "black", "wooden", "white"];
    let currentMeshes = [];
    let currentIndex = 0;
    
    // GUI oluştur
    var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    
    // Butonları oluştur ve ekle
    for (let i = 0; i < wall_textures.length; i++) {
        let button = GUI.Button.CreateSimpleButton("but" + i, wall_textures_names[i]);
        button.width = "150px";
        button.height = "40px";
        button.color = "white";
        button.background = "black";
        button.top = (i * 50 - 75) + "px"; 
        button.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        button.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    
       
        button.onPointerClickObservable.add(() => {
            loadWall(i);
        });
    
        advancedTexture.addControl(button);
    }
    
    
    function loadWall(index) {
        currentIndex = index;
    
      
        currentMeshes.forEach(mesh => {
            scene.removeMesh(mesh);
            mesh.dispose();
        });
        currentMeshes = [];
    
        
        BABYLON.SceneLoader.ImportMesh("", "assets/", wall_textures[index], scene, function (meshes) {
            currentMeshes = meshes;
            var wall = meshes[0];
            wall.position = new BABYLON.Vector3(0, 9, 0);
    
            meshes.forEach(function(mesh) {
                mesh.checkCollisions = true;
                mesh.actionManager = new BABYLON.ActionManager(scene);
                mesh.actionManager.registerAction(
                    new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function () {
                        changeTexture();
                    })
                );
            });
        });
    }
    
    
    function changeTexture() {
        let nextIndex = (currentIndex + 1) % wall_textures.length;
        loadWall(nextIndex);
    }
    
  
    loadWall(0);
    
    
    
    
  return scene;
};
// create scene
const scene = createScene();

    engine.runRenderLoop(() => {
        scene.render();
    });

// resize the web page 
window.addEventListener('resize', () => {
    engine.resize();
});