const appBarActionItems = [
    {
        name : "Product",
        type : "BUTTON_ICON",
        icon : "pro"
    },
    {
        name : "Sales",
        type : "BUTTON_ICON",
        icon : "pro"
    },
    {
        name : "Purchase",
        type : "BUTTON_ICON",
        icon : "pro"
    },{
        name : "Payment",
        type : "BUTTON_ICON",
        icon : "pro"
    },{
        name : "Notification",
        type : "ICON",
        icon : "pro"
    },{
        name : "profile",
        type : "NESTED_MENU_ICON",
        items : ["Admin Info","Settings","Logout"],
        icon : "pro"
    },
];

const sideBarItems = [
    {
        name : "Dashboard",
        icon : "dashboard",
        ref : "/dashboard",
        hasItems : false,
    },{
        name : "Purchase",
        icon : "shop_two",
        ref : "/purchase",
        hasItems : true,
        subItems : [
            {
                name : "Add Purchase",
                ref : "purchase/add-purchase"
            },{
                name : "Manage Purchase",
                ref : "purchase/manage-purchase"
            }
        ]
    },
    {
        name : "Sales",
        icon : "shopping_basket",
        ref : "/sales",
        hasItems : true,
        subItems : [
            {
                name : "New Sales",
                ref : "sales/new-sales"
            },{
                name : "Manage Sales",
                ref : "sales/manage-sales"
            },{
                name : "POS Sales",
                ref : "sales/pos-sales"
            }
        ]
    },{
        name : "Product",
        icon : "storefront",
        ref : "/product",
        hasItems : true,
        subItems : [
            {
                name : "Category",
                ref : "product/category"
            },
            {
                name : "Add Product",
                ref : "product/add-product"
            },
            {
                name : "Manage Product",
                ref : "product/manage-product"
            }
        ]
    },{
        name : "Customer",
        icon : "supervisor_account",
        ref : "/customer",
        hasItems : true,
        subItems : [
            {
                name : "Add Customer",
                ref : "customer/add-customer"
            },
            {
                name : "Manage Customer",
                ref : "customer/manage-customer"
            }
        ]
    },
    {
        name : "Supplier",
        icon : "local_shipping",
        ref : "/supplier",
        hasItems : true,
        subItems : [
            {
                name : "Add Supplier",
                ref : "supplier/add-supplier"
            },
            {
                name : "Manage Customer",
                ref : "supplier/manage-supplier"
            }
        ]
    },
    {
        name : "Employee",
        icon : "account_box",
        ref : "/employee",
        hasItems : true,
        subItems : [
            {
                name : "Add Employee",
                ref : "employee/add-employee"
            },
            {
                name : "Manage Employee",
                ref : "employee/manage-employee"
            }
        ]
    },
    {
        name : "Company",
        icon : "business",
        ref : "/company",
        hasItems : true,
        subItems : [
            {
                name : "Add Company",
                ref : "company/add-company"
            },
            {
                name : "Manage Company",
                ref : "company/manage-company"
            }
        ]
    },
    {
        name : "Cost",
        icon : "payment",
        ref : "/cost",
        hasItems : true,
        subItems : [
            {
                name : "Add Cost",
                ref : "cost/add-cost"
            },
            {
                name : "Manage Cost",
                ref : "cost/manage-cost"
            }
        ]
    },
]

export {appBarActionItems,sideBarItems};