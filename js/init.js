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

const albumNodesXFoci = {
    1: [0.5],
    2: [0.33, 0.66],
    3: [0.25, 0.5, 0.75],
    4: [0.33, 0.66, 0.33, 0.66],
    5: [0.25, 0.5, 0.75, 0.33, 0.66],
    6: [0.25, 0.5, 0.75, 0.25, 0.5, 0.75],
    7: [0.25, 0.5, 0.75, 0.33, 0.66, 0.33, 0.66],
    8: [0.25, 0.5, 0.75, 0.25, 0.5, 0.75, 0.33, 0.66],
    9: [0.25, 0.5, 0.75, 0.25, 0.5, 0.75, 0.25, 0.5, 0.75],
    10: [0.2, 0.4, 0.6, 0.8, 0.25, 0.5, 0.75, 0.25, 0.5, 0.75],
    11: [0.2, 0.4, 0.6, 0.8, 0.2, 0.4, 0.6, 0.8, 0.25, 0.5, 0.75],
    12: [0.2, 0.4, 0.6, 0.8, 0.2, 0.4, 0.6, 0.8, 0.2, 0.4, 0.6, 0.8]
}

const albumNodesYFoci = {
    1: [0.5],
    2: [0.5, 0.5],
    3: [0.5, 0.5, 0.5],
    4: [0.33, 0.33, 0.66, 0.66],
    5: [0.33, 0.33, 0.33, 0.66, 0.66],
    6: [0.33, 0.33, 0.33, 0.66, 0.66, 0.66],
    7: [0.25, 0.25, 0.25, 0.5, 0.5, 0.75, 0.75],
    8: [0.25, 0.25, 0.25, 0.5, 0.5, 0.5, 0.75, 0.75],
    9: [0.25, 0.25, 0.25, 0.5, 0.5, 0.5, 0.75, 0.75, 0.75],
    10: [0.25, 0.25, 0.25, 0.25, 0.5, 0.5, 0.5, 0.75, 0.75, 0.75],
    11: [0.25, 0.25, 0.25, 0.25, 0.5, 0.5, 0.5, 0.5, 0.75, 0.75, 0.75],
    12: [0.25, 0.25, 0.25, 0.25, 0.5, 0.5, 0.5, 0.5, 0.75, 0.75, 0.75, 0.75]
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
const trackMetricsRange = [17, 40]
const metricsScaleFactor = 6;
const trackLabelMaxCharLen = 6;

const albumNodesWidth = 180
const albumNodesHeight = 180
const albumNodesRX = 30
const trackNodesR = 25
const trackNodesTransitionR = 70

const selectedMetricColor = '#65d36e'
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

// Create Side Panel Buttons 
createMetricsButtons(displayMetricsList)

// Create Artists Buttons


// Time Parse
const parseTime = d3.timeParse("%s")
const formatTime = d3.timeFormat("%M:%S")