import React,{ useEffect, useState } from "react";
import submitForm from "../utils/fetchApi";
import '../assets/table.css';
import { Box, Button, Card, TextField, Typography } from "@material-ui/core";
import AsyncAutoComplete from "./asyncAutoComplete";
import ToggleButtons from "./toggleButtonGroup";

function FormTable(props) {
	const [columns, setColumns] = useState(props.field.columns);
	const [hasUpdate,] = useState(props.update);
	const [productTableDatas,setProductTableDatas] = useState([]);
	const [product,setProduct] = useState(null);
	const [addedProductObjects,setAddedProductObjects] = useState({});
	const [fetchProducts,setFetchProducts] = useState([]);

	const [toggleProHisObj,setToggleProHisObj] = useState(null);
	
	const [newProIndex,setNeProIndex] = useState(0);

	const [totalProPrise,setTotalProductPrise] = useState(0);

	useEffect(() => {
		console.log(addedProductObjects);
		let tPrice = 0;
		Object.keys(addedProductObjects).map(function(key, index) {
			tPrice +=  addedProductObjects[key].productQuantity*addedProductObjects[key].salesPrice;
		});
		setTotalProductPrise(tPrice);
		props.onDataChange(Object.values(addedProductObjects));
	},[addedProductObjects]);

	useEffect(() => {
		props.onTotalPriceChanges(totalProPrise);
	},[totalProPrise]);

	const CreateRow = (props) => {
		const [productObj,setProductObj] = useState(null);
		const [productQuantity,setProQuantity] = useState(0);
		const [proSalesPrice,setProSalesPrice] = useState(0);
		const [productPurHis,setProductPurHis] = useState(null);

		useEffect(() => {
			const togObj = <ToggleButtons 
								onChange={(val) => setProductPurHis(val)}
								field={"field"}
								title={productObj} 
								fetchUrl={"PurchaseHistories/product/"}/>
			props.onProductChnage(productObj);
			props.onProductSelect(togObj);
		},[productObj]);

		useEffect(() => {
			if(parseInt(productQuantity) > 0 && productPurHis !== null){
				if( parseInt(productQuantity) > productPurHis.productQuantity){
					alert('Enough product are not in stock');
					setProQuantity(0);
				}
			}
		},[productQuantity]);

		useEffect(() => {
			if(productObj !== null && productPurHis !== null && typeof(productPurHis) !== 'undefined'){
				const salesObj = {
					productId : productObj.productId,
					productPurchaseHistoryId : productPurHis.productPurchaseHistoryId,
					productQuantity : parseInt(productQuantity),
					salesPrice : parseFloat(proSalesPrice)
				}
				let tmp = { ...addedProductObjects }
				tmp[props.proIndex] = salesObj;
				setAddedProductObjects(tmp);
				console.log(addedProductObjects);
			}
		},[productObj,productQuantity,proSalesPrice,productPurHis]);

		return (
			<tr>
				<td className="form-table-th-td">
					<AsyncAutoComplete
						margin="normal"
						fetchUrl={columns[0].fetchUrl}
						selectKey={columns[0].selectKey}
						selectName={columns[0].selectName}
						onDataChange={(fieldName,value)=> setProductObj(value)}
					/>
				</td>
				<td className="form-table-th-td">
					<TextField 
						value={productQuantity}
						onChange={(e) => setProQuantity(e.target.value)}
					/>
				</td>
				<td className="form-table-th-td">
					<TextField 
						onChange={(e) => setProSalesPrice(e.target.value)}
					/>
				</td>
				<td className="form-table-th-td">
					<Typography>{
							parseInt(productQuantity)*parseFloat(proSalesPrice) &&
								parseInt(productQuantity)*parseFloat(proSalesPrice)
						}
					</Typography>
				</td>
			</tr>
		)
	}
	const addNewProduct = () => {
		const tmp = [...productTableDatas];
		tmp.push(<CreateRow proIndex={newProIndex} onProductSelect={(v) => setToggleProHisObj(v)} onProductChnage={(v) => setProduct(v)}/>);
		setProductTableDatas(tmp);
		setNeProIndex(newProIndex+1);
	}
  
	useEffect(() => {
		if(hasUpdate){
			submitForm('Sales/sale-products/'+props.salesId,'GET','',(res) => {
				const data = JSON.parse(res);
				const tableData = [];
				let tPrice = 0;
		
				data.map((v,i) => {
					tPrice += v.productQuantity*v.perProductPrice;
					tableData.push(<tr>
						<td className="form-table-th-td">
							<Typography>{v.productName}</Typography>
						</td>
						<td className="form-table-th-td">
							<Typography>{v.productQuantity}</Typography>
						</td>
						<td className="form-table-th-td">
							<Typography>{v.perProductPrice}</Typography>
						</td>
						<td className="form-table-th-td">
							<Typography>{v.productQuantity*v.perProductPrice}</Typography>
						</td>
					</tr>);
				});
				setTotalProductPrise(tPrice);
				setFetchProducts(tableData);
			});
		}
	},[hasUpdate]);

    return (
		<Box component={Card}>
			<table className="form-table">
				<thead>
					<tr>
						<th colSpan='4' className="form-table-th-td">
							<h3 style={{textAlign: 'center'}} >Product Info</h3>
						</th>
					</tr>
					<tr>
						{
							product && <th colSpan='4' style={{textAlign : 'center'}} className="form-table-th-td">
											{
												toggleProHisObj
											}	
										</th>
						}
					</tr>
					
					<tr>
						{
							columns.map((item,i) => (
								<th className="form-table-th-td" key={i}>{item.title}</th>
							))
						}
					</tr>
				</thead>
				<tbody>
					{
						!hasUpdate ?
									productTableDatas.map((item,i) => (
										item
									)) :

									fetchProducts.map((item,i) => (
										item
									))
					}
				</tbody>
				<tfoot>
					{
						!hasUpdate && <tr>
										<td className="form-table-th-td"  colSpan={4}>
											<Button 
												onClick={addNewProduct}
												variant="contained" 
												color='secondary'>
												Add New Product
											</Button>
										</td>
									</tr>
					}
					<tr>
						<td style={{display:'table-cell',padding: 10,textAlign: 'center'}} colSpan={3}>
							Total Product Price
						</td>
						<td>{totalProPrise}</td>
					</tr>
				</tfoot>
			</table>
		</Box>
    )
}

export {FormTable};
  