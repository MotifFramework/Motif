import "picturefill";
import "lazysizes";
import dynamicResponsiveImages from './motif.dynamic-responsive-images';

export default function () {
  initDynamicResponsiveImages();
}

export function initDynamicResponsiveImages (startingPoint = document, IMAGE_CLASS = 'js-dynamic-image', multiple = 1) {
  const dynamicImages = startingPoint.querySelectorAll(`.${IMAGE_CLASS}`);

  if (dynamicImages.length) {
    dynamicResponsiveImages(IMAGE_CLASS, multiple);
  }
}
