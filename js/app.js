Promise.all([
    d3.json('data/albums-a-sun-came.json'),
    d3.json('data/albums-enjoy-your-rabbit.json'),
    d3.json('data/albums-michigan.json'),
    d3.json('data/albums-seven-swans.json'),
    d3.json('data/albums-illinois.json'),
    d3.json('data/albums-carrie-and-lowell.json'),
    d3.json('data/albums-age-of-adz.json'),
    d3.json('data/albums-planetarium.json'),
    d3.json('data/tracks-a-sun-came.json'),
    d3.json('data/tracks-enjoy-your-rabbit.json'),
    d3.json('data/tracks-michigan.json'),
    d3.json('data/tracks-seven-swans.json'),
    d3.json('data/tracks-illinois.json'),
    d3.json('data/tracks-carrie-and-lowell.json'),
    d3.json('data/tracks-age-of-adz.json'),
    d3.json('data/tracks-planetarium.json'),
    d3.json('data/audio-features-a-sun-came.json'),
    d3.json('data/audio-features-enjoy-your-rabbit.json'),
    d3.json('data/audio-features-michigan.json'),
    d3.json('data/audio-features-seven-swans.json'),
    d3.json('data/audio-features-illinois.json'),
    d3.json('data/audio-features-carrie-and-lowell.json'),
    d3.json('data/audio-features-age-of-adz.json'),
    d3.json('data/audio-features-planetarium.json'),

]).then(function(data){

    // Get Albuns and Tracks
    const processedData = processData(data)
    const albums = processedData['albums']
    const tracks = processedData['tracks']
    const albumIds = albums.map(d=>d.id)

    // Create Scales
    const nodesXScale = createAlbumNodesScale(albums.length, albumNodesXFoci, chartWidth)
    const nodesYScale = createAlbumNodesScale(albums.length, albumNodesYFoci, chartHeight)

    const albumMetricsScales = createMetricScales(metricsDomains, displayMetricsList, albumMetricsRange)
    const trackMetricsScales = createMetricScales(metricsDomains, displayMetricsList, trackMetricsRange)


    const nodeColorScale = d3.scaleOrdinal()
        .domain(albums.map(e=>e.id))
        .range(d3.schemePastel1)

    const albumNodeIndexScale = d3.scaleOrdinal()
        .domain(albums.map(e=>e.id))
        .range(d3.range(albums.length))

    // Create Albums Force Layout
    const forceAlbums = createAlbumNodesForce(albums, nodesXScale, nodesYScale)

    // Get Album Nodes Foci
    const albumNodesFociX = d3.range(albums.length).map(e=>nodesXScale[e])
    const albumNodesFociY = d3.range(albums.length).map(e=>nodesYScale[e])
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
        .attr('x', (_,i)=>albumNodesFociX[i])
        .attr('y', (_,i)=>albumNodesFociY[i])
        .attr('rx', albumNodesRX)
        .style('fill', d=>nodeColorScale(d.id))

    const albumNodeLabels = albumNodes.append('text')
        .attr('class', 'album-node-label')
        .html((d, i)=>breakLineAlbumName(d.name,albumNodesFociX, i))


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
    createMetricsButtonsClickAnimation(displayMetricsList, albumMetricsScales, trackMetricsScales, albumNodeShapes)

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


    // Animate Metrics Buttons
    console.log(d3.select('#button-selector').selectAll('.metric-button'))
    d3.select('#button-selector').selectAll('.metric-button')
        .on('mouseover', (d,i)=>showMetricTooltip(i))
        .on('mouseout', function(d) {		
            tooltip.transition()		
                .duration(500)		
                .style("opacity", 0);	
        })
    
})

