if(!Detector.webgl)
    Detector.addGetWebGLMessage();

THREE.Cache.enabled = true;

var container, stats, permalink, hex, color;

var camera, cameraTarget, scene, renderer;
var group, textMesh1, textMesh2, textGeo, materials;
var autoRotateRadius;
var firstLetter = true;

var text = "UNREAL ENGINE";
    height = 20,
    size = 70,
    hover = 30,
    curveSegments = 4,
    bevelThickness = 2,
    bevelSize = 1.5,
    bevelSegments = 3,
    bevelEnabled = true,

    font = undefined,
    fontName = "optimer",// helvetiker, optimer, gentilis, droid sans, droid serif
    fontWeight = "bold";// normal bold

var mirror = true;
var fontMap = {
    "helvetiker": 0,
    "optimer": 1,
    "gentilis": 2,
    "droid/droid_sans": 3,
    "droid/droid_serif": 4
};

var weightMap = {
    "regular": 0,
    "bold": 1
};

var reverseFontMap = [];
var reverseWeightMap = [];

for (var i in fontMap)
{
    reverseFontMap[fontMap[i]] = i;
}

for (var i in weightMap)
{
    reverseWeightMap[weightMap[i]] = i;
}

var targetRotation = 0;
var targetRotationOnMouseDown = 0;

var mouseX = 0;
var mouseXOnMouseDown = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var fontIndex = 1;

init();
animate();

function decimalToHex(d) {
    var hex = Number(d).toString(16);
    hex = "000000".substr(0, 6 - hex.length) + hex;
    return hex.toUpperCase();
}

function init() {
    container = document.createElement('div');
    document.body.appendChild(container);

    // permalink = document
    // CAMERA
    camera = new THREE.PerspectiveCamera(30, window.innerWidth/ window.innerHeight, 1, 1500);
    camera.position.set(0, 400, 700);

    cameraTarget = new THREE.Vector3(0, 150, 0);

    // SCENE
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 250, 1400);
    // scene.fog = new THREE.Fog(0x01000000, 250, 1400);

    var dirLight = new THREE.DirectionalLight(0xffffff, 0.125);
    dirLight.position.set(0, 0, 1).normalize();
    scene.add(dirLight);

    var pointLight = new THREE.PointLight(0xffffff, 1.5);
    pointLight.position.set(0, 100, 90);
    scene.add(pointLight);

    // Get text from hash
    /*var hash = document.location.hash.substr(1);

    if (hash.length !== 0)
    {
        var colorhash = hash.substring(0, 6);
        var fonthash = hash.substring(6, 7);
    }*/

    pointLight.color.setHSL(Math.random(), 1, 0.5);
    // hex = decimalToHex(pointLight.color.getHex());


    materials = [
        new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true} ), // front
        new THREE.MeshPhongMaterial( { color: 0xffffff } )// side
    ];

    group = new THREE.Group();
    group.position.y = 100;

    scene.add(group);

    loadFont();

    // PLANE
    var plane = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(10000, 10000),
        new THREE.MeshBasicMaterial( { color: 0xffffff, opacity: 0.5, transparent: true })
    );
    plane.position.y = 100;
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);

    // RENDERER
    renderer = new THREE.WebGLRenderer( {antialias: true } );
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);


    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);
    // document.addEventListener('keypress', onDocumentKeyPress, false);
    // document.addEventListener('keydown', onDocumentKeyDown, false);





}




function loadFont() {
    var loader = new THREE.FontLoader();
    loader.load('fonts/' + fontName + '_' + fontWeight + '.typeface.json', function (response){
        font = response;
        refreshText();
    });
}




