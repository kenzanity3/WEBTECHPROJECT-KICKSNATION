import express from 'express'; // Import the Express framework
import cors from 'cors'; // Import the cors package
import { getUsers, getAdmins, getItems, writeUsers, writeAdmins, writeItems } from './database.js'; //Import the Read and WriteFile in database.js

const getDate = () => new Date().toISOString(); // Helper function to return current date as ISO string

const app = express();
const PORT = 3000; // Define the port on which the server will listen


// Enable CORS for all origins
app.use(cors()); // This allows all origins to make requests to your server
// Middleware to parse JSON bodies from incoming requests
app.use(express.json({limit: '20mb'})); // Set the limit to 20MB for JSON body

//#region User
// Endpoint to handle user registration (POST request)
app.post('/api/users', async (req, res) => {
    const userInfo = req.body; // Extract user data from the request body

    const users = await getUsers(); // Get existing users from the database

    // Generate a new User ID by incrementing the maximum existing User ID
    const newUserId = users.length > 0 ? Math.max(...users.map(user => user.Userid)) + 1 : 1;
    userInfo.Userid = newUserId; // Assign the new User ID to userInfo

    users.push(userInfo); // Add the new user data to the array

    await writeUsers(users); // Write the updated user data back to the file

    res.status(201).json({ message: 'User registered successfully', data: userInfo });
});



// Endpoint to handle updating user information (PUT request)
app.put('/api/users/:Userid', async (req, res) => {
    let userId = req.params.Userid; // Get the user ID from the request parameters
    const updatedUserData = req.body; // Get the updated user data from the request body
    
    if(updatedUserData.Userid)// if the urlparamater are null then assign the request body userid
        userId = req.body.Userid;  

    //console.log("Userid: "+userId);
    const users = await getUsers(); // Get existing users from the database

    const userIndex = users.findIndex(user => user.Userid == userId); // Find the user by ID
    //console.log("index"+ userIndex)
    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' }); // If user not found, send a 404 response
    }
    
    users[userIndex] = {
        ...users[userIndex], // Keep existing user data
        ...updatedUserData // Merge in the new data
    };

    // console.log("Userdata"+JSON.stringify(users[userIndex]));

    await writeUsers(users); // Write the updated user data back to the file
    return res.status(200).json({ message: 'User information updated successfully!', user: users[userIndex] });
});
//#endregion

//#region Admin
// Endpoint to handle admin registration (POST request)
app.post('/api/admins', async (req, res) => {
    const adminInfo = req.body; // Extract user data from the request body

    const admins = await getAdmins(); // Get existing users from the database

    // Generate a new User ID by incrementing the maximum existing User ID
    const newAdminId = admins.admin.length > 0 ? Math.max(...admins.admin.map(admin => admin.Adminid)) + 1 : 1;
    adminInfo.Adminid = newAdminId; // Assign the new User ID to userInfo

    admins.admin.push(adminInfo); // Add the new user data to the array

    await writeAdmins(admins); // Write the updated user data back to the file

    res.status(201).json({ message: 'Admin registered successfully', data: adminInfo });
});

// Endpoint to handle updating admin information (PUT request)
app.put('/api/admins/:Adminid', async (req, res) => {  // Fixed route parameter
    const adminId = req.params.Adminid; // Admin ID from URL parameters
    const updatedAdminData = req.body; // Updated data from the request body

    const admins = await getAdmins(); // Get existing admins from the database

    const adminIndex = admins.admin.findIndex(admin => admin.Adminid == parseInt(adminId)); // Find the admin by ID
    if (adminIndex === -1) {
        return res.status(404).json({ error: 'Admin not found' }); // If admin not found, send a 404 response
    }

    admins.admin[adminIndex] = {
        ...admins.admin[adminIndex], // Keep existing admin data
        ...updatedAdminData // Merge in the new data from the request
    }

    await writeAdmins(admins); // Write the updated admin data back to the file

    res.status(200).json({ message: 'Admin information updated successfully', data: admins[adminIndex] });
});

//#endregion

