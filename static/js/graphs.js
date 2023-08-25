


function intakePieGraph(data) {

    let intakeTypes = {};

    for (let i = 0; i < data.length; i++) {
        let intakeType = data[i].intake_type;
        if (intakeType) {
            if (intakeTypes[intakeType]) {
                intakeTypes[intakeType]++;
            } else {
                intakeTypes[intakeType] = 1;
            }
        }
    }

    console.log("intakeTypes",intakeTypes)

    let pieChartData = {
        labels: Object.keys(intakeTypes),
        values: Object.values(intakeTypes),
        type: 'pie'
      };
    
      let layout = {
        title: {
          text: 'Intake Type Percentages',
          font: {
            color: 'white' // Set title font color to white
          }
        },
        paper_bgcolor: 'rgba(0, 0, 0, 0)', // Set background to transparent
        plot_bgcolor: 'rgba(0, 0, 0, 0)', // Set plot area background to transparent
        font: {
          color: 'white' // Set font color for labels and annotations to white
        }
      };
      // Create the Pie Chart
    Plotly.newPlot('piechart', [pieChartData], layout);
    

};

function petPopularityChart(data) {
    
    let animalTypes = {};

    for (let i = 0; i < data.length; i++) {
        let animalType = data[i].animal_type;
        if (animalType) {
            if (animalTypes[animalType]) {
                animalTypes[animalType]++;
            } else {
                animalTypes[animalType] = 1;
            }
        }
    }

    console.log("animalTypes",animalTypes)

    let barChartData = [{
        x: Object.values(animalTypes),
        y: Object.keys(animalTypes),
        type: 'bar',
        orientation: 'h'
        // x: Object.keys(animalTypes),
        // y: Object.values(animalTypes),
        // type: 'line'
        }];


    let layout = {
            title: {
              text: 'Animal Type Counts',
              font: {
                color: 'white'
              }
            },
            paper_bgcolor: 'rgba(0, 0, 0, 0)',
            plot_bgcolor: 'rgba(0, 0, 0, 0)',
            font: {
              color: 'white'
            },
            xaxis: {
              titlefont: {
                color: 'white'
              },
              tickfont: {
                color: 'white'
              }
            },
            yaxis: {
              title: 'Animal Types',
              titlefont: {
                color: 'white'
              },
              tickfont: {
                color: 'white'
              }
            }
          };

    Plotly.newPlot('barchart-container', barChartData, layout);
};

function makeDonut(data) {
    let breedData = {};

    for (let i = 0; i < data.length; i++) {
        let breeds = data[i].breed;
        if (breeds) {
            if (breedData[breeds]) {
                breedData[breeds]++;
            } else {
                breedData[breeds] = 1;
            }
        }
    }

    let sortedBreedData = Object.keys(breedData).sort((a, b) => breedData[b] - breedData[a]);
    let top5Breeds = sortedBreedData.slice(0, 5);

    console.log("breedData",top5Breeds)

    let donutChartData = [{
        labels: top5Breeds,
        values: top5Breeds.map(breed => breedData[breed]),
        type: 'pie',
        hole: 0.4, // Set the hole size for the donut chart
    }];

    let layout = {
        title: {
            text: 'Top 5 Breed Counts',
            font: {
                color: 'white'
            }
        },
        paper_bgcolor: 'rgba(0, 0, 0, 0)',
        plot_bgcolor: 'rgba(0, 0, 0, 0)',
        font: {
            color: 'white'
        }
    };

    // Create the Donut Chart
    Plotly.newPlot('donutchart-container', donutChartData, layout);
    

}

function petSize(petType, size) {

    d3.json("/api/get_data").then( function(data) {


        let dogCount = 0;
        let catCount = 0;
        let otherCount = 0;

        let catSize = 0;
        let dogSize = 0;
        let otherSize = 0;

        for (let i = 0; i<petType.length; i++){

            if (petType === "Cat" && size === "toy") {
                catSize += 1;
            } else if (petType === "Cat" && size === "small") {
                catSize += 2;
            } else if (petType === "Cat" && size === "med") {
                catSize += 3;
            } else if (petType === "Cat" && size === "lar") {
                catSize += 4;
            };

            if (petType === "Dog" && size === "toy") {
                dogSize += 1;
            } else if (petType === "Dog" && size === "small") {
                dogSize += 2;
            } else if (petType === "Dog" && size === "med") {
                dogSize += 3;
            } else if (petType === "Dog" && size === "lar") {
                dogSize += 4;
            };

            if (petType === "Other" && size === "toy") {
                otherSize += 1;
            } else if (petType === "Other" && size === "small") {
                otherSize += 2;
            } else if (petType === "Other" && size === "med") {
                otherSize += 3;
            } else if (petType === "Other" && size === "lar") {
                otherSize += 4;
            };

            if (petType === "Dog") {
                dogCount += 1
            };
            if (petType === "Cat") {
                catCount += 1
            };
            if (petType === "Other") {
                otherCount += 1
            };

            avgDog = dogSize/dogCount;
            avgCat = catSize/catCount;
            avgOther = otherSize/otherCount;

            sizeArray = [avgDog, avgCat, avgOther];

            animalArray = ["Dog", "Cat", "Other"];

            let trace = {
                x: animalArray,
                y: sizeArray,
                mode: "markers",
                marker: {
                    size: sizeArray,
                    color: otuIds.map(function(i) {
                        return '#' + i;
                    }),

                },
            };

            let layout = {
                xaxis: {
                    title: "Pet Sizes",
                    margin: { t: 0, r: 25, l: 100, b: 50 },
                },
            };

            Plotly.newPlot("bubble", [trace], layout);

        };

    });
};
