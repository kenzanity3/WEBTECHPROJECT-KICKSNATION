// Import necessary functions from external modules
import { idcheck} from "../managementjavascript/validation.js"      // For user login verification
import { itemdatabase, GetUserData } from "../managementjavascript/fetchanddisplay.js"; // For fetching items and user data
import { deletecartitems, updatecartitem } from "../managementjavascript/usermanagement.js" // For cart item deletion and updating

// Declare global variables for user items, subtotal, items, and user data
var useritems = [];        // Stores the list of items in the user's cart
let subtotal;             // Stores the total price of the items in the cart
var items;                // Stores the list of available items
var user;                 // Stores the current user's data
const Container = document.getElementById('CartContainer'); // Get the cart container element

var itemsubtotal = (Price,Quantity) => (Price * Quantity).toFixed(2); // Function to calculate the subtotal for an individual item based on its price and quantity
// Function to generate the HTML markup for each item in the cart
function cartitem(item) {

        
    const cart = `     
            <td>
                <div class="cart-info">
                    <img src="${item.Image}"> <!-- Display the item image -->
                    <div>
                        <p>${item.Name}</p> <!-- Display the item name -->
                        <small>Price: ₱${item.Price}</small> <!-- Display the item price -->
                        <a href="" class="deletebutton" data-item-id="${item.Itemid}">Remove</a> <!-- Delete button -->
                    </div>
                </div>
            </td>
            <td>
                <select class="dropdown" name="dropdown" data-item-id="${item.Itemid}"> <!-- Dropdown for selecting item size -->
                    <option value="36" ${item.Size === '36' ? 'selected' : ''}>36</option>
                    <option value="38" ${item.Size === '38' ? 'selected' : ''}>38</option>
                    <option value="40" ${item.Size === '40' ? 'selected' : ''}>40</option>
                    <option value="42" ${item.Size === '42' ? 'selected' : ''}>42</option>
                    <option value="44" ${item.Size === '44' ? 'selected' : ''}>44</option>
                    <option value="46" ${item.Size === '46' ? 'selected' : ''}>46</option>
                    <option value="48" ${item.Size === '48' ? 'selected' : ''}>48</option>
                    <option value="50" ${item.Size === '50' ? 'selected' : ''}>50</option>
                    <option value="52" ${item.Size === '52' ? 'selected' : ''}>52</option>
                </select>
            </td>
            <td><input type="number" class="quantity-input" data-item-id="${item.Itemid}" value="${item.Quantity}"></td> <!-- Input field for quantity -->
            <td class="totalcartprice" data-item-id="${item.Itemid}">${itemsubtotal(item.Price,item.Quantity)}</td> <!-- Display total price for this item -->
    `;
    return cart;  // Return the generated HTML for the cart item
}



// Function to display all items in the user's cart
async function displaycartitems() {
    subtotal = 0; // Reset subtotal   
    const fragment = document.createDocumentFragment(); // Create a fragment to append elements

    // Fetch items and user data asynchronously
    [items, user] = await Promise.all([itemdatabase(), GetUserData()]);

    // Check if the user has items in their cart
    if (getUserCartdata()) {
        // For each item in the user's cart, create a table row and display it
        useritems.forEach(item => {      
            const cartelement = document.createElement('tr'); // Create a new table row for the cart item
            cartelement.innerHTML = cartitem(item); // Populate the row with the cart item HTML
            fragment.appendChild(cartelement); // Append the row to the fragment

            subtotal += item.Price * item.Quantity; // Add item price * quantity to the subtotal
        });
        // Append the fragment containing all cart items to the cart container
        Container.appendChild(fragment);
        // Update the UI with the new pricing
        pricing(subtotal);
    } else {
        EmptyCart();
    }
}

function EmptyCart(){
    // If the cart is empty, display a message
    const emptyRow = document.createElement('tr');
    emptyRow.style.height = "450px"; // Set height for the empty row
    const emptyMessage = document.createElement('td');
    emptyMessage.colSpan = 5; // Span across all columns
    emptyMessage.textContent = "Your cart is empty!"; // Display empty message
    emptyMessage.style.fontSize = "40px"; // Style the message font size
    emptyMessage.style.textAlign = "center"; // Center the text
    emptyRow.appendChild(emptyMessage); // Append the message to the row
    Container.appendChild(emptyRow); // Append the empty row to the container
};

// Function to filter the user's cart items from the list of available items
function getUserCartdata() {
    // Filter items to get only those in the user's cart
    if (items) {
        useritems = items.filter(item => user.Cart.some(cartItem => parseInt(cartItem.Itemid) === item.Itemid));  // Filter matching items
        useritems.forEach((item, index) => {
            const cartItem = user.Cart.find(cartItem => cartItem.Itemid === item.Itemid); // Find corresponding cart item
            if (cartItem) {
                useritems[index] = { ...cartItem, ...item }; // Merge cart item with item data                
            }
            
        });
        if(useritems.length !== 0)
        return true;  // Return true if cart data exists
    }
    return false;  // Return false if no cart data
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

// Function to update the cart total after any change in the cart (item removal, quantity change, etc.)
async function updatetotal() {
    subtotal = 0;  // Reset subtotal

    // Fetch items and user data asynchronously
    [items, user] = await Promise.all([itemdatabase(), GetUserData()]);

    if (getUserCartdata()) {
        // Calculate the subtotal for all items in the user's cart
        useritems.forEach(item => {      
            subtotal += item.Price * item.Quantity;  // Add item price * quantity to subtotal
        });
        // Update the UI with the new pricing
        pricing(subtotal);
    }
}

// Event listener to handle when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", async () => {
    // Check if user is logged in
    if (await idcheck()) {
        alert("Please login to access your cart"); // Show an alert if not logged in
        location.replace("../authenticationpage/Authentication.html"); // Redirect to login page
    }
   
    // Display the cart items after checking user login
    await displaycartitems();
});

