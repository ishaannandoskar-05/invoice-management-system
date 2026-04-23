const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

const mongoURI = process.env.MONGO_URI || 'mongodb+srv://user:user123@ishaan.uxm7o.mongodb.net/?appName=ishaan';

mongoose.connect(mongoURI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    contactNo: { type: String, required: true },
    address: { type: String, required: true },
    password: { type: String, required: true }
});
const invoiceSchema = new mongoose.Schema({
    buyerName: { type: String, required: true },
    invoiceDate: { type: Date, required: true },  
    grandTotal: { type: Number, required: true }, 
    status: { type: String, default: 'Pending' },
    invoiceId: { type: Number, unique: true, required: true },
    user: { type: String, required: true }
});

const buyerSchema = new mongoose.Schema({
    buyerName: { type: String, required: true },
    buyerEmail: { type: String, required: true, unique: true },
    buyerContact: { type: Number, required: true },
    buyerAddress: { type: String, required: true },
    buyerStatus: { type: String, required: true, default: "Regular" },
    btotal: { type: Number, required: true, default: 1 }
});

const Buyer = mongoose.model('Buyer', buyerSchema);

app.post('/api/storebuyer', async (req, res) => {
    try {
        const { buyerName, buyerEmail, buyerContact, buyerAddress, buyerStatus, btotal } = req.body;

        if (!buyerName || !buyerEmail || !buyerContact || !buyerAddress) {
            return res.status(400).json({ message: "All fields are required" });
        }

        let existingBuyer = await Buyer.findOne({ buyerEmail });

        if (existingBuyer) {
            existingBuyer.btotal += 1;
            existingBuyer.buyerStatus = existingBuyer.btotal > 20 ? "VIP" : "Regular";
            await existingBuyer.save();
            return res.status(200).json({ message: "Buyer updated successfully!", buyer: existingBuyer });
        }

        const newBuyer = new Buyer({
            buyerName,
            buyerEmail,
            buyerContact,
            buyerAddress,
            buyerStatus: "Regular",
            btotal: 1
        });

        await newBuyer.save();
        res.status(201).json({ message: "Buyer information stored successfully!", buyer: newBuyer });

    } catch (error) {
        console.error("Error storing buyer information:", error);
        res.status(500).json({ message: "Error storing buyer information." });
    }
});


app.get('/api/buyers', async (req, res) => {
    try {
        const buyers = await Buyer.find();
        res.status(200).json(buyers);
    } catch (error) {
        console.error("Error fetching buyers:", error);
        res.status(500).json({ message: "Error retrieving buyers." });
    }
});

app.get('/api/buyer', async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({ message: "Please provide an email." });
        }

        const buyer = await Buyer.findOne({ buyerEmail: email });

        if (buyer) {
            return res.status(200).json({ exists: true, btotal: buyer.btotal });
        } else {
            return res.status(200).json({ exists: false });
        }
    } catch (error) {
        console.error("Error fetching buyer:", error);
        res.status(500).json({ message: "Error retrieving buyer." });
    }
});

userSchema.pre('save', async function (next) {
    this.username = this.username.toLowerCase().trim();
    if (this.isModified('password')) {
        try {
            const hashedPassword = await bcrypt.hash(this.password, 10);
            this.password = hashedPassword;
        } catch (err) {
            return next(err);
        }
    }
    next();
});

const User = mongoose.model('User', userSchema);

app.post('/api/signup', async (req, res) => {
    const { username, email, contactNo, address, password, confirmPassword } = req.body;

    if (!username || !email || !contactNo || !address || !password || !confirmPassword) {
        return res.status(400).send("Please provide all required fields.");
    }

    if (password !== confirmPassword) {
        return res.status(400).send("Passwords do not match.");
    }

    try {
        const normalizedUsername = username.toLowerCase().trim();
        const existingUser = await User.findOne({ username: new RegExp('^' + normalizedUsername + '$', 'i') });

        if (existingUser) {
            return res.status(400).send("Username already exists.");
        }

        const newUser = new User({ username: normalizedUsername, email, contactNo, address, password });
        await newUser.save();

        res.status(201).send("User registered successfully!");
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).send("Error registering user: " + error.message);
    }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send("Please provide both username and password.");
    }

    try {
        const normalizedUsername = username.toLowerCase().trim();
        const user = await User.findOne({ username: normalizedUsername });

        if (!user) {
            return res.status(400).send("User not found. Please register first.");
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(400).send("Incorrect password.");
        }

        res.status(200).send("Login successful!");
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send("Error logging in.");
    }
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

app.post("/api/storeinvoice", async (req, res) => {
    try {
        const { buyerName, invoiceDate, grandTotal, username } = req.body;

        if (!username || username.trim() === "") {  
            return res.status(400).json({ message: "Username is required and cannot be empty." });
        }

        let invoiceId;
        let isUnique = false;
        while (!isUnique) {
            invoiceId = Math.floor(100000 + Math.random() * 900000);
            isUnique = !(await Invoice.exists({ invoiceId }));
        }

        const newInvoice = new Invoice({
            buyerName,
            invoiceDate,
            grandTotal,
            invoiceId,
            user: username.trim() 
        });

        await newInvoice.save();
        res.status(201).json(newInvoice);
    } catch (error) {
        console.error("Error generating invoice:", error);
        res.status(500).json({ message: "Error generating invoice" });
    }
});

app.get('/api/invoices/:user', async (req, res) => {
    try {
        const username = req.params.user.toLowerCase().trim();
        const invoices = await Invoice.find({ user: username });

        if (invoices.length === 0) {
            return res.status(404).json({ message: "No invoices found for this user." });
        }

        res.status(200).json(invoices);
    } catch (error) {
        console.error("Error fetching invoices:", error);
        res.status(500).json({ message: "Error retrieving invoices" });
    }
});

app.get('/api/user/:username', async (req, res) => {
    try {
        const username = req.params.username.toLowerCase().trim();
        const user = await User.findOne({ username }).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json(user);
    } catch (error) {
        console.log("Error fetching user details:", error);
        res.status(500).json({ message: "Error retrieving user data." });
    }
});

app.put('/api/invoice/:invoiceId/status', async (req, res) => {
    try {
        const { invoiceId } = req.params;
        const { status } = req.body;

        if (!["Pending", "Paid"].includes(status)) {
            return res.status(400).json({ message: "Invalid status value." });
        }

        const updatedInvoice = await Invoice.findOneAndUpdate(
            { invoiceId: Number(invoiceId) },
            { status },
            { new: true }
        );

        if (!updatedInvoice) {
            return res.status(404).json({ message: "Invoice not found." });
        }

        res.status(200).json({ message: "Invoice status updated successfully!", invoice: updatedInvoice });
    } catch (error) {
        console.error("Error updating invoice status:", error);
        res.status(500).json({ message: "Error updating invoice status." });
    }
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
