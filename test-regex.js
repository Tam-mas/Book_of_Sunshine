const fs = require('fs');
const spells = require('./public/spells.json');

function formatSpellText(text) {
    if (!text) return "";
    let formatted = text;

    // Fix inline headers
    formatted = formatted.replace(/([.!?])\s+([A-Z][a-zA-Z]*(?:\s+[a-zA-Z]+){0,3}):\s/g, (match, punc, header) => {
        return `${punc}\n\n**${header}:** `;
    });

    // Fix list items like "1-Red: " or "1. "
    formatted = formatted.replace(/([.!?])\s+(\d+(?:-[a-zA-Z]+)?:|\d+\.)\s/g, (match, punc, listPoint) => {
        return `${punc}\n\n**${listPoint}** `;
    });

    return formatted.trim();
}

const antimagic = spells.find(s => s.name === "Antimagic Field");
console.log("=== ANTIMAGIC FIELD ===");
console.log(formatSpellText(antimagic.description));

const prismatic = spells.find(s => s.name === "Prismatic Wall");
console.log("\n=== PRISMATIC WALL ===");
console.log(formatSpellText(prismatic.description));

const prismaticSpray = spells.find(s => s.name === "Prismatic Spray");
console.log("\n=== PRISMATIC SPRAY ===");
console.log(formatSpellText(prismaticSpray.description));