//#region Cart
app.post('/api/users/cart/:Userid/:Itemid', async (req, res) => {
    const userId = req.params.Userid; // Parse UserId as an integer
    const itemId = parseInt(req.params.Itemid); // Parse ItemId as an integer
    const cartItem = req.body; // Get updated item details (like Size and Quantity) from the request body

    // Validate the input data: Ensure the cartItem contains necessary fields (Size, Quantity)
    if (!cartItem || !cartItem.Size || !cartItem.Quantity) {
        return res.status(400).json({ error: 'Invalid input. Please provide item details such as Size and Quantity.' });
    }

    // Retrieve existing users and items from the database
    const users = await getUsers();
    const items = await getItems();


    // Find the user by userId
    const userIndex = users.findIndex(user => user.Userid == userId);
    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' }); // If the user does not exist, return a 404 error
    }
    // Find the item by itemId
    const item = items.find(item => item.Itemid === itemId);
    if (!item) {
        return res.status(404).json({ error: 'Item does not exist' }); // If the item does not exist, return a 404 error
    }
    // Check if the item is already in the user's cart
    const cartIndex = users[userIndex].Cart.findIndex(cartItem => cartItem.Itemid === itemId);
    let responseMessage;

    if (cartIndex === -1) {
        // If the item is not in the cart, add it
        users[userIndex].Cart.push({...cartItem});
        responseMessage = 'Item added to the cart successfully!'; // Success message for adding the item
    } else {
        // If the item is already in the cart, update it with the new details
        users[userIndex].Cart[cartIndex] = {
            ...users[userIndex].Cart[cartIndex],
            ...cartItem
        };
        responseMessage = 'Item updated successfully!'; // Success message for updating the item
    }

    // Save the updated users data back to the database
    await writeUsers(users);
    
    // Send a success response with the updated user data
    res.status(200).json({ message: responseMessage, user: users[userIndex] });
});

// DELETE request to remove items from a user's cart
app.delete('/api/users/cart/:Userid', async (req, res) => {
    const userId = req.params.Userid; // Get the UserId from the request parameters
    const itemtodelete = req.body.Cart; // Get the items to be deleted from the request body (array of item IDs)
    const Accesscontrol = parseInt(req.body.Accesscontrol); // Access control type (1: delete, 2: deliver)

    // console.log("server-side\n" + JSON.stringify(itemtodelete)); // Debug log (removed)
    
    // Validate the input
    if (!itemtodelete || !Array.isArray(itemtodelete) || !Accesscontrol) {
        return res.status(400).json({ error: 'Invalid input. Please provide CartItems and Accesscontrol.' });
    }

    const users = await getUsers(); // Get existing users from the database
    const admins = await getAdmins(); // Get existing admins from the database
    const userIndex = users.findIndex(user => user.Userid == userId); // Find the user by ID

    // console.log("\nUser\n" + JSON.stringify(users[userIndex].Cart)); // Debug log (removed)
    
    if (userIndex === -1) {
        // console.log("\nUser not found\n" + userIndex); // Debug log (removed)
        return res.status(404).json({ error: 'User not found' }); // If user not found, send a 404 response
    }

    if (Accesscontrol === 1) {
        // console.log('\naccess control 1'); // Debug log (removed)
        // If Accesscontrol is 1, remove the selected items from the cart
        users[userIndex].Cart = users[userIndex].Cart.filter(
            item => !itemtodelete.some(cartItem => cartItem.Itemid === item.Itemid)
        );
    } 
    else if (Accesscontrol === 2) {
        // console.log("AccessControl: "+2);
        // If Accesscontrol is 2, move the items to the Delivered array and update itemDelivered
        const deliveredItems = users[userIndex].Cart.filter(item => itemtodelete.some(cartItem => cartItem.Itemid === item.Itemid));
        // console.log("Delivered Items: "+JSON.stringify(deliveredItems));
        // Remove the items from the user's cart
        users[userIndex].Cart = users[userIndex].Cart.filter(
            item => !itemtodelete.some(cartItem => cartItem.Itemid === item.Itemid)
        );
        // console.log("Removed Cart Items:" + users[userIndex].Cart);

        // Create a new Order ID
        const newOrderId = admins.itemDelivered.length > 0 ? Math.max(...admins.itemDelivered.map(order => order.Orderid)) + 1 : 1;

         // Initialize subtotal
        let subtotal = 0;
        const taxRate = 0.15; // Tax rate (15%)

        // Define the item format structure for the order
        var orderformat = {
            Orderid: newOrderId, // Assign a new Order ID
            Date: getDate(), // Assign the current date
            Subtotal: 0,
            Tax: 0,
            Total: 0, 
            Item:[] // Initialize the Item array
        }

        // Push each delivered item into the Item array
        deliveredItems.forEach(item => {
            subtotal = subtotal + (item.Quantity * item.Price);
            orderformat.Item.push(item); // Add the item to the Item array
        });  
        // console.log("1subtotal:" + subtotal);
        
        // Recalculate tax and total after the subtotal is fully calculated
        orderformat.Subtotal = subtotal.toFixed(2);
        orderformat.Tax = (orderformat.Subtotal * taxRate).toFixed(2);
        orderformat.Total = (Number(orderformat.Subtotal) + Number(orderformat.Tax)).toFixed(2);

         // console.log("Total:" + orderformat.Total);
        // console.log("2subtotal:" + subtotal);
        // console.log("tax:" + orderformat.Tax);
        // console.log("Total:" + orderformat.Total);
        // console.log("admin itemdelivered: " + orderformat);
        // Add the itemformat to the user's Delivered array and the admin's itemDelivered array
        users[userIndex].Delivered.push(orderformat); 
        admins.itemDelivered.push(orderformat); 
    } 
    else {
        return res.status(500).json({ error: 'Invalid Accesscontrol value' }); // If Accesscontrol is not 1 or 2, return a 500 error
    }

    // console.log("\nafter filtering\n" + JSON.stringify(users[userIndex].Cart)); // Debug log (removed)
    await writeUsers(users); // Write the updated user data back to the file
    await writeAdmins(admins); // Write the updated admin data back to the file

    res.status(200).json({ message: 'Selected items deleted from cart successfully!', user: users[userIndex] });
});
//#endregion

