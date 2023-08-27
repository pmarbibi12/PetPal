function clearBar(choice) {
    let buttons = d3.selectAll("button");
    let bar = d3.select("#selection-bar")
    // let pie = d3.select("#pie");
    buttons.remove();
    if (choice == "Pie"){
        bar.append("button")
            .attr("class", "button")
            .attr("id", "pie",)
            .text("Pie");
    }
    else if (choice == "Bar"){
        bar.append("button")
            .attr("class", "button")
            .attr("id", "pie",)
            .text("Bar");
    }
    if (choice == "Line"){
        bar.append("button")
            .attr("class", "button")
            .attr("id", "pie",)
            .text("Line");
    }
    createSecondMenu();
}



function createSecondMenu() {
    let bar = d3.select("#selection-bar2");
    
    // Adding the label
    bar.append("label")
        .attr("for", "categories")
        .text("Categories: ");
    
    bar.append("select")
        .attr("id", "categories");
    
    bar.append("label")
        .attr("for", "cross-categories")
        .text("Cross Categories: ");
    bar.append("select")
        .attr("id", "cross-categories");
        
    
    let catDropdown = d3.select("#categories");
    let crossDropdown = d3.select("#cross-categories");
    
    addCat(catDropdown);
    addCat(crossDropdown);

    crossDropdown.on("change", function() {
        createSub();
    });
  
}

function createSub() {
    let choice = d3.select("#cross-categories").property("value");
    let catChoice = d3.select("#categories").property("value");

    d3.selectAll("#sub-dropdown").remove();
    d3.selectAll("#make-graph-button").remove();
    d3.selectAll("#sub-label").remove();

    let subDropdown = d3.select("#selection-bar2")


    if (choice != catChoice) {
        subDropdown.append("label")
            .attr("for", "sub-dropdown")
            .attr("id", "sub-label")
            .text("Sub-Category: ");

        subDropdown.append("select")
            .attr("id", "sub-dropdown");

        if (choice == "animal_type") {
            d3.json("/api/pet_types").then( function(data) {
                let dropdown = d3.select("#sub-dropdown")
                let addChoice = dropdown.append("option");
                    addChoice.text("None").attr('value', "");
                for (i=0; i<data.length; i++) {
                    let addChoice = dropdown.append("option");
                    addChoice.text(`${data[i]}`).attr('value', `${data[i]}`);
                }
            });   
        }
        else if (choice == "intake_type") {
            d3.json("/api/intake_type").then( function(data) {
                let dropdown = d3.select("#sub-dropdown")
                let addChoice = dropdown.append("option");
                    addChoice.text("None").attr('value', "");
                for (i=0; i<data.length; i++) {
                    let addChoice = dropdown.append("option");
                    addChoice.text(`${data[i]}`).attr('value', `${data[i]}`);
                }
            });  
        }
        else if (choice == "breed") {
            d3.json("/api/breed").then( function(data) {
                let dropdown = d3.select("#sub-dropdown")
                let addChoice = dropdown.append("option");
                    addChoice.text("None").attr('value', "");
                for (i=0; i<data.length; i++) {
                    let addChoice = dropdown.append("option");
                    addChoice.text(`${data[i]}`).attr('value', `${data[i]}`);
                }
            });  
        }
        else if (choice == "sex") {
            d3.json("/api/sex").then( function(data) {
                let dropdown = d3.select("#sub-dropdown")
                let sex = [];
                for (i=0; i<data.length; i++) {
                    sex.push(sexChange(data[i]));
                }
                let addChoice = dropdown.append("option");
                    addChoice.text("None").attr('value', "");
                for (i=0; i<data.length; i++) {
                    let addChoice = dropdown.append("option");
                    addChoice.text(`${sex[i]}`).attr('value', `${data[i]}`);
                }
            });  
        }
    }
    d3.select("#selection-bar2")
        .append("button")
        .attr("id", "make-graph-button")
        .text("Make Graph")
        .on("click", createGraph);
    
    adjustStylesBasedOnDropdowns();
}

