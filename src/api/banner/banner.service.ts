import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ApiResponseStatusModel } from 'src/common/model/api-status.model';

import getResourceUrl from 'libs/getResourceUrl';


@Injectable()
export class BannerService {
  constructor(private prisma: PrismaService,) { }

  async bannerCreate(
    createBannerDto: CreateBannerDto,
    image?: Express.Multer.File,
  ) {
    if (!createBannerDto) {
      throw new BadRequestException('Мэдээлэл хоосон байна');
    }
    try {
      const bannerData = {
        data: {
          title: createBannerDto.title,
          description: createBannerDto.description,
          image: image.filename,
        }
      };
      const bannerUrl = await getResourceUrl(bannerData.data.image);
      console.log('Generated Banner URL:', bannerUrl);
      bannerData.data.image = bannerUrl
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
  }

  async bannerAll() {
    try {
      const bannerAll = await this.prisma.banner.findMany();
      bannerAll.map((banner) => {
        banner.image = `${process.env.RESOURCE_IMAGE_PREFIX}/banner-image/${banner.image}`
      })
      return {
        statusCode: 200,
        status: ApiResponseStatusModel.SUCCESS,
        result: bannerAll,
      };
    } catch (error) {
      return {
        statusCode: 500,
        status: ApiResponseStatusModel.FAILED,
        result: { message: 'Failed to retrieve banners', error: error.message },
      };
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
