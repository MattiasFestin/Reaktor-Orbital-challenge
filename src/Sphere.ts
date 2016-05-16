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

export class Sphere {
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