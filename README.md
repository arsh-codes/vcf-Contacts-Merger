# VCF Contact Merger
This Node.js program reads a VCF (vCard) file containing contact information, merges contacts with duplicate phone numbers, and outputs a new VCF file with unique contacts. It also provides warnings for contacts that do not have any phone numbers. While Google Contacts already performs merging and fixing of duplicate contacts, it primarily operates on contact names rather than contact numbers.

## Features
-   Reads a VCF file and parses the contacts.
-   Merges contacts that share the same phone number.
-   Skips contacts without phone numbers and logs a warning.
-   Outputs a new VCF file with unique contacts.
-   Provides statistics about the merging process, including the number of duplicates and skipped contacts.

## VCF Format Requirements

The program expects the input VCF file to follow the vCard 2.1 format. Here are the key requirements:

-   Each contact must start with `BEGIN:VCARD` and end with `END:VCARD`.
-   Each contact must include a `FN:` line for the full name.
-   Phone numbers must be specified with the `TEL;CELL:` prefix.
-   Each contact should be separated by a newline.

### Example VCF Format

BEGIN:VCARD
VERSION:2.1
FN:John Doe
TEL;CELL:+1234567890
TEL;CELL:+0987654321
END:VCARD

## Instructions

1. **Prepare Your Input VCF File**: Rename your vcf file to `contacts.vcf` (if not already the same name) and place it in the project directory. Ensure it follows the format requirements mentioned above.

2. **Run the Program**: Execute the script using Node.js:
   ```bash
   node script.js
Check the Output: After running the program, a new VCF file named output.vcf will be created in the project directory. This file will contain the merged contacts.

## Output Information

Upon successful execution, the program will log the following information to the console:

- **Number of contacts with no phone numbers that were skipped.**
- **The path to the newly created VCF file.**
- **Total contacts in the old file.**
- **Number of duplicates found in the old file.**
- **Number of contacts merged.**
- **Total contacts in the new file.**
