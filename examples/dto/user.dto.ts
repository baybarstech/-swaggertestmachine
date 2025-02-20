import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsString, IsEnum, MinLength, IsOptional } from "class-validator";

export enum UserRole {
      ADMIN = "admin",
      USER = "user",
}

export class CreateUserDto {
      @ApiProperty({
            description: "User email address",
            example: "john@example.com",
      })
      @IsEmail()
      email: string;

      @ApiProperty({
            description: "User password",
            example: "strongPassword123",
            minLength: 8,
      })
      @IsString()
      @MinLength(8)
      password: string;

      @ApiProperty({
            description: "User first name",
            example: "John",
      })
      @IsString()
      firstName: string;

      @ApiProperty({
            description: "User last name",
            example: "Doe",
      })
      @IsString()
      lastName: string;

      @ApiProperty({
            description: "User role",
            enum: UserRole,
            example: UserRole.USER,
      })
      @IsEnum(UserRole)
      role: UserRole;
}

export class UpdateUserDto {
      @ApiPropertyOptional({
            description: "User first name",
            example: "John",
      })
      @IsString()
      @IsOptional()
      firstName?: string;

      @ApiPropertyOptional({
            description: "User last name",
            example: "Doe",
      })
      @IsString()
      @IsOptional()
      lastName?: string;

      @ApiPropertyOptional({
            description: "User role",
            enum: UserRole,
            example: UserRole.USER,
      })
      @IsEnum(UserRole)
      @IsOptional()
      role?: UserRole;
}

export class UserResponseDto {
      @ApiProperty({
            description: "Unique identifier",
            example: "507f1f77bcf86cd799439011",
      })
      id: string;

      @ApiProperty({
            description: "User email address",
            example: "john@example.com",
      })
      email: string;

      @ApiProperty({
            description: "User first name",
            example: "John",
      })
      firstName: string;

      @ApiProperty({
            description: "User last name",
            example: "Doe",
      })
      lastName: string;

      @ApiProperty({
            description: "User role",
            enum: UserRole,
            example: UserRole.USER,
      })
      role: UserRole;

      @ApiProperty({
            description: "Account creation date",
            example: "2024-02-21T12:00:00Z",
      })
      createdAt: Date;

      @ApiProperty({
            description: "Last update date",
            example: "2024-02-21T12:00:00Z",
      })
      updatedAt: Date;
}

export class UsersPageResponseDto {
      @ApiProperty({
            description: "Array of users",
            type: [UserResponseDto],
      })
      items: UserResponseDto[];

      @ApiProperty({
            description: "Total number of items",
            example: 100,
      })
      total: number;

      @ApiProperty({
            description: "Current page number",
            example: 1,
      })
      page: number;

      @ApiProperty({
            description: "Number of items per page",
            example: 10,
      })
      limit: number;

      @ApiProperty({
            description: "Total number of pages",
            example: 10,
      })
      totalPages: number;
}

export class ErrorResponseDto {
      @ApiProperty({
            description: "Error status code",
            example: 400,
      })
      statusCode: number;

      @ApiProperty({
            description: "Error message",
            example: "Bad Request",
      })
      message: string;

      @ApiProperty({
            description: "Error details",
            example: "Validation failed",
      })
      error: string;
}
