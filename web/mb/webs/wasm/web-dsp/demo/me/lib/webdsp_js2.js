function js_sobelFilter(data, width, height, invert=false) {
  var grayData = new Int32Array(width * height);

        function getPixel(x, y) {
            if (x < 0 || y < 0)
                return 0;
            if (x >= width || y >= height)
                return 0;
            return (grayData[(width * y) + x]);
        }
        //Grayscale
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                var dOffset = (width * y) + x;
                var gOffset = dOffset << 2; //multiply by 4
                var r = data[gOffset];
                var g = data[gOffset + 1];
                var b = data[gOffset + 2];
                var avg = (r >> 2) + (g >> 1) + (b >> 3);
                grayData[(width * y) + x] = avg;
                data[gOffset] = avg;
                data[gOffset + 1] = avg;
                data[gOffset + 2] = avg;
                data[gOffset + 3] = 255;
            }
        }
        //Sobel
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {

                var newX;
                var newY;
           var myOffset = ((width * y) + x) << 2;
				if ((x <= 0 || x >= width - 1) || (y <= 0 || y >= height - 1))
				{
                    newX = 0;
                    newY = 0;
                }
		 else 
		 {
                    //sobel Filter use surrounding pixels and matrix multiply by sobel       
                    newX = -1 * getPixel(x - 1, y - 1) +
                        getPixel(x + 1, y - 1) +
                        -1 * (getPixel(x - 1, y) << 1) +
                        (getPixel(x + 1, y) << 1) +
                        -1 * getPixel(x - 1, y + 1) +
                        getPixel(x + 1, y + 1);

                    newY = -1 * getPixel(x - 1, y - 1) +
                        -1 * (getPixel(x, y - 1) << 1) +
                        -1 * getPixel(x + 1, y - 1) +
                        getPixel(x - 1, y + 1) +
                        (getPixel(x, y + 1) << 1) +
                        getPixel(x + 1, y + 1);

               var mag = Math.floor(Math.sqrt(newX * newX + newY * newY) >>> 0);
                    if (mag > 255)
                        mag = 255;
                    if (invert)
                        mag = 255 - mag;
               data[myOffset] = mag;
               data[myOffset + 1] = mag;
               data[myOffset + 2] = mag;
               data[myOffset + 3] = 255;
                }
            }
        }
    return data; //sobelData;
}
