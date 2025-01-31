import { userdatabase,admindatabase} from "../managementjavascript/fetchanddisplay.js";
import { CreateUser,Userchangedetail} from "../managementjavascript/usermanagement.js";
import { isValidPassword,UsernamematchesPattern,EmailmatchesPattern} from "../managementjavascript/validation.js";

// Function to validate user input
function validateInput(Email, username, password, repassword, database,admindatabase) {
    let valid = true; // Validation Flag to track if all inputs are valid
    let alertmessages = []; // Array to collect alert messages for invalid inputs

    // Validate that all fields are filled
    if (!Email || !username || !password || !repassword) {
        valid = false; // Set validation flag to false
        alertmessages.push('Error: All fields are required. Please fill in all fields.'); // Alert message for empty fields
    } 
    else {
        
        // Validate Email format
        if (!EmailmatchesPattern(Email)) {
            valid = false; // Set validation flag to false if email format is incorrect
            alertmessages.push('Error: The email is not in proper format. Please try again.'); // Error message for invalid email format
        }

        // Validate Email duplication
        if (database.some(user => user.Email.toLowerCase() === Email.toLowerCase())) {
            valid = false; // Set validation flag to false if email is already registered
            alertmessages.push('Error: The Email is already registered. Please try another one.'); // Error message for existing email
        }
        // Validate Username format
        if(!UsernamematchesPattern(username)){
            valid = false; // Set validation flag to false if username is already taken
            alertmessages.push('Error: The Username should start with letters. Please try another one.'); // Error message for format of username
        }
        // Validate Username duplication
        if (database.some(user => user.Username.toLowerCase() === username.toLowerCase())) {
            valid = false; // Set validation flag to false if username is already taken
            alertmessages.push('Error: The Username is already taken. Please try another one.'); // Error message for existing username
        }
        // Validate Username duplication
        else if (admindatabase.admin.some(admin => admin.Username.toLowerCase() === username.toLowerCase())) {
            valid = false; // Set validation flag to false if username is already taken
            alertmessages.push('Error: The Username is already taken. Please try another one.'); // Error message for existing username
        }

        // Validate Password Matching
        if (password !== repassword) {
            valid = false; // Set validation flag to false if passwords do not match
            alertmessages.push('Error: The passwords do not match. Please try again.'); // Error message for password mismatch
        }

        // Validate Password Strength
        if (!isValidPassword(password)) {
            valid = false; // Set validation flag to false if password strength criteria are not met
            alertmessages.push('Error: The password is not strong enough. Please use more than 7 characters and include at least 1 special character and 1 alphabet letter.'); // Error message for weak password
        }
    }

    return { valid, alertmessages }; // Return the validation result with flag and messages
}

// Check if the current page is "authentication.html"
if (window.location.pathname.includes('Authentication.html')) {

 // Event listener for the login button click
 LoginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const username = document.getElementById('UsernameInput').value.trim();
    const password = document.getElementById('PasswordInput').value.trim();
    LoginUser(username,password);
});

   // Event listener for the login button click
RegForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    event.stopPropagation();

    // Fetch the data the user inputted  
    const Email = document.getElementById('Emailinput').value.trim();// Get the email
    const username = document.getElementById('Usernameinput').value.trim(); // Get the username
    const password = document.getElementById('Passwordinput').value.trim(); // Get the password
    const repassword = document.getElementById('Repasswordinput').value.trim(); // Get the confirm password

    if(RegisterUser(Email,username,password,repassword)){
        LoginUser(username,password);
    };
        
});
}


export async function RegisterUser(Email,Username,Password,repassword){
    // Await the user database call to fetch existing users
    const database = await userdatabase(); 
    const Admindatabase = await admindatabase();

    // Increment the maximum Userid based on existing users
    const id = database.length > 0 ? Math.max(...database.map(user => user.Userid)) + 1 : 1; 

    // Validate input
    const {valid, alertmessages} = validateInput( Email, Username, Password, repassword, database,Admindatabase)

    // If all validations passed, proceed with the rest of the code
    if(valid){
        // Prepare the User detail object to be sent to the server
        const Userdetail = {
            Userid: id, // Assign the newly generated User ID   
            FirstName: "", // Assign the user's First name
            LastName: "", // Assign the user's Last name
            Address: "", // Assign the user's Address
            PhoneNumber: "", // Assign the user's Phone Number
            Email: Email, // Assign the user's Email Address
            Birthdate: "", // Assign the user's birthdate            
            Username: Username, // Assign the username
            Password: Password, // Assign the password (valid, since it's checked earlier)
            Status: "0",
            Cart: [],
            Delivered:[]
        };

        await CreateUser(Userdetail); // Call the function to create the new user
        return true;
    }
    else
    {
        alert(alertmessages.join('\n'));// Validation failed, alert the collected error messages
        return false; // Stop the function execution if any validation fails
    }
};

// Function to check user login credentials
export async function LoginUser(username, password) { 

    // Fetch the user and admin data from the userdatabase function
    const data = await userdatabase();
    const admindata = await admindatabase();

    // Check if username or password is undefined or empty
    if (!username || !password) {       
        alert('Please fill the username and the password.'); // Alert the user to fill in both fields
        return null; // Exit the function if either field is empty
    }

    const admin = admindata.admin.find(admin =>admin.Username.toLowerCase() == username.toLowerCase().trim() && admin.Password == password);

    // Check if username or password is admin account
    if (admin) {
        console.log(admin.Adminid);
        location.replace(`../adminpages/adminhomepage.html?Adminid=${admin.Adminid}`); // Redirect to admin homepage
        return;
    }

    // Find the user in the data that matches the provided username and password (case insensitive)
    const user = data.findIndex(user =>
        (user.Email.toLowerCase() === username.toLowerCase() || user.Username.toLowerCase() === username.toLowerCase().trim()) && // Check if email or username matches
        user.Password === password);    // Check if password matches

    // If a matching user is found
    if (user !== -1) {     
        if(data[user].Status != "1"){
            
            const Matcheduser = {
                Userid: data[user].Userid,
                Status: "1"
            }
            const updateStatus = await Userchangedetail(Matcheduser);

            if (updateStatus) {                        
                location.replace(`../userhomepage/index.html?Userid=${Matcheduser.Userid}`);            
            }
            else{
                return alert("Fetching user data failed.");
            }
        }
        else{
            return alert("The account are currently login");
        }
    } 
    else {
        // If no matching user is found                   
        alert("Invalid username or password."); // Log error message to the console
        
        return null; // Return null if login fails
    }
};
