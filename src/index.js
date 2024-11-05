const lcjs = require('@lightningchart/lcjs')
const { lightningChart, Themes } = lcjs

const lc = lightningChart({
            resourcesBaseUrl: new URL(document.head.baseURI).origin + new URL(document.head.baseURI).pathname + 'resources/',
        })
const chart = lc
    .ParallelCoordinateChart({
        theme: Themes[new URLSearchParams(window.location.search).get('theme') || 'darkGold'] || undefined,
    })
    .setTitle('Large data set Parallel Coordinate Chart')

fetch(document.head.baseURI + 'examples/assets/1701/network-training-data.json')
    .then((r) => r.json())
    .then((data) => {
        const Axes = {
            test_rec: 0,
            test_prec: 1,
            test_acc: 2,
            test_loss: 3,
            train_loss: 4,
            batch_size: 5,
            lstm_output_size: 6,
            pool_size: 7,
            kernel_size: 8,
            filters: 9,
            dropout: 10,
            embedding_dim: 11,
        }
        chart.setAxes(Axes)
        chart.forEachAxis((axis) => axis.setTitleRotation(10))

        // Stroke thickness -1 is recommended for parallel coordinate charts with large data amounts, and especially if fill is transparent.
        // This results in 1 px thin lines without any overlapping segments within 1 series.
        chart.setSeriesStrokeThickness(-1)
        // Disabling splines can enable visualization of larger data sets, and also helps analyzing large data sets.
        chart.setSpline(false)
        chart.setUnselectedSeriesColor((color) => color.setA(10))
        data.forEach((sample) =>
            chart
                .addSeries({ automaticColorIndex: 0 })
                .setName(`Sample ${sample.uid}`)
                .setData(sample)
                // With large data sets, opacity is generally used to identify trends in the data (overlapping values = more visible)
                .setColor((color) => color.setA(20)),
        )
    })
