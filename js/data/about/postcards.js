// Reorder or extend this selection (up to 12); all 24 source photos remain untouched.
const selectedPhotoNumbers = [1, 3, 5, 7, 9, 12, 15, 18, 21, 24];
export const aboutPostcards = selectedPhotoNumbers.slice(0, 12).map(photoNumber => ({
 id:String(photoNumber).padStart(2,'0'),
 image:`/assets/about/postcards/optimized/postcard${photoNumber}.jpg`,
}));
