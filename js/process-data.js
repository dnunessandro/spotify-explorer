function processData(data){

    let albums = []
    let tracks = []
    let audioFeatures = []

    splitData = splitAlbumsTracksAudioFeatures(data)
    albums = splitData['albums']
    tracks = splitData['tracks']
    audioFeatures = splitData['audioFeatures']

    // Compute Albums Average Metrics
    albums.forEach((album, index) => computeAlbumMetricAverage(album, audioFeatures[index], metricsList))
  
    albums.forEach(e=>e['avgDuration'] = formatTime(parseTime(parseInt(e['avgDuration_ms']/1000))))
    tracks = combineAudioFeaturesTracksInfo(audioFeatures, tracks)

    tracks.forEach(e=>e['duration'] = formatTime(parseTime(parseInt(e['duration_ms']/1000))))

    return {'albums': albums, 'tracks': tracks}
}

function splitAlbumsTracksAudioFeatures(data){

    let albums = []
    let tracks = []
    let audioFeatures = []

    const dataLen = Math.round(data.length)

    for(let i=0; i<dataLen/3; i++){
        albums[i] = data[i][0]
        tracks[i] = data[i+dataLen/3]
        audioFeatures[i] = data[i+dataLen*2/3]
    }

    return {albums : albums, tracks: tracks, audioFeatures: audioFeatures}
}

function combineAudioFeaturesTracksInfo(audioFeatures, tracks){

    let mergedTracks = []

    for(let i=0; i < audioFeatures.length; i++){

        let audioFeaturesFromAlbum = audioFeatures[i]
        let tracksFromAlbum = tracks[i]

        audioFeaturesFromAlbum.forEach(function(_,j){
            audioFeaturesFromAlbum[j].name = tracksFromAlbum[j].name
            audioFeaturesFromAlbum[j].album = tracksFromAlbum[j].album
            audioFeaturesFromAlbum[j].album_id = tracksFromAlbum[j].album_id
        })
        audioFeaturesFromAlbum.forEach(v=>mergedTracks.push(v))
    }

    return mergedTracks
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

function createMetricScales(metricsList, displayMetricsList, albums, metricsRange){

    let scales = {}

    for(let i=0; i < metricsList.length; i++){

        let metric = metricsList[i]
        let displayMetric = displayMetricsList[i]
        let metricStr = 'avg' + metric.charAt(0).toUpperCase() + metric.slice(1)

        let metricArray = albums.map(d=>d[metricStr])

        let metricScale = d3.scaleSqrt()
            .clamp(true)
            .domain(d3.extent(metricArray))
            .range(metricsRange)


        scales[displayMetric] = metricScale
    }

    return scales

}

function createMetricsButtons(displayMetricsList){

for(let i=0; i < displayMetricsList.length; i++){
    let metric = displayMetricsList[i]
    $('#button-selector').append('<button id="'
    + metric
    + '-button"'
    + 'class="metric-button">'
    + metric.charAt(0).toUpperCase() 
    + metric.slice(1) 
    + '</button>')
    }
}