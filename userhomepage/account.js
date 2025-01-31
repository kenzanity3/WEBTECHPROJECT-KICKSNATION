import  {userID,userdatabase,oldinfo,GetUserData,dateofbirth,itemdatabase, admindatabase} from '../managementjavascript/fetchanddisplay.js'
import {Userchangedetail} from '../managementjavascript/usermanagement.js';
import  {phonematchesPattern,EmailmatchesPattern,AddressmatchesPattern,UsernamematchesPattern,isValidPassword,isValidName,accountcheck} from '../managementjavascript/validation.js';

accountcheck();
const orderContainer = document.getElementById('ordercontainer');
const closeBtn = document.getElementById('closeitem');
const itemContainer = document.getElementById('itemcontainer'); // Get the cart container element
var useritems = [];        // Stores the list of items in the user's cart
let subtotal;             // Stores the total price of the items in the cart
var items;                // Stores the list of available items
var user; 

//#region  Validation
// Validates input fields for the user details update
function validateInput(Fname, Lname,address, Phonenumber, email, database) {
let valid = true; // Validation flag
let alertmessages = []; // Array for error messages
let existingUser;
const CurrentUser = userID();

// Validate Phone Number length
if (!isValidName(Fname || Lname)) {
  valid = false;
  alertmessages.push('Error: The Name most be compose of Letter.');
}

// Validate Phone Number length
if (Phonenumber.length !== 11) {
    valid = false;
    alertmessages.push('Error: The phone number requires exactly 11 digits.');
}
if(!phonematchesPattern(Phonenumber)){
    valid = false;
    alertmessages.push('Error: The address is not in proper format.');
}

// Check for duplicate Phone Number
existingUser = database.find(user => user.Phonenumber === Phonenumber);
if (existingUser && existingUser.Userid !== CurrentUser) { 
    valid = false;
    alertmessages.push('Error: The Phone number is already registered to another account.');
}

// Validate Address format
if (!AddressmatchesPattern(address)) {
    valid = false;
    alertmessages.push('Error: The address is not in proper format.');
}

// Validate Email format
if (!EmailmatchesPattern(email)) {
    valid = false;
    alertmessages.push('Error: The email is not in proper format.');
}

// Check for duplicate Email
existingUser = database.find(user => user.Email.toLowerCase() == email.toLowerCase());
if (existingUser && existingUser.Userid != CurrentUser) { 
    valid = false;
    alertmessages.push('Error: The Email is already registered.');
}

return { valid, alertmessages }; // Return validation results and messages
}
  
  // Validates and updates username and password
async function validateUsernameAndPassword(username, password, repassword, database) {
    let valid = true; // Validation flag
    let alertMessages = []; // Array for error messages
    const admins = admindatabase();
    // Check for empty fields
    if (!username || !password || !repassword) {
      alertMessages.push('Error: All fields are required.');
      valid = false;
    } else {
      // Validate username format
      if (!UsernamematchesPattern(username)) {
        valid = false;
        alertMessages.push('Error: Username should start with letters.');
      }
  
      // Check for duplicate username
      const existingUser = database.find(user => user.Username.toLowerCase() === username.toLowerCase() && user.Userid !== userID());
      if (existingUser) {
        valid = false;
        alertMessages.push('Error: Username is already taken.');
      }

      // Check for admin username
      const existingadmin = admins.admin.find(admin => admin.Username.toLowerCase() === username.toLowerCase());
      if (existingadmin) {
        valid = false;
        alertMessages.push('Error: Username is already taken.');
      }
  
      // Validate password matching
      if (password !== repassword) {
        valid = false;
        alertMessages.push('Error: Passwords do not match.');
      }
  
      // Validate password strength
      if (!isValidPassword(password)) {
        valid = false;
        alertMessages.push('Error: Password should be at least 8 characters, including letters and special characters.');
      }
    }
  
    return { valid, alertMessages };
  }
//#endregion
//#region modal
  const accountModal = document.getElementById('account_modal');
  const ChangeInfoForm = document.getElementById("ChangeInfoForm");
  const ChangeUserForm = document.getElementById("ChangeUserForm");
  const ItemForm = document.getElementById("ItemForm");
  const DeliveredForm = document.getElementById("DeliveredForm");
  const Indicator = document.getElementById("Indicator");

function resetForm(form) {
  form.reset(); // This will reset all fields in the form
}

function shiftForm(form, position) {
  form.style.transform = `translateX(${position}px)`;
}

