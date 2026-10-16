
export default function initDotTransition(ref) {
    const canvas = ref;
    const paint = () => {
      const width = Math.round(canvas.getBoundingClientRect().width);
      const height = Math.round(canvas.getBoundingClientRect().height);
      if (!width || !height) return;
      const ratio = Math.min(
        Math.max(window.devicePixelRatio || 1, 1) * 1.2,
        2.4,
      );
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      const ctx = canvas.getContext("2d");
      const pixels = ctx.createImageData(canvas.width, canvas.height);
      let seed = 476;
      const random = () => {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        return seed / 4294967296;
      };
      const blue = [177, 188, 204];
      const ivory = [238, 227, 225];
      // Subpixel grain avoids the large, overlapping circles of the first pass.
      for (let y = 0; y < canvas.height; y++) {
        const progress = y / Math.max(1, canvas.height - 1);
        const eased = progress * progress * (3 - 2 * progress);
        const density = 1 - eased;
        for (let x = 0; x < canvas.width; x++) {
          const droplet = random() < density ? 1 : 0;
          const blend = density * 0.36 + droplet * 0.64;
          const offset = (y * canvas.width + x) * 4;
          for (let channel = 0; channel < 3; channel++) {
            pixels.data[offset + channel] =
              ivory[channel] + (blue[channel] - ivory[channel]) * blend;
          }
          pixels.data[offset + 3] = 255;
        }
      }
      ctx.putImageData(pixels, 0, 0);
    };
    const observer = new ResizeObserver(paint);
    observer.observe(canvas);
    return () => observer.disconnect();
}
