var reportsConstants = [
    // {
    //     cardHeader: "Transaction Ledger",
    //     imgSrc: "img/reports03_TransacLedger.png",
    //     imgAlt: "reports03_TransacLedger.png",
    //     href: "transactionLedger"
    // },
    
    
    // {
    //     cardHeader: "Stock Request",
    //     imgSrc: "img/reports07_StockRequest.png",
    //     imgAlt: "reports07_StockRequest.png",
    //     href: "stockReq"
    // },
    // {
    //     cardHeader: "Unuploaded",
    //     imgSrc: "img/reports08_unuploaded.png",
    //     imgAlt: "reports08_unuploaded.png",
    //     href: "unuploaded"
    // },
    // {
    //     cardHeader: "Jobber",
    //     imgSrc: "img/reports12_jobber.png",
    //     imgAlt: "reports12_jobber.png",
    //     href: "jobber"
    // },
    {
        cardCategory: "SalesManagement",
        cardHeader: "Sales Returns (BO)",
        imgSrc: "img/reports09_BO.png",
        imgAlt: "reports09_BO.png",
        href: "bo"
    },
    {
        cardCategory: "SalesManagement",
        cardHeader: "Sales Returns (RGS)",
        imgSrc: "img/reports09_BO.png",
        imgAlt: "reports09_BO.png",
        href: ""
    },
    {
        cardCategory: "SalesManagement",
        cardHeader: "Daily Collection Report",
        imgSrc: "img/reports06_dailyCollection.png",
        imgAlt: "reports06_dailyCollection.png",
        href: "dcr"
    },
    {
        cardCategory: "SalesManagement",
        cardHeader: "Daily Sales Report",
        imgSrc: "img/reports05_DSR.png",
        imgAlt: "reports05_DSR.png",
        href: "dsr"
    },
    {
        cardCategory: "SalesManagement",
        cardHeader: "Daily Sales Remmitance Report",
        imgSrc: "img/reports05_DSR.png",
        imgAlt: "reports05_DSR.png",
        href: "dsrr"
    },
    {
        cardCategory: "SalesManagement",
        cardHeader: "Offsite Transactions",
       imgSrc: "img/reports02_salesAudit.png",
        imgAlt: "reports02_salesAudit.png",
        href: "offsitetransactions"
    },
    {
        cardCategory: "SalesManagement",
        cardHeader: "Hold Orders",
       imgSrc: "img/reports02_salesAudit.png",
        imgAlt: "reports02_salesAudit.png",
        href: "pendingRequest"
    },
    {
        cardCategory: "SalesManagement",
        cardHeader: "Sales Summary",
        imgSrc: "img/reports02_salesAudit.png",
        imgAlt: "reports02_salesAudit.png",
        href: "salesAudit"
    },
    {
        cardCategory: "SalesManagement",
        cardHeader: "Sales Report",
        imgSrc: "img/reports01_salesReports.png",
        imgAlt: "reports01_salesReports.png",
        href: "salesReport"
    },
    {
        cardCategory: "SalesManagement",
        cardHeader: "Pending Orders",
        imgSrc: "img/reports04_unproOrders.png",
        imgAlt: "reports04_unproOrders.png",
        href: "unproOrders"
    },
    {
        cardCategory: "InvManagement",
        cardHeader: "Inventory Valuation",
        imgSrc: "img/reports11_invValuation.png",
        imgAlt: "reports11_invValuation.png",
        href: "invValuation"
    },
    {
        cardCategory: "InvManagement",
        cardHeader: "Store Inventory",
        imgSrc: "img/reports02_salesAudit.png",
        imgAlt: "reports02_salesAudit.png",
        href: "stockCheck"
    },
    {
        cardCategory: "InvManagement",
        cardHeader: "Placement Check",
        imgSrc: "img/reports10_stockTake.png",
        imgAlt: "reports10_stockTake.png",
        href: "stocktake"
    },
    {
        cardCategory: "AuditTrail",
        cardHeader: "Salesman Data Sync",
        imgSrc: "img/reports13_syncReport.png",
        imgAlt: "reports13_syncReport.png",
        href: "syncReport"
    },
]

