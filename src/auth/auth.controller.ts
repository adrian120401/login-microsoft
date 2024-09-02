import { Controller, Get, Inject, Req, Res, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtCookieAuthGuard } from 'src/guards/jwt.guard';
import { MicrosoftOauthGuard } from 'src/guards/microsoft.guard';
import { User } from 'src/user/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('USER_REPOSITORY') private userRepository: typeof User,
    private jwtService: JwtService,
  ) {}

  @Get('me')
  @UseGuards(JwtCookieAuthGuard)
  async me(@Req() req) {
    const { id } = req.user;
    const user = await this.userRepository.findByPk(id);
    return user;
  }

  @Get('microsoft')
  @UseGuards(MicrosoftOauthGuard)
  async microsoftLogin() {}

  @Get('microsoft/callback')
  @UseGuards(MicrosoftOauthGuard)
  async microsoftLoginCallback(@Req() req, @Res() res) {
    const { email, name } = req.user;

    let user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      user = await this.userRepository.create({
        email,
        name,
      });
    }

    const accessToken = this.generateToken({ id: user.id, email: user.email });

    res.cookie('accessToken', accessToken, {
      maxAge: 3600000,
      sameSite: true,
      secure: false,
      path: '/',
    });

    res.redirect('/');
  }

  generateToken(payload: any) {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1h',
    });
  }
}
