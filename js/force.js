function dragAlbum(d) {
    d.x = d3.event.x 
    d.y = d3.event.y
    d3.select(this).attr("x", d.x).attr("y", d.y);

    const nodeShapeWidth = $(this).css('width')
    const nodeShapeHeight = $(this).css('height')
    $(this).siblings().attr("x", d.x + parseInt(nodeShapeWidth)/2)
        .attr("y", d.y + parseInt(nodeShapeHeight)/2);
}

function dragTrack(d) {

    d.x = d3.event.x 
    d.y = d3.event.y
    d3.select(this).attr("cx", d.x).attr("cy", d.y);

    $(this).siblings().attr("x", d.x).attr("y", d.y)
}

function createAlbumNodesFoci(albumNodesFociX, albumNodesFociY){
    let albumNodesFoci = []
    albumNodesFociX.forEach((e,i)=>albumNodesFoci.push({'x': e, 'y': albumNodesFociY[i]}))
    return albumNodesFoci
}

function createAlbumNodesForce(albums, nodesXScale, nodesYScale){

    const forceAlbums = d3.forceSimulation(albums)
        .alphaDecay(0)
        .force('forceX', d3.forceX()
            .x((d,i)=>nodesXScale[i])
            .strength(0.1))
        .force('forceY', d3.forceY()
            .y((d,i)=>nodesYScale[i])
            .strength(0.1))

    return forceAlbums
}

function createTrackNodesForce(tracks){
        
    const forceTracks = d3.forceSimulation(tracks)
        .alphaDecay(0)
        .force('collision', d3.forceCollide(30))

    return forceTracks

}

function albumNodesTickUpdate(albumNodeShapes, albumNodeLabels){
    albumNodeShapes.attr('x', (d,i)=>d.x-$('.album-node-shape').eq(i).attr('width')/2)
    albumNodeShapes.attr('y', (d,i)=>d.y-$('.album-node-shape').eq(i).attr('height')/2)

    albumNodeLabels.attr('x', function(d, i){

        $('.album-node-label').eq(i).children().attr('x', e=>d.x)

        return d.x

    })
    albumNodeLabels.attr('y', d=>d.y)

    
}

function trackNodesTickUpdate(tracks, trackNodeShapes, trackNodeLabels, albumNodesFoci, albumNodeIndexScale) {
      
    // Push nodes toward their designated focus.
    tracks.forEach(function(o, i) {
      o.y += (albumNodesFoci[albumNodeIndexScale(o.album_id)].y - o.y) * 0.1;
      o.x += (albumNodesFoci[albumNodeIndexScale(o.album_id)].x - o.x) * 0.1;
    });
  
    trackNodeShapes
        .attr("cx", d=>d.x)
        .attr("cy", d=>d.y);

    trackNodeLabels
        .attr("x", d=>d.x)
        .attr("y", d=>d.y);
  }