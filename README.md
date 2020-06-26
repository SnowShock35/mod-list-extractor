# Mod List Extractor

A simple Deno module that provides a list of helper functions to extract information from a modlist.html file generated for Minecraft instance exports in the Twitch Desktop App.

---

## Description

This simple [Deno](https://deno.land) module provides helper functions to help work around a known issue in the Twitch Desktop App. As I use the platform to distribute my modpacks and like to provide users with a mod list in a particular format, I built this tool to fix these issues.

## Usage

This module by itself doesn't do a lot. However, you can import it and write a small script to generate a mod list. In the example below, I read the data from the `modlist.html` file, extract the information I need using the helper functions and create a list in Markdown syntax then write it to a file called `modlist.md`.

```typescript
import { readFileStr, writeFileStr } from "https://deno.land/std/fs/mod.ts";
import * from "https://raw.githubusercontent.com/snowshock35/mod-list-extractor/default/mod.ts"

// Read the file from disk
const file = await readFileStr("./modlist.html", { encoding: "utf8" });

// Get the mod list
const modList = extractModListFromFile(file);

// Get mod urls
const modUrls = extractModUrlsFromModList(modList, false);

// Get mod names
const modNames = extractModNamesFromModList(modList, false);

// Get mod authors
const modAuthors = extractModAuthorsFromModList(modList, false);

// Create an empty array to store the mod list (in markdown format)
let markdownModList = [];

// Loop through the list and create each mark down list item for each mod with
// its respective name, author and URL
for (let i = 0; i < modList.length; i++) {
  markdownModList.push(`- [${modNames[i]}${modAuthors[i]}](${modUrls[i]})`);
}

// Write to a file the newly created mod list after sorting it and
// putting each item on its own line.
writeFileStr("modlist.md", markdownModList.sort().join("\n"));
```

To run this script you can use the cli command:

`deno run --allow-read=. --allow-write=. --unstable modlist.ts`
