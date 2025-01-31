import {userID, itemdatabase} from '../managementjavascript/fetchanddisplay.js';

const urlParams = new URLSearchParams(window.location.search);
// Get the filter value from URL parameters (default to null if not set)
const selecturl = parseInt(urlParams.get('Filter'));
// Get the select dropdown element by its ID
const select = document.getElementById('select');

const selectbrand = document.getElementById('selectbrand');
const selectbrandurl = urlParams.get('Brand');
// Get the current page from URL parameters or default to page 1 if not provided
const currentPage = parseInt(urlParams.get('Page')) || 1;


// Async function to initialize item display and pagination
async function initializeDisplay() {
    const nikeitem = document.getElementById('btnNike');
    nikeitem.href = `product-detail.html?Userid=${userID()}&Itemid=1`;

    // Set the selected value in the dropdown menu based on the URL parameter or the default value
    select.value = selecturl !== null && selecturl <= 5 ? selecturl : parseInt(select.value) > 1 && parseInt(select.value) <= 5 ? select.value : 1;
    selectbrand.value = selectbrandurl ? selectbrandurl : "Default";
    let items;
    // Await the item data from itemdatabase function to ensure data is available
    if(selectbrand.value == "Default")
        items = await itemdatabase();
    if(selectbrand.value == "Nike")
        items = (await itemdatabase()).filter(item => item.Brand == "Nike");
    if(selectbrand.value == "Adidas")
        items = (await itemdatabase()).filter(item => item.Brand == "Adidas");
    if(selectbrand.value == "Puma")
        items = (await itemdatabase()).filter(item => item.Brand == "Puma");

    // Function to create a page button element for pagination
    function pagebutton(num) {
        const pageLink = document.createElement('a'); // Create an anchor element
        pageLink.href = `Products.html?Userid=${userID()}&Page=${num}&Filter=${select.value}`; // Set the URL for the page link
        pageLink.innerHTML = `<span>${num}</span>`; // Display the page number in the button
        return pageLink; // Return the anchor element
    }

    // Function to create the HTML for a single item card
    function displayitem(item) {
        // Determine CSS classes for the rating based on item's Rating property
        const Rating = (rate) => item.Rating >=  rate? "fa fa-star" : item.Rating > (rate-1) ? "fa fa-star-half-o" : "fa fa-star-o";
        
        // Return an HTML string representing the item, including item image, name, rating, and price
        return `
                <a href="product-detail.html?Userid=${userID()}&Itemid=${item.Itemid}">
                    <img src="${item.Image}">
                    <h4>${item.Name}</h4>
                    <div class="rating">
                        <i class="${Rating(1)}"></i>
                        <i class="${Rating(2)}"></i>
                        <i class="${Rating(3)}"></i>
                        <i class="${Rating(4)}"></i>
                        <i class="${Rating(5)}"></i>
                    </div>
                    <p>₱${item.Price}</p>
                </a>`;
    }


    // Function to display featured items (sorted by price and rating)
    function featureddisplayitems(itemdatabase) {
        const Container = document.getElementById('featuredproduct'); // Get the container for featured products
        const fragment = document.createDocumentFragment(); // Create a document fragment for efficient DOM manipulation

        // Sort items by price in ascending order (lowest to highest)
        let sortedItems = itemdatabase.sort((a, b) => a.Price - b.Price);
        // Then, sort by rating in descending order (highest to lowest)
        sortedItems = sortedItems.sort((a, b) => b.Rating - a.Rating);

        // Select the top 4 items to display
        const itemtodisplay = sortedItems.slice(0, 4);

        // Loop through each item and create its HTML
        itemtodisplay.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.innerHTML = displayitem(item); // Call displayitem to get item HTML
            itemElement.className = 'col-4'; // Add a class for styling the item
            fragment.appendChild(itemElement); // Append the item element to the fragment
        });

        // Append the entire fragment to the container in a single operation
        Container.appendChild(fragment);
    }

    // Function to display the latest items
    function latestdisplayitems(itemdatabase) {
        const Container = document.getElementById('latestproduct'); // Get the container for latest products
        const fragment = document.createDocumentFragment(); // Create a document fragment for efficient DOM manipulation

        // Sort items by item ID in descending order (latest items first)
        const sortedItems = itemdatabase.sort((a, b) => b.Itemid - a.Itemid);
        const itemtodisplay = sortedItems.slice(0, 8); // Take the top 8 items
        let i = 0, e = 1; // Counters for row and item tracking
        let RowContainer = document.createElement('div'); // Create a new row container
        RowContainer.className = 'row'; // Add class for styling the row
        
        // Loop through each item and create its HTML
        itemtodisplay.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.innerHTML = displayitem(item); // Call displayitem to get item HTML
            itemElement.className = 'col-4'; // Add a class for item styling

            // Append item to the current RowContainer
            RowContainer.appendChild(itemElement);
            i++; // Increment item counter

            // After every 4 items, start a new row and add the current row to the fragment
            if (i === 4) {
                fragment.appendChild(RowContainer);
                RowContainer = document.createElement('div');
                RowContainer.className = 'row'; // Create a new row
                i = 0; // Reset item counter
                e++; // Increment row counter
            }

            // Stop adding rows if we've reached 2 rows
            if (e >= 2) return;
        });

        // Append any remaining items if they don't complete a full row
        if (RowContainer.childNodes.length > 0 && e < 2) {
            fragment.appendChild(RowContainer);
        }

        // Append the entire fragment to the container in a single operation
        Container.appendChild(fragment);
    }

    // Function to display all items with pagination and sorting
    function alldisplayitems(itemdatabase) {
        const itemsPerPage = 12; // Number of items per page
        const startIndex = (currentPage - 1) * itemsPerPage; // Calculate start index for current page
        const endIndex = Math.min(startIndex + itemsPerPage, itemdatabase.length); // Calculate end index for slice
        const Container = document.getElementById('ItemsContainer'); // Get the container for item display    
        const fragment = document.createDocumentFragment(); // Create a document fragment for efficient DOM manipulation

        // Sorting logic based on the selected value from the dropdown
        const selectedvalue = select.value;
        let sortedItems;

        switch (selectedvalue) {
            case "1":
                sortedItems = items; // No sorting
                break;
            case "2":
                sortedItems = items.sort((a, b) => b.Price - a.Price); // Sort by price (desc)
                break;
            case "3":
                sortedItems = items.sort((a, b) => a.Price - b.Price); // Sort by price (asc)
                break;
            case "4":
                sortedItems = items.sort((a, b) => b.Rating - a.Rating); // Sort by rating (desc)
                break;
            case "5":
                sortedItems = items.sort((a, b) => a.Rating - b.Rating); // Sort by rating (asc)
                break;
        }

        // Slice the sorted items to get the ones for the current page
        const itemtodisplay = sortedItems.slice(startIndex, endIndex);

        let i = 0, e = 1;
        let RowContainer = document.createElement('div');
        RowContainer.className = 'row'; // Add row class

        // Loop through each item and create its HTML
        itemtodisplay.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.innerHTML = displayitem(item);
            itemElement.className = 'col-4';

            // Append item to the current RowContainer
            RowContainer.appendChild(itemElement);
            i++;

            // After every 4 items, start a new row
            if (i === 4) {
                fragment.appendChild(RowContainer);
                RowContainer = document.createElement('div');
                RowContainer.className = 'row';
                i = 0;
                e++;
            }

            // Stop adding rows if we've reached 3 rows
            if (e >= 3) return;
        });

        // Append any remaining items that don't complete a full row
        if (RowContainer.childNodes.length > 0 && e < 3) {
            fragment.appendChild(RowContainer);
        }

        // Append the entire fragment to the container in a single operation
        Container.appendChild(fragment);
    }

    // Function to display pagination buttons
    function DisplayPage(items) {
        const totalPages = Math.ceil(items.length / 12); // Calculate total pages based on items per page
        const Container = document.getElementById('page-btn'); // Get the container for pagination buttons

        // Check if the pagination container exists
        if (!Container) {
            console.error("Element with ID 'page-btn' not found in the HTML.");
            return;
        }

        // Create a fragment for efficient DOM manipulation
        const fragment = document.createDocumentFragment();

        // Loop through the total pages and create page buttons
        for (let i = 1; i <= totalPages; i++) {
            const page = pagebutton(i); // Create a page button for each page
            fragment.appendChild(page);
        }

        // Append all page buttons to the container in a single operation
        Container.appendChild(fragment);
    }

    // Display items and pagination based on current page
    if (currentPage === 1) {
        // Display latest items, featured items, pagination buttons, and all items for page 1
        latestdisplayitems(items);
        featureddisplayitems(items);
        DisplayPage(items);
        alldisplayitems(items);
    } else {
        // Display all items and pagination for other pages
        alldisplayitems(items);
        DisplayPage(items);
    }
}
// Add event listener to handle changes in the select dropdown
document.getElementById('select').addEventListener('change', () => {
    // Replace the current page URL with the updated Filter value from the dropdown
    location.replace(`Products.html?Userid=${userID()}&Page=${currentPage}&Filter=${select.value}&Brand=${selectbrandurl}`);
})
// Add event listener to handle changes in the select dropdown
document.getElementById('selectbrand').addEventListener('change', () => {
    // Replace the current page URL with the updated Filter value from the dropdown
    location.replace(`Products.html?Userid=${userID()}&Page=${currentPage}&Filter=${select.value}&Brand=${selectbrand.value}`);
})

// Ensure the initialization function is only run after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeDisplay());



    