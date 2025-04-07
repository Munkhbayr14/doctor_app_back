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
    { file, saffron, alto, tenor, bass }: { file: Express.Multer.File, saffron: Express.Multer.File, alto: Express.Multer.File, tenor: Express.Multer.File, bass: Express.Multer.File }
  ) {
    console.log('Uploaded files:', { file, saffron, alto, tenor, bass });

    try {
      const musicAllData = {
        data: {
          title: createMusicDto.title,
          file: file.filename,
          saffron: saffron.filename,
          alto: alto.filename,
          tenor: tenor.filename,
          bass: bass.filename,
        },
      };

      // Generate URLs for the uploaded files
      const musicFileUrl = await getResourceUrl(musicAllData.data.file);
      const musicSaffronUrl = await getResourceUrl(musicAllData.data.saffron);
      const musicAltoUrl = await getResourceUrl(musicAllData.data.alto);
      const musicTenorUrl = await getResourceUrl(musicAllData.data.tenor);
      const musicBassUrl = await getResourceUrl(musicAllData.data.bass);

      console.log('Generated File URLs:', {
        musicFileUrl,
        musicSaffronUrl,
        musicAltoUrl,
        musicTenorUrl,
        musicBassUrl
      });

      musicAllData.data.file = musicFileUrl;
      musicAllData.data.saffron = musicSaffronUrl;
      musicAllData.data.alto = musicAltoUrl;
      musicAllData.data.tenor = musicTenorUrl;
      musicAllData.data.bass = musicBassUrl;

      // Save the music data in the database
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


  findAll() {
    return `This action returns all music`;
  }

  findOne(id: number) {
    return `This action returns a #${id} music`;
  }

  update(id: number, updateMusicDto: UpdateMusicDto) {
    return `This action updates a #${id} music`;
  }

  remove(id: number) {
    return `This action removes a #${id} music`;
  }
}
