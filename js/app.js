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
    processedData = processData(data)
    albums = processedData['albums']
    tracks = processedData['tracks']

    // Compute Albums Average Metrics
    albums.forEach((album, index) => computeAlbumMetricAverage(album, tracks[index], metricsList))

    // Create Scales
    const nodesXScale = d3.scaleLinear()
        .domain([0,albums.length])
        .range([chartXPadding,chartWidth])

    const metricsScales = createMetricScales(metricsList, albums, metricsRange)

    // Create Force Layout
    const force = d3.forceSimulation(albums)
        .alphaDecay(0)
        .force('forceX', d3.forceX()
            .x((d,i)=>nodesXScale(i))
            .strength(0.1))
        .force('forceY', d3.forceY(chartHeight/2-chartYPadding)
            .strength(0.1))

    // Create Nodes
    const albumNodes = svg.selectAll('g')
        .attr('class', 'node')
        .data(albums)
        .enter()
        .append('g')
        .attr('class', 'node')
        
    const albumNodeShapes = albumNodes.append('rect')
        .attr('class', 'album-node-shape')
        .style('fill', (d,i)=>nodeColors(i))

    const albumNodeLabels = albumNodes.append('text')
        .attr('class', 'album-node-label')
        .text(d=>d.name)
        
    // Tie Force to Nodes
    force.on('tick', function(){
        albumNodeShapes.attr('x', d=>d.x)
        albumNodeShapes.attr('y', d=>d.y)

        albumNodeLabels.attr('x', function(d,i){
            const albumNodeShapeWidth = $('.album-node-shape').eq(i).css('width')
            return d.x + parseFloat(albumNodeShapeWidth)/2
        })
        albumNodeLabels.attr('y', function(d,i){
            const albumNodeShapeHeight = $('.album-node-shape').eq(i).css('height')
            return d.y + parseFloat(albumNodeShapeHeight)/2
        })
        
    })
    albumNodeShapes.call(d3.drag().on("drag", dragged));
    albumNodeLabels.call(d3.drag().on("drag", dragged));

    // Animate Metrics Selector
    $( "#selected-metric-button" ).click(function() {
        $( "#button-selector" ).slideToggle( 'slow', function() {
        });
      });

    // Animate Metrics
    createMetricsButtonsClickAnimation(metricsList, metricsScales, albumNodeShapes)


 
    
        
})

