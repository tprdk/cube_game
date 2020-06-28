"use strict";

function setupGameObjects(gl) {
  const gameObjects = {};


  var positions = [-40,0,40];
  
  function getRandomInt() {
    return Math.floor(Math.random()*3);
  }
  //// axis related objects
  //////cube //////

  gameObjects["blueCube"] = new Cube("blueCube",
    gl,
    vec4(0.0, 0.0, 1.0, 1.0),
    new Transform({
      scaling: scalem(10 , 10 , 10),
      translation: translate(positions[getRandomInt()],1,-550),
    })
  );

  gameObjects["yellowCube"] = new Cube("yellowCube",
    gl,
    vec4(0.0,1.0,0.0,1.0),
    new Transform({ scaling: scalem(10,10,10) , 
      translation: translate(positions[getRandomInt()],1,-550),
    })
  );

  //// The main cube
  gameObjects["mainCube"] = new Cube("mainCube",
    gl,
    vec4(1.0 , 0.0, 0.0, 1.0),
    new Transform({ scaling: scalem(10,10,10),translation: translate(0, 1, 52) })
  );

   //////cube //////

   /////start/////

  gameObjects["mainCube"].startFunction = function(obj) {
    // start function runs only once just before the first draw.
    
    //// save the initial translation
    obj.userData["initialTranslation"] = obj.transform.translation;
  };

  gameObjects["yellowCube"].startFunction = function(obj) {
    // start function runs only once just before the first draw.

    //// save the initial translation
    obj.userData["initialTranslation"] = obj.transform.translation;
  };

  gameObjects["blueCube"].startFunction = function(obj) {
    // start function runs only once just before the first draw.

    //// save the initial translation
    obj.userData["initialTranslation"] = obj.transform.translation;
  };

  /////start/////

  /////variables/////

  var score = 0;
  var  difficulty = document.getElementById("difficultySlider").oninput;
  
  document.getElementById("difficultyValue").innerHTML = difficulty ;
  difficulty=0;
  document.getElementById("myButton").onclick = function () {
  
  difficulty= document.getElementById("difficultySlider").value;
  document.getElementById("difficultyValue").innerHTML = difficulty;
  document.getElementById("difficultySlider").oninput = function(event) {
    difficulty = event.target.value;
    document.getElementById("difficultyValue").innerHTML = difficulty;
  };




  document.addEventListener('keydown', function(event) {
    if(event.keyCode == 37) {
      leftArrow(gameObjects["mainCube"]);
    }
    else if(event.keyCode == 39) {
      rightArrow(gameObjects["mainCube"]);
    }
  });
  


  
  function rightArrow (obj) {
    
    const t = obj.transform.translation;
    const x = t[0][3];


    if(x != 40 && difficulty!=0){
      obj.transform.translation = mult(
        translate(40, 0, 0),
        obj.transform.translation
      );
    }

  }

  function leftArrow (obj) {
    
    const t = obj.transform.translation;
    const x = t[0][3];

    if(x != -40 && difficulty!=0){
      obj.transform.translation = mult(
        translate(-40, 0, 0),
        obj.transform.translation
      );
    }
  }
/////update/////
  gameObjects["mainCube"].updateFunction = function(obj) {
    for (const coll of this.collidesWith) {
      console.log(coll.name);
      if (coll.name === "yellowCube" || coll.name === "blueCube") {
        //delete gameObjects["yellowCube"];
        var r = confirm("Your score : "+score+"\nTry again...\nPress OK to play, Cancel to exit");
          if (r == true) {
            window.location.reload();
          } else if (r == false){
            window.close();
          }
        
      }
    }
    // update function runs for each draw operation
    obj.transform.rotation = mult(rotateY(2), obj.transform.rotation);

  };



  gameObjects["yellowCube"].updateFunction = function(obj) {
    // update function runs for each draw operation
    obj.transform.rotation = mult(rotateY(1), obj.transform.rotation);


    ///
    /// moving
    ///

    obj.transform.translation = mult(
      translate(0, 0, difficulty),
      obj.transform.translation
    );

    ///
    /// moving
    ///

    const t = obj.transform.translation;
    const z = t[2][3];

    if (z > 65) {
      obj.transform.translation = translate(positions[getRandomInt()],1,-500);
      
    }
  };



  gameObjects["blueCube"].updateFunction = function(obj) {
    // update function runs for each draw operation
    obj.transform.rotation = mult(rotateY(1), obj.transform.rotation);


    ///
    /// moving
    ///

    obj.transform.translation = mult(
      translate(0, 0, difficulty),
      obj.transform.translation
    );

    ///
    /// moving
    ///

    const t = obj.transform.translation;
    const z = t[2][3];

    if (z > 65) {
      obj.transform.translation = translate(positions[getRandomInt()],1,-500);
      score++;
      document.getElementById("score").value = score;
    }
  };

}
  /////update/////
  
  //// The simulation ground
  gameObjects["ground"] = new Cube("ground",
    gl,
    vec4(0.85, 0.90, 0.95, 1.0),
    new Transform({ scaling: scalem(200, 0.1, 1400) })
  );

  
  gameObjects["background"] = new Cube("background",
  gl,
  vec4(0.40, 0.40, 0.50, 1.0),
  new Transform({translation: translate(0,-100,-600), scaling: scalem(200, 200, 0.1) })
  );

  gameObjects["inbackground"] = new Cube("inbackground",
  gl,
  vec4(0.45, 0.45, 0.55, 1.0),
  new Transform({translation: translate(0,-100,-600), scaling: scalem(300, 300, 0.1) })
  );

  //// return all the objects
  return gameObjects;
}

