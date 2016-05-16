import {Router} from './Router';
import {PolarCoordinate} from './Math';
import {RouteingPoint} from './RouteingPoint';

//Helper function to parse data
export function parse (text: string) {
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