let app_nameV = "store1";
switch (window.location.pathname.split('/')[1]) {
    case "app1":
        app_nameV = "store1";
        break;
    case "app2":
        app_nameV = "store2";
        break;
    case "app2":
        app_nameV = "store2";
        break;
    default:
        break;
}
export const app_name = app_nameV;
const apiUrl = "http://40.119.2.157/"+app_name+"/api/";
export default apiUrl;