function mults(scalar, transform) {
  return mult(scalem(scalar, scalar, scalar), transform);
}

//// time functionality
class GameTime {
  static deltaTime = 0;
  static timestamp = -1;

  static updateTimestamp(timestamp) {
    if (GameTime.timestamp < 0) GameTime.timestamp = timestamp;
    GameTime.deltaTime = timestamp - GameTime.timestamp;
    GameTime.timestamp = timestamp;
  }
}

//// camera parameters
var near;
var far;
var radius;
var theta;
var phi;
var fov;
var aspect;
var eye;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

//// a class that represents the gameobject transform matrices
class Transform {
  constructor({
    scaling = mat4(),
    rotation = mat4(),
    translation = mat4()
  } = {}) {
    this.scaling = scaling;
    this.rotation = rotation;
    this.translation = translation;
  }
  modelMatrix() {
    return mult(this.translation, mult(this.rotation, this.scaling));
  }
}

class NaiveCollider {
  constructor(gameObject, vertices) {
    this.vertices = vertices;
    this.gameObject = gameObject;
  }

  detectsCollisionWith(other) {
    // iterate over vertices of the other, if any vertice is inside
    // then we have a collision
    const otherVertices = other.transformedVertices();
    const inverseTransform = inverse4(this.gameObject.transform.modelMatrix());

    for (const otherVertice of otherVertices) {
      if (this.includes(mult(inverseTransform, otherVertice))) return true;
    }
    return false;
  }

  transformedVertices() {
    const vertices = [];
    const modelMatrix = this.gameObject.transform.modelMatrix();
    for (const vertice of this.vertices) {
      vertices.push(mult(modelMatrix, vertice));
    }
    return vertices;
  }
}

class NaiveBoxCollider extends NaiveCollider {
  constructor(gameObject, vertices) {
    super(gameObject, vertices);
  }
  includes(v) {
    const x = v[0];
    const y = v[1];
    const z = v[2];
    if (-0.5 <= x && x <= 0.5 && 0 <= y && y <= 1 && -0.5 <= z && z <= 0.5) {
      return true;
    }
    return false;
  }
}

//// base class for game objects
class GameObject {
  constructor(name, gl, transform) {
    //// the user can use object to store arbitrary values
    this.userData = {};

    //// WebGL rendering context
    this.gl = gl;
    this.name = name;

    //// the program objects obtained from shaders
    this.program = initShaders(gl, "vertex-shader", "fragment-shader");

    //// Model view projection matrices
    this.transform = transform;
    this.viewMatrix = mat4();
    this.projectionMatrix = mat4();

    this.collider = -1;
    this.collidesWith = [];

    this.updateFunction = -1;
    this.startFunction = -1;
  }

  update() {
    if (this.updateFunction != -1) {
      this.updateFunction(this);
    }
  }
  start() {
    if (this.startFunction != -1) {
      this.startFunction(this);
    }
  }

  detectsCollisionWith(other) {
    if (this.collider === -1) return false;
    if (other.collider === -1) return false;
    if (this.collider.detectsCollisionWith(other.collider)) return true;

    return false;
  }
}

//// Cube is a game object
class Cube extends GameObject {
  constructor(name, gl, color, transform) {
    super(name, gl, transform);

    //// Model buffers and attributes
    [this.pointsArray, this.colorsArray] = cubePointsAndColors(color);
    this.numVertices = 36;
    this.collisionRadius = mult(translate(0, 0.5, 0), scalem(0.5, 0.5, 0.5));
    this.initAttributeBuffers();

    this.collider = new NaiveBoxCollider(this, cubeVertices());

    //// Uniform Locations
    this.modelViewProjectionMatrixLoc = gl.getUniformLocation(
      this.program,
      "modelViewProjectionMatrix"
    );
  }

