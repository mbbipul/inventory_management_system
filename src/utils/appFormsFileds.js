import React from 'react';
import apiUrl from "./apiInfo";
import AddSupplier from "../Views/addSupplier";
import AddProduct from "../Views/addProduct";
import AddCompany from '../Views/addCompany';
import { Link } from 'react-router-dom';

const addCompanyFormFields = [
    {
        label : "Company Name",
        placeholder : "Amrita",
        type : 4,
        fetchUrl : "Companies/find/",
        required : true,
        disabled : false,
        validation : [1] 
    },
    {
        label : "Company Address",
        placeholder : "Barishal",
        type : 0,
        required : true,
        disabled : false,
        validation : [9999]

    },
    {
        label : "Company Contact Number",
        placeholder : "74634878476",
        type : 0,
        required : true,
        disabled : false,
        validation : [0] 

    },
    
];

const addSupplierFormFileds = [
    {
        label : "Supplier Name",
        placeholder : "BB Roy",
        type : 0,
        required : true,
        disabled : false,
        validation : [9999]
    },
    {
        label : "Supplier Address",
        placeholder : "Barishal Sador",
        type : 0,
        required : true,
        disabled : false,
        validation : [9999]
    },
    {
        label : "Supplier Contact",
        placeholder : " +8801xxxxxxxxx",
        type : 0,
        required : true,
        disabled : false,
        validation : [0]
    },
    {
        label : "Supplier Email",
        placeholder : "bb@gmail.com",
        type : 0,
        required : false,
        disabled : false,
        validation : [9999]
    },
    {
        label : "Supplier Company Name",
        placeholder : "Matrivandar store",
        type : 3,
        dialogFormContent : <AddCompany />,
        fetchUrl : apiUrl+"Companies",
        selectName : "companyName",
        selectKey : "companyId",
        required : false,
        disabled : false,
        validation : [9999]
    },
];


const addProductFormFileds = [
    {
        label : "Product Name",
        placeholder : "Fresh oil",
        type : 4,
        fetchUrl : "Products/find/",
        required : true,
        disabled : false,
        validation : [1]
    },
    {
        label : "Product Code",
        placeholder : "QT604T",
        type : 0,
        required : true,
        disabled : false,
        validation : [9999]

    },
    {
        label : "Product Type",
        placeholder : "Please Select product Type",
        type : 3,
        dialogFormContent : <AddSupplier />,
        fetchUrl : apiUrl+"ProductCategory",
        selectName : "productCategoryName",
        selectKey : "productCategoryId",
        required : true,
        disabled : false,
        validation : [9999]

    },
    {
        label : "Supplier Name",
        placeholder : "Please Select Supplier Name",
        type : 3,
        dialogFormContent : <AddSupplier />,
        fetchUrl : apiUrl+"Suppliers",
        selectName : "supplierName",
        selectKey : "supplierId",
        required : true,
        disabled : false,
        validation : [0]
    },
    {
        label : "Product Quantity",
        placeholder : "5",
        type : 0,
        required : true,
        disabled : false,
        validation : [0]
    },
    {
        label : "Purchase Price",
        placeholder : "450.00 tk",
        type : 0,
        required : true,
        disabled : false,
        validation : [0]

    },
    {
        label : "Purchase Discount",
        placeholder : "200.00 tk",
        type : 0,
        required : true,
        disabled : false,
        validation : [0]
    },
    {
        label : "Purchase Price With Discount",
        type : 8,
        dependsOn : {
            field : ["Purchase Price","Purchase Discount"],
            operation : 1
        },
    },

    {
        label : "",
        disabled : false,
        type : 999,
    },
    {
        label : "Purchase Price",
        labelExtra : " ( Per Product )",
        placeholder : "000.00 tk",
        type : 7,
        dependsOn : {
            field : ["Purchase Price","Purchase Discount","Product Quantity"],
            operation : 3
        },
        required : true,
        disabled : true,
        validation : [0]
    },
    {
        label : "Sales Price",
        labelExtra : " ( Per Product )",
        placeholder : "700.00 tk",
        type : 5,
        required : true,
        disabled : false,
        validation : [0]
    },
    {
        label : "Purchase Payment Amount",
        placeholder : "500.00 tk",
        type : 7,
        dependsOn : {
            field : ["Purchase Price","Purchase Discount"],
            operation : 4 //substruct operation with check this value is not larger
        },
        required : true,
        disabled : false,
        validation : [999]
    },
    {
        label : "Purchase Due Payment Date",
        placeholder : "12-12-2021",
        type : 6,
        required : true,
        disabled : false,
        validation : [999]
    },
    {
        label : "Details",
        placeholder : "product details",
        type : 2,
        required : true,
        disabled : false,
        validation : [999]
    }
];

