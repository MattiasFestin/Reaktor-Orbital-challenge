var epsilon = 0.01;

//[TODO] - Inline and unrole optimize for 3d case.
class Vec3 {
    private value: Float32Array;
    
    constructor(arr: number[]) {
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
    public getX () {
        return this.value[0];
    };

    public getY () {
        return this.value[1];
    };

    public getZ () {
        return this.value[2];
    };
    
    public add (w: Vec3) {
        var v = this;
        return new Vec3([
            this.getX() + w.getX(),
            this.getY() + w.getY(),
            this.getZ() + w.getZ(),
        ]);
    }
    
    public neg () {
        var v = this;
        return new Vec3([ 
            -this.getX(),
            -this.getY(),
            -this.getZ()
        ]);
    }
    
    public sub (w: Vec3) {
        var v = this;
        return new Vec3([
            v.getX() - w.getX(),
            v.getY() - w.getY(),
            v.getZ() - w.getZ()
        ]);
    }
    
    public scale (a: number) {
        var v = this;
        return new Vec3([
            a * v.getX(),
            a * v.getY(),
            a * v.getZ()
        ]);
    }
    
    public dot (w: Vec3) {
        var v = this;
        return v.getX() * w.getX() + v.getY() * w.getY() + v.getZ() * w.getZ();
    }
    
    public len() {
        return Math.sqrt(this.dot(this));
    }
    
    public norm () {
        var len = this.len();
        return len === 0 ? this : this.scale(1 / len);
    }

    public cross (w: Vec3) {
        var v = this;
        return new Vec3([
            v.getY() * w.getZ() - v.getZ() * w.getY(),
            v.getZ() * w.getX() - v.getX() * w.getZ(),
            v.getX() * w.getY() - v.getY() * w.getX()
        ]);
    }
    
    public distance(w: Vec3) {
        var v = this;
        return Math.sqrt(
            Math.pow(v.getX() - w.getX(), 2) +
            Math.pow(v.getY() - w.getY(), 2) +
            Math.pow(v.getZ() - w.getZ(), 2)
        );
    }
    
    public toString() {
        return `${this.getX()},${this.getY()},${this.getZ()}`;
    }
}

class Line {
    public o: Vec3;
    public d: Vec3;

    constructor(o: Vec3, d: Vec3) {
        this.o = o;
        this.d = d.norm();
    }
    
    public getPoint (distance: number) {
        return this.o.add(this.d.scale(distance));
    }
}

class Sphere {
    public o: Vec3;
    public r: number;

    constructor(o: Vec3, r: number) {
        this.o = o;
        this.r = r;
    }
    
    public pointOnSphere (p: Vec3) {
        return Math.abs(p.distance(this.o) - this.r) < epsilon;
    }
    
    public normal (p: Vec3) {
        return new Vec3([
            (p.getX() - this.o.getX()) / this.r,
            (p.getY() - this.o.getY()) / this.r,
            (p.getZ() - this.o.getZ()) / this.r
        ]);
    }
    
    public intersect (l: Line) {
        var q = l.d.dot(l.o.sub(this.o)),
            t = Math.pow(q, 2) - Math.pow(l.o.distance(this.o), 2) + Math.pow(this.r, 2);
            
        if (t < 0 || (typeof t === 'number' && isNaN(t))) {
            return [];
        } else if (t === 0) {
            var x = l.getPoint(-q);
            
            if (!this.pointOnSphere(x)) {
                throw new Error(`Solution points ${x} not on sphere.`);
            }

            return [x]; //One solution (Two points at same postion that tangent the sphere)
        } else {
            t = Math.sqrt(t);

            var x0 = l.getPoint(-q - t),
                x1 = l.getPoint(-q + t);

            if (!this.pointOnSphere(x0)) {
                throw new Error(`Solution ${x0} point not on sphere.`);
            }

            if (!this.pointOnSphere(x1)) {
                throw new Error(`Solution ${x1} point not on sphere.`);
            }

            return [x0, x1]; //Two unique solutions   
        }
    }
}

class PolarCoordinate {
    public lat: number;
    public lon: number;
    public alt: number;
    
    constructor (lat: number, lon: number, alt: number) {
        this.lat = Math.PI * lat / 180;
        this.lon = Math.PI * lon / 180;
        this.alt = alt;
    }
    
    public convert() {
        return new Vec3([
            this.alt * Math.cos(this.lat) * Math.cos(this.lon),
            this.alt * Math.cos(this.lat) * Math.sin(this.lon),
            this.alt * Math.sin(this.lat)
        ]);
    }
} 

class RountingPointPairs {
    public source: RouteingPoint;
    public target: RouteingPoint;
    public distance: number;
    
    constructor (source: RouteingPoint, target: RouteingPoint) {
        this.source = source;
        this.target = target;
        this.distance = this.source.position.distance(this.target.position);
    }
}

class RouteingPoint {
    public name: string;
    public position: Vec3;
    
    //Satelites in view from this one
    public availiableRoutingPoints: RountingPointPairs[];
    
    constructor(name: string, polarCoord: PolarCoordinate) {
        this.name = name;
        this.position = polarCoord.convert();
    }
}
interface IAnswer {
    distance: number,
    path: string[],
    pathPos: Vec3[]
}
class Router {
    public routes: RouteingPoint[];
    public earth: Sphere;
    
