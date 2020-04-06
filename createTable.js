window.createTable = (function () {

    class createTable {
        constructor() {
            this.tableAttributes = {
                sortDirection: '',
                sortField: '',
                page: 0,
                start: 0
            }
            this.$table = '';
            this.settings = {};
            this.$body = document.querySelector('body');
        }
    
        startCreateTable = ($table, settings) => {
            if ($table.length) {
                $table = $table[0];
            }
    
            $table.querySelector('tbody').innerHTML = '';

            if (settings.ordering) {
                let sortDirection = $table.querySelector('.sorting_asc') ? 'asc' : 'desc';
                this.tableAttributes.sortDirection = sortDirection
                this.tableAttributes.sortField = $table.querySelector('.sorting_' + sortDirection).getAttribute('data-name')
            }
    
            this.$table = $table;
            this.settings = settings;
            this.tableAttributes.start = $table.querySelectorAll('tbody tr').length
    
            this.addOrderingEvent();
    
            this.update(false);
    
            this.addScrollEvent();
    
            this.printAndExportActions();
        }
        update = scroll => {
    
            this.$body.setAttribute("request_in_progress", 1);
    
            if (typeof this.settings.onBeforeLoad === 'function') {
                this.settings.onBeforeLoad(scroll);
            }
            this.settings.load(this.tableAttributes).then((data) => {
    
                this.appendInformation(data);
    
                if (typeof  this.settings.onAfterLoad === 'function') {
                    this.settings.onAfterLoad(scroll);
                    this.$body.removeAttribute("request_in_progress");
                }
            })
        }
        addOrderingEvent = () => {
            if (!this.settings.ordering) {
                return;
            }
            this.$table.querySelectorAll('thead tr th').forEach((item, index) => {
                item.addEventListener('click', event => {
    
                    this.tableAttributes.sortField = event.target.getAttribute('data-name');
                    this.tableAttributes.page = 0;
                    this.tableAttributes.start = 0;
    
                    this.$table.querySelector('tbody').innerHTML = '';
    
                    if (event.target.classList.contains('sorting_asc')) {
    
                        event.target.classList.remove('sorting_asc');
                        event.target.classList.add('sorting_desc');
    
                        this.tableAttributes.sortDirection = 'desc';
                        this.update(false);
                        return;
                    }
    
                    if (event.target.classList.contains('sorting_desc')) {
    
                        event.target.classList.remove('sorting_desc');
                        event.target.classList.add('sorting_asc');
                        this.tableAttributes.sortDirection = 'asc';
                        this.update(false);
                        return;
                    }
    
                    if (this.$table.querySelector('.sorting_asc')) {
    
                        this.$table.querySelector('.sorting_asc').classList.remove('sorting_asc');
                        event.target.classList.add('sorting_asc');
                        this.tableAttributes.sortDirection = 'asc';
                        this.update(false);
                        return;
                    }
    
                    if (this.$table.querySelector('.sorting_desc')) {
    
                        this.$table.querySelector('.sorting_desc').classList.remove('sorting_desc');
                        event.target.classList.add('sorting_asc');
                        this.tableAttributes.sortDirection = 'asc';
                        this.update(false);
                        return;
                    }
                })
            })
        }
        addScrollEvent = () => {
            if (!this.settings.scrolling) {
                return;
            }
            
            window.addEventListener('scroll', event => {
    
                let documentHeight = document.documentElement.scrollHeight;
                let windowHeight = window.innerHeight;
                let windowVerticalOffeset = window.pageYOffset;
    
                if (this.$body.getAttribute("request_in_progress")) {
                    return;
                }
    
                if (!this.$body.getAttribute("request_in_progress")
                    && (documentHeight - windowHeight - windowVerticalOffeset >= 0)
                    && (documentHeight - windowHeight - windowVerticalOffeset <= 70)) {
    
                    this.$body.setAttribute("request_in_progress", 1);
    
                    this.tableAttributes.page++;
                    this.tableAttributes.start = this.$table.querySelectorAll('tbody tr').length;
    
                    this.update(true);
                }
            })
        }
        printAndExportActions = () => {

            if (!this.settings.printSelector && !this.settings.csvSelector) {
                return; 
            }

            let actionButtons = document.querySelectorAll(this.settings.printSelector + ', ' + this.settings.csvSelector);
    
            actionButtons.forEach(element => {
                element.addEventListener('click', event => {
                    event.preventDefault();
    
                    let action = event.target.getAttribute('data-action');
    
                    switch (action) {
                        case "csv":
                            this.exportTableToCsv();
                            break;
                        case 'print':
                            this.printTable();
                            break;
                    }
                })
            })
        }
        exportTableToCsv = () => {
    
            let fileName = location.pathname.split('/');
            fileName = fileName[fileName.length - 1] + '.csv';
    
            let csv = [];
            let tableRows = this.$table.querySelectorAll('tr');
    
            
            let csvTablerow = [];
    
            tableRows.forEach(element => {
    
                let tableColumns = element.querySelectorAll('td, th');
                csvTablerow = [];
                
                tableColumns.forEach(element => {
                    csvTablerow.push(element.innerHTML);
                })
    
                csv.push(csvTablerow.join(','));
            })
    
            let csvContent = 'data:text/csv;charset=utf-8,';
            csvContent = csvContent + csv.join('\n');
    
            this.csvDownload(csvContent, fileName);
        }
        csvDownload = (csv, fileName) => {
            let downloadLink;
    
            downloadLink = document.createElement('a');
            downloadLink.download = fileName;
            downloadLink.href = encodeURI(csv);
            downloadLink.style.display = 'none';
    
            document.body.appendChild(downloadLink);
    
            downloadLink.click();
        }
        printTable = () => {
            let win = window.open('');
            win.document.write('<html><head>' + document.querySelector('head').innerHTML + '</head><body>');
            win.document.write(this.$table.outerHTML);
            win.document.write('</body></html>');
            win.document.close();
            setTimeout(() => {
                win.print();
            }, 700)
            win.onfocus = function() {
                setTimeout(function () { 
                    win.close(); 
                }, 850)
            }
                
        }
        appendInformation = (data) => {
    
            let numberOfColumns = this.$table.querySelectorAll('thead th');
    
            data.forEach(dataItem => {
                let newTr = document.createElement('tr');
    
                numberOfColumns.forEach(element => {
                    let dataName = element.getAttribute('data-name');
                    let dataToAppend = dataItem[dataName];
    
                    let newTd = document.createElement('td');
                    newTd.innerHTML = dataToAppend;
                    newTd.setAttribute('title', dataToAppend);
                    newTd.setAttribute('class', dataName);
    
                    newTr.appendChild(newTd);
    
                })
    
                this.$table.querySelector('tbody').appendChild(newTr);
    
            });
        }
    }

    let createTableVariable = new startCreateTable();

    return createTableVariable.startCreateTable;
})()