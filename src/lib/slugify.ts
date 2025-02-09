// utils/slugify.ts
export const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/ /g, '-')        // Replace spaces with dashes
      .replace(/[^\w-]+/g, '');  // Remove all non-word chars
  };
  