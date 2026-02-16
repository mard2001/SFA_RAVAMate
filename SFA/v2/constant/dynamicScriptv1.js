var reportsConstants = [
    {
        cardHeader: "Sales Reports",
        imgSrc: "img/reports01_salesReports.png",
        imgAlt: "reports01_salesReports.png",
        href: "salesReport"
    },
    {
        cardHeader: "Sales Audit",
        imgSrc: "img/reports02_salesAudit.png",
        imgAlt: "reports02_salesAudit.png",
        href: "salesAudit"
    },
    {
        cardHeader: "Transaction Ledger",
        imgSrc: "img/reports03_TransacLedger.png",
        imgAlt: "reports03_TransacLedger.png",
        href: "transactionLedger"
    },
    {
        cardHeader: "Unprocessed Orders",
        imgSrc: "img/reports04_unproOrders.png",
        imgAlt: "reports04_unproOrders.png",
        href: "unproOrders"
    },
    {
        cardHeader: "DSR",
        imgSrc: "img/reports05_DSR.png",
        imgAlt: "reports05_DSR.png",
        href: "dsr"
    },
    {
        cardHeader: "DSRR",
        imgSrc: "img/reports05_DSR.png",
        imgAlt: "reports05_DSR.png",
        href: "dsrr"
    },
    {
        cardHeader: "Daily Collection",
        imgSrc: "img/reports06_dailyCollection.png",
        imgAlt: "reports06_dailyCollection.png",
        href: "dcr"
    },
    {
        cardHeader: "Stock Request",
        imgSrc: "img/reports07_StockRequest.png",
        imgAlt: "reports07_StockRequest.png",
        href: "stockReq"
    },
    {
        cardHeader: "Unuploaded",
        imgSrc: "img/reports08_unuploaded.png",
        imgAlt: "reports08_unuploaded.png",
        href: "unuploaded"
    },
    {
        cardHeader: "BO",
        imgSrc: "img/reports09_BO.png",
        imgAlt: "reports09_BO.png",
        href: "bo"
    },
    {
        cardHeader: "Stocktake",
        imgSrc: "img/reports10_stockTake.png",
        imgAlt: "reports10_stockTake.png",
        href: "stocktake"
    },
    {
        cardHeader: "Inventory Valuation",
        imgSrc: "img/reports11_invValuation.png",
        imgAlt: "reports11_invValuation.png",
        href: "invValuation"
    },
    {
        cardHeader: "Jobber",
        imgSrc: "img/reports12_jobber.png",
        imgAlt: "reports12_jobber.png",
        href: "jobber"
    },
    {
        cardHeader: "Sync Report",
        imgSrc: "img/reports13_syncReport.png",
        imgAlt: "reports13_syncReport.png",
        href: "syncReport"
    },
    {
        cardHeader: "Stock Check",
        imgSrc: "img/reports02_salesAudit.png",
        imgAlt: "reports02_salesAudit.png",
        href: "stockCheck"
    },
    {
        cardHeader: "Pending SO",
       imgSrc: "img/reports02_salesAudit.png",
        imgAlt: "reports02_salesAudit.png",
        href: "pendingRequest"
    },
    {
        cardHeader: "Offsite Transactions",
       imgSrc: "img/reports02_salesAudit.png",
        imgAlt: "reports02_salesAudit.png",
        href: "offsitetransactions"
    },
]

var maintenanceConstants = [
    {
        cardHeader: "Data",
        imgSrc: "img/maintenance01_data.png",
        imgAlt: "maintenance01_data.png",
        href: "dataMaintenance",
        modal: ""
    },
    {
        cardHeader: "Customer",
        imgSrc: "img/maintenance02_customer.png",
        imgAlt: "maintenance02_customer.png",
        href: "customer",
        modal: ""
    },
    {
        cardHeader: "CMF",
        imgSrc: "img/maintenance03_CMF.png",
        imgAlt: "maintenance03_CMF.png",
        href: "cmf",
        modal: ""
    },
    {
        cardHeader: "Georeset",
        imgSrc: "img/maintenance04_georeset.png",
        imgAlt: "maintenance04_georeset.png",
        href: "",
        modal: "georesetModal"
    },
    {
        cardHeader: "Salesman",
        imgSrc: "img/maintenance05_salesman.png",
        imgAlt: "maintenance05_salesman.png",
        href: "salesman",
        modal: ""
    },
    {
        cardHeader: "Product",
        imgSrc: "img/maintenance06_produt.png",
        imgAlt: "maintenance06_produt.png",
        href: "product",
        modal: ""
    },
    {
        cardHeader: "BTDT Product",
        imgSrc: "img/maintenance07_BTDT.png",
        imgAlt: "maintenance07_BTDT.png",
        href: "btdtProduct",
        modal: ""
    },
    {
        cardHeader: "Customer Tagging",
        imgSrc: "img/maintenance08_customerTagging.png",
        imgAlt: "maintenance08_customerTagging.png",
        href: "customerTagging",
        modal: ""
    },
    {
        cardHeader: "Bank",
        imgSrc: "img/maintenance09_bank.png",
        imgAlt: "maintenance09_bank.png",
        href: "bankmaintenance",
        modal: ""
    },
    {
        cardHeader: "MCP Calibration",
        imgSrc: "img/maintenance10_mcp.png",
        imgAlt: "maintenance10_mcp.png",
        href: "mcpCalibration",
        modal: ""
    },
    {
        cardHeader: "Dynamic Load Planning",
        imgSrc: "img/reports11_invValuation.png",
        imgAlt: "reports11_invValuation.png",
        href: "dynamicRouting",
        modal: ""
    },
    {
        cardHeader: "MCP Layout",
        imgSrc: "img/maintenance10_mcp.png",
        imgAlt: "maintenance10_mcp.png",
        href: "mcpLayout",
        modal: ""
    },
    {
        cardHeader: "Placement",
        imgSrc: "img/maintenance10_mcp.png",
        imgAlt: "maintenance10_mcp.png",
        href: "placementMaint",
        modal: ""
    },
    {
        cardHeader: "Must Carry",
        imgSrc: "img/maintenance10_mcp.png",
        imgAlt: "maintenance10_mcp.png",
        href: "mustcarry",
        modal: ""
    },

]

