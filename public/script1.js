signUp.addEventListener("click", () => {
    image.style.left = "250px";
    image.style.borderRadius = "0 20px 20px 0";
    left.style.zIndex=2;
});

Status.addEventListener('click',()=>{
    generate.style.backgroundColor="#D9E4EC";
    Status.style.backgroundColor="#B7CFDC";
    // pay.style.backgroundColor="#D9E4EC";
    Status.style.transition="all linear 0.25s";
    homediv.style.display="none";
    secondPage.style.display="none";
    manage.style.display="flex";
    dashes.style.display="none";
    clients.style.display="none";
});

homeref.addEventListener('click',()=>{
    generate.style.backgroundColor="#D9E4EC";
    Status.style.backgroundColor="#D9E4EC";
    homediv.style.display="flex";
    secondPage.style.display="none";
    manage.style.display="none";
    dashes.style.display="none";
    clients.style.display="none";
    loadInvoices();
});

btn23.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed"); 
});

document.getElementById('add-item').addEventListener('click', () => {
    const tableBody = document.querySelector('#items-table tbody');
    const row = document.createElement('tr');

    row.innerHTML = `
        <td><input type="text" placeholder="Item name"></td>
        <td><input type="number" min="1" value="1" class="quantity"></td>
        <td><input type="number" min="0" step="0.01" value="0.00" class="unit-price"></td>
        <td class="item-total">0.00</td>
    `;

    tableBody.appendChild(row);
    updateTotals();
});

document.getElementById('items-table').addEventListener('input', (e) => {
    if (e.target.classList.contains('quantity') || e.target.classList.contains('unit-price')) {
        const row = e.target.closest('tr');
        const quantity = parseFloat(row.querySelector('.quantity').value || 0);
        const unitPrice = parseFloat(row.querySelector('.unit-price').value || 0);
        const total = quantity * unitPrice;
        row.querySelector('.item-total').textContent = total.toFixed(2);
        updateTotals();
    }
});

function updateTotals() {
    let grandTotal = 0;
    document.querySelectorAll('.item-total').forEach(totalCell => {
        grandTotal += parseFloat(totalCell.textContent || 0);
    });
    document.getElementById('grand-total').textContent = grandTotal.toFixed(2);
}

function printInvoice() {
    window.print();
}

document.getElementById('edit').addEventListener('click', function() {
    
    const hiddenColumns = document.querySelectorAll('.hiddencolumn');
    
    hiddenColumns.forEach(column => {
        if (column.style.display === 'none' || column.style.display === '') {
            column.style.display = 'table-cell';
        } else {
            column.style.display = 'none';
        }
    });
});

function fillChart(){
pieChart.style.background = `conic-gradient(
    #10B981 0% ${percentofpaid}%, 
    #B9101E ${percentofpaid}% 100%
)`;
pieChart.style.transition = `all linear 2s`
}

function fillChart1(){
pieChart1.style.background = `conic-gradient(
    #10B981 0% ${percentofpaid}%, 
    #B9101E ${percentofpaid}% 100%
)`;
pieChart1.style.transition = `all linear 2s`
}

generate.addEventListener('click',()=>{
    generate.style.backgroundColor="#B7CFDC";
    Status.style.backgroundColor="#D9E4EC";
    // pay.style.backgroundColor="#D9E4EC";
    generate.style.transition="all linear 0.25s";
    homediv.style.display="none";
    secondPage.style.display="flex";
    manage.style.display="none";
    dashes.style.display="none";
    clients.style.display="none";
    loadInvoices();
});

change.addEventListener("click",()=>{
    if(changeStatus==0)
    {
        barChart.style.display="none";
        pieChart1.style.display="flex";
        change.innerText="Pie Chart";
        changeStatus=1;
    }
    else
    {
        barChart.style.display="flex";
        pieChart1.style.display="none";
        change.innerText="Bar Chart";
        changeStatus=0;
    }

});

function fillBarChart()
{
    bar1.style.height=`${percentofpaid}%`;
    bar2.style.height=`${percentofpending}%`;
    bar1.style.transition = `all linear 2s`;
    bar2.style.transition = `all linear 2s`;
}

document.getElementById("generate-invoice").addEventListener("click", () => {
    if (loggedInUser) {
        document.getElementById("printname").textContent = loggedInUser.username;
        storeduser=loggedInUser.username;
        document.getElementById("printaddress").textContent = loggedInUser.address;
        document.getElementById("printemail").textContent = loggedInUser.email;
        document.getElementById("printcontact").textContent = loggedInUser.contactNo;
    } else {
        alert("Please log in first to generate the invoice with user details.");
    }
});

logout.addEventListener("click",()=>{
    location.reload();
});

someShit.addEventListener("click",()=>{
    generate.style.backgroundColor="#D9E4EC";
    Status.style.backgroundColor="#B7CFDC";
    // pay.style.backgroundColor="#D9E4EC";
    Status.style.transition="all linear 0.25s";
    homediv.style.display="none";
    secondPage.style.display="none";
    manage.style.display="flex";
    dashes.style.display="none";
    clients.style.display="none";

});

someDeepShit.addEventListener("click",()=>{
    generate.style.backgroundColor="#D9E4EC";
    Status.style.backgroundColor="#D9E4EC";
    // pay.style.backgroundColor="#D9E4EC";
    generate.style.transition="all linear 0.25s";
    homediv.style.display="none";
    secondPage.style.display="none";
    manage.style.display="none";
    dashes.style.display="none";
    clients.style.display="flex";
    loadInvoices();
});

btn69.addEventListener("click",()=>{
    generate.style.backgroundColor="#D9E4EC";
    Status.style.backgroundColor="#D9E4EC";
    homediv.style.display="none";
    secondPage.style.display="none";
    manage.style.display="none";
    clients.style.display="none";
    dashes.style.display="flex";
    loadInvoices();
});
