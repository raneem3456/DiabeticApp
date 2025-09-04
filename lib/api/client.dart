import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:get/get.dart';
import '../controllers/auth_controller.dart';

class ApiClient {
  static const String baseUrl = 'http://127.0.0.1:8000/api';
  static Dio? _dio;
  static const FlutterSecureStorage _secureStorage = FlutterSecureStorage();

  static Dio get dio {
    _dio ??= _createDio();
    return _dio!;
  }

  static Dio _createDio() {
    final dio = Dio(
      BaseOptions(
        baseUrl: baseUrl,
        connectTimeout: const Duration(seconds: 30),
        receiveTimeout: const Duration(seconds: 30),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    // Add interceptors
    dio.interceptors.addAll([
      _AuthInterceptor(),
      _LoggingInterceptor(),
      _ErrorInterceptor(),
    ]);

    return dio;
  }

  static Future<void> updateToken(String? token) async {
    if (token != null) {
      await _secureStorage.write(key: 'auth_token', value: token);
    } else {
      await _secureStorage.delete(key: 'auth_token');
    }
  }

  static Future<String?> get token async => await _secureStorage.read(key: 'auth_token');
}

class _AuthInterceptor extends Interceptor {
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) async {
    final token = await ApiClient.token;
    if (token != null && token.isNotEmpty) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  }
}

class _LoggingInterceptor extends Interceptor {
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    print('🌐 API Request: ${options.method} ${options.path}');
    print('📝 Headers: ${options.headers}');
    if (options.data != null) {
      print('📦 Data: ${options.data}');
    }
    handler.next(options);
  }

  @override
  void onResponse(dio.Response response, ResponseInterceptorHandler handler) {
    print('✅ API Response: ${response.statusCode} ${response.requestOptions.path}');
    print('📊 Data: ${response.data}');
    handler.next(response);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    print('❌ API Error: ${err.response?.statusCode} ${err.requestOptions.path}');
    print('💬 Message: ${err.message}');
    print('📊 Response: ${err.response?.data}');
    handler.next(err);
  }
}

class _ErrorInterceptor extends Interceptor {
  @override
  void onError(DioException err, ErrorInterceptorHandler handler) async {
    if (err.response?.statusCode == 401) {
      // Token expired or invalid, clear storage and logout
      await ApiClient.updateToken(null);
      
      // Get AuthController and logout
      try {
        final authController = Get.find<AuthController>();
        await authController.logout();
      } catch (e) {
        // AuthController not found, navigate to login directly
        Get.offAllNamed('/login');
      }
    }
    handler.next(err);
  }
}