function createText() {
    textGeo = new THREE.TextBufferGeometry(text, {
        font: font,
        size: size,
        height: height,
        curveSegments: curveSegments,

        bevelThickness: bevelThickness,
        bevelSize: bevelSize,
        bevelEnabled:bevelEnabled,

        material:0,
        extrudeMaterial:1
    });

    textGeo.computeBoundingBox();
    textGeo.computeVertexNormals();

    if (!bevelEnabled) {
        var triangleAreaHeuristics = 0.1 * (height * size);
        for (var i = 0; i < textGeo.faces.length; i++) {
            var face = textGeo.faces[i];
            if (face.materialIndex == 1) {
                for(var j = 0; j < face.vertexNormals.length; j++) {
                    face.vertexNormals[j].z = 0;
                    face.vertexNormals[j].normalize();
                }

                var va = textGeo.vertices[face.a];
                var vb = textGeo.vertices[face.b];
                var vc = textGeo.vertices[face.c];

                var s = THREE.GeometryUtils.triangleArea(va, vb, vc);

                if( s > triangleAreaHeuristics) {
                    for (var j = 0; j < face.vertexNormals.length; j++) {
                        face.vertexNormals[j].copy(face.normal);
                    }
                }
            }
        }
    }

    var centerOffset = -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

    textMesh1 = new THREE.Mesh( textGeo, materials);

    textMesh1.position.x = centerOffset;
    textMesh1.position.y = hover;
    textMesh1.position.z = 0;

    textMesh1.rotation.x = 0;
    textMesh1.rotation.y = Math.PI * 2;
    textMesh1.rotation.z = 0;

    group.add(textMesh1);

    if (mirror) {
        textMesh2 = new THREE.Mesh( textGeo, materials );

        textMesh2.position.x = centerOffset;
        textMesh2.position.y = -hover;
        textMesh2.position.z = height;

        textMesh2.rotation.x = Math.PI;
        textMesh2.rotation.y = Math.PI * 2;

        group.add( textMesh2 );
    }




}


function refreshText() {
    group.remove(textMesh1);
    if( mirror)
        group.remove(textMesh2);
    if( !text)
        return;
    createText();
}


function onDocumentKeyDown( event ) {
    if ( firstLetter_) {
        firstLetter = false;
        text = "";
    }

    var keyCode = event.keyCode;

    // backspace
    if ( keyCode == 8) {
        event.preventDefault();
        text = text.substring( 0, text.length - 1);
        refreshText();

        return false;
    }
}
function onDocumentMouseDown( event ) {
    event.preventDefault();

    document.addEventListener( 'mousemove', onDocumentMouseMove, false);
    document.addEventListener( 'mouseup', onDocumentMouseUp, false );
    document.addEventListener( 'mouseout', onDocumentMouseOut, false);

    mouseXOnMouseDown = event.clientX - windowHalfX;
    targetRotationOnMouseDown = targetRotation;

}

function onDocumentMouseMove( event ) {
    mouseX = event.clientX - windowHalfX;
    targetRotation = targetRotationOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.02;
}

function onDocumentMouseUp( event ) {
    document.removeEventListener( 'mousemove', onDocumentMouseMove, false);
    document.removeEventListener( 'mouseup', onDocumentMouseMove, false);
    document.removeEventListener( 'mouseout', onDocumentMouseOut, false);
}

function onDocumentMouseOut( event ) {
    document.removeEventListener( 'mousemove', onDocumentMouseMove, false);
    document.removeEventListener( 'mouseup', onDocumentMouseMove, false);
    document.removeEventListener( 'mouseout', onDocumentMouseOut, false);
}


function onDocumentTouchStart ( event ) {
    if ( event.touches.length == 1 ) {
        event.preventDefault();

        mouseXOnMouseDown = event.touches[ 0 ].pageX - windowHalfX;
        targetRotationOnMouseDown = targetRotation;
    }
}

function onDocumentTouchMove( event ) {
    if ( event.touches.length == 1) {
        event.preventDefault();

        mouseX = event.touches[ 0 ].pageX - windowHalfX;
        targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown) * 0.05;
    }

}


function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {

    var timer = Date.now() * 0.0005;

    autoRotateRadius = 800 + 200 * Math.cos( 2 * timer);

    group.rotation.y += (targetRotation -  group.rotation.y) * 0.05;
    camera.position.x = Math.sin( timer ) * autoRotateRadius;
    camera.position.z = Math.cos( timer ) * autoRotateRadius;

    camera.lookAt(cameraTarget);

    renderer.clear();
    renderer.render(scene, camera);
}