var maintenanceConstants = [
    // {
    //     cardHeader: "Data",
    //     imgSrc: "img/maintenance01_data.png",
    //     imgAlt: "maintenance01_data.png",
    //     href: "dataMaintenance",
    //     modal: ""
    // },
    // {
    //     cardHeader: "Dynamic Load Planning",
    //     imgSrc: "img/reports11_invValuation.png",
    //     imgAlt: "reports11_invValuation.png",
    //     href: "dynamicRouting",
    //     modal: ""
    // },
    // {
    //     cardHeader: "Must Carry",
    //     imgSrc: "img/maintenance10_mcp.png",
    //     imgAlt: "maintenance10_mcp.png",
    //     href: "mustcarry",
    //     modal: ""
    // },
    // {
    //     cardHeader: "MCP Calibration",
    //     imgSrc: "img/maintenance10_mcp.png",
    //     imgAlt: "maintenance10_mcp.png",
    //     href: "mcpCalibration",
    //     modal: ""
    // },
    // {
    //     cardCategory: "Product",
    //     cardHeader: "BTDT Product",
    //     imgSrc: "img/maintenance07_BTDT.png",
    //     imgAlt: "maintenance07_BTDT.png",
    //     href: "btdtProduct",
    //     modal: ""
    // },
    {
        cardCategory: "Customer",
        cardHeader: "Customer",
        imgSrc: "img/maintenance02_customer.png",
        imgAlt: "maintenance02_customer.png",
        href: "customer",
        modal: ""
    },
    {
        cardCategory: "Customer",
        cardHeader: "CMF",
        imgSrc: "img/maintenance03_CMF.png",
        imgAlt: "maintenance03_CMF.png",
        href: "cmf",
        modal: ""
    },
    {
        cardCategory: "Customer",
        cardHeader: "Georeset",
        imgSrc: "img/maintenance04_georeset.png",
        imgAlt: "maintenance04_georeset.png",
        href: "",
        modal: "georesetModal"
    },
    {
        cardCategory: "Customer",
        cardHeader: "Customer Tagging",
        imgSrc: "img/maintenance08_customerTagging.png",
        imgAlt: "maintenance08_customerTagging.png",
        href: "customerTagging",
        modal: ""
    },
    {
        cardCategory: "Customer",
        cardHeader: "MCP Layout",
        imgSrc: "img/maintenance11_mcpLayout.png",
        imgAlt: "maintenance11_mcpLayout.png",
        href: "mcpLayout",
        modal: ""
    },
     {
        cardCategory: "Customer",
        cardHeader: "Channel Mapping",
        imgSrc: "img/maintenance03_CMF.png",
        imgAlt: "maintenance03_CMF.png",
        href: "customerchannelmapping",
        modal: ""
    },
    {
        cardCategory: "Product",
        cardHeader: "Product",
        imgSrc: "img/maintenance06_produt.png",
        imgAlt: "maintenance06_produt.png",
        href: "product",
        modal: ""
    },
    {
        cardCategory: "Product",
        cardHeader: "Placement",
        imgSrc: "img/maintenance10_mcp.png",
        imgAlt: "maintenance10_mcp.png",
        href: "placementMaint",
        modal: ""
    },
    {
        cardCategory: "Product",
        cardHeader: "Must Carry",
        imgSrc: "img/reports10_stockTake.png",
        imgAlt: "reports10_stockTake.png",
        href: "mustcarry",
        modal: ""
    },
    {
        cardCategory: "Others",
        cardHeader: "Bank",
        imgSrc: "img/maintenance09_bank.png",
        imgAlt: "maintenance09_bank.png",
        href: "bankmaintenance",
        modal: ""
    },
    {
        cardCategory: "Others",
        cardHeader: "Salesman",
        imgSrc: "img/maintenance02_customer.png",
        imgAlt: "maintenance02_customer.png",
        href: "salesman",
        modal: ""
    },
    // {
    //     cardCategory: "Others",
    //     cardHeader: "Dynamic Load Planning",
    //     imgSrc: "img/reports11_invValuation.png",
    //     imgAlt: "reports11_invValuation.png",
    //     href: "dynamicRouteList",
    //     modal: ""
    // },
    {
        cardCategory: "Others",
        cardHeader: "Sales Objective",
        imgSrc: "img/maintenance05_salesman.png",
        imgAlt: "maintenance05_salesman.png",
        href: "salesTarget",
        modal: ""
    },
]

