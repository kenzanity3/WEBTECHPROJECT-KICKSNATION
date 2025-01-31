import { userID } from "./fetchanddisplay.js";
import { accountcheck,idcheck,Logout} from "./validation.js";
import { RegisterUser,LoginUser } from "../authenticationpage/authentication.js";
//declare variable MenuItems which take ul having id "MenuItems"

// Check if the current page is an authentication page based on the query parameter
const isAdminPage = window.location.pathname.toLowerCase().includes('/adminpages');
if(!isAdminPage){
const MenuItems = document.getElementById("MenuItems");
MenuItems.style.maxHeight = "0px";//by default, we have set menu or dropdown menu height to 0px, means it is close by default
}


function menutoggle()//this is the function which we have called above in nav which works on small devices and users click on it
{
    if (MenuItems.style.maxHeight =="0px")//when user click on it and if it is closed or its height is 0px, then it will open or it should have heigt of 200px upon clicking
    {
        MenuItems.style.maxHeight = "200px"
    }
    else//if user not clicked or it has already opened, then it will upon clicking again closed
    {
        MenuItems.style.maxHeight = "0px" 
    }
};

//#region Form

// Reset the form fields
function resetForm(form) {
    form.reset(); // Resets all fields in the form
}

// Shift the form horizontally by the given position
function shiftForm(form, position) {
    form.style.transform = `translateX(${position}px)`;
}

// Shift the indicator to the given position
function shiftIndicator(position) {
    Indicator.style.transform = `translateX(${position}px)`;
}

function login() {
    // Shift the forms
    shiftForm(RegForm, 300); // Move the registration form off-screen
    shiftForm(LoginForm, 300); // Move the login form on-screen
    shiftIndicator(0); // Move the indicator to the login position

    // Reset the registration form fields
    resetForm(RegForm);
}

function register() {
    // Shift the forms
    shiftForm(RegForm, 0); // Move the registration form on-screen
    shiftForm(LoginForm, 0); // Move the login form off-screen
    shiftIndicator(100); // Move the indicator to the register position

    // Reset the login form fields
    resetForm(LoginForm);
}
    
function myFunction() {
alert("You are already on this page.");
}


function confirmDataLoss() {
    if (confirm("Leaving this page leads to data loss. Are you sure?")) {
        return true; // Proceed to cart.html
    } else {
        return false; // Stay on current page
    }
}

var quantityElements = document.querySelectorAll('.quantity-input'); 
quantityElements.forEach(quantityElement => {
    quantityElement.addEventListener('change', () => {
        if (quantityElement.value < 1) {
            quantityElement.value = 1;
        }
        if (quantityElement.value > 99) {
            quantityElement.value = 99;
        }
    });
});

//#endregion

