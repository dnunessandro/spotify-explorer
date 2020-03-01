Promise.all([
    d3.json('data/album-michigan.json'),
    d3.json('data/album-illinois.json'),
    d3.json('data/album-carrie-and-lowell.json'),
    d3.json('data/album-age-of-adz.json'),
    d3.json('data/tracks-michigan.json'),
    d3.json('data/tracks-illinois.json'),
    d3.json('data/tracks-carrie-and-lowell.json'),
    d3.json('data/tracks-age-of-adz.json'),
    d3.json('data/audio-features-michigan.json'),
    d3.json('data/audio-features-illinois.json'),
    d3.json('data/audio-features-carrie-and-lowell.json'),
    d3.json('data/audio-features-age-of-adz.json')

]).then(function(data){

    // Get Albuns and Tracks
    const processedData = processData(data)
    const albums = processedData['albums']
    const tracks = processedData['tracks']
    const albumIds = albums.map(d=>d.id)

    // Create Scales
    const nodesXScale = d3.scaleLinear()
        .domain([0,albums.length])
        .range([chartXPadding,chartWidth])

    const metricsScales = createMetricScales(metricsList, displayMetricsList, albums, metricsRange)

    const nodeColorScale = d3.scaleOrdinal()
        .domain(albums.map(e=>e.id))
        .range(d3.schemePastel1)

    const albumNodeIndexScale = d3.scaleOrdinal()
        .domain(albums.map(e=>e.id))
        .range(d3.range(albums.length))

    // Create Albums Force Layout
    const forceAlbums = createAlbumNodesForce(albums, chartHeight, chartYPadding, nodesXScale)

    // Get Album Nodes Foci
    const albumNodesFociX = d3.range(albums.length).map(e=>nodesXScale(e)+albumNodesWidth/2)
    const albumNodesFociY = d3.range(albums.length).map(e=>chartHeight/2-chartYPadding+albumNodesHeight/2)
    const albumNodesFoci = createAlbumNodesFoci(albumNodesFociX, albumNodesFociY)

    // Create Tracks Force Layout
    const forceTracks = createTrackNodesForce(tracks)
    
    // Create Nodes
    const albumNodes = svg.selectAll('.album-node')
        .data(albums)
        .enter()
        .append('g')
        .attr('class', d=>'album-'+d.id)
        .classed('album-node', true)
        
    const albumNodeShapes = albumNodes.append('rect')
        .attr('class', 'album-node-shape')
        .attr('width', albumNodesWidth)
        .attr('height', albumNodesHeight)
        .attr('rx', albumNodesRX)
        .style('fill', d=>nodeColorScale(d.id))

    const albumNodeLabels = albumNodes.append('text')
        .attr('class', 'album-node-label')
        .text(d=>d.name)

    // Tie Force to Album Nodes
    forceAlbums.on('tick', function(){
        albumNodesTickUpdate(albumNodeShapes, albumNodeLabels)
    })
    albumNodeShapes.call(d3.drag().on("drag", dragAlbum));
    albumNodeLabels.call(d3.drag().on("drag", dragAlbum));
    
    // Animate Metrics Selector
    $( "#selected-metric-button" ).click(function() {
        $( "#button-selector" ).slideToggle('slow', function() {
        });
      });

    // Animate Metrics
    createMetricsButtonsClickAnimation(displayMetricsList, metricsScales, albumNodeShapes, forceAlbums, nodesXScale)

    // Animate Album Nodes
    createAlbumNodesClickAnimation(albumIds, tracks, nodeColorScale, forceTracks, albumNodesFoci, albumNodeIndexScale, tooltip)
    
    // Animate Album Nodes Tooltip
    albumNodes
        .on("mouseover", function(d){
            title = '<strong>' + d.name + ' (Avg.)</strong><br><br>'
                tooltipHtml = createToolTip(d)
                
                let tooltip = d3.select('#tooltip')
                tooltip
                    .transition()		
                    .duration(200)
                    .style("opacity", .9)
                    
                tooltip.html(title + tooltipHtml)
        })					
        .on("mouseout", function(d) {		
            tooltip.transition()		
                .duration(500)		
                .style("opacity", 0);	
        }) 

    console.log(albums)
    
})

