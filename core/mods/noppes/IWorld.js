function getChunk(pos) {
    return [Math.floor(pos.x/16), Math.floor(pos.z/16)];
}

function getChunkCoords(chunk) {
    return [
        chunk[0]*16,
        chunk[1]*16,
        (chunk[0]+1)*16 - 1,
        (chunk[1]+1)*16 - 1,
    ];
}

function inChunk(pos, chunk) {
    var coords = getChunkCoords(chunk);
    return (
        pos.x >= coords[0],
        pos.z >= coords[1],
        pos.x <= coords[2],
        pos.z >= coords[3]
    );
}