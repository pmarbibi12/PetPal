function init() {
    d3.json("/api/intake_type").then( function(data) {
        getIntakeType(data);
    })
    d3.json("/api/pet_types").then( function(data) {
        getPetType(data);
    })
    d3.json("/api/size").then( function(data) {
        getSize(data);
    })
    d3.json("/api/sex").then( function(data) {
        getSex(data);
    })
    d3.json("/api/pet_age").then( function(data) {
        getAge(data);
    })
    d3.json("/api/get_data").then( function(data) {
        displayResults(data, 1);
        didYouKnow(data);
        intakePieGraph(data);
        petPopularityChart(data);
        makeDonut(data);
    });
}

function displayResults(results, page) {
    let startIndex = (page - 1) * 10;
    let endIndex = startIndex + 10;
    let pageResults = results.slice(startIndex, endIndex);
    
    let resultsList = d3.select("#result-list");
    resultsList.selectAll("*").remove();

    let resultCount = d3.select("#results-count")
    resultCount.selectAll("*").remove();
    resultCount.append("p").text(`Results(${results.length}):`)


    pageResults.forEach(result => {
        // Create a div for the result and assign the "result-box" class
        let resultBox = resultsList.append("div")
            .attr("class", "result-box");

        // Create a div for the image section
        let imageSection = resultBox.append("div")
            .attr("class", "image-section");

        // Create an image element within the image section
        if (result.hasImage == "True") {
            imageSection.append("img")
                .attr("src", result.link)
                .attr("alt", "Image");
        }
        else if (result.animal_type == "DOG"){
            imageSection.append("img")
                .attr("src", "https://cdn4.iconfinder.com/data/icons/dog-breed-minimal-outline/512/Golden_retriever-512.png")
                .attr("alt", "Image");
        }
        else if (result.animal_type == "CAT"){
            imageSection.append("img")
                .attr("src", "https://cdn2.iconfinder.com/data/icons/veterinary-line-fluffy-pet/512/Cat-512.png")
                .attr("alt", "Image");
        }
        else if (result.animal_type == "OTHER"){
            imageSection.append("img")
                .attr("src", "https://cdn2.iconfinder.com/data/icons/veterinary-line-fluffy-pet/512/Hamster-512.png")
                .attr("alt", "Image");
        }
        else if (result.animal_type == "LIVESTOCK"){
            imageSection.append("img")
                .attr("src", "https://cdn4.iconfinder.com/data/icons/zoo-line-welcome-to-zootopia/512/goat-512.png")
                .attr("alt", "Image");
        }
        // Create a div for the facts section
        let factsSection = resultBox.append("div")
            .attr("class", "facts-section");

        // Populate the facts section with data (adjust as needed)
        factsSection.append("p")
            .html(
                `<p>Animal ID: ${result.animal_id}</p>
                <p>Name: ${result.name}</p>
                <p>Age: ${result.age}</p>
                <p>Animal Type: ${result.animal_type}</p>
                <p>Breed: ${result.breed}</p>
                <p>Color: ${result.color}</p>
                <p>Sex: ${sexChange(result.sex)}</p>
                <p>Size: ${result.size}</p>
                <p>Intake Type: ${result.intake_type}</p>
                <p>In Date: ${new Date(parseDate(result.in_date)).toLocaleDateString()}</p>`
                );
    });

    createPaginationControls(results, page);
}

function createPaginationControls(results, currentPage) {
    let paginationContainer = d3.select("#pagination");

    paginationContainer.selectAll("*").remove();

    let totalPages = Math.ceil(results.length / 10);

    if (totalPages > 1) {
        let prevButton = paginationContainer.append("button")
            .text("Previous")
            .on("click", () => {
                if (currentPage > 1) {
                    displayResults(results, currentPage - 1);
                }
            });

        for (let i = 1; i <= totalPages; i++) {
            paginationContainer.append("button")
                .text(i)
                .classed("active", i === currentPage)
                .on("click", () => displayResults(results, i));
        }

        let nextButton = paginationContainer.append("button")
            .text("Next")
            .on("click", () => {
                if (currentPage < totalPages) {
                    displayResults(results, currentPage + 1);
                }
            });
    }
}


function performSearch() {
    let intakeType = document.getElementById('intake-type').value;
    let petType = document.getElementById('pet-type').value;
    let size = document.getElementById('size').value;
    let sex = document.getElementById('sex').value;
    searchClicked(intakeType, petType, size, sex);
}

