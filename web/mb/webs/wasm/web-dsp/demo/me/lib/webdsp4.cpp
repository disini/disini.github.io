#include <math.h>
#include <stdlib.h>
#include <stdio.h>
#include <iostream>


extern "C" {
	int getPixel(int x, int y, int* arr, int width, int height) {// get the grayScale value for a specific pixel by giving x and y
		if (x < 0 || y < 0) 
			return 0;
		if (x >= (width) || y >= (height)) 
			return 0;
		return arr[(width * y) + x];
	}


	void sobelFilter(unsigned char* data, int width, int height, bool invert)
	{

		int grayData[width * height];
		for (int y = 0; y < height; y++)
		{
			for (int x = 0; x < width; x++)
			{
				int dOffset = (width * y) + x;
				int gOffset = dOffset << 2; // multiply by 4 (RGBA)
				int r = data[gOffset];
				int g = data[gOffset + 1];
				int b = data[gOffset + 2];

				int avg = (r >> 2) + (g >> 1) + (b >> 3);// change the pixel into gray (r * 0.25 + g * 0.5 + b * 0.125);
				grayData[(width * y) + x] = avg;

                data[gOffset] = avg;
                data[gOffset + 1] = avg;
                data[gOffset + 2] = avg;
                data[gOffset + 3] = 255;


			}
		}

		for (int y = 0; y < height; y++)
		{
			for (int x = 0; x < width; x++)
			{
				int newX;
				int newY;
				int myOffset = ((width * y) + x) << 2; // multiply by 4 (RGBA)
				if ((x <= 0 || x >= width - 1) || (y <= 0 || y >= height - 1))
				{
					newX = 0;
					newY = 0;
				}
				else
				{
					newX =
						-1 * getPixel(x - 1, y - 1, grayData, width, height) + // top left
						getPixel(x + 1, y - 1, grayData, width, height) + // top right
						-1 * ((getPixel(x - 1, y, grayData, width, height) << 1)) + // middle left
						(getPixel(x + 1, y, grayData, width, height) << 1) + // middle right
						-1 * getPixel(x - 1, y + 1, grayData, width, height) + // bottom left
						getPixel(x + 1, y + 1, grayData, width, height); // bottom right


					newY =
						-1 * getPixel(x - 1, y - 1, grayData, width, height) + // top left
						-1 * (getPixel(x, y - 1, grayData, width, height) << 1) + // top middle
						-1 * getPixel(x + 1, y - 1, grayData, width, height) + // top right
						getPixel(x - 1, y + 1, grayData, width, height) + // bottom left
						(getPixel(x, y + 1, grayData, width, height) << 1) + // bottom middle
						getPixel(x + 1, y + 1, grayData, width, height); // bottom right

				}

				int mag = sqrt(newX * newX + newY * newY);// the gray magnitude, i.e. gradient in both x and y axis
				if (mag > 255)
					mag = 255;
				
				if (invert == true)
					mag = 255 - mag;
				data[myOffset] = mag;
				data[myOffset + 1] = mag;
				data[myOffset + 2] = mag;
				data[myOffset + 3] = 255;// Alpha is set to be 255 uniformly


			}
		}

	}


}