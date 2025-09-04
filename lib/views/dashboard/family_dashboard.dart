import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../controllers/auth_controller.dart';
import '../../themes/app_theme.dart';

class FamilyDashboard extends StatelessWidget {
  const FamilyDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    final authController = Get.find<AuthController>();
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Family Dashboard'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.family_restroom,
              size: 80,
              color: AppTheme.familyColor,
            ),
            const SizedBox(height: 24),
            Text(
              'Family Dashboard',
              style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                color: AppTheme.familyColor,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            Text(
              'Welcome, ${authController.userName}',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 24),
            const Text(
              'This dashboard will include:\n• Loved One Monitoring\n• Health Alerts\n• Care Coordination\n• Family Communication\n• Support Resources',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 16),
            ),
          ],
        ),
      ),
    );
  }
}
