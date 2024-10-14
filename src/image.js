'use strict';

const api = require('../api/api');
const selectedApi = new URLSearchParams(window.location.search).get("api");
const dataAccess = api[selectedApi] || api[api.default];
const text = require('./text');

let paintingCache = {};
let unusedTextures = [];

const dynamicQualThreshold = 2;
function dynamicQual(quality) {
    if(!navigator.connection || navigator.connection.downlink < dynamicQualThreshold) {
        quality = (quality == 'high') ? 'mid' : 'low';
    }
    return quality;
}

const resizeCanvas = document.createElement('canvas');
resizeCanvas.width = resizeCanvas.height = 2048;
const ctx = resizeCanvas.getContext('2d');
ctx.mozImageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
let aniso = false;

const emptyImage = (regl) => [
    (unusedTextures.pop() || regl.texture)([[[200, 200, 200]]]),
    _=>(unusedTextures.pop() || regl.texture)([[[0, 0, 0, 0]]]),
    1
];

/**
 * Load an image and prepare textures.
 * @param {Object} regl - REGL instance.
 * @param {Object} p - Painting object.
 * @param {string} res - Resolution ('low', 'mid', 'high').
 * @returns {Promise<Array>} - Array containing textures and aspect ratio.
 */
async function loadImage(regl, p, res) {
    if (aniso === false) {
        aniso = regl.hasExtension('EXT_texture_filter_anisotropic') ? regl._gl.getParameter(
            regl._gl.getExtension('EXT_texture_filter_anisotropic').MAX_TEXTURE_MAX_ANISOTROPY_EXT
        ) : 0;
        console.log(`Anisotropic Filtering Level: ${aniso}`);
    }
    
    let image, title;
    try {
        const data = await dataAccess.fetchImage(p, dynamicQual(res));
        title = data.title;
        // Resize image to a power of 2 to use mipmap (faster than createImageBitmap resizing)
        image = await createImageBitmap(data.image);
        ctx.drawImage(image, 0, 0, resizeCanvas.width, resizeCanvas.height);
    } catch(e) {
        // Try again with a lower resolution, otherwise return an empty image
        console.error(`Error loading image "${p.title}":`, e);
        return res === "high" ? await loadImage(regl, p, "mid") : await loadImage(regl, p, "low");
    }

    return [
        (unusedTextures.pop() || regl.texture)({
            data: resizeCanvas,
            min: 'mipmap',
            mipmap: 'nice',
            aniso,
            flipY: true
        }),
        width => text.init((unusedTextures.pop() || regl.texture), title, width),
        image.width / image.height
    ];
}

module.exports = {
    /**
     * Fetch a batch of artworks.
     * @param {Object} regl - REGL instance.
     * @param {number} count - Number of artworks to fetch.
     * @param {string} res - Desired resolution.
     * @param {Function} cbOne - Callback for each artwork.
     * @param {Function} cbAll - Callback after all artworks are fetched.
     */
    fetch: (regl, count = 10, res = "low", cbOne, cbAll) => {
        const from = Object.keys(paintingCache).length;
        dataAccess.fetchList(from, count).then(paintings => {
            count = paintings.length;
            paintings.forEach(p => {
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
                }).catch(err => {
                    console.error(`Failed to load painting "${p.title}":`, err);
                    if (--count === 0)
                        cbAll();
                });
            });
        }).catch(err => {
            console.error('Failed to fetch paintings list:', err);
            cbAll();
        });
    },

    /**
     * Load a single artwork.
     * @param {Object} regl - REGL instance.
     * @param {Object} p - Painting object.
     * @param {string} res - Desired resolution.
     */
    load: (regl, p, res = "low") => {
        if (p.tex || p.loading)
            return;
        p.loading = true;
        loadImage(regl, p, res).then(([tex, textGen]) => {
            p.loading = false;
            p.tex = tex;
            p.text = textGen(p.width);
        }).catch(err => {
            console.error(`Failed to load painting "${p.title}":`, err);
            p.loading = false;
        });
    },

    /**
     * Unload an artwork's textures.
     * @param {Object} p - Painting object.
     */
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
