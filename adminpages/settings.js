import {CreateAdmin,Adminchangedetail} from "../managementjavascript/usermanagement.js";
import {adminID, admindatabase,userdatabase} from "../managementjavascript/fetchanddisplay.js";
import {isValidName,isValidPassword,UsernamematchesPattern} from "../managementjavascript/validation.js";
const AdminChangeForm = document.getElementById('AdminInfoForm');
const AddAdminForm = document.getElementById('AdminRegForm');

var users;
var admins;
var admindata;

function validateinput(name, username, password, repassword,access) {
    let valid = true; // Validation flag
    let alertMessages = []; // Array for error messages

    if (!name && !username && !password && !repassword) {
        alertMessages.push('Error:all fields are required.');
        valid = false;
    }
    if(access === 1)
    {
        if (!name || !username || !password || !repassword) {
            alertMessages.push('Error:all fields are required.');
            valid = false;
        } 
        if (name && username && password && repassword) {
            access = 2;
        }
    }
    if(access === 2){
        if(name){
            if (!isValidName(name)) {
                valid = false;
                alertMessages.push('Error: The name should be letters only.');
            }
        }

        if (username) {
            // Validate username format
            if (!UsernamematchesPattern(username)) {
                valid = false;
                alertMessages.push('Error: Username should start with letters.');
            }

            // Check for duplicate username
            const existingUser = users.find(user => user.Username.toLowerCase() === username.toLowerCase());
            if (existingUser) {
                valid = false;
                alertMessages.push('Error: Username is already taken.');
            }

            // Check for admin username
            const existingadmin = admins.admin.find(admin => admin.Username.toLowerCase() === username.toLowerCase() && admin.Adminid !== parseInt(adminID()));
            if (existingadmin) {
                valid = false;
                alertMessages.push('Error: Username is already taken.');
            }

            if (password && repassword) {
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
        } 
    }
    return { valid, alertMessages }; // Make sure the return value includes both fields
}

function oldinfo(name,username,password,repassword){

    if (!name) {
        name = admindata.AdminName;  
    }
    if (!username) {
        username = admindata.Username;  
    }
    if (!password && !repassword) {
        password = admindata.Password;  
        repassword = admindata.Password;  
    }

    return {name,username,password,repassword};
};

document.addEventListener("DOMContentLoaded",async (e) => {
    e.preventDefault();
    e.stopPropagation();

    users = await userdatabase();
    admins = await admindatabase();

    admindata = admins.admin.find(admin => admin.Adminid === parseInt(adminID()));


    var {name,username} = oldinfo(null,null);
    AdminChangeForm.elements['AdminName'].placeholder = name;
    AdminChangeForm.elements['AdminUsername'].placeholder = username;
});


AdminChangeForm.addEventListener('submit', async (e) => {
e.preventDefault();
e.stopPropagation();

var Name = AdminChangeForm.elements['AdminName'].value.trim(); 
var Username = AdminChangeForm.elements['AdminUsername'].value.trim(); 
var Password = AdminChangeForm.elements['AdminPassword'].value.trim(); 
var Repassword = AdminChangeForm.elements['AdminRePassword'].value.trim(); 

if(!Name && !Username && !Password && !Repassword){
    return alert("Please fill the change detail fields."); 
}

const {name,username,password,repassword} = oldinfo(Name,Username,Password,Repassword);

const { valid, alertMessages } = validateinput(name,username,password,repassword,2);


    if(valid){
        const check = prompt("Confirmation Password");
        if(check === admindata.Password){
        const admindetail = {
            AdminName: name,
            Username: username,
            Password: password
        }

        if(await Adminchangedetail(admindetail)){
            alert("Admin information updated successfully.");
        return window.location.reload();
        }
    }
    else{
        return alert("operation aborted");
    }
}
    else
    {
        alert(alertMessages.join('\n'));// Validation failed, alert the collected error messages
        return false; // Stop the function execution if any validation fails
    }
});


AddAdminForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    var Name = AddAdminForm.elements['AdminAddName'].value.trim(); 
    var Username = AddAdminForm.elements['AdminAddUsername'].value.trim(); 
    var Password = AddAdminForm.elements['AdminAddPassword'].value.trim(); 
    var Repassword = AddAdminForm.elements['AdminAddRePassword'].value.trim(); 
      
    const { valid, alertMessages } = validateinput(Name,Username,Password,Repassword,1);
    
    
        if(valid){
            const check = prompt("Confirmation Password");
            if(check === admindata.Password){
            const admindetail = {
                Adminid: null,
                AdminName: Name,
                Username: Username,
                Password: Password
            }
    
            if(await CreateAdmin(admindetail)){
                alert("New Admin added successfully");
            return window.location.reload();
            }
        }
        else{
            return alert("operation aborted");
        }
    }
        else
        {
            alert(alertMessages.join('\n'));// Validation failed, alert the collected error messages
            return false; // Stop the function execution if any validation fails
        }
    });





