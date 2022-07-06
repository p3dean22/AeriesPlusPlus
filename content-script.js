// used to inject html, etc, blah blah blah
// executes when URL matches "https://aeries.carmelunified.org/parent/GradebookDetails.aspx"

var bodyDiv = document.getElementById("ctl00_MainContent_subGBS_assignmentsView");
var categories = new Array(10);
var tables = bodyDiv.getElementsByTagName('table');


totalsTable = tables[tables.length - 1];
tableBody = totalsTable.getElementsByTagName('tbody')[0];

var assignmentTable = bodyDiv.getElementsByClassName("GradebookDetailsTable ResultsTable")
var assignmentBody = assignmentTable[0].getElementsByTagName("tbody")[0];



function getWorkCategories() {
    var categoryString = "";
    for (var i = 2; i < tableBody.rows.length - 1; i++) {
        categoryString += "(" + (i - 1) + ") - ";
        categories[i - 2] = tableBody.rows[i].cells[0].innerHTML;
        categoryString += categories[i - 2];
        if (i != tableBody.rows.length - 2) categoryString += ", ";

    }
    return categoryString;
}

var otherData = new Array(10);
for (var i = 0; i < 10; i++) {
    otherData[i] = new Array(3);
}

function getOtherData() {


    if (tableBody.rows[1].cells.length == 5) {
        otherData[1][0] = 100;
        otherData[1][1] = tableBody.rows[2].cells[1].innerHTML;
        otherData[1][2] = tableBody.rows[2].cells[2].innerHTML;
        otherData[9][1] = 1;
        otherData[9][2] = tableBody.rows[2].cells[3].innerHTML;
        return otherData;
    }

    for (var i = 2; i < tableBody.rows.length - 1; i++) {
        var row = tableBody.rows[i];
        for (var k = 1; k < 4; k++) {
            otherData[i - 1][k - 1] = row.cells[k].innerHTML;
            //alert( " i: " + i + " k: " + k + " data: " + otherData[i-1][k-1]);
        }

    }

    otherData = adjustPercentages(otherData);
    otherData[9][1] = tableBody.rows.length - 3; // num of categories
    otherData[9][2] = tableBody.rows[tableBody.rows.length - 1].cells[4].innerHTML;
    return otherData;
}

function adjustPercentages(data) {

    var totalPercentage = 0;
    for (var i = 2; i < tableBody.rows.length - 1; i++) {
        var row = tableBody.rows[i];
        if (row.cells[3].innerHTML != 0) {
            totalPercentage += parseFloat(row.cells[1].innerHTML);
        }

    }

    var pointsToDistribute = 100 - totalPercentage;
    if (pointsToDistribute == 0) return data;

    for (var i = 2; i < tableBody.rows.length - 1; i++) {
        var row = tableBody.rows[i];
        if (row.cells[3].innerHTML != 0) {
            var newPercentage = ((parseFloat(row.cells[1].innerHTML) / totalPercentage) * pointsToDistribute) + parseFloat(row.cells[1].innerHTML);
            data[i - 1][0] = newPercentage;
        }

    }
    return data;
}

chrome.runtime.onMessage.addListener(msgObj => {
    updateHTML(msgObj[0], msgObj[1], msgObj[2], msgObj[3], msgObj[4]);
    category = categories[parseFloat(msgObj[4]) - 1];
    updateAssignmentTable(msgObj[5], msgObj[6], msgObj[7], category);
});




