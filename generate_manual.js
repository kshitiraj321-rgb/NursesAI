const { mdToPdf } = require('md-to-pdf');
const fs = require('fs');
const path = require('path');

const sections = [
    { title: "System Architecture", file: "manual_docs/architecture.md" },
    { title: "Implementation Plan", file: "manual_docs/implementation_plan.md" },
    { title: "Data Flow & Logic", file: "manual_docs/flow.md" },
    { title: "API Specifications", file: "manual_docs/api_map.md" },
    { title: "File Summaries", file: "manual_docs/file_summaries.md" }
];

async function generateManual() {
    console.log("Starting PDF generation...");
    let combinedMarkdown = "# Full Application Technical Manual\n\n";

    for (const section of sections) {
        const filePath = path.join(__dirname, section.file);
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf-8');
            // Adding a manual page break syntax recognized by PDF generators
            combinedMarkdown += `\n<div style="page-break-before: always;"></div>\n\n`;
            combinedMarkdown += content + "\n\n";
            console.log(`Added: ${section.title}`);
        } else {
            console.log(`Warning: ${section.file} not found. Skipping ${section.title}.`);
        }
    }

    try {
        await mdToPdf(
            { content: combinedMarkdown }, 
            { 
                dest: 'Complete_App_Manual.pdf',
                pdf_options: { format: 'A4', margin: '20mm' }
            }
        );
        console.log("\nSuccess! Your A-Z manual is ready: Complete_App_Manual.pdf");
    } catch (err) {
        console.error("Error generating PDF:", err);
    }
}

generateManual();
