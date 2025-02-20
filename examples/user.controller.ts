import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody, ApiBearerAuth, ApiExtraModels } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { CreateUserDto, UpdateUserDto, UserResponseDto, UsersPageResponseDto, ErrorResponseDto } from "./dto";
import { JwtAuthGuard } from "../auth/guards";

@ApiTags("Users")
@Controller("users")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiExtraModels(CreateUserDto, UpdateUserDto, UserResponseDto, UsersPageResponseDto, ErrorResponseDto)
export class UserController {
      constructor(private readonly userService: UserService) {}

      @Get()
      @ApiOperation({
            summary: "Get paginated list of users",
            description: "Returns a paginated list of users with optional filtering and sorting",
      })
      @ApiQuery({
            name: "page",
            required: false,
            type: Number,
            description: "Page number (default: 1)",
            example: 1,
      })
      @ApiQuery({
            name: "limit",
            required: false,
            type: Number,
            description: "Items per page (default: 10)",
            example: 10,
      })
      @ApiQuery({
            name: "search",
            required: false,
            type: String,
            description: "Search term for filtering users",
            example: "john",
      })
      @ApiResponse({
            status: HttpStatus.OK,
            description: "Successfully retrieved users list",
            type: UsersPageResponseDto,
      })
      @ApiResponse({
            status: HttpStatus.UNAUTHORIZED,
            description: "Unauthorized access",
            type: ErrorResponseDto,
      })
      @ApiResponse({
            status: HttpStatus.BAD_REQUEST,
            description: "Invalid query parameters",
            type: ErrorResponseDto,
      })
      async getUsers(@Query("page") page: number = 1, @Query("limit") limit: number = 10, @Query("search") search?: string): Promise<UsersPageResponseDto> {
            return this.userService.findAll({ page, limit, search });
      }

      @Get(":id")
      @ApiOperation({
            summary: "Get user by ID",
            description: "Returns a single user by their unique identifier",
      })
      @ApiParam({
            name: "id",
            required: true,
            description: "Unique identifier of the user",
            schema: { type: "string" },
            example: "507f1f77bcf86cd799439011",
      })
      @ApiResponse({
            status: HttpStatus.OK,
            description: "User found successfully",
            type: UserResponseDto,
      })
      @ApiResponse({
            status: HttpStatus.NOT_FOUND,
            description: "User not found",
            type: ErrorResponseDto,
      })
      @ApiResponse({
            status: HttpStatus.UNAUTHORIZED,
            description: "Unauthorized access",
            type: ErrorResponseDto,
      })
      async getUserById(@Param("id") id: string): Promise<UserResponseDto> {
            return this.userService.findById(id);
      }

      @Post()
      @ApiOperation({
            summary: "Create new user",
            description: "Creates a new user account with provided data",
      })
      @ApiBody({
            type: CreateUserDto,
            description: "User creation data",
            examples: {
                  default: {
                        value: {
                              email: "john@example.com",
                              password: "strongPassword123",
                              firstName: "John",
                              lastName: "Doe",
                              role: "user",
                        },
                        summary: "Default example",
                  },
                  admin: {
                        value: {
                              email: "admin@example.com",
                              password: "adminPassword123",
                              firstName: "Admin",
                              lastName: "User",
                              role: "admin",
                        },
                        summary: "Admin user example",
                  },
            },
      })
      @ApiResponse({
            status: HttpStatus.CREATED,
            description: "User successfully created",
            type: UserResponseDto,
      })
      @ApiResponse({
            status: HttpStatus.BAD_REQUEST,
            description: "Invalid input data",
            type: ErrorResponseDto,
      })
      @ApiResponse({
            status: HttpStatus.CONFLICT,
            description: "Email already exists",
            type: ErrorResponseDto,
      })
      @ApiResponse({
            status: HttpStatus.UNAUTHORIZED,
            description: "Unauthorized access",
            type: ErrorResponseDto,
      })
      async createUser(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
            return this.userService.create(createUserDto);
      }

      @Put(":id")
      @ApiOperation({
            summary: "Update existing user",
            description: "Updates user data by their unique identifier",
      })
      @ApiParam({
            name: "id",
            required: true,
            description: "Unique identifier of the user",
            schema: { type: "string" },
            example: "507f1f77bcf86cd799439011",
      })
      @ApiBody({
            type: UpdateUserDto,
            description: "User update data",
            examples: {
                  default: {
                        value: {
                              firstName: "Updated Name",
                              lastName: "Updated Last Name",
                        },
                        summary: "Basic update",
                  },
                  roleUpdate: {
                        value: {
                              role: "admin",
                        },
                        summary: "Role update",
                  },
            },
      })
      @ApiResponse({
            status: HttpStatus.OK,
            description: "User successfully updated",
            type: UserResponseDto,
      })
      @ApiResponse({
            status: HttpStatus.NOT_FOUND,
            description: "User not found",
            type: ErrorResponseDto,
      })
      @ApiResponse({
            status: HttpStatus.BAD_REQUEST,
            description: "Invalid input data",
            type: ErrorResponseDto,
      })
      @ApiResponse({
            status: HttpStatus.UNAUTHORIZED,
            description: "Unauthorized access",
            type: ErrorResponseDto,
      })
      async updateUser(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
            return this.userService.update(id, updateUserDto);
      }

      @Delete(":id")
      @ApiOperation({
            summary: "Delete user",
            description: "Deletes user by their unique identifier",
      })
      @ApiParam({
            name: "id",
            required: true,
            description: "Unique identifier of the user",
            schema: { type: "string" },
            example: "507f1f77bcf86cd799439011",
      })
      @ApiResponse({
            status: HttpStatus.OK,
            description: "User successfully deleted",
            type: UserResponseDto,
      })
      @ApiResponse({
            status: HttpStatus.NOT_FOUND,
            description: "User not found",
            type: ErrorResponseDto,
      })
      @ApiResponse({
            status: HttpStatus.UNAUTHORIZED,
            description: "Unauthorized access",
            type: ErrorResponseDto,
      })
      async deleteUser(@Param("id") id: string): Promise<UserResponseDto> {
            return this.userService.delete(id);
      }
}
