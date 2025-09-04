import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../models/base_models.dart';
import '../api/auth_api.dart';

class AuthController extends GetxController {
  static AuthController get to => Get.find();
  
  final _storage = GetStorage();
  final _secureStorage = const FlutterSecureStorage();
  
  // Observable variables
  final _isLoading = false.obs;
  final _isAuthenticated = false.obs;
  final _currentUser = Rxn<User>();
  final _authToken = Rxn<String>();
  
  // Getters
  bool get isLoading => _isLoading.value;
  bool get isAuthenticated => _isAuthenticated.value;
  User? get currentUser => _currentUser.value;
  String? get authToken => _authToken.value;
  
  @override
  void onInit() {
    super.onInit();
    _initializeAuth();
  }
  
  void _initializeAuth() async {
    // Check if user is already logged in
    final token = await _secureStorage.read(key: 'auth_token');
    if (token != null) {
      _authToken.value = token;
      _isAuthenticated.value = true;
      _getCurrentUser();
    }
  }
  
  Future<void> _getCurrentUser() async {
    try {
      final response = await AuthApi.getCurrentUser();
      if (response.success && response.data != null) {
        _currentUser.value = response.data;
      } else {
        // Token might be invalid, clear it
        await logout();
      }
    } catch (e) {
      await logout();
    }
  }
  
  Future<bool> login({
    required String email,
    required String password,
  }) async {
    try {
      _isLoading.value = true;
      
      final response = await AuthApi.login(
        email: email,
        password: password,
      );
      
      if (response.success && response.data != null) {
        _authToken.value = response.data!.token;
        _currentUser.value = response.data!.user;
        _isAuthenticated.value = true;
        
        // Store token securely and user data in local storage
        await _secureStorage.write(key: 'auth_token', value: response.data!.token);
        await _storage.write('user_id', response.data!.user.id);
        await _storage.write('user_role', response.data!.user.role);
        
        Get.snackbar(
          'Success',
          'Login successful!',
          snackPosition: SnackPosition.TOP,
        );
        
        return true;
      } else {
        Get.snackbar(
          'Error',
          response.message,
          snackPosition: SnackPosition.TOP,
        );
        return false;
      }
    } catch (e) {
      Get.snackbar(
        'Error',
        'An unexpected error occurred',
        snackPosition: SnackPosition.TOP,
      );
      return false;
    } finally {
      _isLoading.value = false;
    }
  }
  
  Future<bool> register({
    required String name,
    required String email,
    required String password,
    required String passwordConfirmation,
    required String role,
  }) async {
    try {
      _isLoading.value = true;
      
      final response = await AuthApi.register(
        name: name,
        email: email,
        password: password,
        passwordConfirmation: passwordConfirmation,
        role: role,
      );
      
      if (response.success && response.data != null) {
        _authToken.value = response.data!.token;
        _currentUser.value = response.data!.user;
        _isAuthenticated.value = true;
        
        // Store token securely and user data in local storage
        await _secureStorage.write(key: 'auth_token', value: response.data!.token);
        await _storage.write('user_id', response.data!.user.id);
        await _storage.write('user_role', response.data!.user.role);
        
        Get.snackbar(
          'Success',
          'Registration successful!',
          snackPosition: SnackPosition.TOP,
        );
        
        return true;
      } else {
        Get.snackbar(
          'Error',
          response.message,
          snackPosition: SnackPosition.TOP,
        );
        return false;
      }
    } catch (e) {
      Get.snackbar(
        'Error',
        'An unexpected error occurred',
        snackPosition: SnackPosition.TOP,
      );
      return false;
    } finally {
      _isLoading.value = false;
    }
  }
  
  Future<void> logout() async {
    try {
      if (_authToken.value != null) {
        await AuthApi.logout();
      }
    } catch (e) {
      // Ignore logout errors
    } finally {
      // Clear all data
      _authToken.value = null;
      _currentUser.value = null;
      _isAuthenticated.value = false;
      
      // Clear secure storage and local storage
      await _secureStorage.delete(key: 'auth_token');
      await _storage.remove('user_id');
      await _storage.remove('user_role');
      
      // Navigate to login
      Get.offAllNamed('/login');
    }
  }
  
  void updateUser(User user) {
    _currentUser.value = user;
    _storage.write('user_id', user.id);
    _storage.write('user_role', user.role);
  }
  
  bool get isPatient => _currentUser.value?.role == 'patient';
  bool get isDoctor => _currentUser.value?.role == 'doctor';
  bool get isNutritionist => _currentUser.value?.role == 'nutritionist';
  bool get isCoach => _currentUser.value?.role == 'coach';
  bool get isAdmin => _currentUser.value?.role == 'admin';
  bool get isFamily => _currentUser.value?.role == 'family';
  
  String get userRole => _currentUser.value?.role ?? '';
  String get userName => _currentUser.value?.name ?? '';
  String get userEmail => _currentUser.value?.email ?? '';
  
  // Role-based navigation methods
  String get dashboardRoute {
    switch (userRole) {
      case 'patient':
        return '/patient/dashboard';
      case 'doctor':
        return '/doctor/dashboard';
      case 'nutritionist':
        return '/nutritionist/dashboard';
      case 'coach':
        return '/coach/dashboard';
      case 'admin':
        return '/admin/dashboard';
      case 'family':
        return '/family/dashboard';
      default:
        return '/login';
    }
  }
  
  void navigateToDashboard() {
    Get.offAllNamed(dashboardRoute);
  }
  
  bool hasRole(String role) {
    return userRole == role;
  }
  
  bool hasAnyRole(List<String> roles) {
    return roles.contains(userRole);
  }
}
