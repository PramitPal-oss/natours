import { IsArray, IsNotEmpty, IsOptional, Matches } from 'class-validator';

class ImageDTO {
  @IsNotEmpty()
  @Matches(/\.(jpg|jpeg|png|gif)$/i, { message: 'Image Cover must be an image string' })
  imageCover!: string;

  @IsOptional()
  @IsArray()
  @Matches(/\.(jpg|jpeg|png|gif)$/i, { each: true, message: 'Images must be image strings' })
  images?: string[] | null;
}

export default ImageDTO;
