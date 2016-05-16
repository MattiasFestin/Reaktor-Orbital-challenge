import {Vec3, PolarCoordinate} from './Math';
import {RouteingPoint, RountingPointPairs} from './RouteingPoint';
import {Sphere, Line} from './3dStuff';

interface IAnswer {
    distance: number,
    path: string[],
    pathPos: Vec3[]
}

export class Router {
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

            if (availiableRoutingPoints.length === 0 || visited.length > len) {
                return {
                    distance: Infinity,
                    path: ['NO_SOLUTION'],
                    pathPos: []
                };
            } else if (availiableRoutingPoints.map(x => x.target).indexOf(finish) > -1) {
                //We are done for this path.
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