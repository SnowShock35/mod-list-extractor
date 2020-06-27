import { slugify } from "https://deno.land/x/slugify/mod.ts";

// Change a few settings of slugify to match with how CF generates slugs.
slugify.extend({ "&": "", "-": "-", ".": "-" });

export function extractModListFromFile(file: string): Array<string> {
  // Turn string into array where each element is a an
  // individual mod and the mark-up surrounding it
  const modsMarkUpRaw = file.split("\r\n");

  // Return the filtered mod list
  return modsMarkUpRaw.filter((line) => {
    return (!line.includes("<ul>") && !line.includes("</ul>") && line != "");
  });
}

/**
 * Takes filtered mod list array and returns the mods' CF page URL
 * that actually work.
 * 
 * @param modList the contents of the `modlist.html` file.
 * @param sort whether or not to sort the mod list alphabetically.
 * 
 * @returns an array of mod urls.
 */
export function extractModUrlsFromModList(
  modList: Array<string>,
  sort: boolean,
): Array<string> {
  // Create the mod CurseForge URLs using the given mod list
  const modUrls = modList.map((mod) => {
    // A variable to store the mod name
    let modName;

    // Find the mod name within the HTML mark-up
    modName = mod.substring(
      mod.indexOf('">') + 2,
      mod.indexOf("(by"),
    );

    // Slugify the mod name
    modName = slugify(modName, { remove: /[^a-zA-Z\d\s\-]/, lower: true });

    // Remove trailing dashes
    modName = modName.replace(/\-+$/, "");

    // Fix mods which insist on changing their CF page slug.
    // Submit PR for missing entries.
    if (modName === "minetogether") modName = "creeperhost-minetogether";
    if (modName === "foamfix") modName = "foamfix-optimization-mod";
    if (modName === "bonsai-trees-2") modName = "bonsai-trees";

    // Return the full URL using the slug-ified mod name
    return "https://curseforge.com/minecraft/mc-mods/" + modName;
  });

  return sort ? modUrls.sort() : modUrls;
}

export function extractModNamesFromModList(
  modList: Array<string>,
  sort: boolean,
): Array<string> {
  // Extract the mod names using the given mod list
  const modNames = modList.map((mod) => {
    // Find the mod name within the HTML mark-up
    return mod.substring(
      mod.indexOf('">') + 2,
      mod.indexOf("(by"),
    );
  });

  return sort ? modNames.sort() : modNames;
}

export function extractModAuthorsFromModList(
  modList: Array<string>,
  sort: boolean,
): Array<string> {
  // Extract the mod authors using the given mod list
  const modAuthors = modList.map((mod) => {
    // Find the mod name within the HTML mark-up
    return mod.substring(
      mod.indexOf("(by"),
      mod.indexOf(")</a></li>") + 1,
    );
  });

  return sort ? modAuthors.sort() : modAuthors;
}
