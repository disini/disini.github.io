
// class TriangleIntersection {
//     b0: Number;

// };

// ShapeIntersection Definition
class ShapeIntersection {
    // intr: SurfaceInteraction;
    // tHit: number;
    // string toString() {
    //     return 'ShapeIntersection
    // }
}

class Point3f {
    hasNaN(): boolean { return false; }
}

class Vector3f {
    hasNaN(): boolean { return false; }
}

class Ray {
    // Ray Public Members
    o: Point3f | null = null;
    d: Vector3f | null = null;
    time: number = 0;
    //medium: Medium;

    constructor(o: Point3f, d: Vector3f, time: number) { 
    }

    hasNaN(): boolean { 
        return ((this.o != null && this.o.hasNaN()) || (this.d != null  && this.d.hasNaN())); 
    }

    //Point3f operator()(Float t) const { return o + d * t; }
}

class Triangle {

    meshIndex: number = -1
    triIndex: number = -1;

    Intersect(ray: Ray, tMax: Number): ShapeIntersection | null {
        return null;
    }
}

export { Triangle }
