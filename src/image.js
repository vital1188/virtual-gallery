// src/image.js
'use strict';

const api = require('../api/api');
const selectedApi = new URLSearchParams(window.location.search).get("api");
const dataAccess = api[selectedApi] || api[api.default];
const text = require('./text');

let paintingCache = {};
let unusedTextures = [];

const dynamicQualThreshold = 2;
function dynamicQual(quality) {
    if (!navigator.connection || navigator.connection.downlink < dynamicQualThreshold) {
        quality = (quality === 'high') ? 'mid' : 'low';
    }
    return quality;
}

const emptyImage = (regl) => [
    (unusedTextures.pop() || regl.texture)([[[200, 200, 200]]]),
    _ => (unusedTextures.pop() || regl.texture)([[[0, 0, 0, 0]]]),
    1
];

// Load image from Cloudinary URL
async function loadImage(regl, p, res) {
    let image, title;
    try {
        const data = await dataAccess.fetchImage(p, dynamicQual(res));
        title = data.title;
        image = data.image; // Cloudinary URL

        // Create a new Image element
        const img = new Image();
        img.crossOrigin = 'anonymous'; // Enable CORS if needed
        img.src = image;
        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
        });

        return [
            (unusedTextures.pop() || regl.texture)({
                data: img,
                min: 'mipmap',
                mipmap: 'nice',
                flipY: true
            }),
            width => text.init((unusedTextures.pop() || regl.texture)(), title, width),
            img.width / img.height
        ];
    } catch (e) {
        console.error(e);
        return res === "high" ? await loadImage(regl, p, "mid") : emptyImage(regl);
    }
}

module.exports = {
    fetch: (regl, count = 10, res = "low", cbOne, cbAll) => {
        const from = Object.keys(paintingCache).length;
        dataAccess.fetchList(from, count).then(paintings => {
            count = paintings.length;
            paintings.map(p => {
                if (paintingCache[p.image_id]) {
                    if (--count === 0)
                        cbAll();
                    return;
                }
                paintingCache[p.image_id] = p;
                loadImage(regl, p, res).then(([tex, textGen, aspect]) => {
                    cbOne({ ...p, tex, textGen, aspect });
                    if (--count === 0)
                        cbAll();
                });
            })
        });
    },
    load: (regl, p, res = "low") => {
        if (p.tex || p.loading)
            return;
        p.loading = true;
        loadImage(regl, p, res).then(([tex, textGen]) => {
            p.loading = false;
            p.tex = tex;
            p.text = textGen(p.width);
        });
    },
    unload: (p) => {
        if (p.tex) {
            unusedTextures.push(p.tex);
            p.tex = undefined;
        }
        if (p.text) {
            unusedTextures.push(p.text);
            p.text = undefined;
        }
    }
};
