# 🧙‍♂️ Book of Sunshine

> **The Arcanist's Compendium.** A mobile-first, offline-capable Progressive Web App for D&D 5e players to search, filter, and curate their own spellbooks.

<img width="3168" height="1344" alt="Gemini_Generated_Image_hqjkqlhqjkqlhqjk" src="https://github.com/user-attachments/assets/6f4e3705-993f-49c8-a334-168a0da39ead" />

## ✨ Features

* 📚 **Interactive Spell Library**: Search and filter hundreds of 5e spells instantly by level, action type, and concentration requirements.
* ⚔️ **Session Mode & Spell Tracker**: Star your prepared spells for the day and manage your expended spell slots with an interactive, level-scaling tracker (Levels 1-20 full-caster progression).
* 📝 **Homebrew Ready**: Manually scribe custom spells or homebrew items into your grimoire using the intuitive Add form.
* 💾 **Offline First**: Built to work at the table. All data, custom spells, and active slots are saved strictly to your device's `localStorage` using Zustand persistence. No account required.
* 📤 **Export & Import**: Safely back up your spellbook metadata and custom spells to a local JSON file, or restore them across devices.
* 🖨️ **Print Your Deck**: Use the dedicated Print View (built with `@media print` CSS) to generate physical, stripped-down spell cards for your next in-person session.
* 🌙 **Low-Light Aesthetic**: High-contrast, dark-themed UI specifically tailored for dimly lit gaming rooms.

## 🛠️ Tech Stack

* **Framework:** [Next.js](https://nextjs.org/) (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **State Management:** Zustand (with persist middleware)
* **Icons:** Lucide-React

## 🚀 Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the compendium. 

### PWA Installation
To install the app on your mobile device, open the app in Safari (iOS) or Chrome (Android) and select **"Add to Home Screen"**. It functions completely offline once loaded!

## 📜 Data Source
By default, the application pulls spell definitions from `public/spells.json`. You can easily swap or expand this index with your own spells. Ensure your JSON adheres to the `allSpells` array structure utilized by the store normalizer. Level 0 spells are automatically parsed as cantrips.
