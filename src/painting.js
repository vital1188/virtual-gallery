'use strict';

const text = require('./text');

module.exports = (regl) => {
    const drawText = text.draw(regl);
    const painting = regl({
        frag: `
        precision lowp float;
        uniform sampler2D tex;
        varying vec3 uv;

        // ... existing fragment shader code ...
        void main () {
            // ... existing shader logic ...
        }`,
        vert: `
        precision highp float;
        uniform mat4 proj, view, model;
        uniform float yScale;
        attribute vec3 pos;
        varying vec3 uv;
        void main () {
            uv = pos;
            vec4 mpos = model * vec4(pos, 1);
            mpos.y *= yScale;
            gl_Position = proj * view * mpos;
        }`,
        attributes: {
            pos: [
                0, 0, 1, // Front
                1, 0, 1,
                0, 1, 1,
                1, 1, 1,
                0, 0, 0, // Contour
                1, 0, 0,
                0, 1, 0,
                1, 1, 0,
                -0.1, -0.1, 0, // Shadow
                1.1,  -0.1, 0,
                -0.1,  1.1, 0,
                1.1,   1.1, 0
            ]
        },
        // ... existing REGL configurations ...

        elements: [
            0, 1, 2, 3, 2, 1, // Front
            1, 0, 5, 4, 5, 0, // Contour
            3, 1, 7, 5, 7, 1,
            0, 2, 4, 6, 4, 2,
            8,  9,  4, 5, 4, 9, // Shadow
            9,  11, 5, 7, 5, 11,
            11, 10, 7, 6, 7, 10,
            10, 8,  6, 4, 6, 8,
        ],

        uniforms: {
            model: regl.prop('model'),
            tex: regl.prop('tex')
        },
        blend: {
            enable: true,
            func: {
                srcRGB: 'src alpha',
                srcAlpha: 'one minus src alpha',
                dstRGB: 'one minus src alpha',
                dstAlpha: 1
            },
            color: [0, 0, 0, 0]
        }
    });

    return function (batch) {
        batch.forEach(paintingInstance => {
            painting(paintingInstance);
            if (paintingInstance.text) {
                drawText(paintingInstance);
            }
        });
    }
};
