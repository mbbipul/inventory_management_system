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
        name : "Sell",
        icon : "shopping_basket",
        ref : "/sell",
        hasItems : true,
        subItems : [
            {
                name : "New Sell",
                ref : "sell/new-sell"
            },{
                name : "Manage Sell",
                ref : "sell/manage-sell"
            },{
                name : "POS Sell",
                ref : "sell/pos-sell"
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
]

export {appBarActionItems,sideBarItems};