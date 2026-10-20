// Reorder or extend this selection ; all 24 source photos remain untouched.
const selectedPhotoNumbers = [6, 1, 2, 3, 4, 7, 9, 12, 15, 14, 18, 21, 19];
export const aboutPostcards = selectedPhotoNumbers.map(photoNumber => ({
 id:String(photoNumber).padStart(2,'0'),
 image:`/assets/about/postcards/optimized/postcard${photoNumber}.jpg`,
}));
