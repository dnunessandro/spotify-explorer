
function dragstarted(d, force) {
    if (!d3.event.active) force.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  
  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
    $('.album-node')
        .css('pointer-events', 'none')
  }
  
  function dragended(d, force) {
    if (!d3.event.active) force.alphaTarget(0);
    d.fx = null;
    d.fy = null;
    $('.album-node')
        .css('pointer-events', 'auto')
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
        .force('collision', d3.forceCollide(35))

    return forceTracks

}

function albumNodesTickUpdate(albumNodes, albumNodeLabels){
    
    albumNodes.attr("transform", function(d, i) {
        return "translate(" + parseInt(d.x - $('.album-node-shape').eq(i).attr('width')/2) + "," 
        + parseInt(d.y - $('.album-node-shape').eq(i).attr('height')/2) + ")";
      })

    albumNodeLabels.attr("transform", function(d, i) {
        return "translate(" + parseInt($('.album-node-shape').eq(i).attr('width')/2) + "," 
        + parseInt($('.album-node-shape').eq(i).attr('height')/2) + ")";
      })

}

function trackNodesTickUpdate(tracks, trackNodes, albumNodesFoci, albumNodeIndexScale){
      
    // Push nodes toward their designated focus.
    tracks.forEach(function(o, i) {
      o.y += (albumNodesFoci[albumNodeIndexScale(o.album_id)].y - o.y) * 0.1;
      o.x += (albumNodesFoci[albumNodeIndexScale(o.album_id)].x - o.x) * 0.1;
    });
  
    trackNodes
        .attr("transform", function(d, i) {
            return "translate(" + d.x + "," + d.y + ")";
          })
  }