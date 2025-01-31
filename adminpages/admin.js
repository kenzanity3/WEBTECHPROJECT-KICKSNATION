import {adminID,olditeminfo, admindatabase,itemdatabase} from "../managementjavascript/fetchanddisplay.js"
import {additem,deleteitem,updateitem} from "../managementjavascript/usermanagement.js"

var TotalofAllItem = 0, TotalofAllItemDelivered = 0;
var ItemAddForm;
var ItemInfoForm; 
var ItemViewForm;
var itemsContainer;
var orderContainer; 
var startdate;
var enddate;
let subtotal;
var Items; //itemdatabase
var Admins; //admindatabase
var adminInfo; //admininfo
let image;//initialize image base64 code holder variable;
var items = []; // displayitems

if(!adminID() || isNaN(adminID())){
    window.location.replace("../authenticationpage/Authentication.html");
}


//#region validation
function ItemnamePattern(Name){
    const itemnamepattern = /^[a-zA-Z][a-zA-Z0-9 ]*$/;
    return itemnamepattern.test(Name);
  };

  function PricePattern(Price){
    const pricepattern = /^\d+(\.\d+)?$/;
    return pricepattern.test(Price);
  };

  // Function to validate user input
function validateInput(Image, Name, Price, Brand, Description,ItemID, database) {
    let valid = true; // Validation Flag to track if all inputs are valid
    let alertmessages = []; // Array to collect alert messages for invalid inputs
    const Itemid = parseInt(ItemID);
    console.log(Image,Itemid+Name+Price+Brand+Description);
    // Validate that all fields are filled
    if (!Image || !Name || !Price || !Brand || !Description || ItemID == null) {
        valid = false; // Set validation flag to false
        alertmessages.push('Error: All fields are required. Please fill in all fields.'); // Alert message for empty fields
    } else {
        
        // Validate ItemName format
        if (!ItemnamePattern(Name)) {
            valid = false; // Set validation flag to false if name format is incorrect
            alertmessages.push('Error: The Item Name is not in proper format. Please try again.'); // Error message for invalid email format
        }
         // Validate ItemName format
         if (!PricePattern(Price)) {
            valid = false; // Set validation flag to false if price format is incorrect
            alertmessages.push('Error: The Price is not in proper format. Please try again.'); // Error message for invalid email format
        }
        console.log(Itemid);
            // Validate Name duplication (Ensure Name is defined before calling toLowerCase)
    if (database.some(item => item.Name && item.Name.toLowerCase() == Name.toLowerCase() && item.Itemid !== Itemid)) {
        valid = false; // Set validation flag to false if name is already registered
        alertmessages.push('Error: The Item Name is already taken. Please try another one.'); // Error message for existing name
    }

    // Validate Image duplication (Ensure Image is defined before checking)
    if (database.some(item => item.Image && item.Image == Image && item.Itemid !== Itemid)) {
        valid = false; // Set validation flag to false if image is already registered
        alertmessages.push('Error: The Image is already taken. Please try another one.'); // Error message for existing image
    }
       
    }

    return { valid, alertmessages }; // Return the validation result with flag and messages
}
//#endregion


//#region DOM
document.addEventListener('DOMContentLoaded', async (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    document.getElementById('dashboard').onclick = () => {
        window.location.href = `adminhomepage.html?Adminid=${adminID()}`;
    };

    document.getElementById('products').onclick = () => {
        window.location.href = `viewproducts.html?Adminid=${adminID()}`;
    };
    document.getElementById('settings').onclick = () => {
        window.location.href = `settings.html?Adminid=${adminID()}`;
    };
    const adminId = parseInt(adminID());
    Admins = await admindatabase();
    Items = await itemdatabase();
    adminInfo = Admins.admin.find(admin => admin.Adminid == adminId);
    document.getElementById('admin-name').textContent = adminInfo.AdminName;

  
    const url = window.location.href;
    // Checking URL and running corresponding functions
    if (url.includes("viewsale.html")) {
        ViewForm();
    }
    if (url.includes("viewproducts.html")) {
        AddForm();
        InfoForm();
    }
    if (url.includes("adminhomepage.html")) {
        AddForm();
    }
    closeButtons(url);


    document.getElementById('logout').href = "../authenticationpage/Authentication.html";
    document.getElementById('settings').href = `settings.html?Adminid=${adminId}`;
    document.getElementById('products').href = `viewproducts.html?Adminid=${adminId}`;
    document.getElementById('dashboard').href = `adminhomepage.html?Adminid=${adminId}`;




});