//#region DOM
if(!isAdminPage){
//initialize design, url code and account check
document.addEventListener('DOMContentLoaded', async function() {

    //globalize the javascript design
    window.confirmDataLoss = confirmDataLoss;
    window.menutoggle = menutoggle;
    window.login = login;
    window.register = register;
 
    // Check if the current page is an authentication page based on the query parameter
    const isAuthenticationPage = window.location.pathname.toLowerCase().includes('/authenticationpage/authentication.html');

    // Dynamically determine the base path based on the current file's location
   const basePath = isAuthenticationPage ? '../userhomepage' : '.';

    // If the current page is not the authentication page, check if the user is logged in.
    if (!isAuthenticationPage) {
        // If the user is not logged in, show an alert and redirect to the login page.
        //let IsLoggedIn = await accountcheck();      
        //if (IsLoggedIn) {
        //    alert("You illegally login"); // Alert the user for unauthorized access
        //    location.replace("../authenticationpage/Authentication.html"); // Redirect to the authentication page
        //}

        // Get modal
        const loginModal = document.getElementById('login-modal');

        const authentication = `<div class="modal-content">     
                    <div class="form-container"><!--column for form-->
                        <span class="close" id="closebtn">&times;</span>
                        <div class="form-btn"><!--button for login and register-->
                            <span onclick="login()">Login</span><!--use js-->
                            <span onclick="register()">Register</span>
                            <hr id="Indicator"><!--red orange bar-->
                        </div>
                        <form id="LoginForm"><!--login form-->
                            <input type="text" placeholder="Username" id = "UsernameInput">
                            <input type="password" placeholder="Password" id = "PasswordInput">
                            <button type="submit" class="btn" id="LoginButton">Login</button>
                            <a href="">Forgot Password?</a>
                        </form>
                        <form id="RegForm"><!--registration form-->
                            <input type="text" placeholder="Username" id = "Usernameinput">
                            <input type="email" placeholder="Email" id = "Emailinput">
                            <input type="password" placeholder="Password" id = "Passwordinput">
                            <input type="password" placeholder="Confirm Password" id = "Repasswordinput">
                            <button type="submit" class="btn" id="RegisterButton">Register</button>
                        </form>
                    </div>
                </div>`;

        loginModal.innerHTML = authentication;  

        //Get login form and logout button elements
        const logoutBtn = document.getElementById('logout-btn');
        const closeBtn = document.getElementById('closebtn');
        if(!await idcheck()){
        logoutBtn.style.display = 'block';
        logoutBtn.style.marginLeft = 'auto';
        };

        // Function to show login modal
        function showModal() {
        loginModal.style.display = 'block'; 
        }

        // Function to hide login modal
        function hideModal() {
        loginModal.style.display = 'none';
        }

        window.hideModal = hideModal();

        // Event listeners for login, logout and modal close
        closeBtn.addEventListener('click', hideModal);
        window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            hideModal();
        }
        });

        logoutBtn.addEventListener('click', async () => {
        // Call logout API or function here
        await Logout();
        logoutBtn.style.display = 'none';
        });       

        const LoginForm = document.getElementById("LoginForm");
        const RegForm = document.getElementById("RegForm");
        const Indicator = document.getElementById("Indicator");


        // Event listener for the login button click
        LoginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            event.stopPropagation();
        
            const username = document.getElementById('UsernameInput').value.trim();
            const password = document.getElementById('PasswordInput').value.trim();
            LoginUser(username,password);
            hideModal();
        });

           // Event listener for the login button click
        RegForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            event.stopPropagation();
        
            // Fetch the data the user inputted  
            const Email = document.getElementById('Emailinput').value.trim();// Get the email
            const username = document.getElementById('Usernameinput').value.trim(); // Get the username
            const password = document.getElementById('Passwordinput').value.trim(); // Get the password
            const repassword = document.getElementById('Repasswordinput').value.trim(); // Get the confirm password

            if(RegisterUser(Email,username,password,repassword)){
            hideModal();
            };
        });

        document.getElementById('carturl').onclick = function() {
            window.location.assign(`${basePath}/cart.html?Userid=${userID()}`);
        };

        document.getElementById('accounturl').addEventListener('click', async () => {
        await idcheck() ? showModal() : window.location.assign(`${basePath}/account.html?Userid=${userID()}`)
        });
      
    }
 
    // Navigation link event listeners
    document.getElementById('productsurl').onclick = function() {
        window.location.assign(`${basePath}/Products.html?Userid=${userID()}&Page=1&Filter=1&Brand=Default`);
    };

    document.getElementById('homepageurl').onclick = function() {
        window.location.assign(`${basePath}/index.html?Userid=${userID()}`);
    };

    document.getElementById('homelogo').onclick = function() {
        window.location.assign(`${basePath}/index.html?Userid=${userID()}`);
    };

    document.getElementById('aboutusurl').onclick = function() {
        window.location.assign(`${basePath}/about.html?Userid=${userID()}`);
    };

    document.getElementById('contactusurl').onclick = function() {
        window.location.assign(`${basePath}/contact.html?Userid=${userID()}`);
    };
});
};

   //#endregion 
