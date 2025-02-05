const fs = require("fs"); // Import the file system module to read and write files

// Function to read VCF file and parse contacts
function parseVcf(filePath) {
    try {
        const data = fs.readFileSync(filePath, "utf-8"); // Read the file synchronously
        const contacts = data
            .split("END:VCARD") // Split the data into individual contacts
            .map((contact) => contact.trim()) // Trim whitespace from each contact
            .filter(Boolean); // Remove empty entries
        return contacts;
    } catch (error) {
        console.error(`Error reading the VCF file: ${error.message}`);
        process.exit(1); // Exit the process with an error code if the file read fails
    }
}

// Function to merge contacts with duplicate phone numbers
function mergeContacts(contacts) {
    const mergedContacts = {}; // Object to store unique contacts
    let duplicateCount = 0; // Counter for duplicate phone numbers
    let skippedCount = 0; // Counter for contacts with no phone numbers

    contacts.forEach((contact) => {
        const lines = contact.split("\n"); // Split the contact data into lines
        let name = ""; // Variable to store the contact name
        let phoneNumbers = []; // Array to store phone numbers

        lines.forEach((line) => {
            if (line.startsWith("FN:")) {
                name = line.replace("FN:", "").trim(); // Extract full name
            }
            if (line.startsWith("TEL;CELL:")) {
                const phoneNumber = line.replace("TEL;CELL:", "").trim(); // Extract phone number
                phoneNumbers.push(phoneNumber);
            }
        });

        // Check if contact has any phone numbers
        if (phoneNumbers.length === 0) {
            console.warn(`Warning: Contact "${name}" has no phone numbers.`);
            skippedCount++; // Increment skipped count
            return; // Skip processing this contact
        }

        // Merge contacts based on phone numbers
        phoneNumbers.forEach((phone) => {
            if (!mergedContacts[phone]) {
                mergedContacts[phone] = { name: name, phones: [] }; // Store new contact
            } else {
                duplicateCount++; // Increment duplicate count if phone already exists
            }
            mergedContacts[phone].phones.push(phone); // Store phone number
        });
    });

    // Create VCF format for merged contacts
    const mergedData = Object.values(mergedContacts)
        .map((contact) => {
            return `BEGIN:VCARD\nVERSION:2.1\nFN:${contact.name}\n${
                contact.phones.map((phone) => `TEL;CELL:${phone}`).join("\n")
            }\nEND:VCARD`;
        })
        .join("\n");

    return {
        mergedData, // The formatted VCF data
        duplicateCount, // Number of duplicate contacts merged
        totalContacts: contacts.length, // Total number of contacts in the input file
        uniqueContactsCount: Object.keys(mergedContacts).length, // Unique contacts after merging
        skippedCount, // Number of contacts skipped due to no phone numbers
    };
}

// Function to write merged contacts to a new VCF file
function writeVcf(filePath, data) {
    try {
        fs.writeFileSync(filePath, data, "utf-8"); // Write the data synchronously
    } catch (error) {
        console.error(`Error writing the VCF file: ${error.message}`);
        process.exit(1); // Exit the process if writing fails
    }
}

// Main function to process the VCF file
function processVcf(inputFilePath, outputFilePath) {
    const contacts = parseVcf(inputFilePath); // Read and parse the VCF file
    const {
        mergedData,
        duplicateCount,
        totalContacts,
        uniqueContactsCount,
        skippedCount,
    } = mergeContacts(contacts);

    const mergedContactsCount = totalContacts - uniqueContactsCount; // Calculate the number of merged contacts

    if (mergedData) {
        writeVcf(outputFilePath, mergedData); // Write the merged contacts to a new file
        console.log("--------");
        console.log(
            `WARNING: ${skippedCount} contacts with no phone numbers will be skipped from the output file.`
        );
        console.log(`Merged VCF file created at: ${outputFilePath}`);
        console.log(`Total contacts in old file: ${totalContacts}`);
        console.log(`Duplicates in old file: ${duplicateCount}`);
        console.log(`Number of contacts merged: ${mergedContactsCount}`); // Log merged contacts
        console.log(`Total contacts in new file: ${uniqueContactsCount}`);
    } else {
        console.log("No contacts found to merge.");
    }
}

// Usage
const inputFilePath = "input.vcf"; // Replace with the actual input VCF file path
const outputFilePath = "output.vcf"; // Replace with the desired output VCF file path
processVcf(inputFilePath, outputFilePath); // Call the main function
