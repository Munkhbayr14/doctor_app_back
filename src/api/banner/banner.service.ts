import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ApiResponseStatusModel } from 'src/common/model/api-status.model';

@Injectable()
export class BannerService {
  constructor(private prisma: PrismaService,) { }

  // async bannerCreate(createBannerDto: CreateBannerDto) {

  //   if (!createBannerDto) {
  //     throw new BadRequestException('Мэдээлэл хоосон байна');
  //   }
  //   try {
  //     const banner = await this.prisma.banner.create({
  //       data: createBannerDto,
  //     });
  //     return {
  //       message: 'Амжилттай',
  //       statusCode: 200,
  //       data: banner,
  //     };
  //   } catch (error) {
  //     throw new BadRequestException('Баннер үүсгэхэд алдаа гарлаа');
  //   }
  // }

  async bannerCreate(
    createBannerDto: CreateBannerDto,
    img?: Express.Multer.File,
  ) {
    if (!createBannerDto) {
      throw new BadRequestException('Мэдээлэл хоосон байна');
    }
    const bannerData = {
      data: {
        title: createBannerDto.title,
        description: createBannerDto.description,
        image: img ? img.filename : null,
      },
    };
    try {
      const bannerInfo = await this.prisma.banner.create(bannerData);
      return {
        statusCode: 201,
        status: ApiResponseStatusModel.SUCCESS,
        result: bannerInfo,
      };
    } catch (e) {
      console.error('Failed to create card:', e);
      return {
        statusCode: 500,
        status: ApiResponseStatusModel.FAILED,
        result: { message: 'Failed to create card', error: e.message },
      };
    }
    console.log(createBannerDto, img.fieldname)
  }

  async bannerAll() {
    const bannerAll = await this.prisma.banner.findMany();
    return {
      message: 'Амжилттай',
      statusCode: 200,
      result: bannerAll
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} banner`;
  }

  update(id: number, updateBannerDto: UpdateBannerDto) {
    return `This action updates a #${id} banner`;
  }

  remove(id: number) {
    return `This action removes a #${id} banner`;
  }
}
