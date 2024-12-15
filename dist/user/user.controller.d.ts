import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getUserProfile(req: any): Promise<{
        email: string;
        nickname: string;
        profileImage: string;
    }>;
    updateNickname(req: any, nickname: string): Promise<{
        message: string;
        user: {
            id: number;
            nickname: string;
            profileImage: string;
        };
    }>;
    updateProfileImage(req: any, file: Express.Multer.File): Promise<{
        message: string;
        user: {
            id: number;
            nickname: string;
            profileImage: string;
        };
    }>;
    deleteUser(req: any): Promise<{
        message: string;
    }>;
}
