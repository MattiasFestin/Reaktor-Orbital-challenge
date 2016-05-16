import {Vec3} from './Math';

const epsilon = 0.01;

export class Line {
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