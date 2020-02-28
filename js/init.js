// Metrics
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

const metricsRange = [120, 150]

// Scales
const nodeColors = d3.scaleOrdinal(d3.schemePastel1)

// Elements
const chart = $('#chart')
const chartXPadding = 10
const chartYPadding = 50
const chartWidth = parseInt(chart.css('width'))
const chartHeight = parseInt(chart.css('height'))

const svg = d3.select('#chart')
.append('svg')
.attr('width', chartWidth)
.attr('height', chartHeight)

// Create Side Panel Buttons 
createMetricsButtons(metricsList)