$(document).ready(async function () {
    var cred_delimeter = localStorage.getItem("REGULARUSER");
    var iconPageLogo = "img/mybuddyLogo.jpg";
    var companyLogo = "img/mybuddyLogo.jpg";
    var navbarDiv = $('#navbarCompanyDetails');
    var navbarDropdownDiv = $('.navbarDropdowns');
    var sidebarDiv = $('.offcanvas_headTitleDiv');
    var sidebarTabDiv = $('#sidebarTabItems');
    var dashboardPopUp = $('#dashboard_headTitleDiv');
    var reportsMainDiv = $('.mainReportsRowColDiv');
    var reportsSalesMngmntDiv = $('.reportsSalesMngmntDiv');
    var reportsInvMngmntDiv = $('.reportsInvMngmntDiv');
    var reportsAuditTrailDiv = $('.reportsAuditTrailDiv');
    var maintenanceMainDiv = $('.mainConstantRowColDiv');
    var maintenanceCustDiv = $('.maintenanceCustDiv');
    var maintenanceProdDiv = $('.maintenanceProdDiv');
    var maintenanceOthDiv = $('.maintenanceOthDiv');

    // PAGE ICON
    $('.pageIconLink').attr('href', iconPageLogo);

    // NAVBAR
    navbarDiv.html(`
        <img src=${companyLogo} alt="applicationLogo" width="55" height="55" style="border-radius: 10px; margin-left:20px">
        <div class="logoTextDiv">
            <h6 class="textHeader"><span class="textHeaderRed" style="color: #FF9800; !imporant;">RAVA</span>mate</h6>
            <span class="textSubHeader">Your Everyday Selling Partner</span>
        </div>
    `)

    navbarDropdownDiv.html(`
        <div class="dropdown">
            <button class="btn animated-border-btn" type="button" data-bs-toggle="dropdown" aria-expanded="false" style="color: var(--cust-white); font-size: 18px;">
                <span class="mdi mdi-bell"></span>
                <span class="border top"></span>
                <span class="border right"></span>
                <span class="border bottom"></span>
                <span class="border left"></span>
            </button>
            <ul class="dropdown-menu" style="left: auto; right: 0;">
                <li><a class="dropdown-item" href="#"></a></li>
                <li><a class="dropdown-item" href="#"></a></li>
                <li><a class="dropdown-item" href="#"></a></li>
            </ul>
        </div>
        <div class="dropdown">
            <button class="btn animated-border-btn" type="button" data-bs-toggle="dropdown" aria-expanded="false" style="color: var(--cust-white); font-size: 18px;">
                <span class="mdi mdi-account-circle"></span>
                <span class="border top"></span>
                <span class="border right"></span>
                <span class="border bottom"></span>
                <span class="border left"></span>
            </button>
            <ul class="dropdown-menu" style="left: auto; right: 0;">
                <li><a class="dropdown-item" href="https://ravamate.com/SFA/v2/profileAccount">My Account</a></li>
                <li id="admin-logout-btn" onclick='logoutFunc()'><a class="dropdown-item" href="#" >Log out</a></li>
            </ul>
        </div>
    `).css({"display":"flex"});

    // SIDEBAR (OFFCANVAS)
    sidebarDiv.html(`
        <img src=${companyLogo} alt="applicationLogo" height="80px">
        <h2 class="offcanvasHeader"><span class="offcanvasHeaderRed" style="color: #FF9800; !imporant;">RAVA</span>mate</h2>
        <h4 class="offcanvasSubHeader">Your Everyday Selling Partner</h4>
    `)

    // SIDEBAR TABS
    sidebarTabDiv.html(`
        <div class="sidebar_dashboard">
            <a href="dashboard" class="list-group-item list-group-item-action d-flex">
                <span class="mdi mdi-monitor-dashboard"></span>
                <p class="px-2" style="margin-bottom: 0;">Dashboard</p>
            </a>
        </div>
        <div class="sidebar_dashboard">
            <a href="analytics_temp" class="list-group-item list-group-item-action d-flex">
                <span class="mdi mdi-google-analytics"></span>
                <p class="px-2" style="margin-bottom: 0;">Analytics</p>
            </a>
        </div>
        <div class="sidebar_dashboard">
            <a href="mapScreen" class="list-group-item list-group-item-action d-flex">
                <span class="mdi mdi-map-marker-radius"></span>
                <p class="px-2" style="margin-bottom: 0;">Digital Mapping</p>
            </a>
        </div>
        <div class="dropdownItem sidebar_reports_dropdown">
            <div href="" class="list-group-item list-group-item-action d-flex align-baseline submenu-btn">
                <span class="mdi mdi-file-multiple"></span>
                <p class="px-2" style="margin-bottom: 0;">Reports</p>
                
                <span class="mdi mdi-menu-down dropdownIcon ms-auto"></span>
            </div>
            <div class="sub-menu">
                <div class="list-group-item list-group-item-action d-flex align-baseline childmenu-btn">
                    <span class="mdi mdi-file-multiple"></span>
                    <p class="px-2" style="margin-bottom: 0;">Sales Management</p>
                    <span class="mdi mdi-menu-down ms-auto"></span>
                </div>
                <div class="child-menu">
                    <a href="dcr" class="list-group-item list-group-item-action">
                        Daily Collection Report
                    </a>
                    <a href="dsr" class="list-group-item list-group-item-action">
                        Daily Sales Report
                    </a>
                    <a href="dsrr" class="list-group-item list-group-item-action">
                        Daily Sales Remmitance Report
                    </a>
                    <a href="ecmf" class="list-group-item list-group-item-action">
                        Electronic CMF
                    </a>
                    <a href="pendingbo" class="list-group-item list-group-item-action ">
                        <span class="position-relative" style='padding-right:10px;'>
                            Hold Bad Orders 
                            <span id='holdOrdersBadge' class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                -
                            </span>
                        </span>
                    </a>
                    <a href="pendingRequest" class="list-group-item list-group-item-action">
                        <span class="position-relative" style='padding-right:10px;'>
                            Hold Sales Orders
                            <span id='holdSOBadge' class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                -
                            </span>
                        </span>
                    </a>
                    <a href="misscall" class="list-group-item list-group-item-action">
                        Missed Calls
                    </a>
                    <a href="offsitetransactions" class="list-group-item list-group-item-action">
                        Offsite Transactions
                    </a>
                    <a href="unproOrders" class="list-group-item list-group-item-action">
                        Pending Orders
                    </a>
                    <a href="salesReport" class="list-group-item list-group-item-action">
                        Sales Report
                    </a>
                    <a href="bo" class="list-group-item list-group-item-action">
                        Sales Returns (BO)
                    </a>
                    <a href="rgs" class="list-group-item list-group-item-action">
                        Sales Returns (RGS)
                    </a>
                    <a href="salesAudit" class="list-group-item list-group-item-action">
                        Sales Summary
                    </a>
                </div>
                <div class="list-group-item list-group-item-action d-flex align-baseline childmenu-btn">
                    <span class="mdi mdi-file-multiple"></span>
                    <p class="px-2" style="margin-bottom: 0;">Inventory Management</p>
                    <span class="mdi mdi-menu-down ms-auto"></span>
                </div>
                <div class="child-menu">
                    <a href="invValuation" class="list-group-item list-group-item-action">
                       Inventory Valuation
                    </a>
                    <a href="stocktake" class="list-group-item list-group-item-action">
                        Placement Check
                    </a>
                    <a href="stockCheck" class="list-group-item list-group-item-action">
                        Store Inventory
                    </a>
                </div>
                <div class="list-group-item list-group-item-action d-flex align-baseline childmenu-btn">
                    <span class="mdi mdi-file-multiple"></span>
                    <p class="px-2" style="margin-bottom: 0;">Audit Trail</p>
                    <span class="mdi mdi-menu-down ms-auto"></span>
                </div>
                <div class="child-menu">
                    <a href="syncReport" class="list-group-item list-group-item-action">
                       Salesman Data Sync
                    </a>
                </div>
                <div class="list-group-item list-group-item-action d-flex align-baseline childmenu-btn">
                    <span class="mdi mdi-file-multiple"></span>
                    <p class="px-2" style="margin-bottom: 0;">Others</p>
                    <span class="mdi mdi-menu-down ms-auto"></span>
                </div>
                <div class="child-menu">
                    <a href="deliveryMonitoring" class="list-group-item list-group-item-action">
                       Delivery Monitoring
                    </a>
                    <a href="prebookingdeliverymonitoring" class="list-group-item list-group-item-action">
                       Prebooking Delivery Monitoring Report
                    </a>
                </div>
            </div
        </div>
        
        <div class="dropdownItem sidebar_maintenance_dropdown">
            <div href="" class="list-group-item list-group-item-action d-flex align-baseline submenu-btn">
                <span class="mdi mdi-cog-outline"></span>
                <p class="px-2" style="margin-bottom: 0;">Maintenance</p>
                
                <span class="mdi mdi-menu-down dropdownIcon ms-auto"></span>
            </div>
            <div class="sub-menu">
                <div href="" class="sidemenu-option side-menu-option1 shown">
                    <a href="maintenance" class="list-group-item list-group-item-action d-flex align-baseline submenu-item ">
                        <span class="mdi mdi-wrench-cog"></span>
                        <p class="px-2" style="margin-bottom: 0;">Data Maintenance</p>
                    </a>
                </div>
                <div href="" class="sidemenu-option side-menu-option2 shown">
                    <a href="dataMaintenance_eric" class="list-group-item list-group-item-action d-flex align-baseline submenu-item ">
                        <span class="mdi mdi-archive-sync"></span>
                        <p class="px-2" style="margin-bottom: 0;">Eric Data Alignment</p>
                    </a>
                </div>
                <div href="" class="sidemenu-option side-menu-option3 shown">
                    <a href="dataMaintenance_sfaqueing" class="list-group-item list-group-item-action d-flex align-baseline submenu-item ">
                        <span class="mdi mdi-file-sync"></span>
                        <p class="px-2" style="margin-bottom: 0;">SFA Queuing</p>
                    </a>
                </div>
            </div>
        </div>

        <div class="dropdownItem sidebar_changesite_dropdown" style="display:none">
            <div href="" class="list-group-item list-group-item-action d-flex align-baseline submenu-btn">
                <span class="mdi mdi-map-marker-distance"></span>
                <p class="px-2" style="margin-bottom: 0;">Change Site</p>
                
                <span class="mdi mdi-menu-down dropdownIcon ms-auto"></span>
            </div>
            <div class="sub-menu sidemenu_changesite">
            </div>
        </div>
    `)

    $('.submenu-btn').click(function(){
        $(this).next('.sub-menu').slideToggle();
        $(this).find('.dropdownIcon').toggleClass('iconRotate');
    })

    $('.childmenu-btn').click(function(){
        $(this).next('.child-menu').slideToggle();
        $(this).toggleClass('active');
    });

    // DASHBOARD LOGO
    dashboardPopUp.html(`
        <img class="popUpLogo" src="img/mybuddyLogo.jpg" alt="mybuddyLogo">
        <h2 class="defaultPopUpScreenHeader"><span class="defaultPopUpScreenHeaderRed" style="color: #FF9800; !imporant;">RAVA</span>mate</h2>
        <h4 class="defaultPopUpScreenSubHeader">Your Everyday Selling Partner</h4>
    `);

    // REPORTS
    $.each(reportsConstants, function(index, cardDetails) {
        var content= `
            <div class="col ">
                <div class="card h-100 mainCards">
                    <div class="card-header">${cardDetails.cardHeader}</div>
                    <div class="card-body">
                        <div class="innerRoundDiv">
                            <img src="${cardDetails.imgSrc}" alt="${cardDetails.imgAlt}" width="80px" height="80px">
                        </div>
                    </div>
                    <div class="card-body-overlay">
                        <a href="${cardDetails.href}" class="shine-button">See Details</a>
                    </div>
                </div>
            </div>
        `;
        
        switch (cardDetails.cardCategory) {
            case "SalesManagement":
                reportsSalesMngmntDiv.append(content);
                break;
            case "InvManagement":
                reportsInvMngmntDiv.append(content);
                break;
            case "AuditTrail":
                reportsAuditTrailDiv.append(content);
                break;
            default:
                console.log("Unknown status.");
        }
        
    });

    // MAINTENANCE
    $.each(maintenanceConstants, function(index, cardDetails) {
        var link = cardDetails.href 
            ? `<a href="${cardDetails.href}" class="shine-button">See Details</a>` 
            : `<a href="" data-bs-toggle="modal" data-bs-target="#${cardDetails.modal}" class="shine-button">See Details</a>`;
    
        var content = `
            <div class="col">
                <div class="card h-100 mainCards">
                    <div class="card-header">${cardDetails.cardHeader}</div>
                    <div class="card-body">
                        <div class="innerRoundDiv">
                            <img src="${cardDetails.imgSrc}" alt="${cardDetails.imgAlt}" width="80px" height="80px">
                        </div>
                    </div>
                    <div class="card-body-overlay">
                        ${link}
                    </div>
                </div>
            </div>
        `;
    
        switch (cardDetails.cardCategory) {
            case "Customer":
                maintenanceCustDiv.append(content);
                break;
            case "Product":
                maintenanceProdDiv.append(content);
                break;
            case "Others":
                maintenanceOthDiv.append(content);
                break;
            default:
                console.log("Unknown status.");
        }
        
    });

    // if(cred_delimeter == '' || cred_delimeter == null || cred_delimeter == 'null' ||
    // cred_delimeter == 'undefined' || cred_delimeter == undefined){
    //     window.location = GBL_DOMAIN;
    // }
    checkUserSession()
    availableDistributor();
    $(document).on("click", ".sidemenu-changesite-option", function () {
        let company = $(this).data("company");
        effectChangeDistributor(company);
    });
});

