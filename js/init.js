// Variables
const metricsList = [
    'danceability', 
    'energy', 
    'loudness', 
    'speechiness', 
    'acousticness',
    'instrumentalness',
    'liveness',
    'valence',
    'tempo',
    'duration_ms',
    'popularity']

const displayMetricsList = [
    'danceability', 
    'energy', 
    'loudness', 
    'speechiness', 
    'acousticness',
    'instrumentalness',
    'liveness',
    'valence',
    'tempo',
    'duration',
    'popularity']

const metricsDomains = {
    'danceability' : [0.2, 0.9],
    'energy' : [0.1, 0.9],
    'loudness' : [-30,-6],
    'speechiness' : [0.1, 0.9],
    'acousticness' : [0.1, 0.9],
    'instrumentalness' : [0.1, 0.9],
    'liveness' : [0.1, 0.9],
    'valence' : [0.1, 0.9],
    'tempo' : [40, 200],
    'duration_ms': [30000, 600000],
    'popularity' : [20, 80]
}

let albumNodesXFoci = {
    1: [0.5],
    2: [0.33, 0.66],
    3: [0.2, 0.5, 0.8],
    4: [0.33, 0.66, 0.33, 0.66],
    5: [0.2, 0.5, 0.8, 0.33, 0.66],
    6: [0.2, 0.5, 0.8, 0.2, 0.5, 0.8],
    7: [0.2, 0.5, 0.8, 0.33, 0.66, 0.33, 0.66],
    8: [0.2, 0.5, 0.8, 0.2, 0.5, 0.8, 0.33, 0.66],
    9: [0.2, 0.5, 0.8, 0.2, 0.5, 0.8, 0.2, 0.5, 0.8],
    10: [0.2, 0.4, 0.6, 0.8, 0.3, 0.5, 0.7, 0.3, 0.5, 0.7],
    11: [0.2, 0.4, 0.6, 0.8, 0.2, 0.4, 0.6, 0.8, 0.3, 0.5, 0.7],
    12: [0.2, 0.4, 0.6, 0.8, 0.2, 0.4, 0.6, 0.8, 0.2, 0.4, 0.6, 0.8]
}

let albumNodesYFoci = {
    1: [0.5],
    2: [0.5, 0.5],
    3: [0.5, 0.5, 0.5],
    4: [0.33, 0.33, 0.66, 0.66],
    5: [0.33, 0.33, 0.33, 0.66, 0.66],
    6: [0.33, 0.33, 0.33, 0.66, 0.66, 0.66],
    7: [0.2, 0.2, 0.2, 0.5, 0.5, 0.8, 0.8],
    8: [0.2, 0.2, 0.2, 0.5, 0.5, 0.5, 0.8, 0.8],
    9: [0.2, 0.2, 0.2, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8],
    10: [0.2, 0.2, 0.2, 0.2, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8],
    11: [0.2, 0.2, 0.2, 0.2, 0.5, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8],
    12: [0.2, 0.2, 0.2, 0.25, 0.5, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 0.8]
}

const metricsExplanations = {
    'danceability' : 'Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity.',
    'energy' : 'Energy describes the perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy. For example, death metal has high energy, while a Bach prelude scores low on the scale.',
    'loudness' : 'The overall loudness of a track in decibels (dB). Loudness is the quality of a sound that is the primary psychological correlate of physical strength (amplitude).',
    'speechiness' : 'Speechiness detects the presence of spoken words in a track. The more exclusively speech-like the recording (e.g. talk show, audio book, poetry), the higher the attribute value.',
    'acousticness': 'Acousticness corresponds to a confidence measure on whether a track is acoustic.',
    'instrumentalness' : 'Predicts whether a track contains no vocals. “Ooh” and “aah” sounds are treated as instrumental in this context. Rap or spoken word tracks are clearly “vocal”.',
    'liveness' : 'Detects the presence of an audience in the recording. Higher liveness values represent an increased probability that the track was performed live.',
    'valence' : 'Valence describes the musical positiveness conveyed by a track. Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry).',
    'tempo' : 'The overall estimated tempo of a track in beats per minute (BPM). In musical terminology, tempo is the speed or pace of a given piece and derives directly from the average beat duration.',
    'duration' : 'Duration of the track.',
    'popularity' : 'Popularity of the track.'
}

const sortAlbumsByReleaseDateFlag = true

const albumMetricsRange = [120, 230]
const trackMetricsRange = [22, 40]
const metricsScaleFactor = 6;
const trackLabelMaxCharLen = 6;

const albumNodesWidth = 180
const albumNodesHeight = 180
const albumNodesRX = 30
const trackNodesR = 25
const trackNodesTransitionR = 70
const albumNodesXFociShift = 0
const albumNodesYFociShift = 0

const selectedMetricColor = '#abd0ae'
const backgroundColor = '#f7f7f7'

// Get Elements
const chart = $('#chart')
const chartWidth = parseInt(chart.css('width'))
const chartHeight = parseInt(chart.css('height'))
const tooltip = d3.select('#tooltip')
const buttonSelector = d3.select('#button-selector')
const svg = d3.select('#chart')
.append('svg')
.attr('width', chartWidth)
.attr('height', chartHeight)

// Add Shift to 
albumNodesXFoci = shiftAlbumNodeFoci(albumNodesXFoci, albumNodesXFociShift)
albumNodesYFoci = shiftAlbumNodeFoci(albumNodesYFoci, albumNodesYFociShift)

// Create Side Panel Buttons 
createMetricsButtons(displayMetricsList)

// Time Parse
const parseTime = d3.timeParse("%s")
const formatTime = d3.timeFormat("%M:%S")