function informationdetail() {
  shiftForm(ChangeInfoForm, 0);  // Move ChangeInfoForm to the right
  shiftForm(ChangeUserForm, 300);  // Move ChangeUserForm on screen
  shiftForm(DeliveredForm, 300);   // Move DeliveredForm to the right
  shiftForm(Indicator, 0);         // Reset Indicator to the leftmost position

  resetForm(ChangeUserForm);  // Reset the ChangeUserForm fields
}

function Userdetail() {
  shiftForm(ChangeInfoForm, -300);     // Move ChangeInfoForm back to the left
  shiftForm(ChangeUserForm, 0);     // Move ChangeUserForm back to the left
  shiftForm(DeliveredForm, 300);      // Move DeliveredForm back to the left
  shiftForm(Indicator, 100);        // Set Indicator to the "register" position

  resetForm(ChangeInfoForm);  // Reset the ChangeInfoForm fields
}

function delivereditemdetail() {
  shiftForm(ChangeInfoForm, -300);     // Move ChangeInfoForm back to the left
  shiftForm(ChangeUserForm, -300);  // Move DeliveredForm back to the left (make it visible)
  shiftForm(DeliveredForm, 0);  // Move DeliveredForm back to the left (make it visible)
  shiftForm(Indicator, 200);    // Move Indicator (adjust position as needed)
  resetForm(ChangeInfoForm);  // Reset the ChangeInfoForm fields
  resetForm(ChangeUserForm);  // Reset the ChangeUserForm fields
}

function AccountShowModal(){
  accountModal.style.display = "block";
  shiftForm(ChangeInfoForm, 0);  // Move ChangeInfoForm to the right
  shiftForm(ChangeUserForm, 300);  // Move ChangeUserForm on screen
  shiftForm(DeliveredForm, 300);
  shiftForm(Indicator, 0); 
};

function ItemsShow(orderid){
  ItemForm.style.display = "block";
  displaydelivereditems(orderid);
};

function ItemsHide(){
  ItemForm.style.display = "none";
};


ChangeInfoForm.addEventListener("submit", async (e)=>{
  e.preventDefault();
  e.stopPropagation();

  const database = await userdatabase(); // Fetch user database

  // Accessing form elements via ChangeInfoForm.elements
  const FNameinput = ChangeInfoForm.elements['FNameInput'].value.trim();
  const LNameinput = ChangeInfoForm.elements['LNameInput'].value.trim();
  const Addressinput = ChangeInfoForm.elements['Addressinput'].value.trim();
  const Birthdateinput = ChangeInfoForm.elements['Birthinput'].value.trim();
  const Phonenumberinput = ChangeInfoForm.elements['Phonenumberinput'].value.trim();
  const Emailinput = ChangeInfoForm.elements['EmailInput'].value.trim();

  // Fill in empty fields with existing values
  const { Fname, Lname, Address, Bdate, Phonenumber, Email } 
  = await oldinfo(FNameinput, LNameinput, Addressinput, Birthdateinput, Phonenumberinput, Emailinput);

  // Validate user inputs
  const { valid, alertmessages } = validateInput(Fname, Lname, Address, Phonenumber, Email, database);
 // Ask the user to confirm their identity by entering their current password

  if (valid) {
    const passwordConfirmation = prompt("Please enter your current password to confirm the update:");
    if (passwordConfirmation === user.Password) {

      // Construct object for updating user details
      const Userdetail = {
          FirstName: Fname,
          LastName: Lname,
          Address: Address,
          PhoneNumber: Phonenumber,
          Email: Email,
          Birthdate: Bdate,
      };
      await Userchangedetail(Userdetail);
        alert("Information Updated");
    }
  } else {
      alert(alertmessages.join('\n'));
  }
})


ChangeUserForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  e.stopPropagation();

  // Access form elements using the 'elements' property of the form
  const username = ChangeUserForm.elements['UsernameInput'].value.trim() || user.Username;
  const password = ChangeUserForm.elements['PasswordInput'].value.trim();
  const repassword = ChangeUserForm.elements['RepasswordInput'].value.trim();

  
    // Fetch both user data and database in parallel
    const database= await userdatabase();

    const { valid, alertMessages } = await validateUsernameAndPassword(username, password, repassword, database);

  if (valid) {
    // Ask the user to confirm their identity by entering their current password
    const passwordConfirmation = prompt("Please enter your current password to confirm the update:");
    console.log(passwordConfirmation);
    if (passwordConfirmation == user.Password) {
      const updatedUserLogin = { Username: username, Password: password };
      await Userchangedetail(updatedUserLogin);
      alert('Password updated successfully!');
      window.location.reload();
    } else {
      alert('Incorrect current password. Please try again.');
    }
  } else {
    alert(alertMessages.join('\n'));
  }
 
});
//#endregion
//#region OrderItem
// Function to filter the user's cart items from the list of available items

