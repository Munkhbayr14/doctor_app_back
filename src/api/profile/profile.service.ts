import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from '../prisma/prisma.service';
import getResourceUrl from 'libs/getResourceUrl';
import { ApiResponseStatusModel } from 'src/common/model/api-status.model';

@Injectable()
export class ProfileService {

  constructor(private prisma: PrismaService) { }

  create(createProfileDto: CreateProfileDto) {
    return 'This action adds a new profile';
  }

  async findAll() {
  }

  async profileData(id: number) {
    const profileData = await this.prisma.profile.findUnique({
      where: { userId: id },
    });
    if (!profileData) {
      throw new NotFoundException(`${id}-тай хэрэглэгчийн profile олдсонгүй`);
    }
    const updatedProfileData = {
      ...profileData,
      avatarUrl: profileData.avatarUrl != null && profileData.avatarUrl != ""
        ? `${process.env.RESOURCE_IMAGE_PREFIX}/${profileData.avatarUrl}`
        : "",
    };
    return {
      statusCode: 200,
      status: ApiResponseStatusModel.SUCCESS,
      result: updatedProfileData,
    };
  }

  async updateProfile(
    id: number,
    createProfileDto: CreateProfileDto,
    avatarUrl?: Express.Multer.File,
  ) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: id }
      });
      if (!user) {
        throw new NotFoundException(`${id}-тай хэрэглэгч олдсонгүй`);
      }

      const existProfile = await this.prisma.profile.findUnique({
        where: {
          userId: id
        }
      });
      if (!existProfile) {
        throw new NotFoundException(`${id}-тай хэрэглэгчийн proifle олдсонгүй`);
      }

      const profileData: any = {
        lastName: createProfileDto.lastname,
        firstName: createProfileDto.firstname,
        email: createProfileDto.email,
      };
      const UserData: any = {
        lastName: createProfileDto.lastname,
        firstName: createProfileDto.firstname,
        email: createProfileDto.email
      };
      if (avatarUrl) {
        const avatarData = await getResourceUrl(avatarUrl.filename);
        console.log('Generated Avatar URL:', avatarData);
        profileData.avatarUrl = avatarData;
      }
      const [updatedUser, updatedProfile] = await this.prisma.$transaction([
        this.prisma.user.update({
          where: { id },
          data: UserData,
        }),
        this.prisma.profile.update({
          where: { userId: id },
          data: profileData,
        }),
      ]);
      return {
        statusCode: 200,
        status: ApiResponseStatusModel.SUCCESS,
        message: "Таны мэдээлэл амжилттай солигдлоо",
        result: updatedProfile,
      };
    } catch (e) {
      console.log(e);
      return {
        statusCode: 500,
        status: ApiResponseStatusModel.FAILED,
        result: { message: 'Failed to update profile', error: e.message },
      };
    }
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }
}
