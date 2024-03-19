import {
  MEMBER_SERVICE_NAME,
  MemberServiceClient,
  SignInRequest,
  SignInResponse, SignUpRequest, SignUpResponse,
  AccountRoles, ValidateResponse, GetUserRequest, GetUserResponse,
  LeaveMemberRequest, LeaveMemberResponse, CheckEmailDuplicationResponse, CheckNicknameDuplicationResponse,
  VerifyEmailResponse, UpdatePasswordRequest, UpdateEmailReceiveResponse, FindEmailRequest, FindEmailResponse, FindPasswordRequest, FindPasswordResponse,
  ResetPasswordRequest, ResetPasswordResponse, UpdateNicknameRequest, UpdateNicknameResponse,
  UpdatePushReceiveRequest, UpdatePushReceiveResponse, UpdateEmailReceiveRequest, UpdatePasswordResponse
} from '@4dist/sdk';
import { Body, Controller, Inject, Post, Get, Param, Query, Delete, Patch, Req, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

import { ApiTags, ApiParam, ApiOperation, ApiBody, ApiQuery, ApiBearerAuth, ApiCreatedResponse, ApiConsumes } from '@nestjs/swagger';

@ApiTags('Account')
@Controller('account')
export class AccountController implements OnModuleInit {
  @Inject(MEMBER_SERVICE_NAME)
  private readonly client: ClientGrpc;
  private service: MemberServiceClient;

  public onModuleInit(): void {
    this.service = this.client.getService<MemberServiceClient>(MEMBER_SERVICE_NAME);
  }

  @Post('signup')
  @ApiOperation({ summary: '회원가입', description: '회원가입' })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          description: '사용자 계정 (이메일주소)',
        },
        name: {
          type: 'string',
          description: '이름',
        },
        nickname: {
          type: 'string',
          description: '닉네임',
        },
        password: {
          type: 'string',
          description: '비밀번호',
        },
        pushreceive: {
          type: 'boolean',
          description: '푸시알림 수신여부',
          default: true,
        },
        emailreceive: {
          type: 'boolean',
          description: '이메일 수신여부',
          default: true,
        },
        usertype: {
          type: 'array',
          items: {
            enum: [
              AccountRoles.ADMIN,
              AccountRoles.SUPERVISOR,
              AccountRoles.USER,
              AccountRoles.OPERATOR,
              AccountRoles.MODERATOR,
              AccountRoles.MANAGER,
              AccountRoles.MEMBER,
            ],
          },
          description: '가입자 종류 및 권한',
        },
      },
    },
  })
  public signUp(@Req() req: Request, @Body() signUpRequest: SignUpRequest): Observable<SignUpResponse> {
    return this.service.signUp(signUpRequest);
  }

  @Post('signin')
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({ summary: '로그인' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          description: '사용자 계정 (이메일주소)',
        },
        password: {
          type: 'string',
          description: '비밀번호',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: '로그인 성공',
    schema: {
      example: {
        result: 'ok',
        status: 200,
        message: 'OK',
        data: [
          {
            id: 1,
            email: 'email@4dreplay.com',
            name: '홍길동',
            nickname: '닉네임',
            pushreceive: true,
            emailreceive: true,
            token:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsIm5hbWUiOiLtlZzsmIHrr7wiLCJlbWFpbCI6Im9ueXhzYXJkQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwNTkwNTM1MywiZXhwIjoxNzM3NDQxMzUzfQ.1DHBsyj7EBH4O4WCbJBlaCf2K-cpoOkmlcsR8IUMHcI',
          },
        ],
      },
    },
  })
  public signIn(@Body() body: SignInRequest): Observable<SignInResponse> {
    return this.service.signIn(body);
  }

  @Post('validate')
  @ApiOperation({ summary: '사용자 확인' })
  @ApiBearerAuth()
  public validate(@Req() request: Request): Observable<ValidateResponse> {
    const { authorization }: any = request.headers;

    if (!authorization || authorization.trim() === '') {
      throw new UnauthorizedException('Please provide token');
    }

    const token: string = authorization.replace(/bearer/gim, '').trim();

    return this.service.validate({ token });
  }

  @ApiOperation({ summary: '내 정보 조회' })
    @ApiBearerAuth()
    @Get('/user/:id')
    @ApiParam({
      name: 'id',
      description: '사용자 ID',
      required: true,
      type: 'number',
    })
    public getUser(@Param() params: GetUserRequest): Observable<GetUserResponse> {
      return this.service.getUser(params);
    }

    @Delete('/user/:id')
    @ApiOperation({ summary: 'fdist 탈퇴' })
    @ApiBearerAuth()
    @ApiParam({
      name: 'id',
      description: '사용자 ID',
      required: true,
      type: 'number',
    })
    public leaveMember(@Param() params: LeaveMemberRequest): Observable<LeaveMemberResponse> {
      return this.service.leaveMember(params);
    }

    /*
    email 중복 체크
    * */
    @Get('/user/email/check')
    public CheckEmailDuplication(@Query('email') email: string): Observable<CheckEmailDuplicationResponse> {
      return this.service.checkEmailDuplication({ email });
    }

    @Get('/user/nickname/check')
    @ApiOperation({ summary: '닉네임 중복 체크' })
    @ApiQuery({
      name: 'nickname',
      description: '닉네임',
      required: true,
      type: 'string',
    })
    public checkNicknameDuplication(@Query('nickname') nickname: string): Observable<CheckNicknameDuplicationResponse> {
      return this.service.checkNicknameDuplication({ nickname });
    }

    @Get('/email')
    @ApiOperation({ summary: '이메일 인증' })
    @ApiQuery({
      name: 'token',
      description: '이메일 인증 토큰',
      required: true,
      type: 'string',
    })
    public verifyEmail(@Query('token') token: string): Observable<VerifyEmailResponse> {
      return this.service.verifyEmail({ token });
    }

    @Patch('/user/password/update')
    @ApiOperation({ summary: '비밀번호 변경' })
    @ApiBearerAuth()
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            description: '사용자 계정 (이메일주소)',
          },
          password: {
            type: 'string',
            description: '비밀번호',
          },
        },
      },
    })
    public updatePassword(@Body() body: UpdatePasswordRequest): Observable<UpdatePasswordResponse> {
      return this.service.updatePassword(body);
    }

    @Post('/user/password/email')
    @ApiOperation({ summary: '비밀번호 초기화를 위해서 이메일을 확인한다.' })
    @ApiConsumes('application/x-www-form-urlencoded')
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            description: '가입시 사용한 이메일주소',
          },
        },
      },
    })
    public findEmail(@Body() body: FindEmailRequest): Observable<FindEmailResponse> {
      return this.service.findEmail(body);
    }

    @Post('/user/password/reset')
    @ApiOperation({ summary: '비밀번호 초기화를 위해서 이메일과 인증코드를 확인한다.' })
    @ApiConsumes('application/x-www-form-urlencoded')
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            description: '가입시 사용한 이메일주소',
          },
          code: {
            type: 'string',
            description: '이메일로 전송된 인증코드',
          },
        },
      },
    })
    public FindPassword(@Body() body: FindPasswordRequest): Observable<FindPasswordResponse> {
      return this.service.findEmail(body);
    }

    @Post('/user/password/update')
    @ApiOperation({ summary: '토큰 없이 비밀번호 초기화' })
    @ApiConsumes('application/x-www-form-urlencoded')
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            description: '가입시 사용한 이메일주소',
          },
          password: {
            type: 'string',
            description: '이메일로 전송된 인증코드',
          },
        },
      },
    })
    public resetPassword(@Body() body: ResetPasswordRequest): Observable<ResetPasswordResponse> {
      return this.service.resetPassword(body);
    }

    @Patch('/user/:id/nickname')
    @ApiOperation({ summary: '닉네임 변경하기' })
    @ApiConsumes('application/x-www-form-urlencoded')
    @ApiParam({
      name: 'id',
      description: '사용자 ID',
      required: true,
      type: 'number',
    })
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          nickname: {
            type: 'string',
            description: '변경할 닉네임',
          },
        },
      },
    })
    public updateNickname(@Param('id') id: number, @Body('nickname') nickname: string): Observable<UpdateNicknameResponse> {
      const payload: UpdateNicknameRequest = { id, nickname };
      return this.service.updateNickname(payload);
    }

    @Patch('/user/:id/pushreceive')
    @ApiOperation({ summary: '푸쉬 수신 알림 변경하기' })
    @ApiConsumes('application/x-www-form-urlencoded')
    @ApiParam({
      name: 'id',
      description: '사용자 ID',
      required: true,
      type: 'number',
    })
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          pushreceive: {
            type: 'boolean',
            description: 'true || false',
          },
        },
      },
    })
    public updatePushReceive(
      @Param('id') id: number,
      @Body('pushreceive') pushreceive: boolean,
    ): Observable<UpdatePushReceiveResponse> {
      const payload: UpdatePushReceiveRequest = { id, pushreceive };
      return this.service.updatePushReceive(payload);
    }

    @Patch('/user/:id/emailreceive')
    @ApiOperation({ summary: '이메일 수신 여부 변경하기' })
    @ApiConsumes('application/x-www-form-urlencoded')
    @ApiParam({
      name: 'id',
      description: '사용자 ID',
      required: true,
      type: 'number',
    })
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          emailreceive: {
            type: 'boolean',
            description: 'true || false',
          },
        },
      },
    })
    public updateEmailReceive(
      @Param('id') id: number,
      @Body('emailreceive') emailreceive: boolean,
    ): Observable<UpdateEmailReceiveResponse> {
      const payload: UpdateEmailReceiveRequest = { id, emailreceive };
      return this.service.updateEmailReceive(payload);
    }
}