async function displayorderdelivered(){
  const deliveritem =  user.Delivered;
  const fragment = document.createDocumentFragment();
    deliveritem.forEach(item => {
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
            <td><label>Tax: ${data.Total}<label></td>
            `
  return item;
};

//#region itemdisplay
function getUserDelivereddata(orderid) {

 const orderindex = user.Delivered.findIndex(order => order.Orderid == parseInt(orderid));

  // Filter items to get only those in the user's delivered
  if (items) {
      useritems = items.filter(item => user.Delivered[orderindex].Item.some(Item => parseInt(Item.Itemid) === item.Itemid));  // Filter matching items
      useritems.forEach((item, index) => {
          const cartItem = user.Delivered[orderindex].Item.find(Item => Item.Itemid === item.Itemid); // Find corresponding cart item
          if (cartItem) {
              useritems[index] = { ...cartItem, ...item }; // Merge cart item with item data                
          }
          
      });
      if(useritems.length !== 0)
      {
        document.getElementById('Orderidview').textContent = "Order ID: " + user.Delivered[orderindex].Orderid;
        document.getElementById('Dateview').textContent = "Date: " +  new Date(user.Delivered[orderindex].Date);
      return true;  // Return true if cart data exists
      }
  }
  return false;  // Return false if no cart data
}

var itemsubtotal = (Price,Quantity) => (Price * Quantity).toFixed(2); // Function to calculate the subtotal for an individual item based on its price and quantity

// Function to display all items in the user's cart
async function displaydelivereditems(orderid) {
  itemContainer.innerHTML = "";
  subtotal = 0;
  const fragment = document.createDocumentFragment(); // Create a fragment to append elements

  // Check if the user has items in their cart
  if (getUserDelivereddata(orderid)) {

      // For each item in the user's cart, create a table row and display it
      useritems.forEach(item => {      
          const itemelement = document.createElement('tr'); // Create a new table row for the cart item
          itemelement.innerHTML = delivereditem(item); // Populate the row with the cart item HTML
          fragment.appendChild(itemelement); // Append the row to the fragment

          subtotal += item.Price * item.Quantity; // Add item price * quantity to the subtotal
      });
      // Append the fragment containing all cart items to the cart container
      itemContainer.appendChild(fragment);
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
                    <img src="${item.Image}"> <!-- Display the item image -->
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

//#endregion
//#region DOMInitialization
document.addEventListener("DOMContentLoaded", async (e) => {
  e.preventDefault();
  e.stopPropagation();
  
  ItemsHide();

  AccountShowModal();
  window.informationdetail = informationdetail;
  window.userdetail = Userdetail;
  window.delivereditemdetail = delivereditemdetail;

  dateofbirth();
    const username = document.getElementById('UsernameInput');
    user = await GetUserData(); // Fetch user data
    // Fetch items and user data asynchronously
    items = await itemdatabase();

    await displayorderdelivered();
    // Populate placeholders with existing user information if available
    if (user) {
        document.getElementById('FNameInput').placeholder = user.FirstName.trim();
        document.getElementById('LNameInput').placeholder = user.LastName.trim();
        document.getElementById('Addressinput').placeholder = user.Address.trim();
        document.getElementById('Birthinput').value = user.Birthdate.trim();
        document.getElementById('Phonenumberinput').placeholder = user.PhoneNumber.trim();
        document.getElementById('EmailInput').placeholder = user.Email.trim();
        username.placeholder = user.Username.trim();
    } else {
        console.error("User not found in the database.");
    }

});

closeBtn.addEventListener('click', ()=> ItemsHide());

orderContainer.addEventListener('click', async (event) => {
  event.stopPropagation();
  event.preventDefault();

  const wrapper = event.target.closest('a[data-order-id]')
  if(wrapper){
    const orderId = parseInt(wrapper.getAttribute('data-order-id'));

    if(orderId)
      return ItemsShow(orderId);

  }

 

  return console.log('item do not exist');
});
//#endregion


  
