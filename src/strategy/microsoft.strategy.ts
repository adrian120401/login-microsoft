import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-microsoft';

@Injectable()
export class MicrosoftStrategy extends PassportStrategy(Strategy, 'microsoft'){
    constructor(private configService: ConfigService){
        super({
            clientID: configService.get('AZURE_AD_CLIENT_ID'),
            clientSecret: configService.get('AZURE_AD_CLIENT_SECRET'),
            callbackURL: 'http://localhost:3000/auth/microsoft/callback',
            scope: ['user.read']
        })
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    async validate(accessToken: string, refreshToken: string, profile: any, done: Function){
        const { displayName, userPrincipalName } = profile;
        const user = {
            name: displayName,
            email: userPrincipalName,
            accessToken
        }
        done(null, user);
    }
}