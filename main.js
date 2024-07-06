/**
 * Downloads a CSV file from the given data with a specified suffix.
 * 
 * @param {array} data - The data to be converted to CSV and downloaded.
 * @param {string} sufix - The suffix to be added to the downloaded CSV file name.
 * 
 * @example downloadCSV([['Name', 'Age'], ['John', 25], ['Jane', 30]], '_example');
 */
function downloadCSV(data, sufix) {

    // Convert array to CSV string
    var csvString = data.join("\n");

    // download csv file
    var downloadLink = document.createElement("a");
    var blob = new Blob([csvString], { type: 'text/csv' });
    var url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = "table" + sufix + ".csv";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

/**
 * 
 * @param {String} str 
 * @returns sanatized value by escaping characters: '"', ',' , '
 */
function sanatizeString(str) {
    return str
        .replace(/"/g, '""')      // Replace all double quotes with double double quotes
        .replace(/,/g, '\\,')     // Replace all commas with \,
        .replace(/'/g, "\\'")     // Replace all single quotes with \'
        .replace(/\n/g, '---');   // Replace all newlines with ---
}

/**
 * Prepares the data from a given table element for CSV download.
 * 
 * @param {HTMLTableElement} table - The table element to prepare data from.
 * @param {string} [tableType='standard'] - The tableType to be selected in order to make dom queries.
 * 
 * @returns {array} The prepared data in a CSV-compatible format.
 * 
 * @example var table = document.getElementById('myTable'); var csvData = prepareData(table);
 */
function prepareData(table, tableType ='standard') {
    var csv = [];
    var rows = tableType === 'standard' ?
                    table.getElementsByTagName("tr") :
                    table.querySelectorAll('[role="row"]');

    // Get headers
    var headers = tableType === 'standard' ?
                        rows[0].getElementsByTagName("th") :
                        rows[0].querySelectorAll('[role="columnheader"]');
    var headerRow = [];
    for (var j = 0; j < headers.length; j++) {
        headerRow.push(sanatizeString(headers[j].innerText));
    }
    csv.push(headerRow.join(","));
    
    // Get rows
    for (var k = 1; k < rows.length; k++) {
        var cols = tableType === 'standard' ?
                        rows[k].getElementsByTagName("td"):
                        rows[k].querySelectorAll('[role="cell"]');
        var row = [];
        for (var l = 0; l < cols.length; l++) {
            row.push(sanatizeString(cols[l].innerText));
        }
        csv.push(row.join(","));
    }

    return csv;
}

/**
 * Downloads a CSV file from a given table element with an optional suffix.
 * 
 * @param {HTMLTableElement} table - The table element to download as CSV.
 * @param {string} [sufix=''] - The suffix to be added to the downloaded CSV file name.
 * @param {string} [tableType='standard'] - The tableType to be selected in order to make dom queries.
 * 
 * @example downloadCSVTable(document.getElementById('myTable'), '_example');
 */
function downloadCSVTable(table, sufix = '', tableType='standard') {
    try {
        
        // prepare data
        var csv = prepareData(table, tableType);
        
        // Download the CSV file
        downloadCSV(csv, sufix);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Appends a download button to a given table element.
 * 
 * @param {HTMLTableElement} tableNode - The table element to append the download button to.
 * 
 * @example appendDownloadButtonToTable(document.getElementById('myTable'));
 */
function appendDownloadButtonToTable(tableNode) {
    try {     
        textNode = document.createElement('div')
        textNode.innerHTML = 'Download'
        node = document.createElement('button')
        node.setAttribute('class', 'download-button')
        node.setAttribute('type', 'button')
        iconNode = document.createElement('i')
        iconNode.setAttribute('class', 'icon-download')
        node.appendChild(iconNode);
        node.appendChild(textNode)
        tableNode.setAttribute('class', 'table-container')
        tableNode.appendChild(node);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Downloads the CSV file related to the clicked download button.
 * 
 * @param {Event} event - The click event triggered by the download button.
 * 
 * @example // Automatically bound to the download button's click event
 */
function downloadRelatedTable(event) {
    var node = event.target.parentNode;
    if (node.type) {
        node = node.parentNode;
    }
 
    var tableType = 'standard'
    if (node.role) {
        tableType = 'divRole'
    }
    downloadCSVTable(node, '', tableType);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "downloadTable") {
        var arr = document.getElementsByTagName('table');
        for (var i = 0; i < arr.length; i++) {
            downloadCSVTable(arr[i], i)
        }

        arr = document.querySelectorAll('[role="table"]')
        for (var i = 0; i < arr.length; i++) {
            downloadCSVTable(arr[i], i, 'divRole')
        }
    } else if (request.action === "addDownloadButtons") {
        var arr = document.getElementsByTagName('table');
        for (var i = 0; i < arr.length; i++) {
            appendDownloadButtonToTable(arr[i])
        }
        
        arr = document.querySelectorAll('[role="table"]')
        for (var i = 0; i < arr.length; i++) {
            appendDownloadButtonToTable(arr[i])
        }

        var downloadButtons = document.getElementsByClassName('download-button')
        for (var i = 0; i < downloadButtons.length; i++) {
            downloadButtons[i].addEventListener('click', downloadRelatedTable, false);
        }
    }
});