function logoutFunc() {
    function showLogoutDialog() {
        Swal.fire({
            icon: "question",
            title: "Confirm Logout",
            html: `<p>Do you really want to log out?</p><small style="color: gray;">Press 'Yes' to continue this action.</small>`,
            showDenyButton: true,
            confirmButtonText: "Yes, Logout",
            denyButtonText: `Cancel`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                // Clear local storage
                clearUserData();
                // updateOfflineStat();  
                // window.location = GBL_DOMAIN;
                window.location.replace(GBL_DOMAIN);
            }
        });
    }

    if (typeof window.Swal === 'undefined') {
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11";
        script.onload = () => {
            showLogoutDialog();
        };
        document.head.appendChild(script);
    } else {
        showLogoutDialog();
    }
}

function checkUserSession(){
    function showcheckUserDialog(){
        let path = window.location.pathname.split("#")[0];
        var segment = path.split('/').pop().replace('.html', '');

        const requiredKeys = ['DISTCODE', 'fullname', 'PRINCIPAL', 'user_id', 'usertype'];

        for (let key of requiredKeys) {
            let val = localStorage.getItem(key);
            if (!val) {
                return handleMissingSession();
            }
        }

        var usertype = localStorage.getItem("usertype");

        if(usertype == "WEB"){
            $(".sidebar_dashboard").show();
            $(".sidebar_reports_dropdown").show(); 
            $(".side-menu-option1").addClass("shown").show();
            $(".side-menu-option2").addClass("shown").show();
            $(".side-menu-option3").addClass("shown").show();
        } else if(usertype == "WEB_GUEST"){
            $(".sidebar_dashboard").show();
            $(".sidebar_reports_dropdown").show(); 
            $(".side-menu-option1").removeClass("shown").hide();
            $(".side-menu-option2").removeClass("shown").hide();
            $(".side-menu-option3").addClass("shown").show();
        } else if(usertype == "GUEST") {
            $(".sidebar_dashboard").hide();
            $(".sidebar_reports_dropdown").show(); 
            $(".side-menu-option1").removeClass("shown").hide();
            $(".side-menu-option2").removeClass("shown").hide();
            $(".side-menu-option3").addClass("shown").show();
        }

        const count = document.querySelectorAll('div.sidemenu-option.shown').length;

        if(count > 0){
            $(".sidebar_maintenance_dropdown").show();
        } else{
            $(".sidebar_maintenance_dropdown").hide();
        }

        const REPORTS_PAGES = [
            'bo','dailySalesSum','dcr','deliveryMonitoring','dsr','dsrr','ecmf',
            'exportTerritory','fastsosyo_calendar','fastsosyoactivations','fastsosyoTrans',
            'geoCallRate','invValuation','jobber','jobbercustomer','mapScreen','misscall',
            'offsitetransactions','pendingbo','pendingRequest','rangemon','rangesum','reports',
            'rgs','rtrns_to_erclogs','salesAudit','salesReport','skusalesdetails','stockCheck',
            'stockReq','stocktake','strikeRate','supportToolSosyo','syncReport','transactionLedger',
            'unproductive','unproOrders','unuploaded','voucherHistory','dataMaintenance_sfaqueing','dynamicRouteList', 'prebookingdeliverymonitoring'
        ];

        const MAP_PAGES = [
            'analytics_temp','dashboard'
        ];

        const MAINTENANCE_PAGES = [
            'analytics_temp','dashboard','adm_sync_logs','auto_to_ericlogs','bankmaintenance',
            'btdtProduct','cmf','customer','customerchannelmapping','customerTagging','customerTiering',
            'dataMaintenance','dataMaintenance_eric',
            'maintenance','mcpLayout','mustcarry','placementMaint','product','pymnts_to_erclogs',
            'salesman','salesTarget','so_to_erclogs',
        ];

        const GENERIC_PAGES = [
            'profileAccount'
        ]

        const ACCESS_RULES = {
            GUEST: [...REPORTS_PAGES, ...GENERIC_PAGES],  
            WEB_GUEST: [...MAP_PAGES, ...REPORTS_PAGES, ...GENERIC_PAGES],
            WEB: [...MAP_PAGES, ...REPORTS_PAGES, ...MAINTENANCE_PAGES, ...GENERIC_PAGES, ]
        };

        var allowedPages = ACCESS_RULES[usertype] || [];

        var segmentLower = segment.toLowerCase();
        var allowedPagesCaseLower = allowedPages.map(p => p.toLowerCase());

        if (!allowedPagesCaseLower.includes(segmentLower)) {
            if (typeof Swal !== "undefined") {
                Swal.fire({
                    title: "Oops...",
                    text: "You do not have permission to access this page.",
                    icon: "error",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    allowEnterKey: false,
                    timer: 5000,           
                    timerProgressBar: true,
                    backdrop: `rgba(0,0,0,0.93)`
                }).then(() => {
                    // window.location.href = "profileAccount.html";
                window.location.replace("profileAccount");

                });
            } else {
                alert("You do not have permission to access this page.");
                // window.location.href = "profileAccount.html";
                window.location.replace("profileAccount");
            }
            
            return;
        }
    }

    if (typeof window.Swal === 'undefined') {
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11";
        script.onload = () => {
            showcheckUserDialog();
        };
        document.head.appendChild(script);
    } else {
        showcheckUserDialog();
    }

    
}

