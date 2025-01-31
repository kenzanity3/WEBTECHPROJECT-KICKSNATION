import { userID,adminID } from './fetchanddisplay.js';


//#region User
// Function for creating a new user
export async function CreateUser(NewUser) {
    try {
        // Sending a POST request to the API to register a new user
        const registerUser = await fetch('http://localhost:3000/api/users', {
            method: 'POST', // Specify the HTTP method as POST
            headers: {
                "Content-Type": "application/json", // Indicating that the request body is in JSON format
            },
            body: JSON.stringify(NewUser) // Converting the NewUser object to a JSON string for the request body
    
        });
        // Check if the request was successful
        if (!registerUser.ok) {
            const errorMessage = await registerUser.json(); // Parse the response to get error details
            throw new Error(`Registration failed: ${errorMessage.error || 'Unknown error'}`); // Throw an error if the response is not ok
        }
        // Provide feedback to the user
        else
        alert('Registration successful!'); // Display a confirmation message after successful registration   

    } catch (error) {
        console.error('Error:', error); // Log any errors that occur during the fetch
        alert(`Error: ${error.message}`); // Alert the user with the error message
    }
}

// Function to update user details on the server
export async function Userchangedetail(changedata) {
    const id = userID();
    console.log(id);
    try {
        // Sending a PUT request to the server with the updated user details
        const response = await fetch(`http://localhost:3000/api/users/${id}`, { // Use http instead of https
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json', // Specifying JSON content
            },
            body: JSON.stringify(changedata), // Sending updated data in the request body
        });

        // If the response status is not OK, throw an error
        if (!response.ok) {
            const errorMessage = await response.json(); // Parse the response to get error details
            throw new Error(`Update failed: ${errorMessage.error || 'Unknown error'}`); // Throw an error if the response is not ok           
        }
        return true;

    } catch (error) {
        // Log the error and alert the user
        console.error('Error updating user details:', error);
        return false
    }
}
//#endregion

//#region Admin 

// Function for creating a new user
export async function CreateAdmin(NewAdmin) {
    try {
        // Sending a POST request to the API to register a new user
        const registerAdmin = await fetch('http://localhost:3000/api/admins', {
            method: 'POST', // Specify the HTTP method as POST
            headers: {
                "Content-Type": "application/json", // Indicating that the request body is in JSON format
            },
            body: JSON.stringify(NewAdmin) // Converting the NewUser object to a JSON string for the request body
    
        });
        // Check if the request was successful
        if (!registerAdmin.ok) {
            const errorMessage = await registerAdmin.json(); // Parse the response to get error details
            throw new Error(`Registration failed: ${errorMessage.error || 'Unknown error'}`); // Throw an error if the response is not ok
        }
        // Provide feedback to the user
        else
        alert('Registration successful!'); // Display a confirmation message after successful registration   

    } catch (error) {
        console.error('Error:', error); // Log any errors that occur during the fetch
        alert(`Error: ${error.message}`); // Alert the user with the error message
    }
}

// Function to update user details on the server
export async function Adminchangedetail(changedata) {
    const id = adminID();

    try {
        // Sending a PUT request to the server with the updated admin details
        const response = await fetch(`http://localhost:3000/api/admins/${id}`, { // Use http instead of https
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json', // Specifying JSON content
            },
            body: JSON.stringify(changedata), // Sending updated data in the request body
        });

        // If the response status is not OK, throw an error
        if (!response.ok) {
            const errorMessage = await response.json(); // Parse the response to get error details
            throw new Error(`Update failed: ${errorMessage.error || 'Unknown error'}`); // Throw an error if the response is not ok           
        }
        return true;

    } catch (error) {
        // Log the error and alert the user
        console.error('Error updating user details:', error);
        return false
    }
}

//#endregion

//#region Cart
// Function to add an item to the user's cart
export async function addingcartitem(cartItem) {
    const id = userID(); // Call userID function to get the current user's ID
    try {
        // Sending a POST request to the server to add the cart item
        const response = await fetch(`http://localhost:3000/api/users/cart/${id}/${cartItem.Itemid}`, { // Use http instead of https
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Specifying JSON content
            },
            body: JSON.stringify(cartItem), // Sending updated data in the request body
        });

        // If the response status is not OK, throw an error
        if (!response.ok) {
            const errorMessage = await response.json(); // Parse the response to get error details
            throw new Error(`Update failed: ${errorMessage.error || 'Unknown error'}`); // Throw an error if the response is not ok
        }

        alert('Cart item added successfully!'); // Confirmation message after successful update

    } catch (error) {
        // Log the error and alert the user
        console.error('Error adding the cart item:', error);
        alert(`Error: ${error.message}`); // Alert the user with the error message
    }
}