function sexChange(sex) {  
    if (sex == "N") {
        return "NEUTERED MALE";
    }
    else if (sex == "F") {
        return "FEMALE";
    }
    else if (sex == "M") {
        return "MALE";
    }
    else if (sex == "S") {
        return "SPAYED FEMALE";
    }
    else {
        return "UNKNOWN";
    };
}

function addCat(dropdown) {
    
    let choices = [
        { label: "Select Option", value: "" }, // Adding the default selection with no value
        { label: "Pet Type", value: "animal_type" },
        { label: "Intake Type", value: "intake_type" },
        { label: "Breed", value: "breed" },
        { label: "Sex", value: "sex" }
    ];
    for (let i = 0; i < choices.length; i++) {
        let addChoice = dropdown.append("option");
        addChoice.text(`${choices[i].label}`)
            .attr('value', `${choices[i].value}`);
    }
}

function toText(option) {
    if (option == "animal_type") {
        return "Pet Type";
    }
    else if (option == "breed") {
        return "Breed"
    }
    else if (option == "sex") {
        return "Sex"
    }
    else if (option == "intake_type") {
        return "Intake Type"
    };
};

function makePie() {
    let selectedCategory = d3.select("#categories").property("value");
    let selectedCross = d3.select("#cross-categories").property("value");
    
    let graphs = d3.selectAll(".graph");
    graphs.remove()
    let graphSection = d3.select("#graph-section")


    console.log("Category", selectedCategory);
    console.log("Cross-Category", selectedCross);


    d3.json("/api/get_data").then(function(data) {
        
        let filteredData = data;

        if (selectedCategory === selectedCross || (selectedCategory === "animal_type" && selectedCross === "breed")) {
        // In these cases, just count occurrences of selectedCategory
            const categoryCounts = {};
            filteredData.forEach(item => {
                const categoryValue = item[selectedCategory];
                if (!categoryCounts[categoryValue]) {
                    categoryCounts[categoryValue] = 1;
                } else {
                    categoryCounts[categoryValue]++;
                }
            });

            const categoryLabels = Object.keys(categoryCounts);
            const categoryValues = Object.values(categoryCounts);

            // Create Pie chart using Plotly
            const pieData = [{
                labels: categoryLabels,
                values: categoryValues,
                type: "pie"
            }];

            const pieLayout = {
                title: {
                    text:`${toText(selectedCategory)} Distribution`,
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

            let newGraphDiv = graphSection.append("div")
                .attr("class", "graph");

            Plotly.newPlot(newGraphDiv.node(), pieData, pieLayout);
        } 
        else {
        // In this case, count occurrences of selectedCategory within the subset of selectedCross
            let selectedSub = d3.select('#sub-dropdown').property("value");
            console.log("selectedSub", selectedSub); 
            const crossCategoryCounts = {};
            filteredData = filteredData.filter(item => item[selectedCross] === selectedSub);

            filteredData.forEach(item => {
                const crossCategoryValue = item[selectedCategory];
                if (!crossCategoryCounts[crossCategoryValue]) {
                    crossCategoryCounts[crossCategoryValue] = 1;
                } else {
                    crossCategoryCounts[crossCategoryValue]++;
                }
            });

            const crossCategoryLabels = Object.keys(crossCategoryCounts);
            const crossCategoryValues = Object.values(crossCategoryCounts);

            // Create Pie chart using Plotly
            const pieData = [{
                labels: crossCategoryLabels,
                values: crossCategoryValues,
                type: "pie"
            }];

            const pieLayout = {
                title: {
                    text: `${toText(selectedCategory)} Distribution for ${toText(selectedCross)} "${selectedSub}"`,
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

            let newGraphDiv = graphSection.append("div")
                .attr("class", "graph");

            Plotly.newPlot(newGraphDiv.node(), pieData, pieLayout);
        }
    });
}

function makeBar() {
    let selectedCategory = d3.select("#categories").property("value");
    let selectedCross = d3.select("#cross-categories").property("value");
    
    let graphs = d3.selectAll(".graph");
    graphs.remove();
    let graphSection = d3.select("#graph-section");

    console.log("Category", selectedCategory);
    console.log("Cross-Category", selectedCross);

    d3.json("/api/get_data").then(function(data) {
        let filteredData = data;

        if (selectedCategory === selectedCross || (selectedCategory === "animal_type" && selectedCross === "breed")) {
            // In these cases, just count occurrences of selectedCategory
            const categoryCounts = {};
            filteredData.forEach(item => {
                const categoryValue = item[selectedCategory];
                if (!categoryCounts[categoryValue]) {
                    categoryCounts[categoryValue] = 1;
                } else {
                    categoryCounts[categoryValue]++;
                }
            });

            const categoryLabels = Object.keys(categoryCounts);
            const categoryValues = Object.values(categoryCounts);

            // Create Bar chart using Plotly
            const barData = [{
                x: categoryLabels,
                y: categoryValues,
                type: "bar",
                marker: {
                    color: getRandomColorArray(categoryLabels.length) // Generate an array of random colors
                }
            }];

            const barLayout = {
                title: {
                    text: `${toText(selectedCategory)} Distribution`,
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

            let newGraphDiv = graphSection.append("div")
                .attr("class", "graph");

            Plotly.newPlot(newGraphDiv.node(), barData, barLayout);
        } 
        else {
            // In this case, count occurrences of selectedCategory within the subset of selectedCross
            let selectedSub = d3.select('#sub-dropdown').property("value");
            console.log("selectedSub", selectedSub); 
            const crossCategoryCounts = {};
            filteredData = filteredData.filter(item => item[selectedCross] === selectedSub);

            filteredData.forEach(item => {
                const crossCategoryValue = item[selectedCategory];
                if (!crossCategoryCounts[crossCategoryValue]) {
                    crossCategoryCounts[crossCategoryValue] = 1;
                } else {
                    crossCategoryCounts[crossCategoryValue]++;
                }
            });

            const crossCategoryLabels = Object.keys(crossCategoryCounts);
            const crossCategoryValues = Object.values(crossCategoryCounts);

            // Create Bar chart using Plotly
            const barData = [{
                x: crossCategoryLabels,
                y: crossCategoryValues,
                type: "bar",
                marker: {
                    color: getRandomColorArray(crossCategoryLabels.length) // Generate an array of random colors
                }
            }];

            const barLayout = {
                title: {
                    text: `${toText(selectedCategory)} Distribution for ${toText(selectedCross)} "${selectedSub}"`,
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

            let newGraphDiv = graphSection.append("div")
                .attr("class", "graph");

            Plotly.newPlot(newGraphDiv.node(), barData, barLayout);
        }
    });
}

function makeLine() {
    let selectedCategory = d3.select("#categories").property("value");
    let selectedCross = d3.select("#cross-categories").property("value");
    
    let graphs = d3.selectAll(".graph");
    graphs.remove();
    let graphSection = d3.select("#graph-section");

    console.log("Category", selectedCategory);
    console.log("Cross-Category", selectedCross);

    d3.json("/api/get_data").then(function(data) {
        let filteredData = data;

        if (selectedCategory === selectedCross || (selectedCategory === "animal_type" && selectedCross === "breed")) {
            const categoryCounts = {};
            filteredData.forEach(item => {
                const categoryValue = item[selectedCategory];
                if (!categoryCounts[categoryValue]) {
                    categoryCounts[categoryValue] = 1;
                } else {
                    categoryCounts[categoryValue]++;
                }
            });

            const categoryLabels = Object.keys(categoryCounts);
            const categoryValues = Object.values(categoryCounts);

            // Create Line chart using Plotly
            const lineData = [{
                x: categoryLabels,
                y: categoryValues,
                type: "scatter",
                mode: "lines+markers",
                line: {
                    color: '#eba374'  // Set line color to orange
                },
                marker: {
                    size: 10,  // Set marker size
                    color: '#78c5bc'  // Set marker color to orange
                }
            }];

            const lineLayout = {
                title: {
                    text: `${toText(selectedCategory)} Distribution`,
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

            let newGraphDiv = graphSection.append("div")
                .attr("class", "graph");

            Plotly.newPlot(newGraphDiv.node(), lineData, lineLayout);
        } 
        else {
            let selectedSub = d3.select('#sub-dropdown').property("value");
            console.log("selectedSub", selectedSub); 
            const crossCategoryCounts = {};
            filteredData = filteredData.filter(item => item[selectedCross] === selectedSub);

            filteredData.forEach(item => {
                const crossCategoryValue = item[selectedCategory];
                if (!crossCategoryCounts[crossCategoryValue]) {
                    crossCategoryCounts[crossCategoryValue] = 1;
                } else {
                    crossCategoryCounts[crossCategoryValue]++;
                }
            });

            const crossCategoryLabels = Object.keys(crossCategoryCounts);
            const crossCategoryValues = Object.values(crossCategoryCounts);

            // Create Line chart using Plotly
            const lineData = [{
                x: crossCategoryLabels,
                y: crossCategoryValues,
                type: "scatter",
                mode: "lines+markers",
                line: {
                    color: '#eba374'  // Set line color to orange
                },
                marker: {
                    size: 10,  // Set marker size
                    color: '#78c5bc'  // Set marker color to orange
                }
            }];

            const lineLayout = {
                title: {
                    text: `${toText(selectedCategory)} Distribution for ${toText(selectedCross)} "${selectedSub}"`,
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

            let newGraphDiv = graphSection.append("div")
                .attr("class", "graph");

            Plotly.newPlot(newGraphDiv.node(), lineData, lineLayout);
        }
    });
}



function createGraph() {
    let type = d3.select(".button").text();

    if (type == "Pie") {
        makePie();
    }
    else if (type == "Bar") {
        makeBar();
    }
    else if (type == "Line") {
        makeLine();
    }

    addResetButton();

}

function getRandomColorArray(count) {
    const colors = [];
    for (let i = 0; i < count; i++) {
        const shade = i * (255 / count);
        colors.push(rgbToHex(255, Math.floor(shade), 0));
    }
    return colors;
}

// Function to generate a random color
function rgbToHex(r, g, b) {
    const componentToHex = (c) => {
        const hex = c.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    };
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function resetPage() {
    location.reload(); // Reloads the current page
}

function addResetButton() {
    // Remove any existing reset button
    d3.select("#reset-button").remove();

    // Add the reset button
    let resetSection = d3.select("#reset-section");

    resetSection.append("button")
        .attr("id", "reset-button")
        .text("Reset")
        .on("click", resetPage);
}

function adjustStylesBasedOnDropdowns() {
    let numDropdowns = document.querySelectorAll('#selection-bar2 select').length;

    // Calculate font size for labels and buttons based on available space
    let fontSize = Math.max(1.5, 5 - numDropdowns * 0.5); // Limit font size to a reasonable range

    let labels = document.querySelectorAll('#selection-bar2 label');
    labels.forEach(label => {
        label.style.fontSize = fontSize * 0.25 + 'vw'; // Adjust the formula as needed
    });

    let buttons = document.querySelectorAll('#selection-bar2 button');
    buttons.forEach(button => {
        button.style.fontSize = fontSize * 0.2 + 'vw'; // Adjust the formula as needed
    });

    let dropdowns = document.querySelectorAll('#selection-bar2 select');
    dropdowns.forEach(dropdown => {
        dropdown.style.fontSize = fontSize * 0.2 + 'vw'; // Adjust the formula as needed
    });
}

