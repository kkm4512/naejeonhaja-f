import type { UserDto } from "../user/req/User";

// 태그 DTO (TagDto)
export interface TagDto {
    id: number;
    tag: TagType;
  }

// 문의 응답 DTO (InquiryResponseDto)
export interface InquiryRequestDto {
    title: string;
    content: string;
    tags: TagType[];
  }
  
  // 문의 응답 DTO (InquiryResponseDto)
  export interface InquiryResponseDto {
    id: number;
    title: string;
    content: string;
    tags: TagDto[];
    createdAt: string; // ISO 8601 날짜 문자열
    updatedAt: string; // ISO 8601 날짜 문자열
    userDto: UserDto;
  }
  
// 태그 타입 Enum (TagType)
export enum TagType {
    MATCHING_ISSUE = "MATCHING_ISSUE",
    TEAM_COMPOSITION = "TEAM_COMPOSITION",
    ETC = "ETC",
    BUG = "BUG",
    FEATURE_REQUEST = "FEATURE_REQUEST"
  }
  