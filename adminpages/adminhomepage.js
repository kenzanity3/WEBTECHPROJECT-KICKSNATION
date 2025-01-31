import {adminID} from "../managementjavascript/fetchanddisplay.js"

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('viewproductsurl').onclick = () => {
        window.location.href = `viewproducts.html?Adminid=${adminID()}`;
    };

    document.getElementById('Viewsalesurl').onclick = () => {
        window.location.href = `viewsale.html?Adminid=${adminID()}`;
    };
});