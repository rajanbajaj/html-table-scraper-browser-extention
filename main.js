chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "downloadTable") {
        var arr = document.getElementsByTagName('table');
        for (var i = 0; i < arr.length; i++) {
            var csv = [];
            var rows = arr[i].getElementsByTagName("tr");
            
            // Get headers
            var headers = rows[0].getElementsByTagName("th");
            var headerRow = [];
            for (var j = 0; j < headers.length; j++) {
                headerRow.push(headers[j].innerText);
            }
            csv.push(headerRow.join(","));
            
            // Get rows
            for (var k = 1; k < rows.length; k++) {
                var cols = rows[k].getElementsByTagName("td");
                var row = [];
                for (var l = 0; l < cols.length; l++) {
                    row.push(cols[l].innerText);
                }
                csv.push(row.join(","));
            }
            
            // Convert array to CSV string
            var csvString = csv.join("\n");
            
            // Download the CSV file
            var downloadLink = document.createElement("a");
            var blob = new Blob([csvString], { type: 'text/csv' });
            var url = URL.createObjectURL(blob);
            downloadLink.href = url;
            downloadLink.download = "table" + (i + 1) + ".csv";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    }
});
