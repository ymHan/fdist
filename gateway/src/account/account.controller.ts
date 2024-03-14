import {
  MEMBER_SERVICE_NAME,
  MemberServiceClient,
  SignInRequest,
  SignInResponse, SignUpRequest, SignUpResponse, 
  AccountRoles,
} from '@4dist/sdk';
import { Body, Controller, Inject, Post, Get, Param, Query, Delete, Patch, Req, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

import { ApiTags, ApiParam, ApiOperation, ApiBody, ApiQuery, ApiBearerAuth, ApiCreatedResponse, ApiConsumes } from '@nestjs/swagger';

@ApiTags('Account')
@Controller('account')
export class MemberController implements OnModuleInit {
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
}