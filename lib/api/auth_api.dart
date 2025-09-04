import 'package:dio/dio.dart';
import '../models/base_models.dart';
import 'client.dart';

class AuthApi {
  static final Dio _dio = ApiClient.dio;

  // Register new user
  static Future<ApiResponse<AuthResponse>> register({
    required String name,
    required String email,
    required String password,
    required String passwordConfirmation,
    required String role,
  }) async {
    try {
      final response = await _dio.post('/register', data: {
        'name': name,
        'email': email,
        'password': password,
        'password_confirmation': passwordConfirmation,
        'role': role,
      });

      if (response.statusCode == 201) {
        final authResponse = AuthResponse.fromJson(response.data);
        await ApiClient.updateToken(authResponse.token);
        return ApiResponse<AuthResponse>(
          success: true,
          message: 'Registration successful',
          data: authResponse,
        );
      } else {
        return ApiResponse<AuthResponse>.error(
          response.data['message'] ?? 'Registration failed',
          response.data['errors'],
        );
      }
    } on DioException catch (e) {
      if (e.response?.data != null) {
        return ApiResponse<AuthResponse>.error(
          e.response!.data['message'] ?? 'Registration failed',
          e.response!.data['errors'],
        );
      }
      return ApiResponse<AuthResponse>.error(
        e.message ?? 'Network error occurred',
      );
    } catch (e) {
      return ApiResponse<AuthResponse>.error(
        'An unexpected error occurred',
      );
    }
  }

  // Login user
  static Future<ApiResponse<AuthResponse>> login({
    required String email,
    required String password,
  }) async {
    try {
      final response = await _dio.post('/login', data: {
        'email': email,
        'password': password,
      });

      if (response.statusCode == 200) {
        final authResponse = AuthResponse.fromJson(response.data);
        await ApiClient.updateToken(authResponse.token);
        return ApiResponse<AuthResponse>(
          success: true,
          message: 'Login successful',
          data: authResponse,
        );
      } else {
        return ApiResponse<AuthResponse>.error(
          response.data['message'] ?? 'Login failed',
          response.data['errors'],
        );
      }
    } on DioException catch (e) {
      if (e.response?.data != null) {
        return ApiResponse<AuthResponse>.error(
          e.response!.data['message'] ?? 'Login failed',
          e.response!.data['errors'],
        );
      }
      return ApiResponse<AuthResponse>.error(
        e.message ?? 'Network error occurred',
      );
    } catch (e) {
      return ApiResponse<AuthResponse>.error(
        'An unexpected error occurred',
      );
    }
  }

  // Get current user
  static Future<ApiResponse<User>> getCurrentUser() async {
    try {
      final response = await _dio.get('/me');

      if (response.statusCode == 200) {
        final user = User.fromJson(response.data['data']);
        return ApiResponse<User>(
          success: true,
          message: 'User retrieved successfully',
          data: user,
        );
      } else {
        return ApiResponse<User>.error(
          response.data['message'] ?? 'Failed to get user',
        );
      }
    } on DioException catch (e) {
      if (e.response?.data != null) {
        return ApiResponse<User>.error(
          e.response!.data['message'] ?? 'Failed to get user',
        );
      }
      return ApiResponse<User>.error(
        e.message ?? 'Network error occurred',
      );
    } catch (e) {
      return ApiResponse<User>.error(
        'An unexpected error occurred',
      );
    }
  }

  // Logout user
  static Future<ApiResponse<void>> logout() async {
    try {
      final response = await _dio.post('/logout');

      if (response.statusCode == 200) {
        await ApiClient.updateToken(null);
        return ApiResponse<void>(
          success: true,
          message: 'Logout successful',
        );
      } else {
        return ApiResponse<void>.error(
          response.data['message'] ?? 'Logout failed',
        );
      }
    } on DioException catch (e) {
      if (e.response?.data != null) {
        return ApiResponse<void>.error(
          e.response!.data['message'] ?? 'Logout failed',
        );
      }
      return ApiResponse<void>.error(
        e.message ?? 'Network error occurred',
      );
    } catch (e) {
      return ApiResponse<void>.error(
        'An unexpected error occurred',
      );
    }
  }

  // Refresh token (if implemented in your API)
  static Future<ApiResponse<AuthResponse>> refreshToken() async {
    try {
      final response = await _dio.post('/refresh');

      if (response.statusCode == 200) {
        final authResponse = AuthResponse.fromJson(response.data);
        await ApiClient.updateToken(authResponse.token);
        return ApiResponse<AuthResponse>(
          success: true,
          message: 'Token refreshed successfully',
          data: authResponse,
        );
      } else {
        return ApiResponse<AuthResponse>.error(
          response.data['message'] ?? 'Token refresh failed',
        );
      }
    } on DioException catch (e) {
      if (e.response?.data != null) {
        return ApiResponse<AuthResponse>.error(
          e.response!.data['message'] ?? 'Token refresh failed',
        );
      }
      return ApiResponse<AuthResponse>.error(
        e.message ?? 'Network error occurred',
      );
    } catch (e) {
      return ApiResponse<AuthResponse>.error(
        'An unexpected error occurred',
      );
    }
  }
}