function closeButtons(url){

    // Ensure these functions are defined somewhere in your script

function ItemAddHide() {
    const form = document.getElementById("ItemAddForm");
    if (form) {
        form.style.display = "none";
    }
}

function ItemInfoHide() {
    const form = document.getElementById("ItemInfoForm");
    if (form) {
        form.style.display = "none";
    }
}

function ItemViewHide() {
    const form = document.getElementById("ItemsViewForm");
    if (form) {
        form.style.display = "none";
    }
} 
    
    document.querySelectorAll('.close').forEach(closeButton => {
        closeButton.addEventListener('click', (event) => {
            const closestform = event.target.closest('form');

            // Check the form's name, id, or other attributes to decide which function to execute
            if (closestform) {
                const formName =  closestform.getAttribute('id');
                
                // Depending on the form's name or id, execute the correct function
                switch (formName) {
                    case 'ItemAddForm':    
                        ItemAddHide();
                        break;
                    case 'ItemInfoForm':             
                        ItemInfoHide();
                        break;
                    case 'ItemsViewForm':                 
                        ItemViewHide();
                        break;
                    default:
                        console.log('Unknown form');
                        break;
                }
            }
        });
    });
};


//#region AddForm
function AddForm() {
ItemAddForm = document.getElementById("ItemAddForm");
const imagedisplay = document.getElementById("imagedemodisplay");

function ItemAddShow(){
    image="";
    imagedisplay.src = "";
    ItemAddForm.elements['ProductImage'].value = "";
    ItemAddForm.style.display = "block";
};
  
function ItemAddHide(){
ItemAddForm.style.display = "none";
};

ItemAddHide();
ItemAddForm.addEventListener('submit', async (e) => {
    e.stopPropagation();
    e.preventDefault();

    // Access form elements using the 'elements' property of the form
    const Name = ItemAddForm.elements['ProductName'].value.trim();
    const Price = Number(parseFloat(ItemAddForm.elements['ProductPrice'].value.trim()).toFixed(2));
    const Brand = ItemAddForm.elements['ProductBrand'].value.trim();
    const Description = ItemAddForm.elements['ProductDescription'].value.trim();

    const {valid, alertmessages} = validateInput(image, Name, Price, Brand, Description, 0, Items);

    if(valid) {
        const password = prompt("Please enter your current password to add the new item:");
        if(password === adminInfo.Password) {
            const item = {
                Itemid: null,
                Name: Name,
                Price: Price,
                Rating: 0,
                Brand: Brand,
                Itemdescription: Description,
                Image: String(image)
            };
            await additem(item);
            image="";
            imagedisplay.src = "";
            Image.value = "";
            location.reload();
            return;
        } else {
            alert("item aborted");
            ItemAddHide();
            return;
        }
    } else {
        alert(alertmessages.join('\n'));
        return false;
    }
});

document.getElementById('ProductImage').addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (!allowedExtensions.test(file.name)) {
            alert('Invalid file type. Only JPG, PNG, and GIF are allowed.');
            this.value = '';
            return;
        }
        if (file.size > maxSize) {
            alert('File size must be less than 2MB.');
            this.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = function (event) {
            image = event.target.result; // Extract Base64 part
            imagedisplay.src = image;
        };
        reader.readAsDataURL(file); // Convert file to Base64
    }
});

document.getElementById('addproductbtn').addEventListener('click', async (event) => {
    event.stopPropagation();
    event.preventDefault();
    ItemAddShow();
});
}
//#endregion