// Function to delete items from the user's cart
export async function deletecartitems(CartItems) {
    const id = userID(); // Call userID function to get the current user's ID
    try {
        // Sending a DELETE request to the server to remove items from the user's cart
        const response = await fetch(`http://localhost:3000/api/users/cart/${id}`, {
            method: 'DELETE', // Using DELETE request to remove items from the cart
            headers: {
                'Content-Type': 'application/json', // Specifying JSON content
            },
            body: JSON.stringify(CartItems), // Sending the CartItems data in the request body
        });

        // If the response status is not OK, throw an error
        if (!response.ok) {
            const errorMessage = await response.json(); // Parse the response to get error details
            throw new Error(`Delete failed: ${errorMessage.error || 'Unknown error'}`); // Throw an error if the response is not OK
        }

        const s = CartItems.Cart.length > 1 ? 's' : ''; 
        if(CartItems.Accesscontrol == 1)
        alert(`Cart item deleted successfully!`); // Confirmation message after successful deletion
        else
        alert(`Cart item${s} successfully delivered!`);
        return true;
    } catch (error) {
        // Log the error and alert the user
        console.error('Error deleting the cart item:', error);
    }
    return false;
}

// Function to update an item in the user's cart
export async function updatecartitem(cartitem) {
    const id = userID(); // Call userID function to get the current user's ID
    const itemid = cartitem.Itemid; // Get the item ID from the cartitem object
    try {
        // Sending a POST request to the server to update the cart item
        const response = await fetch(`http://localhost:3000/api/users/cart/${id}/${itemid}`, { // Use http instead of https
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Specifying JSON content
            },
            body: JSON.stringify(cartitem), // Sending updated data in the request body
        });

        // If the response status is not OK, throw an error
        if (!response.ok) {
            const errorMessage = await response.json(); // Parse the response to get error details
            throw new Error(`Update failed: ${errorMessage.error || 'Unknown error'}`); // Throw an error if the response is not ok
        }

    } catch (error) {
        // Log the error and alert the user
        console.error('Error updating the cart item:', error);
    }
}
//#endregion

//#region Item
// Function to add a new item to the database
export async function additem(item) {

    try {
        // Sending a POST request to the server to add the item
        const response = await fetch(`http://localhost:3000/api/items`, { // Use http instead of https
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Specifying JSON content
            },
            body: JSON.stringify(item), // Sending updated data in the request body
        });

        // If the response status is not OK, throw an error
        if (!response.ok) {
            const errorMessage = await response.json(); // Parse the response to get error details
            throw new Error(`Update failed: ${errorMessage.error || 'Unknown error'}`); // Throw an error if the response is not ok
        }

        alert('Item added successfully!'); // Confirmation message after successful addition

    } catch (error) {
        // Log the error and alert the user
        console.error('Error adding the item:', error);
        alert(`Error: ${error.message}`); // Alert the user with the error message
    }
}

// Function to delete an item from the database
export async function deleteitem(itemid) {
    try {
        // Sending a DELETE request to the server to remove an item from the database
        const response = await fetch(`http://localhost:3000/api/items/${itemid}`, { // Corrected URL format to match the backend route
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json', // Specifying JSON content
            }
        });

        // If the response status is not OK, throw an error
        if (!response.ok) {
            const errorMessage = await response.json(); // Parse the response to get error details
            throw new Error(`Delete failed: ${errorMessage.error || 'Unknown error'}`); // Throw an error if the response is not OK
        }
        alert('Item deleted successfully!'); // Confirmation message after successful deletion
        return true;
    } catch (error) {
        // Log the error and alert the user
        console.error('Error deleting the item:', error);
        alert(`Error: ${error.message}`); // Alert the user with the error message
        return false;
    }
}

// Function to update an item in the database
export async function updateitem(item) {
    try {
        // Sending a PUT request to the server to update an item in the database
        const response = await fetch(`http://localhost:3000/api/items/${item.Itemid}`, { // Corrected URL format to match the backend route
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json', // Specifying JSON content
            },
            body: JSON.stringify(item), // Sending updated data in the request body
        });

        // If the response status is not OK, throw an error
        if (!response.ok) {
            const errorMessage = await response.json(); // Parse the response to get error details
            throw new Error(`Update failed: ${errorMessage.error || 'Unknown error'}`); // Throw an error if the response is not ok
        }

        alert('Item updated successfully!'); // Confirmation message after successful update

    } catch (error) {
        // Log the error and alert the user
        console.error('Error updating the item:', error);
        alert(`Error: ${error.message}`); // Alert the user with the error message
    }
}
//#endregion

