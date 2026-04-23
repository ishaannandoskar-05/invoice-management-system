let signUp = document.getElementById("signUp");
let btn = document.getElementById("signUpButton");
let signUpName = document.getElementById("signUpName");
let signUpPassword = document.getElementById("signUpPassword");
let confirmPassword = document.getElementById("confirmPassword");
let image = document.getElementById("left");
let loginBtn = document.getElementById("loginButton");
let heading = document.getElementById("main-header-dynamic");
let signUpButton = document.getElementById("signUpButton");
let generate = document.getElementById("generate");
let Status = document.getElementById("status");
let homediv=document.getElementById("homediv");
let homeref=document.getElementById("homeref");
let secondPage = document.getElementById("generateInvoice");
let whole = document.getElementById("secondpage");
let login = document.getElementById("login1");
let manage= document.getElementById("manageInvoice");
let btn23 = document.getElementById("sidebar-band");
let sidebar = document.getElementById("sidebarid");
let invoice = document.getElementById("generateInvoice").innerHTML;
let left = document.getElementById("leftmost");
let right = document.getElementById("right");
let loginName=document.getElementById("login-name");
let loginPassword=document.getElementById("login-password");
var i = 0;
var sumOfInvoice = 0;
var sumOfPaid = 0;
var generalTotal = 0;
let homepending = document.getElementById("sumOfInvoice");
let homepaid = document.getElementById("sumOfPaid");
let fill11 = document.getElementById("fillspending");
let fill21 = document.getElementById("fillspaid");
let percentofpending;
let percentofpaid;
let n=0;
let pieChart = document.getElementById("pieChart");
let pieChart1 = document.getElementById("pieChart1");
let change = document.getElementById("changefigure");
let barChart = document.getElementById("barchart");
let bar1 = document.getElementById("bar");
let bar2 = document.getElementById("bar1");
let changeStatus=0;
let loggedInUser = null;
let storeduser;
let logout = document.getElementById("logout");
let someShit = document.getElementById("invoiceref");
let someDeepShit = document.getElementById("clientref");
let btn69 = document.getElementById("dashref");
let dashes = document.getElementById("dashes");
let storedname;
let clients = document.getElementById("manageclients");
let body=document.getElementById("body");

document.getElementById("loginButton").addEventListener("click", async (event) => {
    event.preventDefault();
    const username = document.getElementById("login-name").value.trim();
    const password = document.getElementById("login-password").value.trim();
    if (!username || !password) {
        alert("Please enter your username and password.");
        return;
    }
    try {
        const response = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });
        if (response.ok) {
            storeduser = username;
            alert("Login successful!");
            login.style.display="none";
            heading.style.display="flex";
            whole.style.display="inline";
            fetchUserDetails(username);
            loadInvoices();
        } else {
            alert("Login failed. Please check your credentials.");
        }
    } catch (error) {
        alert("Error connecting to the server.");
    }
});

signUpButton.addEventListener("click", async (event) => {
    event.preventDefault();

    const username = document.getElementById("signUpName").value.trim();
    const email = document.getElementById("signUpEmail").value.trim();
    const contactNo = document.getElementById("signUpNo").value.trim();
    const address = document.getElementById("signUpAddress").value.trim();
    const password = document.getElementById("signUpPassword").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    if (!username || !email || !contactNo || !address || !password || !confirmPassword) {
        alert("Please enter all details.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    try {
        const response = await fetch("/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, contactNo, address, password, confirmPassword })
        });

        if (response.ok) {
            alert("User registered successfully!");
            image.style.left = "0px";
            image.style.borderRadius = "20px 0 0 20px";
            left.style.zIndex=0;
        } else {
            const errorText = await response.text();
            alert(errorText);
        }
    } catch (error) {
        alert("Error connecting to the server.");
    }
});

async function fetchUserDetails(username) {
    try {
        const response = await fetch(`/api/user/${username}`);
        if (!response.ok) {
            throw new Error("Failed to fetch user details");
        }
        const user = await response.json();
        loggedInUser = user;
        document.getElementById("printname").textContent = user.username || "N/A";
        storeduser=user.username;
        document.getElementById("printaddress").textContent = user.address || "N/A";
        document.getElementById("printemail").textContent = user.email || "N/A";
        document.getElementById("printcontact").textContent = user.contactNo || "N/A";
    } catch (error) {
        console.error("Error fetching user details:", error);
    }
}