//#region InfoForm
function InfoForm(){
    const imagedisplay1 = document.getElementById('imagedemo1display');
    ItemInfoForm = document.getElementById("ItemInfoForm");
    
function ItemInfoShow(){ 
    ItemInfoForm.style.display = "block";
};
  
function ItemInfoHide(){
ItemInfoForm.style.display = "none";
};

ItemInfoForm = document.getElementById("ItemInfoForm");
ItemInfoHide();
const ListContainer = document.getElementById('ListContainer');


async function displayItemList(){
    ListContainer.innerHTML = "";
    const Listitem = Items;

    const fragment = document.createDocumentFragment();
    Listitem.forEach(item => {
        const itemelement = document.createElement('tr');
        itemelement.innerHTML = itemdisplay(item);
        fragment.appendChild(itemelement);
    }
    );
    return ListContainer.appendChild(fragment);
};

displayItemList();


function itemdisplay(data){
    const item = `<td><label><img src="${data.Image}" style="Height: 200px;"></label></td>
            <td><label>${data.Name}</label> 
                 <a href="" class="deletebutton" data-item-id="${data.Itemid}">Remove</a> <!-- Delete button -->
                 <a href="" class="ChangeInfobutton" data-item-id="${data.Itemid}">Edit</a> <!-- Delete button --></td></td>
            <td><label>${data.Price}<label></td> 
            <td><label>${data.Rating}<label></td>
            <td><label>${data.Brand}<label></td>
            <td><label>${data.Itemdescription}<label></td>
            `
    return item;
};


document.getElementById('ProductImage1').addEventListener('change', function () {
    const file = this.files[0];

    if (file) {
        const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (!allowedExtensions.test(file.name)) {
            alert('Invalid file type. Only JPG, PNG, and GIF are allowed.');
            this.value = '';
            return;
        }
        if (file.size > maxSize) {
            alert('File size must be less than 2MB.');
            this.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = function (event) {
            image = event.target.result; // Extract Base64 part
            imagedisplay1.src = image;
        };
        reader.readAsDataURL(file); // Convert file to Base64
    }
});


// Event listener to handle clicks on the table (e.g., delete button click)
ListContainer.addEventListener('click', async (event) => {
    event.stopPropagation(); // Prevent event propagation
    event.preventDefault(); // Prevent default action (e.g., link click)

    const itemId = parseInt(event.target.getAttribute('data-item-id')); // Get the item ID from the button data attribute

    // If the button (anchor) is clicked
    if (event.target && event.target.classList.contains('deletebutton')) {
        const check = prompt("Please enter your current password to confirm the update:");
        if(check === adminInfo.Password){
        if (await deleteitem(itemId)) {
            const rowToDelete = event.target.closest('td').parentElement; // Go up to the <tr> from <td>
            
            if (rowToDelete) {
                console.log(rowToDelete);  
                rowToDelete.remove(); // Remove the item row from the UI         
            } 
            else {
                console.error('Could not find the <tr> element');
            }      
        }
    }
    };

    if(event.target && event.target.classList.contains('ChangeInfobutton')){
        const oldinfo = await olditeminfo('','','','','',itemId);
        // Set the 'data-item-id' attribute
        ItemInfoForm.setAttribute('data-item-id', itemId);
        document.getElementById('imagedemo1display').src = oldinfo.image;
        document.getElementById('ProductName1').value = oldinfo.name;
        document.getElementById('ProductPrice1').value = oldinfo.price;
        document.getElementById('ProductBrand1').value = oldinfo.brand;
         document.getElementById('ProductDescription1').value = oldinfo.description;
        image = oldinfo.image;

        ItemInfoShow();
    };
});

ItemInfoForm.addEventListener('submit',async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const itemId = parseInt(e.target.getAttribute('data-item-id')); // Get the item ID from the button data attribute

    // Access form elements using the 'elements' property of the form
    var Image = ItemInfoForm.elements['ProductImage1'];
    var Name = ItemInfoForm.elements['ProductName1'].value.trim();
    var Price = Number(ItemInfoForm.elements['ProductPrice1'].value.trim());
    var Brand = ItemInfoForm.elements['ProductBrand1'].value.trim();
    var Description = ItemInfoForm.elements['ProductDescription1'].value.trim();
    const oldinfo = await olditeminfo(image,Name,Price,Brand,Description,itemId);
    Image.src = oldinfo.image,Name = oldinfo.name, Price = oldinfo.price, Brand = oldinfo.brand, Description = oldinfo.description;
    const {valid, alertmessages} = validateInput(image, Name, Price, Brand, Description, itemId, Items);

    if(valid) {
        const password = prompt("Please enter your current password to confirm the update:");
        if(password === adminInfo.Password) {
            console.log(itemId);
            const item = {
                Itemid: itemId,
                Name: Name,
                Price: Price, 
                Brand: Brand,
                Itemdescription: Description,
                Image: String(image)
            };
            await updateitem(item);
            image="";
            imagedisplay1.src = "";
            Image.value = "";
            location.reload();
            return;
        } else {
            alert("item aborted");
            ItemInfoHide();
            return;
        }
    } else {
        alert(alertmessages.join('\n'));
        return false;
    }

});

}
//#endregion

