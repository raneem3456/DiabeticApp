import 'package:get/get.dart';
import 'package:flutter/material.dart';
import '../controllers/auth_controller.dart';

class AuthMiddleware extends GetMiddleware {
  final List<String>? allowedRoles;
  final bool requireAuth;

  AuthMiddleware({
    this.allowedRoles,
    this.requireAuth = true,
  });

  @override
  int? get priority => 1;

  @override
  RouteSettings? redirect(String? route) {
    final authController = AuthController.to;

    // If authentication is not required, allow access
    if (!requireAuth) {
      return null;
    }

    // Check if user is authenticated
    if (!authController.isAuthenticated) {
      return const RouteSettings(name: '/login');
    }

    // If no specific roles are required, allow access
    if (allowedRoles == null || allowedRoles!.isEmpty) {
      return null;
    }

    // Check if user has required role
    if (!authController.hasAnyRole(allowedRoles!)) {
      // Redirect to user's dashboard if they don't have permission
      Get.snackbar(
        'Access Denied',
        'You do not have permission to access this page.',
        snackPosition: SnackPosition.TOP,
      );
      return RouteSettings(name: authController.dashboardRoute);
    }

    return null;
  }
}

// Convenience middleware classes for specific roles
class PatientMiddleware extends AuthMiddleware {
  PatientMiddleware() : super(allowedRoles: ['patient']);
}

class DoctorMiddleware extends AuthMiddleware {
  DoctorMiddleware() : super(allowedRoles: ['doctor']);
}

class NutritionistMiddleware extends AuthMiddleware {
  NutritionistMiddleware() : super(allowedRoles: ['nutritionist']);
}

class CoachMiddleware extends AuthMiddleware {
  CoachMiddleware() : super(allowedRoles: ['coach']);
}

class AdminMiddleware extends AuthMiddleware {
  AdminMiddleware() : super(allowedRoles: ['admin']);
}

class FamilyMiddleware extends AuthMiddleware {
  FamilyMiddleware() : super(allowedRoles: ['family']);
}

class HealthcareProviderMiddleware extends AuthMiddleware {
  HealthcareProviderMiddleware() : super(allowedRoles: ['doctor', 'nutritionist', 'coach']);
}

class AuthenticatedMiddleware extends AuthMiddleware {
  AuthenticatedMiddleware() : super(requireAuth: true);
}

class GuestMiddleware extends AuthMiddleware {
  GuestMiddleware() : super(requireAuth: false);
}
