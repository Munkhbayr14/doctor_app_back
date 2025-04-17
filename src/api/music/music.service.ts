import { Injectable } from '@nestjs/common';
import { CreateMusicDto } from './dto/create-music.dto';
import { UpdateMusicDto } from './dto/update-music.dto';
import { PrismaService } from '../prisma/prisma.service';
import getResourceUrl from 'libs/getResourceUrl';
import { ApiResponseStatusModel } from 'src/common/model/api-status.model';

@Injectable()
export class MusicService {
  constructor(private prisma: PrismaService) { }

  async createMusic(
    createMusicDto: CreateMusicDto,
    {
      file,
      saffron,
      alto,
      tenor,
      bass
    }:
      {
        file: Express.Multer.File,
        saffron: Express.Multer.File,
        alto: Express.Multer.File,
        tenor: Express.Multer.File,
        bass: Express.Multer.File
      }
  ) {
    try {
      const musicAllData = {
        data: {
          musicUrl: createMusicDto.musicUrl,
          title: createMusicDto.title,
          file: file ? file.filename : null,
          saffron: saffron ? saffron.filename : null,
          alto: alto ? alto.filename : null,
          tenor: tenor ? tenor.filename : null,
          bass: bass ? bass.filename : null,
        },
      };
      const musicFileUrl = await getResourceUrl(musicAllData.data.file) ?? null;
      const musicSaffronUrl = await getResourceUrl(musicAllData.data.saffron) ?? null;
      const musicAltoUrl = await getResourceUrl(musicAllData.data.alto) ?? null;
      const musicTenorUrl = await getResourceUrl(musicAllData.data.tenor) ?? null;
      const musicBassUrl = await getResourceUrl(musicAllData.data.bass) ?? null;
      console.log('Generated File URLs:', {
        musicFileUrl,
        musicSaffronUrl,
        musicAltoUrl,
        musicTenorUrl,
        musicBassUrl
      });
      musicAllData.data.file = musicFileUrl ?? null;
      musicAllData.data.saffron = musicSaffronUrl ?? null;
      musicAllData.data.alto = musicAltoUrl ?? null;
      musicAllData.data.tenor = musicTenorUrl ?? null;
      musicAllData.data.bass = musicBassUrl ?? null;
      const musicData = await this.prisma.music.create(musicAllData);
      return {
        statusCode: 201,
        status: 'success',
        result: musicData,
      };
    } catch (e) {
      console.error('Failed to create music:', e);
      return {
        statusCode: 500,
        status: 'failed',
        result: { message: 'Failed to create music', error: e.message },
      };
    }
  }

  async musicAll() {
    const folderUrl = "file"
    try {
      const fetchMusic = await this.prisma.music.findMany()
      const mappedMusic = fetchMusic.map((music) => ({
        ...music,
        file: music.file != null && music.file != "" ? `${process.env.RESOURCE_IMAGE_PREFIX}/${folderUrl}/${music.file}` : null,
        saffron: music.saffron != null && music.saffron != "" ? `${process.env.RESOURCE_IMAGE_PREFIX}/${folderUrl}/${music.saffron}` : null,
        alto: music.alto != null && music.alto != "" ? `${process.env.RESOURCE_IMAGE_PREFIX}/${folderUrl}/${music.alto}` : null,
        tenor: music.tenor != null && music.tenor != "" ? `${process.env.RESOURCE_IMAGE_PREFIX}/${folderUrl}/${music.tenor}` : null,
        bass: music.bass != null && music.bass != "" ? `${process.env.RESOURCE_IMAGE_PREFIX}/${folderUrl}/${music.bass}` : null,
      }));
      return {
        statusCode: 200,
        status: ApiResponseStatusModel.SUCCESS,
        result: mappedMusic,
      };
    } catch (e) {
      return {
        statusCode: 500,
        status: ApiResponseStatusModel.FAILED,
        result: { message: 'Failed to retrieve banners', error: e.message },
      };
    }
  }

  async findOne(id: number) {
    try {
      const fetchMusic = await this.prisma.music.findUnique({
        where: { id },
      });

      if (!fetchMusic) {
        return {
          statusCode: 404,
          status: ApiResponseStatusModel.FAILED,
          result: { message: 'Music not found' },
        };
      }

      const base = process.env.RESOURCE_IMAGE_PREFIX;
      const folderUrl = "file"
      const audio = [];

      if (fetchMusic.saffron) audio.push({ voice: 'saffron', url: `${base}/${folderUrl}/${fetchMusic.saffron}` });
      if (fetchMusic.alto) audio.push({ voice: 'alto', url: `${base}/${folderUrl}/${fetchMusic.alto}` });
      if (fetchMusic.tenor) audio.push({ voice: 'tenor', url: `${base}/${folderUrl}/${fetchMusic.tenor}` });
      if (fetchMusic.bass) audio.push({ voice: 'bass', url: `${base}/${folderUrl}/${fetchMusic.bass}` });

      const mappedMusic = {
        ...fetchMusic,
        file: fetchMusic.file ? `${base}/${folderUrl}/${fetchMusic.file}` : null,
        audio,
      };

      return {
        statusCode: 200,
        status: ApiResponseStatusModel.SUCCESS,
        result: mappedMusic,
      };
    } catch (e) {
      return {
        statusCode: 500,
        status: ApiResponseStatusModel.FAILED,
        result: { message: 'Failed to retrieve music', error: e.message },
      };
    }
  }


  update(id: number, updateMusicDto: UpdateMusicDto) {
    return `This action updates a #${id} music`;
  }

  remove(id: number) {
    return `This action removes a #${id} music`;
  }
}
