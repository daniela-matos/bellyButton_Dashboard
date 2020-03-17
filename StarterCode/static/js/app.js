// Function that builds the metadata panel
function buildMetadata(sample) {
  // Use `d3.json` to fetch the metadata for a sample (from route metadata/sample)
  d3.json("/metadata/" + sample).then(data => {
    // Use d3 to select the panel with id of `#sample-metadata`
    var metadata = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    metadata.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(data).forEach(([key, value]) => {
      metadata.append("panel").html(key + " : " + value + "<br>");
    });
  });
}

// Function that builds charts from the sample table
function buildCharts(sample) {
  //Use `d3.json` to fetch the sample data for the plots
  d3.json("/samples/" + sample).then(data => {
    // Build a Bubble Chart using the sample data
    var bubbleData = [
      {
        x: data.otu_ids,
        y: data.sample_values,
        text: data.otu_labels,
        mode: "markers",
        marker: {
          color: data.otu_ids,
          size: data.sample_values,
          colorscale: "viridis"
        }
      }
    ];

    var bubbleLayout = {
      title: "Samples per OTU ID",
      showlegend: false,
      height: 600,
      width: 1200,
      title: "Samples per OTU ID",
      xaxis: {
        tittle: {
          text: "OTU ID"
        }
      },
      yaxis: {
        title: {
          text: "Sample Count"
        }
      }
    };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // Build a Pie Chart
    // Slice() to grab the top 10 sample_values, otu_ids, and labels (10 each).

    var pieValues = data.sample_values.slice(0, 10);
    var pieLabels = data.otu_ids.slice(0, 10);
    var pieHvrTxt = data.otu_labels.slice(0, 10);

    var pieData = [
      {
        values: pieValues,
        labels: pieLabels,
        hovertext: pieHvrTxt,
        type: "pie"
      }
    ];

    var pieLayout = {
      height: 400,
      width: 500,
      title: "Top 10 Samples"
    };

    Plotly.newPlot("pie", pieData, pieLayout);
  });
}
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  // Use the list of sample names to populate the select options
  d3.json("/names").then(sampleNames => {
    sampleNames.forEach(sample => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
