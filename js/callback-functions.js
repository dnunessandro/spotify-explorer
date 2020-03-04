function createMetricsButtonsClickAnimation(displayMetricsList, albumMetricsScales, trackMetricsScales, albumNodeShapes, albumNodeCovers, albumNodeClipPaths){
    for(let i=0; i < displayMetricsList.length; i++){
        let metric = metricsList[i]
        let displayMetric = displayMetricsList[i]
        let metricStr = 'avg' + metric.charAt(0).toUpperCase() + metric   .slice(1)
        d3.select('#' + displayMetric + '-button').on('click', function(){

            $('#button-selector').children()
                .css('background-color', backgroundColor)
                .css('border-color', selectedMetricColor)
                .css('color', selectedMetricColor)
            $(this)
                .css('border-color', selectedMetricColor)
                .css('background-color', selectedMetricColor)
                .css('color', 'white')

            $('#selected-metric-button').text(displayMetric.charAt(0).toUpperCase() + displayMetric.slice(1))

            albumNodeShapes
                .transition()
                .attr('width', d=>albumMetricsScales[displayMetric](d[metricStr]))
                .attr('height',d=>albumMetricsScales[displayMetric](d[metricStr]))

            albumNodeCovers
                .transition()
                .attr('width', d=>albumMetricsScales[displayMetric](d[metricStr]))
                .attr('height',d=>albumMetricsScales[displayMetric](d[metricStr]))

            albumNodeClipPaths
                .transition()
                .attr('width', d=>albumMetricsScales[displayMetric](d[metricStr]))
                .attr('height',d=>albumMetricsScales[displayMetric](d[metricStr]))

            d3.selectAll('.track-node-shape')
                .transition()
                .attr('r', d=>trackMetricsScales[displayMetric](d[metric]))
                
        })

    }

}

function createAlbumNodesClickAnimation(albumIds, tracks, nodeColorScale, forceTracks, albumNodesFoci, albumNodeIndexScale, tooltip, trackMetricsScales, displayMetricsList){
    
    for(let i=0; i < albumIds.length; i++){

        let albumId = albumIds[i]

        d3.select('.album-node.album-'+albumId).on('click',function(){

            const selectedMetric = $('#selected-metric-button').text().toLowerCase()
            const selectedMetricIndex = metricsList.indexOf(selectedMetric)
            

            let albumTracks = tracks.filter(d=>d.album_id == albumId)
            albumTracks.forEach(d=>d.x=albumNodesFoci[albumNodeIndexScale(d.album_id)].x)
            albumTracks.forEach(d=>d.y=albumNodesFoci[albumNodeIndexScale(d.album_id)].y)

            d3.select(this)
                .transition()
                .duration(200)
                .style('opacity', 0)

            const trackNodes = svg.selectAll('.track-node.album-' + albumId)
                .data(albumTracks)
                .enter()
                .append('g')
                .classed('track-node', true)
                .classed('album-' + albumId, true)

            const trackNodeShapes = trackNodes.append('circle')
                .attr('class', 'track-node-shape')
                /*.attr('cx', albumNodesFoci[albumNodeIndexScale(albumId)].x)*/
                .attr('r', function(d){
                    if (selectedMetricIndex != -1){
                        return trackMetricsScales[displayMetricsList[selectedMetricIndex]](d[selectedMetric])
                    } else{
                        return trackNodesR
                    }
                    

                })
                .style('fill', d=>nodeColorScale(d.album_id))
        
            const trackNodeLabels = trackNodes.append('text')
                .attr('class', 'track-node-label')
                .html(d=>breakLineTrackName(d.name))

            // Tie Force to Tracks Nodes
            const trackNodesAll = svg.selectAll('.track-node')
            forceTracks.on("tick", function(){
                trackNodesTickUpdate(tracks, trackNodesAll, albumNodesFoci, albumNodeIndexScale)
            });
            trackNodes.call(d3.drag()
                .on("start", d=>dragstarted(d,forceTracks))
                .on("drag", d=>dragged(d))
                .on("end",  d=>dragended(d,forceTracks)));
                trackNodes.on('click', function(){
                    createTrackNodesClickAnimation(trackNodes, trackNodeShapes, trackNodeLabels, albumId)
                })

            // Animate Track Nodes Tooltip
            trackNodes
            .on("mouseover", function(d){
                title = '<strong>' + (d.name.length<50 ? d.name : d.name.substring(0,50) + ' [...]') + '</strong><br><br>'
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
            
              
        
        })     
    }  
}

function createToolTipHtml(displayMetricsList, metricsValues, highlightedMetric){

    let outputHtml = ""

    displayMetricsList.forEach(function(d, i){

        let upperCasedMetric = d.charAt(0).toUpperCase() + d.slice(1)

        if (d == highlightedMetric){
            outputHtml = outputHtml.concat('<em><strong>'+ upperCasedMetric  +': </strong>' +
            metricsValues[i] + '</em><br>')
        } else{
            outputHtml = outputHtml.concat('<strong>' + upperCasedMetric  +': </strong>' +
            metricsValues[i] + '<br>')
        }

    })

    return outputHtml
}

function createTrackNodesClickAnimation(trackNodes, trackNodeShapes, trackNodeLabels, albumId){

    trackNodes
        .transition()
        .style('opacity', 0)
        .remove()

    trackNodeShapes
        .transition()
        .attr('r', trackNodesTransitionR)

    trackNodeLabels
        .transition()
        .style('font-size', '120%')

    d3.select('.album-node.album-'+albumId)
        .transition()
        .duration(1000)
        .style('opacity', 100)
    
}
 
function createToolTip(d) {

    const selectedMetric = $('#selected-metric-button').text().toLowerCase()

    let metricsValues = []
    
    if ('album_id' in d){
        metricsValues = displayMetricsList.map(e=>roundIfNumber(d[e]))
    }
    else{
        metricsValues = displayMetricsList.map(e=>roundIfNumber(d['avg' + e.charAt(0).toUpperCase() + e.slice(1)]))
    }
    
    const tooltipHtml = createToolTipHtml(displayMetricsList, metricsValues, selectedMetric)
    	
    return tooltipHtml
}

function roundIfNumber(e){
    if (typeof(e)=='number'){
        return e.toFixed(2)
    }else{
        return e
    }
}

// Animate Track Nodes Tooltip
function showMetricTooltip(i){

    let tooltip = d3.select('#tooltip')
    tooltip
        .transition()		
        .duration(200)
        .style("opacity", .9)

    const metric = $('#button-selector').children().eq(i).text()
    
    tooltip.html(d=>'<span><strong> ' + metric + ' </strong></span><br><br>' + metricsExplanations[metric.toLowerCase()])

}