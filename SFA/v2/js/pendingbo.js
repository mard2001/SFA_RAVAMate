var user = localStorage.getItem("adminUserName");
var usertype = localStorage.getItem("usertype");
var LOCALLINK = "https://fastdevs-api.com"
var API_ENDPOINT = "/BUDDYGBLAPI/MTDAPI/application.php";
var rowData;
const datetime_options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric', 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
};

determineUserType(usertype); 

getcompname_dynamic('Bad Orders for Approval', 'titleHeading');
// getcompname();
function getcompname(){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"GET_COMPANYNAME", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,            
        success: function(r){ 
            $('#titleHeading').html(r[0].company.toUpperCase() +' | Bad Orders for Approval');
        }
    });
}

function requestSource(start, end, approve_Stat, tableVar){
    var retArray =[];

    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"GET_BO_FOR_APPROVALS", "start":start, "end":end, "approve_Stat":approve_Stat, "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,  
        async: false,          
        success: function(r){ 
            if(r.lenght != 0){ 
                retArray = r;
                tableVar.clear().rows.add(retArray).draw();
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
                html: "ERROR OCCUR: " + XMLHttpRequest.responseText,
                icon: "error"
            });
        }
    }).done(function () {
        setTimeout(() => {
            Swal.close();
        }, 1000);
    });

    return retArray;
}

var sourceData_BO;
function requestBOItems(transacID, tableVar){
    $.ajax ({
        url: GLOBALLINKAPI+'/connectionString/applicationipAPI.php',
        type: "POST",
        data: {"type":"get_BO_items_for_approval", "transacID":transacID, "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,  
        async: false,          
        success: function(r){ 
            if(r.lenght != 0){ 
                sourceData_BO = r;
                calculateBO_Rows(sourceData_BO);
                // tableVar.clear().rows.add(sourceData_BO).draw();
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
                html: "ERROR OCCUR: " + XMLHttpRequest.responseText,
                icon: "error"
            });
        }
    }).done(function () {
        setTimeout(() => {
            Swal.close();
            $('#BOItemsModal').modal('show');       
        }, 1000);
    });
}

var tableDataBOitems;
datatableApp_BOitems();
function datatableApp_BOitems(){
    tableDataBOitems = $('#tblBOItems').DataTable({
        "dom": '<"d-flex justify-content-between"<>f>rt<"d-flex justify-content-between"i<"datatableBottomDiv"p>>',
        "responsive": false,
        "data": sourceData_BO,
        "scrollX": true,
        "ordering": true,
        "language": {
            "search": "<i class='fa-solid fa-magnifying-glass search-icon'></i>",
            "searchPlaceholder": "Search",
            "paginate": {
                "previous": "<i class='fa-solid fa-caret-left'></i>",
                "next": "<i class='fa-solid fa-caret-right'></i>"
            }
        },
        columns: [
            // { data: "transactionID", title: "TransactionID" },
            { data: "stockCode", title: "Stockcode" },
            { data: "Description", title: "Description" },
            // { data: "quantity", title: "Quantity" },
            // { data: "qtyRefund", title: "Refund (qty)" },
            // { data: "qtyReplace", title: "Replaced (qty)" },
            
            { 
                data: null, 
                title: "Quantity",
                render: function(data,type,row){
                    if(!row.PurchaseUom || !row.qtyConversion){ return '---'}

                    return row.qtyConversion + ' ' + row.PurchaseUom.toUpperCase();
                } 
            },
            
            { data: "linePiecePrice", title: "Piece Price" },
            { data: "lineTotal", title: "Item Total" },
            { data: "remarks", title: "Remarks" },
            { data: "ReasonCode", title: "Reason Code" },
            

        ],
        columnDefs: [
            {
                targets: [2, 3, 4],
                className: 'dt-body-center'
            }
        ]
    });

}