// Event listener to handle clicks on the table (e.g., delete button click)
document.querySelector('table').addEventListener('click', async (event) => {
    event.stopPropagation(); // Prevent event propagation
    event.preventDefault(); // Prevent default action (e.g., link click)

    // If the delete button (anchor) is clicked
    if (event.target && event.target.classList.contains('deletebutton')) {
        const itemId = parseInt(event.target.getAttribute('data-item-id')); // Get the item ID from the button data attribute
        let itemformat = { Accesscontrol: 1, Cart: [{ Itemid: itemId }] };  // Format data for item deletion       

        if (await deletecartitems(itemformat)) {
            const rowToDelete = event.target.closest('td').parentElement; // Go up to the <tr> from <td>
            if (rowToDelete) {
                rowToDelete.remove(); // Remove the item row from the UI
                await updatetotal();  // Update the total after removal
                if(user.Cart.length == 0){
                    EmptyCart();
                }
            } else {
                console.error('Could not find the <tr> element');
            }
            
        }
    }
});

// Event listener to handle changes in the quantity input field
document.querySelector('table').addEventListener('input', async (event) => {
    event.stopPropagation(); // Prevent event propagation
    event.preventDefault(); // Prevent default action

    // If a quantity input field is changed
    if (event.target && event.target.classList.contains('quantity-input')) {
        const quantityui = event.target;  // Reference to the quantity input field
        let quantity = Number(quantityui.value);  // Get the new quantity value
        const itemId = parseInt(event.target.getAttribute('data-item-id')); // Get the item ID
        const item = useritems.find(useritem => useritem.Itemid === itemId); // Find the item in user items      
        
        // Ensure the quantity is within the range (1–99)
        if (quantity < 1) 
            quantity = 1;  // Set to 1 if the quantity is less than 1
        
        if (quantity > 99) 
            quantity = 99;  // Set to 99 if the quantity exceeds 99
        
    
        // Update the quantity input field's value with the restricted quantity
        quantityui.value = quantity;

        // If the item exists, update the cart with the new quantity
        if (item) {
            let itemformat = { Itemid: itemId, Name: item.Name, Price: item.Price, Quantity: quantity, Size: item.Size };
            await updatecartitem(itemformat);  // Update the cart item
            await updatetotal();  // Recalculate and update the total price of all items in the cart

             // Update the individual item's subtotal in the UI
            const itemRow = event.target.closest('tr');  // Find the closest table row to the quantity input field
            const subtotalCell = itemRow.querySelector('.totalcartprice');  // Find the subtotal cell in the same row

            subtotalCell.textContent = `₱${itemsubtotal(item.Price,item.Quantity)}`;  // Update the UI with the new item subtotal
        }
    }
});

// Add an event listener to the table to handle changes in the dropdown (e.g., size selection)
document.querySelector('table').addEventListener('change', async (event) => {
    // Prevent the event from propagating further and prevent the default behavior
    event.stopPropagation();
    event.preventDefault();

    // Check if the changed element is a dropdown (size selection)
    if (event.target && event.target.classList.contains('dropdown')) {
        
        // Get the selected size from the dropdown
        const size = event.target.value;       
        // Retrieve the item ID from the data attribute of the dropdown
        const itemId = parseInt(event.target.getAttribute('data-item-id'));
        // Find the item in the useritems array that matches the itemId
        const item = useritems.find(useritem => useritem.Itemid === itemId);
        
        // If the item exists in the cart, proceed to update the item in the cart
        if (item) {
            // Create an itemformat object containing updated item details (Itemid, Name, Price, Quantity, and new Size)
            let itemformat = { Itemid: itemId, Name: item.Name, Price: item.Price, Quantity: item.Quantity, Size: size };           

            // Call the updatecartitem function to update the cart with the new size selection
            await updatecartitem(itemformat);
        }
    }
});

// Add an event listener to the 'Paybutton' for handling the click event
document.getElementById('Paybutton').addEventListener('click', () => {
    // Define the structure of the itemformat object, which will contain Accesscontrol and Cart details
    let itemformat = {
        Accesscontrol: 2,  // Set Accesscontrol to 2 to represent a checkout or payment process
        Cart: []  // Initialize an empty Cart array to hold the cart items
    };

    // Check if the user has items in the cart (i.e., useritems is an array and not empty)
    if (Array.isArray(useritems) && useritems.length > 0) {
        // Iterate over each item in the user's cart (useritems)
        useritems.forEach(item => {
            // Create a cartitem object with the necessary details for each item
            let cartitem = {
                Itemid: item.Itemid,  // Item ID
                Name: item.Name,  // Item name
                Price: item.Price,  // Item price
                Quantity: item.Quantity,  // Item quantity
                Size: item.Size,  // Item size
                subtotal: item.Quantity * item.Price  // Calculate the subtotal for each item (Quantity * Price)
            };

            // Add the created cartitem to the Cart array in itemformat
            itemformat.Cart.push(cartitem);
        });

        // Call deletecartitems function to process the checkout or payment with the populated itemformat
        deletecartitems(itemformat);  // Perform the deletion or further action based on the itemformat structure
        window.location.reload();
    } else {
        // If the cart is empty, show an alert message
        alert('Your cart is empty.');  // Notify the user that the cart is empty
    }
});