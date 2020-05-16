import DashboardIcon from '@material-ui/icons/Dashboard';
import StoreIcon from '@material-ui/icons/Store';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import RecentActorsIcon from '@material-ui/icons/RecentActors';

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
        icon : DashboardIcon,
        ref : "/dashboard",
        hasItems : false,
    },{
        name : "Sell",
        icon : StoreIcon,
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
        icon : ShoppingBasketIcon,
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
        icon : RecentActorsIcon,
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

export default {appBarActionItems,sideBarItems};