const addPurchaseFormFields = [
        
    {
        label : "Supplier Name",
        placeholder : "BB Roy",
        type : 3,
        dialogFormContent : <AddSupplier />,
        fetchUrl : apiUrl+"Suppliers",
        selectName : "supplierName",
        selectKey : "supplierId",
        required : true,
        disabled : false,
        validation : [9999]

    },
    {
        label : "Product Name",
        placeholder : "Ice Cream",
        type : 3,
        dialogFormContent : <Link style={{marginLeft:"30%"}} to="/product/add-product"  target="_blank">Please Click Here to Add new Product</Link>,
        fetchUrl : apiUrl+"Products",
        selectName : "productName",
        selectKey : "productId",
        required : false,
        disabled : false,
        validation : [9999]
    },
    {
        label : "Product Quantity",
        placeholder : "5",
        type : 0,
        required : true,
        disabled : false,
        validation : [0]
    },
    {
        label : "Purchase Price",
        placeholder : "450.00 tk",
        type : 0,
        required : true,
        disabled : false,
        validation : [0]

    },
    {
        label : "Purchase Discount",
        placeholder : "200.00 tk",
        type : 0,
        required : true,
        disabled : false,
        validation : [0]
    },
    {
        label : "Purchase Price With Discount",
        type : 8,
        dependsOn : {
            field : ["Purchase Price","Purchase Discount"],
            operation : 1
        },
    },
    {
        label : "",
        disabled : false,
        type : 999,
    },
    {
        label : "Purchase Price",
        labelExtra : " ( Per Product )",
        placeholder : "000.00 tk",
        type : 7,
        dependsOn : {
            field : ["Purchase Price","Purchase Discount","Product Quantity"],
            operation : 3
        },
        required : true,
        disabled : true,
        validation : [0]
    },
    {
        label : "Sales Price",
        labelExtra : " ( Per Product )",
        placeholder : "700.00 tk",
        type : 5,
        required : true,
        disabled : false,
        validation : [0]
    },
    {
        label : "Purchase Payment Amount",
        placeholder : "500.00 tk",
        type : 7,
        dependsOn : {
            field : ["Purchase Price","Purchase Discount"],
            operation : 4 //substruct operation with check this value is not larger
        },
        required : true,
        disabled : false,
        validation : [999]
    },
    {
        label : "Purchase Due Payment Date",
        placeholder : "12-12-2021",
        type : 6,
        required : true,
        disabled : false,
        validation : [999]
    }
];

const newSalesFormFields = [
    {
        label : "Cusomer Name",
        placeholder : "BB Roy",
        type : 3,
        dialogFormContent : <AddSupplier />,
        fetchUrl : apiUrl+"Suppliers",
        selectName : "supplierName",
        selectKey : "supplierId",
        required : true,
        disabled : false,
        validation : [9999]

    },
    {
        label : "Product Name",
        placeholder : "Ice Cream",
        type : 3,
        dialogFormContent : <Link style={{marginLeft:"30%"}} to="/product/add-product"  target="_blank">Please Click Here to Add new Product</Link>,
        fetchUrl : apiUrl+"Products",
        selectName : "productName",
        selectKey : "productId",
        required : false,
        disabled : false,
        validation : [9999]
    },
    {
        label : "Product Quantity",
        placeholder : "5",
        type : 0,
        required : true,
        disabled : false,
        validation : [0]
    },
    {
        label : "Sales Price",
        labelExtra : " ( Per Product )",
        placeholder : "700.00 tk",
        type : 5,
        required : true,
        disabled : false,
        validation : [0]
    },
    {
        label : "Purchase Payment Amount",
        placeholder : "500.00 tk",
        type : 7,
        dependsOn : {
            field : ["Purchase Price","Purchase Discount"],
            operation : 4 //substruct operation with check this value is not larger
        },
        required : true,
        disabled : false,
        validation : [999]
    },
    {
        label : "Purchase Due Payment Date",
        placeholder : "12-12-2021",
        type : 6,
        required : true,
        disabled : false,
        validation : [999]
    }
    
] ;

const addCustomerFormFields = [
    {
        label : "Customer Name",
        placeholder : "BB Roy",
        type : 0,
        required : true,
        disabled : false,
        validation : [9999]
    },
    {
        label : "Customer Address",
        placeholder : "Barishal Sador",
        type : 0,
        required : true,
        disabled : false,
        validation : [9999]
    },
    {
        label : "Customer Contact",
        placeholder : " +8801xxxxxxxxx",
        type : 0,
        required : true,
        disabled : false,
        validation : [0]
    },
    {
        label : "Customer Email",
        placeholder : "bb@gmail.com",
        type : 0,
        required : false,
        disabled : false,
        validation : [9999]
    },
    {
        label : "Customer NID",
        placeholder : "75587784XXXXX",
        type : 0,
        required : true,
        disabled : false,
        validation : [9999]
    },
];

export { 
    addProductFormFileds , 
    addCompanyFormFields , 
    addSupplierFormFileds ,
    addPurchaseFormFields,
    newSalesFormFields,
    addCustomerFormFields
};