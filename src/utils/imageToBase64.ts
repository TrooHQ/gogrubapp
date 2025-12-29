// src/utils/imageToBase64.js
export const convertToBase64 = (file: Blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};



export   function normalizeGoogleDriveImageUrl(inputUrl: string): string {
    if (!inputUrl) return "";

    let fileId: string | null = null;

    try {
      // If it's a full URL
      if (inputUrl.includes("drive.google.com") || inputUrl.includes("google.com")) {
        const url = new URL(inputUrl);

        // Case 1: ?id=FILE_ID
        fileId = url.searchParams.get("id");

        // Case 2: /file/d/FILE_ID/view
        if (!fileId) {
          const match = url.pathname.match(/\/file\/d\/([^/]+)/);
          if (match) fileId = match[1];
        }
      } else {
        // Case 3: Just the ID string
        if (/^[a-zA-Z0-9_-]{20,}$/.test(inputUrl)) {
          fileId = inputUrl;
        }
      }
    } catch {
      if (/^[a-zA-Z0-9_-]{20,}$/.test(inputUrl)) {
        fileId = inputUrl;
      }
    }

    // Use the googleusercontent format for better compatibility with <img> tags
    return fileId ? `https://lh3.googleusercontent.com/d/${fileId}` : inputUrl;
  }
