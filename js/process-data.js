function processData(data){

    let albums = []
    let tracks = []
    let audioFeatures = []

    splitData = splitAlbumsTracksAudioFeatures(data)
    albums = splitData['albums']
    tracks = splitData['tracks']
    audioFeatures = splitData['audioFeatures']

    tracks = combineAudioFeaturesTracksInfo(audioFeatures, tracks)

    return {'albums': albums, 'tracks': tracks}
}

function splitAlbumsTracksAudioFeatures(data){

    let albums = []
    let tracks = []
    let audioFeatures = []

    const dataLen = Math.round(data.length)

    for(let i=0; i<dataLen/3; i++){
        albums[i] = data[i][0]
        tracks[i] = data[i+dataLen/3][0]
        audioFeatures[i] = data[i+dataLen*2/3]
    }

    return {albums : albums, tracks: tracks, audioFeatures: audioFeatures}
}

function combineAudioFeaturesTracksInfo(audioFeatures, tracks){

    audioFeatures.forEach((v,i)=>audioFeatures[i].name = tracks[i].name)

    return audioFeatures
}

function computeMetricAverage(tracks, metric){

    let metricArray = []
    tracks.forEach(value => metricArray.push(value[metric]))
    const metricAverage = metricArray.reduce((a,b)=>a+b, 0) / metricArray.length

    return metricAverage
}

function computeAlbumMetricAverage(album, tracks, metricsList){
    metricsList.forEach(metric => album['avg' + metric.charAt(0).toUpperCase() + metric.slice(1)] = computeMetricAverage(tracks, metric))
}

function createMetricScales(metricsList, albums, metricsRange){

    let scales = {}

    for(let i=0; i < metricsList.length; i++){

        let metric = metricsList[i]
        let metricStr = 'avg' + metric.charAt(0).toUpperCase() + metric.slice(1)

        let metricArray = albums.map(d=>d[metricStr])

        let metricScale = d3.scaleSqrt()
            .domain(d3.extent(metricArray))
            .range(metricsRange)

        scales[metric] = metricScale

    }

    return scales

}

function dragged(d) {
    d.x = d3.event.x, d.y = d3.event.y;
    d3.select(this).attr("x", d.x).attr("y", d.y);

    const nodeShapeWidth = $(this).css('width')
    const nodeShapeHeight = $(this).css('height')
    $(this).siblings().attr("x", d.x + parseInt(nodeShapeWidth)/2)
        .attr("y", d.y + parseInt(nodeShapeHeight)/2);
  }

  function createMetricsButtons(metricsList){

    for(let i=0; metricsList.length; i++){
        let metric = metricsList[i]
        $('#button-selector').append('<button id="'
        + metric
        + '-button"'
        + 'class="metric-button">'
        + metric.charAt(0).toUpperCase() 
        + metric.slice(1) 
        + '</button>')

    }

  }

  function createMetricsButtonsClickAnimation(metricsList, metricsScales, nodeShapes){

    for(let i=0; i < metricsList.length; i++){
        let metric = metricsList[i]
        let metricStr = 'avg' + metric.charAt(0).toUpperCase() + metric.slice(1)
        d3.select('#' + metric + '-button').on('click', function(){

            $('#selected-metric-button').text(metric.charAt(0).toUpperCase() + metric.slice(1))

            nodeShapes
            .transition()
            .style('width', d=>metricsScales[metric](d[metricStr])+ 'px')
            .style('height',d=>metricsScales[metric](d[metricStr]) + 'px')
            
        })

    }

  }