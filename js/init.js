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
    'duration_ms']

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
    'duration']

const metricsRange = [120, 200]
const metricsScaleFactor = 6;
const trackLabelMaxCharLen = 6;

const albumNodesWidth = 120
const albumNodesHeight = 120
const albumNodesRX = 15
const trackNodesR = 25
const trackNodesTransitionR = 70

// Get Elements
const chart = $('#chart')
const chartWidth = parseInt(chart.css('width'))
const chartHeight = parseInt(chart.css('height'))
const chartXPadding = parseInt(chartWidth * 0.05)
const chartYPadding = parseInt(chartHeight * 0.05)
const tooltip = d3.select('#tooltip')
const svg = d3.select('#chart')
.append('svg')
.attr('width', chartWidth)
.attr('height', chartHeight)

// Create Side Panel Buttons 
createMetricsButtons(displayMetricsList)

// Time Parse
const parseTime = d3.timeParse("%s")
const formatTime = d3.timeFormat("%M:%S")