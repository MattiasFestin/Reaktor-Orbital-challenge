import  {Vec3, PolarCoordinate} from './Math';

export class RouteingPoint {
    public name: string;
    public position: Vec3;
    
    //Satelites in view from this one
    public availiableRoutingPoints: RountingPointPairs[];
    
    constructor(name: string, polarCoord: PolarCoordinate) {
        this.name = name;
        this.position = polarCoord.convert();
    }
}

export class RountingPointPairs {
    public source: RouteingPoint;
    public target: RouteingPoint;
    public distance: number;
    
    constructor (source: RouteingPoint, target: RouteingPoint) {
        this.source = source;
        this.target = target;
        this.distance = this.source.position.distance(this.target.position);
    }
}