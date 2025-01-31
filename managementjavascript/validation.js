import { userID,GetUserData } from "./fetchanddisplay.js";
import { Userchangedetail } from "./usermanagement.js";


// Function for checking the name integrity
export function isValidName(name) {
    // Check for minimum length (at least 2 characters) and contains only letters
    const nameRegex = /^[A-Za-z ]{2,}$/;
    return nameRegex.test(name); // Return true if the name meets the criteria, false otherwise
}

// Function for checking the password integrity
export function isValidPassword(password) {
    // Check for minimum length (at least 8 characters), at least one letter, and at least one special character
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\W)(?=.{8,}).*$/;
    return passwordRegex.test(password); // Return true if password meets the criteria, false otherwise
}

// Function for checking the address format
export function UsernamematchesPattern(input) {
    // Regex pattern for validating usernames
    const usernamePattern = /^(?!\d)[A-Za-z][A-Za-z0-9]*$/; //only letters and numbers

    // Return true if the input matches the address pattern
    return usernamePattern.test(input);
}

// Function for checking the email format
export function EmailmatchesPattern(input) {
    // Regex pattern for validating email addresses
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // accept letters,number,@,.

    // Return true if the input matches the email pattern
    return emailPattern.test(input);
}

// Function for checking the address format
export function AddressmatchesPattern(input) {
    // Regex pattern for validating address in the format "streetnumber streetname, cityname, countryname"
const addressPattern = /^\d+\s+[A-Za-z]+(?:\s[A-Za-z.-]+)*,\s+[A-Za-z]+(?:\s[A-Za-z.-]+)*,\s+[A-Za-z]+(?:\s[A-Za-z.-]+)*$/;

    // Return true if the input matches the address pattern
    return addressPattern.test(input);
}

//Checks if the user is logged in by validating their ID and status.
export async function idcheck() {
    // Check if the user ID is null
    if (userID() == null)
        return true; // User is not logged in
    
    // Fetch user data and check if it exists
    const userdata = await GetUserData();
    if (userdata == null)
        return true; // User data not found
    
    // Check if the user status indicates logged out
    if (userdata.Status == "0")
        return true;

    return false; // User is logged in and data is valid
}

export async function accountcheck(){
    const userdata = await GetUserData();  
    
    // Check if userdata exists, Status is "0", and userID is not null
    //if(userdata && userdata.Status == "0" && userID() !== null)
    //    return true // User is logged out
    return false // Either user is logged in or user ID is null
}

// Validates Philippine phone number format (e.g., "09123456789")
export function phonematchesPattern(input) {
    const pattern = /^09\d{9}$/; // Pattern for "09" followed by nine digits
    return pattern.test(input); // Return if input matches pattern
}

 //Logs out the current user by updating their status and redirecting to the authentication page.
export function Logout() {
  // let user = {
  //     Userid: userID(), // Get the current user's ID
  //     Status: "0"       // Mark the user as logged out
  // };

  // Userchangedetail(user); // Update user status
   location.replace("../authenticationpage/Authentication.html"); // Redirect to login page
};



