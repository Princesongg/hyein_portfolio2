const photoNumbers = Array.from({length:24},(_,index)=>index+1);
export const aboutPostcards = photoNumbers.map((photoNumber,index) => ({
 id:String(index+1).padStart(2,'0'),
 image:`/assets/about/postcards/optimized/postcard${photoNumber}.jpg`,
}));
