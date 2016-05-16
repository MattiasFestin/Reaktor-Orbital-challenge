(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
"use strict";
var Math_1 = require('./Math');
var epsilon = 0.01;
var Line = (function () {
    function Line(o, d) {
        this.o = o;
        this.d = d.norm();
    }
    Line.prototype.getPoint = function (distance) {
        return this.o.add(this.d.scale(distance));
    };
    return Line;
}());
exports.Line = Line;
var Sphere = (function () {
    function Sphere(o, r) {
        this.o = o;
        this.r = r;
    }
    Sphere.prototype.pointOnSphere = function (p) {
        return Math.abs(p.distance(this.o) - this.r) < epsilon;
    };
    Sphere.prototype.normal = function (p) {
        return new Math_1.Vec3([
            (p.getX() - this.o.getX()) / this.r,
            (p.getY() - this.o.getY()) / this.r,
            (p.getZ() - this.o.getZ()) / this.r
        ]);
    };
    Sphere.prototype.intersect = function (l) {
        var q = l.d.dot(l.o.sub(this.o)), t = Math.pow(q, 2) - Math.pow(l.o.distance(this.o), 2) + Math.pow(this.r, 2);
        if (t < 0 || (typeof t === 'number' && isNaN(t))) {
            return [];
        }
        else if (t === 0) {
            var x = l.getPoint(-q);
            if (!this.pointOnSphere(x)) {
                throw new Error("Solution points " + x + " not on sphere.");
            }
            return [x]; //One solution (Two points at same postion that tangent the sphere)
        }
        else {
            t = Math.sqrt(t);
            var x0 = l.getPoint(-q - t), x1 = l.getPoint(-q + t);
            if (!this.pointOnSphere(x0)) {
                throw new Error("Solution " + x0 + " point not on sphere.");
            }
            if (!this.pointOnSphere(x1)) {
                throw new Error("Solution " + x1 + " point not on sphere.");
            }
            return [x0, x1]; //Two unique solutions   
        }
    };
    return Sphere;
}());
exports.Sphere = Sphere;

}).call(this,require("pBGvAp"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/3dStuff.js","/")
},{"./Math":2,"buffer":9,"pBGvAp":11}],2:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
"use strict";
var Vec3 = (function () {
    function Vec3(arr) {
        /**
         * Assertions
         */
        if (!Array.isArray(arr)) {
            throw new TypeError('Invalid construtor parameter type. Array expected.');
        }
        if (arr.length !== 3) {
            throw new TypeError('Invalid construtor array length. Length 3 expected.');
        }
        this.value = new Float32Array(arr);
    }
    /**
     * Getters for 3d coordinates
     */
    Vec3.prototype.getX = function () {
        return this.value[0];
    };
    ;
    Vec3.prototype.getY = function () {
        return this.value[1];
    };
    ;
    Vec3.prototype.getZ = function () {
        return this.value[2];
    };
    ;
    Vec3.prototype.add = function (w) {
        var v = this;
        return new Vec3([
            this.getX() + w.getX(),
            this.getY() + w.getY(),
            this.getZ() + w.getZ(),
        ]);
    };
    Vec3.prototype.neg = function () {
        var v = this;
        return new Vec3([
            -this.getX(),
            -this.getY(),
            -this.getZ()
        ]);
    };
    Vec3.prototype.sub = function (w) {
        var v = this;
        return new Vec3([
            v.getX() - w.getX(),
            v.getY() - w.getY(),
            v.getZ() - w.getZ()
        ]);
    };
    Vec3.prototype.scale = function (a) {
        var v = this;
        return new Vec3([
            a * v.getX(),
            a * v.getY(),
            a * v.getZ()
        ]);
    };
    Vec3.prototype.dot = function (w) {
        var v = this;
        return v.getX() * w.getX() + v.getY() * w.getY() + v.getZ() * w.getZ();
    };
    Vec3.prototype.len = function () {
        return Math.sqrt(this.dot(this));
    };
    Vec3.prototype.norm = function () {
        var len = this.len();
        return len === 0 ? this : this.scale(1 / len);
    };
    Vec3.prototype.cross = function (w) {
        var v = this;
        return new Vec3([
            v.getY() * w.getZ() - v.getZ() * w.getY(),
            v.getZ() * w.getX() - v.getX() * w.getZ(),
            v.getX() * w.getY() - v.getY() * w.getX()
        ]);
    };
    Vec3.prototype.distance = function (w) {
        var v = this;
        return Math.sqrt(Math.pow(v.getX() - w.getX(), 2) +
            Math.pow(v.getY() - w.getY(), 2) +
            Math.pow(v.getZ() - w.getZ(), 2));
    };
    Vec3.prototype.toString = function () {
        return this.getX() + "," + this.getY() + "," + this.getZ();
    };
    return Vec3;
}());
exports.Vec3 = Vec3;
var PolarCoordinate = (function () {
    function PolarCoordinate(lat, lon, alt) {
        this.lat = Math.PI * lat / 180;
        this.lon = Math.PI * lon / 180;
        this.alt = alt;
    }
    PolarCoordinate.prototype.convert = function () {
        return new Vec3([
            this.alt * Math.cos(this.lat) * Math.cos(this.lon),
            this.alt * Math.cos(this.lat) * Math.sin(this.lon),
            this.alt * Math.sin(this.lat)
        ]);
    };
    return PolarCoordinate;
}());
exports.PolarCoordinate = PolarCoordinate;

}).call(this,require("pBGvAp"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/Math.js","/")
},{"buffer":9,"pBGvAp":11}],3:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
"use strict";
var Router_1 = require('./Router');
var Math_1 = require('./Math');
var RouteingPoint_1 = require('./RouteingPoint');
//Helper function to parse data
function parse(text) {
    var result;
    var rows = text
        .split(/[\r\n]+/);
    var routeingPoints = rows
        .filter(function (x, i) { return i > 0 && i < rows.length - 1; })
        .map(function (row) {
        var values = row.split(',');
        return new RouteingPoint_1.RouteingPoint(values[0], new Math_1.PolarCoordinate(+values[1], +values[2], +values[3] + 6371));
    });
    var earthPoints = rows[rows.length - 1].split(',');
    //[NOTE] - Add one to earth radious for altidude, to prevent to tangent intersection with sphere
    var start = new RouteingPoint_1.RouteingPoint('start', new Math_1.PolarCoordinate(+earthPoints[1], +earthPoints[2], 6371));
    var end = new RouteingPoint_1.RouteingPoint('end', new Math_1.PolarCoordinate(+earthPoints[3], +earthPoints[4], 6371));
    //Add start and end to routeingPoints
    routeingPoints.unshift(start);
    routeingPoints.push(end);
    var router = new Router_1.Router(routeingPoints);
    var answer = router.route(start, end);
    var retVal = {
        seed: rows[0],
        routeingPoints: routeingPoints.map(function (x) {
            return {
                name: x.name,
                position: x.position,
                availiableRoutingPoints: x.availiableRoutingPoints.map(function (y) {
                    return {
                        name: y.target.name,
                        position: y.target.position
                    };
                })
            };
        }),
        start: {
            name: start.name,
            position: start.position,
            availiableRoutingPoints: start.availiableRoutingPoints.map(function (y) {
                return {
                    name: y.target.name,
                    position: y.target.position
                };
            })
        },
        end: {
            name: end.name,
            position: end.position,
            availiableRoutingPoints: end.availiableRoutingPoints.map(function (y) {
                return {
                    name: y.target.name,
                    position: y.target.position
                };
            })
        },
        answer: answer
    };
    console.log('result:', retVal);
    return retVal;
}
exports.parse = parse;
;

}).call(this,require("pBGvAp"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/Parser.js","/")
},{"./Math":2,"./RouteingPoint":5,"./Router":6,"buffer":9,"pBGvAp":11}],4:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/// <reference path="../typings/tsd.d.ts" />
"use strict";
var Renderer = (function () {
    function Renderer() {
        var _this = this;
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100);
        this.controls = new THREE.OrbitControls(this.camera);
        this.controls.addEventListener('change', this.renderer.render);
        this.startPoint = null,
            this.endPoint = null,
            this.satelitePoints = [],
            this.sateliteLables = [],
            this.pathLine = null;
        this.onRender = [function () { return _this.renderer.render(_this.scene, _this.camera); }];
        this.init();
    }
    Renderer.prototype.init = function () {
        THREE.Cache.enabled = true;
        //Set rendering viewport
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        this.renderer.shadowMap.enabled = true;
        this.camera.position.z = 4;
        this.scene.rotateZ(0 * Math.PI / 180);
        this.scene.rotateX(0 * Math.PI / 180);
        this.scene.rotateY(0 * Math.PI / 180);
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
        var lastTimeMsec = null;
        requestAnimationFrame(function animate(now) {
            requestAnimationFrame(animate);
            lastTimeMsec = lastTimeMsec || now - 1000 / 60;
            var delta = Math.min(200, now - lastTimeMsec);
            lastTimeMsec = now;
            me.onRender.forEach(function (fn) { return fn.call(me, delta / 1000, now / 1000); }, me);
        });
    };
    Renderer.prototype.createLights = function () {
        var anbuebtLight = new THREE.AmbientLight(0x222222);
        this.scene.add(anbuebtLight);
        var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(50, 25, 50);
        // this.scene.add( directionalLight );
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.near = 0.01;
        directionalLight.shadow.camera.far = 15;
        directionalLight.shadow.camera.fov = 45;
        directionalLight.shadow.camera.left = -1;
        directionalLight.shadow.camera.right = 1;
        directionalLight.shadow.camera.top = 1;
        directionalLight.shadow.camera.bottom = -1;
        directionalLight.shadow.bias = 0.001;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        this.earthSunObj.add(directionalLight);
        this.onRender.push(function (delta, now) {
            this.earthSunObj.rotation.y -= 1 / 32 * delta;
        });
        return directionalLight;
    };
    Renderer.prototype.createStarfield = function () {
        //[FIXME] - Zooming out causes black ring around earth
        //[TODO] - Rotate sky to correct position
        // from NASA (https://svs.gsfc.nasa.gov/vis/a000000/a003500/a003572/TychoSkymapII.t5_04096x02048.jpg)
        var texture = THREE.ImageUtils.loadTexture('../images/TychoSkymapII.t5_04096x02048.jpg');
        var material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.BackSide
        });
        var geometry = new THREE.SphereGeometry(100, 64, 64);
        var mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh);
    };
    Renderer.prototype.createEarth = function () {
        //Reworked version of: http://learningthreejs.com/blog/2013/09/16/how-to-make-the-earth-in-webgl/
        //[TODO] - Calibrate texture position to real longitude latidude postions.
        // images from NASA (http://visibleearth.nasa.gov/view.php?id=73580, https://asterweb.jpl.nasa.gov/gdem.asp, http://visibleearth.nasa.gov/view.php?id=73934, http://planetpixelemporium.com)
        var geometry = new THREE.SphereGeometry(1, 64, 64);
        var material = new THREE.MeshPhongMaterial({
            map: THREE.ImageUtils.loadTexture('../images/world.topo.bathy.200401.3x5400x2700.jpg'),
            normalMap: THREE.ImageUtils.loadTexture('../images/earthNormalMap_8k-tig.png'),
            // normalScale: 0.5,
            bumpMap: THREE.ImageUtils.loadTexture('../images/GDEM-10km-BW.png'),
            bumpScale: 0.01,
            specularMap: THREE.ImageUtils.loadTexture('../images/earthspec1k.jpg'),
            specular: new THREE.Color('gray').getHex(),
            shininess: 10
        });
        var earthMesh = new THREE.Mesh(geometry, material);
        this.earthSunObj.add(earthMesh);
        var containerEarth = new THREE.Object3D();
        //Lng, lat correction for texture
        // containerEarth.rotateZ(0 * Math.PI/180);
        // containerEarth.rotateX(120 * Math.PI/180);
        // containerEarth.rotateY(-90 * Math.PI/180);
        containerEarth.position.z = 0;
        containerEarth.position.y = 0;
        containerEarth.position.x = 0;
        // containerEarth.rotateZ(0 * Math.PI/180)
        // containerEarth.rotateX(-45 * Math.PI/180);
        // containerEarth.rotateY(110 * Math.PI/180);
        this.earthSunObj.add(containerEarth);
        earthMesh.receiveShadow = true;
        earthMesh.castShadow = true;
        containerEarth.add(earthMesh);
        //[TODO] - rename
        var geometryAtmosphere = new THREE.SphereGeometry(1, 64, 64);
        var materialAtmosphere = this.createAtmosphereMaterial();
        materialAtmosphere.uniforms.glowColor.value.set(0x00b3ff);
        materialAtmosphere.uniforms.coeficient.value = 0.8;
        materialAtmosphere.uniforms.power.value = 4.0;
        var meshAtmosphere = new THREE.Mesh(geometryAtmosphere, materialAtmosphere);
        meshAtmosphere.scale.multiplyScalar(1.02);
        containerEarth.add(meshAtmosphere);
        //[TODO] - rename
        var geometryAtmosphereOuter = new THREE.SphereGeometry(1, 64, 64);
        var materialAtmosphereOuter = this.createAtmosphereMaterial();
        materialAtmosphereOuter.side = THREE.BackSide;
        materialAtmosphereOuter.uniforms.glowColor.value.set(0x00b3ff);
        materialAtmosphereOuter.uniforms.coeficient.value = 0.1;
        materialAtmosphereOuter.uniforms.power.value = 2.0;
        var meshAtmosphereOuter = new THREE.Mesh(geometryAtmosphereOuter, materialAtmosphereOuter);
        meshAtmosphereOuter.scale.multiplyScalar(1.15);
        containerEarth.add(meshAtmosphereOuter);
        var earthCloud = this.createEarthCloud();
        earthCloud.receiveShadow = true;
        earthCloud.castShadow = true;
        containerEarth.add(earthCloud);
        this.onRender.push(function (delta, now) {
            earthCloud.rotation.y -= 1 / 64 * delta;
        });
        this.onRender.push(function (delta, now) {
            containerEarth.rotation.y += 2 / 32 * delta;
        });
        return containerEarth;
    };
    Renderer.prototype.createEarthCloud = function () {
        // from http://planetpixelemporium.com
        // create destination canvas
        var canvasResult = document.createElement('canvas');
        canvasResult.width = 1024;
        canvasResult.height = 512;
        var contextResult = canvasResult.getContext('2d');
        // load earthcloudmap
        var imageMap = new Image();
        imageMap.addEventListener("load", function () {
            // create dataMap ImageData for earthcloudmap
            var canvasMap = document.createElement('canvas');
            canvasMap.width = imageMap.width;
            canvasMap.height = imageMap.height;
            var contextMap = canvasMap.getContext('2d');
            contextMap.drawImage(imageMap, 0, 0);
            var dataMap = contextMap.getImageData(0, 0, canvasMap.width, canvasMap.height);
            // load earthcloudmaptrans
            var imageTrans = new Image();
            imageTrans.addEventListener("load", function () {
                // create dataTrans ImageData for earthcloudmaptrans
                var canvasTrans = document.createElement('canvas');
                canvasTrans.width = imageTrans.width;
                canvasTrans.height = imageTrans.height;
                var contextTrans = canvasTrans.getContext('2d');
                contextTrans.drawImage(imageTrans, 0, 0);
                var dataTrans = contextTrans.getImageData(0, 0, canvasTrans.width, canvasTrans.height);
                // merge dataMap + dataTrans into dataResult
                var dataResult = contextMap.createImageData(canvasMap.width, canvasMap.height);
                for (var y = 0, offset = 0; y < imageMap.height; y++) {
                    for (var x = 0; x < imageMap.width; x++, offset += 4) {
                        dataResult.data[offset + 0] = dataMap.data[offset + 0];
                        dataResult.data[offset + 1] = dataMap.data[offset + 1];
                        dataResult.data[offset + 2] = dataMap.data[offset + 2];
                        dataResult.data[offset + 3] = 255 - dataTrans.data[offset + 0];
                    }
                }
                // update texture with result
                contextResult.putImageData(dataResult, 0, 0);
                material.map.needsUpdate = true;
            });
            imageTrans.src = '../images/earthcloudmaptrans.jpg';
        }, false);
        imageMap.src = '../images/earthcloudmap.jpg';
        var geometry = new THREE.SphereGeometry(1.02, 64, 64);
        var material = new THREE.MeshPhongMaterial({
            map: new THREE.Texture(canvasResult),
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8
        });
        var mesh = new THREE.Mesh(geometry, material);
        return mesh;
    };
    Renderer.prototype.createAtmosphereMaterial = function () {
        /**
         * from http://stemkoski.blogspot.fr/2013/07/shaders-in-threejs-glow-and-halo.html
         * @return {[type]} [description]
         */
        var vertexShader = [
            'varying vec3 vNormal;',
            'void main(){',
            '	// compute intensity',
            '	vNormal		= normalize( normalMatrix * normal );',
            '	// set gl_Position',
            '	gl_Position	= projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
            '}',
        ].join('\n');
        var fragmentShader = [
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
        var material = new THREE.ShaderMaterial({
            uniforms: {
                coeficient: {
                    type: "f",
                    value: 1.0
                },
                power: {
                    type: "f",
                    value: 2
                },
                glowColor: {
                    type: "c",
                    value: new THREE.Color('pink')
                }
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            side: THREE.FrontSide,
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthWrite: false
        });
        return material;
    };
    //[TODO] - Provide a strict datatype for parameter
    Renderer.prototype.drawSolution = function (solution) {
        var realScale = 1 / 6371;
        //Remove previous solution
        this.earth.remove(this.startPoint);
        this.earth.remove(this.endPoint);
        this.earth.remove(this.pathLine);
        this.sateliteLables.forEach(this.earth.remove, this.earth);
        this.satelitePoints.forEach(this.earth.remove, this.earth);
        //Start and end
        this.startPoint = new THREE.Mesh(new THREE.SphereGeometry(1 / 50, 32, 32), new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
        this.startPoint.position.x = solution.start.position.value[0] * realScale;
        this.startPoint.position.y = solution.start.position.value[1] * realScale;
        this.startPoint.position.z = solution.start.position.value[2] * realScale;
        this.earth.add(this.startPoint);
        solution.start.availiableRoutingPoints.forEach(function (rp) {
            var material = new THREE.LineBasicMaterial({
                color: 0xff00ff,
                linewidth: 4,
                linecap: 'square'
            });
            var geometry = new THREE.Geometry();
            geometry.vertices.push(new THREE.Vector3(solution.start.position.value[0] * realScale, solution.start.position.value[1] * realScale, solution.start.position.value[2] * realScale));
            geometry.vertices.push(new THREE.Vector3(rp.position.value[0] * realScale, rp.position.value[1] * realScale, rp.position.value[2] * realScale));
            //[TODO] - Create own property for satelite path
            this.pathLine = new THREE.Line(geometry, material);
            this.earth.add(this.pathLine);
        }, this);
        this.endPoint = new THREE.Mesh(new THREE.SphereGeometry(1 / 50, 32, 32), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
        this.endPoint.position.x = solution.end.position.value[0] * realScale;
        this.endPoint.position.y = solution.end.position.value[1] * realScale;
        this.endPoint.position.z = solution.end.position.value[2] * realScale;
        this.earth.add(this.endPoint);
        solution.end.availiableRoutingPoints.forEach(function (rp) {
            var material = new THREE.LineBasicMaterial({
                color: 0xff00ff,
                linewidth: 4,
                linecap: 'square'
            });
            var geometry = new THREE.Geometry();
            geometry.vertices.push(new THREE.Vector3(solution.end.position.value[0] * realScale, solution.end.position.value[1] * realScale, solution.end.position.value[2] * realScale));
            geometry.vertices.push(new THREE.Vector3(rp.position.value[0] * realScale, rp.position.value[1] * realScale, rp.position.value[2] * realScale));
            //[TODO] - Create own property for satelite path
            this.pathLine = new THREE.Line(geometry, material);
            this.earth.add(this.pathLine);
        }, this);
        var satelites = solution.routeingPoints.slice(1, -1);
        satelites.forEach(function (s) {
            var sateliteOrb = new THREE.Mesh(new THREE.SphereGeometry(1 / 100, 32, 32), new THREE.MeshBasicMaterial({ color: 0x0000ff }));
            sateliteOrb.position.x = s.position.value[0] * realScale;
            sateliteOrb.position.y = s.position.value[1] * realScale;
            sateliteOrb.position.z = s.position.value[2] * realScale;
            this.earth.add(sateliteOrb);
            s.availiableRoutingPoints.forEach(function (rp) {
                var material = new THREE.LineBasicMaterial({
                    color: 0xff00ff,
                    linewidth: 4,
                    linecap: 'square'
                });
                var geometry = new THREE.Geometry();
                geometry.vertices.push(new THREE.Vector3(s.position.value[0] * realScale, s.position.value[1] * realScale, s.position.value[2] * realScale));
                geometry.vertices.push(new THREE.Vector3(rp.position.value[0] * realScale, rp.position.value[1] * realScale, rp.position.value[2] * realScale));
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
            geometry.vertices.push(new THREE.Vector3(p.value[0] * realScale, p.value[1] * realScale, p.value[2] * realScale));
        }, this);
        this.pathLine = new THREE.Line(geometry, material);
        this.earth.add(this.pathLine);
    };
    return Renderer;
}());
exports.Renderer = Renderer;

}).call(this,require("pBGvAp"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/Renderer.js","/")
},{"buffer":9,"pBGvAp":11}],5:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
"use strict";
var RouteingPoint = (function () {
    function RouteingPoint(name, polarCoord) {
        this.name = name;
        this.position = polarCoord.convert();
    }
    return RouteingPoint;
}());
exports.RouteingPoint = RouteingPoint;
var RountingPointPairs = (function () {
    function RountingPointPairs(source, target) {
        this.source = source;
        this.target = target;
        this.distance = this.source.position.distance(this.target.position);
    }
    return RountingPointPairs;
}());
exports.RountingPointPairs = RountingPointPairs;

}).call(this,require("pBGvAp"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/RouteingPoint.js","/")
},{"buffer":9,"pBGvAp":11}],6:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
"use strict";
var Math_1 = require('./Math');
var RouteingPoint_1 = require('./RouteingPoint');
var _3dStuff_1 = require('./3dStuff');
var Router = (function () {
    function Router(routes) {
        var _this = this;
        this.earth = new _3dStuff_1.Sphere(new Math_1.Vec3([0, 0, 0]), 6371);
        this.routes = routes
            .map(function (s) {
            s.availiableRoutingPoints = s.availiableRoutingPoints || [];
            if (['start', 'end'].indexOf(s.name) === -1) {
                s.availiableRoutingPoints = routes
                    .filter(function (q) {
                    return q !== s &&
                        ['start', 'end'].indexOf(q.name) === -1 &&
                        _this.earth.intersect(new _3dStuff_1.Line(s.position, q.position.sub(s.position))).length === 0; //Is not self and does not intersect earth 
                })
                    .map(function (x) { return new RouteingPoint_1.RountingPointPairs(s, x); })
                    .filter(function (x) { return s.availiableRoutingPoints.indexOf(x) === -1; })
                    .sort(function (a, b) { return a.distance - b.distance; });
            }
            else {
                //Start and end points will intersect below (behind?) the point
                // We must check the surface normal the direction if it is infront of the point
                var surfaceNormal = _this.earth.normal(s.position);
                s.availiableRoutingPoints = s.availiableRoutingPoints.concat(routes
                    .filter(function (q) {
                    var dot = q.position.sub(s.position).norm().dot(surfaceNormal);
                    return q !== s &&
                        dot > 0;
                })
                    .map(function (x) { return new RouteingPoint_1.RountingPointPairs(s, x); })
                    .filter(function (x) { return s.availiableRoutingPoints.indexOf(x) === -1; })
                    .sort(function (a, b) { return a.distance - b.distance; }));
                //We want symetric relations
                s.availiableRoutingPoints.forEach(function (q) {
                    q.target.availiableRoutingPoints = q.target.availiableRoutingPoints || [];
                    if (q.target.availiableRoutingPoints.every(function (r) { return r.target !== q.source; })) {
                        q.target.availiableRoutingPoints.push(new RouteingPoint_1.RountingPointPairs(q.target, q.source));
                    }
                });
            }
            return s;
        });
    }
    Router.prototype.route = function (start, end) {
        var len = this.routes.length;
        var path = [];
        var pathPos = [];
        var distance = 0;
        var recursiveDecent = function (node, finish, answer, visited) {
            if (visited === void 0) { visited = []; }
            var availiableRoutingPoints = node.availiableRoutingPoints.filter(function (x) { return visited.indexOf(x) === -1; });
            if (availiableRoutingPoints.length === 0 || visited.length > len) {
                return {
                    distance: Infinity,
                    path: ['NO_SOLUTION'],
                    pathPos: []
                };
            }
            else if (availiableRoutingPoints.map(function (x) { return x.target; }).indexOf(finish) > -1) {
                //We are done for this path.
                return {
                    distance: answer.distance,
                    path: answer.path.concat([node.name, finish.name]),
                    pathPos: answer.pathPos.concat([node.position, finish.position])
                };
            }
            else {
                var paths = availiableRoutingPoints
                    .filter(function (n) { return answer.path.indexOf(n.source.name) === -1; })
                    .map(function (n) { return recursiveDecent(n.target, finish, {
                    distance: answer.distance + n.distance,
                    path: answer.path.concat([n.source.name]),
                    pathPos: answer.pathPos.concat([n.source.position])
                }, visited.concat([n])); })
                    .filter(function (n) { return n && n.distance !== Infinity; });
                var best = paths.sort(function (a, b) { return a.distance - b.distance; })[0];
                return best;
            }
        };
        var answer = {
            path: path,
            pathPos: pathPos,
            distance: distance
        };
        answer = recursiveDecent(start, end, answer, []) || {
            path: path,
            pathPos: pathPos,
            distance: distance
        };
        console.log('answer:', answer);
        return answer;
    };
    Router.prototype.minimum = function (arr) {
        var minIndex = 0, minValue = arr[0];
        arr.forEach(function (x, i) {
            if (arr[i] < minValue) {
                minIndex = i;
                minValue = arr[i];
            }
        });
        return {
            index: minIndex,
            value: minValue
        };
    };
    return Router;
}());
exports.Router = Router;

}).call(this,require("pBGvAp"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/Router.js","/")
},{"./3dStuff":1,"./Math":2,"./RouteingPoint":5,"buffer":9,"pBGvAp":11}],7:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
"use strict";
/// <reference path="../typings/tsd.d.ts" />
var Parser_1 = require('./Parser');
var Renderer_1 = require('./Renderer');
//[TODO] - Inline and unrole optimize for 3d case.
var renderer = new Renderer_1.Renderer();
window.fetch('https://space-fast-track.herokuapp.com/generate')
    .then(function (x) { return x.text(); })
    .then(function (x) { return Parser_1.parse(x); })
    .then(function (x) {
    var pathEl = document.getElementById('path');
    var distanceEl = document.getElementById('distance');
    var seedEl = document.getElementById('seed');
    seedEl.innerText = x.seed;
    if (x.answer.path.length > 0) {
        distanceEl.innerText = x.answer.distance.toFixed(1) + "Km";
        pathEl.innerText = x.answer.path.join(',');
    }
    else {
        distanceEl.innerText = "No solution found.";
        pathEl.innerText = '';
    }
    renderer.drawSolution(x);
});

}).call(this,require("pBGvAp"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/fake_679955ba.js","/")
},{"./Parser":3,"./Renderer":4,"buffer":9,"pBGvAp":11}],8:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)
	var PLUS_URL_SAFE = '-'.charCodeAt(0)
	var SLASH_URL_SAFE = '_'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS ||
		    code === PLUS_URL_SAFE)
			return 62 // '+'
		if (code === SLASH ||
		    code === SLASH_URL_SAFE)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

}).call(this,require("pBGvAp"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../node_modules/base64-js/lib/b64.js","/../node_modules/base64-js/lib")
},{"buffer":9,"pBGvAp":11}],9:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = Buffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192