function availableDistributor(){
    if(localStorage.getItem("usertype") == 'WEB'){
        $.ajax ({
            url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
            type: "POST",
            data: {"type":"GET_ADM_MLTPL_SITES", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
            dataType: "json",
            async: false,
            crossDomain: true,
            cache: false,            
            success: function(r){ 
                if(r){
                    var changesiteDiv = $('.sidemenu_changesite');
                    var content = '';

                    for(var x = 0; x < r.siteList.length; x++){
                        content += `
                            <div href="" class="sidemenu-changesite-option" data-company="${r.siteList[x].distCode}">
                                <a href="#" class="list-group-item list-group-item-action d-flex align-baseline submenu-item ">
                                    <span class="mdi mdi-map-marker-radius"></span>
                                    <p class="px-2" style="margin-bottom: 0;">${r.siteList[x].companyname}</p>
                                </a>
                            </div>`;
                    };

                    changesiteDiv.html(content);
                    $('.sidebar_changesite_dropdown').show();
                } else {
                    $('.sidebar_changesite_dropdown').hide();
                }
            }
        });    
    }
}

function effectChangeDistributor(company){
    localStorage.setItem("DISTCODE", company);
    window.location.reload();
}

function handleMissingSession() {
    if (typeof Swal !== "undefined") {
        Swal.fire({
            title: "Oops...",
            text: "Some data are missing from your previous session. Please log in again.",
            icon: "error",
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            timer: 5000,           
            timerProgressBar: true
        }).then(() => {
            clearUserData();
            // window.location.href = GBL_DOMAIN;
            window.location.replace(GBL_DOMAIN);
        });
    } else {
        alert("Some data are missing from your previous session. Please log in again.");
        clearUserData();
        // window.location.href = GBL_DOMAIN;
        window.location.replace(GBL_DOMAIN);
    }
    return;
}

function clearUserData(){
    [
        'adminUserName', 'username', 'usertype', 'latitude', 'longitude',
        'mapzoom', 'newlycreated', 'usrnm', 'srvr', 'psswrd', 'dtbse', 'fullname',
        'DISTCODE', 'fullname', 'PRINCIPAL', 'user_id', 'usertype'
    ].forEach(key => localStorage.removeItem(key));

    localStorage.clear();
}


function getcompname_dynamic(suffix, headerContainer){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"GET_COMPANYNAME", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        async: false,
        crossDomain: true,
        cache: false,            
        success: function(r){ 
            $(`#${headerContainer}`).html(r[0].company.toUpperCase() + (suffix ? ' | ' + suffix : ''));
            
            // updateUserSiteName(r[0].company.toUpperCase());
            // GBLCOMPNAMEHOLDER = r[0].company.toUpperCase();
            // GLOBALDISTDBNAME = r[0].DIST_INDI;
        },error: function(jqXHR, textStatus, errorThrown) {
            if(localStorage.getItem('DISTCODE')){
                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        title: "Opps...",
                        text: "Something went wrong on the server. Please contact administrator",
                        icon: "error",
                        allowOutsideClick: false,  
                        allowEscapeKey: false, 
                        allowEnterKey: false 
                    });
                } else {
                    alert('Something went wrong on the server. Please contact administrator');
                }
            } else{
                // checkUserSession();
            }
            
        }
    });
}



