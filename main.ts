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
        return Math.abs(p.distance(this.o) - this.r) < 0.01;
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
        this.lat = lat;
        this.lon = lon;
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
    public visited: boolean;
    
    constructor (source: RouteingPoint, target: RouteingPoint) {
        this.source = source;
        this.target = target;
        this.distance = this.source.position.distance(this.target.position);
        this.visited = false;
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

class Router {
    public routes: RouteingPoint[];
    public earth: Sphere;
    
    constructor (routes: RouteingPoint[]) {
        this.earth = new Sphere(new Vec3([0, 0, 0]), 6371);
        this.routes = routes
            .map(s => {
                s.availiableRoutingPoints = routes
                    .filter(q => {
                        debugger;
                        return q !== s && 
                            this.earth.intersect(new Line(s.position, q.position)).length === 0; //Is not self and does not intersect earth 
                    })
                    .map(x => new RountingPointPairs(s, x))
                    //Order by distance
                    .sort((a, b) => a.distance - b.distance);
                
                return s; 
            });
    }
    
    public route (start: RouteingPoint, end: RouteingPoint) {
        interface IAnswer {
            distance: number,
            path: string[]
        }
        var recursiveDecent = (node: RouteingPoint, finish: RouteingPoint, distance: number, path: string[], /*visited: RouteingPoint[],*/ deepth = 0): IAnswer => {
            console.log('Walking: ', deepth, path, distance);
            debugger;
            if (node.availiableRoutingPoints.length === 0 || deepth > 21) {
                return {
                    distance: Infinity,
                    path: ['NO_SOLUTION']
                };
            } else if (node.availiableRoutingPoints.map(x => x.target).indexOf(finish) > -1) {
                return {
                    distance,
                    path
                };
            } else {
                var paths = node.availiableRoutingPoints
                    //Prevent backtracking
                    // .filter(n => visited.indexOf(n.source) === -1)
                    //Recursive decent down child nodes
                    .map(n => recursiveDecent(
                        n.target,
                        finish,
                        distance + n.distance,
                        path.concat([',' + n.source.name]),
                        // visited.concat([n.source]),
                        deepth + 1)
                    )
                    //We only want solutions
                    .filter(n => n && n.distance !== Infinity);
                var best = paths.sort((a, b) => a.distance - b.distance)[0];
                return best;
            }
        };
        
        //Walk the tree
        return {
            startToEnd: recursiveDecent(start, end, 0, [])
            // endToStart: recursiveDecent(end, start, 0, '', [])
        };

        // //////////////////////////////////////////////////////
        // //Perform Dijkstra's algorithm to find shortest path//
        // //////////////////////////////////////////////////////
        // var dist: number[] = [],
        //     prev: RouteingPoint[] = [],
        //     currentNode: RouteingPoint = start,
        //     currentNodeIndex: number = 0;

        // var routes = this.routes.slice();//[start].concat(this.routes.slice().concat([end]));

        // var i = routes.length;
        // while (i--) {
        //     dist[i] = Infinity;
        // }
        
        // //Distance from source to source
        // dist[0] = 0;

        // //Go through all routes
        // while (routes.length > 0) {
        //     //Find the best current solution
        //     var minimum = this.minimum(dist);
        //     currentNodeIndex = minimum.index;
        //     currentNode = routes[currentNodeIndex];

        //     //Remove current node from nodes to visit
        //     routes.splice(currentNodeIndex, 1);
            
        //     if (currentNode.availiableRoutingPoints.filter(x => x.target === end).length > 0) {
        //         break;
        //     }

        //     //Check all availiable routeing options
        //     currentNode.availiableRoutingPoints.forEach(rp => {           
        //         var rpi = routes.indexOf(rp.target),
        //             altRoute = dist[currentNodeIndex] + rp.distance;

        //         //Do not route to previous node
        //         if (altRoute < dist[rpi] && prev.indexOf(currentNode) === -1) {
        //             //A better solution is found
        //             dist[rpi] = altRoute;
        //             prev[rpi] = currentNode;
        //         }
        //     });
        // }
        
        // //Print solution
        // return (prev.map(x => x.name).join(',') + ',end').replace(/[,]{2,}/, ',');
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
    
    // //[TODO] - Mutating operation yuck!
    // public calculateSatelitesInSight(point: RouteingPoint, finish: boolean = false) {
    //     var sphereNorm = new Vec3([
    //         (point.position.getX() - this.earth.o.getX()) / this.earth.r,
    //         (point.position.getY() - this.earth.o.getY()) / this.earth.r,
    //         (point.position.getZ() - this.earth.o.getZ()) / this.earth.r
    //     ]).norm(); //Is norm() nessesary?
        
    //     point.availiableRoutingPoints = this.routes
    //         .filter(s => {
    //             var dir = point.position.sub(s.position),
    //                 projection = sphereNorm.dot(dir);
                
    //             //Check if satelite is infront of point
    //             return projection > 0;
    //         })
    //         .map(x => new RountingPointPairs(point, x))
    //         //Order by distance
    //         .sort((a, b) => a.distance - b.distance);

    //     if (finish) {
    //         //Push finish point to availiable satelites
    //         point.availiableRoutingPoints.forEach(s => {
    //             s.target.availiableRoutingPoints.push(new RountingPointPairs(s.target, point));
    //         })
    //     }
    // }
}

//Helper function to parse data
var parse = function parseFn (text: string) {
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
    var start = new RouteingPoint('start', new PolarCoordinate(+earthPoints[1], +earthPoints[2], 6371 + 1));
    var end = new RouteingPoint('end', new PolarCoordinate(+earthPoints[3], +earthPoints[4], 6371 + 1));
    
    //Add start and end to routeingPoints
    routeingPoints.unshift(start);
    routeingPoints.push(end);
    
    var router = new Router(routeingPoints);

    debugger;
   
    var answer = router.route(start, end);
    
    return {
        seed: rows[0],
        routeingPoints,
        start,
        end,
        answer
    };
};

console.log(parse(`#SEED: 0.6406132066622376
SAT0,-12.752978073576813,-38.459835664474866,476.11595241230634
SAT1,9.137708140810702,146.724861469646,692.8839852848683
SAT2,-87.91582130168631,20.118890658833152,652.6966055853943
SAT3,-63.482122579774185,-97.02949930701918,372.5560959426753
SAT4,-64.8749607523745,-129.81032045366118,376.2082797552578
SAT5,-52.89621407958349,13.297045107830286,642.8950339513227
SAT6,0.06320486725917362,-41.960809561478726,303.50665475978883
SAT7,-2.45765257648236,-157.27289445525898,425.4054242496205
SAT8,-74.48190988018436,-135.06024501334292,647.7949557660236
SAT9,56.58569976989324,125.10421262046322,322.8917083572893
SAT10,-10.13989581599732,-114.58997718948993,443.43125737972787
SAT11,17.567958809905107,77.00163611907965,321.5846109304707
SAT12,-50.42901279757053,-98.19389457677124,676.986824909667
SAT13,-86.86558372808352,17.04040357346784,658.1841721192698
SAT14,-8.728362869656593,123.65442836770808,359.6143859833128
SAT15,-27.08120203571915,70.63272824697782,545.4746389023945
SAT16,85.73378039587072,-107.1802830673495,557.7640590883564
SAT17,3.8144139889046897,100.12277805642088,466.47259197759024
SAT18,24.240449600987944,48.95267766906616,498.06060346346476
SAT19,41.283418855611416,91.59438506862313,494.809742807162
ROUTE,-24.01928792313204,49.827352706410636,73.58389143904424,-116.36499415382366`));

// var result = parse(`#SEED: 0.6591764106415212
// SAT0,15.752300450590766,138.68135162364683,677.7937179822312
// SAT1,-10.094046838689223,-165.16477962972232,445.6292671459687
// SAT2,-13.792456953773936,24.652594881111924,699.7247401452709
// SAT3,-29.386368291304294,-32.61201393914632,346.50752024274743
// SAT4,-77.58660413274337,-24.51436513731906,356.7876751507189
// SAT5,-57.945859959487755,-174.05559188893977,454.96556100965154
// SAT6,55.81334836859526,155.42372760634942,450.018326216201
// SAT7,41.18442985479217,172.54380983126612,580.9984670576443
// SAT8,0.1818460920082572,109.52065065607445,472.5471728259654
// SAT9,47.90335216697443,-156.2438642507256,420.1022864925314
// SAT10,-15.985868113455012,109.34170239086717,485.75313411402766
// SAT11,-13.95865096056778,34.94713076250508,314.86507261791735
// SAT12,31.42393119952945,170.19228362158617,349.42033898532424
// SAT13,-88.457757176745,-0.9419029905043601,693.0745212399682
// SAT14,-54.564080794572696,62.11402511800165,652.3051799074756
// SAT15,25.50798081445953,91.58631047933466,588.1137235095227
// SAT16,-25.909006704530512,89.51154054006804,568.5813114812387
// SAT17,72.10795014052488,-173.05663459973817,444.3634238833925
// SAT18,36.645721264082695,-21.544161616075826,325.8089506416442
// SAT19,85.14160037145811,-78.35411100360866,315.6457764702074
// ROUTE,-74.53533741135584,-44.037783520205465,76.86985102455742,76.45598654881007`);

debugger;
console.log(result);