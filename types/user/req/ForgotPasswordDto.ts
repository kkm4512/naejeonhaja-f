export interface SendVerificationCodeDto {
    email: string; // 이메일 주소
}

export interface VerificationCodeDto {
    email: string; // 이메일 주소
    code: string;
}

export interface UpdatePasswordDto {
    email: string; // 이메일 주소
    password: string;    
}