    constructor (routes: RouteingPoint[]) {
        this.earth = new Sphere(new Vec3([0, 0, 0]), 6371);
        
        this.routes = routes
            .map(s => {
                s.availiableRoutingPoints = s.availiableRoutingPoints || [];
                if (['start', 'end'].indexOf(s.name) === -1) {
                    s.availiableRoutingPoints = routes
                        .filter(q => {
                            return q !== s && 
                                ['start', 'end'].indexOf(q.name) === -1 &&
                                this.earth.intersect(new Line(s.position, q.position.sub(s.position))).length === 0; //Is not self and does not intersect earth 
                        })
                        .map(x => new RountingPointPairs(s, x))
                        //Remove duplicates
                        .filter(x => s.availiableRoutingPoints.indexOf(x) === -1)
                        //Order by distance
                        .sort((a, b) => a.distance - b.distance);
                } else {
                    //Start and end points will intersect below (behind?) the point
                    // We must check the surface normal the direction if it is infront of the point
                    var surfaceNormal = this.earth.normal(s.position);
                    
                    s.availiableRoutingPoints = s.availiableRoutingPoints.concat(
                        routes
                        .filter(q => {
                            var dot = q.position.sub(s.position).norm().dot(surfaceNormal);
                            return q !== s && 
                                dot > 0 
                        })
                        .map(x => new RountingPointPairs(s, x))
                        //Remove duplicates
                        .filter(x => s.availiableRoutingPoints.indexOf(x) === -1)
                        //Order by distance
                        .sort((a, b) => a.distance - b.distance)
                    );

                    //We want symetric relations
                    s.availiableRoutingPoints.forEach(q => {
                        q.target.availiableRoutingPoints = q.target.availiableRoutingPoints || [];
                        if (q.target.availiableRoutingPoints.every(r => r.target !== q.source)) {
                            q.target.availiableRoutingPoints.push(new RountingPointPairs(q.target, q.source));
                        }
                    });   
                }
                
                return s; 
            });
    }
    
    public route (start: RouteingPoint, end: RouteingPoint): IAnswer {
        var len = this.routes.length;

        var path: string[] = [];
        var pathPos: Vec3[] = [];
        var distance = 0;
        
         var recursiveDecent = function (node: RouteingPoint, finish: RouteingPoint, answer: IAnswer, visited: RountingPointPairs[]  = []): IAnswer {
            
            var availiableRoutingPoints = node.availiableRoutingPoints.filter(x => visited.indexOf(x) === -1);

            if (availiableRoutingPoints.length === 0 || visited.length > 6) {
                return {
                    distance: Infinity,
                    path: ['NO_SOLUTION'],
                    pathPos: []
                };
            } else if (availiableRoutingPoints.map(x => x.target).indexOf(finish) > -1) {
                //[We are done]
                return {
                    distance: answer.distance,
                    path: answer.path.concat([node.name, finish.name]),
                    pathPos: answer.pathPos.concat([node.position, finish.position])
                };
            } else {
                var paths = availiableRoutingPoints
                    //Prevent backtracking
                    .filter(n => answer.path.indexOf(n.source.name) === -1)
                    //Recursive decent down child nodes
                    .map(n => recursiveDecent(
                            n.target,
                            finish,
                            {
                                distance: answer.distance + n.distance,
                                path: answer.path.concat([n.source.name]),
                                pathPos: answer.pathPos.concat([n.source.position])
                            },
                            visited.concat([n])
                        )
                    )
                    //We only want solutions
                    .filter(n => n && n.distance !== Infinity);

                var best = paths.sort((a, b) => a.distance - b.distance)[0];
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
    }
    
    private minimum (arr: number[]) {
        var minIndex = 0,
            minValue = arr[0];

        arr.forEach((x, i) => {
            if (arr[i] < minValue) {
                minIndex = i;
                minValue = arr[i];
            }
        });
        
        return {
            index: minIndex,
            value: minValue
        };
    }
}

//Helper function to parse data
var parse = function parseFn (text: string) {
    var result;
    var rows = text
        .split(/[\r\n]+/);
    
    var routeingPoints = rows
        .filter((x, i) => i > 0 && i < rows.length - 1)
        .map(row => {
            var values = row.split(',');
            
            return new RouteingPoint(values[0], new PolarCoordinate(+values[1], +values[2], +values[3] + 6371));
        });
    var earthPoints = rows[rows.length-1].split(',');
    
    //[NOTE] - Add one to earth radious for altidude, to prevent to tangent intersection with sphere
    var start = new RouteingPoint('start', new PolarCoordinate(+earthPoints[1], +earthPoints[2], 6371));
    var end = new RouteingPoint('end', new PolarCoordinate(+earthPoints[3], +earthPoints[4], 6371));
    
    //Add start and end to routeingPoints
    routeingPoints.unshift(start);
    routeingPoints.push(end);
    
    var router = new Router(routeingPoints);

    var answer = router.route(start, end);
    
    
    var retVal =  {
        seed: rows[0],
        routeingPoints: routeingPoints.map(x => {
            return {
                name: x.name,
                position: x.position,
                availiableRoutingPoints: x.availiableRoutingPoints.map(y => {
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
            availiableRoutingPoints: start.availiableRoutingPoints.map(y => {
                return {
                    name: y.target.name,
                    position: y.target.position
                };
            })
        },
        end: {
            name: end.name,
            position: end.position,
            availiableRoutingPoints: end.availiableRoutingPoints.map(y => {
                return {
                    name: y.target.name,
                    position: y.target.position
                };
            })
        },
        answer
    };
    
    console.log('result:', retVal);
    
    return retVal;
};

interface Window {
    result: any;
    fetch: (url: string) => any;
}

window.result = window.fetch('https://space-fast-track.herokuapp.com/generate')
    .then(x => x.text())
    .then(x => parse(x));