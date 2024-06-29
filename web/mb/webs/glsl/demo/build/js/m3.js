(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD.Register as an anonymous module.
        define([], factory);
    } else {
        // Browser globals
        root.m3 = factory();
    }
} (this, function() {
    "use strict";


    function multiply(a,b) {
        // line 0
        var a00 = a[0 * 3  + 0];// a0
        var a01 = a[0 * 3  + 1];// a1
        var a02 = a[0 * 3  + 2];// a2
        // line 1
        var a10 = a[1 * 3  + 0];// a3
        var a11 = a[1 * 3  + 1];// a4
        var a12 = a[1 * 3  + 2];// a5
        // line 2
        var a20 = a[2 * 3  + 0];// a6
        var a21 = a[2 * 3  + 1];// a7
        var a22 = a[2 * 3  + 2];// a8

        // line 0
        var b00 = b[0 * 3  + 0];
        var b01 = b[0 * 3  + 1];
        var b02 = b[0 * 3  + 2];
        // line 1
        var b10 = b[1 * 3  + 0];
        var b11 = b[1 * 3  + 1];
        var b12 = b[1 * 3  + 2];
        // line 2
        var b20 = b[2 * 3  + 0];
        var b21 = b[2 * 3  + 1];
        var b22 = b[2 * 3  + 2];

        return [
            b00 * a00 + b01 * a10 + b02 * a20,
            b00 * a01 + b01 * a11 + b02 * a21,
            b00 * a02 + b01 * a12 + b02 * a22,
            b10 * a00 + b11 * a10 + b12 * a20,
            b10 * a01 + b11 * a11 + b12 * a21,
            b10 * a02 + b11 * a12 + b12 * a22,
            b20 * a00 + b21 * a10 + b22 * a20,
            b20 * a01 + b21 * a11 + b22 * a21,
            b20 * a02 + b21 * a12 + b22 * a22
        ];
    }

    function projection(width, height) {
        // Note: This matrix flips the Y axis so 0 is at the top.
        return [
            2 / width, 0, 0,
            0, -2 / height, 0,
            -1, 1, 1
        ];
    }

    function project(m, width, height) {
        return multiply(m, projection(width, height));
    }

    /**
     * Creates a 2D translation matrix
     * @param tx
     * @param ty
     * @returns {[number,number,number,number,number,number,null,null,number]}
     */
    function translation(tx, ty) {
        return [
            1, 0, 0,
            0, 1, 0,
            tx, ty, 1
        ];
    }

    function translate(m, tx, ty) {
        return multiply(m, translation(tx, ty));
    }

    /**
     * Creates a 2D rotation matrix
     * @param angleInRadians
     * @returns {[null,null,number,null,null,number,number,number,number]}
     */
    function rotation(angleInRadians) {
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);
        return [
            c, -s, 0,
            s, c, 0,
            0, 0, 1
        ];
    }

    function rotate(m, angleInRadians) {
        return multiply(m, rotation(angleInRadians));
    }

    /**
     * Creates a 2D scaling matrix
     * @param sx
     * @param sy
     * @returns {[null,number,number,number,null,number,number,number,number]}
     */
    function scaling(sx, sy) {
        return [
            sx, 0, 0,
            0, sy, 0,
            0, 0, 1
        ];
    }

    function scale(m ,sx, sy) {
        return multiply(m, scaling(sx, sy));
    }

    return {
        multiply: multiply,
        projection: projection,
        project: project,
        translation: translation,
        translate: translate,
        rotation: rotation,
        rotate: rotate,
        scaling: scaling,
        scale: scale
    };


}));