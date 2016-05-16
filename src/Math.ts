export class Vec3 {
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

export class PolarCoordinate {
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