//#region ViewForm
function ViewForm(){
    ItemViewForm = document.getElementById("ItemsViewForm");
    itemsContainer = document.getElementById('itemcontainer');
    orderContainer = document.getElementById('OrderContainer');
    startdate = document.getElementById('startdatesort');
    enddate = document.getElementById('enddatesort');
    const totalitemDelivered = document.getElementById('totalItemDelivered');
    const totalSales = document.getElementById('totalSales');
    constraintsortdate();

    function constraintsortdate(){
        const today = new Date();

        const Maxdate = formatteddate(today);

        const mindatetime = Admins.itemDelivered.length > 0 ? Math.min(...Admins.itemDelivered.map(order => new Date(order.Date))): null;
        
        const Mindate = mindatetime ? formatteddate(new Date(mindatetime)) : 'No data';

        startdate.setAttribute('max', Maxdate);
        startdate.setAttribute('min', Mindate);
        enddate.setAttribute('max', Maxdate);
        enddate.setAttribute('min', Mindate);
        startdate.value = Maxdate;
        enddate.value = Mindate;

        enddate.addEventListener('change',(e) => {
            e.preventDefault();
            e.stopPropagation();

            if(enddate.value > startdate.value){
                enddate.value = startdate.value;
            }

            displayorderdelivered();    
        })
        startdate.addEventListener('change', (e) => {
            e.preventDefault();
            e.stopPropagation();

            displayorderdelivered();
        })
    };

    function formatteddate(date){
        //const today = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2,'0'); // Add leading zero to month if needed
        const day = String(date.getDate()).padStart(2, '0'); // Add leading zero to day if needed
        return `${year}-${month}-${day}`;
    };


    function ItemViewShow(orderid){ 
        ItemViewForm.style.display = "block";
        displaydelivereditems(orderid);
    };
          
    function ItemViewHide(){
    ItemViewForm.style.display = "none";
    displaydelivereditems(0);
    };

    ItemViewHide();
    displayorderdelivered();
    totalSales.textContent = TotalofAllItem;
    totalitemDelivered.textContent = TotalofAllItemDelivered;
    ItemViewForm = document.getElementById("ItemsViewForm");
    itemsContainer = document.getElementById('itemcontainer');
    orderContainer = document.getElementById('OrderContainer');

    orderContainer.addEventListener('click', async (event) => {
        event.stopPropagation();
        event.preventDefault();
        
        const wrapper = event.target.closest('a[data-order-id]')
        if(wrapper){
          const orderId = parseInt(wrapper.getAttribute('data-order-id'));
          if(orderId) return ItemViewShow(orderId);
        }
        return console.log('item do not exist');
    });

    startdate.addEventListener("change",(e)=>{
        e.stopPropagation();
        e.preventDefault();
        TotalofAllItem = 0;
        TotalofAllItemDelivered = 0;
        displayorderdelivered();
    });

    enddate.addEventListener("change",(e)=>{
        e.stopPropagation();
        e.preventDefault();
        TotalofAllItem = 0;
        TotalofAllItemDelivered = 0;
        displayorderdelivered();
    });


    //#region DisplayOrder
    async function displayorderdelivered(){
        orderContainer.innerHTML = "";

        const deliveritem = Admins.itemDelivered.filter(order => {
            var orderDate = formatteddate(new Date(order.Date));
            var Enddate = formatteddate(new Date(enddate.value));
            var Startdate = formatteddate(new Date(startdate.value));
            return orderDate >= Enddate && orderDate <= Startdate;
        });

        const fragment = document.createDocumentFragment();

        deliveritem.forEach(item => {
            TotalofAllItem += Number(item.Total);
            item.Item.forEach(item => TotalofAllItemDelivered += item.Quantity);
            const wrapper = document.createElement('a');
            wrapper.setAttribute('data-order-id', item.Orderid);
            const itemelement = document.createElement('tr');
            itemelement.innerHTML = orderdisplay(item);
            wrapper.appendChild(itemelement);
            fragment.appendChild(wrapper);
        }
        );
        return orderContainer.appendChild(fragment);
    };

    function orderdisplay(data){
        const item = `<td><label>Order ID: ${data.Orderid}</label></td>
                <td><label>Date: ${new Date(data.Date)}</label></td>
                <td><label>Subtotal: ${data.Subtotal}<label></td> 
                <td><label>Tax: ${data.Tax}<label></td>
                <td><label>Total: ${data.Total}<label></td>
                `
        return item;
    };
//#endregion
    //#region DiplayItems
    var itemsubtotal = (Price,Quantity) => (Price * Quantity).toFixed(2); // Function to calculate the subtotal for an individual item based on its price and quantity
    function getAdminDelivereddata(orderid) {

        const orderindex = Admins.itemDelivered.findIndex(order => order.Orderid == parseInt(orderid));

        // Filter items to get only those in the admin delivered
        if (Items && orderindex !== -1) {
            items = Items.filter(item => Admins.itemDelivered[orderindex].Item.some(Item => parseInt(Item.Itemid) === item.Itemid));  // Filter matching items
            items.forEach((item, index) => {
                const OrderItem = Admins.itemDelivered[orderindex].Item.find(Item => Item.Itemid === item.Itemid); // Find corresponding cart item
                if (OrderItem) {
                    items[index] = { ...OrderItem, ...item }; // Merge order item with item data                
                }
                
            });
            if(items.length !== 0)
            {
            document.getElementById('Orderidview').textContent = "Order ID: " + Admins.itemDelivered[orderindex].Orderid;
            document.getElementById('Dateview').textContent = "Date: " +  new Date(Admins.itemDelivered[orderindex].Date);
            return true;  // Return true if cart data exists
            }
        }
        return false;  // Return false if no cart data
    }

    // Function to display all items in the user's cart
    async function displaydelivereditems(orderid) {
        itemsContainer.innerHTML = "";
        subtotal = 0;
        const fragment = document.createDocumentFragment(); // Create a fragment to append elements
    
        // Check if the user has items in their cart
        if (getAdminDelivereddata(orderid)) {
    
            // For each item in the user's cart, create a table row and display it
            items.forEach(item => {      
                const itemelement = document.createElement('tr'); // Create a new table row for the cart item
                itemelement.innerHTML = delivereditem(item); // Populate the row with the cart item HTML
                fragment.appendChild(itemelement); // Append the row to the fragment
                subtotal += item.Price * item.Quantity; // Add item price * quantity to the subtotal
            });
            // Append the fragment containing all cart items to the cart container
            itemsContainer.appendChild(fragment);
            // Update the UI with the new pricing
            
            pricing(subtotal);
        } 
    }

    // Function to calculate and update the pricing (Subtotal, Tax, Total) in the UI
    function pricing(subtotal) {
        const taxRate = 0.15; // Tax rate is 15%
        const taxAmount = subtotal * taxRate; // Calculate tax
        const totalAmount = subtotal + taxAmount; // Calculate total (including tax)
    
        // Update the displayed values in the UI
        document.getElementById('Tax').textContent = taxAmount.toFixed(2);  // Update tax amount
        document.getElementById('MainSubtotal').textContent = subtotal.toFixed(2);  // Update subtotal
        document.getElementById('Total').textContent = totalAmount.toFixed(2);  // Update total amount
    }

    function delivereditem(item){
        const Item =  `<td>
                <div class="cart-info">
                    <img src="${item.Image}" style="height:200px"> <!-- Display the item image -->
                    <div>
                        <p>${item.Name}</p> <!-- Display the item name -->
                        <small>Price: ₱${item.Price}</small> <!-- Display the item price -->
                    </div>
                </div>
            </td>
            <td>
                <label>${item.Size}</label> 
            </td>
            <td><label>${item.Quantity}</label></td>
            <td class="totalcartprice" data-item-id="${item.Itemid}">${itemsubtotal(item.Price,item.Quantity)}</td> <!-- Display total price for this item -->
    `;
    return Item; 
    };
//#endregion
}
//#endregion