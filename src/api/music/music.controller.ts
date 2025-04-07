import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, UploadedFile } from '@nestjs/common';
import { MusicService } from './music.service';
import { CreateMusicDto } from './dto/create-music.dto';
import { UpdateMusicDto } from './dto/update-music.dto';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FileTypesRegex, fileUploadOptions, imageUploadOptions, MP3UploadOptions } from 'config/FileUploadConfig';

@ApiTags('Music')
@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicService) { }
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        file: { type: 'string', format: 'binary' },
        saffron: { type: 'string', format: 'binary' },
        alto: { type: 'string', format: 'binary' },
        tenor: { type: 'string', format: 'binary' },
        bass: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', fileUploadOptions(FileTypesRegex.ALL, 'file')),
    FileInterceptor('saffron', MP3UploadOptions(FileTypesRegex.MP3, 'saffron')),
    FileInterceptor('alto', MP3UploadOptions(FileTypesRegex.MP3, 'alto')),
    FileInterceptor('tenor', MP3UploadOptions(FileTypesRegex.MP3, 'tenor')),
    FileInterceptor('bass', MP3UploadOptions(FileTypesRegex.MP3, 'bass'))
  )
  async create(
    @Body() createMusicDto: CreateMusicDto,
    @UploadedFile() file: Express.Multer.File,
    @UploadedFile() saffron: Express.Multer.File,
    @UploadedFile() alto: Express.Multer.File,
    @UploadedFile() tenor: Express.Multer.File,
    @UploadedFile() bass: Express.Multer.File
  ) {
    return this.musicService.createMusic(createMusicDto, { file, saffron, alto, tenor, bass });
  }
  @Get()
  findAll() {
    return this.musicService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.musicService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMusicDto: UpdateMusicDto) {
    return this.musicService.update(+id, updateMusicDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.musicService.remove(+id);
  }
}