function approveBO(){
    var id = $('#hiddenTransacID').val();
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"APPROVE_PENDING_BO", "transactionID": id, "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,            
        success: function(r){ 
            if(r){
                $('#BOItemsModal').modal('hide');
                Swal.fire({
                    text: "BO Successfully Approved.",
                    icon: "success",
                    allowOutsideClick: false, 
                    allowEscapeKey: false, 
                    allowEnterKey: false 
                }).then((result) => {
                    if (result.isConfirmed) {
                        datePickerPending.executeDate({ 
                            startDate: moment(datePickerPending.startPickDate), 
                            endDate: moment(datePickerPending.endPickDate)
                        });
                        datePickerApproved.executeDate({ 
                            startDate: moment(datePickerPending.startPickDate), 
                            endDate: moment(datePickerPending.endPickDate)
                        });
                    }
                });
            }
        }, error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
                html: "ERROR OCCUR: " + XMLHttpRequest.responseText,
                icon: "error"
            });
        }
    });
}

function rejectBO(){
    var id = $('#hiddenTransacID').val();

    $('#BOItemsModal').modal('hide');

    Swal.fire({
        title: 'Are you sure?',
        text: 'Do you really want to reject this BO?',
        icon: 'warning',
        input: 'textarea',
        inputPlaceholder: 'Provide your reason here...',
        inputAttributes: {
            'aria-label': 'Reason for rejection'
        },
        showCancelButton: true,
        confirmButtonText: 'Yes, Reject',
        cancelButtonText: 'Cancel',
        reverseButtons: true,
        inputValidator: (value) => {
            if (!value) {
                return 'You need to provide a reason!';
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            let reason = result.value;
            
            $.ajax ({
                url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
                type: "POST",
                data: {"type":"REJECT_PENDING_BO", "transactionID": id, "remarks":reason, "userID": GBL_USERID, "distCode": GBL_DISTCODE},
                dataType: "json",
                crossDomain: true,
                cache: false,            
                success: function(r){ 
                    if(r){
                        $('#BOItemsModal').modal('hide');
                        Swal.fire({
                            text: "BO Successfully Rejected.",
                            icon: "success",
                            allowOutsideClick: false, 
                            allowEscapeKey: false, 
                            allowEnterKey: false 
                        }).then((result) => {
                            if (result.isConfirmed) {
                                datePickerPending.executeDate({ 
                                    startDate: moment(datePickerPending.startPickDate), 
                                    endDate: moment(datePickerPending.endPickDate)
                                });
                                datePickerRejected.executeDate({ 
                                    startDate: moment(datePickerPending.startPickDate), 
                                    endDate: moment(datePickerPending.endPickDate)
                                });
                            }
                        });
                    }
                }, error: function(XMLHttpRequest, textStatus, errorThrown) {
                    Swal.fire({
                        html: "ERROR OCCUR: " + XMLHttpRequest.responseText,
                        icon: "error"
                    });
                }
            });
        }
    });
    
}

function salesmanType(value) {
    console.log(value);
    const map = {
        "B": "Booking",
        "D": "Driver",
        "T": "Van Sales",
        "X": "Prebooking",
        "Y": "Hybrid"
    };

    if (map[value]) {
        return map[value];
    }

    const entry = Object.entries(map).find(([k, v]) => v.toLowerCase() === value.toLowerCase());
    if (entry) {
        return entry[0];  
    }

    return null; 
}

class DatePicker {
    constructor(elementId, approve_Stat, sourceDataFunc, tableVar) {
        this.elementId = elementId;  
        this.startPickDate = null;
        this.endPickDate = null;
        this.sourceData = [];
        this.approve_Stat = approve_Stat;
        this.sourceDataFunc = sourceDataFunc;  
        this.tableVar = tableVar;
    }

    init() {
        let start = moment().subtract(29, 'days');
        let end = moment();

        $(this.elementId).daterangepicker({ 
            alwaysShowCalendars: true, 
            startDate: start, 
            endDate: end, 
            applyClass: "btn-primary", 
            autoApply: false, 
            ranges: { 
                'Today': [moment(), moment()], 
                'Yesterday': [
                    moment().subtract(1, 'days'), 
                    moment().subtract(1, 'days')
                ], 
                'Last 7 Days': [
                    moment().subtract(6, 'days'), 
                    moment()
                ], 
                'This Month': [
                    moment().startOf('month'), 
                    moment().endOf('month')
                ], 
                'Last Month': [ 
                    moment().subtract(1, 'month').startOf('month'), 
                    moment().subtract(1, 'month').endOf('month') 
                ] 
            } 
        }, 
        (start, end, label) => { 
            this.updateLabel(start, end); 
            this.startPickDate = start.format('YYYY-MM-DD'); 
            this.endPickDate = end.format('YYYY-MM-DD'); 
        });

        $(this.elementId).on('apply.daterangepicker', (ev, picker) => {
            this.executeDate(picker);
        });
    }

    updateLabel(start, end) {
        if (start.format('MMMM D, YYYY') === end.format('MMMM D, YYYY')) {
            let days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
            let dayOfWeek = days[new Date(start.format('MMMM D, YYYY')).getDay()];
            $(`${this.elementId} span`).html(
                `${dayOfWeek} | ${start.format('MMMM D, YYYY')}`
            );
        } else {
            $(`${this.elementId} span`).html(
                `${start.format('MMMM D, YYYY')} - ${end.format('MMMM D, YYYY')}`
            );
        }
    }

    executeDate(picker){
        Swal.fire({
            html: "Please Wait... Getting Data...",
            timerProgressBar: true,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        setTimeout(() => {
            const start = picker.startDate.format('YYYY-MM-DD');
            const end = picker.endDate.format('YYYY-MM-DD');
            this.updateLabel(moment(start), moment(end)); 
            
            this.sourceData = this.sourceDataFunc(start, end, this.approve_Stat, this.tableVar); 
        }, 2000);
    }
}

class DatatableApp {
    constructor(tableId, searchId, dropdownBtnclass, fileTitle) {
        this.tableId = tableId;
        this.searchId = searchId;
        this.dropdownBtnclass = dropdownBtnclass;
        this.fileTitle = fileTitle;
        this.dataSource = [];
        this.tableInstance = null;
    }

    init() {
        this.tableInstance = $(`#${this.tableId}`).DataTable({
            dom: 't<"d-flex justify-content-between" i<"datatableBottomDiv" p>>',
            responsive: false,
            data: this.dataSource,
            scrollX: true,
            ordering: true,
            order: [[6, 'desc']],
            language: {
                search: "<i class='fa-solid fa-magnifying-glass search-icon'></i>",
                searchPlaceholder: "Search",
                paginate: {
                    previous: "<i class='fa-solid fa-caret-left'></i>",
                    next: "<i class='fa-solid fa-caret-right'></i>"
                }
            },
            columns: [
                { data: "mdCode", title: "MdCode" },
                { 
                    data: "DefaultOrdType", 
                    title: "Salesman Type",
                    render: function(data, type, row){
                        return (data)? salesmanType(data) : '---';
                    } 
                },
                { data: "mdName", title: "Salesman" },
                { data: "transactionID", title: "Transaction ID" },
                { data: "custCode", title: "Customer Code" },
                { data: "custName", title: "Customer Name" },
                { 
                    data: "transDate", 
                    title: "Transaction Date",
                    render: function (data, type, row) {
                        if (!data) return '';
                        if (type === 'sort' || type === 'type') { return data; }

                        const d = new Date(data);
                        return d.toLocaleString('en-US', datetime_options);
                    }
                },
                { data: "totalAmount", title: "Total Amount" },
                { data: "totalBO", title: "Total BO Amount" },
                { 
                    data: null, 
                    title: "Allowable BO Amount",
                    render: function(data, type, row){
                        if(row.totalAmount && row.totalBO){
                            var boPercent = (row.AllowedBOPercentage)?? 0.6;

                            var allowableAmt = parseFloat(row.totalAmount)*(boPercent/100);
                            
                            return formatCurrency(allowableAmt) + ' <b> (' + boPercent + '%)</b>';
                        }
                    }
                },
                { 
                    data: null, 
                    title: "Excess BO Amount",
                    render: function(data, type, row){
                        if(row.totalAmount && row.totalBO){
                            var boPercent = (row.AllowedBOPercentage)?? 0.6;

                            var allowableAmt = parseFloat(row.totalAmount)*(boPercent/100);
                            var balance = parseFloat(row.totalBO) - allowableAmt
                            

                            return formatCurrency(balance);
                        }
                    }
                },
                // { data: "Notation", title: "Notation" },
                { 
                    data: "isBOExceed", 
                    title: "is Exceed",
                    render: function(data) {
                        if (data && data == 1){
                            return `<span class="badge rounded-pill py-1 mx-2" style='width:50px; font-size:9px; text-align:center; color: #df3639; border: 1px solid #df3639; background-color: #efcdc4;'>Yes</span>`;
                        } else {
                            return `<span class="badge rounded-pill py-1 mx-2" style='width:50px; font-size:9px; text-align:center; color: #22bb33; border: 1px solid #22bb33; background-color: #caf8d2;'>No</span>`;
                        }
                    }
                },
                { 
                    data: "BOApproved_stat", 
                    title: "Approval Status",
                    render: function(data, type, row) {
                        if(row.DefaultOrdType == 'B'){
                            if (data && data == "N"){
                                return `<span class="badge rounded-pill py-1 mx-2" style='width:50px; font-size:9px; text-align:center; color: #ff9c07; border: 1px solid #ff9c07; background-color: #f2dbb3;'>Pending</span>`;
                            } else if (data && data == "Y"){
                                return `<span class="badge rounded-pill py-1 mx-2" style='width:60px; font-size:9px; text-align:center; color: #22bb33; border: 1px solid #22bb33; background-color: #caf8d2;'>Approved</span>`;
                            } else {
                                return `<span class="badge rounded-pill py-1 mx-2" style='width:50px; font-size:9px; text-align:center; color: #df3639; border: 1px solid #df3639; background-color: #efcdc4;'>Rejected</span>`;
                            }
                        } else {
                            return `<span class="badge rounded-pill py-1 mx-2" style='width:115px; font-size:9px; text-align:center; color: #22bb33; border: 1px solid #22bb33; background-color: #caf8d2;'>No Approval Required</span>`;
                        }
                    }
                },
                { data: "BOApproved_date", title: "Approved Date" },
                { 
                    data: "BOApproved_remarks", 
                    title: "Remarks",
                    render: function(data) {
                        return (data)? data : "---";
                    }
                }
            ],
            buttons: [ 
                {
                    extend: 'excel',
                    title: 'BO_Report',
                    filename: `BO_Report_${this.fileTitle}_` + moment().format('YYYYMMDD_HHmm'),
                    exportOptions: {
                        format: {
                            body: function (data, row, column, node) {
                                // Strip HTML tags
                                let plainText = typeof data === 'string'
                                    ? data.replace(/<[^>]*>/g, '') // remove HTML tags
                                    : data;

                                // Remove peso sign and commas
                                plainText = plainText.toString().replace(/[₱,\s]/g, '');

                                return plainText;
                            }
                        }
                    }
                },
                {
                    extend: 'csv',
                    title: 'BO_Report',
                    filename: `BO_Report_${this.fileTitle}_` + moment().format('YYYYMMDD_HHmm'),
                    exportOptions: {
                        format: {
                            body: function (data, row, column, node) {
                                // Strip HTML tags
                                let plainText = typeof data === 'string'
                                    ? data.replace(/<[^>]*>/g, '') // remove HTML tags
                                    : data;

                                // Remove peso sign and commas
                                plainText = plainText.toString().replace(/[₱,\s]/g, '');

                                return plainText;
                            }
                        }
                    }
                },
                'print', 'copy'
            ],
            columnDefs: [
                {
                    targets: [11, 12],
                    className: 'text-center'
                },
                {
                    targets: [7, 8, 9, 10],
                    className: 'text-end text-nowrap'
                },
                {
                    targets: [7, 8],
                    render: function (data) {
                        // return '₱ ' + Number(parseFloat(data).toFixed(2)).toLocaleString();
                        return formatCurrency(parseFloat(data));
                    }
                },
            ]
        });

        $(`#${this.searchId}`).on('input', (e) => {
            const value = e.target.value; // current input
            this.tableInstance.search(value).draw();

            // If you want the filtered dataset for extra logic:
            const filteredData = this.tableInstance.rows({ search: 'applied' }).data();
            console.log(filteredData);
        });

        $(`.${this.dropdownBtnclass} .btnExcel`).on('click', () => {
            this.tableInstance.button('.buttons-excel').trigger();
        });
        $(`.${this.dropdownBtnclass} .btnCSV`).on('click', () => {
            this.tableInstance.button('.buttons-csv').trigger();
        });
        $(`.${this.dropdownBtnclass} .btnPrint`).on('click', () => {
            this.tableInstance.button('.buttons-print').trigger();
        });
        $(`.${this.dropdownBtnclass} .btnCopy`).on('click', () => {
            this.tableInstance.button('.buttons-copy').trigger();
        });

        this.attachRowClick();
    }

    attachRowClick() {
        const self = this;
        $(`#${this.tableId} tbody`).on('click', 'tr', function () {
            Swal.fire({
                html: "Please Wait... Preparing Data...",
                timerProgressBar: true,
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                    setTimeout(() => {
                        let row = self.tableInstance.row(this);     
                        rowData = row.data();  
                        let transacID = rowData.transactionID;

                        $('#modal_transacID').html(rowData.transactionID);
                        $('#hiddenTransacID').val(rowData.transactionID);
                        $('#modal_sentDate').html(rowData.sentDate);
                        $('#modal_salesman').html(rowData.mdName);
                        $('#modal_customer').html(rowData.custName);
                        $('#modal_totalBO').html("₱"+rowData.totalBO);

                        rowData.boPercent = rowData.AllowedBOPercentage ?? 0.6;
                        rowData.allowableAmt = parseFloat(rowData.totalAmount) * (rowData.boPercent / 100);
                        rowData.excess = parseFloat(rowData.totalBO) - rowData.allowableAmt;
                        $('#modal_allowableBO').html("₱"+rowData.allowableAmt+" (<b>"+rowData.boPercent+"%)</b>");
                        $('#modal_excessBO').html("₱"+rowData.excess);
                        console.log(rowData.boPercent, rowData.allowableAmt, rowData.excess);

                        (rowData.BOApproved_stat != 'N')? $('.statusModalBtn').hide() : $('.statusModalBtn').show();

                        requestBOItems(transacID, tableDataBOitems);
                    }, 1000);
                },
            });
        });
    }
}

function formatCurrency(value) {
    if (value == null || value === "") return "₱ 0";

    let numStr = value.toString(); 
    let [intPart, decPart] = numStr.split(".");

    // format integer part with commas
    intPart = parseInt(intPart, 10).toLocaleString('en-US');

    return decPart ? `₱ ${intPart}.${decPart}` : `₱ ${intPart}`;
}

function calculateBO_Rows(data) {
    var finalSourceData = [];

    for (var x = 0; x < data.length; x++) {
        row = data[x];  
        var quantity = parseInt(row.quantity);
        var convFactor = parseInt(row.ConvertionFactor);
        var piecePriceGross = parseFloat(row.piecePrice_Gross);
        var discount = row.discount ? parseFloat(row.discount) : 0;

        var displayQty = quantity / convFactor;
        var displayAmt = piecePriceGross * convFactor;

        var amount = roundingOff(displayAmt, 3);
        var totalAmountGross = amount * displayQty;
        totalAmountGross = roundingOff(totalAmountGross, 2);

        var discountAmt = totalAmountGross * discount / 100;
        discountAmt = roundingOff(discountAmt, 2);

        var totalAmt = totalAmountGross - discountAmt;
        totalAmt = roundingOff(totalAmt, 2);
        
        var linePiecePrice = totalAmt/quantity;
        linePiecePrice = roundingOff(linePiecePrice, 2);

        row.lineTotal = totalAmt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        row.linePiecePrice = linePiecePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        row.qtyConversion = displayQty;
        finalSourceData.push(row);
    }
    tableDataBOitems.clear().rows.add(finalSourceData).draw();
}

function roundingOff(value, numOfDigits) {
    if (isNaN(value) || isNaN(numOfDigits)) return null;
    const factor = Math.pow(10, numOfDigits);
    return Math.round(value * factor) / factor;
}


let pendingTable = new DatatableApp("tableData_pending", 'searchBtn_pending', 'pendingbo', 'Pending');
let rejectedTable = new DatatableApp("tableData_rejected", 'searchBtn_rejected', 'rejectedbo', 'Rejected');
let approvedTable = new DatatableApp("tableData_approved", 'searchBtn_approved', 'approvedbo', 'Approved');

// Initialize
pendingTable.init();
rejectedTable.init();
approvedTable.init();

const datePickerPending = new DatePicker("#reportrangePending", 'N', requestSource, pendingTable.tableInstance);
const datePickerRejected = new DatePicker("#reportrangeRejected", 'R', requestSource, rejectedTable.tableInstance);
const datePickerApproved = new DatePicker("#reportrangeApproved", 'Y', requestSource, approvedTable.tableInstance);

// Initialize
datePickerPending.init();
datePickerRejected.init();
datePickerApproved.init();

