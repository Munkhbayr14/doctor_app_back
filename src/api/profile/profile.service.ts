import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from '../prisma/prisma.service';
import getResourceUrl from 'libs/getResourceUrl';
import { ApiResponseStatusModel } from 'src/common/model/api-status.model';

@Injectable()
export class ProfileService {

  constructor(private prisma: PrismaService) {

  }

  create(createProfileDto: CreateProfileDto) {
    return 'This action adds a new profile';
  }

  findAll() {
    return `This action returns all profile`;
  }

  findOne(id: number) {
    return `This action returns a #${id} profile`;
  }

  async updateProfile(
    id: number,
    lastName?: string,
    firstName?: string,
    email?: string,
    avatarUrl?: Express.Multer.File,
  ) {
    try {
      // Find the user by ID
      const user = await this.prisma.user.findUnique({
        where: { id: id }
      });

      if (!user) {
        throw new NotFoundException(`${id}-тай хэрэглэгч олдсонгүй`);
      }

      // Prepare the data to update
      const profileData: any = {
        lastName: lastName,
        firstName: firstName,
        email: email,
      };

      // If an avatar is provided, update the avatar URL
      if (avatarUrl) {
        const avatarData = await getResourceUrl(avatarUrl.filename);
        console.log('Generated Avatar URL:', avatarData);
        profileData.avatarUrl = avatarData;
      }

      // Update the profile
      const updatedProfile = await this.prisma.profile.update({
        where: { userId: id },
        data: profileData,
      });

      return {
        statusCode: 201,
        status: ApiResponseStatusModel.SUCCESS,
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
  }-

    remove(id: number) {
  return `This action removes a #${id} profile`;
}
}