function searchClicked(intakeType, petType, size, sex) {

    function filterPet(pet) {
        let isMatch = true;  // Start with true and narrow down using conditions
        if (intakeType !== "") {
            isMatch = isMatch && pet["intake_type"] === intakeType;
        }
        if (petType !== "") {
            isMatch = isMatch && pet["animal_type"] === petType;
        }
        if (size !== "") {
            isMatch = isMatch && pet["size"] === size;
        }
        if (sex !== "") {
            isMatch = isMatch && pet["sex"] === sex;
        }
        return isMatch;
    }
    
    
        d3.json("/api/get_data").then( function(data) {

        let searchedResults = data.filter(filterPet);
        let resultsList = d3.select("#result-list");
        resultsList.selectAll("*").remove();

        if (searchedResults.length == 0) {
            let resultBox = resultsList.append("div")
                .attr("class", "result-box")
                .text("No results found");
            let paginationContainer = d3.select("#pagination");
            paginationContainer.selectAll("*").remove();
        }
        else {
        // searchedResults.forEach(result => {
        //     let resultBox = resultsList.append("div")
        //     .attr("class", "result-box");

        //     // Create a div for the image section
        //     let imageSection = resultBox.append("div")
        //         .attr("class", "image-section");

        //     // Create an image element within the image section
        //     imageSection.append("img")
        //         .attr("src", result.link)
        //         .attr("alt", "Image");

        //     // Create a div for the facts section
        //     let factsSection = resultBox.append("div")
        //         .attr("class", "facts-section");

            
        //     // Populate the facts section with data
        //     factsSection.append("p")
        //         .html(
        //             `<p>Animal ID: ${result.animal_id}</p>
        //             <p>Name: ${result.name}</p>
        //             <p>Age: ${result.age}</p>
        //             <p>Animal Type: ${result.animal_type}</p>
        //             <p>Breed: ${result.breed}</p>
        //             <p>Color: ${result.color}</p>
        //             <p>Sex: ${sexChange(result.sex)}</p>
        //             <p>Size: ${result.size}</p>
        //             <p>Intake Type: ${result.intake_type}</p>
        //             <p>In Date: ${new Date(parseDate(result.in_date)).toLocaleDateString()}</p>`
        //             );
        //     });

        displayResults(searchedResults, 1)
        };
    
    }); 
};

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

function getIntakeType(intakeType) {
    let dropdown = d3.select("#intake-type")
    for (i=0; i<intakeType.length; i++) {
        let addChoice = dropdown.append("option");
        addChoice.text(`${intakeType[i]}`).attr('value', `${intakeType[i]}`);
    }
};

function getPetType(petType) {
    let dropdown = d3.select("#pet-type")
    for (i=0; i<petType.length; i++) {
        let addChoice = dropdown.append("option");
        addChoice.text(`${petType[i]}`).attr('value', `${petType[i]}`);
    }
};

function getSize(petSize) {
    let dropdown = d3.select("#size")
    for (i=0; i<petSize.length; i++) {
        let addChoice = dropdown.append("option");
        addChoice.text(`${petSize[i]}`).attr('value', `${petSize[i]}`)
    }
};

function getSex(petSex) {
    let dropdown = d3.select("#sex")
    let sex = [];

    for (i=0; i<petSex.length; i++) {
            sex.push(sexChange(petSex[i]));
    }

    for (i=0; i<sex.length; i++) {
        let addChoice = dropdown.append("option");
        addChoice.text(`${sex[i]}`).attr('value',`${petSex[i]}`)
    }
};

function getAge(petAge) {
    let dropdown = d3.select("#age")
    for (i=0; i<petAge.length; i++) {
        let addChoice = dropdown.append("option");
        addChoice.text(`${petAge[i]}`).attr('value', `${petAge[i]}`)
    }
};

