const detachedContent = $('#content').detach()

const artists = Object.keys(artistsDiscography).sort()
const splash = $('#splash')

Promise.all(readArtistsData(artists)).then(function (artistsData) {

    artists.forEach(function (artist, i) {
        splash.append('<div id= "' + artist + '-button"></div>')

        $('#' + artist + '-button')
            .attr('class', 'artist-button')

        $('#' + artist + '-button')
            .append('<a id="' + artist + '-name" class="artist-name">' + artistsData[i][0].name + '</a>')

        $('#' + artist + '-button')
            .append('<img id="' + artist + '-image">')

        $('#' + artist + '-image')
            .attr('class', 'artist-image')
            .attr('src', artistsData[i][0].image)
    })

    $('.artist-name').on('click', function (d) {

        const artist = $(this).attr('id').replace('-name', '')


        if (~typeof (forceAlbums) == undefined)
            forceAlbums.restart()
        if (~typeof (forceTracks) == undefined)
            forceTracks.restart()


        const detachedSplash = $('#splash').fadeToggle(300, function(){
            setTimeout(_=>1000)
            $('#splash').detach()
            
        })

        $('body').append(detachedContent)
        $('.album-node').remove()
        $('.track-node').remove()
        
        Promise.all(readData(artist, artistsDiscography)

        ).then(function (data) {


            // Get Albuns and Tracks
            const processedData = processData(data, sortAlbumsByReleaseDateFlag)
            const albums = processedData['albums']
            const tracks = processedData['tracks']
            const albumIds = albums.map(d => d.id)

            // Create Scales
            const nodesXScale = createAlbumNodesScale(albums.length, albumNodesXFoci, chartWidth)
            const nodesYScale = createAlbumNodesScale(albums.length, albumNodesYFoci, chartHeight)

            const albumMetricsScales = createMetricScales(metricsDomains, displayMetricsList, albumMetricsRange)
            const trackMetricsScales = createMetricScales(metricsDomains, displayMetricsList, trackMetricsRange)


            const nodeColorScale = d3.scaleOrdinal()
                .domain(albums.map(e => e.id))
                .range(d3.schemePastel1)

            const albumNodeIndexScale = d3.scaleOrdinal()
                .domain(albums.map(e => e.id))
                .range(d3.range(albums.length))

            // Create Albums Force Layout
            const forceAlbums = createAlbumNodesForce(albums, nodesXScale, nodesYScale)

            // Get Album Nodes Foci
            const albumNodesFociX = d3.range(albums.length).map(e => nodesXScale[e])
            const albumNodesFociY = d3.range(albums.length).map(e => nodesYScale[e])
            const albumNodesFoci = createAlbumNodesFoci(albumNodesFociX, albumNodesFociY)

            // Create Tracks Force Layout
            const forceTracks = createTrackNodesForce(tracks)

            // Create Nodes
            const albumNodes = svg.selectAll('.album-node')
                .data(albums)
                .enter()
                .append('g')
                .attr('class', d => 'album-' + d.id)
                .classed('album-node', true)
                .style('transform', (d,i)=>"translate(" + parseInt(d.x - $('.album-node-shape').eq(i).attr('width')/2) + "," 
                + parseInt(d.y - $('.album-node-shape').eq(i).attr('height')/2) + ")")


            const albumNodeShapes = albumNodes.append('rect')
                .attr('class', 'album-node-shape')
                .attr('width', albumNodesWidth)
                .attr('height', albumNodesHeight)
                .attr('rx', albumNodesRX)
                .style('fill', d => nodeColorScale(d.id))

            const albumNodeLabels = albumNodes.append('text')
                .attr('class', 'album-node-label')
                .html(d => breakLineAlbumName(d.name))

            const albumNodeClipPaths = albumNodes.append('clipPath')
                .attr('class', 'album-node-clip-path')
                .attr('id', (_, i) => 'clip-path-' + i)
                .append('rect')
                .attr('width', albumNodesWidth)
                .attr('height', albumNodesHeight)
                .attr('rx', albumNodesRX)

            const albumNodeCovers = albumNodes.append('image')
                .classed('album-node-cover', true)
                .attr('href', d => d.cover_image)
                .attr('width', albumNodesWidth)
                .attr('height', albumNodesHeight)
                .attr('clip-path', (_, i) => 'url(#clip-path-' + i + ')')
                .style('fill', 'white')


            // Tie Force to Album Nodes
            forceAlbums.on('tick', function () {
                albumNodesTickUpdate(albumNodes, albumNodeLabels)
            })
            albumNodes.call(d3.drag()
                .on("start", d => dragstarted(d, forceAlbums))
                .on("drag", d => dragged(d, forceAlbums))
                .on("end", d => dragended(d, forceAlbums)));

            // Animate Metrics Selector
            $("#selected-metric-button").click(function () {
                $("#button-selector").slideToggle('slow', function () {
                });
            });

            // Animate Metrics
            createMetricsButtonsClickAnimation(displayMetricsList, albumMetricsScales, trackMetricsScales, albumNodeShapes, albumNodeCovers, albumNodeClipPaths)

            // Animate Album Nodes: Click
            createAlbumNodesClickAnimation(albumIds, tracks, nodeColorScale, forceTracks, albumNodesFoci, albumNodeIndexScale, tooltip, trackMetricsScales, displayMetricsList)

            // Animate Album Nodes: Hover
            albumNodes
                .on("mouseover", function (d) {
                    title = '<strong>' + d.name + ' (Avg.)</strong><br><br>'
                    tooltipHtml = createToolTip(d)

                    let tooltip = d3.select('#tooltip')
                    tooltip
                        .transition()
                        .duration(100)
                        .style("opacity", .9)
                    tooltip.html(title + tooltipHtml)

                    d3.select(this).select('image')
                        .transition()
                        .duration(300)
                        .style('opacity', 1)

                })
                .on("mouseout", function (d) {
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);

                    d3.select(this).select('image')
                        .transition()
                        .duration(100)
                        .style('opacity', 0)
                })

            // Animate Metrics Buttons
            d3.select('#button-selector').selectAll('.metric-button')
                .on('mouseover', (d, i) => showMetricTooltip(i))
                .on('mouseout', function (d) {
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                })

            // Animate Choose Artist Button
            d3.select('#select-artist-button').on('click', function () {
                forceAlbums.stop()
                forceTracks.stop()
                $('#content').detach()
                
                $('body').append(detachedSplash)
                $('#splash').fadeToggle()
                
            })

        })

    })


})
