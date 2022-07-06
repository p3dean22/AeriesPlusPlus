let addMock = document.getElementById("addMock");


addMock.addEventListener("click", addMockAssignment);

var categories;
chrome.storage.local.get("cats", function(data) {
    if (typeof data.cats == "undefined") {
        alert("Storage error occured (cats).");
    } else {
        categories = data.cats;
    }
});


var otherData;
chrome.storage.local.get("other", function(data) {
    if (typeof data.other == "undefined") {
        alert("Storage error occured (otherData).");
    } else {
        otherData = data.other;
    }
});

function addMockAssignment() {
    var category;
    if (parseFloat(otherData[9][1]) > 1) {
        do
            category = prompt("What category of assignment do you want to add? " + categories);
            while(category < 1 || category > otherData[9][1]);
    } else category = 1;
    var name = prompt("What is the name of the assignment?");
    var newPoints = prompt("How many points will this assignment be?");
    var expectedPoints = prompt("And how many points do you expect to receive?");
    alert("Your current total grade in this class is " + otherData[9][2]);
    var newGrade = 0;
    var newCurrentPoints = (parseFloat(otherData[category][1]) + parseFloat(expectedPoints));
    var newMaxPoints = (parseFloat(otherData[category][2]) + parseFloat(newPoints));
    var newPercent = newCurrentPoints / newMaxPoints;
    for (var i = 1; i < 1 + otherData[9][1]; i++) {
        if (otherData[i][2] != 0) {
            if (category == i) {
                newGrade += parseFloat(otherData[i][0]) * newPercent;
            } else {
                newGrade += parseFloat(otherData[i][0]) * parseFloat(otherData[i][1]) / parseFloat(otherData[i][2]);
            }
        }
    }
    newGrade *= 100;
    newGrade = Math.round(newGrade, );
    newGrade /= 100;
    newPercent *= 10000;
    newPercent = Math.round(newPercent);
    newPercent /= 100;
    alert("Your new grade would be: " + newGrade + "%");

    msgObj = [newGrade, newPercent, newCurrentPoints, newMaxPoints, category, name, expectedPoints, newPoints];
    otherData[parseFloat(category)][1] = parseFloat(newCurrentPoints);
    otherData[parseFloat(category)][2] = parseFloat(newMaxPoints);
    otherData[9][2] = parseFloat(newGrade) + "%";
    chrome.storage.local.set({other: otherData});
    chrome.tabs.query({}, tabs => {
        tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, msgObj);
        });
    });

}