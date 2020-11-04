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
                name : "Sales Memo",
                ref : "sales/sales-memo"
            }
        ]
    },
    {
        name : "Payment",
        icon : "payments",
        ref : "/payment",
        hasItems : true,
        subItems : [
            {
                name : "Purchase Payment",
                ref : "payment/purchase-payment"
            }, 
            {
                name : "Sales Payment",
                ref : "payment/sales-payment"
            },
        ]
    },
    {
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
            },
            {
                name : "Credit Customer",
                ref : "customer/credit-customer"
            },
            {
                name : "Paid Customer",
                ref : "customer/paid-customer"
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
                name : "Manage Supplier",
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
    {
        name : "Salary",
        icon : "monetization_on",
        ref : "/salary",
        hasItems : true,
        subItems : [
            {
                name : "Add Salary",
                ref : "salary/add-salary"
            },
            {
                name : "Manage Salary",
                ref : "salary/manage-salary"
            }
        ]
    },
    {
        name : "Damage",
        icon : "remove_shopping_cart",
        ref : "/damage",
        hasItems : true,
        subItems : [
            {
                name : "Add Damage",
                ref : "damage/add-damage"
            },
            {
                name : "Manage Damages",
                ref : "damage/manage-damage"
            }
        ]
    },
    {
        name : "Order",
        icon : "local_grocery_store",
        ref : "/order",
        hasItems : true,
        subItems : [
            {
                name : "Add Order",
                ref : "order/add-order"
            },
            {
                name : "Manage Orders",
                ref : "order/manage-order"
            }
        ]
    }
]

export {appBarActionItems,sideBarItems};