var defaultTheme = {
    "--cust-primary": "#040B2F",
    "--cust-primary2": "#1365a2",
    "--cust-primary3": "#337ab7",
    "--cust-primary4": "#3c69b2",
    "--cust-primary5": "#3c69b2",
    "--cust-primary6": "#183df7",
    "--cust-primary7": "#0c5489e6",
    "--cust-primary8": "#435ebe",
    "--cust-primary9": "#031841",
    "--cust-primary10": "#051A66",
    "--cust-primary11": "#2B46A1",

    "--cust-primary-hover": "#184770",
    "--cust-primary-hover2": "#1c2864",
    "--cust-primary-hover3": "#0c5489",
    "--cust-primary-hover4": "#050c33",
    "--cust-primary-hover5": "#061a64",

    "--cust-primary-map": "#0c5489cc",
    "--cust-primary-map2": "#1365a24d"
};

$(document).ready(async function () {
    const savedFont = localStorage.getItem("selectedFont");
    const selectedCat = localStorage.getItem("selectedCat");
    const selectedRul = localStorage.getItem("selectedRul");

    if (savedFont) {
        applyFont(savedFont, selectedCat, selectedRul);
    }
    loadTheme();
    
    var cred_delimeter = localStorage.getItem("REGULARUSER");
    var iconPageLogo = "img/mybuddyLogo.jpg";
    var companyLogo = "img/mybuddyLogo.jpg";
    var navbarDiv = $('#navbarCompanyDetails');
    var navbarDropdownDiv = $('.navbarDropdowns');
    var sidebarDiv = $('.offcanvas_headTitleDiv');
    var sidebarTabDiv = $('#sidebarTabItems');
    var dashboardPopUp = $('#dashboard_headTitleDiv');
    var reportsMainDiv = $('.mainReportsRowColDiv');
    var maintenanceMainDiv = $('.mainConstantRowColDiv')

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
        <a href="dashboard" class="list-group-item list-group-item-action d-flex">
            <span class="mdi mdi-monitor-dashboard"></span>
            <p class="px-2" style="margin-bottom: 0;">Dashboard</p>
        </a>
        <a href="analytics_temp" class="list-group-item list-group-item-action d-flex">
            <span class="mdi mdi-google-analytics"></span>
            <p class="px-2" style="margin-bottom: 0;">Analytics</p>
        </a>
        <a href="mapScreen" class="list-group-item list-group-item-action d-flex">
            <span class="mdi mdi-map-marker-radius"></span>
            <p class="px-2" style="margin-bottom: 0;">Digital Mapping</p>
        </a>
        <a href="reports" class="list-group-item list-group-item-action d-flex">
            <span class="mdi mdi-file-multiple"></span>
            <p class="px-2" style="margin-bottom: 0;">Reports</p>
        </a>
        <a href="maintenance" class="list-group-item list-group-item-action d-flex align-baseline reportBtn">
            <span class="mdi mdi-wrench-cog"></span>
            <p class="px-2" style="margin-bottom: 0;">Maintenance</p>
        </a>
    `)

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

        reportsMainDiv.append(content);
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
    
        maintenanceMainDiv.append(content);
    });
    

    // if(cred_delimeter == '' || cred_delimeter == null || cred_delimeter == 'null' ||
    // cred_delimeter == 'undefined' || cred_delimeter == undefined){
    //     window.location = GBL_DOMAIN;
    // }
    
        
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
                [
                    'adminUserName', 'username', 'usertype', 'latitude', 'longitude',
                    'mapzoom', 'newlycreated', 'usrnm', 'srvr', 'psswrd', 'dtbse', 'fullname'
                ].forEach(key => localStorage.removeItem(key));

                localStorage.clear();
                updateOfflineStat();  
                window.location = GBL_DOMAIN;
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


function applyThemeFromObject(theme) {
    const root = document.documentElement;
    for (const key in theme) {
        root.style.setProperty(key, theme[key]);
    }
}

function saveThemeToLocalStorage(theme) {
    localStorage.setItem("custom-theme", JSON.stringify(theme));
}

function loadTheme() {
    const stored = localStorage.getItem("custom-theme");
    if (stored) {
        try {
            const theme = JSON.parse(stored);
            applyThemeFromObject(theme);
        } catch {
            applyThemeFromObject(defaultTheme);
            saveThemeToLocalStorage(defaultTheme);
        }
    } else {
        applyThemeFromObject(defaultTheme);
        saveThemeToLocalStorage(defaultTheme);
    }
}

function applyFont(family, category, fontUrl) {
    document.documentElement.style.setProperty('--main-font-family', `'${family}'`);
    localStorage.setItem("selectedFont", family);
    localStorage.setItem("selectedCat", category);
    localStorage.setItem("selectedRul", fontUrl);

    // Remove existing <style> tag for the same font (if any)
    $('style[data-font-face]').remove();

    // Create and append new <style> tag
    const styleTag = $('<style>', {
        type: 'text/css',
        'data-font-face': family, // Tag it so we can find/delete later
        text: `
            @font-face {
                font-family: '${family}';
                src: url('${fontUrl}') format('truetype');
                font-style: normal;
                font-weight: 400;
            }
        `
    });

    $('head').append(styleTag);
}