  initAttributeBuffers() {
    //// color attribute
    this.cBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      flatten(this.colorsArray),
      this.gl.STATIC_DRAW
    );
    this.vColor = this.gl.getAttribLocation(this.program, "vColor");

    //// position attribute
    this.vBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      flatten(this.pointsArray),
      this.gl.STATIC_DRAW
    );
    this.vPosition = this.gl.getAttribLocation(this.program, "vPosition");
  }

  draw() {
    //// color attribute
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cBuffer);
    this.gl.vertexAttribPointer(this.vColor, 4, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(this.vColor);

    //// position attribute
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vBuffer);
    this.gl.vertexAttribPointer(this.vPosition, 4, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(this.vPosition);

    //// modelViewProjectionMatrix uniform
    const modelViewProjectionMatrix = mult(
      this.projectionMatrix,
      mult(this.viewMatrix, this.transform.modelMatrix())
    );
    this.gl.uniformMatrix4fv(
      this.modelViewProjectionMatrixLoc,
      false,
      flatten(modelViewProjectionMatrix)
    );

    //// draw
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.numVertices);
  }
} // class Cube

window.onload = function init() {
  const gl = setupWebGL();

  const gameObjects = setupGameObjects(gl);

  setupGUI();

  //// run the start() of all game objects and then do the first rendering
  for (const [name, gameObject] of Object.entries(gameObjects)) {
    gameObject.start();
  }
  render(gl, gameObjects);
};
function render(gl, gameObjects, timestamp) {
  if (timestamp) GameTime.updateTimestamp(timestamp);

  //// clear the background
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  //// camera settings
  eye = vec3(
    0,30,70
  );
  const viewMatrix = lookAt(eye, at, up);
  const projectionMatrix = perspective(fov, aspect, near, far);

  //// detect collisions
  const objects = Object.values(gameObjects);
  for (const object of objects) object.collidesWith = [];
  for (let i = 0; i < objects.length; i++) {
    const current = objects[i];
    for (let j = i + 1; j < objects.length; j++) {
      const other = objects[j];
      if (
        current.detectsCollisionWith(other) ||
        other.detectsCollisionWith(current)
      ) {
        current.collidesWith.push(other);
        other.collidesWith.push(current);
      }
    }
  }

  //// update all objects
  for (const [name, gameObject] of Object.entries(gameObjects)) {
    gameObject.update();
  }

  //// draw all objects
  for (const [name, gameObject] of Object.entries(gameObjects)) {
    gameObject.viewMatrix = viewMatrix;
    gameObject.projectionMatrix = projectionMatrix;
    gl.useProgram(gameObject.program);
    gameObject.draw();
  }

  //// call self for recursion
  requestAnimFrame(timestamp => render(gl, gameObjects, timestamp));
}

function setupWebGL() {
  const canvas = document.getElementById("gl-canvas");
  const gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }
  gl.viewport(0, 0, canvas.width, canvas.height);
  aspect = 2;
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  return gl;
}

////
function setupGUI() {
  far = 1000;

  near = 0.3;
  

  radius = 4;
 
  theta = 51;

  phi = 83;
  
  fov = 90;
  
}

function cubeVertices() {
  return [
    vec4(-0.5, 0, 0.5, 1.0),
    vec4(-0.5, 1, 0.5, 1.0),
    vec4(0.5, 1, 0.5, 1.0),
    vec4(0.5, 0, 0.5, 1.0),
    vec4(-0.5, 0, -0.5, 1.0),
    vec4(-0.5, 1, -0.5, 1.0),
    vec4(0.5, 1, -0.5, 1.0),
    vec4(0.5, 0, -0.5, 1.0)
  ];
}

function cubePointsAndColors(color) {
  var pointsArray = [];
  var colorsArray = [];
  var vertices = cubeVertices();
  var vertexColors = [color, color, color, color, color, color, color, color];
  function quad(a, b, c, d) {
    pointsArray.push(vertices[a]);
    colorsArray.push(vertexColors[a]);
    pointsArray.push(vertices[b]);
    colorsArray.push(vertexColors[a]);
    pointsArray.push(vertices[c]);
    colorsArray.push(vertexColors[a]);
    pointsArray.push(vertices[a]);
    colorsArray.push(vertexColors[a]);
    pointsArray.push(vertices[c]);
    colorsArray.push(vertexColors[a]);
    pointsArray.push(vertices[d]);
    colorsArray.push(vertexColors[a]);
  }

  quad(1, 0, 3, 2);
  quad(2, 3, 7, 6);
  quad(3, 0, 4, 7);
  quad(6, 5, 1, 2);
  quad(4, 5, 6, 7);
  quad(5, 4, 0, 1);
  return [pointsArray, colorsArray];
}