/**
 * If `Buffer._useTypedArrays`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (compatible down to IE6)
 */
Buffer._useTypedArrays = (function () {
  // Detect if browser supports Typed Arrays. Supported browsers are IE 10+, Firefox 4+,
  // Chrome 7+, Safari 5.1+, Opera 11.6+, iOS 4.2+. If the browser does not support adding
  // properties to `Uint8Array` instances, then that's the same as no `Uint8Array` support
  // because we need to be able to add all the node Buffer API methods. This is an issue
  // in Firefox 4-29. Now fixed: https://bugzilla.mozilla.org/show_bug.cgi?id=695438
  try {
    var buf = new ArrayBuffer(0)
    var arr = new Uint8Array(buf)
    arr.foo = function () { return 42 }
    return 42 === arr.foo() &&
        typeof arr.subarray === 'function' // Chrome 9-10 lack `subarray`
  } catch (e) {
    return false
  }
})()

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (subject, encoding, noZero) {
  if (!(this instanceof Buffer))
    return new Buffer(subject, encoding, noZero)

  var type = typeof subject

  // Workaround: node's base64 implementation allows for non-padded strings
  // while base64-js does not.
  if (encoding === 'base64' && type === 'string') {
    subject = stringtrim(subject)
    while (subject.length % 4 !== 0) {
      subject = subject + '='
    }
  }

  // Find the length
  var length
  if (type === 'number')
    length = coerce(subject)
  else if (type === 'string')
    length = Buffer.byteLength(subject, encoding)
  else if (type === 'object')
    length = coerce(subject.length) // assume that object is array-like
  else
    throw new Error('First argument needs to be a number, array or string.')

  var buf
  if (Buffer._useTypedArrays) {
    // Preferred: Return an augmented `Uint8Array` instance for best performance
    buf = Buffer._augment(new Uint8Array(length))
  } else {
    // Fallback: Return THIS instance of Buffer (created by `new`)
    buf = this
    buf.length = length
    buf._isBuffer = true
  }

  var i
  if (Buffer._useTypedArrays && typeof subject.byteLength === 'number') {
    // Speed optimization -- use set if we're copying from a typed array
    buf._set(subject)
  } else if (isArrayish(subject)) {
    // Treat array-ish objects as a byte array
    for (i = 0; i < length; i++) {
      if (Buffer.isBuffer(subject))
        buf[i] = subject.readUInt8(i)
      else
        buf[i] = subject[i]
    }
  } else if (type === 'string') {
    buf.write(subject, 0, encoding)
  } else if (type === 'number' && !Buffer._useTypedArrays && !noZero) {
    for (i = 0; i < length; i++) {
      buf[i] = 0
    }
  }

  return buf
}

// STATIC METHODS
// ==============

Buffer.isEncoding = function (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.isBuffer = function (b) {
  return !!(b !== null && b !== undefined && b._isBuffer)
}

Buffer.byteLength = function (str, encoding) {
  var ret
  str = str + ''
  switch (encoding || 'utf8') {
    case 'hex':
      ret = str.length / 2
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8ToBytes(str).length
      break
    case 'ascii':
    case 'binary':
    case 'raw':
      ret = str.length
      break
    case 'base64':
      ret = base64ToBytes(str).length
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = str.length * 2
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.concat = function (list, totalLength) {
  assert(isArray(list), 'Usage: Buffer.concat(list, [totalLength])\n' +
      'list should be an Array.')

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  var i
  if (typeof totalLength !== 'number') {
    totalLength = 0
    for (i = 0; i < list.length; i++) {
      totalLength += list[i].length
    }
  }

  var buf = new Buffer(totalLength)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

// BUFFER INSTANCE METHODS
// =======================

function _hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  assert(strLen % 2 === 0, 'Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16)
    assert(!isNaN(byte), 'Invalid hex string')
    buf[offset + i] = byte
  }
  Buffer._charsWritten = i * 2
  return i
}

function _utf8Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf8ToBytes(string), buf, offset, length)
  return charsWritten
}

function _asciiWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(asciiToBytes(string), buf, offset, length)
  return charsWritten
}

function _binaryWrite (buf, string, offset, length) {
  return _asciiWrite(buf, string, offset, length)
}

function _base64Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(base64ToBytes(string), buf, offset, length)
  return charsWritten
}

function _utf16leWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf16leToBytes(string), buf, offset, length)
  return charsWritten
}

Buffer.prototype.write = function (string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length
      length = undefined
    }
  } else {  // legacy
    var swap = encoding
    encoding = offset
    offset = length
    length = swap
  }

  offset = Number(offset) || 0
  var remaining = this.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase()

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexWrite(this, string, offset, length)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Write(this, string, offset, length)
      break
    case 'ascii':
      ret = _asciiWrite(this, string, offset, length)
      break
    case 'binary':
      ret = _binaryWrite(this, string, offset, length)
      break
    case 'base64':
      ret = _base64Write(this, string, offset, length)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leWrite(this, string, offset, length)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toString = function (encoding, start, end) {
  var self = this

  encoding = String(encoding || 'utf8').toLowerCase()
  start = Number(start) || 0
  end = (end !== undefined)
    ? Number(end)
    : end = self.length

  // Fastpath empty strings
  if (end === start)
    return ''

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexSlice(self, start, end)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Slice(self, start, end)
      break
    case 'ascii':
      ret = _asciiSlice(self, start, end)
      break
    case 'binary':
      ret = _binarySlice(self, start, end)
      break
    case 'base64':
      ret = _base64Slice(self, start, end)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leSlice(self, start, end)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toJSON = function () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function (target, target_start, start, end) {
  var source = this

  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (!target_start) target_start = 0

  // Copy 0 bytes; we're done
  if (end === start) return
  if (target.length === 0 || source.length === 0) return

  // Fatal error conditions
  assert(end >= start, 'sourceEnd < sourceStart')
  assert(target_start >= 0 && target_start < target.length,
      'targetStart out of bounds')
  assert(start >= 0 && start < source.length, 'sourceStart out of bounds')
  assert(end >= 0 && end <= source.length, 'sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length)
    end = this.length
  if (target.length - target_start < end - start)
    end = target.length - target_start + start

  var len = end - start

  if (len < 100 || !Buffer._useTypedArrays) {
    for (var i = 0; i < len; i++)
      target[i + target_start] = this[i + start]
  } else {
    target._set(this.subarray(start, start + len), target_start)
  }
}

function _base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function _utf8Slice (buf, start, end) {
  var res = ''
  var tmp = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }

  return res + decodeUtf8Char(tmp)
}

function _asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++)
    ret += String.fromCharCode(buf[i])
  return ret
}

function _binarySlice (buf, start, end) {
  return _asciiSlice(buf, start, end)
}

function _hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function _utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i+1] * 256)
  }
  return res
}

Buffer.prototype.slice = function (start, end) {
  var len = this.length
  start = clamp(start, len, 0)
  end = clamp(end, len, len)

  if (Buffer._useTypedArrays) {
    return Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    var newBuf = new Buffer(sliceLen, undefined, true)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
    return newBuf
  }
}

