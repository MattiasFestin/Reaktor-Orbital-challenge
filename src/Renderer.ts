/// <reference path="../typings/tsd.d.ts" />

export class Renderer {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    
    //[OrbitControls]
    private controls: any; //[TODO] fix type
    
    //Render functions
    private onRender: ((delta: number, now: number) => void)[];
    
    //
    private earth: THREE.Object3D;
    private earthSunObj: THREE.Object3D;
    
    //Solution threejs objects
    private startPoint: THREE.Mesh;
    private endPoint: THREE.Mesh;
    private satelitePoints: THREE.Mesh[];
    private sateliteLables: THREE.Mesh[];
    private pathLine: THREE.Line;
    
    constructor() {
        this.renderer = new THREE.WebGLRenderer({
                antialias	: true
        });
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100);
        
        this.controls = new THREE.OrbitControls( this.camera );
        this.controls.addEventListener( 'change', this.renderer.render );
        
        this.startPoint = null,
        this.endPoint = null,
        this.satelitePoints = [],
        this.sateliteLables = [],
        this.pathLine = null;
        
        this.onRender = [() => this.renderer.render(this.scene, this.camera )];

        this.init();
    }

    private init() {
        THREE.Cache.enabled = true;
        
        //Set rendering viewport
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( this.renderer.domElement );
        this.renderer.shadowMap.enabled	= true;
        
        this.camera.position.z = 4;
        this.scene.rotateZ(0 * Math.PI/180)
        this.scene.rotateX(0 * Math.PI/180);
        this.scene.rotateY(0 * Math.PI/180);
        
        //[TODO] Set standard (Europe)
        // this.scene.rotateZ(0 * Math.PI/180)
        // this.scene.rotateX(45 * Math.PI/180);
        // this.scene.rotateY(-110 * Math.PI/180);
        
        // this.createLights();
        this.earthSunObj = new THREE.Object3D();
        this.scene.add(this.earthSunObj);
        
        this.createStarfield();
        this.earth = this.createEarth();
        this.createLights();
        
        //Workarund this scope issue
        var me = this;
        var lastTimeMsec= null
        requestAnimationFrame(function animate(now){
            requestAnimationFrame(animate);
            lastTimeMsec	= lastTimeMsec || now-1000/60;
            
            var delta = Math.min(200, now - lastTimeMsec);
            lastTimeMsec = now;

            me.onRender.forEach((fn) => fn.call(me, delta/1000, now/1000), me);
        });
    }
    
    private createLights() {
        var anbuebtLight	= new THREE.AmbientLight( 0x222222 );
        this.scene.add( anbuebtLight );
        
        var directionalLight	= new THREE.DirectionalLight( 0xffffff, 1 );
        directionalLight.position.set(50,25,50);
        // this.scene.add( directionalLight );
        
        
        directionalLight.castShadow	= true;
        directionalLight.shadow.camera.near	= 0.01;
        directionalLight.shadow.camera.far	= 15;
        directionalLight.shadow.camera.fov	= 45;

        directionalLight.shadow.camera.left	= -1;
        directionalLight.shadow.camera.right	=  1;
        directionalLight.shadow.camera.top	=  1;
        directionalLight.shadow.camera.bottom = -1;

        directionalLight.shadow.bias	= 0.001;

        directionalLight.shadow.mapSize.width	= 1024;
        directionalLight.shadow.mapSize.height	= 1024;
        
        this.earthSunObj.add(directionalLight);
        
        this.onRender.push(function(delta, now){
            this.earthSunObj.rotation.y += 1/32 * delta;		
        });
        
        return directionalLight;
    }
    
    private createStarfield() {
        //[FIXME] - Zooming out causes black ring around earth

        //[TODO] - Rotate sky to correct position
        // from NASA (https://svs.gsfc.nasa.gov/vis/a000000/a003500/a003572/TychoSkymapII.t5_04096x02048.jpg)
        var texture	= THREE.ImageUtils.loadTexture('../images/TychoSkymapII.t5_04096x02048.jpg');
        var material	= new THREE.MeshBasicMaterial({
            map	: texture,
            side	: THREE.BackSide
        });
        var geometry	= new THREE.SphereGeometry(100, 64, 64);
        var mesh	= new THREE.Mesh(geometry, material);

        this.scene.add(mesh);
    }
    
    private createEarth() {
        //Reworked version of: http://learningthreejs.com/blog/2013/09/16/how-to-make-the-earth-in-webgl/
        
        //[TODO] - Calibrate texture position to real longitude latidude postions.
        
        // images from NASA (http://visibleearth.nasa.gov/view.php?id=73580, https://asterweb.jpl.nasa.gov/gdem.asp, http://visibleearth.nasa.gov/view.php?id=73934, http://planetpixelemporium.com)
        var geometry	= new THREE.SphereGeometry(1, 64, 64)
        var material	= new THREE.MeshPhongMaterial({
            map		: THREE.ImageUtils.loadTexture('../images/world.topo.bathy.200401.3x5400x2700.jpg'),
            normalMap: THREE.ImageUtils.loadTexture('../images/earthNormalMap_8k-tig.png'),
            // normalScale: 0.5,
            bumpMap		: THREE.ImageUtils.loadTexture('../images/GDEM-10km-BW.png'),
            bumpScale	: 0.01,
            specularMap	: THREE.ImageUtils.loadTexture('../images/earthspec1k.jpg'),
            specular	: new THREE.Color('gray').getHex(),
            shininess: 10
        })
        var earthMesh	= new THREE.Mesh(geometry, material);
        
        this.earthSunObj.add(earthMesh);
        
        var containerEarth	= new THREE.Object3D();
        //Lng, lat correction for texture
        // containerEarth.rotateZ(0 * Math.PI/180);
        // containerEarth.rotateX(120 * Math.PI/180);
        // containerEarth.rotateY(-90 * Math.PI/180);

        containerEarth.position.z	= 0;
        containerEarth.position.y	= 0;
        containerEarth.position.x	= 0;
        // containerEarth.rotateZ(0 * Math.PI/180)
        // containerEarth.rotateX(-45 * Math.PI/180);
        // containerEarth.rotateY(110 * Math.PI/180);
        
        this.earthSunObj.add(containerEarth);

        earthMesh.receiveShadow	= true;
        earthMesh.castShadow	= true;
        containerEarth.add(earthMesh);

        //[TODO] - rename
        var geometryAtmosphere	= new THREE.SphereGeometry(1, 64, 64);
        var materialAtmosphere	= this.createAtmosphereMaterial();
        materialAtmosphere.uniforms.glowColor.value.set(0x00b3ff);
        materialAtmosphere.uniforms.coeficient.value	= 0.8;
        materialAtmosphere.uniforms.power.value		= 4.0;
        var meshAtmosphere	= new THREE.Mesh(geometryAtmosphere, materialAtmosphere );
        meshAtmosphere.scale.multiplyScalar(1.02);
        containerEarth.add( meshAtmosphere );

        //[TODO] - rename
        var geometryAtmosphereOuter	= new THREE.SphereGeometry(1, 64, 64);
        var materialAtmosphereOuter	= this.createAtmosphereMaterial();
        materialAtmosphereOuter.side	= THREE.BackSide;
        materialAtmosphereOuter.uniforms.glowColor.value.set(0x00b3ff)
        materialAtmosphereOuter.uniforms.coeficient.value	= 0.1;
        materialAtmosphereOuter.uniforms.power.value		= 2.0;
        var meshAtmosphereOuter	= new THREE.Mesh(geometryAtmosphereOuter, materialAtmosphereOuter );
        meshAtmosphereOuter.scale.multiplyScalar(1.15);
        containerEarth.add( meshAtmosphereOuter );

        var earthCloud	= this.createEarthCloud();
        earthCloud.receiveShadow	= true;
        earthCloud.castShadow	= true;
        containerEarth.add(earthCloud);
        this.onRender.push(function(delta, now){
            earthCloud.rotation.y += 1/64 * delta;		
        });
        
        this.onRender.push(function(delta, now){
            containerEarth.rotation.y -= 2/32 * delta;		
        });
        
        return containerEarth;
    }
    
    private createEarthCloud () {
        // from http://planetpixelemporium.com
        
        // create destination canvas
        var canvasResult	= document.createElement('canvas');
        canvasResult.width	= 1024;
        canvasResult.height	= 512;
        var contextResult	= canvasResult.getContext('2d');		

        // load earthcloudmap
        var imageMap	= new Image();
        imageMap.addEventListener("load", function () {
            // create dataMap ImageData for earthcloudmap
            var canvasMap	= document.createElement('canvas');
            canvasMap.width	= imageMap.width;
            canvasMap.height= imageMap.height;
            var contextMap	= canvasMap.getContext('2d');
            contextMap.drawImage(imageMap, 0, 0);
            var dataMap	= contextMap.getImageData(0, 0, canvasMap.width, canvasMap.height);

            // load earthcloudmaptrans
            var imageTrans	= new Image();
            imageTrans.addEventListener("load", function() {
                // create dataTrans ImageData for earthcloudmaptrans
                var canvasTrans		= document.createElement('canvas');
                canvasTrans.width	= imageTrans.width;
                canvasTrans.height	= imageTrans.height;
                var contextTrans	= canvasTrans.getContext('2d');
                contextTrans.drawImage(imageTrans, 0, 0);
                var dataTrans		= contextTrans.getImageData(0, 0, canvasTrans.width, canvasTrans.height);
                // merge dataMap + dataTrans into dataResult
                var dataResult		= contextMap.createImageData(canvasMap.width, canvasMap.height);
                for(var y = 0, offset = 0; y < imageMap.height; y++) {
                    for(var x = 0; x < imageMap.width; x++, offset += 4) {
                        dataResult.data[offset+0]	= dataMap.data[offset+0];
                        dataResult.data[offset+1]	= dataMap.data[offset+1];
                        dataResult.data[offset+2]	= dataMap.data[offset+2];
                        dataResult.data[offset+3]	= 255 - dataTrans.data[offset+0];
                    }
                }
                // update texture with result
                contextResult.putImageData(dataResult,0,0);
                material.map.needsUpdate = true;
            })
            imageTrans.src	= '../images/earthcloudmaptrans.jpg';
        }, false);
        imageMap.src	= '../images/earthcloudmap.jpg';

        var geometry	= new THREE.SphereGeometry(1.02, 64, 64);
        var material	= new THREE.MeshPhongMaterial({
            map		: new THREE.Texture(canvasResult),
            side		: THREE.DoubleSide,
            transparent	: true,
            opacity		: 0.8,
        });
        var mesh	= new THREE.Mesh(geometry, material)
        
        return mesh;
    }
    
    private createAtmosphereMaterial	() {
        /**
         * from http://stemkoski.blogspot.fr/2013/07/shaders-in-threejs-glow-and-halo.html
         * @return {[type]} [description]
         */
        var vertexShader	= [
            'varying vec3 vNormal;',
            'void main(){',
            '	// compute intensity',
            '	vNormal		= normalize( normalMatrix * normal );',
            '	// set gl_Position',
            '	gl_Position	= projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
            '}',
        ].join('\n');
        var fragmentShader	= [
            'uniform float coeficient;',
            'uniform float power;',
            'uniform vec3  glowColor;',

            'varying vec3  vNormal;',

            'void main(){',
            '	float intensity	= pow( coeficient - dot(vNormal, vec3(0.0, 0.0, 1.0)), power );',
            '	gl_FragColor	= vec4( glowColor * intensity, 1.0 );',
            '}',
        ].join('\n');

        // create custom material from the shader code above
        //   that is within specially labeled script tags
        var material	= new THREE.ShaderMaterial({
            uniforms: { 
                coeficient	: {
                    type	: "f", 
                    value	: 1.0
                },
                power		: {
                    type	: "f",
                    value	: 2
                },
                glowColor	: {
                    type	: "c",
                    value	: new THREE.Color('pink')
                },
            },
            vertexShader	: vertexShader,
            fragmentShader	: fragmentShader,
            side		: THREE.FrontSide,
            blending	: THREE.AdditiveBlending,
            transparent	: true,
            depthWrite	: false,
        });
        
        return material;
    }
    
    //[TODO] - Provide a strict datatype for parameter
    public drawSolution (solution) {
        var realScale = 1 / 6371;
            
        //Remove previous solution
        this.earth.remove(this.startPoint);
        this.earth.remove(this.endPoint);
        this.earth.remove(this.pathLine);
        this.sateliteLables.forEach(this.earth.remove, this.earth);
        this.satelitePoints.forEach(this.earth.remove, this.earth);
    
        //Start and end
        this.startPoint = new THREE.Mesh( new THREE.SphereGeometry( 1/50, 32, 32 ), new THREE.MeshBasicMaterial( {color: 0x00ff00} ) );
        this.startPoint.position.x = solution.start.position.value[0] * realScale;
        this.startPoint.position.y = solution.start.position.value[1] * realScale;
        this.startPoint.position.z = solution.start.position.value[2] * realScale;
        this.earth.add( this.startPoint );
        
        solution.start.availiableRoutingPoints.forEach(function (rp) {
            var material = new THREE.LineBasicMaterial({
                color: 0xff00ff,
                linewidth: 4,
                linecap: 'square'
            });
            var geometry = new THREE.Geometry();
            geometry.vertices.push(new THREE.Vector3(
                solution.start.position.value[0] * realScale,
                solution.start.position.value[1] * realScale,
                solution.start.position.value[2] * realScale
            ));
            geometry.vertices.push(new THREE.Vector3(
                rp.position.value[0] * realScale,
                rp.position.value[1] * realScale,
                rp.position.value[2] * realScale
            ));

            //[TODO] - Create own property for satelite path
            this.pathLine = new THREE.Line(geometry, material);
            this.earth.add(this.pathLine);
        }, this);
        
        this.endPoint = new THREE.Mesh( new THREE.SphereGeometry( 1/50, 32, 32 ), new THREE.MeshBasicMaterial( {color: 0xff0000} ) );
        this.endPoint.position.x = solution.end.position.value[0] * realScale;
        this.endPoint.position.y = solution.end.position.value[1] * realScale;
        this.endPoint.position.z = solution.end.position.value[2] * realScale;
        this.earth.add( this.endPoint );
        
        solution.end.availiableRoutingPoints.forEach(function (rp) {
            var material = new THREE.LineBasicMaterial({
                color: 0xff00ff,
                linewidth: 4,
                linecap: 'square'
            });
            var geometry = new THREE.Geometry();
            geometry.vertices.push(new THREE.Vector3(
                solution.end.position.value[0] * realScale,
                solution.end.position.value[1] * realScale,
                solution.end.position.value[2] * realScale
            ));
            geometry.vertices.push(new THREE.Vector3(
                rp.position.value[0] * realScale,
                rp.position.value[1] * realScale,
                rp.position.value[2] * realScale
            ));
            
            //[TODO] - Create own property for satelite path
            this.pathLine = new THREE.Line(geometry, material);
            this.earth.add(this.pathLine);
        }, this);
        
        var satelites = solution.routeingPoints.slice(1, -1);
        satelites.forEach(function (s) {
            var sateliteOrb = new THREE.Mesh( new THREE.SphereGeometry( 1/100, 32, 32 ), new THREE.MeshBasicMaterial( {color: 0x0000ff} ) );
            sateliteOrb.position.x = s.position.value[0] * realScale;
            sateliteOrb.position.y = s.position.value[1] * realScale;
            sateliteOrb.position.z = s.position.value[2] * realScale;
            this.earth.add( sateliteOrb );
            
            s.availiableRoutingPoints.forEach(function (rp) {
                var material = new THREE.LineBasicMaterial({
                    color: 0xff00ff,
                    linewidth: 4,
                    linecap: 'square'
                });
                var geometry = new THREE.Geometry();
                geometry.vertices.push(new THREE.Vector3(
                    s.position.value[0] * realScale,
                    s.position.value[1] * realScale,
                    s.position.value[2] * realScale
                ));
                geometry.vertices.push(new THREE.Vector3(
                    rp.position.value[0] * realScale,
                    rp.position.value[1] * realScale,
                    rp.position.value[2] * realScale
                ));
                
                //[TODO] - need move to array on class.
                this.pathLine = new THREE.Line(geometry, material);
                this.earth.add(this.pathLine);
            }, this);

            
            // var textGeo = makeTextSprite("test", {
            //     fontsize: 24,
            //     borderColor: {r: 255, g:0, b:255, a:1.0},
            //     backgroundColor: {r:255, g:255, b:255, a:0.8}
            // });
            // textGeo.position.set(
            //     s.position.value[0] * realScale,
            //     s.position.value[1] * realScale + 0.1,
            //     s.position.value[2] * realScale
            // );
            // this.scene.add( textGeo );
            // this.sateliteLables.push(textGeo);
        }, this);
        
        //Solution Path
        var material = new THREE.LineBasicMaterial({
            color: 0xffffff,
            linewidth: 20,
            linecap: 'square'
        });
        var geometry = new THREE.Geometry();
        solution.answer.pathPos.forEach(function (p, i) {
            geometry.vertices.push(new THREE.Vector3(
                p.value[0] * realScale,
                p.value[1] * realScale,
                p.value[2] * realScale
            ));
        }, this);

        this.pathLine = new THREE.Line(geometry, material);
        this.earth.add(this.pathLine);
    }
}