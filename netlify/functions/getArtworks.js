const artworks = require('../../src/artworks.json'); // Adjust the path as necessary

exports.handler = async function(event, context) {
    const { queryStringParameters } = event;
    let { from, count } = queryStringParameters;

    from = parseInt(from, 10) || 0;
    count = parseInt(count, 10) || 10;

    const paginatedArtworks = artworks.slice(from, from + count);

    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(paginatedArtworks)
    };
};
