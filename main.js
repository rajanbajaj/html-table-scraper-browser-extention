const DOWNLOAD_BUTTON_CLASSNAME = "download-button";

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
        .replace(/,/g, '')     // Replace all commas with \,
        .replace(/'/g, "\\'")     // Replace all single quotes with \'
        .replace(/\n/g, '  ');   // Replace all newlines with ---
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
    var rows = [];
    var headers = [];
    switch (tableType) {
        case 'standard':
            rows = table.getElementsByTagName("tr");
            headers = rows[0].getElementsByTagName("th");

            var headerRow = [];
            for (var j = 0; j < headers.length; j++) {
                headerRow.push(sanatizeString(headers[j].innerText));
            }
            csv.push(headerRow.join(","));

            // Get rows
            for (var k = 1; k < rows.length; k++) {
                cols = rows[k].getElementsByTagName("td");

                var row = [];
                for (var l = 0; l < cols.length; l++) {
                    row.push(sanatizeString(cols[l].innerText));
                }
                csv.push(row.join(","));
            }
            break;
        case 'divRole':
            rows = table.querySelectorAll('[role="row"]');
            headers = rows[0].querySelectorAll('[role="columnheader"]');

            var headerRow = [];
            for (var j = 0; j < headers.length; j++) {
                headerRow.push(sanatizeString(headers[j].innerText));
            }

            // Get rows
            for (var k = 1; k < rows.length; k++) {
                cols = rows[k].querySelectorAll('[role="cell"]');

                var row = [];
                for (var l = 0; l < cols.length; l++) {
                    row.push(sanatizeString(cols[l].innerText));
                }
                csv.push(row.join(","));
            }
            csv.push(headerRow.join(","));
            break;
        case 'notionTableView':
            headers = table.getElementsByClassName('notion-table-view-header-row')[0]?.getElementsByClassName('notion-table-view-header-cell');
            rows = table.getElementsByClassName('notion-table-view-row');

            var headerRow = [];
            for (var j = 0; j < headers.length; j++) {
                headerRow.push(sanatizeString(headers[j].innerText));
            }

            // Get rows
            for (var k = 0; k < rows.length; k++) {
                cols = rows[k].getElementsByClassName('notion-table-view-cell');

                var row = [];
                for (var l = 0; l < cols.length; l++) {
                    row.push(sanatizeString(cols[l].innerText));
                }
                csv.push(row.join(","));
            }
            csv.push(headerRow.join(","));
            break;
        default:
            break;
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
// TODO: fix icon loading
function appendDownloadButtonToTable(tableNode) {
    try {     
        const buttonNode = document.createElement('button');
        buttonNode.setAttribute('class', DOWNLOAD_BUTTON_CLASSNAME);
        buttonNode.setAttribute('type', 'button');
        const iconNode = document.createElement('i');
        iconNode.setAttribute('class', 'bi bi-download icon-download');
        buttonNode.appendChild(iconNode);
        const textNode = document.createTextNode("Download")
        buttonNode.appendChild(textNode);

        // Insert the button as the first child of tableNode
        tableNode.insertBefore(buttonNode, tableNode.firstChild);
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
    try {
        var node = event.target.parentNode;
        if (node.type) {
            node = node.parentNode;
        }
        var tableType = 'standard';
        if (node.role) {
            tableType = 'divRole';
        } else if (node.getAttribute('class').includes('notion-collection-view-body')) {
            tableType = 'notionTableView';
        }
    } catch {
        tableType = 'standard';
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

        arr = document.getElementsByClassName('notion-collection-view-body')
        for (var i = 0; i < arr.length; i++) {
            console.log(arr[i]);
            downloadCSVTable(arr[i], i, 'notionTableView')
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

        arr = document.getElementsByClassName('notion-collection-view-body')
        for (var i = 0; i < arr.length; i++) {
            appendDownloadButtonToTable(arr[i])
        }

        var downloadButtons = document.getElementsByClassName(DOWNLOAD_BUTTON_CLASSNAME)
        for (var i = 0; i < downloadButtons.length; i++) {
            downloadButtons[i].addEventListener('click', downloadRelatedTable, false);
        }
    } else if (request.action === "removeDownloadButtons") {
        let btns = document.getElementsByClassName(DOWNLOAD_BUTTON_CLASSNAME);
        let length = btns.length;
        for (let i = 0; i < length; i++) {
            btns[0].remove();
        }
    }
});