function updateAssignmentTable(name, received, max, category) {
    cards = assignmentBody.getElementsByClassName("Card");
    lastCardHeading = cards[cards.length - 1].getElementsByClassName("TextHeading")[0].innerHTML;
    lastNum = lastCardHeading.substring(0, lastCardHeading.indexOf("-"));
    lastNum = parseFloat(lastNum) + 1;
    rows = assignmentBody.getElementsByTagName('tr');
    firstRow = rows[0].className;

    var cardStatus;
    var tableStatus;
    if (firstRow == "tinymode FullWidth CardView forceShow") {
        tableStatus = "forceHide";
        cardStatus = "forceShow";
    } else {
        cardStatus = "forceHide";
        tableStatus = "forceShow";
    }


    assignmentBody.innerHTML += `<tr class="tinymode FullWidth CardView ` + cardStatus + `">
    <td colspan="13" class="FullWidthAutoHeight">
        <div class="Card" style="width: 94%;">
    
            <div class="RightSide ac">
    
                <div class="TextSubSection">Score</div>
                
            
                <div id="ctl00_MainContent_subGBS_DataDetails_ctl01_scoreData" class="gcc-cell ">
                    <div class="FullWidth ScoreCard">
                        <span style="white-space:nowrap;">` + received + `</span>
                        <span style=";">/</span>
                        <span style=";">` + max + `</span>
                    </div>
                </div>
    
                <div id="ctl00_MainContent_subGBS_DataDetails_ctl01_completeData">
                    <div class="TextSubSection">Complete</div>
                    <div class="FullWidth">
                        <span style="white-space:nowrap;">` + received + `</span>
                        <span style=";">/</span>
                        <span style=";">` + max + `</span>
                    </div>
                </div>
    
                <span id="ctl00_MainContent_subGBS_DataDetails_ctl01_spTransfer">` + ((parseFloat(received) / parseFloat(max)) * 100).toFixed(2) + "%" + `</span>
            </div>
    
            <div class="TextHeading">` + lastNum + " - " + name + `</div>
    
            <div class="TextSubSectionCategory"><i class="fa fa-file-text-o" title="Formative" aria-hidden="true"></i>` + " " + category + `</div>
    
    
            <div style="max-height: 50px; overflow: auto;"></div>
                            
            <div class="InlineData">
                <span class="TextSubSection">Date Completed:</span> 
            </div>
            <div class="InlineData">
                <span class="TextSubSection" style="min-width: 90px;">Due Date:</span> 
            </div>
            <span class="TextSubSection">Grading Complete:</span> False
    
    
            <div class="FullWidth">
                <span class="TextSubSection">Date Assigned:</span>  &nbsp; &nbsp; 
                <span class="TextSubSection" style="min-width: 90px;">Due Time:</span> 
            </div>
            <div class="FullWidth defaultpadding">
            <span title="Long Description">
                &nbsp;
            </span>
    
                
    
            </div>
    
        </div>
    </td>
    </tr>
    <tr class="assignment-info zebra highlight-row normalmode TableView ` + tableStatus + `">				
                            <td class="PlainDataClear al vat NoWrap row-span" rowspan="1">
                                <i class="icon-small-collapsed Clickable vam" onclick="ExpandDetails(this)" title="Click to Expand" data-expanded="false" aria-hidden="true"></i>
                                ` + lastNum + `
                                <div class="assignment-details">
                                    <div class="assignment-details-inner" style="width: 0px;">
                                        
                                        <span class="details-title">Date Assigned:</span>  &nbsp; &nbsp; <span class="details-title">Due Time:</span> 
                                        <div class="description">
                                            <span class="details-title">Long Description:</span> &nbsp;
                                        </div>
                                
                                    </div>
                                </div>					
                            </td>
                            <td class="PlainDataClear al vat">` + name + `</td>
                            <td class="PlainDataClear al vat" style="white-space: nowrap;"><i class="vam fa fa-file-text-o" title="Formative" aria-hidden="true"></i>` + " " + category + `</td>				
                            
    
                            <td id="ctl00_MainContent_subGBS_DataDetails_ctl01_tdScore" class="PlainDataClear ar vat score gcc-cell " align="right" style="padding-right:5px; padding-left:5px;">
                                <table border="0" cellpadding="0" cellspacing="0"><tbody><tr>
                                    <td width="49%" style="white-space:nowrap;">` + received + `</td>
                                    <td width="2%" style=";">&nbsp;/&nbsp;</td>
                                    <td width="49%" align="left" style=";">` + max + `</td>
                                </tr></tbody></table>
                            </td>
                
                            <td id="ctl00_MainContent_subGBS_DataDetails_ctl01_tdCorrect" class="PlainDataClear ar vat row-span" style="padding-right:5px;">
                                <table border="0" cellpadding="0" cellspacing="0" style=""><tbody><tr>
                                    <td width="49%" style="white-space:nowrap;">` + received + `</td>
                                    <td width="2%" style=";">&nbsp;/&nbsp;</td>
                                    <td width="49%" align="left" style=";">` + max + `</td>
                                </tr></tbody></table>
                            </td>
                
                            <td id="ctl00_MainContent_subGBS_DataDetails_ctl01_tdPerc" class="PlainDataClear ar vat row-span" style="padding-right:5px;">` + ((parseFloat(received) / parseFloat(max)) * 100).toFixed(2) + "%" + `</td>
                
                            
    
                            <td class="PlainDataClear al vat row-span"></td>
    
                            <td class="PlainDataClear ar vat row-span"></td>
                            <td class="PlainDataClear ar vat row-span"></td>
                            <td class="PlainDataClear ac vat row-span">No</td>
                            <td class="PlainDataClear al vat row-span">
                                
                            </td>
                        </tr>

    `
}

