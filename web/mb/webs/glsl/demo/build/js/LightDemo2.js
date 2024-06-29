if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
THREE.Cache.enabled = true;
var container, stats;
var autoRotateRadius = 1600;
var camera, scene, renderer, controls;
var particleLight;

var loader = new THREE.FontLoader();


var permalink, hex, color;

var cameraTarget;

var group, textMesh1, textMesh2, textGeo, materials;

var firstLetter = true;


var text = "BIGBANG",
    height = 20,
    size = 70,
    hover = 30,
    curveSegments = 4,
    bevelThickness = 2,
    bevelSize = 1.5,
    bevelSegments = 3,
    bevelEnabled = true,

    font = undefined,
    fontName = "optimer",// helvetiker, op[timer, gentilis, droid sans, droid serif
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
    "rgular": 0,
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








loader.load( 'fonts/gentilis_regular.typeface.json', function ( font ) {

    init( font );
    animate();

} );



function init( font ) {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.set( 0.0, 400, 400 * 3.5 );



    var reflectionCube = new THREE.CubeTextureLoader()
        .setPath( 'textures/cube/SwedishRoyalCastle/' )
        .load( [ 'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg' ] );
    reflectionCube.format = THREE.RGBFormat;

    scene = new THREE.Scene();
    scene.background = reflectionCube;

    // scene.fog = new THREE.Fog(0x00000, 250, 1400);

    // LIGHTS 2
    // var dirLight = new THREE.DirectionalLight(0xffffff, 0.125);
    var dirLight = new THREE.DirectionalLight(0xff0000, 0.125);
    dirLight.position.set(0, 0, 1).normalize();
    scene.add(dirLight);

    // var pointLight2 =


    // Get text from a hash
    var hash = document.location.hash.substr(1);

    if (hash.length !== 0)
    {
        var colorhash = hash.substring(0, 6);
        var fonthash = hash.substring(6, 7);
    }




    // Materials

    var imgTexture = new THREE.TextureLoader().load( "textures/planets/moon_1024.jpg" );
    imgTexture.wrapS = imgTexture.wrapT = THREE.RepeatWrapping;
    imgTexture.anisotropy = 16;
    imgTexture = null;

    var shininess = 50, specular = 0x333333, bumpScale = 1;

    var materials = [];

    var cubeWidth = 400;
    var numberOfSphersPerSide = 5;
    var sphereRadius = ( cubeWidth / numberOfSphersPerSide ) * 0.8 * 0.5;
    var stepSize = 1.0 / numberOfSphersPerSide;

    var geometry = new THREE.SphereBufferGeometry( sphereRadius, 32, 16 );

    for ( var alpha = 0, alphaIndex = 0; alpha <= 1.0; alpha += stepSize, alphaIndex ++ ) {

        var specularShininess = Math.pow( 2, alpha * 10 );

        for ( var beta = 0; beta <= 1.0; beta += stepSize ) {

            var specularColor = new THREE.Color( beta * 0.2, beta * 0.2, beta * 0.2 );

            for ( var gamma = 0; gamma <= 1.0; gamma += stepSize ) {

                // basic monochromatic energy preservation
                var diffuseColor = new THREE.Color().setHSL( alpha, 0.5, gamma * 0.5 ).multiplyScalar( 1 - beta * 0.2 );

                var material = new THREE.MeshPhongMaterial( {
                    map: imgTexture,
                    bumpMap: imgTexture,
                    bumpScale: bumpScale,
                    color: diffuseColor,
                    specular: specularColor,
                    reflectivity: beta,
                    shininess: specularShininess,
                    envMap: alphaIndex % 2 === 0 ? null : reflectionCube
                } );

                var mesh = new THREE.Mesh( geometry, material );

                mesh.position.x = alpha * 400 - 200;
                mesh.position.y = beta * 400 - 200;
                mesh.position.z = gamma * 400 - 200;

                scene.add( mesh );

            }

        }

    }

    function addLabel( name, location ) {

        var textGeo = new THREE.TextBufferGeometry( name, {

            font: font,

            size: 30,
            height: 1,
            curveSegments: 1

        });

        var textMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff } );
        var textMesh = new THREE.Mesh( textGeo, textMaterial );
        textMesh.position.copy( location );
        scene.add( textMesh );

    }

    /*addLabel( "-shininess", new THREE.Vector3( -350, 0, 0 ) );
    addLabel( "+shininess", new THREE.Vector3( 350, 0, 0 ) );

    addLabel( "-specular, -reflectivity", new THREE.Vector3( 0, -300, 0 ) );
    addLabel( "+specular, +reflectivity", new THREE.Vector3( 0, 300, 0 ) );

    addLabel( "-diffuse", new THREE.Vector3( 0, 0, -300 ) );
    addLabel( "+diffuse", new THREE.Vector3( 0, 0, 300 ) );*/

    addLabel( "BIGBANG", new THREE.Vector3( 350, 0, 0 ) );

    particleLight = new THREE.Mesh( new THREE.SphereBufferGeometry( 4, 8, 8 ), new THREE.MeshBasicMaterial( { color: 0xffffff } ) );
    scene.add( particleLight );

    // Lights 1

    scene.add( new THREE.AmbientLight( 0x222222 ) );

    var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
    directionalLight.position.set( 1, 1, 1 ).normalize();
    scene.add( directionalLight );

    var pointLight = new THREE.PointLight( 0xffffff, 2, 800 );
    particleLight.add( pointLight );

    //

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    renderer.gammaInput = true;
    renderer.gammaOutput = true;

    //

    stats = new Stats();
    container.appendChild( stats.dom );

    controls = new THREE.OrbitControls( camera );

    window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function animate() {

    requestAnimationFrame( animate );

    stats.begin();
    render();
    stats.end();

}

function render() {

    var timer = Date.now() * 0.00025;

    /*camera.position.x = Math.cos( timer ) * 800;
    camera.position.z = Math.sin( timer ) * 800;*/

    autoRotateRadius = 1200 + 600 * Math.cos( 2 * timer );


//				camera.position.x = Math.cos( timer ) * 1600;
//				camera.position.z = Math.sin( timer ) * 1600;

    camera.position.x = Math.cos( timer ) * autoRotateRadius;
    camera.position.z = Math.sin( timer ) * autoRotateRadius;

    camera.lookAt( scene.position );

    particleLight.position.x = Math.sin( timer * 7 ) * 300;
    particleLight.position.y = Math.cos( timer * 5 ) * 400;
    particleLight.position.z = Math.cos( timer * 3 ) * 300;

    renderer.render( scene, camera );

}