//#region Items
// Endpoint to handle item registration (POST request)
app.post('/api/items', async (req, res) => {
    const item = req.body; // Extract item data from the request body

    const items = await getItems(); // Get existing items from the database
    const newItemId = items.length > 0 ? Math.max(...items.map(item => item.Itemid)) + 1 : 1;

    item.Itemid = newItemId

    items.push(item); // Add the new item data to the array 
    await writeItems(items); // Write the updated item data back to the file
    res.status(201).json({ message: 'Item registered successfully', data: item });
});

app.delete('/api/items/:Itemid', async (req,res) =>{
    const itemId = parseInt(req.params.Itemid); // Get the item ID from the request parameters

    const items = await getItems(); // Get existing items from the database

    const itemIndex = items.findIndex(item => item.Itemid === itemId); // Find the item by ID
    if (itemIndex === -1) {
        return res.status(404).json({ error: 'Item not found' }); // If item not found, send a 404 response
    } 
    const newitems = items.filter(item => item.Itemid !== itemId);

    // Write the remaining item data back to the file
    await writeItems(newitems);

    res.status(200).json({ message: 'Item deleted successfully!'});
});

// Endpoint to handle updating item information (PUT request)
app.put('/api/items/:Itemid', async (req, res) => {
    const itemId = parseInt(req.params.Itemid); // Get the item ID from the request parameters
    const updatedItemData = req.body; // Get the updated item data from the request body

    const items = await getItems(); // Get existing items from the database

    const itemIndex = items.findIndex(item => item.Itemid === itemId); // Find the item by ID
    if (itemIndex === -1) {
        return res.status(404).json({ error: 'Item not found' }); // If item not found, send a 404 response
    }

    items[itemIndex] = {
        ...items[itemIndex], // Keep existing item data
        ...updatedItemData // Merge in the new data
    };

    await writeItems(items); // Write the updated item data back to the file

    res.status(200).json({ message: 'Item information updated successfully!', item: items[itemIndex] });
});
//#endregion

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});