function updateHTML(newGrade, newPercent, newCurrentPoints, newMaxPoints, category) {

    cat = parseFloat(category) + 1;
    row = tableBody.rows[cat];

    if (otherData[9][1] > 1) {
        newG = parseFloat(newGrade);
        lastCell = tableBody.rows[tableBody.rows.length - 1].cells[5];
        row.cells[2].innerHTML = parseFloat(newCurrentPoints).toFixed(2);
        row.cells[3].innerHTML = parseFloat(newMaxPoints).toFixed(2);
        row.cells[4].innerHTML = parseFloat(newPercent).toFixed(2) + "%";
        tableBody.rows[tableBody.rows.length - 1].cells[4].innerHTML = parseFloat(newGrade).toFixed(2) + "%";
        if (newPercent >= 96) {
            row.cells[5].innerHTML = "A+";
        } else if (newPercent >= 93) {
            row.cells[5].innerHTML = "A";
        } else if (newPercent >= 89.5) {
            row.cells[5].innerHTML = "A-";
        } else if (newPercent >= 86) {
            row.cells[5].innerHTML = "B+";
        } else if (newPercent >= 83) {
            row.cells[5].innerHTML = "B";
        } else if (newPercent >= 79.5) {
            row.cells[5].innerHTML = "B-";
        } else if (newPercent >= 76) {
            row.cells[5].innerHTML = "C+";
        } else if (newPercent >= 73) {
            row.cells[5].innerHTML = "C";
        } else if (newPercent >= 69.5) {
            row.cells[5].innerHTML = "C-";
        } else if (newPercent >= 66) {
            row.cells[5].innerHTML = "D+";
        } else if (newPercent >= 63) {
            row.cells[5].innerHTML = "D";
        } else if (newPercent >= 59.5) {
            row.cells[5].innerHTML = "D-";
        } else {
            row.cells[5].innerHTML = "F";
        }

        if (newG >= 96) {
            lastCell.innerHTML = "A+";
        } else if (newG >= 93) {
            lastCell.innerHTML = "A";
        } else if (newG >= 89.5) {
            lastCell.innerHTML = "A-";
        } else if (newG >= 86) {
            lastCell.innerHTML = "B+";
        } else if (newG >= 83) {
            lastCell.innerHTML = "B";
        } else if (newG >= 79.5) {
            lastCell.innerHTML = "B-";
        } else if (newG >= 76) {
            lastCell.innerHTML = "C+";
        } else if (newG >= 73) {
            lastCell.innerHTML = "C";
        } else if (newG >= 69.5) {
            lastCell.innerHTML = "C-";
        } else if (newG >= 66) {
            lastCell.innerHTML = "D+";
        } else if (newG >= 63) {
            lastCell.innerHTML = "D";
        } else if (newG >= 59.5) {
            lastCell.innerHTML = "D-";
        } else {
            lastCell.innerHTML = "F";
        }

    } else {
        lastRow = tableBody.rows[tableBody.rows.length - 1];
        row.cells[1].innerHTML = parseFloat(newCurrentPoints).toFixed(2);
        row.cells[2].innerHTML = parseFloat(newMaxPoints).toFixed(2);
        row.cells[3].innerHTML = parseFloat(newPercent).toFixed(2) + "%";
        lastRow.cells[1].innerHTML = parseFloat(newCurrentPoints).toFixed(2);
        lastRow.cells[2].innerHTML = parseFloat(newMaxPoints).toFixed(2);
        lastRow.cells[3].innerHTML = parseFloat(newPercent).toFixed(2) + "%";

        if (newPercent >= 96) {
            row.cells[4].innerHTML = "A+";
            lastRow.cells[4].innerHTML = "A+"
        } else if (newPercent >= 93) {
            row.cells[4].innerHTML = "A";
            lastRow.cells[4].innerHTML = "A";
        } else if (newPercent >= 89.5) {
            row.cells[4].innerHTML = "A-";
            lastRow.cells[4].innerHTML = "A-";
        } else if (newPercent >= 86) {
            row.cells[4].innerHTML = "B+";
            lastRow.cells[4].innerHTML = "B+";
        } else if (newPercent >= 83) {
            row.cells[4].innerHTML = "B";
            lastRow.cells[4].innerHTML = "B";
        } else if (newPercent >= 79.5) {
            row.cells[4].innerHTML = "B-";
            lastRow.cells[4].innerHTML = "B-";
        } else if (newPercent >= 76) {
            row.cells[4].innerHTML = "C+";
            lastRow.cells[4].innerHTML = "C+";
        } else if (newPercent >= 73) {
            row.cells[4].innerHTML = "C";
            lastRow.cells[4].innerHTML = "C";
        } else if (newPercent >= 69.5) {
            row.cells[4].innerHTML = "C-";
            lastRow.cells[4].innerHTML = "C-";
        } else if (newPercent >= 66) {
            row.cells[4].innerHTML = "D+";
            lastRow.cells[4].innerHTML = "D+";
        } else if (newPercent >= 63) {
            row.cells[4].innerHTML = "D";
            lastRow.cells[4].innerHTML = "D";
        } else if (newPercent >= 59.5) {
            row.cells[4].innerHTML = "D-";
            lastRow.cells[4].innerHTML = "D-";
        } else {
            row.cells[4].innerHTML = "F";
            lastRow.cells[4].innerHTML = "F";
        }
    }



    otherData[parseFloat(category)][1] = parseFloat(newCurrentPoints);
    otherData[parseFloat(category)][2] = parseFloat(newMaxPoints);
    otherData[9][2] = parseFloat(newPercent);

}

chrome.storage.local.set({ cats: getWorkCategories() });
chrome.storage.local.set({ other: getOtherData() });