// `get` will be removed in Node 0.13+
Buffer.prototype.get = function (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` will be removed in Node 0.13+
Buffer.prototype.set = function (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

Buffer.prototype.readUInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  return this[offset]
}

function _readUInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    val = buf[offset]
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
  } else {
    val = buf[offset] << 8
    if (offset + 1 < len)
      val |= buf[offset + 1]
  }
  return val
}

Buffer.prototype.readUInt16LE = function (offset, noAssert) {
  return _readUInt16(this, offset, true, noAssert)
}

Buffer.prototype.readUInt16BE = function (offset, noAssert) {
  return _readUInt16(this, offset, false, noAssert)
}

function _readUInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    if (offset + 2 < len)
      val = buf[offset + 2] << 16
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
    val |= buf[offset]
    if (offset + 3 < len)
      val = val + (buf[offset + 3] << 24 >>> 0)
  } else {
    if (offset + 1 < len)
      val = buf[offset + 1] << 16
    if (offset + 2 < len)
      val |= buf[offset + 2] << 8
    if (offset + 3 < len)
      val |= buf[offset + 3]
    val = val + (buf[offset] << 24 >>> 0)
  }
  return val
}

Buffer.prototype.readUInt32LE = function (offset, noAssert) {
  return _readUInt32(this, offset, true, noAssert)
}

Buffer.prototype.readUInt32BE = function (offset, noAssert) {
  return _readUInt32(this, offset, false, noAssert)
}

Buffer.prototype.readInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null,
        'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  var neg = this[offset] & 0x80
  if (neg)
    return (0xff - this[offset] + 1) * -1
  else
    return this[offset]
}

function _readInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt16(buf, offset, littleEndian, true)
  var neg = val & 0x8000
  if (neg)
    return (0xffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt16LE = function (offset, noAssert) {
  return _readInt16(this, offset, true, noAssert)
}

Buffer.prototype.readInt16BE = function (offset, noAssert) {
  return _readInt16(this, offset, false, noAssert)
}

function _readInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt32(buf, offset, littleEndian, true)
  var neg = val & 0x80000000
  if (neg)
    return (0xffffffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt32LE = function (offset, noAssert) {
  return _readInt32(this, offset, true, noAssert)
}

Buffer.prototype.readInt32BE = function (offset, noAssert) {
  return _readInt32(this, offset, false, noAssert)
}

function _readFloat (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 23, 4)
}

Buffer.prototype.readFloatLE = function (offset, noAssert) {
  return _readFloat(this, offset, true, noAssert)
}

Buffer.prototype.readFloatBE = function (offset, noAssert) {
  return _readFloat(this, offset, false, noAssert)
}

function _readDouble (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 7 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 52, 8)
}

Buffer.prototype.readDoubleLE = function (offset, noAssert) {
  return _readDouble(this, offset, true, noAssert)
}

Buffer.prototype.readDoubleBE = function (offset, noAssert) {
  return _readDouble(this, offset, false, noAssert)
}

Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'trying to write beyond buffer length')
    verifuint(value, 0xff)
  }

  if (offset >= this.length) return

  this[offset] = value
}

function _writeUInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 2); i < j; i++) {
    buf[offset + i] =
        (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
            (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, false, noAssert)
}

function _writeUInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffffffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 4); i < j; i++) {
    buf[offset + i] =
        (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, false, noAssert)
}

Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7f, -0x80)
  }

  if (offset >= this.length)
    return

  if (value >= 0)
    this.writeUInt8(value, offset, noAssert)
  else
    this.writeUInt8(0xff + value + 1, offset, noAssert)
}

function _writeInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fff, -0x8000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt16(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt16(buf, 0xffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, false, noAssert)
}

function _writeInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fffffff, -0x80000000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt32(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt32(buf, 0xffffffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, false, noAssert)
}

function _writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 23, 4)
}

Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, false, noAssert)
}

function _writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 7 < buf.length,
        'Trying to write beyond buffer length')
    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 52, 8)
}

Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, false, noAssert)
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (typeof value === 'string') {
    value = value.charCodeAt(0)
  }

  assert(typeof value === 'number' && !isNaN(value), 'value is not a number')
  assert(end >= start, 'end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  assert(start >= 0 && start < this.length, 'start out of bounds')
  assert(end >= 0 && end <= this.length, 'end out of bounds')

  for (var i = start; i < end; i++) {
    this[i] = value
  }
}

Buffer.prototype.inspect = function () {
  var out = []
  var len = this.length
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i])
    if (i === exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...'
      break
    }
  }
  return '<Buffer ' + out.join(' ') + '>'
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer._useTypedArrays) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1)
        buf[i] = this[i]
      return buf.buffer
    }
  } else {
    throw new Error('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function (arr) {
  arr._isBuffer = true

  // save reference to original Uint8Array get/set methods before overwriting
  arr._get = arr.get
  arr._set = arr.set

  // deprecated, will be removed in node 0.13+
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

// slice(start, end)
function clamp (index, len, defaultValue) {
  if (typeof index !== 'number') return defaultValue
  index = ~~index;  // Coerce to integer.
  if (index >= len) return len
  if (index >= 0) return index
  index += len
  if (index >= 0) return index
  return 0
}

function coerce (length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length)
  return length < 0 ? 0 : length
}

function isArray (subject) {
  return (Array.isArray || function (subject) {
    return Object.prototype.toString.call(subject) === '[object Array]'
  })(subject)
}

function isArrayish (subject) {
  return isArray(subject) || Buffer.isBuffer(subject) ||
      subject && typeof subject === 'object' &&
      typeof subject.length === 'number'
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    var b = str.charCodeAt(i)
    if (b <= 0x7F)
      byteArray.push(str.charCodeAt(i))
    else {
      var start = i
      if (b >= 0xD800 && b <= 0xDFFF) i++
      var h = encodeURIComponent(str.slice(start, i+1)).substr(1).split('%')
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16))
    }
  }
  return byteArray
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(str)
}

function blitBuffer (src, dst, offset, length) {
  var pos
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length))
      break
    dst[i + offset] = src[i]
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

/*
 * We have to make sure that the value is a valid integer. This means that it
 * is non-negative. It has no fractional component and that it does not
 * exceed the maximum allowed value.
 */
function verifuint (value, max) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value >= 0, 'specified a negative value for writing an unsigned value')
  assert(value <= max, 'value is larger than maximum value for type')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifsint (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifIEEE754 (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
}

function assert (test, message) {
  if (!test) throw new Error(message || 'Failed assertion')
}

}).call(this,require("pBGvAp"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../node_modules/buffer/index.js","/../node_modules/buffer")
},{"base64-js":8,"buffer":9,"ieee754":10,"pBGvAp":11}],10:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

}).call(this,require("pBGvAp"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../node_modules/ieee754/index.js","/../node_modules/ieee754")
},{"buffer":9,"pBGvAp":11}],11:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

}).call(this,require("pBGvAp"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../node_modules/process/browser.js","/../node_modules/process")
},{"buffer":9,"pBGvAp":11}]},{},[7])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXR0aWFzZmVzdGluL0Ryb3Bib3gvUHJvamVjdHMvUmVhY3Rvck9yYml0YWwvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9tYXR0aWFzZmVzdGluL0Ryb3Bib3gvUHJvamVjdHMvUmVhY3Rvck9yYml0YWwvYnVpbGQvM2RTdHVmZi5qcyIsIi9Vc2Vycy9tYXR0aWFzZmVzdGluL0Ryb3Bib3gvUHJvamVjdHMvUmVhY3Rvck9yYml0YWwvYnVpbGQvTWF0aC5qcyIsIi9Vc2Vycy9tYXR0aWFzZmVzdGluL0Ryb3Bib3gvUHJvamVjdHMvUmVhY3Rvck9yYml0YWwvYnVpbGQvUGFyc2VyLmpzIiwiL1VzZXJzL21hdHRpYXNmZXN0aW4vRHJvcGJveC9Qcm9qZWN0cy9SZWFjdG9yT3JiaXRhbC9idWlsZC9SZW5kZXJlci5qcyIsIi9Vc2Vycy9tYXR0aWFzZmVzdGluL0Ryb3Bib3gvUHJvamVjdHMvUmVhY3Rvck9yYml0YWwvYnVpbGQvUm91dGVpbmdQb2ludC5qcyIsIi9Vc2Vycy9tYXR0aWFzZmVzdGluL0Ryb3Bib3gvUHJvamVjdHMvUmVhY3Rvck9yYml0YWwvYnVpbGQvUm91dGVyLmpzIiwiL1VzZXJzL21hdHRpYXNmZXN0aW4vRHJvcGJveC9Qcm9qZWN0cy9SZWFjdG9yT3JiaXRhbC9idWlsZC9mYWtlXzY3OTk1NWJhLmpzIiwiL1VzZXJzL21hdHRpYXNmZXN0aW4vRHJvcGJveC9Qcm9qZWN0cy9SZWFjdG9yT3JiaXRhbC9ub2RlX21vZHVsZXMvYmFzZTY0LWpzL2xpYi9iNjQuanMiLCIvVXNlcnMvbWF0dGlhc2Zlc3Rpbi9Ecm9wYm94L1Byb2plY3RzL1JlYWN0b3JPcmJpdGFsL25vZGVfbW9kdWxlcy9idWZmZXIvaW5kZXguanMiLCIvVXNlcnMvbWF0dGlhc2Zlc3Rpbi9Ecm9wYm94L1Byb2plY3RzL1JlYWN0b3JPcmJpdGFsL25vZGVfbW9kdWxlcy9pZWVlNzU0L2luZGV4LmpzIiwiL1VzZXJzL21hdHRpYXNmZXN0aW4vRHJvcGJveC9Qcm9qZWN0cy9SZWFjdG9yT3JiaXRhbC9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdmxDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG5cInVzZSBzdHJpY3RcIjtcbnZhciBNYXRoXzEgPSByZXF1aXJlKCcuL01hdGgnKTtcbnZhciBlcHNpbG9uID0gMC4wMTtcbnZhciBMaW5lID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBMaW5lKG8sIGQpIHtcbiAgICAgICAgdGhpcy5vID0gbztcbiAgICAgICAgdGhpcy5kID0gZC5ub3JtKCk7XG4gICAgfVxuICAgIExpbmUucHJvdG90eXBlLmdldFBvaW50ID0gZnVuY3Rpb24gKGRpc3RhbmNlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm8uYWRkKHRoaXMuZC5zY2FsZShkaXN0YW5jZSkpO1xuICAgIH07XG4gICAgcmV0dXJuIExpbmU7XG59KCkpO1xuZXhwb3J0cy5MaW5lID0gTGluZTtcbnZhciBTcGhlcmUgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFNwaGVyZShvLCByKSB7XG4gICAgICAgIHRoaXMubyA9IG87XG4gICAgICAgIHRoaXMuciA9IHI7XG4gICAgfVxuICAgIFNwaGVyZS5wcm90b3R5cGUucG9pbnRPblNwaGVyZSA9IGZ1bmN0aW9uIChwKSB7XG4gICAgICAgIHJldHVybiBNYXRoLmFicyhwLmRpc3RhbmNlKHRoaXMubykgLSB0aGlzLnIpIDwgZXBzaWxvbjtcbiAgICB9O1xuICAgIFNwaGVyZS5wcm90b3R5cGUubm9ybWFsID0gZnVuY3Rpb24gKHApIHtcbiAgICAgICAgcmV0dXJuIG5ldyBNYXRoXzEuVmVjMyhbXG4gICAgICAgICAgICAocC5nZXRYKCkgLSB0aGlzLm8uZ2V0WCgpKSAvIHRoaXMucixcbiAgICAgICAgICAgIChwLmdldFkoKSAtIHRoaXMuby5nZXRZKCkpIC8gdGhpcy5yLFxuICAgICAgICAgICAgKHAuZ2V0WigpIC0gdGhpcy5vLmdldFooKSkgLyB0aGlzLnJcbiAgICAgICAgXSk7XG4gICAgfTtcbiAgICBTcGhlcmUucHJvdG90eXBlLmludGVyc2VjdCA9IGZ1bmN0aW9uIChsKSB7XG4gICAgICAgIHZhciBxID0gbC5kLmRvdChsLm8uc3ViKHRoaXMubykpLCB0ID0gTWF0aC5wb3cocSwgMikgLSBNYXRoLnBvdyhsLm8uZGlzdGFuY2UodGhpcy5vKSwgMikgKyBNYXRoLnBvdyh0aGlzLnIsIDIpO1xuICAgICAgICBpZiAodCA8IDAgfHwgKHR5cGVvZiB0ID09PSAnbnVtYmVyJyAmJiBpc05hTih0KSkpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0ID09PSAwKSB7XG4gICAgICAgICAgICB2YXIgeCA9IGwuZ2V0UG9pbnQoLXEpO1xuICAgICAgICAgICAgaWYgKCF0aGlzLnBvaW50T25TcGhlcmUoeCkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTb2x1dGlvbiBwb2ludHMgXCIgKyB4ICsgXCIgbm90IG9uIHNwaGVyZS5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gW3hdOyAvL09uZSBzb2x1dGlvbiAoVHdvIHBvaW50cyBhdCBzYW1lIHBvc3Rpb24gdGhhdCB0YW5nZW50IHRoZSBzcGhlcmUpXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0ID0gTWF0aC5zcXJ0KHQpO1xuICAgICAgICAgICAgdmFyIHgwID0gbC5nZXRQb2ludCgtcSAtIHQpLCB4MSA9IGwuZ2V0UG9pbnQoLXEgKyB0KTtcbiAgICAgICAgICAgIGlmICghdGhpcy5wb2ludE9uU3BoZXJlKHgwKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNvbHV0aW9uIFwiICsgeDAgKyBcIiBwb2ludCBub3Qgb24gc3BoZXJlLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghdGhpcy5wb2ludE9uU3BoZXJlKHgxKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNvbHV0aW9uIFwiICsgeDEgKyBcIiBwb2ludCBub3Qgb24gc3BoZXJlLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBbeDAsIHgxXTsgLy9Ud28gdW5pcXVlIHNvbHV0aW9ucyAgIFxuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gU3BoZXJlO1xufSgpKTtcbmV4cG9ydHMuU3BoZXJlID0gU3BoZXJlO1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcInBCR3ZBcFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLzNkU3R1ZmYuanNcIixcIi9cIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG5cInVzZSBzdHJpY3RcIjtcbnZhciBWZWMzID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBWZWMzKGFycikge1xuICAgICAgICAvKipcbiAgICAgICAgICogQXNzZXJ0aW9uc1xuICAgICAgICAgKi9cbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGFycikpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgY29uc3RydXRvciBwYXJhbWV0ZXIgdHlwZS4gQXJyYXkgZXhwZWN0ZWQuJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFyci5sZW5ndGggIT09IDMpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgY29uc3RydXRvciBhcnJheSBsZW5ndGguIExlbmd0aCAzIGV4cGVjdGVkLicpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudmFsdWUgPSBuZXcgRmxvYXQzMkFycmF5KGFycik7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldHRlcnMgZm9yIDNkIGNvb3JkaW5hdGVzXG4gICAgICovXG4gICAgVmVjMy5wcm90b3R5cGUuZ2V0WCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVbMF07XG4gICAgfTtcbiAgICA7XG4gICAgVmVjMy5wcm90b3R5cGUuZ2V0WSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVbMV07XG4gICAgfTtcbiAgICA7XG4gICAgVmVjMy5wcm90b3R5cGUuZ2V0WiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVbMl07XG4gICAgfTtcbiAgICA7XG4gICAgVmVjMy5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKHcpIHtcbiAgICAgICAgdmFyIHYgPSB0aGlzO1xuICAgICAgICByZXR1cm4gbmV3IFZlYzMoW1xuICAgICAgICAgICAgdGhpcy5nZXRYKCkgKyB3LmdldFgoKSxcbiAgICAgICAgICAgIHRoaXMuZ2V0WSgpICsgdy5nZXRZKCksXG4gICAgICAgICAgICB0aGlzLmdldFooKSArIHcuZ2V0WigpLFxuICAgICAgICBdKTtcbiAgICB9O1xuICAgIFZlYzMucHJvdG90eXBlLm5lZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHYgPSB0aGlzO1xuICAgICAgICByZXR1cm4gbmV3IFZlYzMoW1xuICAgICAgICAgICAgLXRoaXMuZ2V0WCgpLFxuICAgICAgICAgICAgLXRoaXMuZ2V0WSgpLFxuICAgICAgICAgICAgLXRoaXMuZ2V0WigpXG4gICAgICAgIF0pO1xuICAgIH07XG4gICAgVmVjMy5wcm90b3R5cGUuc3ViID0gZnVuY3Rpb24gKHcpIHtcbiAgICAgICAgdmFyIHYgPSB0aGlzO1xuICAgICAgICByZXR1cm4gbmV3IFZlYzMoW1xuICAgICAgICAgICAgdi5nZXRYKCkgLSB3LmdldFgoKSxcbiAgICAgICAgICAgIHYuZ2V0WSgpIC0gdy5nZXRZKCksXG4gICAgICAgICAgICB2LmdldFooKSAtIHcuZ2V0WigpXG4gICAgICAgIF0pO1xuICAgIH07XG4gICAgVmVjMy5wcm90b3R5cGUuc2NhbGUgPSBmdW5jdGlvbiAoYSkge1xuICAgICAgICB2YXIgdiA9IHRoaXM7XG4gICAgICAgIHJldHVybiBuZXcgVmVjMyhbXG4gICAgICAgICAgICBhICogdi5nZXRYKCksXG4gICAgICAgICAgICBhICogdi5nZXRZKCksXG4gICAgICAgICAgICBhICogdi5nZXRaKClcbiAgICAgICAgXSk7XG4gICAgfTtcbiAgICBWZWMzLnByb3RvdHlwZS5kb3QgPSBmdW5jdGlvbiAodykge1xuICAgICAgICB2YXIgdiA9IHRoaXM7XG4gICAgICAgIHJldHVybiB2LmdldFgoKSAqIHcuZ2V0WCgpICsgdi5nZXRZKCkgKiB3LmdldFkoKSArIHYuZ2V0WigpICogdy5nZXRaKCk7XG4gICAgfTtcbiAgICBWZWMzLnByb3RvdHlwZS5sZW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQodGhpcy5kb3QodGhpcykpO1xuICAgIH07XG4gICAgVmVjMy5wcm90b3R5cGUubm9ybSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGxlbiA9IHRoaXMubGVuKCk7XG4gICAgICAgIHJldHVybiBsZW4gPT09IDAgPyB0aGlzIDogdGhpcy5zY2FsZSgxIC8gbGVuKTtcbiAgICB9O1xuICAgIFZlYzMucHJvdG90eXBlLmNyb3NzID0gZnVuY3Rpb24gKHcpIHtcbiAgICAgICAgdmFyIHYgPSB0aGlzO1xuICAgICAgICByZXR1cm4gbmV3IFZlYzMoW1xuICAgICAgICAgICAgdi5nZXRZKCkgKiB3LmdldFooKSAtIHYuZ2V0WigpICogdy5nZXRZKCksXG4gICAgICAgICAgICB2LmdldFooKSAqIHcuZ2V0WCgpIC0gdi5nZXRYKCkgKiB3LmdldFooKSxcbiAgICAgICAgICAgIHYuZ2V0WCgpICogdy5nZXRZKCkgLSB2LmdldFkoKSAqIHcuZ2V0WCgpXG4gICAgICAgIF0pO1xuICAgIH07XG4gICAgVmVjMy5wcm90b3R5cGUuZGlzdGFuY2UgPSBmdW5jdGlvbiAodykge1xuICAgICAgICB2YXIgdiA9IHRoaXM7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoTWF0aC5wb3codi5nZXRYKCkgLSB3LmdldFgoKSwgMikgK1xuICAgICAgICAgICAgTWF0aC5wb3codi5nZXRZKCkgLSB3LmdldFkoKSwgMikgK1xuICAgICAgICAgICAgTWF0aC5wb3codi5nZXRaKCkgLSB3LmdldFooKSwgMikpO1xuICAgIH07XG4gICAgVmVjMy5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFgoKSArIFwiLFwiICsgdGhpcy5nZXRZKCkgKyBcIixcIiArIHRoaXMuZ2V0WigpO1xuICAgIH07XG4gICAgcmV0dXJuIFZlYzM7XG59KCkpO1xuZXhwb3J0cy5WZWMzID0gVmVjMztcbnZhciBQb2xhckNvb3JkaW5hdGUgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFBvbGFyQ29vcmRpbmF0ZShsYXQsIGxvbiwgYWx0KSB7XG4gICAgICAgIHRoaXMubGF0ID0gTWF0aC5QSSAqIGxhdCAvIDE4MDtcbiAgICAgICAgdGhpcy5sb24gPSBNYXRoLlBJICogbG9uIC8gMTgwO1xuICAgICAgICB0aGlzLmFsdCA9IGFsdDtcbiAgICB9XG4gICAgUG9sYXJDb29yZGluYXRlLnByb3RvdHlwZS5jb252ZXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbmV3IFZlYzMoW1xuICAgICAgICAgICAgdGhpcy5hbHQgKiBNYXRoLmNvcyh0aGlzLmxhdCkgKiBNYXRoLmNvcyh0aGlzLmxvbiksXG4gICAgICAgICAgICB0aGlzLmFsdCAqIE1hdGguY29zKHRoaXMubGF0KSAqIE1hdGguc2luKHRoaXMubG9uKSxcbiAgICAgICAgICAgIHRoaXMuYWx0ICogTWF0aC5zaW4odGhpcy5sYXQpXG4gICAgICAgIF0pO1xuICAgIH07XG4gICAgcmV0dXJuIFBvbGFyQ29vcmRpbmF0ZTtcbn0oKSk7XG5leHBvcnRzLlBvbGFyQ29vcmRpbmF0ZSA9IFBvbGFyQ29vcmRpbmF0ZTtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJwQkd2QXBcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9NYXRoLmpzXCIsXCIvXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuXCJ1c2Ugc3RyaWN0XCI7XG52YXIgUm91dGVyXzEgPSByZXF1aXJlKCcuL1JvdXRlcicpO1xudmFyIE1hdGhfMSA9IHJlcXVpcmUoJy4vTWF0aCcpO1xudmFyIFJvdXRlaW5nUG9pbnRfMSA9IHJlcXVpcmUoJy4vUm91dGVpbmdQb2ludCcpO1xuLy9IZWxwZXIgZnVuY3Rpb24gdG8gcGFyc2UgZGF0YVxuZnVuY3Rpb24gcGFyc2UodGV4dCkge1xuICAgIHZhciByZXN1bHQ7XG4gICAgdmFyIHJvd3MgPSB0ZXh0XG4gICAgICAgIC5zcGxpdCgvW1xcclxcbl0rLyk7XG4gICAgdmFyIHJvdXRlaW5nUG9pbnRzID0gcm93c1xuICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uICh4LCBpKSB7IHJldHVybiBpID4gMCAmJiBpIDwgcm93cy5sZW5ndGggLSAxOyB9KVxuICAgICAgICAubWFwKGZ1bmN0aW9uIChyb3cpIHtcbiAgICAgICAgdmFyIHZhbHVlcyA9IHJvdy5zcGxpdCgnLCcpO1xuICAgICAgICByZXR1cm4gbmV3IFJvdXRlaW5nUG9pbnRfMS5Sb3V0ZWluZ1BvaW50KHZhbHVlc1swXSwgbmV3IE1hdGhfMS5Qb2xhckNvb3JkaW5hdGUoK3ZhbHVlc1sxXSwgK3ZhbHVlc1syXSwgK3ZhbHVlc1szXSArIDYzNzEpKTtcbiAgICB9KTtcbiAgICB2YXIgZWFydGhQb2ludHMgPSByb3dzW3Jvd3MubGVuZ3RoIC0gMV0uc3BsaXQoJywnKTtcbiAgICAvL1tOT1RFXSAtIEFkZCBvbmUgdG8gZWFydGggcmFkaW91cyBmb3IgYWx0aWR1ZGUsIHRvIHByZXZlbnQgdG8gdGFuZ2VudCBpbnRlcnNlY3Rpb24gd2l0aCBzcGhlcmVcbiAgICB2YXIgc3RhcnQgPSBuZXcgUm91dGVpbmdQb2ludF8xLlJvdXRlaW5nUG9pbnQoJ3N0YXJ0JywgbmV3IE1hdGhfMS5Qb2xhckNvb3JkaW5hdGUoK2VhcnRoUG9pbnRzWzFdLCArZWFydGhQb2ludHNbMl0sIDYzNzEpKTtcbiAgICB2YXIgZW5kID0gbmV3IFJvdXRlaW5nUG9pbnRfMS5Sb3V0ZWluZ1BvaW50KCdlbmQnLCBuZXcgTWF0aF8xLlBvbGFyQ29vcmRpbmF0ZSgrZWFydGhQb2ludHNbM10sICtlYXJ0aFBvaW50c1s0XSwgNjM3MSkpO1xuICAgIC8vQWRkIHN0YXJ0IGFuZCBlbmQgdG8gcm91dGVpbmdQb2ludHNcbiAgICByb3V0ZWluZ1BvaW50cy51bnNoaWZ0KHN0YXJ0KTtcbiAgICByb3V0ZWluZ1BvaW50cy5wdXNoKGVuZCk7XG4gICAgdmFyIHJvdXRlciA9IG5ldyBSb3V0ZXJfMS5Sb3V0ZXIocm91dGVpbmdQb2ludHMpO1xuICAgIHZhciBhbnN3ZXIgPSByb3V0ZXIucm91dGUoc3RhcnQsIGVuZCk7XG4gICAgdmFyIHJldFZhbCA9IHtcbiAgICAgICAgc2VlZDogcm93c1swXSxcbiAgICAgICAgcm91dGVpbmdQb2ludHM6IHJvdXRlaW5nUG9pbnRzLm1hcChmdW5jdGlvbiAoeCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBuYW1lOiB4Lm5hbWUsXG4gICAgICAgICAgICAgICAgcG9zaXRpb246IHgucG9zaXRpb24sXG4gICAgICAgICAgICAgICAgYXZhaWxpYWJsZVJvdXRpbmdQb2ludHM6IHguYXZhaWxpYWJsZVJvdXRpbmdQb2ludHMubWFwKGZ1bmN0aW9uICh5KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB5LnRhcmdldC5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IHkudGFyZ2V0LnBvc2l0aW9uXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pLFxuICAgICAgICBzdGFydDoge1xuICAgICAgICAgICAgbmFtZTogc3RhcnQubmFtZSxcbiAgICAgICAgICAgIHBvc2l0aW9uOiBzdGFydC5wb3NpdGlvbixcbiAgICAgICAgICAgIGF2YWlsaWFibGVSb3V0aW5nUG9pbnRzOiBzdGFydC5hdmFpbGlhYmxlUm91dGluZ1BvaW50cy5tYXAoZnVuY3Rpb24gKHkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiB5LnRhcmdldC5uYW1lLFxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogeS50YXJnZXQucG9zaXRpb25cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgZW5kOiB7XG4gICAgICAgICAgICBuYW1lOiBlbmQubmFtZSxcbiAgICAgICAgICAgIHBvc2l0aW9uOiBlbmQucG9zaXRpb24sXG4gICAgICAgICAgICBhdmFpbGlhYmxlUm91dGluZ1BvaW50czogZW5kLmF2YWlsaWFibGVSb3V0aW5nUG9pbnRzLm1hcChmdW5jdGlvbiAoeSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IHkudGFyZ2V0Lm5hbWUsXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiB5LnRhcmdldC5wb3NpdGlvblxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICBhbnN3ZXI6IGFuc3dlclxuICAgIH07XG4gICAgY29uc29sZS5sb2coJ3Jlc3VsdDonLCByZXRWYWwpO1xuICAgIHJldHVybiByZXRWYWw7XG59XG5leHBvcnRzLnBhcnNlID0gcGFyc2U7XG47XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwicEJHdkFwXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvUGFyc2VyLmpzXCIsXCIvXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxuXCJ1c2Ugc3RyaWN0XCI7XG52YXIgUmVuZGVyZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFJlbmRlcmVyKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLnJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoe1xuICAgICAgICAgICAgYW50aWFsaWFzOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG4gICAgICAgIHRoaXMuY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKDQ1LCB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodCwgMC4wMSwgMTAwKTtcbiAgICAgICAgdGhpcy5jb250cm9scyA9IG5ldyBUSFJFRS5PcmJpdENvbnRyb2xzKHRoaXMuY2FtZXJhKTtcbiAgICAgICAgdGhpcy5jb250cm9scy5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB0aGlzLnJlbmRlcmVyLnJlbmRlcik7XG4gICAgICAgIHRoaXMuc3RhcnRQb2ludCA9IG51bGwsXG4gICAgICAgICAgICB0aGlzLmVuZFBvaW50ID0gbnVsbCxcbiAgICAgICAgICAgIHRoaXMuc2F0ZWxpdGVQb2ludHMgPSBbXSxcbiAgICAgICAgICAgIHRoaXMuc2F0ZWxpdGVMYWJsZXMgPSBbXSxcbiAgICAgICAgICAgIHRoaXMucGF0aExpbmUgPSBudWxsO1xuICAgICAgICB0aGlzLm9uUmVuZGVyID0gW2Z1bmN0aW9uICgpIHsgcmV0dXJuIF90aGlzLnJlbmRlcmVyLnJlbmRlcihfdGhpcy5zY2VuZSwgX3RoaXMuY2FtZXJhKTsgfV07XG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH1cbiAgICBSZW5kZXJlci5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgVEhSRUUuQ2FjaGUuZW5hYmxlZCA9IHRydWU7XG4gICAgICAgIC8vU2V0IHJlbmRlcmluZyB2aWV3cG9ydFxuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5yZW5kZXJlci5kb21FbGVtZW50KTtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zaGFkb3dNYXAuZW5hYmxlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuY2FtZXJhLnBvc2l0aW9uLnogPSA0O1xuICAgICAgICB0aGlzLnNjZW5lLnJvdGF0ZVooMCAqIE1hdGguUEkgLyAxODApO1xuICAgICAgICB0aGlzLnNjZW5lLnJvdGF0ZVgoMCAqIE1hdGguUEkgLyAxODApO1xuICAgICAgICB0aGlzLnNjZW5lLnJvdGF0ZVkoMCAqIE1hdGguUEkgLyAxODApO1xuICAgICAgICAvL1tUT0RPXSBTZXQgc3RhbmRhcmQgKEV1cm9wZSlcbiAgICAgICAgLy8gdGhpcy5zY2VuZS5yb3RhdGVaKDAgKiBNYXRoLlBJLzE4MClcbiAgICAgICAgLy8gdGhpcy5zY2VuZS5yb3RhdGVYKDQ1ICogTWF0aC5QSS8xODApO1xuICAgICAgICAvLyB0aGlzLnNjZW5lLnJvdGF0ZVkoLTExMCAqIE1hdGguUEkvMTgwKTtcbiAgICAgICAgLy8gdGhpcy5jcmVhdGVMaWdodHMoKTtcbiAgICAgICAgdGhpcy5lYXJ0aFN1bk9iaiA9IG5ldyBUSFJFRS5PYmplY3QzRCgpO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZCh0aGlzLmVhcnRoU3VuT2JqKTtcbiAgICAgICAgdGhpcy5jcmVhdGVTdGFyZmllbGQoKTtcbiAgICAgICAgdGhpcy5lYXJ0aCA9IHRoaXMuY3JlYXRlRWFydGgoKTtcbiAgICAgICAgdGhpcy5jcmVhdGVMaWdodHMoKTtcbiAgICAgICAgLy9Xb3JrYXJ1bmQgdGhpcyBzY29wZSBpc3N1ZVxuICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICB2YXIgbGFzdFRpbWVNc2VjID0gbnVsbDtcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uIGFuaW1hdGUobm93KSB7XG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7XG4gICAgICAgICAgICBsYXN0VGltZU1zZWMgPSBsYXN0VGltZU1zZWMgfHwgbm93IC0gMTAwMCAvIDYwO1xuICAgICAgICAgICAgdmFyIGRlbHRhID0gTWF0aC5taW4oMjAwLCBub3cgLSBsYXN0VGltZU1zZWMpO1xuICAgICAgICAgICAgbGFzdFRpbWVNc2VjID0gbm93O1xuICAgICAgICAgICAgbWUub25SZW5kZXIuZm9yRWFjaChmdW5jdGlvbiAoZm4pIHsgcmV0dXJuIGZuLmNhbGwobWUsIGRlbHRhIC8gMTAwMCwgbm93IC8gMTAwMCk7IH0sIG1lKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBSZW5kZXJlci5wcm90b3R5cGUuY3JlYXRlTGlnaHRzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYW5idWVidExpZ2h0ID0gbmV3IFRIUkVFLkFtYmllbnRMaWdodCgweDIyMjIyMik7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGFuYnVlYnRMaWdodCk7XG4gICAgICAgIHZhciBkaXJlY3Rpb25hbExpZ2h0ID0gbmV3IFRIUkVFLkRpcmVjdGlvbmFsTGlnaHQoMHhmZmZmZmYsIDEpO1xuICAgICAgICBkaXJlY3Rpb25hbExpZ2h0LnBvc2l0aW9uLnNldCg1MCwgMjUsIDUwKTtcbiAgICAgICAgLy8gdGhpcy5zY2VuZS5hZGQoIGRpcmVjdGlvbmFsTGlnaHQgKTtcbiAgICAgICAgZGlyZWN0aW9uYWxMaWdodC5jYXN0U2hhZG93ID0gdHJ1ZTtcbiAgICAgICAgZGlyZWN0aW9uYWxMaWdodC5zaGFkb3cuY2FtZXJhLm5lYXIgPSAwLjAxO1xuICAgICAgICBkaXJlY3Rpb25hbExpZ2h0LnNoYWRvdy5jYW1lcmEuZmFyID0gMTU7XG4gICAgICAgIGRpcmVjdGlvbmFsTGlnaHQuc2hhZG93LmNhbWVyYS5mb3YgPSA0NTtcbiAgICAgICAgZGlyZWN0aW9uYWxMaWdodC5zaGFkb3cuY2FtZXJhLmxlZnQgPSAtMTtcbiAgICAgICAgZGlyZWN0aW9uYWxMaWdodC5zaGFkb3cuY2FtZXJhLnJpZ2h0ID0gMTtcbiAgICAgICAgZGlyZWN0aW9uYWxMaWdodC5zaGFkb3cuY2FtZXJhLnRvcCA9IDE7XG4gICAgICAgIGRpcmVjdGlvbmFsTGlnaHQuc2hhZG93LmNhbWVyYS5ib3R0b20gPSAtMTtcbiAgICAgICAgZGlyZWN0aW9uYWxMaWdodC5zaGFkb3cuYmlhcyA9IDAuMDAxO1xuICAgICAgICBkaXJlY3Rpb25hbExpZ2h0LnNoYWRvdy5tYXBTaXplLndpZHRoID0gMTAyNDtcbiAgICAgICAgZGlyZWN0aW9uYWxMaWdodC5zaGFkb3cubWFwU2l6ZS5oZWlnaHQgPSAxMDI0O1xuICAgICAgICB0aGlzLmVhcnRoU3VuT2JqLmFkZChkaXJlY3Rpb25hbExpZ2h0KTtcbiAgICAgICAgdGhpcy5vblJlbmRlci5wdXNoKGZ1bmN0aW9uIChkZWx0YSwgbm93KSB7XG4gICAgICAgICAgICB0aGlzLmVhcnRoU3VuT2JqLnJvdGF0aW9uLnkgLT0gMSAvIDMyICogZGVsdGE7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZGlyZWN0aW9uYWxMaWdodDtcbiAgICB9O1xuICAgIFJlbmRlcmVyLnByb3RvdHlwZS5jcmVhdGVTdGFyZmllbGQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vW0ZJWE1FXSAtIFpvb21pbmcgb3V0IGNhdXNlcyBibGFjayByaW5nIGFyb3VuZCBlYXJ0aFxuICAgICAgICAvL1tUT0RPXSAtIFJvdGF0ZSBza3kgdG8gY29ycmVjdCBwb3NpdGlvblxuICAgICAgICAvLyBmcm9tIE5BU0EgKGh0dHBzOi8vc3ZzLmdzZmMubmFzYS5nb3YvdmlzL2EwMDAwMDAvYTAwMzUwMC9hMDAzNTcyL1R5Y2hvU2t5bWFwSUkudDVfMDQwOTZ4MDIwNDguanBnKVxuICAgICAgICB2YXIgdGV4dHVyZSA9IFRIUkVFLkltYWdlVXRpbHMubG9hZFRleHR1cmUoJy4uL2ltYWdlcy9UeWNob1NreW1hcElJLnQ1XzA0MDk2eDAyMDQ4LmpwZycpO1xuICAgICAgICB2YXIgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoe1xuICAgICAgICAgICAgbWFwOiB0ZXh0dXJlLFxuICAgICAgICAgICAgc2lkZTogVEhSRUUuQmFja1NpZGVcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBnZW9tZXRyeSA9IG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeSgxMDAsIDY0LCA2NCk7XG4gICAgICAgIHZhciBtZXNoID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQobWVzaCk7XG4gICAgfTtcbiAgICBSZW5kZXJlci5wcm90b3R5cGUuY3JlYXRlRWFydGggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vUmV3b3JrZWQgdmVyc2lvbiBvZjogaHR0cDovL2xlYXJuaW5ndGhyZWVqcy5jb20vYmxvZy8yMDEzLzA5LzE2L2hvdy10by1tYWtlLXRoZS1lYXJ0aC1pbi13ZWJnbC9cbiAgICAgICAgLy9bVE9ET10gLSBDYWxpYnJhdGUgdGV4dHVyZSBwb3NpdGlvbiB0byByZWFsIGxvbmdpdHVkZSBsYXRpZHVkZSBwb3N0aW9ucy5cbiAgICAgICAgLy8gaW1hZ2VzIGZyb20gTkFTQSAoaHR0cDovL3Zpc2libGVlYXJ0aC5uYXNhLmdvdi92aWV3LnBocD9pZD03MzU4MCwgaHR0cHM6Ly9hc3RlcndlYi5qcGwubmFzYS5nb3YvZ2RlbS5hc3AsIGh0dHA6Ly92aXNpYmxlZWFydGgubmFzYS5nb3Yvdmlldy5waHA/aWQ9NzM5MzQsIGh0dHA6Ly9wbGFuZXRwaXhlbGVtcG9yaXVtLmNvbSlcbiAgICAgICAgdmFyIGdlb21ldHJ5ID0gbmV3IFRIUkVFLlNwaGVyZUdlb21ldHJ5KDEsIDY0LCA2NCk7XG4gICAgICAgIHZhciBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7XG4gICAgICAgICAgICBtYXA6IFRIUkVFLkltYWdlVXRpbHMubG9hZFRleHR1cmUoJy4uL2ltYWdlcy93b3JsZC50b3BvLmJhdGh5LjIwMDQwMS4zeDU0MDB4MjcwMC5qcGcnKSxcbiAgICAgICAgICAgIG5vcm1hbE1hcDogVEhSRUUuSW1hZ2VVdGlscy5sb2FkVGV4dHVyZSgnLi4vaW1hZ2VzL2VhcnRoTm9ybWFsTWFwXzhrLXRpZy5wbmcnKSxcbiAgICAgICAgICAgIC8vIG5vcm1hbFNjYWxlOiAwLjUsXG4gICAgICAgICAgICBidW1wTWFwOiBUSFJFRS5JbWFnZVV0aWxzLmxvYWRUZXh0dXJlKCcuLi9pbWFnZXMvR0RFTS0xMGttLUJXLnBuZycpLFxuICAgICAgICAgICAgYnVtcFNjYWxlOiAwLjAxLFxuICAgICAgICAgICAgc3BlY3VsYXJNYXA6IFRIUkVFLkltYWdlVXRpbHMubG9hZFRleHR1cmUoJy4uL2ltYWdlcy9lYXJ0aHNwZWMxay5qcGcnKSxcbiAgICAgICAgICAgIHNwZWN1bGFyOiBuZXcgVEhSRUUuQ29sb3IoJ2dyYXknKS5nZXRIZXgoKSxcbiAgICAgICAgICAgIHNoaW5pbmVzczogMTBcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBlYXJ0aE1lc2ggPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICAgICAgICB0aGlzLmVhcnRoU3VuT2JqLmFkZChlYXJ0aE1lc2gpO1xuICAgICAgICB2YXIgY29udGFpbmVyRWFydGggPSBuZXcgVEhSRUUuT2JqZWN0M0QoKTtcbiAgICAgICAgLy9MbmcsIGxhdCBjb3JyZWN0aW9uIGZvciB0ZXh0dXJlXG4gICAgICAgIC8vIGNvbnRhaW5lckVhcnRoLnJvdGF0ZVooMCAqIE1hdGguUEkvMTgwKTtcbiAgICAgICAgLy8gY29udGFpbmVyRWFydGgucm90YXRlWCgxMjAgKiBNYXRoLlBJLzE4MCk7XG4gICAgICAgIC8vIGNvbnRhaW5lckVhcnRoLnJvdGF0ZVkoLTkwICogTWF0aC5QSS8xODApO1xuICAgICAgICBjb250YWluZXJFYXJ0aC5wb3NpdGlvbi56ID0gMDtcbiAgICAgICAgY29udGFpbmVyRWFydGgucG9zaXRpb24ueSA9IDA7XG4gICAgICAgIGNvbnRhaW5lckVhcnRoLnBvc2l0aW9uLnggPSAwO1xuICAgICAgICAvLyBjb250YWluZXJFYXJ0aC5yb3RhdGVaKDAgKiBNYXRoLlBJLzE4MClcbiAgICAgICAgLy8gY29udGFpbmVyRWFydGgucm90YXRlWCgtNDUgKiBNYXRoLlBJLzE4MCk7XG4gICAgICAgIC8vIGNvbnRhaW5lckVhcnRoLnJvdGF0ZVkoMTEwICogTWF0aC5QSS8xODApO1xuICAgICAgICB0aGlzLmVhcnRoU3VuT2JqLmFkZChjb250YWluZXJFYXJ0aCk7XG4gICAgICAgIGVhcnRoTWVzaC5yZWNlaXZlU2hhZG93ID0gdHJ1ZTtcbiAgICAgICAgZWFydGhNZXNoLmNhc3RTaGFkb3cgPSB0cnVlO1xuICAgICAgICBjb250YWluZXJFYXJ0aC5hZGQoZWFydGhNZXNoKTtcbiAgICAgICAgLy9bVE9ET10gLSByZW5hbWVcbiAgICAgICAgdmFyIGdlb21ldHJ5QXRtb3NwaGVyZSA9IG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeSgxLCA2NCwgNjQpO1xuICAgICAgICB2YXIgbWF0ZXJpYWxBdG1vc3BoZXJlID0gdGhpcy5jcmVhdGVBdG1vc3BoZXJlTWF0ZXJpYWwoKTtcbiAgICAgICAgbWF0ZXJpYWxBdG1vc3BoZXJlLnVuaWZvcm1zLmdsb3dDb2xvci52YWx1ZS5zZXQoMHgwMGIzZmYpO1xuICAgICAgICBtYXRlcmlhbEF0bW9zcGhlcmUudW5pZm9ybXMuY29lZmljaWVudC52YWx1ZSA9IDAuODtcbiAgICAgICAgbWF0ZXJpYWxBdG1vc3BoZXJlLnVuaWZvcm1zLnBvd2VyLnZhbHVlID0gNC4wO1xuICAgICAgICB2YXIgbWVzaEF0bW9zcGhlcmUgPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeUF0bW9zcGhlcmUsIG1hdGVyaWFsQXRtb3NwaGVyZSk7XG4gICAgICAgIG1lc2hBdG1vc3BoZXJlLnNjYWxlLm11bHRpcGx5U2NhbGFyKDEuMDIpO1xuICAgICAgICBjb250YWluZXJFYXJ0aC5hZGQobWVzaEF0bW9zcGhlcmUpO1xuICAgICAgICAvL1tUT0RPXSAtIHJlbmFtZVxuICAgICAgICB2YXIgZ2VvbWV0cnlBdG1vc3BoZXJlT3V0ZXIgPSBuZXcgVEhSRUUuU3BoZXJlR2VvbWV0cnkoMSwgNjQsIDY0KTtcbiAgICAgICAgdmFyIG1hdGVyaWFsQXRtb3NwaGVyZU91dGVyID0gdGhpcy5jcmVhdGVBdG1vc3BoZXJlTWF0ZXJpYWwoKTtcbiAgICAgICAgbWF0ZXJpYWxBdG1vc3BoZXJlT3V0ZXIuc2lkZSA9IFRIUkVFLkJhY2tTaWRlO1xuICAgICAgICBtYXRlcmlhbEF0bW9zcGhlcmVPdXRlci51bmlmb3Jtcy5nbG93Q29sb3IudmFsdWUuc2V0KDB4MDBiM2ZmKTtcbiAgICAgICAgbWF0ZXJpYWxBdG1vc3BoZXJlT3V0ZXIudW5pZm9ybXMuY29lZmljaWVudC52YWx1ZSA9IDAuMTtcbiAgICAgICAgbWF0ZXJpYWxBdG1vc3BoZXJlT3V0ZXIudW5pZm9ybXMucG93ZXIudmFsdWUgPSAyLjA7XG4gICAgICAgIHZhciBtZXNoQXRtb3NwaGVyZU91dGVyID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnlBdG1vc3BoZXJlT3V0ZXIsIG1hdGVyaWFsQXRtb3NwaGVyZU91dGVyKTtcbiAgICAgICAgbWVzaEF0bW9zcGhlcmVPdXRlci5zY2FsZS5tdWx0aXBseVNjYWxhcigxLjE1KTtcbiAgICAgICAgY29udGFpbmVyRWFydGguYWRkKG1lc2hBdG1vc3BoZXJlT3V0ZXIpO1xuICAgICAgICB2YXIgZWFydGhDbG91ZCA9IHRoaXMuY3JlYXRlRWFydGhDbG91ZCgpO1xuICAgICAgICBlYXJ0aENsb3VkLnJlY2VpdmVTaGFkb3cgPSB0cnVlO1xuICAgICAgICBlYXJ0aENsb3VkLmNhc3RTaGFkb3cgPSB0cnVlO1xuICAgICAgICBjb250YWluZXJFYXJ0aC5hZGQoZWFydGhDbG91ZCk7XG4gICAgICAgIHRoaXMub25SZW5kZXIucHVzaChmdW5jdGlvbiAoZGVsdGEsIG5vdykge1xuICAgICAgICAgICAgZWFydGhDbG91ZC5yb3RhdGlvbi55IC09IDEgLyA2NCAqIGRlbHRhO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5vblJlbmRlci5wdXNoKGZ1bmN0aW9uIChkZWx0YSwgbm93KSB7XG4gICAgICAgICAgICBjb250YWluZXJFYXJ0aC5yb3RhdGlvbi55ICs9IDIgLyAzMiAqIGRlbHRhO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGNvbnRhaW5lckVhcnRoO1xuICAgIH07XG4gICAgUmVuZGVyZXIucHJvdG90eXBlLmNyZWF0ZUVhcnRoQ2xvdWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIGZyb20gaHR0cDovL3BsYW5ldHBpeGVsZW1wb3JpdW0uY29tXG4gICAgICAgIC8vIGNyZWF0ZSBkZXN0aW5hdGlvbiBjYW52YXNcbiAgICAgICAgdmFyIGNhbnZhc1Jlc3VsdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgICAgICBjYW52YXNSZXN1bHQud2lkdGggPSAxMDI0O1xuICAgICAgICBjYW52YXNSZXN1bHQuaGVpZ2h0ID0gNTEyO1xuICAgICAgICB2YXIgY29udGV4dFJlc3VsdCA9IGNhbnZhc1Jlc3VsdC5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgICAvLyBsb2FkIGVhcnRoY2xvdWRtYXBcbiAgICAgICAgdmFyIGltYWdlTWFwID0gbmV3IEltYWdlKCk7XG4gICAgICAgIGltYWdlTWFwLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIGNyZWF0ZSBkYXRhTWFwIEltYWdlRGF0YSBmb3IgZWFydGhjbG91ZG1hcFxuICAgICAgICAgICAgdmFyIGNhbnZhc01hcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgICAgICAgICAgY2FudmFzTWFwLndpZHRoID0gaW1hZ2VNYXAud2lkdGg7XG4gICAgICAgICAgICBjYW52YXNNYXAuaGVpZ2h0ID0gaW1hZ2VNYXAuaGVpZ2h0O1xuICAgICAgICAgICAgdmFyIGNvbnRleHRNYXAgPSBjYW52YXNNYXAuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgICAgICAgIGNvbnRleHRNYXAuZHJhd0ltYWdlKGltYWdlTWFwLCAwLCAwKTtcbiAgICAgICAgICAgIHZhciBkYXRhTWFwID0gY29udGV4dE1hcC5nZXRJbWFnZURhdGEoMCwgMCwgY2FudmFzTWFwLndpZHRoLCBjYW52YXNNYXAuaGVpZ2h0KTtcbiAgICAgICAgICAgIC8vIGxvYWQgZWFydGhjbG91ZG1hcHRyYW5zXG4gICAgICAgICAgICB2YXIgaW1hZ2VUcmFucyA9IG5ldyBJbWFnZSgpO1xuICAgICAgICAgICAgaW1hZ2VUcmFucy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgLy8gY3JlYXRlIGRhdGFUcmFucyBJbWFnZURhdGEgZm9yIGVhcnRoY2xvdWRtYXB0cmFuc1xuICAgICAgICAgICAgICAgIHZhciBjYW52YXNUcmFucyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgICAgICAgICAgICAgIGNhbnZhc1RyYW5zLndpZHRoID0gaW1hZ2VUcmFucy53aWR0aDtcbiAgICAgICAgICAgICAgICBjYW52YXNUcmFucy5oZWlnaHQgPSBpbWFnZVRyYW5zLmhlaWdodDtcbiAgICAgICAgICAgICAgICB2YXIgY29udGV4dFRyYW5zID0gY2FudmFzVHJhbnMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgICAgICAgICAgICBjb250ZXh0VHJhbnMuZHJhd0ltYWdlKGltYWdlVHJhbnMsIDAsIDApO1xuICAgICAgICAgICAgICAgIHZhciBkYXRhVHJhbnMgPSBjb250ZXh0VHJhbnMuZ2V0SW1hZ2VEYXRhKDAsIDAsIGNhbnZhc1RyYW5zLndpZHRoLCBjYW52YXNUcmFucy5oZWlnaHQpO1xuICAgICAgICAgICAgICAgIC8vIG1lcmdlIGRhdGFNYXAgKyBkYXRhVHJhbnMgaW50byBkYXRhUmVzdWx0XG4gICAgICAgICAgICAgICAgdmFyIGRhdGFSZXN1bHQgPSBjb250ZXh0TWFwLmNyZWF0ZUltYWdlRGF0YShjYW52YXNNYXAud2lkdGgsIGNhbnZhc01hcC5oZWlnaHQpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIHkgPSAwLCBvZmZzZXQgPSAwOyB5IDwgaW1hZ2VNYXAuaGVpZ2h0OyB5KyspIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBpbWFnZU1hcC53aWR0aDsgeCsrLCBvZmZzZXQgKz0gNCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVJlc3VsdC5kYXRhW29mZnNldCArIDBdID0gZGF0YU1hcC5kYXRhW29mZnNldCArIDBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVJlc3VsdC5kYXRhW29mZnNldCArIDFdID0gZGF0YU1hcC5kYXRhW29mZnNldCArIDFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVJlc3VsdC5kYXRhW29mZnNldCArIDJdID0gZGF0YU1hcC5kYXRhW29mZnNldCArIDJdO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVJlc3VsdC5kYXRhW29mZnNldCArIDNdID0gMjU1IC0gZGF0YVRyYW5zLmRhdGFbb2Zmc2V0ICsgMF07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gdXBkYXRlIHRleHR1cmUgd2l0aCByZXN1bHRcbiAgICAgICAgICAgICAgICBjb250ZXh0UmVzdWx0LnB1dEltYWdlRGF0YShkYXRhUmVzdWx0LCAwLCAwKTtcbiAgICAgICAgICAgICAgICBtYXRlcmlhbC5tYXAubmVlZHNVcGRhdGUgPSB0cnVlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpbWFnZVRyYW5zLnNyYyA9ICcuLi9pbWFnZXMvZWFydGhjbG91ZG1hcHRyYW5zLmpwZyc7XG4gICAgICAgIH0sIGZhbHNlKTtcbiAgICAgICAgaW1hZ2VNYXAuc3JjID0gJy4uL2ltYWdlcy9lYXJ0aGNsb3VkbWFwLmpwZyc7XG4gICAgICAgIHZhciBnZW9tZXRyeSA9IG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeSgxLjAyLCA2NCwgNjQpO1xuICAgICAgICB2YXIgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoe1xuICAgICAgICAgICAgbWFwOiBuZXcgVEhSRUUuVGV4dHVyZShjYW52YXNSZXN1bHQpLFxuICAgICAgICAgICAgc2lkZTogVEhSRUUuRG91YmxlU2lkZSxcbiAgICAgICAgICAgIHRyYW5zcGFyZW50OiB0cnVlLFxuICAgICAgICAgICAgb3BhY2l0eTogMC44XG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgbWVzaCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbCk7XG4gICAgICAgIHJldHVybiBtZXNoO1xuICAgIH07XG4gICAgUmVuZGVyZXIucHJvdG90eXBlLmNyZWF0ZUF0bW9zcGhlcmVNYXRlcmlhbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGZyb20gaHR0cDovL3N0ZW1rb3NraS5ibG9nc3BvdC5mci8yMDEzLzA3L3NoYWRlcnMtaW4tdGhyZWVqcy1nbG93LWFuZC1oYWxvLmh0bWxcbiAgICAgICAgICogQHJldHVybiB7W3R5cGVdfSBbZGVzY3JpcHRpb25dXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgdmVydGV4U2hhZGVyID0gW1xuICAgICAgICAgICAgJ3ZhcnlpbmcgdmVjMyB2Tm9ybWFsOycsXG4gICAgICAgICAgICAndm9pZCBtYWluKCl7JyxcbiAgICAgICAgICAgICdcdC8vIGNvbXB1dGUgaW50ZW5zaXR5JyxcbiAgICAgICAgICAgICdcdHZOb3JtYWxcdFx0PSBub3JtYWxpemUoIG5vcm1hbE1hdHJpeCAqIG5vcm1hbCApOycsXG4gICAgICAgICAgICAnXHQvLyBzZXQgZ2xfUG9zaXRpb24nLFxuICAgICAgICAgICAgJ1x0Z2xfUG9zaXRpb25cdD0gcHJvamVjdGlvbk1hdHJpeCAqIG1vZGVsVmlld01hdHJpeCAqIHZlYzQoIHBvc2l0aW9uLCAxLjAgKTsnLFxuICAgICAgICAgICAgJ30nLFxuICAgICAgICBdLmpvaW4oJ1xcbicpO1xuICAgICAgICB2YXIgZnJhZ21lbnRTaGFkZXIgPSBbXG4gICAgICAgICAgICAndW5pZm9ybSBmbG9hdCBjb2VmaWNpZW50OycsXG4gICAgICAgICAgICAndW5pZm9ybSBmbG9hdCBwb3dlcjsnLFxuICAgICAgICAgICAgJ3VuaWZvcm0gdmVjMyAgZ2xvd0NvbG9yOycsXG4gICAgICAgICAgICAndmFyeWluZyB2ZWMzICB2Tm9ybWFsOycsXG4gICAgICAgICAgICAndm9pZCBtYWluKCl7JyxcbiAgICAgICAgICAgICdcdGZsb2F0IGludGVuc2l0eVx0PSBwb3coIGNvZWZpY2llbnQgLSBkb3Qodk5vcm1hbCwgdmVjMygwLjAsIDAuMCwgMS4wKSksIHBvd2VyICk7JyxcbiAgICAgICAgICAgICdcdGdsX0ZyYWdDb2xvclx0PSB2ZWM0KCBnbG93Q29sb3IgKiBpbnRlbnNpdHksIDEuMCApOycsXG4gICAgICAgICAgICAnfScsXG4gICAgICAgIF0uam9pbignXFxuJyk7XG4gICAgICAgIC8vIGNyZWF0ZSBjdXN0b20gbWF0ZXJpYWwgZnJvbSB0aGUgc2hhZGVyIGNvZGUgYWJvdmVcbiAgICAgICAgLy8gICB0aGF0IGlzIHdpdGhpbiBzcGVjaWFsbHkgbGFiZWxlZCBzY3JpcHQgdGFnc1xuICAgICAgICB2YXIgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuU2hhZGVyTWF0ZXJpYWwoe1xuICAgICAgICAgICAgdW5pZm9ybXM6IHtcbiAgICAgICAgICAgICAgICBjb2VmaWNpZW50OiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiZlwiLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogMS4wXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBwb3dlcjoge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImZcIixcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IDJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGdsb3dDb2xvcjoge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImNcIixcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IG5ldyBUSFJFRS5Db2xvcigncGluaycpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHZlcnRleFNoYWRlcjogdmVydGV4U2hhZGVyLFxuICAgICAgICAgICAgZnJhZ21lbnRTaGFkZXI6IGZyYWdtZW50U2hhZGVyLFxuICAgICAgICAgICAgc2lkZTogVEhSRUUuRnJvbnRTaWRlLFxuICAgICAgICAgICAgYmxlbmRpbmc6IFRIUkVFLkFkZGl0aXZlQmxlbmRpbmcsXG4gICAgICAgICAgICB0cmFuc3BhcmVudDogdHJ1ZSxcbiAgICAgICAgICAgIGRlcHRoV3JpdGU6IGZhbHNlXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gbWF0ZXJpYWw7XG4gICAgfTtcbiAgICAvL1tUT0RPXSAtIFByb3ZpZGUgYSBzdHJpY3QgZGF0YXR5cGUgZm9yIHBhcmFtZXRlclxuICAgIFJlbmRlcmVyLnByb3RvdHlwZS5kcmF3U29sdXRpb24gPSBmdW5jdGlvbiAoc29sdXRpb24pIHtcbiAgICAgICAgdmFyIHJlYWxTY2FsZSA9IDEgLyA2MzcxO1xuICAgICAgICAvL1JlbW92ZSBwcmV2aW91cyBzb2x1dGlvblxuICAgICAgICB0aGlzLmVhcnRoLnJlbW92ZSh0aGlzLnN0YXJ0UG9pbnQpO1xuICAgICAgICB0aGlzLmVhcnRoLnJlbW92ZSh0aGlzLmVuZFBvaW50KTtcbiAgICAgICAgdGhpcy5lYXJ0aC5yZW1vdmUodGhpcy5wYXRoTGluZSk7XG4gICAgICAgIHRoaXMuc2F0ZWxpdGVMYWJsZXMuZm9yRWFjaCh0aGlzLmVhcnRoLnJlbW92ZSwgdGhpcy5lYXJ0aCk7XG4gICAgICAgIHRoaXMuc2F0ZWxpdGVQb2ludHMuZm9yRWFjaCh0aGlzLmVhcnRoLnJlbW92ZSwgdGhpcy5lYXJ0aCk7XG4gICAgICAgIC8vU3RhcnQgYW5kIGVuZFxuICAgICAgICB0aGlzLnN0YXJ0UG9pbnQgPSBuZXcgVEhSRUUuTWVzaChuZXcgVEhSRUUuU3BoZXJlR2VvbWV0cnkoMSAvIDUwLCAzMiwgMzIpLCBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoeyBjb2xvcjogMHgwMGZmMDAgfSkpO1xuICAgICAgICB0aGlzLnN0YXJ0UG9pbnQucG9zaXRpb24ueCA9IHNvbHV0aW9uLnN0YXJ0LnBvc2l0aW9uLnZhbHVlWzBdICogcmVhbFNjYWxlO1xuICAgICAgICB0aGlzLnN0YXJ0UG9pbnQucG9zaXRpb24ueSA9IHNvbHV0aW9uLnN0YXJ0LnBvc2l0aW9uLnZhbHVlWzFdICogcmVhbFNjYWxlO1xuICAgICAgICB0aGlzLnN0YXJ0UG9pbnQucG9zaXRpb24ueiA9IHNvbHV0aW9uLnN0YXJ0LnBvc2l0aW9uLnZhbHVlWzJdICogcmVhbFNjYWxlO1xuICAgICAgICB0aGlzLmVhcnRoLmFkZCh0aGlzLnN0YXJ0UG9pbnQpO1xuICAgICAgICBzb2x1dGlvbi5zdGFydC5hdmFpbGlhYmxlUm91dGluZ1BvaW50cy5mb3JFYWNoKGZ1bmN0aW9uIChycCkge1xuICAgICAgICAgICAgdmFyIG1hdGVyaWFsID0gbmV3IFRIUkVFLkxpbmVCYXNpY01hdGVyaWFsKHtcbiAgICAgICAgICAgICAgICBjb2xvcjogMHhmZjAwZmYsXG4gICAgICAgICAgICAgICAgbGluZXdpZHRoOiA0LFxuICAgICAgICAgICAgICAgIGxpbmVjYXA6ICdzcXVhcmUnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHZhciBnZW9tZXRyeSA9IG5ldyBUSFJFRS5HZW9tZXRyeSgpO1xuICAgICAgICAgICAgZ2VvbWV0cnkudmVydGljZXMucHVzaChuZXcgVEhSRUUuVmVjdG9yMyhzb2x1dGlvbi5zdGFydC5wb3NpdGlvbi52YWx1ZVswXSAqIHJlYWxTY2FsZSwgc29sdXRpb24uc3RhcnQucG9zaXRpb24udmFsdWVbMV0gKiByZWFsU2NhbGUsIHNvbHV0aW9uLnN0YXJ0LnBvc2l0aW9uLnZhbHVlWzJdICogcmVhbFNjYWxlKSk7XG4gICAgICAgICAgICBnZW9tZXRyeS52ZXJ0aWNlcy5wdXNoKG5ldyBUSFJFRS5WZWN0b3IzKHJwLnBvc2l0aW9uLnZhbHVlWzBdICogcmVhbFNjYWxlLCBycC5wb3NpdGlvbi52YWx1ZVsxXSAqIHJlYWxTY2FsZSwgcnAucG9zaXRpb24udmFsdWVbMl0gKiByZWFsU2NhbGUpKTtcbiAgICAgICAgICAgIC8vW1RPRE9dIC0gQ3JlYXRlIG93biBwcm9wZXJ0eSBmb3Igc2F0ZWxpdGUgcGF0aFxuICAgICAgICAgICAgdGhpcy5wYXRoTGluZSA9IG5ldyBUSFJFRS5MaW5lKGdlb21ldHJ5LCBtYXRlcmlhbCk7XG4gICAgICAgICAgICB0aGlzLmVhcnRoLmFkZCh0aGlzLnBhdGhMaW5lKTtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIHRoaXMuZW5kUG9pbnQgPSBuZXcgVEhSRUUuTWVzaChuZXcgVEhSRUUuU3BoZXJlR2VvbWV0cnkoMSAvIDUwLCAzMiwgMzIpLCBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoeyBjb2xvcjogMHhmZjAwMDAgfSkpO1xuICAgICAgICB0aGlzLmVuZFBvaW50LnBvc2l0aW9uLnggPSBzb2x1dGlvbi5lbmQucG9zaXRpb24udmFsdWVbMF0gKiByZWFsU2NhbGU7XG4gICAgICAgIHRoaXMuZW5kUG9pbnQucG9zaXRpb24ueSA9IHNvbHV0aW9uLmVuZC5wb3NpdGlvbi52YWx1ZVsxXSAqIHJlYWxTY2FsZTtcbiAgICAgICAgdGhpcy5lbmRQb2ludC5wb3NpdGlvbi56ID0gc29sdXRpb24uZW5kLnBvc2l0aW9uLnZhbHVlWzJdICogcmVhbFNjYWxlO1xuICAgICAgICB0aGlzLmVhcnRoLmFkZCh0aGlzLmVuZFBvaW50KTtcbiAgICAgICAgc29sdXRpb24uZW5kLmF2YWlsaWFibGVSb3V0aW5nUG9pbnRzLmZvckVhY2goZnVuY3Rpb24gKHJwKSB7XG4gICAgICAgICAgICB2YXIgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTGluZUJhc2ljTWF0ZXJpYWwoe1xuICAgICAgICAgICAgICAgIGNvbG9yOiAweGZmMDBmZixcbiAgICAgICAgICAgICAgICBsaW5ld2lkdGg6IDQsXG4gICAgICAgICAgICAgICAgbGluZWNhcDogJ3NxdWFyZSdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdmFyIGdlb21ldHJ5ID0gbmV3IFRIUkVFLkdlb21ldHJ5KCk7XG4gICAgICAgICAgICBnZW9tZXRyeS52ZXJ0aWNlcy5wdXNoKG5ldyBUSFJFRS5WZWN0b3IzKHNvbHV0aW9uLmVuZC5wb3NpdGlvbi52YWx1ZVswXSAqIHJlYWxTY2FsZSwgc29sdXRpb24uZW5kLnBvc2l0aW9uLnZhbHVlWzFdICogcmVhbFNjYWxlLCBzb2x1dGlvbi5lbmQucG9zaXRpb24udmFsdWVbMl0gKiByZWFsU2NhbGUpKTtcbiAgICAgICAgICAgIGdlb21ldHJ5LnZlcnRpY2VzLnB1c2gobmV3IFRIUkVFLlZlY3RvcjMocnAucG9zaXRpb24udmFsdWVbMF0gKiByZWFsU2NhbGUsIHJwLnBvc2l0aW9uLnZhbHVlWzFdICogcmVhbFNjYWxlLCBycC5wb3NpdGlvbi52YWx1ZVsyXSAqIHJlYWxTY2FsZSkpO1xuICAgICAgICAgICAgLy9bVE9ET10gLSBDcmVhdGUgb3duIHByb3BlcnR5IGZvciBzYXRlbGl0ZSBwYXRoXG4gICAgICAgICAgICB0aGlzLnBhdGhMaW5lID0gbmV3IFRIUkVFLkxpbmUoZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgICAgICAgICAgIHRoaXMuZWFydGguYWRkKHRoaXMucGF0aExpbmUpO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgdmFyIHNhdGVsaXRlcyA9IHNvbHV0aW9uLnJvdXRlaW5nUG9pbnRzLnNsaWNlKDEsIC0xKTtcbiAgICAgICAgc2F0ZWxpdGVzLmZvckVhY2goZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgICAgIHZhciBzYXRlbGl0ZU9yYiA9IG5ldyBUSFJFRS5NZXNoKG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeSgxIC8gMTAwLCAzMiwgMzIpLCBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoeyBjb2xvcjogMHgwMDAwZmYgfSkpO1xuICAgICAgICAgICAgc2F0ZWxpdGVPcmIucG9zaXRpb24ueCA9IHMucG9zaXRpb24udmFsdWVbMF0gKiByZWFsU2NhbGU7XG4gICAgICAgICAgICBzYXRlbGl0ZU9yYi5wb3NpdGlvbi55ID0gcy5wb3NpdGlvbi52YWx1ZVsxXSAqIHJlYWxTY2FsZTtcbiAgICAgICAgICAgIHNhdGVsaXRlT3JiLnBvc2l0aW9uLnogPSBzLnBvc2l0aW9uLnZhbHVlWzJdICogcmVhbFNjYWxlO1xuICAgICAgICAgICAgdGhpcy5lYXJ0aC5hZGQoc2F0ZWxpdGVPcmIpO1xuICAgICAgICAgICAgcy5hdmFpbGlhYmxlUm91dGluZ1BvaW50cy5mb3JFYWNoKGZ1bmN0aW9uIChycCkge1xuICAgICAgICAgICAgICAgIHZhciBtYXRlcmlhbCA9IG5ldyBUSFJFRS5MaW5lQmFzaWNNYXRlcmlhbCh7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAweGZmMDBmZixcbiAgICAgICAgICAgICAgICAgICAgbGluZXdpZHRoOiA0LFxuICAgICAgICAgICAgICAgICAgICBsaW5lY2FwOiAnc3F1YXJlJ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHZhciBnZW9tZXRyeSA9IG5ldyBUSFJFRS5HZW9tZXRyeSgpO1xuICAgICAgICAgICAgICAgIGdlb21ldHJ5LnZlcnRpY2VzLnB1c2gobmV3IFRIUkVFLlZlY3RvcjMocy5wb3NpdGlvbi52YWx1ZVswXSAqIHJlYWxTY2FsZSwgcy5wb3NpdGlvbi52YWx1ZVsxXSAqIHJlYWxTY2FsZSwgcy5wb3NpdGlvbi52YWx1ZVsyXSAqIHJlYWxTY2FsZSkpO1xuICAgICAgICAgICAgICAgIGdlb21ldHJ5LnZlcnRpY2VzLnB1c2gobmV3IFRIUkVFLlZlY3RvcjMocnAucG9zaXRpb24udmFsdWVbMF0gKiByZWFsU2NhbGUsIHJwLnBvc2l0aW9uLnZhbHVlWzFdICogcmVhbFNjYWxlLCBycC5wb3NpdGlvbi52YWx1ZVsyXSAqIHJlYWxTY2FsZSkpO1xuICAgICAgICAgICAgICAgIC8vW1RPRE9dIC0gbmVlZCBtb3ZlIHRvIGFycmF5IG9uIGNsYXNzLlxuICAgICAgICAgICAgICAgIHRoaXMucGF0aExpbmUgPSBuZXcgVEhSRUUuTGluZShnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICAgICAgICAgICAgICAgIHRoaXMuZWFydGguYWRkKHRoaXMucGF0aExpbmUpO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgICAgICAvLyB2YXIgdGV4dEdlbyA9IG1ha2VUZXh0U3ByaXRlKFwidGVzdFwiLCB7XG4gICAgICAgICAgICAvLyAgICAgZm9udHNpemU6IDI0LFxuICAgICAgICAgICAgLy8gICAgIGJvcmRlckNvbG9yOiB7cjogMjU1LCBnOjAsIGI6MjU1LCBhOjEuMH0sXG4gICAgICAgICAgICAvLyAgICAgYmFja2dyb3VuZENvbG9yOiB7cjoyNTUsIGc6MjU1LCBiOjI1NSwgYTowLjh9XG4gICAgICAgICAgICAvLyB9KTtcbiAgICAgICAgICAgIC8vIHRleHRHZW8ucG9zaXRpb24uc2V0KFxuICAgICAgICAgICAgLy8gICAgIHMucG9zaXRpb24udmFsdWVbMF0gKiByZWFsU2NhbGUsXG4gICAgICAgICAgICAvLyAgICAgcy5wb3NpdGlvbi52YWx1ZVsxXSAqIHJlYWxTY2FsZSArIDAuMSxcbiAgICAgICAgICAgIC8vICAgICBzLnBvc2l0aW9uLnZhbHVlWzJdICogcmVhbFNjYWxlXG4gICAgICAgICAgICAvLyApO1xuICAgICAgICAgICAgLy8gdGhpcy5zY2VuZS5hZGQoIHRleHRHZW8gKTtcbiAgICAgICAgICAgIC8vIHRoaXMuc2F0ZWxpdGVMYWJsZXMucHVzaCh0ZXh0R2VvKTtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIC8vU29sdXRpb24gUGF0aFxuICAgICAgICB2YXIgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTGluZUJhc2ljTWF0ZXJpYWwoe1xuICAgICAgICAgICAgY29sb3I6IDB4ZmZmZmZmLFxuICAgICAgICAgICAgbGluZXdpZHRoOiAyMCxcbiAgICAgICAgICAgIGxpbmVjYXA6ICdzcXVhcmUnXG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuR2VvbWV0cnkoKTtcbiAgICAgICAgc29sdXRpb24uYW5zd2VyLnBhdGhQb3MuZm9yRWFjaChmdW5jdGlvbiAocCwgaSkge1xuICAgICAgICAgICAgZ2VvbWV0cnkudmVydGljZXMucHVzaChuZXcgVEhSRUUuVmVjdG9yMyhwLnZhbHVlWzBdICogcmVhbFNjYWxlLCBwLnZhbHVlWzFdICogcmVhbFNjYWxlLCBwLnZhbHVlWzJdICogcmVhbFNjYWxlKSk7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgICB0aGlzLnBhdGhMaW5lID0gbmV3IFRIUkVFLkxpbmUoZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgICAgICAgdGhpcy5lYXJ0aC5hZGQodGhpcy5wYXRoTGluZSk7XG4gICAgfTtcbiAgICByZXR1cm4gUmVuZGVyZXI7XG59KCkpO1xuZXhwb3J0cy5SZW5kZXJlciA9IFJlbmRlcmVyO1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcInBCR3ZBcFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL1JlbmRlcmVyLmpzXCIsXCIvXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuXCJ1c2Ugc3RyaWN0XCI7XG52YXIgUm91dGVpbmdQb2ludCA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gUm91dGVpbmdQb2ludChuYW1lLCBwb2xhckNvb3JkKSB7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBwb2xhckNvb3JkLmNvbnZlcnQoKTtcbiAgICB9XG4gICAgcmV0dXJuIFJvdXRlaW5nUG9pbnQ7XG59KCkpO1xuZXhwb3J0cy5Sb3V0ZWluZ1BvaW50ID0gUm91dGVpbmdQb2ludDtcbnZhciBSb3VudGluZ1BvaW50UGFpcnMgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFJvdW50aW5nUG9pbnRQYWlycyhzb3VyY2UsIHRhcmdldCkge1xuICAgICAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICAgICAgdGhpcy50YXJnZXQgPSB0YXJnZXQ7XG4gICAgICAgIHRoaXMuZGlzdGFuY2UgPSB0aGlzLnNvdXJjZS5wb3NpdGlvbi5kaXN0YW5jZSh0aGlzLnRhcmdldC5wb3NpdGlvbik7XG4gICAgfVxuICAgIHJldHVybiBSb3VudGluZ1BvaW50UGFpcnM7XG59KCkpO1xuZXhwb3J0cy5Sb3VudGluZ1BvaW50UGFpcnMgPSBSb3VudGluZ1BvaW50UGFpcnM7XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwicEJHdkFwXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvUm91dGVpbmdQb2ludC5qc1wiLFwiL1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcblwidXNlIHN0cmljdFwiO1xudmFyIE1hdGhfMSA9IHJlcXVpcmUoJy4vTWF0aCcpO1xudmFyIFJvdXRlaW5nUG9pbnRfMSA9IHJlcXVpcmUoJy4vUm91dGVpbmdQb2ludCcpO1xudmFyIF8zZFN0dWZmXzEgPSByZXF1aXJlKCcuLzNkU3R1ZmYnKTtcbnZhciBSb3V0ZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFJvdXRlcihyb3V0ZXMpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5lYXJ0aCA9IG5ldyBfM2RTdHVmZl8xLlNwaGVyZShuZXcgTWF0aF8xLlZlYzMoWzAsIDAsIDBdKSwgNjM3MSk7XG4gICAgICAgIHRoaXMucm91dGVzID0gcm91dGVzXG4gICAgICAgICAgICAubWFwKGZ1bmN0aW9uIChzKSB7XG4gICAgICAgICAgICBzLmF2YWlsaWFibGVSb3V0aW5nUG9pbnRzID0gcy5hdmFpbGlhYmxlUm91dGluZ1BvaW50cyB8fCBbXTtcbiAgICAgICAgICAgIGlmIChbJ3N0YXJ0JywgJ2VuZCddLmluZGV4T2Yocy5uYW1lKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICBzLmF2YWlsaWFibGVSb3V0aW5nUG9pbnRzID0gcm91dGVzXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24gKHEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHEgIT09IHMgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIFsnc3RhcnQnLCAnZW5kJ10uaW5kZXhPZihxLm5hbWUpID09PSAtMSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuZWFydGguaW50ZXJzZWN0KG5ldyBfM2RTdHVmZl8xLkxpbmUocy5wb3NpdGlvbiwgcS5wb3NpdGlvbi5zdWIocy5wb3NpdGlvbikpKS5sZW5ndGggPT09IDA7IC8vSXMgbm90IHNlbGYgYW5kIGRvZXMgbm90IGludGVyc2VjdCBlYXJ0aCBcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAubWFwKGZ1bmN0aW9uICh4KSB7IHJldHVybiBuZXcgUm91dGVpbmdQb2ludF8xLlJvdW50aW5nUG9pbnRQYWlycyhzLCB4KTsgfSlcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbiAoeCkgeyByZXR1cm4gcy5hdmFpbGlhYmxlUm91dGluZ1BvaW50cy5pbmRleE9mKHgpID09PSAtMTsgfSlcbiAgICAgICAgICAgICAgICAgICAgLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHsgcmV0dXJuIGEuZGlzdGFuY2UgLSBiLmRpc3RhbmNlOyB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vU3RhcnQgYW5kIGVuZCBwb2ludHMgd2lsbCBpbnRlcnNlY3QgYmVsb3cgKGJlaGluZD8pIHRoZSBwb2ludFxuICAgICAgICAgICAgICAgIC8vIFdlIG11c3QgY2hlY2sgdGhlIHN1cmZhY2Ugbm9ybWFsIHRoZSBkaXJlY3Rpb24gaWYgaXQgaXMgaW5mcm9udCBvZiB0aGUgcG9pbnRcbiAgICAgICAgICAgICAgICB2YXIgc3VyZmFjZU5vcm1hbCA9IF90aGlzLmVhcnRoLm5vcm1hbChzLnBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICBzLmF2YWlsaWFibGVSb3V0aW5nUG9pbnRzID0gcy5hdmFpbGlhYmxlUm91dGluZ1BvaW50cy5jb25jYXQocm91dGVzXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24gKHEpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRvdCA9IHEucG9zaXRpb24uc3ViKHMucG9zaXRpb24pLm5vcm0oKS5kb3Qoc3VyZmFjZU5vcm1hbCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBxICE9PSBzICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBkb3QgPiAwO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKHgpIHsgcmV0dXJuIG5ldyBSb3V0ZWluZ1BvaW50XzEuUm91bnRpbmdQb2ludFBhaXJzKHMsIHgpOyB9KVxuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uICh4KSB7IHJldHVybiBzLmF2YWlsaWFibGVSb3V0aW5nUG9pbnRzLmluZGV4T2YoeCkgPT09IC0xOyB9KVxuICAgICAgICAgICAgICAgICAgICAuc29ydChmdW5jdGlvbiAoYSwgYikgeyByZXR1cm4gYS5kaXN0YW5jZSAtIGIuZGlzdGFuY2U7IH0pKTtcbiAgICAgICAgICAgICAgICAvL1dlIHdhbnQgc3ltZXRyaWMgcmVsYXRpb25zXG4gICAgICAgICAgICAgICAgcy5hdmFpbGlhYmxlUm91dGluZ1BvaW50cy5mb3JFYWNoKGZ1bmN0aW9uIChxKSB7XG4gICAgICAgICAgICAgICAgICAgIHEudGFyZ2V0LmF2YWlsaWFibGVSb3V0aW5nUG9pbnRzID0gcS50YXJnZXQuYXZhaWxpYWJsZVJvdXRpbmdQb2ludHMgfHwgW107XG4gICAgICAgICAgICAgICAgICAgIGlmIChxLnRhcmdldC5hdmFpbGlhYmxlUm91dGluZ1BvaW50cy5ldmVyeShmdW5jdGlvbiAocikgeyByZXR1cm4gci50YXJnZXQgIT09IHEuc291cmNlOyB9KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcS50YXJnZXQuYXZhaWxpYWJsZVJvdXRpbmdQb2ludHMucHVzaChuZXcgUm91dGVpbmdQb2ludF8xLlJvdW50aW5nUG9pbnRQYWlycyhxLnRhcmdldCwgcS5zb3VyY2UpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHM7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBSb3V0ZXIucHJvdG90eXBlLnJvdXRlID0gZnVuY3Rpb24gKHN0YXJ0LCBlbmQpIHtcbiAgICAgICAgdmFyIGxlbiA9IHRoaXMucm91dGVzLmxlbmd0aDtcbiAgICAgICAgdmFyIHBhdGggPSBbXTtcbiAgICAgICAgdmFyIHBhdGhQb3MgPSBbXTtcbiAgICAgICAgdmFyIGRpc3RhbmNlID0gMDtcbiAgICAgICAgdmFyIHJlY3Vyc2l2ZURlY2VudCA9IGZ1bmN0aW9uIChub2RlLCBmaW5pc2gsIGFuc3dlciwgdmlzaXRlZCkge1xuICAgICAgICAgICAgaWYgKHZpc2l0ZWQgPT09IHZvaWQgMCkgeyB2aXNpdGVkID0gW107IH1cbiAgICAgICAgICAgIHZhciBhdmFpbGlhYmxlUm91dGluZ1BvaW50cyA9IG5vZGUuYXZhaWxpYWJsZVJvdXRpbmdQb2ludHMuZmlsdGVyKGZ1bmN0aW9uICh4KSB7IHJldHVybiB2aXNpdGVkLmluZGV4T2YoeCkgPT09IC0xOyB9KTtcbiAgICAgICAgICAgIGlmIChhdmFpbGlhYmxlUm91dGluZ1BvaW50cy5sZW5ndGggPT09IDAgfHwgdmlzaXRlZC5sZW5ndGggPiBsZW4pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBkaXN0YW5jZTogSW5maW5pdHksXG4gICAgICAgICAgICAgICAgICAgIHBhdGg6IFsnTk9fU09MVVRJT04nXSxcbiAgICAgICAgICAgICAgICAgICAgcGF0aFBvczogW11cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoYXZhaWxpYWJsZVJvdXRpbmdQb2ludHMubWFwKGZ1bmN0aW9uICh4KSB7IHJldHVybiB4LnRhcmdldDsgfSkuaW5kZXhPZihmaW5pc2gpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAvL1dlIGFyZSBkb25lIGZvciB0aGlzIHBhdGguXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgZGlzdGFuY2U6IGFuc3dlci5kaXN0YW5jZSxcbiAgICAgICAgICAgICAgICAgICAgcGF0aDogYW5zd2VyLnBhdGguY29uY2F0KFtub2RlLm5hbWUsIGZpbmlzaC5uYW1lXSksXG4gICAgICAgICAgICAgICAgICAgIHBhdGhQb3M6IGFuc3dlci5wYXRoUG9zLmNvbmNhdChbbm9kZS5wb3NpdGlvbiwgZmluaXNoLnBvc2l0aW9uXSlcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhdGhzID0gYXZhaWxpYWJsZVJvdXRpbmdQb2ludHNcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbiAobikgeyByZXR1cm4gYW5zd2VyLnBhdGguaW5kZXhPZihuLnNvdXJjZS5uYW1lKSA9PT0gLTE7IH0pXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKG4pIHsgcmV0dXJuIHJlY3Vyc2l2ZURlY2VudChuLnRhcmdldCwgZmluaXNoLCB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3RhbmNlOiBhbnN3ZXIuZGlzdGFuY2UgKyBuLmRpc3RhbmNlLFxuICAgICAgICAgICAgICAgICAgICBwYXRoOiBhbnN3ZXIucGF0aC5jb25jYXQoW24uc291cmNlLm5hbWVdKSxcbiAgICAgICAgICAgICAgICAgICAgcGF0aFBvczogYW5zd2VyLnBhdGhQb3MuY29uY2F0KFtuLnNvdXJjZS5wb3NpdGlvbl0pXG4gICAgICAgICAgICAgICAgfSwgdmlzaXRlZC5jb25jYXQoW25dKSk7IH0pXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24gKG4pIHsgcmV0dXJuIG4gJiYgbi5kaXN0YW5jZSAhPT0gSW5maW5pdHk7IH0pO1xuICAgICAgICAgICAgICAgIHZhciBiZXN0ID0gcGF0aHMuc29ydChmdW5jdGlvbiAoYSwgYikgeyByZXR1cm4gYS5kaXN0YW5jZSAtIGIuZGlzdGFuY2U7IH0pWzBdO1xuICAgICAgICAgICAgICAgIHJldHVybiBiZXN0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB2YXIgYW5zd2VyID0ge1xuICAgICAgICAgICAgcGF0aDogcGF0aCxcbiAgICAgICAgICAgIHBhdGhQb3M6IHBhdGhQb3MsXG4gICAgICAgICAgICBkaXN0YW5jZTogZGlzdGFuY2VcbiAgICAgICAgfTtcbiAgICAgICAgYW5zd2VyID0gcmVjdXJzaXZlRGVjZW50KHN0YXJ0LCBlbmQsIGFuc3dlciwgW10pIHx8IHtcbiAgICAgICAgICAgIHBhdGg6IHBhdGgsXG4gICAgICAgICAgICBwYXRoUG9zOiBwYXRoUG9zLFxuICAgICAgICAgICAgZGlzdGFuY2U6IGRpc3RhbmNlXG4gICAgICAgIH07XG4gICAgICAgIGNvbnNvbGUubG9nKCdhbnN3ZXI6JywgYW5zd2VyKTtcbiAgICAgICAgcmV0dXJuIGFuc3dlcjtcbiAgICB9O1xuICAgIFJvdXRlci5wcm90b3R5cGUubWluaW11bSA9IGZ1bmN0aW9uIChhcnIpIHtcbiAgICAgICAgdmFyIG1pbkluZGV4ID0gMCwgbWluVmFsdWUgPSBhcnJbMF07XG4gICAgICAgIGFyci5mb3JFYWNoKGZ1bmN0aW9uICh4LCBpKSB7XG4gICAgICAgICAgICBpZiAoYXJyW2ldIDwgbWluVmFsdWUpIHtcbiAgICAgICAgICAgICAgICBtaW5JbmRleCA9IGk7XG4gICAgICAgICAgICAgICAgbWluVmFsdWUgPSBhcnJbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaW5kZXg6IG1pbkluZGV4LFxuICAgICAgICAgICAgdmFsdWU6IG1pblZhbHVlXG4gICAgICAgIH07XG4gICAgfTtcbiAgICByZXR1cm4gUm91dGVyO1xufSgpKTtcbmV4cG9ydHMuUm91dGVyID0gUm91dGVyO1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcInBCR3ZBcFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL1JvdXRlci5qc1wiLFwiL1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcblwidXNlIHN0cmljdFwiO1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxudmFyIFBhcnNlcl8xID0gcmVxdWlyZSgnLi9QYXJzZXInKTtcbnZhciBSZW5kZXJlcl8xID0gcmVxdWlyZSgnLi9SZW5kZXJlcicpO1xuLy9bVE9ET10gLSBJbmxpbmUgYW5kIHVucm9sZSBvcHRpbWl6ZSBmb3IgM2QgY2FzZS5cbnZhciByZW5kZXJlciA9IG5ldyBSZW5kZXJlcl8xLlJlbmRlcmVyKCk7XG53aW5kb3cuZmV0Y2goJ2h0dHBzOi8vc3BhY2UtZmFzdC10cmFjay5oZXJva3VhcHAuY29tL2dlbmVyYXRlJylcbiAgICAudGhlbihmdW5jdGlvbiAoeCkgeyByZXR1cm4geC50ZXh0KCk7IH0pXG4gICAgLnRoZW4oZnVuY3Rpb24gKHgpIHsgcmV0dXJuIFBhcnNlcl8xLnBhcnNlKHgpOyB9KVxuICAgIC50aGVuKGZ1bmN0aW9uICh4KSB7XG4gICAgdmFyIHBhdGhFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYXRoJyk7XG4gICAgdmFyIGRpc3RhbmNlRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGlzdGFuY2UnKTtcbiAgICB2YXIgc2VlZEVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlZWQnKTtcbiAgICBzZWVkRWwuaW5uZXJUZXh0ID0geC5zZWVkO1xuICAgIGlmICh4LmFuc3dlci5wYXRoLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZGlzdGFuY2VFbC5pbm5lclRleHQgPSB4LmFuc3dlci5kaXN0YW5jZS50b0ZpeGVkKDEpICsgXCJLbVwiO1xuICAgICAgICBwYXRoRWwuaW5uZXJUZXh0ID0geC5hbnN3ZXIucGF0aC5qb2luKCcsJyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBkaXN0YW5jZUVsLmlubmVyVGV4dCA9IFwiTm8gc29sdXRpb24gZm91bmQuXCI7XG4gICAgICAgIHBhdGhFbC5pbm5lclRleHQgPSAnJztcbiAgICB9XG4gICAgcmVuZGVyZXIuZHJhd1NvbHV0aW9uKHgpO1xufSk7XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwicEJHdkFwXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvZmFrZV82Nzk5NTViYS5qc1wiLFwiL1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbnZhciBsb29rdXAgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLyc7XG5cbjsoZnVuY3Rpb24gKGV4cG9ydHMpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG4gIHZhciBBcnIgPSAodHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnKVxuICAgID8gVWludDhBcnJheVxuICAgIDogQXJyYXlcblxuXHR2YXIgUExVUyAgID0gJysnLmNoYXJDb2RlQXQoMClcblx0dmFyIFNMQVNIICA9ICcvJy5jaGFyQ29kZUF0KDApXG5cdHZhciBOVU1CRVIgPSAnMCcuY2hhckNvZGVBdCgwKVxuXHR2YXIgTE9XRVIgID0gJ2EnLmNoYXJDb2RlQXQoMClcblx0dmFyIFVQUEVSICA9ICdBJy5jaGFyQ29kZUF0KDApXG5cdHZhciBQTFVTX1VSTF9TQUZFID0gJy0nLmNoYXJDb2RlQXQoMClcblx0dmFyIFNMQVNIX1VSTF9TQUZFID0gJ18nLmNoYXJDb2RlQXQoMClcblxuXHRmdW5jdGlvbiBkZWNvZGUgKGVsdCkge1xuXHRcdHZhciBjb2RlID0gZWx0LmNoYXJDb2RlQXQoMClcblx0XHRpZiAoY29kZSA9PT0gUExVUyB8fFxuXHRcdCAgICBjb2RlID09PSBQTFVTX1VSTF9TQUZFKVxuXHRcdFx0cmV0dXJuIDYyIC8vICcrJ1xuXHRcdGlmIChjb2RlID09PSBTTEFTSCB8fFxuXHRcdCAgICBjb2RlID09PSBTTEFTSF9VUkxfU0FGRSlcblx0XHRcdHJldHVybiA2MyAvLyAnLydcblx0XHRpZiAoY29kZSA8IE5VTUJFUilcblx0XHRcdHJldHVybiAtMSAvL25vIG1hdGNoXG5cdFx0aWYgKGNvZGUgPCBOVU1CRVIgKyAxMClcblx0XHRcdHJldHVybiBjb2RlIC0gTlVNQkVSICsgMjYgKyAyNlxuXHRcdGlmIChjb2RlIDwgVVBQRVIgKyAyNilcblx0XHRcdHJldHVybiBjb2RlIC0gVVBQRVJcblx0XHRpZiAoY29kZSA8IExPV0VSICsgMjYpXG5cdFx0XHRyZXR1cm4gY29kZSAtIExPV0VSICsgMjZcblx0fVxuXG5cdGZ1bmN0aW9uIGI2NFRvQnl0ZUFycmF5IChiNjQpIHtcblx0XHR2YXIgaSwgaiwgbCwgdG1wLCBwbGFjZUhvbGRlcnMsIGFyclxuXG5cdFx0aWYgKGI2NC5sZW5ndGggJSA0ID4gMCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHN0cmluZy4gTGVuZ3RoIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA0Jylcblx0XHR9XG5cblx0XHQvLyB0aGUgbnVtYmVyIG9mIGVxdWFsIHNpZ25zIChwbGFjZSBob2xkZXJzKVxuXHRcdC8vIGlmIHRoZXJlIGFyZSB0d28gcGxhY2Vob2xkZXJzLCB0aGFuIHRoZSB0d28gY2hhcmFjdGVycyBiZWZvcmUgaXRcblx0XHQvLyByZXByZXNlbnQgb25lIGJ5dGVcblx0XHQvLyBpZiB0aGVyZSBpcyBvbmx5IG9uZSwgdGhlbiB0aGUgdGhyZWUgY2hhcmFjdGVycyBiZWZvcmUgaXQgcmVwcmVzZW50IDIgYnl0ZXNcblx0XHQvLyB0aGlzIGlzIGp1c3QgYSBjaGVhcCBoYWNrIHRvIG5vdCBkbyBpbmRleE9mIHR3aWNlXG5cdFx0dmFyIGxlbiA9IGI2NC5sZW5ndGhcblx0XHRwbGFjZUhvbGRlcnMgPSAnPScgPT09IGI2NC5jaGFyQXQobGVuIC0gMikgPyAyIDogJz0nID09PSBiNjQuY2hhckF0KGxlbiAtIDEpID8gMSA6IDBcblxuXHRcdC8vIGJhc2U2NCBpcyA0LzMgKyB1cCB0byB0d28gY2hhcmFjdGVycyBvZiB0aGUgb3JpZ2luYWwgZGF0YVxuXHRcdGFyciA9IG5ldyBBcnIoYjY0Lmxlbmd0aCAqIDMgLyA0IC0gcGxhY2VIb2xkZXJzKVxuXG5cdFx0Ly8gaWYgdGhlcmUgYXJlIHBsYWNlaG9sZGVycywgb25seSBnZXQgdXAgdG8gdGhlIGxhc3QgY29tcGxldGUgNCBjaGFyc1xuXHRcdGwgPSBwbGFjZUhvbGRlcnMgPiAwID8gYjY0Lmxlbmd0aCAtIDQgOiBiNjQubGVuZ3RoXG5cblx0XHR2YXIgTCA9IDBcblxuXHRcdGZ1bmN0aW9uIHB1c2ggKHYpIHtcblx0XHRcdGFycltMKytdID0gdlxuXHRcdH1cblxuXHRcdGZvciAoaSA9IDAsIGogPSAwOyBpIDwgbDsgaSArPSA0LCBqICs9IDMpIHtcblx0XHRcdHRtcCA9IChkZWNvZGUoYjY0LmNoYXJBdChpKSkgPDwgMTgpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAxKSkgPDwgMTIpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAyKSkgPDwgNikgfCBkZWNvZGUoYjY0LmNoYXJBdChpICsgMykpXG5cdFx0XHRwdXNoKCh0bXAgJiAweEZGMDAwMCkgPj4gMTYpXG5cdFx0XHRwdXNoKCh0bXAgJiAweEZGMDApID4+IDgpXG5cdFx0XHRwdXNoKHRtcCAmIDB4RkYpXG5cdFx0fVxuXG5cdFx0aWYgKHBsYWNlSG9sZGVycyA9PT0gMikge1xuXHRcdFx0dG1wID0gKGRlY29kZShiNjQuY2hhckF0KGkpKSA8PCAyKSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMSkpID4+IDQpXG5cdFx0XHRwdXNoKHRtcCAmIDB4RkYpXG5cdFx0fSBlbHNlIGlmIChwbGFjZUhvbGRlcnMgPT09IDEpIHtcblx0XHRcdHRtcCA9IChkZWNvZGUoYjY0LmNoYXJBdChpKSkgPDwgMTApIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAxKSkgPDwgNCkgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDIpKSA+PiAyKVxuXHRcdFx0cHVzaCgodG1wID4+IDgpICYgMHhGRilcblx0XHRcdHB1c2godG1wICYgMHhGRilcblx0XHR9XG5cblx0XHRyZXR1cm4gYXJyXG5cdH1cblxuXHRmdW5jdGlvbiB1aW50OFRvQmFzZTY0ICh1aW50OCkge1xuXHRcdHZhciBpLFxuXHRcdFx0ZXh0cmFCeXRlcyA9IHVpbnQ4Lmxlbmd0aCAlIDMsIC8vIGlmIHdlIGhhdmUgMSBieXRlIGxlZnQsIHBhZCAyIGJ5dGVzXG5cdFx0XHRvdXRwdXQgPSBcIlwiLFxuXHRcdFx0dGVtcCwgbGVuZ3RoXG5cblx0XHRmdW5jdGlvbiBlbmNvZGUgKG51bSkge1xuXHRcdFx0cmV0dXJuIGxvb2t1cC5jaGFyQXQobnVtKVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHRyaXBsZXRUb0Jhc2U2NCAobnVtKSB7XG5cdFx0XHRyZXR1cm4gZW5jb2RlKG51bSA+PiAxOCAmIDB4M0YpICsgZW5jb2RlKG51bSA+PiAxMiAmIDB4M0YpICsgZW5jb2RlKG51bSA+PiA2ICYgMHgzRikgKyBlbmNvZGUobnVtICYgMHgzRilcblx0XHR9XG5cblx0XHQvLyBnbyB0aHJvdWdoIHRoZSBhcnJheSBldmVyeSB0aHJlZSBieXRlcywgd2UnbGwgZGVhbCB3aXRoIHRyYWlsaW5nIHN0dWZmIGxhdGVyXG5cdFx0Zm9yIChpID0gMCwgbGVuZ3RoID0gdWludDgubGVuZ3RoIC0gZXh0cmFCeXRlczsgaSA8IGxlbmd0aDsgaSArPSAzKSB7XG5cdFx0XHR0ZW1wID0gKHVpbnQ4W2ldIDw8IDE2KSArICh1aW50OFtpICsgMV0gPDwgOCkgKyAodWludDhbaSArIDJdKVxuXHRcdFx0b3V0cHV0ICs9IHRyaXBsZXRUb0Jhc2U2NCh0ZW1wKVxuXHRcdH1cblxuXHRcdC8vIHBhZCB0aGUgZW5kIHdpdGggemVyb3MsIGJ1dCBtYWtlIHN1cmUgdG8gbm90IGZvcmdldCB0aGUgZXh0cmEgYnl0ZXNcblx0XHRzd2l0Y2ggKGV4dHJhQnl0ZXMpIHtcblx0XHRcdGNhc2UgMTpcblx0XHRcdFx0dGVtcCA9IHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDFdXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUodGVtcCA+PiAyKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKCh0ZW1wIDw8IDQpICYgMHgzRilcblx0XHRcdFx0b3V0cHV0ICs9ICc9PSdcblx0XHRcdFx0YnJlYWtcblx0XHRcdGNhc2UgMjpcblx0XHRcdFx0dGVtcCA9ICh1aW50OFt1aW50OC5sZW5ndGggLSAyXSA8PCA4KSArICh1aW50OFt1aW50OC5sZW5ndGggLSAxXSlcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSh0ZW1wID4+IDEwKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKCh0ZW1wID4+IDQpICYgMHgzRilcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSgodGVtcCA8PCAyKSAmIDB4M0YpXG5cdFx0XHRcdG91dHB1dCArPSAnPSdcblx0XHRcdFx0YnJlYWtcblx0XHR9XG5cblx0XHRyZXR1cm4gb3V0cHV0XG5cdH1cblxuXHRleHBvcnRzLnRvQnl0ZUFycmF5ID0gYjY0VG9CeXRlQXJyYXlcblx0ZXhwb3J0cy5mcm9tQnl0ZUFycmF5ID0gdWludDhUb0Jhc2U2NFxufSh0eXBlb2YgZXhwb3J0cyA9PT0gJ3VuZGVmaW5lZCcgPyAodGhpcy5iYXNlNjRqcyA9IHt9KSA6IGV4cG9ydHMpKVxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcInBCR3ZBcFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uL25vZGVfbW9kdWxlcy9iYXNlNjQtanMvbGliL2I2NC5qc1wiLFwiLy4uL25vZGVfbW9kdWxlcy9iYXNlNjQtanMvbGliXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLyohXG4gKiBUaGUgYnVmZmVyIG1vZHVsZSBmcm9tIG5vZGUuanMsIGZvciB0aGUgYnJvd3Nlci5cbiAqXG4gKiBAYXV0aG9yICAgRmVyb3NzIEFib3VraGFkaWplaCA8ZmVyb3NzQGZlcm9zcy5vcmc+IDxodHRwOi8vZmVyb3NzLm9yZz5cbiAqIEBsaWNlbnNlICBNSVRcbiAqL1xuXG52YXIgYmFzZTY0ID0gcmVxdWlyZSgnYmFzZTY0LWpzJylcbnZhciBpZWVlNzU0ID0gcmVxdWlyZSgnaWVlZTc1NCcpXG5cbmV4cG9ydHMuQnVmZmVyID0gQnVmZmVyXG5leHBvcnRzLlNsb3dCdWZmZXIgPSBCdWZmZXJcbmV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVMgPSA1MFxuQnVmZmVyLnBvb2xTaXplID0gODE5MlxuXG4vKipcbiAqIElmIGBCdWZmZXIuX3VzZVR5cGVkQXJyYXlzYDpcbiAqICAgPT09IHRydWUgICAgVXNlIFVpbnQ4QXJyYXkgaW1wbGVtZW50YXRpb24gKGZhc3Rlc3QpXG4gKiAgID09PSBmYWxzZSAgIFVzZSBPYmplY3QgaW1wbGVtZW50YXRpb24gKGNvbXBhdGlibGUgZG93biB0byBJRTYpXG4gKi9cbkJ1ZmZlci5fdXNlVHlwZWRBcnJheXMgPSAoZnVuY3Rpb24gKCkge1xuICAvLyBEZXRlY3QgaWYgYnJvd3NlciBzdXBwb3J0cyBUeXBlZCBBcnJheXMuIFN1cHBvcnRlZCBicm93c2VycyBhcmUgSUUgMTArLCBGaXJlZm94IDQrLFxuICAvLyBDaHJvbWUgNyssIFNhZmFyaSA1LjErLCBPcGVyYSAxMS42KywgaU9TIDQuMisuIElmIHRoZSBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgYWRkaW5nXG4gIC8vIHByb3BlcnRpZXMgdG8gYFVpbnQ4QXJyYXlgIGluc3RhbmNlcywgdGhlbiB0aGF0J3MgdGhlIHNhbWUgYXMgbm8gYFVpbnQ4QXJyYXlgIHN1cHBvcnRcbiAgLy8gYmVjYXVzZSB3ZSBuZWVkIHRvIGJlIGFibGUgdG8gYWRkIGFsbCB0aGUgbm9kZSBCdWZmZXIgQVBJIG1ldGhvZHMuIFRoaXMgaXMgYW4gaXNzdWVcbiAgLy8gaW4gRmlyZWZveCA0LTI5LiBOb3cgZml4ZWQ6IGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTY5NTQzOFxuICB0cnkge1xuICAgIHZhciBidWYgPSBuZXcgQXJyYXlCdWZmZXIoMClcbiAgICB2YXIgYXJyID0gbmV3IFVpbnQ4QXJyYXkoYnVmKVxuICAgIGFyci5mb28gPSBmdW5jdGlvbiAoKSB7IHJldHVybiA0MiB9XG4gICAgcmV0dXJuIDQyID09PSBhcnIuZm9vKCkgJiZcbiAgICAgICAgdHlwZW9mIGFyci5zdWJhcnJheSA9PT0gJ2Z1bmN0aW9uJyAvLyBDaHJvbWUgOS0xMCBsYWNrIGBzdWJhcnJheWBcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59KSgpXG5cbi8qKlxuICogQ2xhc3M6IEJ1ZmZlclxuICogPT09PT09PT09PT09PVxuICpcbiAqIFRoZSBCdWZmZXIgY29uc3RydWN0b3IgcmV0dXJucyBpbnN0YW5jZXMgb2YgYFVpbnQ4QXJyYXlgIHRoYXQgYXJlIGF1Z21lbnRlZFxuICogd2l0aCBmdW5jdGlvbiBwcm9wZXJ0aWVzIGZvciBhbGwgdGhlIG5vZGUgYEJ1ZmZlcmAgQVBJIGZ1bmN0aW9ucy4gV2UgdXNlXG4gKiBgVWludDhBcnJheWAgc28gdGhhdCBzcXVhcmUgYnJhY2tldCBub3RhdGlvbiB3b3JrcyBhcyBleHBlY3RlZCAtLSBpdCByZXR1cm5zXG4gKiBhIHNpbmdsZSBvY3RldC5cbiAqXG4gKiBCeSBhdWdtZW50aW5nIHRoZSBpbnN0YW5jZXMsIHdlIGNhbiBhdm9pZCBtb2RpZnlpbmcgdGhlIGBVaW50OEFycmF5YFxuICogcHJvdG90eXBlLlxuICovXG5mdW5jdGlvbiBCdWZmZXIgKHN1YmplY3QsIGVuY29kaW5nLCBub1plcm8pIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEJ1ZmZlcikpXG4gICAgcmV0dXJuIG5ldyBCdWZmZXIoc3ViamVjdCwgZW5jb2RpbmcsIG5vWmVybylcblxuICB2YXIgdHlwZSA9IHR5cGVvZiBzdWJqZWN0XG5cbiAgLy8gV29ya2Fyb3VuZDogbm9kZSdzIGJhc2U2NCBpbXBsZW1lbnRhdGlvbiBhbGxvd3MgZm9yIG5vbi1wYWRkZWQgc3RyaW5nc1xuICAvLyB3aGlsZSBiYXNlNjQtanMgZG9lcyBub3QuXG4gIGlmIChlbmNvZGluZyA9PT0gJ2Jhc2U2NCcgJiYgdHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICBzdWJqZWN0ID0gc3RyaW5ndHJpbShzdWJqZWN0KVxuICAgIHdoaWxlIChzdWJqZWN0Lmxlbmd0aCAlIDQgIT09IDApIHtcbiAgICAgIHN1YmplY3QgPSBzdWJqZWN0ICsgJz0nXG4gICAgfVxuICB9XG5cbiAgLy8gRmluZCB0aGUgbGVuZ3RoXG4gIHZhciBsZW5ndGhcbiAgaWYgKHR5cGUgPT09ICdudW1iZXInKVxuICAgIGxlbmd0aCA9IGNvZXJjZShzdWJqZWN0KVxuICBlbHNlIGlmICh0eXBlID09PSAnc3RyaW5nJylcbiAgICBsZW5ndGggPSBCdWZmZXIuYnl0ZUxlbmd0aChzdWJqZWN0LCBlbmNvZGluZylcbiAgZWxzZSBpZiAodHlwZSA9PT0gJ29iamVjdCcpXG4gICAgbGVuZ3RoID0gY29lcmNlKHN1YmplY3QubGVuZ3RoKSAvLyBhc3N1bWUgdGhhdCBvYmplY3QgaXMgYXJyYXktbGlrZVxuICBlbHNlXG4gICAgdGhyb3cgbmV3IEVycm9yKCdGaXJzdCBhcmd1bWVudCBuZWVkcyB0byBiZSBhIG51bWJlciwgYXJyYXkgb3Igc3RyaW5nLicpXG5cbiAgdmFyIGJ1ZlxuICBpZiAoQnVmZmVyLl91c2VUeXBlZEFycmF5cykge1xuICAgIC8vIFByZWZlcnJlZDogUmV0dXJuIGFuIGF1Z21lbnRlZCBgVWludDhBcnJheWAgaW5zdGFuY2UgZm9yIGJlc3QgcGVyZm9ybWFuY2VcbiAgICBidWYgPSBCdWZmZXIuX2F1Z21lbnQobmV3IFVpbnQ4QXJyYXkobGVuZ3RoKSlcbiAgfSBlbHNlIHtcbiAgICAvLyBGYWxsYmFjazogUmV0dXJuIFRISVMgaW5zdGFuY2Ugb2YgQnVmZmVyIChjcmVhdGVkIGJ5IGBuZXdgKVxuICAgIGJ1ZiA9IHRoaXNcbiAgICBidWYubGVuZ3RoID0gbGVuZ3RoXG4gICAgYnVmLl9pc0J1ZmZlciA9IHRydWVcbiAgfVxuXG4gIHZhciBpXG4gIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzICYmIHR5cGVvZiBzdWJqZWN0LmJ5dGVMZW5ndGggPT09ICdudW1iZXInKSB7XG4gICAgLy8gU3BlZWQgb3B0aW1pemF0aW9uIC0tIHVzZSBzZXQgaWYgd2UncmUgY29weWluZyBmcm9tIGEgdHlwZWQgYXJyYXlcbiAgICBidWYuX3NldChzdWJqZWN0KVxuICB9IGVsc2UgaWYgKGlzQXJyYXlpc2goc3ViamVjdCkpIHtcbiAgICAvLyBUcmVhdCBhcnJheS1pc2ggb2JqZWN0cyBhcyBhIGJ5dGUgYXJyYXlcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChCdWZmZXIuaXNCdWZmZXIoc3ViamVjdCkpXG4gICAgICAgIGJ1ZltpXSA9IHN1YmplY3QucmVhZFVJbnQ4KGkpXG4gICAgICBlbHNlXG4gICAgICAgIGJ1ZltpXSA9IHN1YmplY3RbaV1cbiAgICB9XG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICBidWYud3JpdGUoc3ViamVjdCwgMCwgZW5jb2RpbmcpXG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gJ251bWJlcicgJiYgIUJ1ZmZlci5fdXNlVHlwZWRBcnJheXMgJiYgIW5vWmVybykge1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgYnVmW2ldID0gMFxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBidWZcbn1cblxuLy8gU1RBVElDIE1FVEhPRFNcbi8vID09PT09PT09PT09PT09XG5cbkJ1ZmZlci5pc0VuY29kaW5nID0gZnVuY3Rpb24gKGVuY29kaW5nKSB7XG4gIHN3aXRjaCAoU3RyaW5nKGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgY2FzZSAnYXNjaWknOlxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICBjYXNlICdyYXcnOlxuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5CdWZmZXIuaXNCdWZmZXIgPSBmdW5jdGlvbiAoYikge1xuICByZXR1cm4gISEoYiAhPT0gbnVsbCAmJiBiICE9PSB1bmRlZmluZWQgJiYgYi5faXNCdWZmZXIpXG59XG5cbkJ1ZmZlci5ieXRlTGVuZ3RoID0gZnVuY3Rpb24gKHN0ciwgZW5jb2RpbmcpIHtcbiAgdmFyIHJldFxuICBzdHIgPSBzdHIgKyAnJ1xuICBzd2l0Y2ggKGVuY29kaW5nIHx8ICd1dGY4Jykge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgICByZXQgPSBzdHIubGVuZ3RoIC8gMlxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXQgPSB1dGY4VG9CeXRlcyhzdHIpLmxlbmd0aFxuICAgICAgYnJlYWtcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICBjYXNlICdyYXcnOlxuICAgICAgcmV0ID0gc3RyLmxlbmd0aFxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0ID0gYmFzZTY0VG9CeXRlcyhzdHIpLmxlbmd0aFxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0ID0gc3RyLmxlbmd0aCAqIDJcbiAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZycpXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5CdWZmZXIuY29uY2F0ID0gZnVuY3Rpb24gKGxpc3QsIHRvdGFsTGVuZ3RoKSB7XG4gIGFzc2VydChpc0FycmF5KGxpc3QpLCAnVXNhZ2U6IEJ1ZmZlci5jb25jYXQobGlzdCwgW3RvdGFsTGVuZ3RoXSlcXG4nICtcbiAgICAgICdsaXN0IHNob3VsZCBiZSBhbiBBcnJheS4nKVxuXG4gIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBuZXcgQnVmZmVyKDApXG4gIH0gZWxzZSBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gbGlzdFswXVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKHR5cGVvZiB0b3RhbExlbmd0aCAhPT0gJ251bWJlcicpIHtcbiAgICB0b3RhbExlbmd0aCA9IDBcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgdG90YWxMZW5ndGggKz0gbGlzdFtpXS5sZW5ndGhcbiAgICB9XG4gIH1cblxuICB2YXIgYnVmID0gbmV3IEJ1ZmZlcih0b3RhbExlbmd0aClcbiAgdmFyIHBvcyA9IDBcbiAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV1cbiAgICBpdGVtLmNvcHkoYnVmLCBwb3MpXG4gICAgcG9zICs9IGl0ZW0ubGVuZ3RoXG4gIH1cbiAgcmV0dXJuIGJ1ZlxufVxuXG4vLyBCVUZGRVIgSU5TVEFOQ0UgTUVUSE9EU1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT1cblxuZnVuY3Rpb24gX2hleFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgb2Zmc2V0ID0gTnVtYmVyKG9mZnNldCkgfHwgMFxuICB2YXIgcmVtYWluaW5nID0gYnVmLmxlbmd0aCAtIG9mZnNldFxuICBpZiAoIWxlbmd0aCkge1xuICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICB9IGVsc2Uge1xuICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpXG4gICAgaWYgKGxlbmd0aCA+IHJlbWFpbmluZykge1xuICAgICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gICAgfVxuICB9XG5cbiAgLy8gbXVzdCBiZSBhbiBldmVuIG51bWJlciBvZiBkaWdpdHNcbiAgdmFyIHN0ckxlbiA9IHN0cmluZy5sZW5ndGhcbiAgYXNzZXJ0KHN0ckxlbiAlIDIgPT09IDAsICdJbnZhbGlkIGhleCBzdHJpbmcnKVxuXG4gIGlmIChsZW5ndGggPiBzdHJMZW4gLyAyKSB7XG4gICAgbGVuZ3RoID0gc3RyTGVuIC8gMlxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgYnl0ZSA9IHBhcnNlSW50KHN0cmluZy5zdWJzdHIoaSAqIDIsIDIpLCAxNilcbiAgICBhc3NlcnQoIWlzTmFOKGJ5dGUpLCAnSW52YWxpZCBoZXggc3RyaW5nJylcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSBieXRlXG4gIH1cbiAgQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPSBpICogMlxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiBfdXRmOFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKHV0ZjhUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuZnVuY3Rpb24gX2FzY2lpV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgY2hhcnNXcml0dGVuID0gQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPVxuICAgIGJsaXRCdWZmZXIoYXNjaWlUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuZnVuY3Rpb24gX2JpbmFyeVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIF9hc2NpaVdyaXRlKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gX2Jhc2U2NFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKGJhc2U2NFRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbiAgcmV0dXJuIGNoYXJzV3JpdHRlblxufVxuXG5mdW5jdGlvbiBfdXRmMTZsZVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKHV0ZjE2bGVUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZykge1xuICAvLyBTdXBwb3J0IGJvdGggKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgsIGVuY29kaW5nKVxuICAvLyBhbmQgdGhlIGxlZ2FjeSAoc3RyaW5nLCBlbmNvZGluZywgb2Zmc2V0LCBsZW5ndGgpXG4gIGlmIChpc0Zpbml0ZShvZmZzZXQpKSB7XG4gICAgaWYgKCFpc0Zpbml0ZShsZW5ndGgpKSB7XG4gICAgICBlbmNvZGluZyA9IGxlbmd0aFxuICAgICAgbGVuZ3RoID0gdW5kZWZpbmVkXG4gICAgfVxuICB9IGVsc2UgeyAgLy8gbGVnYWN5XG4gICAgdmFyIHN3YXAgPSBlbmNvZGluZ1xuICAgIGVuY29kaW5nID0gb2Zmc2V0XG4gICAgb2Zmc2V0ID0gbGVuZ3RoXG4gICAgbGVuZ3RoID0gc3dhcFxuICB9XG5cbiAgb2Zmc2V0ID0gTnVtYmVyKG9mZnNldCkgfHwgMFxuICB2YXIgcmVtYWluaW5nID0gdGhpcy5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgfSBlbHNlIHtcbiAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKVxuICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICAgIH1cbiAgfVxuICBlbmNvZGluZyA9IFN0cmluZyhlbmNvZGluZyB8fCAndXRmOCcpLnRvTG93ZXJDYXNlKClcblxuICB2YXIgcmV0XG4gIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0ID0gX2hleFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIHJldCA9IF91dGY4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYXNjaWknOlxuICAgICAgcmV0ID0gX2FzY2lpV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgIHJldCA9IF9iaW5hcnlXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0ID0gX2Jhc2U2NFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXQgPSBfdXRmMTZsZVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIChlbmNvZGluZywgc3RhcnQsIGVuZCkge1xuICB2YXIgc2VsZiA9IHRoaXNcblxuICBlbmNvZGluZyA9IFN0cmluZyhlbmNvZGluZyB8fCAndXRmOCcpLnRvTG93ZXJDYXNlKClcbiAgc3RhcnQgPSBOdW1iZXIoc3RhcnQpIHx8IDBcbiAgZW5kID0gKGVuZCAhPT0gdW5kZWZpbmVkKVxuICAgID8gTnVtYmVyKGVuZClcbiAgICA6IGVuZCA9IHNlbGYubGVuZ3RoXG5cbiAgLy8gRmFzdHBhdGggZW1wdHkgc3RyaW5nc1xuICBpZiAoZW5kID09PSBzdGFydClcbiAgICByZXR1cm4gJydcblxuICB2YXIgcmV0XG4gIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0ID0gX2hleFNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIHJldCA9IF91dGY4U2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYXNjaWknOlxuICAgICAgcmV0ID0gX2FzY2lpU2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgIHJldCA9IF9iaW5hcnlTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0ID0gX2Jhc2U2NFNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXQgPSBfdXRmMTZsZVNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ0J1ZmZlcicsXG4gICAgZGF0YTogQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodGhpcy5fYXJyIHx8IHRoaXMsIDApXG4gIH1cbn1cblxuLy8gY29weSh0YXJnZXRCdWZmZXIsIHRhcmdldFN0YXJ0PTAsIHNvdXJjZVN0YXJ0PTAsIHNvdXJjZUVuZD1idWZmZXIubGVuZ3RoKVxuQnVmZmVyLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24gKHRhcmdldCwgdGFyZ2V0X3N0YXJ0LCBzdGFydCwgZW5kKSB7XG4gIHZhciBzb3VyY2UgPSB0aGlzXG5cbiAgaWYgKCFzdGFydCkgc3RhcnQgPSAwXG4gIGlmICghZW5kICYmIGVuZCAhPT0gMCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKCF0YXJnZXRfc3RhcnQpIHRhcmdldF9zdGFydCA9IDBcblxuICAvLyBDb3B5IDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVyblxuICBpZiAodGFyZ2V0Lmxlbmd0aCA9PT0gMCB8fCBzb3VyY2UubGVuZ3RoID09PSAwKSByZXR1cm5cblxuICAvLyBGYXRhbCBlcnJvciBjb25kaXRpb25zXG4gIGFzc2VydChlbmQgPj0gc3RhcnQsICdzb3VyY2VFbmQgPCBzb3VyY2VTdGFydCcpXG4gIGFzc2VydCh0YXJnZXRfc3RhcnQgPj0gMCAmJiB0YXJnZXRfc3RhcnQgPCB0YXJnZXQubGVuZ3RoLFxuICAgICAgJ3RhcmdldFN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICBhc3NlcnQoc3RhcnQgPj0gMCAmJiBzdGFydCA8IHNvdXJjZS5sZW5ndGgsICdzb3VyY2VTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgYXNzZXJ0KGVuZCA+PSAwICYmIGVuZCA8PSBzb3VyY2UubGVuZ3RoLCAnc291cmNlRW5kIG91dCBvZiBib3VuZHMnKVxuXG4gIC8vIEFyZSB3ZSBvb2I/XG4gIGlmIChlbmQgPiB0aGlzLmxlbmd0aClcbiAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAodGFyZ2V0Lmxlbmd0aCAtIHRhcmdldF9zdGFydCA8IGVuZCAtIHN0YXJ0KVxuICAgIGVuZCA9IHRhcmdldC5sZW5ndGggLSB0YXJnZXRfc3RhcnQgKyBzdGFydFxuXG4gIHZhciBsZW4gPSBlbmQgLSBzdGFydFxuXG4gIGlmIChsZW4gPCAxMDAgfHwgIUJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgdGFyZ2V0W2kgKyB0YXJnZXRfc3RhcnRdID0gdGhpc1tpICsgc3RhcnRdXG4gIH0gZWxzZSB7XG4gICAgdGFyZ2V0Ll9zZXQodGhpcy5zdWJhcnJheShzdGFydCwgc3RhcnQgKyBsZW4pLCB0YXJnZXRfc3RhcnQpXG4gIH1cbn1cblxuZnVuY3Rpb24gX2Jhc2U2NFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKHN0YXJ0ID09PSAwICYmIGVuZCA9PT0gYnVmLmxlbmd0aCkge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1Zi5zbGljZShzdGFydCwgZW5kKSlcbiAgfVxufVxuXG5mdW5jdGlvbiBfdXRmOFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJlcyA9ICcnXG4gIHZhciB0bXAgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICBpZiAoYnVmW2ldIDw9IDB4N0YpIHtcbiAgICAgIHJlcyArPSBkZWNvZGVVdGY4Q2hhcih0bXApICsgU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0pXG4gICAgICB0bXAgPSAnJ1xuICAgIH0gZWxzZSB7XG4gICAgICB0bXAgKz0gJyUnICsgYnVmW2ldLnRvU3RyaW5nKDE2KVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXMgKyBkZWNvZGVVdGY4Q2hhcih0bXApXG59XG5cbmZ1bmN0aW9uIF9hc2NpaVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJldCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKylcbiAgICByZXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0pXG4gIHJldHVybiByZXRcbn1cblxuZnVuY3Rpb24gX2JpbmFyeVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgcmV0dXJuIF9hc2NpaVNsaWNlKGJ1Ziwgc3RhcnQsIGVuZClcbn1cblxuZnVuY3Rpb24gX2hleFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcblxuICBpZiAoIXN0YXJ0IHx8IHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIGlmICghZW5kIHx8IGVuZCA8IDAgfHwgZW5kID4gbGVuKSBlbmQgPSBsZW5cblxuICB2YXIgb3V0ID0gJydcbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICBvdXQgKz0gdG9IZXgoYnVmW2ldKVxuICB9XG4gIHJldHVybiBvdXRcbn1cblxuZnVuY3Rpb24gX3V0ZjE2bGVTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBieXRlcyA9IGJ1Zi5zbGljZShzdGFydCwgZW5kKVxuICB2YXIgcmVzID0gJydcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkgKz0gMikge1xuICAgIHJlcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ5dGVzW2ldICsgYnl0ZXNbaSsxXSAqIDI1NilcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc2xpY2UgPSBmdW5jdGlvbiAoc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgc3RhcnQgPSBjbGFtcChzdGFydCwgbGVuLCAwKVxuICBlbmQgPSBjbGFtcChlbmQsIGxlbiwgbGVuKVxuXG4gIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzKSB7XG4gICAgcmV0dXJuIEJ1ZmZlci5fYXVnbWVudCh0aGlzLnN1YmFycmF5KHN0YXJ0LCBlbmQpKVxuICB9IGVsc2Uge1xuICAgIHZhciBzbGljZUxlbiA9IGVuZCAtIHN0YXJ0XG4gICAgdmFyIG5ld0J1ZiA9IG5ldyBCdWZmZXIoc2xpY2VMZW4sIHVuZGVmaW5lZCwgdHJ1ZSlcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNsaWNlTGVuOyBpKyspIHtcbiAgICAgIG5ld0J1ZltpXSA9IHRoaXNbaSArIHN0YXJ0XVxuICAgIH1cbiAgICByZXR1cm4gbmV3QnVmXG4gIH1cbn1cblxuLy8gYGdldGAgd2lsbCBiZSByZW1vdmVkIGluIE5vZGUgMC4xMytcbkJ1ZmZlci5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKG9mZnNldCkge1xuICBjb25zb2xlLmxvZygnLmdldCgpIGlzIGRlcHJlY2F0ZWQuIEFjY2VzcyB1c2luZyBhcnJheSBpbmRleGVzIGluc3RlYWQuJylcbiAgcmV0dXJuIHRoaXMucmVhZFVJbnQ4KG9mZnNldClcbn1cblxuLy8gYHNldGAgd2lsbCBiZSByZW1vdmVkIGluIE5vZGUgMC4xMytcbkJ1ZmZlci5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKHYsIG9mZnNldCkge1xuICBjb25zb2xlLmxvZygnLnNldCgpIGlzIGRlcHJlY2F0ZWQuIEFjY2VzcyB1c2luZyBhcnJheSBpbmRleGVzIGluc3RlYWQuJylcbiAgcmV0dXJuIHRoaXMud3JpdGVVSW50OCh2LCBvZmZzZXQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQ4ID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aClcbiAgICByZXR1cm5cblxuICByZXR1cm4gdGhpc1tvZmZzZXRdXG59XG5cbmZ1bmN0aW9uIF9yZWFkVUludDE2IChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgdmFyIHZhbFxuICBpZiAobGl0dGxlRW5kaWFuKSB7XG4gICAgdmFsID0gYnVmW29mZnNldF1cbiAgICBpZiAob2Zmc2V0ICsgMSA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMV0gPDwgOFxuICB9IGVsc2Uge1xuICAgIHZhbCA9IGJ1ZltvZmZzZXRdIDw8IDhcbiAgICBpZiAob2Zmc2V0ICsgMSA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMV1cbiAgfVxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDE2KHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDE2KHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZFVJbnQzMiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWxcbiAgaWYgKGxpdHRsZUVuZGlhbikge1xuICAgIGlmIChvZmZzZXQgKyAyIDwgbGVuKVxuICAgICAgdmFsID0gYnVmW29mZnNldCArIDJdIDw8IDE2XG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDFdIDw8IDhcbiAgICB2YWwgfD0gYnVmW29mZnNldF1cbiAgICBpZiAob2Zmc2V0ICsgMyA8IGxlbilcbiAgICAgIHZhbCA9IHZhbCArIChidWZbb2Zmc2V0ICsgM10gPDwgMjQgPj4+IDApXG4gIH0gZWxzZSB7XG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgPSBidWZbb2Zmc2V0ICsgMV0gPDwgMTZcbiAgICBpZiAob2Zmc2V0ICsgMiA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMl0gPDwgOFxuICAgIGlmIChvZmZzZXQgKyAzIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAzXVxuICAgIHZhbCA9IHZhbCArIChidWZbb2Zmc2V0XSA8PCAyNCA+Pj4gMClcbiAgfVxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDMyKHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDMyKHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQ4ID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsXG4gICAgICAgICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aClcbiAgICByZXR1cm5cblxuICB2YXIgbmVnID0gdGhpc1tvZmZzZXRdICYgMHg4MFxuICBpZiAobmVnKVxuICAgIHJldHVybiAoMHhmZiAtIHRoaXNbb2Zmc2V0XSArIDEpICogLTFcbiAgZWxzZVxuICAgIHJldHVybiB0aGlzW29mZnNldF1cbn1cblxuZnVuY3Rpb24gX3JlYWRJbnQxNiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWwgPSBfcmVhZFVJbnQxNihidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCB0cnVlKVxuICB2YXIgbmVnID0gdmFsICYgMHg4MDAwXG4gIGlmIChuZWcpXG4gICAgcmV0dXJuICgweGZmZmYgLSB2YWwgKyAxKSAqIC0xXG4gIGVsc2VcbiAgICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2TEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQxNih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MTYodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkSW50MzIgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICB2YXIgdmFsID0gX3JlYWRVSW50MzIoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgdHJ1ZSlcbiAgdmFyIG5lZyA9IHZhbCAmIDB4ODAwMDAwMDBcbiAgaWYgKG5lZylcbiAgICByZXR1cm4gKDB4ZmZmZmZmZmYgLSB2YWwgKyAxKSAqIC0xXG4gIGVsc2VcbiAgICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyTEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQzMih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MzIodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkRmxvYXQgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgcmV0dXJuIGllZWU3NTQucmVhZChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEZsb2F0KHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0QkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRGbG9hdCh0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3JlYWREb3VibGUgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCArIDcgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgcmV0dXJuIGllZWU3NTQucmVhZChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCA1MiwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlTEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWREb3VibGUodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlQkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWREb3VibGUodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50OCA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ3RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZ1aW50KHZhbHVlLCAweGZmKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aCkgcmV0dXJuXG5cbiAgdGhpc1tvZmZzZXRdID0gdmFsdWVcbn1cblxuZnVuY3Rpb24gX3dyaXRlVUludDE2IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAndHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnVpbnQodmFsdWUsIDB4ZmZmZilcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGZvciAodmFyIGkgPSAwLCBqID0gTWF0aC5taW4obGVuIC0gb2Zmc2V0LCAyKTsgaSA8IGo7IGkrKykge1xuICAgIGJ1ZltvZmZzZXQgKyBpXSA9XG4gICAgICAgICh2YWx1ZSAmICgweGZmIDw8ICg4ICogKGxpdHRsZUVuZGlhbiA/IGkgOiAxIC0gaSkpKSkgPj4+XG4gICAgICAgICAgICAobGl0dGxlRW5kaWFuID8gaSA6IDEgLSBpKSAqIDhcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2TEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2QkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlVUludDMyIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAndHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnVpbnQodmFsdWUsIDB4ZmZmZmZmZmYpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBmb3IgKHZhciBpID0gMCwgaiA9IE1hdGgubWluKGxlbiAtIG9mZnNldCwgNCk7IGkgPCBqOyBpKyspIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPVxuICAgICAgICAodmFsdWUgPj4+IChsaXR0bGVFbmRpYW4gPyBpIDogMyAtIGkpICogOCkgJiAweGZmXG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQ4ID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnNpbnQodmFsdWUsIDB4N2YsIC0weDgwKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aClcbiAgICByZXR1cm5cblxuICBpZiAodmFsdWUgPj0gMClcbiAgICB0aGlzLndyaXRlVUludDgodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpXG4gIGVsc2VcbiAgICB0aGlzLndyaXRlVUludDgoMHhmZiArIHZhbHVlICsgMSwgb2Zmc2V0LCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlSW50MTYgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMSA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmc2ludCh2YWx1ZSwgMHg3ZmZmLCAtMHg4MDAwKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWYgKHZhbHVlID49IDApXG4gICAgX3dyaXRlVUludDE2KGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydClcbiAgZWxzZVxuICAgIF93cml0ZVVJbnQxNihidWYsIDB4ZmZmZiArIHZhbHVlICsgMSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2QkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVJbnQzMiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZzaW50KHZhbHVlLCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGlmICh2YWx1ZSA+PSAwKVxuICAgIF93cml0ZVVJbnQzMihidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG4gIGVsc2VcbiAgICBfd3JpdGVVSW50MzIoYnVmLCAweGZmZmZmZmZmICsgdmFsdWUgKyAxLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZUZsb2F0IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZklFRUU3NTQodmFsdWUsIDMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgsIC0zLjQwMjgyMzQ2NjM4NTI4ODZlKzM4KVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdExFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZURvdWJsZSAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyA3IDwgYnVmLmxlbmd0aCxcbiAgICAgICAgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZJRUVFNzU0KHZhbHVlLCAxLjc5NzY5MzEzNDg2MjMxNTdFKzMwOCwgLTEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4KVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgNTIsIDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG4vLyBmaWxsKHZhbHVlLCBzdGFydD0wLCBlbmQ9YnVmZmVyLmxlbmd0aClcbkJ1ZmZlci5wcm90b3R5cGUuZmlsbCA9IGZ1bmN0aW9uICh2YWx1ZSwgc3RhcnQsIGVuZCkge1xuICBpZiAoIXZhbHVlKSB2YWx1ZSA9IDBcbiAgaWYgKCFzdGFydCkgc3RhcnQgPSAwXG4gIGlmICghZW5kKSBlbmQgPSB0aGlzLmxlbmd0aFxuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgdmFsdWUgPSB2YWx1ZS5jaGFyQ29kZUF0KDApXG4gIH1cblxuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiAhaXNOYU4odmFsdWUpLCAndmFsdWUgaXMgbm90IGEgbnVtYmVyJylcbiAgYXNzZXJ0KGVuZCA+PSBzdGFydCwgJ2VuZCA8IHN0YXJ0JylcblxuICAvLyBGaWxsIDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVyblxuICBpZiAodGhpcy5sZW5ndGggPT09IDApIHJldHVyblxuXG4gIGFzc2VydChzdGFydCA+PSAwICYmIHN0YXJ0IDwgdGhpcy5sZW5ndGgsICdzdGFydCBvdXQgb2YgYm91bmRzJylcbiAgYXNzZXJ0KGVuZCA+PSAwICYmIGVuZCA8PSB0aGlzLmxlbmd0aCwgJ2VuZCBvdXQgb2YgYm91bmRzJylcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIHRoaXNbaV0gPSB2YWx1ZVxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5zcGVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIG91dCA9IFtdXG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgb3V0W2ldID0gdG9IZXgodGhpc1tpXSlcbiAgICBpZiAoaSA9PT0gZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFUykge1xuICAgICAgb3V0W2kgKyAxXSA9ICcuLi4nXG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuICByZXR1cm4gJzxCdWZmZXIgJyArIG91dC5qb2luKCcgJykgKyAnPidcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IGBBcnJheUJ1ZmZlcmAgd2l0aCB0aGUgKmNvcGllZCogbWVtb3J5IG9mIHRoZSBidWZmZXIgaW5zdGFuY2UuXG4gKiBBZGRlZCBpbiBOb2RlIDAuMTIuIE9ubHkgYXZhaWxhYmxlIGluIGJyb3dzZXJzIHRoYXQgc3VwcG9ydCBBcnJheUJ1ZmZlci5cbiAqL1xuQnVmZmVyLnByb3RvdHlwZS50b0FycmF5QnVmZmVyID0gZnVuY3Rpb24gKCkge1xuICBpZiAodHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgaWYgKEJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICAgIHJldHVybiAobmV3IEJ1ZmZlcih0aGlzKSkuYnVmZmVyXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBidWYgPSBuZXcgVWludDhBcnJheSh0aGlzLmxlbmd0aClcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBidWYubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpXG4gICAgICAgIGJ1ZltpXSA9IHRoaXNbaV1cbiAgICAgIHJldHVybiBidWYuYnVmZmVyXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcignQnVmZmVyLnRvQXJyYXlCdWZmZXIgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGJyb3dzZXInKVxuICB9XG59XG5cbi8vIEhFTFBFUiBGVU5DVElPTlNcbi8vID09PT09PT09PT09PT09PT1cblxuZnVuY3Rpb24gc3RyaW5ndHJpbSAoc3RyKSB7XG4gIGlmIChzdHIudHJpbSkgcmV0dXJuIHN0ci50cmltKClcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJylcbn1cblxudmFyIEJQID0gQnVmZmVyLnByb3RvdHlwZVxuXG4vKipcbiAqIEF1Z21lbnQgYSBVaW50OEFycmF5ICppbnN0YW5jZSogKG5vdCB0aGUgVWludDhBcnJheSBjbGFzcyEpIHdpdGggQnVmZmVyIG1ldGhvZHNcbiAqL1xuQnVmZmVyLl9hdWdtZW50ID0gZnVuY3Rpb24gKGFycikge1xuICBhcnIuX2lzQnVmZmVyID0gdHJ1ZVxuXG4gIC8vIHNhdmUgcmVmZXJlbmNlIHRvIG9yaWdpbmFsIFVpbnQ4QXJyYXkgZ2V0L3NldCBtZXRob2RzIGJlZm9yZSBvdmVyd3JpdGluZ1xuICBhcnIuX2dldCA9IGFyci5nZXRcbiAgYXJyLl9zZXQgPSBhcnIuc2V0XG5cbiAgLy8gZGVwcmVjYXRlZCwgd2lsbCBiZSByZW1vdmVkIGluIG5vZGUgMC4xMytcbiAgYXJyLmdldCA9IEJQLmdldFxuICBhcnIuc2V0ID0gQlAuc2V0XG5cbiAgYXJyLndyaXRlID0gQlAud3JpdGVcbiAgYXJyLnRvU3RyaW5nID0gQlAudG9TdHJpbmdcbiAgYXJyLnRvTG9jYWxlU3RyaW5nID0gQlAudG9TdHJpbmdcbiAgYXJyLnRvSlNPTiA9IEJQLnRvSlNPTlxuICBhcnIuY29weSA9IEJQLmNvcHlcbiAgYXJyLnNsaWNlID0gQlAuc2xpY2VcbiAgYXJyLnJlYWRVSW50OCA9IEJQLnJlYWRVSW50OFxuICBhcnIucmVhZFVJbnQxNkxFID0gQlAucmVhZFVJbnQxNkxFXG4gIGFyci5yZWFkVUludDE2QkUgPSBCUC5yZWFkVUludDE2QkVcbiAgYXJyLnJlYWRVSW50MzJMRSA9IEJQLnJlYWRVSW50MzJMRVxuICBhcnIucmVhZFVJbnQzMkJFID0gQlAucmVhZFVJbnQzMkJFXG4gIGFyci5yZWFkSW50OCA9IEJQLnJlYWRJbnQ4XG4gIGFyci5yZWFkSW50MTZMRSA9IEJQLnJlYWRJbnQxNkxFXG4gIGFyci5yZWFkSW50MTZCRSA9IEJQLnJlYWRJbnQxNkJFXG4gIGFyci5yZWFkSW50MzJMRSA9IEJQLnJlYWRJbnQzMkxFXG4gIGFyci5yZWFkSW50MzJCRSA9IEJQLnJlYWRJbnQzMkJFXG4gIGFyci5yZWFkRmxvYXRMRSA9IEJQLnJlYWRGbG9hdExFXG4gIGFyci5yZWFkRmxvYXRCRSA9IEJQLnJlYWRGbG9hdEJFXG4gIGFyci5yZWFkRG91YmxlTEUgPSBCUC5yZWFkRG91YmxlTEVcbiAgYXJyLnJlYWREb3VibGVCRSA9IEJQLnJlYWREb3VibGVCRVxuICBhcnIud3JpdGVVSW50OCA9IEJQLndyaXRlVUludDhcbiAgYXJyLndyaXRlVUludDE2TEUgPSBCUC53cml0ZVVJbnQxNkxFXG4gIGFyci53cml0ZVVJbnQxNkJFID0gQlAud3JpdGVVSW50MTZCRVxuICBhcnIud3JpdGVVSW50MzJMRSA9IEJQLndyaXRlVUludDMyTEVcbiAgYXJyLndyaXRlVUludDMyQkUgPSBCUC53cml0ZVVJbnQzMkJFXG4gIGFyci53cml0ZUludDggPSBCUC53cml0ZUludDhcbiAgYXJyLndyaXRlSW50MTZMRSA9IEJQLndyaXRlSW50MTZMRVxuICBhcnIud3JpdGVJbnQxNkJFID0gQlAud3JpdGVJbnQxNkJFXG4gIGFyci53cml0ZUludDMyTEUgPSBCUC53cml0ZUludDMyTEVcbiAgYXJyLndyaXRlSW50MzJCRSA9IEJQLndyaXRlSW50MzJCRVxuICBhcnIud3JpdGVGbG9hdExFID0gQlAud3JpdGVGbG9hdExFXG4gIGFyci53cml0ZUZsb2F0QkUgPSBCUC53cml0ZUZsb2F0QkVcbiAgYXJyLndyaXRlRG91YmxlTEUgPSBCUC53cml0ZURvdWJsZUxFXG4gIGFyci53cml0ZURvdWJsZUJFID0gQlAud3JpdGVEb3VibGVCRVxuICBhcnIuZmlsbCA9IEJQLmZpbGxcbiAgYXJyLmluc3BlY3QgPSBCUC5pbnNwZWN0XG4gIGFyci50b0FycmF5QnVmZmVyID0gQlAudG9BcnJheUJ1ZmZlclxuXG4gIHJldHVybiBhcnJcbn1cblxuLy8gc2xpY2Uoc3RhcnQsIGVuZClcbmZ1bmN0aW9uIGNsYW1wIChpbmRleCwgbGVuLCBkZWZhdWx0VmFsdWUpIHtcbiAgaWYgKHR5cGVvZiBpbmRleCAhPT0gJ251bWJlcicpIHJldHVybiBkZWZhdWx0VmFsdWVcbiAgaW5kZXggPSB+fmluZGV4OyAgLy8gQ29lcmNlIHRvIGludGVnZXIuXG4gIGlmIChpbmRleCA+PSBsZW4pIHJldHVybiBsZW5cbiAgaWYgKGluZGV4ID49IDApIHJldHVybiBpbmRleFxuICBpbmRleCArPSBsZW5cbiAgaWYgKGluZGV4ID49IDApIHJldHVybiBpbmRleFxuICByZXR1cm4gMFxufVxuXG5mdW5jdGlvbiBjb2VyY2UgKGxlbmd0aCkge1xuICAvLyBDb2VyY2UgbGVuZ3RoIHRvIGEgbnVtYmVyIChwb3NzaWJseSBOYU4pLCByb3VuZCB1cFxuICAvLyBpbiBjYXNlIGl0J3MgZnJhY3Rpb25hbCAoZS5nLiAxMjMuNDU2KSB0aGVuIGRvIGFcbiAgLy8gZG91YmxlIG5lZ2F0ZSB0byBjb2VyY2UgYSBOYU4gdG8gMC4gRWFzeSwgcmlnaHQ/XG4gIGxlbmd0aCA9IH5+TWF0aC5jZWlsKCtsZW5ndGgpXG4gIHJldHVybiBsZW5ndGggPCAwID8gMCA6IGxlbmd0aFxufVxuXG5mdW5jdGlvbiBpc0FycmF5IChzdWJqZWN0KSB7XG4gIHJldHVybiAoQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAoc3ViamVjdCkge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoc3ViamVjdCkgPT09ICdbb2JqZWN0IEFycmF5XSdcbiAgfSkoc3ViamVjdClcbn1cblxuZnVuY3Rpb24gaXNBcnJheWlzaCAoc3ViamVjdCkge1xuICByZXR1cm4gaXNBcnJheShzdWJqZWN0KSB8fCBCdWZmZXIuaXNCdWZmZXIoc3ViamVjdCkgfHxcbiAgICAgIHN1YmplY3QgJiYgdHlwZW9mIHN1YmplY3QgPT09ICdvYmplY3QnICYmXG4gICAgICB0eXBlb2Ygc3ViamVjdC5sZW5ndGggPT09ICdudW1iZXInXG59XG5cbmZ1bmN0aW9uIHRvSGV4IChuKSB7XG4gIGlmIChuIDwgMTYpIHJldHVybiAnMCcgKyBuLnRvU3RyaW5nKDE2KVxuICByZXR1cm4gbi50b1N0cmluZygxNilcbn1cblxuZnVuY3Rpb24gdXRmOFRvQnl0ZXMgKHN0cikge1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgYiA9IHN0ci5jaGFyQ29kZUF0KGkpXG4gICAgaWYgKGIgPD0gMHg3RilcbiAgICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpKVxuICAgIGVsc2Uge1xuICAgICAgdmFyIHN0YXJ0ID0gaVxuICAgICAgaWYgKGIgPj0gMHhEODAwICYmIGIgPD0gMHhERkZGKSBpKytcbiAgICAgIHZhciBoID0gZW5jb2RlVVJJQ29tcG9uZW50KHN0ci5zbGljZShzdGFydCwgaSsxKSkuc3Vic3RyKDEpLnNwbGl0KCclJylcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaC5sZW5ndGg7IGorKylcbiAgICAgICAgYnl0ZUFycmF5LnB1c2gocGFyc2VJbnQoaFtqXSwgMTYpKVxuICAgIH1cbiAgfVxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIGFzY2lpVG9CeXRlcyAoc3RyKSB7XG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIC8vIE5vZGUncyBjb2RlIHNlZW1zIHRvIGJlIGRvaW5nIHRoaXMgYW5kIG5vdCAmIDB4N0YuLlxuICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpICYgMHhGRilcbiAgfVxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIHV0ZjE2bGVUb0J5dGVzIChzdHIpIHtcbiAgdmFyIGMsIGhpLCBsb1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICBjID0gc3RyLmNoYXJDb2RlQXQoaSlcbiAgICBoaSA9IGMgPj4gOFxuICAgIGxvID0gYyAlIDI1NlxuICAgIGJ5dGVBcnJheS5wdXNoKGxvKVxuICAgIGJ5dGVBcnJheS5wdXNoKGhpKVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiBiYXNlNjRUb0J5dGVzIChzdHIpIHtcbiAgcmV0dXJuIGJhc2U2NC50b0J5dGVBcnJheShzdHIpXG59XG5cbmZ1bmN0aW9uIGJsaXRCdWZmZXIgKHNyYywgZHN0LCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgcG9zXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoKGkgKyBvZmZzZXQgPj0gZHN0Lmxlbmd0aCkgfHwgKGkgPj0gc3JjLmxlbmd0aCkpXG4gICAgICBicmVha1xuICAgIGRzdFtpICsgb2Zmc2V0XSA9IHNyY1tpXVxuICB9XG4gIHJldHVybiBpXG59XG5cbmZ1bmN0aW9uIGRlY29kZVV0ZjhDaGFyIChzdHIpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHN0cilcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoMHhGRkZEKSAvLyBVVEYgOCBpbnZhbGlkIGNoYXJcbiAgfVxufVxuXG4vKlxuICogV2UgaGF2ZSB0byBtYWtlIHN1cmUgdGhhdCB0aGUgdmFsdWUgaXMgYSB2YWxpZCBpbnRlZ2VyLiBUaGlzIG1lYW5zIHRoYXQgaXRcbiAqIGlzIG5vbi1uZWdhdGl2ZS4gSXQgaGFzIG5vIGZyYWN0aW9uYWwgY29tcG9uZW50IGFuZCB0aGF0IGl0IGRvZXMgbm90XG4gKiBleGNlZWQgdGhlIG1heGltdW0gYWxsb3dlZCB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gdmVyaWZ1aW50ICh2YWx1ZSwgbWF4KSB7XG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLCAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpXG4gIGFzc2VydCh2YWx1ZSA+PSAwLCAnc3BlY2lmaWVkIGEgbmVnYXRpdmUgdmFsdWUgZm9yIHdyaXRpbmcgYW4gdW5zaWduZWQgdmFsdWUnKVxuICBhc3NlcnQodmFsdWUgPD0gbWF4LCAndmFsdWUgaXMgbGFyZ2VyIHRoYW4gbWF4aW11bSB2YWx1ZSBmb3IgdHlwZScpXG4gIGFzc2VydChNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWUsICd2YWx1ZSBoYXMgYSBmcmFjdGlvbmFsIGNvbXBvbmVudCcpXG59XG5cbmZ1bmN0aW9uIHZlcmlmc2ludCAodmFsdWUsIG1heCwgbWluKSB7XG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLCAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpXG4gIGFzc2VydCh2YWx1ZSA8PSBtYXgsICd2YWx1ZSBsYXJnZXIgdGhhbiBtYXhpbXVtIGFsbG93ZWQgdmFsdWUnKVxuICBhc3NlcnQodmFsdWUgPj0gbWluLCAndmFsdWUgc21hbGxlciB0aGFuIG1pbmltdW0gYWxsb3dlZCB2YWx1ZScpXG4gIGFzc2VydChNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWUsICd2YWx1ZSBoYXMgYSBmcmFjdGlvbmFsIGNvbXBvbmVudCcpXG59XG5cbmZ1bmN0aW9uIHZlcmlmSUVFRTc1NCAodmFsdWUsIG1heCwgbWluKSB7XG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLCAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpXG4gIGFzc2VydCh2YWx1ZSA8PSBtYXgsICd2YWx1ZSBsYXJnZXIgdGhhbiBtYXhpbXVtIGFsbG93ZWQgdmFsdWUnKVxuICBhc3NlcnQodmFsdWUgPj0gbWluLCAndmFsdWUgc21hbGxlciB0aGFuIG1pbmltdW0gYWxsb3dlZCB2YWx1ZScpXG59XG5cbmZ1bmN0aW9uIGFzc2VydCAodGVzdCwgbWVzc2FnZSkge1xuICBpZiAoIXRlc3QpIHRocm93IG5ldyBFcnJvcihtZXNzYWdlIHx8ICdGYWlsZWQgYXNzZXJ0aW9uJylcbn1cblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJwQkd2QXBcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi9ub2RlX21vZHVsZXMvYnVmZmVyL2luZGV4LmpzXCIsXCIvLi4vbm9kZV9tb2R1bGVzL2J1ZmZlclwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbmV4cG9ydHMucmVhZCA9IGZ1bmN0aW9uIChidWZmZXIsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtXG4gIHZhciBlTGVuID0gbkJ5dGVzICogOCAtIG1MZW4gLSAxXG4gIHZhciBlTWF4ID0gKDEgPDwgZUxlbikgLSAxXG4gIHZhciBlQmlhcyA9IGVNYXggPj4gMVxuICB2YXIgbkJpdHMgPSAtN1xuICB2YXIgaSA9IGlzTEUgPyAobkJ5dGVzIC0gMSkgOiAwXG4gIHZhciBkID0gaXNMRSA/IC0xIDogMVxuICB2YXIgcyA9IGJ1ZmZlcltvZmZzZXQgKyBpXVxuXG4gIGkgKz0gZFxuXG4gIGUgPSBzICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpXG4gIHMgPj49ICgtbkJpdHMpXG4gIG5CaXRzICs9IGVMZW5cbiAgZm9yICg7IG5CaXRzID4gMDsgZSA9IGUgKiAyNTYgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cblxuICBtID0gZSAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBlID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBtTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IG0gPSBtICogMjU2ICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgaWYgKGUgPT09IDApIHtcbiAgICBlID0gMSAtIGVCaWFzXG4gIH0gZWxzZSBpZiAoZSA9PT0gZU1heCkge1xuICAgIHJldHVybiBtID8gTmFOIDogKChzID8gLTEgOiAxKSAqIEluZmluaXR5KVxuICB9IGVsc2Uge1xuICAgIG0gPSBtICsgTWF0aC5wb3coMiwgbUxlbilcbiAgICBlID0gZSAtIGVCaWFzXG4gIH1cbiAgcmV0dXJuIChzID8gLTEgOiAxKSAqIG0gKiBNYXRoLnBvdygyLCBlIC0gbUxlbilcbn1cblxuZXhwb3J0cy53cml0ZSA9IGZ1bmN0aW9uIChidWZmZXIsIHZhbHVlLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbSwgY1xuICB2YXIgZUxlbiA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIHJ0ID0gKG1MZW4gPT09IDIzID8gTWF0aC5wb3coMiwgLTI0KSAtIE1hdGgucG93KDIsIC03NykgOiAwKVxuICB2YXIgaSA9IGlzTEUgPyAwIDogKG5CeXRlcyAtIDEpXG4gIHZhciBkID0gaXNMRSA/IDEgOiAtMVxuICB2YXIgcyA9IHZhbHVlIDwgMCB8fCAodmFsdWUgPT09IDAgJiYgMSAvIHZhbHVlIDwgMCkgPyAxIDogMFxuXG4gIHZhbHVlID0gTWF0aC5hYnModmFsdWUpXG5cbiAgaWYgKGlzTmFOKHZhbHVlKSB8fCB2YWx1ZSA9PT0gSW5maW5pdHkpIHtcbiAgICBtID0gaXNOYU4odmFsdWUpID8gMSA6IDBcbiAgICBlID0gZU1heFxuICB9IGVsc2Uge1xuICAgIGUgPSBNYXRoLmZsb29yKE1hdGgubG9nKHZhbHVlKSAvIE1hdGguTE4yKVxuICAgIGlmICh2YWx1ZSAqIChjID0gTWF0aC5wb3coMiwgLWUpKSA8IDEpIHtcbiAgICAgIGUtLVxuICAgICAgYyAqPSAyXG4gICAgfVxuICAgIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgdmFsdWUgKz0gcnQgLyBjXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlICs9IHJ0ICogTWF0aC5wb3coMiwgMSAtIGVCaWFzKVxuICAgIH1cbiAgICBpZiAodmFsdWUgKiBjID49IDIpIHtcbiAgICAgIGUrK1xuICAgICAgYyAvPSAyXG4gICAgfVxuXG4gICAgaWYgKGUgKyBlQmlhcyA+PSBlTWF4KSB7XG4gICAgICBtID0gMFxuICAgICAgZSA9IGVNYXhcbiAgICB9IGVsc2UgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICBtID0gKHZhbHVlICogYyAtIDEpICogTWF0aC5wb3coMiwgbUxlbilcbiAgICAgIGUgPSBlICsgZUJpYXNcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IHZhbHVlICogTWF0aC5wb3coMiwgZUJpYXMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gMFxuICAgIH1cbiAgfVxuXG4gIGZvciAoOyBtTGVuID49IDg7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IG0gJiAweGZmLCBpICs9IGQsIG0gLz0gMjU2LCBtTGVuIC09IDgpIHt9XG5cbiAgZSA9IChlIDw8IG1MZW4pIHwgbVxuICBlTGVuICs9IG1MZW5cbiAgZm9yICg7IGVMZW4gPiAwOyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBlICYgMHhmZiwgaSArPSBkLCBlIC89IDI1NiwgZUxlbiAtPSA4KSB7fVxuXG4gIGJ1ZmZlcltvZmZzZXQgKyBpIC0gZF0gfD0gcyAqIDEyOFxufVxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcInBCR3ZBcFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uL25vZGVfbW9kdWxlcy9pZWVlNzU0L2luZGV4LmpzXCIsXCIvLi4vbm9kZV9tb2R1bGVzL2llZWU3NTRcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5wcm9jZXNzLm5leHRUaWNrID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2FuU2V0SW1tZWRpYXRlID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cuc2V0SW1tZWRpYXRlO1xuICAgIHZhciBjYW5Qb3N0ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cucG9zdE1lc3NhZ2UgJiYgd2luZG93LmFkZEV2ZW50TGlzdGVuZXJcbiAgICA7XG5cbiAgICBpZiAoY2FuU2V0SW1tZWRpYXRlKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gd2luZG93LnNldEltbWVkaWF0ZShmKSB9O1xuICAgIH1cblxuICAgIGlmIChjYW5Qb3N0KSB7XG4gICAgICAgIHZhciBxdWV1ZSA9IFtdO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgdmFyIHNvdXJjZSA9IGV2LnNvdXJjZTtcbiAgICAgICAgICAgIGlmICgoc291cmNlID09PSB3aW5kb3cgfHwgc291cmNlID09PSBudWxsKSAmJiBldi5kYXRhID09PSAncHJvY2Vzcy10aWNrJykge1xuICAgICAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGlmIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmbiA9IHF1ZXVlLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgIGZuKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0cnVlKTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgICAgIHF1ZXVlLnB1c2goZm4pO1xuICAgICAgICAgICAgd2luZG93LnBvc3RNZXNzYWdlKCdwcm9jZXNzLXRpY2snLCAnKicpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICBzZXRUaW1lb3V0KGZuLCAwKTtcbiAgICB9O1xufSkoKTtcblxucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59XG5cbi8vIFRPRE8oc2h0eWxtYW4pXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJwQkd2QXBcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzXCIsXCIvLi4vbm9kZV9tb2R1bGVzL3Byb2Nlc3NcIikiXX0=
