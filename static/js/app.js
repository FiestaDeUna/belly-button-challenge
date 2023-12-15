const url =
  "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

function init() {
  let dropdown = d3.select("#selDataset");

  d3.json(url).then((data) => {
    //set all names data in a variable
    let names = data.names;

    // function to append dropdown with IDs
    for (let i = 0; i < names.length; i++) {
      dropdown.append("option").text(names[i]).property("value", names[i]); 
      
    }; 


    let initChoice = names[0];


    //call functions to fill charts with initial data 
    createCharts(initChoice);    
    fillMetaData(initChoice);
  });
}


function fillMetaData(sample) {
  d3.json(url).then((data) => {

    // Set all metadata in a variable

    let metadata = data.metadata;

    let chosenSample = metadata.filter((choice) => choice.id == sample);

    let initChoice = chosenSample[0];

    //clear 'sample-metadata' 

    let panel = d3.select('#sample-metadata');

    panel.html(''); 

    // use object.entries to return an array of key-value pairs 

    // let entries = Object.entries(initChoice); 

    //iterate through 'entries' to populate metadata 
  
    //line 53 - 54 provided by instructor during office hours 

    for (key in initChoice){
        panel.append("h6").text(`${key.toUpperCase()}: ${initChoice[key]}`);
      };
    
    
}); 


};

function createCharts(sample) {
  d3.json(url).then((data) => {

    //set all data into variables 

    let sampleResult = data.samples;

    let chosenSample = sampleResult.filter((choice) => choice.id == sample);

    let initChoice = chosenSample[0];

    //retrieve sample values
    let otu_ids = initChoice.otu_ids;
    let otu_labels = initChoice.otu_labels;
    let sample_values = initChoice.sample_values;

    //set top 10 values as x and y

    let xTicks = sample_values.slice(0, 10).reverse();
    let yTicks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    let labels = otu_labels.slice(0, 10).reverse();

    //create trace for bargraph 

    let barTrace = [{
      x: xTicks,
      y: yTicks,
      text: labels,
      type: "bar",
      orientation: "h",
    }];

    //set bargraph layout 

    let barLayout = {
      title: "Top 10 OTUs Found",
      height: 600, 
      width: 500

    };

    //create trace for bubble 

    let bubbleTrace = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Portland'
      },
    }];


    //set layout for bubble 
    let bubbleLayout= {

      title: "Bubble Chart of Top 10 OTUs Found", 
      height: 600, 
      width: 1000

    }; 


    Plotly.newPlot("bar", barTrace, barLayout);
    Plotly.newPlot("bubble", bubbleTrace,  bubbleLayout); 


  });
}; 


//create function to trigger chart creation functions when sample choice is changed 
function optionChanged(value) {
  createCharts(value);
  fillMetaData(value);
}; 

init();