class PendingOrders {
    constructor(connInfo) {
        this.connInfo = connInfo;
    }

    fetchCount(apiType, badgeSelector) {
        $(badgeSelector).hide();

        $.ajax({
            // url: "https://fastdevs-api.com/BUDDYGBLAPI/MTDAPI/application.php",
            url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
            type: "POST",
            data: { type: apiType, "userID": GBL_USERID, "distCode": GBL_DISTCODE},
            dataType: "json",
            crossDomain: true,
            cache: false,
            async: true,
            success: function (r) {
                setTimeout(() => { //Provided timeout to make sure dom is already loaded.
                    var ctr = 0;
                    ctr = parseInt(r);

                    if (r > 999) {
                        $(badgeSelector).html("999+").show();
                    } else if (r > 99) {
                        $(badgeSelector).html("99+").show();
                    } else if (r > 0) {
                        $(badgeSelector).html(r).show();
                    } else {
                        $(badgeSelector).hide();
                    }
                }, 2000);
            },
            error: function () {
                console.error("Failed to fetch count for", apiType);
                $(badgeSelector).hide();
            }
        });
    }

    getPendingHoldOrders() {
        this.fetchCount("COUNT_HOLD_BO_PENDING", "#holdOrdersBadge");
    }

    getPendingSO() {
        this.fetchCount("COUNT_HOLD_SALESORDER_PENDING", "#holdSOBadge");
    }
}

const pendingOrdersCtr = new PendingOrders(con_info);

pendingOrdersCtr.getPendingHoldOrders();
pendingOrdersCtr.getPendingSO();