async function loadInvoices() {
    try {
        const username = storeduser;
        if (!username) {
            console.error("Username not found in local storage");
            return;
        }

        const response = await fetch(`/api/invoices/${username}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const invoices = await response.json();
        const invoiceTableBody = document.querySelector('#IMtable tbody');
        invoiceTableBody.innerHTML = "";

        let sumOfInvoice = 0;
        let sumOfPaid = 0;

        invoices.forEach((invoice, index) => {
            let formattedDate = new Date(invoice.invoiceDate).toLocaleDateString('en-IN');
            let formattedTotal = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(invoice.grandTotal);
            let grandTotal = invoice.grandTotal || 0; 

            if (invoice.status === "Pending") sumOfInvoice += grandTotal;
            else sumOfPaid += grandTotal;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1})</td>
                <td>${invoice.invoiceId}</td>
                <td>${invoice.buyerName}</td>
                <td>${formattedTotal}</td>
                <td id="status-${invoice.invoiceId}">${invoice.status}</td> 
                <td>${formattedDate}</td>
                <td class="hiddencolumn">
                    <i class="bx bx-edit edit-btn" data-invoice-id="${invoice.invoiceId}"></i>
                </td>
            `;
            invoiceTableBody.appendChild(row);
        });

        document.querySelectorAll('.edit-btn').forEach(editButton => {
            editButton.addEventListener('click', async function () {
                const invoiceId = this.getAttribute('data-invoice-id');
                const statusElement = document.getElementById(`status-${invoiceId}`);
                const newStatus = statusElement.innerText === 'Pending' ? 'Paid' : 'Pending';
    
                try {
                    const updateResponse = await fetch(`/api/invoice/${invoiceId}/status`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status: newStatus })
                    });
    
                    if (!updateResponse.ok) throw new Error('Failed to update status');
                    
                    statusElement.innerText = newStatus;
                } catch (error) {
                    console.error("Error updating invoice status:", error);
                    alert("Failed to update status");
                }
            });
        });
        let formattedTotalPaid = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(sumOfPaid);
        let formattedTotalPending = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(sumOfInvoice);

        document.getElementById('sumOfPaid').innerText = formattedTotalPaid;
        document.getElementById('sumOfInvoice').innerText = formattedTotalPending;

        let generalTotal = sumOfInvoice + sumOfPaid;
        percentofpending = generalTotal > 0 ? (sumOfInvoice / generalTotal) * 100 : 0;
        percentofpaid = generalTotal > 0 ? (sumOfPaid / generalTotal) * 100 : 0;

        document.getElementById('fillspending').style.width = `${percentofpending}%`;
        document.getElementById('fillspaid').style.width = `${percentofpaid}%`;

        setTimeout(fillChart(), 1000);
        setTimeout(fillChart1(), 1000);
        setTimeout(fillBarChart(), 2000);

    } catch (error) {
        console.log("Error fetching invoices:", error);
        document.querySelector('#IMtable tbody').innerHTML = `<tr><td colspan="6">Failed to load invoices</td></tr>`;
    }
}

document.getElementById("generate-invoice").addEventListener("click", async function () {
    const buyerName = document.getElementById("buyer-name").value;
    const invoiceDate = document.getElementById("invoiceDate").value;
    const grandTotal = document.getElementById("grand-total").textContent.trim();
    const username = storeduser;  
    console.log(username);
    console.log(invoiceDate);
    console.log(buyerName);
    console.log(grandTotal);
    if (!username) {
        alert("Username is required!");
        return;
    }

    const invoiceData = {
        buyerName,
        invoiceDate,
        grandTotal,
        username
    };

    try {
        const response = await fetch("/api/storeinvoice", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(invoiceData),
        });

        const data = await response.json();

        if (response.ok) {
            alert("Invoice generated successfully!");
            console.log("Invoice Data:", data);
            loadInvoices();
            storeBuyer();
        } else {
            alert(data.message || "Error generating invoice");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Server error! Try again later.");
    }
});


window.onload = loadInvoices;
window.onload = loadBuyers;



async function storeBuyer() {
    const buyerName = document.getElementById("buyer-name").value.trim();
    const buyerEmail = document.getElementById("buyer-email").value.trim();
    const buyerContact = document.getElementById("buyer-contact").value.trim();
    const buyerAddress = document.getElementById("buyer-address").value.trim();

    if (!buyerName || !buyerEmail || !buyerContact || !buyerAddress) {
        alert("Please fill all fields");
        return;
    }

    try {
        const checkResponse = await fetch(`/api/buyer?email=${buyerEmail}`);
        const existingBuyer = await checkResponse.json();

        let buyerStatus = "Regular";
        let btotal = 1;

        if (existingBuyer.exists) {
            btotal = existingBuyer.btotal + 1;
            buyerStatus = btotal > 20 ? "VIP" : "Regular";
        }

        const response = await fetch("/api/storebuyer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ buyerName, buyerEmail, buyerContact, buyerAddress, buyerStatus, btotal })
        });

        const data = await response.json();
        console.log("Response:", data); 

        if (response.ok) {
            loadBuyers(); 
        } else {
            alert("Failed to store buyer: " + data.message);
        }
    } catch (error) {
        console.error("Error storing buyer:", error);
        alert("Error connecting to the server.");
    }
}


async function loadBuyers() {
    try {
        const response = await fetch("/api/buyers");
        const buyers = await response.json();
        const buyerTableBody = document.querySelector('#buyerTable tbody');
        buyerTableBody.innerHTML = "";

        buyers.forEach((buyer, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${buyer.buyerName}</td>
                <td>${buyer.buyerEmail}</td>
                <td>${buyer.buyerContact}</td>
                <td>${buyer.buyerAddress}</td>
                <td>${buyer.btotal}</td>
                <td>${buyer.buyerStatus}</td>
                
            `;
            buyerTableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error loading buyers:", error);
        document.querySelector('#buyerTable tbody').innerHTML = "<tr><td colspan='7'>Failed to load buyers</td></tr>";
    }
}