function didYouKnow(data){
    let section = d3.select('#fact-content');
    let [mostCommonDog, mostCommonOther] = commonDogAndOther(data);
    let animalCounts = countAnimalTypes(data);
    let { animal: longestStayAnimal, duration: longestStayDuration } = findLongestStayAnimal(data);
    let oldestAnimal = findOldestAnimal(data);

    // Construct the sentence dynamically using the counts and animal types
    let animalCountBullet = "There are ";
    let animalTypes = Object.keys(animalCounts);
    for (let i = 0; i < animalTypes.length; i++) {
        animalCountBullet += `${animalCounts[animalTypes[i]]} ${animalTypes[i].toLowerCase()}(s)`;
        if (i === animalTypes.length - 2) {
            animalCountBullet += " and ";
        } else if (i < animalTypes.length - 1) {
            animalCountBullet += ", ";
        }
    }
    animalCountBullet += " in <u>Montgomery County Animal Services & Adoption Center</u>.";

    let inDate = new Date(longestStayAnimal.in_date).toLocaleDateString();
    let countDaysFromAnimalData = `<b>${longestStayAnimal.name}</b> has been in the <u>Montgomery County Animal Services & Adoption Center</u> since ${inDate}. That's ${longestStayDuration} days! Filter by "${longestStayAnimal.animal_type}" pet type to find them.`;

    section.append('li').html(`The most common dog breed in <u>Montgomery County Animal Services & Adoption Center</u> is the "${mostCommonDog}."`);
    section.append('li').text(`The most common "Other" breed type in the adoption center is the "${mostCommonOther.toLowerCase()}."`);
    section.append('li').html(animalCountBullet);
    section.append('li').html(countDaysFromAnimalData);
    section.append('li').html(`The oldest animal in <u>Montgomery County Animal Services & Adoption Center</u> is <b>${oldestAnimal.name}</b>, aged ${oldestAnimal.age}. Filter by "${oldestAnimal.animal_type}" pet type to find them.`)

}

function commonDogAndOther(data) {
    let breedCountsByAnimalType = {};


    for (let i = 0; i < data.length; i++) {
        let breed = data[i].breed;
        let animalType = data[i].animal_type;

        if (animalType === "DOG" || animalType === "OTHER") {
            if (!breedCountsByAnimalType[animalType]) {
                breedCountsByAnimalType[animalType] = {};
            }

            if (breed) {
                if (breedCountsByAnimalType[animalType][breed]) {
                    breedCountsByAnimalType[animalType][breed]++;
                } else {
                    breedCountsByAnimalType[animalType][breed] = 1;
                }
            }
        }
    }

    let mostCommonBreedByType = {
        "DOG": "",
        "OTHER": ""
    };

    for (let animalType in breedCountsByAnimalType) {
        let maxCount = 0;
        let mostCommonBreed = "";

        for (let breed in breedCountsByAnimalType[animalType]) {
            let count = breedCountsByAnimalType[animalType][breed];
            if (count > maxCount) {
                maxCount = count;
                mostCommonBreed = breed;
            }
        }

        mostCommonBreedByType[animalType] = mostCommonBreed;
    }

    return [mostCommonBreedByType["DOG"],mostCommonBreedByType["OTHER"]];
}

function countAnimalTypes(data) {
    let animalTypeCount = {};

    for (let i = 0; i < data.length; i++) {
        let animalType = data[i].animal_type;
        if (animalType) {
            if (animalTypeCount[animalType]) {
                animalTypeCount[animalType]++;
            } else {
                animalTypeCount[animalType] = 1;
            }
        }
    }

    return animalTypeCount;
}

function findLongestStayAnimal(data) {
    let longestStayAnimal = null;
    let longestStayDuration = -1;

    for (let i = 0; i < data.length; i++) {
        let animal = data[i];
        let inDate = parseDate(animal.in_date);
        let currentDate = new Date();
        let stayDuration = Math.floor((currentDate - inDate) / (1000 * 60 * 60 * 24)); // Calculate days

        if (stayDuration > longestStayDuration) {
            longestStayDuration = stayDuration;
            longestStayAnimal = animal;
        }
    }

    return {
        animal: longestStayAnimal,
        duration: longestStayDuration
    };
}

function parseDate(dateString) {
    let parts = dateString.split('-');
    return new Date(parts[0], parts[1] - 1, parts[2].substr(0, 2));
}

function parseAge(ageString) {
    let ageParts = ageString.split(' ');
    let unit = ageParts[1].toUpperCase();
    let value = parseInt(ageParts[0]);

    if (unit === 'DAYS') {
        return value;
    } else if (unit === 'MONTHS') {
        return value * 30; // Assuming 30 days in a month
    } else if (unit === 'YEAR' || unit === 'YEARS') {
        return value * 365; // Assuming 365 days in a year
    } else {
        return 0; // Return 0 for unrecognized units
    }
}

function findOldestAnimal(data) {
    let oldestAnimal = null;
    let oldestAge = -1;

    for (let i = 0; i < data.length; i++) {
        let animal = data[i];
        let age = parseAge(animal.age);

        if (age > oldestAge) {
            oldestAge = age;
            oldestAnimal = animal;
        }
    }

    return oldestAnimal;
}

init();