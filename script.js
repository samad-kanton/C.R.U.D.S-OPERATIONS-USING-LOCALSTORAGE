// selecting the elements from the DOM
let data = localStorage.getItem('products'),
    form = document.querySelector('form'),
    btnSubmit = document.querySelector('[type="submit"]'),
    btnCancel = document.querySelector('[type="button"]'),
    title = document.querySelector('#title'),
    qty = document.querySelector('#qty'),
    cp = document.querySelector('#cp'),
    sp = document.querySelector('#sp'),
    inputs = form.querySelectorAll('input'),
    tbody = document.querySelector('tbody'),
    tfoot = document.querySelector('tfoot'),
    btnClearData = document.querySelector('#btnClearData'),
    dataCount = document.querySelector('#dataCount'),
    search = document.querySelector('#search');

const saveProduct = () => {
    data = data ?? [];
    if(data.findIndex(product => product.title === title.value) < 0){
        // getting and storing the values of the form(user input) in the data array using the *SPREAD method
        data = [...data, { title: title.value, qty: qty.value, cp: cp.value, sp: sp.value }];
        // checking the *DATA-ID attribute of the submit button to see if it is set or not and calling the appropriate function
        localStorage.setItem('products', JSON.stringify(data));
        // fetching the data(all products) upon saving
        fetchProducts();
        // clearing the form
        resetForm();
    } 
    else {
        alert('Product already exists');
        title.focus();
    }
},
resetForm = () => {
    // resetting the form to its default state using the *FOR...OF method
    form.reset();
    // resetting the background color and text of the submit button
    btnSubmit.style.background = 'dodgerblue';
    btnSubmit.textContent = 'Save';
    // remove the data-id attribute from the submit button used to update the data
    btnSubmit.removeAttribute('data-id');
    // setting the focus on the title input
    title.focus();
},
fetchProducts = () => {
    // empty the contents of the table
    tfoot.innerHTML = '';
    tbody.innerHTML = '';
    // reinitialize/reset/update the value of data array
    data = JSON.parse(localStorage.getItem('products'));
    // Displaying the total number of products 
    dataCount.textContent = data ? data.length : 0;
    // assert the data array is not empty
    if(data != null && data.length > 0){
        // loop through the data array and display the data in the table
        data.map((item, i) => {
            // displaying the data in the body of the table
            tbody.innerHTML += `<tr>
                <td>${++i}</td>
                <td>${item.title.toUpperCase()}</td>
                <td>${item.qty}</td>
                <td>${parseFloat(item.cp).toFixed(2)}</td>
                <td>${parseFloat(item.sp).toFixed(2)}</td>
                <td style="width: 115px;">
                    <button type="button" id="btnEditProduct" onclick="previewUpdate(${--i});">Edit</button>
                    <button type="button" id="btnDeleteProduct" onclick="deleteProduct(${--i});">Delete</button>
                </td>                
            </tr>`;
        });
    }
    else{
        // displaying to user that there is no data to show using the tfoot element
        tfoot.innerHTML = `<tr>
                    <td colspan="7"><h1 style="background: #f1f1f1; color: #f00; text-align: center; padding: 40px;">No data to show</h1></td>
                </tr>
        `;
    }
},
previewUpdate = i => {
    // preview the data to be updated in the form
    title.value = data[i].title;
    qty.value = data[i].qty;
    cp.value = data[i].cp;
    sp.value = data[i].sp;
    // change the background color and text of the submit button when the user clicks on the edit button
    btnSubmit.style.background = 'green';
    btnSubmit.textContent = 'Update';
    // setting the *DATA-ID attribute of the submit button to the index of the data array
    btnSubmit.setAttribute('data-id', i);    
},
updateProduct = id => {
    // updating the values of the data array 
    data[id].title = title.value;
    data[id].qty = qty.value;
    data[id].cp = cp.value;
    data[id].sp = sp.value;
    // update the localStorage
    localStorage.setItem('products', JSON.stringify(data));
    // fetch the data again
    fetchProducts();
},
deleteProduct = i => {
    if(confirm('Are you sure you want to delete this product?')){
        // remove the data from the data array
        data.splice(++i, 1);
        // update the localStorage
        localStorage.setItem('products', JSON.stringify(data));
        // fetch the data again
        fetchProducts();
    }
},
searchProducts = query => {
    // emptying the contents of the tfoot element before displaying search results
    tfoot.innerHTML = '';
    // looping through the data array and returning the data that matches the query by using the *INCLUDES method and toggling the display property of the tr elements
    let found = data.map((item, i) => tbody.querySelectorAll('tr')[i].style.display = item.title.toLowerCase().includes(query.toLowerCase()) ? '' : 'none');
    // displaying no data to show if the query is not found by using the *FILTER method of the data array
    if(data.length === found.filter(tr => tr == 'none').length){
        // setting the contents of the tfoot element
        tfoot.innerHTML = `<tr>
                            <td colspan="7"><h1 style="background: #f1f1f1; color: #f00; text-align: center; padding: 40px;">No results found!</h1></td>
                        </tr>`;
    }
},
clearData = () => {
    if(data && confirm('Are you sure you want to clear all data?')){
        // clearing the localStorage
        localStorage.removeItem('products');
        // fetching the data again
        fetchProducts();
    }
};

fetchProducts();

form.addEventListener('submit', e => {
    // preventing the default behaviour of the form
    e.preventDefault();
    // saving the data to the localStorage
    !btnSubmit.getAttribute('data-id') ? saveProduct() : updateProduct(btnSubmit.getAttribute('data-id')); 
});

// searching the data when the user types in the search input
search.addEventListener('input', e => searchProducts(e.target.value));

// cancel update and reset the form to its default state
btnCancel.addEventListener('click', e => resetForm());

// clearing the data from the localStorage
btnClearData.addEventListener('click', e => clearData());
