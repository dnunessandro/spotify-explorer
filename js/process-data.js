function readData(artist, artistsDiscography){
    let data = []
    artistsDiscography[artist].forEach(e=>data.push(d3.json('data/' + artist +'/albums-' + e + '.json')))
    artistsDiscography[artist].forEach(e=>data.push(d3.json('data/' + artist +'/tracks-' + e + '.json')))
    artistsDiscography[artist].forEach(e=>data.push(d3.json('data/' + artist +'/audio-features-' + e + '.json')))
    return data
}

function processData(data, sortAlbumsByReleaseDateFlag){

    let albums = []
    let tracks = []
    let audioFeatures = []

    splitData = splitAlbumsTracksAudioFeatures(data)

    albums = splitData['albums']
    tracks = splitData['tracks']
    audioFeatures = splitData['audioFeatures']

    if (sortAlbumsByReleaseDateFlag){
        releaseDateIndexes = getReleaseDateIndexes(albums)
        albums = albums.map((e,i)=>albums[releaseDateIndexes[i]])
        tracks = tracks.map((e,i)=>tracks[releaseDateIndexes[i]])
        audioFeatures = audioFeatures.map((e,i)=>audioFeatures[releaseDateIndexes[i]])
    }

    // Compute Albums Average Metrics
    const mergedTracksDict = combineAudioFeaturesTracksInfo(audioFeatures, tracks)

    audioFeatures = mergedTracksDict['audioFeatures']
    tracks = mergedTracksDict['mergedTracks']

    albums.forEach((album, index) => computeAlbumMetricAverage(album, audioFeatures[index], metricsList))
  
    albums.forEach(e=>e['avgDuration'] = formatTime(parseTime(parseInt(e['avgDuration_ms']/1000))))

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
            audioFeaturesFromAlbum[j].popularity = tracksFromAlbum[j].popularity
            audioFeatures[i].popularity = tracksFromAlbum[j].popularity
        })
        audioFeaturesFromAlbum.forEach(v=>mergedTracks.push(v))
    }

    return {'audioFeatures' : audioFeatures, 'mergedTracks': mergedTracks}
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

function createMetricScales(metricsDomains, displayMetricsList, metricsRange){

    let scales = {}

    const metricsList = Object.keys(metricsDomains)

    for(let i=0; i < metricsList.length; i++){

        let metric = metricsList[i]
        let displayMetric = displayMetricsList[i]
        let metricStr = 'avg' + metric.charAt(0).toUpperCase() + metric.slice(1)

        let metricScale = d3.scaleSqrt()
            .clamp(true)
            .domain(d3.extent(metricsDomains[metricsList[i]]))
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

function createArtistsButtons(artistsDiscography){

    const artists = Object.keys(artistsDiscography).sort()
    const splash = $('#splash')

    Promise.all(readArtistsData(artists)).then(function(artistsData){

        artists.forEach(function(artist, i){
            splash.append('<div id= "'+ artist +'-button"></div>')

            $('#' + artist + '-button')
                .attr('class', 'artist-button')

            $('#' + artist + '-button')
                .append('<a class="artist-name">' + artistsData[i][0].name + '</a>')
            

            $('#' + artist + '-button')
                .append('<img id="'+ artist +'-image">')

            $('#' + artist + '-image')
                .attr('class', 'artist-image')
                .attr('src', artistsData[i][0].image)
        })
        
    })
}

function readArtistsData(artists){
    artistsData = [] 
    artists.forEach(e=>artistsData.push(d3.json('data/'+ e + '/artist-' + e + '.json')))
    return artistsData
}

function createAlbumNodesScale(nAlbums, albumNodesFoci, chartDim){
    let albumNodesScale = {}

    for(let i=0; i < nAlbums; i++){
        albumNodesScale[i] = parseInt( albumNodesFoci[nAlbums][i] * chartDim )
    }
    return albumNodesScale
}

function breakLineAlbumName(albumName){

    //const index = albumName.indexOf(' ', albumName.indexOf( ' ', albumName.indexOf( ' ' ) + 1 ) + 1);
    const index = albumName.indexOf( ' ', albumName.indexOf( ' ' ) + 1 )
    const firstChunk = index >= 0 ? albumName.substr( 0, index ) : albumName.substr( index + 1 );
    if ( index >= 0 ){
        const secondChunk = albumName.substr( index + 1 );
        const outputHtml = '<tspan x="0" text-anchor="middle">' + firstChunk + '</tspan>' +  '<tspan x="0" text-anchor="middle" dy="1.2em">' + secondChunk + '</tspan>'
        return outputHtml
    }
    else{
        return firstChunk
    }

}

function breakLineTrackName(trackName){

    const firstChunk = trackName.substr(0,5)
    const secondChunk = trackName.substr(5,5)
    let outputHtml = ''

    if (trackName.length < 8 )
        outputHtml = trackName
    else{
        outputHtml = '<tspan x="0" text-anchor="middle">' + firstChunk + '</tspan>' +  '<tspan x="0" text-anchor="middle" dy="1.2em">' + secondChunk + '</tspan>'
    }

    return outputHtml

}

function getReleaseDateIndexes(albums){

    const parseDate = d3.timeParse("%Y-%m-%d")

    let datesDict = []

    albums.forEach((e,i)=>datesDict.push(
        {'album' : e.name,
         'date' : parseDate(e.release_date), 
         'index' : i}))

    const datesDictSorted = datesDict.sort(function(x,y){
        return d3.ascending(x.date, y.date);
    })

    return datesDictSorted.map(e=>e.index)
    
}
